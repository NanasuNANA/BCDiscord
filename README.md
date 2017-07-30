#BCDiscord for Browser
BCDice-API([Github](https://github.com/NKMR6194/bcdice-api "bcdice-api"))がjsonpに対応していた。またDiscordのBotはWebsoketから叩けるので、[discord-bcdicebot](https://shunshun94.github.io/discord-bcdicebot/index.html "discord-bcdicebot")([Github](https://github.com/Shunshun94/discord-bcdicebot "discord-bcdicebot"))を参考に、ブラウザで動くDiscord用ダイスボットを作成してみた。

##使い方
まず使いたいサーバーを立て、DiscordのBotを設定する必要があります（Discord自体のアカウントはあるものとする）。
###Discord Botの作成
1. [開発者ページ](https://discordapp.com/developers/applications/me)にアクセスし、*New App*をクリック
2. APP NAME（とアイコンが欲しければAPP ICON）を入力して*Create App*をクリック
3. 無事**Great Success!**できたら*App Details*欄の**Client IDをコピペしてどこかに控えておく**
4. *Create a Bot User*をクリック、**Add a Bot to this App?**と聞かれたら*Yes, do it!*
5. **App Bot User**欄が出てくるのでTokenの横の*click to reveal*をクリック（*Public Bot*と*Require OAuth2 Code Grant*のチェックは入れない）
6. **出てきたTokenをローカルファイルにコピペして控えておく**、この値は人に教えてはいけないルール
7. https://discordapp.com/oauth2/authorize?client_id=[Client IDの数字]&scope=bot&permissions=0 にアクセス
8. Botを使いたいサーバーに追加。reCHAPTCHAが出てくる、あなたはロボットではありませんね
9. **認証しました**と表示されたらOK、選択したサーバーにオフライン状態のBotがいますね

###BCDiscordの設定
1. bcdiscord.htmlをモダンなブラウザで開く
2. **Discord Bot Token**に先ほど控えたToken、**BCDice-API URL**にBCDice-APIのURLを入力
3. *Discordに接続*をクリック、成功すればBotがオンラインになる

###ダイスを振る
そのままでも標準DiceBotのダイスが振れます、特定のダイスボットを使用したい場合は

`bcdice set [システム名]`

と打ってエンター、どんなシステム名が使えるか知りたい場合は

`bcdice list`

と打ってください。

##その他
シークレットダイスについてですが、平文で保存されているのでBCDice for Browerを起動している人が見るのは簡単です。どうせ難読化してもちょっとスクリプト書き換えれば外せるし、ということでそのまま。

##ライセンス
libディレクトリの外部については[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)でライセンスします。   
libディレクトリ内添付のdiscord.io([Github](https://github.com/izy521/discord.io "discord.io"))についてはそちらのディレクトリやプロジェクト参照。

##プロジェクトURL
[https://bitbucket.org/Nanasu/bcdiscord-for-browser](https://bitbucket.org/Nanasu/bcdiscord-for-browser "BCDiscord for Browser")

