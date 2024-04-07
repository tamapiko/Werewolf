$(document).ready(function() {
    const $playerList = $('#player-list');
    const $roleList = $('#role-list');
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
        setupRoles();
        $setupContainer.show();
    });

    // 役職の選択と人数選択を設定する
    function setupRoles() {
        $roleList.empty();
        const availableRoles = {
            '村人': { count: 0, description: '村人は特殊な能力を持たない普通の村人です。' },
            '人狼': { count: 0, description: '人狼は夜に他の人狼と協力して村人を襲撃します。' },
            '占い師': { count: 0, description: '占い師は毎晩1人を占ってその人が人狼かどうかを知ることができます。' },
            '霊媒師': { count: 0, description: '霊媒師は死んだ人の霊を呼び出して役職を知ることができます。' },
            '狩人': { count: 0, description: '狩人は夜に他のプレイヤーを守ることができ、人狼の襲撃から守ることができます。' },
            '共有者': { count: 0, description: '共有者は他の共有者と会話することができ、お互いの情報を共有できます。' },
            '妖狐': { count: 0, description: '妖狐は人狼を倒すことができますが、占い師には人狼と判定されてしまいます。' }
        };

        // 役職ごとに人数選択の入力欄と説明を追加
        Object.entries(availableRoles).forEach(([role, info]) => {
            const $roleItem = $('<li></li>').text(`${role}: ${info.description}`);
            const $countInput = $('<input type="number" min="0" value="0">').change(function() {
                availableRoles[role].count = parseInt($(this).val());
            });
            $roleItem.append($countInput);
            $roleList.append($roleItem);
        });
    }

    // ゲームを開始する
    $startGameBtn.on('click', function() {
        const selectedRoles = [];
        const selectedRoleCounts = {};

        // 選択された役職と人数を取得
        $('#role-list li').each(function() {
            const role = $(this).text().split(':')[0].trim(); // 役職名を取得
            const count = parseInt($(this).find('input').val());
            if (count > 0) {
                selectedRoles.push(role);
                selectedRoleCounts[role] = count;
            }
        });

        if (selectedRoles.length === 0) {
            alert('少なくとも1つの役職を選択してください。');
            return;
        }

        const gameMode = $('#game-mode').val();
        setupGame(players, selectedRoles, selectedRoleCounts, gameMode);
    });

    // ゲームを設定する
    function setupGame(players, selectedRoles, selectedRoleCounts, gameMode) {
        $setupContainer.hide();
        $gameContainer.show();

        // プレイヤーの役職をランダムに割り当てて表示
        const playerRole = {};
        players.forEach(function(player) {
            const roleIndex = Math.floor(Math.random() * selectedRoles.length);
            const role = selectedRoles[roleIndex];
            if (selectedRoleCounts[role] > 0) {
                playerRole[player] = role;
                selectedRoleCounts[role]--;
            } else {
                // 役職の人数が足りない場合は別の役職を割り当てる
                let alternativeRole = null;
                for (const roleName of selectedRoles) {
                    if (selectedRoleCounts[roleName] > 0) {
                        alternativeRole = roleName;
                        break;
                    }
                }
                playerRole[player] = alternativeRole;
                selectedRoleCounts[alternativeRole]--;
            }
        });

        // ゲームモードに応じたメッセージを表示
        const gameModeMessage = (gameMode === 'online') ? 'オンラインモードでゲームを開始しました。' : 'オフライン（手渡し）モードでゲームを開始しました。';

        // 役職を表示
        $roleDisplay.text(`あなたの役職：${playerRole[players[0]]}`);
        $gameStatusDisplay.text(`プレイヤー: ${players.join(', ')}\n役職: ${Object.entries(playerRole).map(entry => `${entry[0]} (${entry[1]})`).join(', ')}\n${gameModeMessage}`);
    }
});
