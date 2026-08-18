// ex 1
type takeFirstCharacter<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${First}` : never;

let firstChar: takeFirstCharacter<"ssd">;

// ex 2
type takeEverythingBesidesFirst<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Rest}` : never;

let restOfString: takeEverythingBesidesFirst<"super">;

// ex 3
type reverseString<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${reverseString<Rest>}${First}`
  : "";

let reversed: reverseString<"salut">;

// ex 4
type LastCharacter<T extends string> = T extends `${infer First}${infer Rest}`
  ? Rest extends ""
    ? First
    : LastCharacter<Rest>
  : "";

let lastChar2: LastCharacter<"asd">;

// ex 5
type removeUppercaseLetters<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
      ? removeUppercaseLetters<Rest>
      : `${First}${removeUppercaseLetters<Rest>}`
    : "";

let removedUpper: removeUppercaseLetters<"SsalutTareE">;

// ex 6
type replaceUpperCaseWithUnderscore<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
      ? `_${Lowercase<First>}${replaceUpperCaseWithUnderscore<Rest>}`
      : `${First}${replaceUpperCaseWithUnderscore<Rest>}`
    : "";

let replaced: replaceUpperCaseWithUnderscore<"bunaSearaPrieteni">;

// ex 7 -> taie stringul la primul uppercase
type cutFirstUpperCase<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
      ? ""
      : `${First}${cutFirstUpperCase<Rest>}`
    : "";

let cutted: cutFirstUpperCase<"salutPrieteniDragi">;

// ex 8 -> numara caractere;
type countChars<
  T extends string,
  Acc extends unknown[] = [],
> = T extends `${infer First}${infer Rest}`
  ? countChars<Rest, [...Acc, First]>
  : Acc["length"];

let counted: countChars<"a4asdsd">;

// ex 9 - type care inverseaza Array;
type reverseArray<T extends unknown[]> = T extends [infer First, ...infer Last]
  ? [...reverseArray<Last>, First]
  : [];

let reversedArray: reverseArray<[1, 2, 3]>;

/*
-> Creează un type care ia primul caracter din string:
-> Creează un type care ia tot în afară de primul caracter:
-> Fă un type care inversează stringul:
-> Fa un type care scoate ultimul caracter dintr-un string;
-> Creează un type care elimină literele mari:
-> Replace uppercase with underscore + lowercase (simplificat SnakeCase)
-> Fă type care taie la primul uppercase:
-> 🔴 EX 7 — Count characters (recursiv)
-> type care inverseaza array
*/

// ex 1
type deleteFirstWord<T extends string> = T extends `${infer First}${infer Rest}`
  ? First extends " "
    ? Rest
    : deleteFirstWord<Rest>
  : "";

let deletedFirst: deleteFirstWord<"salutare prieteni dragi">;

// ex 2
type lastWord<
  T extends string,
  Acc extends string = "",
> = T extends `${infer First}${infer Rest}`
  ? First extends " "
    ? lastWord<Rest, "">
    : lastWord<Rest, `${Acc}${First}`>
  : Acc;

type lastWord2<T extends string> = T extends `${infer First} ${infer Rest}`
  ? lastWord2<Rest>
  : T;

let lastword: lastWord<"salut prieteni dragi">;

// ex 3 - count care numara cuvintele dintr-un string;
type countWords<
  T extends string,
  Acc extends unknown[] = [],
> = T extends `${infer First} ${infer Rest}`
  ? countWords<Rest, [...Acc, First]>
  : [...Acc, T]["length"];

let countedWords: countWords<"salutare si bine v-am gasit prieteni">;

// ex 4 - din array de string se face string
type Join<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${First}${Join<Rest>}`
  : "";

// ex 5 - elimina toate spatiile dintr-un string
type RemoveSpaces<T extends string> = T extends `${infer F}${infer Rest}`
  ? F extends " "
    ? RemoveSpaces<Rest>
    : `${F}${RemoveSpaces<Rest>}`
  : "";

let removedSpaces: RemoveSpaces<"s a l u t">;

// ex 6 - numara cate caractere mari sunt
type CountUpperCase<
  T extends string,
  Acc extends unknown[] = [],
> = T extends `${infer F}${infer Rest}`
  ? F extends Uppercase<F>
    ? CountUpperCase<Rest, [...Acc, F]>
    : CountUpperCase<Rest, [...Acc]>
  : Acc["length"];

let countedUpperCase: CountUpperCase<"SaLuTaRe">;

// ex 7 - dubleaza caracterele
type DuplicateCharacters<T extends string> = T extends `${infer F}${infer Rest}`
  ? `${F}${F}${DuplicateCharacters<Rest>}`
  : "";

let duplicatedCharacters: DuplicateCharacters<"abc">;

// ex 8 - inlocuieste aparitiile unui caracter
type ReplaceAll<
  T extends string,
  Search extends string,
  Replace extends string,
> = T extends `${infer F}${infer Rest}`
  ? F extends Search
    ? `${Replace}${ReplaceAll<Rest, Search, Replace>}`
    : `${F}${ReplaceAll<Rest, Search, Replace>}`
  : "";

let replacedAll: ReplaceAll<"banana", "a", "_">;

// ex 9 - returneaza al n-lea caracter
type CharAt<
  T extends string,
  N extends number,
  Acc extends unknown[] = [],
> = T extends `${infer F}${infer Rest}`
  ? Acc["length"] extends N
    ? F
    : CharAt<Rest, N, [...Acc, F]>
  : never;

let charAt: CharAt<"typescript", 4>;

type Reverse<T extends string> = T extends `${infer F}${infer R}`
  ? `${Reverse<R>}${F}`
  : "";

type IsPalindrome<T extends string> = T extends Reverse<T> ? true : false;

let isPalindrome: IsPalindrome<"level">;

type LastElementArray<T extends unknown[]> = T extends [infer F, ...infer Rest]
  ? Rest["length"] extends 0
    ? F
    : LastElementArray<Rest>
  : never;

type LastElementArray2<T extends unknown[]> = T extends [...infer _, infer Last]
  ? Last
  : never;

let lastElementArray: LastElementArray<[1, 2, 3, 4, 1]>;
