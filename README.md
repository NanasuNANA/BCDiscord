# BCDiscord for Browser
BCDice-API([Github](https://github.com/NKMR6194/bcdice-api "NKMR6194/bcdice-api"))がjsonpに対応していた。また[Discord](https://discordapp.com/)はWebsoket、なら両方ブラウザからアクセスできる。ということで[discord-bcdicebot](https://shunshun94.github.io/discord-bcdicebot/index.html "discord-bcdicebot")([Github](https://github.com/Shunshun94/discord-bcdicebot "Shunshun94/discord-bcdicebot"))を参考に、ブラウザで動くDiscord用ダイスボットを作成してみた。

## 使い方
BCDice-APIのURLを用意し、Discordで使いたいサーバーを立て、Discord Botを設定する必要があります（Discord自体のアカウントはあるものとする）。

### BCDice-API URLの用意
BCDice([Github](https://github.com/torgtaitai/BCDice "torgtaitai/BCDice"))（[どどんとふ](http://www.dodontof.com/ "どどんとふ＠えくすとり～む")で使用されているダイスボット）をWebから利用するAPIです。可能なら自分で用意してもいいですし、他者が用意したものを利用することもできます（独自BCDice-APIサーバーの立て方は、[BCDice-APIのドキュメント](https://github.com/ysakasin/bcdice-api/blob/master/docs/heroku.md "Herokuへの設置")に[解説が用意](https://twitter.com/ysakasin/status/1114111102260928512)されています）。   

おもに試験用に

[https://nana-bcdice-api.herokuapp.com/](https://nana-bcdice-api.herokuapp.com/)

を設置しています。

また公開のBCDice-APIサーバーとして[大ちゃんさんが設置](https://www.taruki.com/wp/?p=6610)してくださっているものがあります（[Twitter](https://twitter.com/DoDontoF_Srv/status/899993715627835392)）（2019/04/21現在、http版がNot Found）。

### Discord Botの作成
1. [開発者ページ](https://discordapp.com/developers/applications/me)にアクセスし、「New App」をクリック
2. APP NAME（とアイコンが欲しければAPP ICON）を入力して「Create App」をクリック
3. 無事Great Success!できたらApp Details欄のClient IDをコピペしてどこかに控えておく
4. 「Create a Bot User」をクリック、Add a Bot to this App?と聞かれたらYes, do it!
5. App Bot User欄が出てくるのでTokenの横の「click to reveal」をクリック（Public BotとRequire OAuth2 Code Grantのチェックは入れない）
6. *出てきたTokenをローカルファイルにコピペして控えておく*、この値は人に教えてはいけないルール
7. `https://discordapp.com/oauth2/authorize?client_id=[Client IDの数字]&scope=bot&permissions=0` にアクセス
8. Botを使いたいサーバーに追加。reCHAPTCHAが出てくる、あなたはロボットではありませんね
9. *認証しました*と表示され、選択したサーバーにオフライン状態のBotがいればOK

### BCDiscordの設定
1. bcdiscord.htmlをモダンなブラウザで開く
2. *Discord Bot Token*に先ほど控えたToken、*BCDice-API URL*にBCDice-APIのURLを入力
3. 「Discordに接続」をクリック、成功すればBotがオンラインになる

### ダイスを振る
そのままでも標準DiceBotのダイスが振れます、特定のダイスボットを使用したい場合は

`bcdice set [ダイスボット名]`

と打ってエンター。

例: `bcdice set Cthulhu`

どんなダイスボット名が使えるか知りたい場合は

`bcdice list`

と打ってください。

### config.js
なくても動きますがコンソールに読み込み失敗のエラーが出るのがイヤな場合、添付のconfig.js.emptyをリネームするなどして、configディレクトリにconfig.jsファイルを作ってください。またconfig.js.exampleはconfig.jsでできることの実例になります。

## 謝辞
discord-bcdicebotを作成されたしゅんしゅんひよこ([Twitter](https://twitter.com/Shunshun94/status/880460411513982976))さん、Botの仕様、コマンド体系やメッセージなどはほぼそのまま参考にしています。
「ボーンズ＆カーズ」を作成された[Faceless](http://faceless-tools.cocolog-nifty.com/about.html)さん、
[どどんとふ](http://www.dodontof.com/ "どどんとふ☆えくすとり～む")組み込み用にRubyに移植された、たいたい竹流([Twitter](https://twitter.com/torgtaitai))さん、
BCDice-APIを作成し、jsonpに対応された[酒田シンジ](https://sakasin.net/)さんがいらっしゃらなければこのアプリケーション自体なかったでしょう。
[どどんとふ公式鯖]("https://www.taruki.com/dodontof.html")やBCDice-APIサーバーなどを公開してくださっている[大ちゃん](https://www.taruki.com/wp/ "大ちゃんのいろいろ雑記")さん、テストなどにも利用させていただいています。

## その他
* シークレットダイスは平文で保存されているのでBCDiscord for Browserを起動している人が見るのは簡単です。どうせ難読化してもちょっとスクリプト書き換えれば外せるし、本質的にBot用意する人はBotでできることはなんでもできるし、ということでそのまま。
* 「BCDice」は「ボーンズ＆カーズ」のダイス部分ってコトでいいのかな？

## ライセンス
libディレクトリの外部については[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)でライセンスします。   
libディレクトリ内添付のdiscord.io([Github](https://github.com/izy521/discord.io "discord.io"))についてはそちらのディレクトリやプロジェクト参照。

## プロジェクトURL
* [https://github.com/NanasuNANA/BCDiscord](https://github.com/NanasuNANA/BCDiscord "NanasuNANA/BCDiscord") (Github)
* [https://bitbucket.org/Nanasu/bcdiscord-for-browse](https://bitbucket.org/Nanasu/bcdiscord-for-browser "BCDiscord for Browser") (Bitbucket)
