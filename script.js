document.addEventListener('DOMContentLoaded', function() {
    const players = [];
    const $playerList = document.getElementById('player-list');
    const $addPlayerBtn = document.getElementById('add-player-btn');
    const $removePlayerBtn = document.getElementById('remove-player-btn');
    const $gotoSetupBtn = document.getElementById('goto-setup-btn');
    const $startGameBtn = document.getElementById('start-game-btn');
    const $setupContainer = document.getElementById('setup-container');
    const $gameContainer = document.getElementById('game-container');
    const $playerRoleDisplay = document.getElementById('player-role');
    const $gameStatusDisplay = document.getElementById('game-status');

    $addPlayerBtn.addEventListener('click', function() {
        const playerName = prompt('プレイヤー名を入力してください:');
        if (playerName && playerName.trim() !== '') {
            players.push(playerName.trim());
            renderPlayerList();
        }
    });

    $removePlayerBtn.addEventListener('click', function() {
        const playerName = prompt('削除するプレイヤー名を入力してください:');
        const index = players.indexOf(playerName);
        if (index !== -1) {
            players.splice(index, 1);
            renderPlayerList();
        }
    });

    function renderPlayerList() {
        $playerList.innerHTML = '';
        players.forEach(function(player) {
            const playerItem = document.createElement('li');
            playerItem.textContent = player;
            $playerList.appendChild(playerItem);
        });

        if (players.length >= 4) {
            $gotoSetupBtn.style.display = 'block';
        } else {
            $gotoSetupBtn.style.display = 'none';
        }
    }

    $gotoSetupBtn.addEventListener('click', function() {
        setupRoles();
        $setupContainer.style.display = 'none';
        $gameContainer.style.display = 'block';
    });

    function setupRoles() {
        // 役職選択の処理を実装する
        const roles = ['村人', '人狼', '占い師', '霊媒師', '狩人', '共有者', '妖狐'];
        const roleDistribution = assignRoles(roles, players.length);
        const currentPlayer = players[0];
        const playerRole = roleDistribution[currentPlayer];
        $playerRoleDisplay.textContent = `あなたの役職: ${playerRole}`;

        const gameStatus = `プレイヤー: ${players.join(', ')}\n役職: ${Object.entries(roleDistribution).map(entry => `${entry[0]} (${entry[1]})`).join(', ')}`;
        $gameStatusDisplay.textContent = gameStatus;
    }

    function assignRoles(roles, numPlayers) {
        const roleDistribution = {};
        const shuffledRoles = shuffle(roles.slice()); // 配列をシャッフルする関数
        for (let i = 0; i < numPlayers; i++) {
            const player = players[i];
            const role = shuffledRoles[i % roles.length];
            roleDistribution[player] = role;
        }
        return roleDistribution;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    $startGameBtn.addEventListener('click', function() {
        if (players.length >= 4) {
            alert('ゲームを開始します！');
        } else {
            alert('プレイヤーが4人以上必要です。');
        }
    });
});
