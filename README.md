スキル可視化（Web）
===============

## Overview（概要）
スキル可視化のWeb画面

仕様等は[こちら](/gitbucket/2917/skill-spec)を参照

## Demo（デモ）
[デモサイト](http://172.16.9.99/)

## Requirements（使用条件）
- [Google Chrome](https://www.google.co.jp/chrome/)
  - IEだと画面が崩れる可能性があります
  - FireFox、Safari 等 他のブラウザは動作未確認
- [Node.js](https://nodejs.org/)
- [bower](https://bower.io/)
- [grunt](http://gruntjs.com/)

## Install（インストール方法）
1. Node.js のインストール  
   [この辺](http://qiita.com/krtbk1d/items/9001ae194571feb63a5e)を参考にインストール
2. proxy の設定  
```
npm config set proxy http://{server}:{port}
npm config set https-proxy http://{server}:{port}
```

3. bower、grunt のインストール
```
npm -g install bower grunt-cli
```

## Run（動かし方）
1. 必要なライブラリのダウンロード
```
npm install & bower install
```
2. 実行
```
grunt serve
```
自動的にブラウザが立ち上がり表示される
