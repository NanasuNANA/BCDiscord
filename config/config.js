const CONFIG = {
  api_url: '', //BCDice-API サーバのURL
  lock_url_input: true, //URL入力欄をロックするか（configファイルでURLが指定されている場合のみ有効）
  //ダイスコマンドの全角半角変換後、APIに送る前に行う処理を定義できる
  //pre_process: function(command='', gameInfo={}) {
  //  if (gameInfo.gameType === 'DoubleCross') {
  //    // gameTypeがダブルクロスの場合、ダイスのデフォルトをD10にする
  //    return command.replace(/(^|\b)(\d+D)(D|[^\d\w]|$)/gi, "$1$210$3");
  //  }
  //  return command;
  //},
  //ダイスコマンドのAPIからの戻り値に行う処理を定義できる
  //post_process: null,
};