type SnakeCase<T extends string> = T extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${SnakeCase<Rest>}`
    : `_${Lowercase<First>}${SnakeCase<Rest>}`
  : "";

/*

Deci, sa explic clar
avem asa:
T extends string, care ne spune clar, ca trebuie sa ii oferim un string,
in caz contrar va fi eroare, deoarece nu satisface string;

Dupa care mergem la T extends `${infer First}${infer Rest}`
Aceasta conditie mereu va fi adevarata daca e string, deci in acest caz
`${infer First}${infer Rest}` incearca sa faca un pattern matching
Adica pur si simplu o sa preia primul caracter in type First
si in Rest, restul caracterelor.

Astfel, dupa cum am spus, daca e string, automat merge la cazul bun ?
Primul caz va fi:
First extends LowerCase<First> 
Asta verifica daca acesta este Lowercase, daca e, automat se duce la primul ?
Deci pune in rezultat prima litera si dupa care face recursiv SnakeCase<rest>

Pentru un test vom lua aS
SnakeCase<"aS"> 
Se deduce clar direct ca T = "aS";
mergem la next si ajungem ca First = "a", iar Rest = "S";
"a" extends Lowercase<"a"> -> true
Automat rezultatul pana la moment va fi: 
`a${SnakeCase<"S">}`
Se rezolva SnakeCase<"S">
Vedem ca e string si automat First -> "S", Rest -> "";
"S" extends Lowercase<"S"> -> false
automat 
la rezultat va fi
`a_s`

*/

let type: SnakeCase<string>;

/*
Exercitii noi:
-> Creaza un type care sterge primul cuvant dintr-un string;
-> Type care ofera ultimul cuvant din string
-> Count care numara cuvintele dintr-un string
-> Type care verifica palindrome
-> Array care face string array -> string
-> Array care sterge Duplicates
*/

type snakeCase<
  T extends string,
  First extends boolean = true,
> = T extends `${infer F}${infer R}`
  ? F extends Uppercase<F>
    ? First extends true
      ? `${Lowercase<F>}${snakeCase<R, false>}`
      : `_${Lowercase<F>}${snakeCase<R, false>}`
    : `${F}${snakeCase<R, false>}`
  : "";

let str: snakeCase<"salutPrieteniDragi">;
let get: snakeCase<"getElementById">;
let ex: snakeCase<"BunaSeara">;
