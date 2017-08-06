'use strict';
// CONFIGがなければ空のオブジェクト
if (!window.CONFIG) {
    window.CONFIG = {};
}
CONFIG.multiple_max = CONFIG.multiple_max || 10;
CONFIG.command_string = CONFIG.command_string || 'bcdice';

// 定数
const appName = 'BCDiscord';
const appVersion = '0.9.0';

// チャンネルごとの設定を保存
let systemInfo = {};
// ユーザ→配列インデックス
let saveData = {};
// ゲームリストの大文字小文字変換用
let gameListLowerCaseTo = {};

let resultSpan;
let bcdiceApiUrlInput;
let botTokenInput;
let testStringInput;
let apiTestButton;
let connectButton;

// 全角半角変換かつnull、undefinedを空文字に
const toCommandString = function(str, nullSafe=true) {
    if (!str) {
        return nullSafe ? '' : str;
    }
    return str.toString().replace(/[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); })
        .replace(/[“”]/g, '"')
        .replace(/’/g, "'")
        .replace(/‘/g, '`')
        .replace(/￥/g, '\\')
        .replace(/　/g, ' ')
        .replace(/[‐－―]/g, '-')
        .replace(/、/g, ',')
        .replace(/。/g, '.')
        .replace(/[～〜]/g, '~');
}

// バックチックと\をエスケープ
const escapeBackTick = function(str, nullSafe=true) {
    if (!str) {
        return nullSafe ? '' : str;
    }
    return str.toString().replace(/\\/g, '\\\\').replace(/`/g, '\\`');
}

// Markdwonのインライン記法をエスケープ
const escapeMarkdwon = function(str, nullSafe=true) {
    if (!str) {
        return nullSafe ? '' : str;
    }
    return escapeBackTick(str).replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/:/g, '\\:');
}

// 本体
const main = function() {
    // 通知
    const notice = function(isFail=false, message='', doDesktopNotice=false) {
        if (isFail) {
            resultSpan.addClass('fail').text(message);
        } else {
            resultSpan.removeClass('fail').text(message);
        }
        // TODO デスクトップ通知
    }
    const doneNotice = function(message, doDesktopNotice=false) {
        notice(false, message, doDesktopNotice);
    }
    const failNotice = function(message, doDesktopNotice=false) {
        notice(true, message, doDesktopNotice);
    }
    
    // BCDice-API URLの取得
    const getBCDiceApiUrl = function(joinUrl) {
        let apiUrl = bcdiceApiUrlInput.val();
        if (apiUrl && apiUrl != '') {
            apiUrl = apiUrl.trim();
            if (joinUrl && apiUrl.substr(apiUrl.length - 1) === '/') {
                apiUrl = apiUrl.substr(0, apiUrl.length - 1) + joinUrl;
            } else if (joinUrl) {
                apiUrl += joinUrl;
            }
        }
        return apiUrl;
    }
    
    // BCDice-API URLのローカル保存
    const saveApiUrl = function() {
        localStorage.setItem(`${appName}_api_url`, getBCDiceApiUrl());
    }
    
    // BCDice-APIのテスト
    apiTestButton.on('click', () => {
        const command = testStringInput.val();
        let apiUrl = getBCDiceApiUrl();
        if (!apiUrl || apiUrl == '') {
            alert('BCDice-APIのURLが必要です');
            bcdiceApiUrlInput.focus();
            return;
        }
        let data = {};
        let doneCallback;
        if (command && command.trim() != '') {
            apiUrl = getBCDiceApiUrl('/v1/diceroll');
            data = {system: 'DiceBot', command: toCommandString(command).trim()};
            doneCallback = function(data) { doneNotice(`result${data.result}`); };
        } else {
            apiUrl = getBCDiceApiUrl('/v1/version');
            doneCallback = function(data) { doneNotice(`api:${data.api} bcdice:${data.bcdice}`); }
        }
        $.ajax({
            type: 'GET',
            url: apiUrl,
            data: data,
            dataType: 'jsonp'
        })
        .done(saveApiUrl)
        .done(doneCallback)
        .fail(function(jqXHR) { failNotice(`失敗しました(${jqXHR.status})`); });
    });
    
    // Discordへの接続
    let client = null;
    connectButton.on('click', () => {
        if (client) {
            if (!confirm('Discordから切断しますか？')) {
                return;
            }
            client.disconnect();
            return;
        }
        const token = botTokenInput.val();
        if (token && token != '') {
            connectButton.attr('disabled', true);
            client = new Discord.Client({
                token: token,
                autorun: true
            });
            const sendHowToUse = (channelID) => {
                client.sendMessage({
                    to: channelID,
                    message: `**How to use**\n# Show dice bot list\n> \`${CONFIG.command_string} list\`\n# Change dice bot\n> \`${CONFIG.command_string} set SYSTEM_NAME\`\n# Show Dice bot help\n> \`${CONFIG.command_string} help SYSTEM_NAME\`\n# Show current Status\n> \`${CONFIG.command_string} status\`\n# Reset Your Secret and Save data\n> \`${CONFIG.command_string} reset me\``
                });
            };
            
            client.on('ready', () => {
                connectButton.val('Discordから切断').attr('disabled', false);
                localStorage.setItem(`${appName}_token`, token);
                $.ajax({
                    type: 'GET',
                    url: getBCDiceApiUrl('/v1/systems'),
                    dataType: 'jsonp'
                })
                .done(saveApiUrl)
                .done((data) => {
                    gameListLowerCaseTo = {};
                    for (let gameType of data.systems) {
                        gameListLowerCaseTo[gameType.toLowerCase()] = gameType;
                    }
                    doneNotice(`Discord Bot(${client.username})が接続しました、BCDice-APIのテストに成功しました`);
                })
                .fail(() => {
                    failNotice(`Discord Bot(${client.username})が接続しましたが、BCDice-APIのテストに失敗しました`);
                });
            });
            
            client.on('disconnect', () => {
                client = null;
                connectButton.val('Discordに接続').attr('disabled', false);
                failNotice(`Discord Botが切断されました`, true);
            });
            
            client.on('message', (user, userID, channelID, message, event) => {
                if (client.id === userID) {
                    return;
                }
                const commands = toCommandString(message.trim()).split(/\s+/);
                if (commands[0].toLowerCase() === CONFIG.command_string.toLowerCase()) {
                    client.simulateTyping(channelID, () => {
                        if (commands[1]) {
                            commands[1] = commands[1].toLowerCase();
                        }
                        switch (commands[1]) {
                        case 'list':
                            $.ajax({
                                type: 'GET',
                                url: getBCDiceApiUrl('/v1/systems'),
                                dataType: 'jsonp'
                            })
                            .done(saveApiUrl)
                            .done((data) => {
                                gameListLowerCaseTo = {};
                                for (let gameType of data.systems) {
                                    gameListLowerCaseTo[gameType.toLowerCase()] = gameType;
                                }
                                client.sendMessage({
                                    to: channelID,
                                    message: `[DiceBot List]\n\`\`\`\n${escapeBackTick(data.systems.join("\n"))}\n\`\`\``
                                });
                            })
                            .fail(() => {
                                client.sendMessage({
                                    to: channelID,
                                    message: `[${appName}]\n**BCDice-API Connection Failed**`
                                });
                            });
                            break;
                        case 'set':
                            if (commands.length > 2) {
                                $.ajax({
                                    type: 'GET',
                                    url: getBCDiceApiUrl('/v1/systeminfo'),
                                    data: {system: gameListLowerCaseTo[commands[2].toLowerCase()] || commands[2]},
                                    dataType: 'jsonp'
                                })
                                .done(saveApiUrl)
                                .done((data) => {
                                    systemInfo[channelID] = data.systeminfo;
                                    if (CONFIG.show_game_name && data.systeminfo) {
                                        client.setPresence({game: {name: data.systeminfo.name != 'DiceBot' ? data.systeminfo.name : null}});
                                    }
                                    client.sendMessage({
                                        to: channelID,
                                        message: `BCDice system is changed: ${escapeMarkdwon(data.systeminfo.gameType)}\n\`\`\`\n${escapeBackTick(data.systeminfo.info)}\n\`\`\``
                                    });
                                    localStorage.setItem(`${appName}_systemInfo`, JSON.stringify(systemInfo));
                                })
                                .fail(function() {
                                    //TODO 接続失敗を考慮
                                    client.sendMessage({
                                        to: channelID,
                                        message: `[${escapeMarkdwon(commands[2])}]\nSystem '${escapeMarkdwon(commands[2])}' is not found`
                                    });
                                });
                            } else {
                                client.sendMessage({
                                    to: channelID,
                                    message: `[ERROR] When you want to change dice system\n        *${CONFIG.command_string} set SYSTEM_NAME*\nExample \`${CONFIG.command_string} set AceKillerGene\``
                                });
                            }
                            break;
                        case 'reset':
                                if (commands[2] && commands[2].toLowerCase() === 'me') {
                                    delete saveData[userID];
                                    localStorage.setItem(`${appName}_saveData`, JSON.stringify(saveData));
                                    client.sendMessage({
                                        to: channelID,
                                        message: `**>${escapeMarkdwon(user)}**\n**Reset** your Secret and Save data`
                                    });
                                } else {
                                    client.sendMessage({
                                        to: channelID,
                                        message: `[${escapeMarkdwon(appName)}]\n# If you need **Reset** your Secret and Save data,\n> \`${CONFIG.command_string} reset me\``
                                    });
                                }
                            break;
                        case 'load':
                            let loadedMessage;
                            if (commands.length >= 3) {
                                const loadData = [];
                                for (let i = 2; i < commands.length; i++) {
                                    if ($.isNumeric(commands[i]) && saveData[userID] && saveData[userID][commands[i] - 1]) {
                                        loadData.push(saveData[userID][commands[i] - 1]);
                                    } else {
                                        loadData.push(`*Not found (index = ${escapeMarkdwon(commands[i])})*`);
                                    }
                                }
                                loadedMessage = `**>${escapeMarkdwon(user)}**\n${loadData.join("\n")}`;
                            } else {
                                loadedMessage = `[${escapeMarkdwon(appName)}]\n# If you need Load Secret and Save data,\n> \`${CONFIG.command_string} load [Index] [and more Index ...]\``
                            }
                            client.sendMessage({
                                to: channelID,
                                message: loadedMessage
                            });
                            break;
                        case 'help':
                            if (commands.length > 2) {
                                $.ajax({
                                    type: 'GET',
                                    url: getBCDiceApiUrl('/v1/systeminfo'),
                                    data: {system: gameListLowerCaseTo[commands[2].toLowerCase()] || commands[2]},
                                    dataType: 'jsonp'
                                })
                                .done(saveApiUrl)
                                .done((data) => {
                                    client.sendMessage({
                                        to: channelID,
                                        message: `[${escapeMarkdwon(data.systeminfo.gameType)}]\n\`\`\`\n${escapeBackTick(data.systeminfo.info)}\n\`\`\``
                                    });
                                })
                                .fail(() => {
                                    //TODO 接続失敗を考慮
                                    client.sendMessage({
                                        to: channelID,
                                        message: `[${escapeMarkdwon(commands[2])}]\nSystem '${escapeMarkdwon(commands[2])}' is not found`
                                    });
                                });
                            } else if (systemInfo[channelID]) {
                                client.sendMessage({
                                    to: channelID,
                                    message: `[${escapeMarkdwon(systemInfo[channelID].gameType)}]\n\`\`\`\n${escapeBackTick(systemInfo[channelID].info)}\n\`\`\``
                                });
                            } else {
                                sendHowToUse(channelID);
                            }
                            break;
                        case 'status':
                            $.ajax({
                                type: 'GET',
                                url: getBCDiceApiUrl('/v1/version'),
                                dataType: 'jsonp'
                            })
                            .done(saveApiUrl)
                            .done((data) => {
                                client.sendMessage({
                                    to: channelID,
                                    message: `[${escapeMarkdwon(appName)}] for ${escapeMarkdwon(getBCDiceApiUrl())} : ${escapeMarkdwon(systemInfo[channelID] ? systemInfo[channelID].gameType : 'DiceBot')}(v.${escapeMarkdwon(data.bcdice)})`
                                });
                            });
                            break;
                        case 'save':
                            const tmp = message.split(/[\s　]+/, 3);
                            if (tmp[2]) {
                                let saveMessage = message.substr(message.indexOf(tmp[0]) + tmp[0].length);
                                saveMessage = saveMessage.substr(saveMessage.indexOf(tmp[1]) + tmp[1].length);
                                saveMessage = saveMessage.substr(saveMessage.indexOf(tmp[2]));
                                if (!saveData[userID]) {
                                    saveData[userID] = [];
                                }
                                const length = saveData[userID].push(saveMessage);
                                client.sendMessage({
                                    to: userID,
                                    message: `To recall this,\n\`${CONFIG.command_string} load ${length}\`\n${saveMessage}`
                                });
                                localStorage.setItem(`${appName}_saveData`, JSON.stringify(saveData));
                            } else {
                                client.sendMessage({
                                    to: userID,
                                    message: `[ERROR] When you want to save Message\n        *${CONFIG.command_string} save SAVEING MESSAGE*\nExample \`${CONFIG.command_string} save I love You.\``
                                });
                            }
                            break;
                        default:
                            sendHowToUse(channelID);
                            break;
                        }
                    });
                } else {
                    // 複数回か？
                    let count = 1;
                    let isMultiple = false;
                    if ($.isNumeric(commands[0])) {
                        // コマンドの先頭を取り除く
                        count = parseInt(commands.shift(), 10);
                        isMultiple = true;
                    }
                    // すべてBCDice-APIに投げずに回数が1回未満かchoice[]が含まれるか英数記号以外は門前払い
                    if (!commands[0] || count < 1 || !(/choice\[.*\]/i.test(commands[0]) || /^[a-zA-Z0-9!-/:-@¥[-`{-~\}]+$/.test(commands[0]))) {
                        return;
                    }
                    client.simulateTyping(channelID, () => {
                        // 回数が最大を超える
                        if (count > CONFIG.multiple_max + 0) {
                            client.sendMessage({
                                to: channelID,
                                message: `**>${escapeMarkdwon(user)}**\nYour multiple roll is too many times (max=${CONFIG.multiple_max}).`
                            });
                            return;
                        }
                        let rawCommand = '';
                        let comment = '';
                        if (isMultiple) {
                            const tmp = message.split(/[\s　]+/, 3);
                            comment = message.substr(message.indexOf(tmp[0]) + tmp[0].length);
                            comment = comment.substr(message.indexOf(tmp[1]) + tmp[1].length);
                            comment = tmp[2] ? comment.substr(comment.indexOf(tmp[2])) : '';
                            rawCommand = tmp[1];
                        } else {
                            const tmp = message.split(/[\s　]+/, 2);
                            comment = message.substr(message.indexOf(tmp[0]) + tmp[0].length);
                            comment = tmp[1] ? comment.substr(comment.indexOf(tmp[1])) : '';
                            rawCommand = tmp[0];
                        }
                        // 前処理、後処理に渡す情報
                        const infos = Object.assign({command: commands[0], raw_command: rawCommand, comment: comment, is_multiple: isMultiple, max_index: count}, systemInfo[channelID] || {});
                        if (infos.prefixs) {
                            infos.prefixs = [].concat(infos.prefixs); //変更防止
                        }
                        // 後方互換
                        const preProcess = CONFIG.pre_process || CONFIG.dice_command_post_process;
                        // API接続
                        const rolls = [];
                        for (let i = 0; i < count; i++) {
                            rolls.push($.ajax({
                                type: 'GET',
                                url: getBCDiceApiUrl('/v1/diceroll'),
                                data: {
                                    system: systemInfo[channelID] ? systemInfo[channelID].gameType : 'DiceBot',
                                    command: preProcess ? preProcess(commands[0], Object.assign({index: i + 1}, infos)) : commands[0]
                                },
                                dataType: 'jsonp'
                            }));
                        }
                        $.when.apply($, rolls)
                        .done(saveApiUrl)
                        .done(function() {
                            if (CONFIG.show_game_name) {
                                if (systemInfo[channelID]) {
                                    client.setPresence({game: {name: systemInfo[channelID].name != 'DiceBot' ? systemInfo[channelID].name : null}});
                                } else {
                                    client.setPresence({game: {name: null}});
                                }
                            }
                            const responsMessages = [];
                            let isSecret = false;
                            for (let i = 0; i < arguments.length; i++) {
                                let data = count > 1 ? arguments[i][0] : arguments[0];
                                responsMessages.push(`${isMultiple ? '#' + (i + 1) + ' ' : ''}${escapeMarkdwon(systemInfo[channelID] ? systemInfo[channelID].gameType : 'DiceBot')}${escapeMarkdwon(CONFIG.post_process ? CONFIG.post_process(data.result, Object.assign({index: i + 1}, infos, data)) : data.result)}`);
                                isSecret = data.secret;
                                if (count === 1) {
                                    break;
                                }
                            }
                            if (isSecret) {
                                if (!saveData[userID]) {
                                    saveData[userID] = [];
                                }
                                const indexes = [];
                                for (let i = 0; i < responsMessages.length; i++) {
                                    indexes.push(saveData[userID].push(responsMessages[i]));
                                }
                                const channelMessages = indexes.map((e, i) => `${isMultiple ? '#' + (i + 1) + ' ' : ''}${escapeMarkdwon(systemInfo[channelID] ? systemInfo[channelID].gameType : 'DiceBot')}: [Secret Dice (Index = ${e})]`);
                                const userMessages = indexes.map((e, i) => `${responsMessages[i]}\n> \`${CONFIG.command_string} load ${e}\``);
                                client.sendMessage({
                                    to: channelID,
                                    message: `**>${escapeMarkdwon(user)}**\n${channelMessages.join("\n")}`
                                });
                                client.sendMessage({
                                    to: userID,
                                    message: `To recall this,\n${userMessages.join("\n")}`
                                });
                                localStorage.setItem(`${appName}_saveData`, JSON.stringify(saveData));
                            } else {
                                client.sendMessage({
                                    to: channelID,
                                    message: `**>${escapeMarkdwon(user)}**\n${responsMessages.join("\n")}`
                                });
                            }
                        });
                    });
                }
            });
        } else {
            alert('Discord Botのtokenが必要です');
            botTokenInput.focus();
            return;
        }
    });
}
