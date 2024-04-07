$(document).ready(function() {
    const $roleList = $('#role-list');
    const $gotoSetupBtn = $('#goto-setup-btn');
    const $startGameBtn = $('#start-game-btn');
    const $setupContainer = $('#setup-container');
    const $gameContainer = $('#game-container');
    const $roleDisplay = $('#player-role');
    const $gameStatusDisplay = $('#game-status');

    let players = [];

    // プレイヤーを追加する
    $('#add-player-btn').on('click', function() {
        const playerName = prompt('プレイヤー名を入力してください:');
        if (playerName && playerName.trim() !== '') {
            players.push(playerName.trim());
            displayPlayers();
        }
    });

    // プレイヤーを削除する
    $(document).on('click', '.remove-player-btn', function() {
        const playerToRemove = $(this).closest('li').text();
        players = players.filter(player => player !== playerToRemove);
        displayPlayers();
    });

    // プレイヤー名を表示する
    function displayPlayers() {
        const $playerList = $('#player-list');
        $playerList.empty();
        players.forEach(function(player) {
            const $playerItem = $('<li></li>').text(player);
            const $removeBtn = $('<button class="remove-player-btn">削除</button>');
            $playerItem.append($removeBtn);
            $playerList.append($playerItem);
        });

        // プレイヤーが4人以上であれば設定画面へのボタンを表示
        if (players.length >= 4) {
            $('#goto-setup-btn').show();
        } else {
            $('#goto-setup-btn').hide();
        }
    }

    // 設定画面へ進む
    $('#goto-setup-btn').on('click', function() {
        if ($('#game-mode').val() === 'offline') {
            confirmPlayers();
        } else {
            setupRoles();
            $setupContainer.show();
        }
    });

    // 本人確認を行う
    function confirmPlayers() {
        const confirmedPlayers = [];
        players.forEach(function(player) {
            const confirmation = confirm(`${player} さん、あなたの役職を見せますか？`);
            if (confirmation) {
                confirmedPlayers.push(player);
            }
        });
        players = confirmedPlayers; // 本人確認後のプレイヤーリストを更新
        setupRoles();
        $setupContainer.show();
    }

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

        // 役職ごとに選択肢を追加
        Object.entries(availableRoles).forEach(([role, description]) => {
            const $roleItem = $('<li></li>');
            const $roleLabel = $('<span></span>').text(role);
            const $roleDescription = $('<span></span>').text(description);
            const $countInput = $('<input type="number" min="0" value="0">');

            $roleItem.append($roleLabel);
            $roleItem.append(' - ');
            $roleItem.append($roleDescription);
            $roleItem.append($countInput);
            $roleList.append($roleItem);
        });
    }

    // ゲームを開始する
    $('#start-game-btn').on('click', function() {
        const selectedRoles = [];

        // 選択された役職と人数を取得
        $('#role-list li').each(function() {
            const role = $(this).find('span:first').text();
            const count = parseInt($(this).find('input').val());
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
