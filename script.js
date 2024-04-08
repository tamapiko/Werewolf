$(document).ready(function() {
    const $roleList = $('#role-list');
    const $gotoSetupBtn = $('#goto-setup-btn');
    const $startGameBtn = $('#start-game-btn');
    const $setupContainer = $('#setup-container');
    const $gameContainer = $('#game-container');
    const $roleDisplay = $('#player-role');
    const $gameStatusDisplay = $('#game-status');
    const $addPlayerBtn = $('#add-player-btn');
    const $removePlayerBtn = $('#remove-player-btn');
    const $gameRules = $('#game-rules');
    const $confirmIdentityBtn = $('#confirm-identity-btn');

    let players = [];
    let gameStarted = false;

    // プレイヤーを追加する
    $addPlayerBtn.on('click', function() {
        if (!gameStarted) {
            const playerName = prompt('プレイヤー名を入力してください:');
            if (playerName && playerName.trim() !== '') {
                // 重複チェック
                if (!players.includes(playerName.trim())) {
                    players.push(playerName.trim());
                    displayPlayers();
                } else {
                    alert('そのプレイヤー名は既に存在します。別の名前を入力してください。');
                }
            }
        } else {
            alert('ゲームが既に開始されています。プレイヤーの追加はできません。');
        }
    });

    // プレイヤーを削除する
    $removePlayerBtn.on('click', function() {
        if (!gameStarted) {
            const playerName = prompt('削除するプレイヤー名を入力してください:');
            const index = players.indexOf(playerName);
            if (index !== -1) {
                players.splice(index, 1);
                displayPlayers();
            } else {
                alert('指定されたプレイヤーが見つかりませんでした。');
            }
        } else {
            alert('ゲームが既に開始されています。プレイヤーの削除はできません。');
        }
    });

    // プレイヤー名を表示する
    function displayPlayers() {
        const $playerList = $('#player-list');
        $playerList.empty();
        players.forEach(function(player) {
            const $playerItem = $('<li></li>').text(player);
            $playerList.append($playerItem);
        });

        // プレイヤーが4人以上であれば設定画面へのボタンを表示
        if (players.length >= 4 && !gameStarted) {
            $gotoSetupBtn.show();
        } else {
            $gotoSetupBtn.hide();
        }
    }

    // 設定画面へ進む
    $gotoSetupBtn.on('click', function() {
        if (!gameStarted) {
            setupRoles();
            $setupContainer.show();
        } else {
            alert('ゲームが既に開始されています。設定はできません。');
        }
    });

    // 役職選択と人数選択を設定する
    function setupRoles() {
        $roleList.empty(); // 要素をクリアしてから再設定

        const availableRoles = {
            '村人': '村人は特殊な能力を持たない普通の村人です。',
            '人狼': '人狼は夜に他の人狼と協力して村人を襲撃します。',
            '占い師': '占い師は毎晩1人を占ってその人が人狼かどうかを知ることができます。',
            '霊媒師': '霊媒師は死んだ人の霊を呼び出して役職を知ることができます。',
            '狩人': '狩人は夜に他のプレイヤーを守ることができ、人狼の襲撃から守ることができます。',
            '共有者': '共有者は他の共有者と会話することができ、お互いの情報を共有できます。',
            '妖狐': '妖狐は人狼を倒すことができますが、占い師には人狼と判定されてしまいます。'
        };

        // 役職ごとに選択ボタンを追加
        Object.entries(availableRoles).forEach(([role, description]) => {
            const $roleItem = $('<li></li>');
            const $roleBtn = $('<button></button>').text(role);
            $roleBtn.on('click', function() {
                if (!gameStarted) {
                    const count = players.length;
                    const $countInput = $(`<input type="number" min="0" max="${count}" value="0">`);
                    $roleItem.append($countInput);
                    $(this).prop('disabled', true); // 役職ボタンを無効化
                } else {
                    alert('ゲームが既に開始されています。役職の選択はできません。');
                }
            });
            $roleItem.append($roleBtn);
            $roleItem.append(' - ');
            $roleItem.append(description);
            $roleList.append($roleItem);
        });
    }

    // ゲームを開始する
    $startGameBtn.on('click', function() {
        if (!gameStarted) {
            if (players.length < 4) {
                alert('プレイヤーが4人未満です。ゲームを開始できません。');
                return;
            }

            $setupContainer.hide(); // 設定画面を非表示にする

            // ゲームのルール説明を表示
            $gameRules.html(`
                <p>ゲームを開始します。</p>
                <p>プレイヤーは役職を知られないようにプレイします。</p>
                <p>役職はゲームマスターによってランダムに割り当てられます。</p>
                <p>ゲームを進行するには、逐次ゲームマスターの指示に従ってください。</p>
            `);

            // 本人確認ボタンを表示
            $confirmIdentityBtn.show();
        } else {
            alert('ゲームが既に開始されています。');
        }
    });

    // 本人確認を行う
    $confirmIdentityBtn.on('click', function() {
        if (!gameStarted) {
            alert('ゲームが開始されていません。');
            return;
        }

        const currentPlayer = players[0];
        const confirmationCode = prompt(`プレイヤー: ${currentPlayer} さん、本人確認のため以下のコードを入力してください:`);
        // ここで本人確認の処理を行う (例: ゲームマスターがコードを確認して役職を表示する)
        // 役職表示の処理を記述
        $roleDisplay.text(`あなたの役職：[役職名]`);

        // ゲームステータスを更新
        const gameMessage = `プレイヤー: ${players.join(', ')}\nゲームを開始しました。`;
        $gameStatusDisplay.text(gameMessage);

        // 本人確認ボタンを非表示にする
        $confirmIdentityBtn.hide();
    });
});
