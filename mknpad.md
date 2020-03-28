# MKNPAD

## const
- `version: '0.5.0.0`
- `versionString: 'PAD Editor β Eryngii 0.0'`
- `internalName: 'MKNPAD.Eryngii.0.5'`
- `mknpadFileExtension: '.mknpad'`
- `mknpadFileType: 'application/x.mknpad+json'`

## var
- `mknpadEnabled: boolean` : `mknpad` 有効な時に `true`

## dev
- `err: HTMLElement` : 標準エラー出力エレメント
- `out: HTMLElement` : 標準出力エレメント
- `pad: HTMLElement` : PAD が配置されるエレメント

## io
- `print(dev: HTMLElement, str: string): void` : テキストの書き込み
- `scan(dev: HTMLElement): string` : テキストの読み出し
- `clear(dev: HTMLElement): void` : テキストのクリア
- `write(dev: HTMLElement, base64: string): void` : Base64 で innerHTML の上書き
- `read(dev: HTMLElement): string` : innerHTML を Base64 で読み出し

## api
- `abort(str: string)` : 異常終了
- `printErr(str: string)` : 標準エラーに書き込み
- `printOut(str: string)` : 標準出力に書き込み
- `padData()` : PAD のデータ読み取り
- `writePad(base64: string)` : PAD の書き込み

## init
- `dev()` : `mknpad.dev` の初期化

## system
### file
- `savePad(): boolean` : PAD のファイル出力
- `loadPad()` : PAD のファイルからの読み込み

## boot()
