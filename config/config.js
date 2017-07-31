const CONFIG = {
  api_url: '', //BCDice-API サーバのURL
  lock_url_input: true, //URL入力欄をロックするか（configファイルでURLが指定されている場合のみ有効）
  //ダイスコマンドの全角半角変換後に独自処理を行う関数を登録できる
  //dice_command_post_process: function(command='', gameInfo={}) {
  //  if (gameInfo.gameType === 'DoubleCross') {
  //    // gameTypeがダブルクロスの場合、ダイスのデフォルトをD10にする
  //    return command.replace(/(^|\b)(\d+D)(D|[^\d\w]|$)/gi, "$1$210$3");
  //  }
  //  return command;
  //}
};