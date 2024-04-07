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
            const selectedRoles = [];

            // 選択された役職と人数を取得
            $('#role-list li').each(function() {
                const $roleItem = $(this);
                const role = $roleItem.find('button').text();
                const count = parseInt($roleItem.find('input').val());
                for (let i = 0; i < count; i++) {
                    selectedRoles.push(role);
                }
            });

            if (selectedRoles.length === 0) {
                alert('少なくとも1つの役職を選択してください。');
                return;
            }

            // 役職の割り当てとゲーム開始処理
            assignRoles(selectedRoles);
            gameStarted = true; // ゲームが開始されたフラグを立てる
        } else {
            alert('ゲームが既に開始されています。');
        }
    });

    // 役職の割り当てとゲーム開始処理
    function assignRoles(selectedRoles) {
        $setupContainer.hide();
        $gameContainer.show();

        // プレイヤーの役職をランダムに割り当てて表示
        const playerRole = {};
        players.forEach(function(player) {
            const roleIndex = Math.floor(Math.random() * selectedRoles.length);
            const role = selectedRoles.splice(roleIndex, 1)[0];
            playerRole[player] = role;
        });

        // 役職を表示
        const currentPlayer = players[0];
        $roleDisplay.text(`あなたの役職：${playerRole[currentPlayer]}`);

        // ゲーム開始メッセージを表示
        const gameMessage = `プレイヤー: ${players.join(', ')}\n役職: ${Object.entries(playerRole).map(entry => `${entry[0]} (${entry[1]})`).join(', ')}\nゲームを開始しました。`;
        $gameStatusDisplay.text(gameMessage);
    }
});
