# string ライブラリについて

`@import string` を記述することで、文字列に関す関数を利用することができます。

## 関数群

### strstr, strchr

```ts
function strstr(s: string, t:string): number;
function strchr(s: string, t:string): number;
```

文字列 `s` に初めて文字列 `t` が現れるオフセットを返却します。
見つからない場合は `-1` を返却します。


### strlen

```ts
function strlen(s: string): number;
```

文字列 `s` の長さを返します。
