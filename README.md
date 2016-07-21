スキル可視化（Web）
===============

## Overview（概要）
スキル可視化のWeb画面

仕様等は[こちら](/gitbucket/2917/skill-spec)を参照

## Requirements（使用条件）
- [Node.js](https://nodejs.org/)
- [bower](https://bower.io/)
- [grunt](http://gruntjs.com/)

## Run（動かし方）
1. Node.js のインストール  
   [この辺](http://qiita.com/krtbk1d/items/9001ae194571feb63a5e)を参考にインストール
2. proxy の設定  
```
npm config set proxy {server}:{port}
npm config set https-proxy {server}:{port}
```

2. bower、grunt のインストール
```
npm -g install bower grunt-cli
```

3. 実行
```
grunt serve
```
自動的にブラウザが立ち上がり表示される
