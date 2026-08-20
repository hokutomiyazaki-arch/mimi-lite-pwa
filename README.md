# みみトーン（mimi-lite-pwa）

耳鳴りと同じ高さの音を**左右別々に**出して、**止めた直後**の変化と、元の大きさに戻るまでの秒数を記録するLite PWA。

- 公開URL：https://hokutomiyazaki-arch.github.io/mimi-lite-pwa/
- 配布：LINE公式アカウントで「みみ」と送ると届く（配布開始は人間ゲート）
- 制作：Functional Neuro Training／工房＝`pwa-factory`

## これは治療ではありません
音を聞かせたあとに小さくなるのは、多くの場合その場かぎりです。戻ってくるのが普通です。
「大きい音のほうが効く」は間違いなので、音量の上限はコード側で超えられないようにしてあります。

## 構成
`index.html` / `manifest.json` / `sw.js` / `icons/`

## デプロイのたびに必ず
- `sw.js` の `CACHE_NAME` を上げる（例：`mimi-v1.0.0` → `mimi-v1.0.1`）
- `index.html` の `CONFIG.version` / `CONFIG.cacheName` も同じ値に揃える

## 公開設定
Settings → Pages → Source: `main` / `/ (root)`
