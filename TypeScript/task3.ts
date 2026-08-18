type Parse<
  T extends string,
  Acc extends Record<string, string> = {},
> = T extends `${infer _}.${infer __}/${infer Params}`
  ? Params extends `${infer Key}=${infer Value}&${infer Rest}`
    ? Parse<Rest, Acc & Record<Key, Value>>
    : Params extends `${infer Key}=${infer Value}`
      ? Acc & Record<Key, Value>
      : Acc
  : T extends `${infer Key}=${infer Value}&${infer Rest}`
    ? Parse<Rest, Acc & Record<Key, Value>>
    : T extends `${infer Key}=${infer Value}`
      ? Acc & Record<Key, Value>
      : Acc;

let parsedString: Parse<"https://salut.com/name=denis&age=20&ocup=programator&name=denis&boss=">;
let parsed: Parse<"name=denis&value=12&age=20">;
