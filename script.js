$(document).ready(function() {
    const $playerList = $('#player-list');
    const $sortableRoles = $('#sortable-roles');
    const $addPlayerBtn = $('#add-player-btn');
    const $gotoSetupBtn = $('#goto-setup-btn');
    const $startGameBtn = $('#start-game-btn');
    const $roleDisplay = $('#player-role');
    const $gameStatusDisplay = $('#game-status');
    const $registrationContainer = $('#registration-container');
    const $setupContainer = $('#setup-container');
    const $gameContainer = $('#game-container');

    let players = [];
    let roles = [];

    // プレイヤーを追加する
    $addPlayerBtn.on('click', function() {
        const playerName = prompt('プレイヤー名を入力してください:');
        if (playerName && playerName.trim() !== '') {
            players.push(playerName.trim());
            displayPlayers();
        }
    });

    // プレイヤー名を表示する
    function displayPlayers() {
        $playerList.empty();
        players.forEach(function(player) {
            const $playerItem = $('<li></li>').text(player);
            const $removeBtn = $('<button>削除</button>').click(function() {
                const index = players.indexOf(player);
                if (index !== -1) {
                    players.splice(index, 1);
                    displayPlayers();
                }
            });
            $playerItem.append($removeBtn);
            $playerList.append($playerItem);
        });

        // プレイヤーが登録されていれば設定画面へのボタンを表示
        if (players.length > 0) {
            $gotoSetupBtn.show();
        } else {
            $gotoSetupBtn.hide();
        }
    }

    // 設定画面へ進む
    $gotoSetupBtn.on('click', function() {
        roles = [];
        $playerList.sortable({
            placeholder: 'ui-state-highlight'
        });

        // 役職の選択リストを作成
        const availableRoles = ['村人', '人狼', '占い師', '霊媒師', '狩人', '共有者', '妖狐'];
        availableRoles.forEach(function(role) {
            const $roleItem = $('<li></li>').text(role);
            $sortableRoles.append($roleItem);
        });

        $registrationContainer.hide();
        $setupContainer.show();
    });

    // ゲームを開始する
    $startGameBtn.on('click', function() {
        const selectedRoles = [];
        $('#sortable-roles li').each(function() {
            selectedRoles.push($(this).text());
        });

        if (selectedRoles.length === 0) {
            alert('少なくとも1つの役職を選択してください。');
            return;
        }

        if (selectedRoles.length > players.length) {
            alert('役職の数がプレイヤー人数より多いです。');
            return;
        }

        const gameMode = $('#game-mode').val();
        setupGame(players, selectedRoles, gameMode);
    });

    // ゲームを設定する
    function setupGame(players, selectedRoles, gameMode) {
        $setupContainer.hide();
        $gameContainer.show();

        // プレイヤーの役職をランダムに割り当てて表示
        const playerRole = {};
        players.forEach(function(player) {
            const randomIndex = Math.floor(Math.random() * selectedRoles.length);
            const role = selectedRoles.splice(randomIndex, 1)[0];
            playerRole[player] = role;
        });

        // ゲームモードに応じたメッセージを表示
        const gameModeMessage = (gameMode === 'online') ? 'オンラインモードでゲームを開始しました。' : 'オフライン（手渡し）モードでゲームを開始しました。';

        // 役職を表示
        $roleDisplay.text(`あなたの役職：${playerRole[players[0]]}`);
        $gameStatusDisplay.text(`プレイヤー: ${players.join(', ')}\n役職: ${Object.entries(playerRole).map(entry => `${entry[0]} (${entry[1]})`).join(', ')}\n${gameModeMessage}`);
    }
});
