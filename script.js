document.addEventListener('DOMContentLoaded', function() {
    const registrationContainer = document.getElementById('registration-container');
    const setupContainer = document.getElementById('setup-container');
    const gameContainer = document.getElementById('game-container');
    const playerNameInput = document.getElementById('player-name');
    const registerPlayerButton = document.getElementById('register-player-btn');
    const rolesSelect = document.getElementById('roles-select');
    const gameModeSelect = document.getElementById('game-mode');
    const startGameButton = document.getElementById('start-game-btn');
    const roleDisplay = document.getElementById('player-role');
    const gameStatusDisplay = document.getElementById('game-status');

    let players = [];

    registerPlayerButton.addEventListener('click', function() {
        const playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('プレイヤー名を入力してください。');
            return;
        }
        players.push(playerName);
        playerNameInput.value = '';
        alert(`プレイヤー「${playerName}」を登録しました。`);
    });

    startGameButton.addEventListener('click', function() {
        const playerCount = players.length;
        const selectedRoles = Array.from(rolesSelect.selectedOptions, option => option.value);

        if (selectedRoles.length === 0) {
            alert('少なくとも1つの役職を選択してください。');
            return;
        }

        if (selectedRoles.length > playerCount) {
            alert('役職の数がプレイヤー人数より多いです。');
            return;
        }

        const gameMode = gameModeSelect.value;
        setupGame(players, selectedRoles, gameMode);
    });

    function setupGame(players, selectedRoles, gameMode) {
        registrationContainer.style.display = 'none';
        setupContainer.style.display = 'block';

        // プレイヤーの役職をランダムに選択して表示する
        const playerRole = {};
        players.forEach(player => {
            const randomRoleIndex = Math.floor(Math.random() * selectedRoles.length);
            const role = selectedRoles[randomRoleIndex];
            playerRole[player] = role;
            selectedRoles.splice(randomRoleIndex, 1); // 選択した役職から削除する
        });

        // ゲームモードによって異なるメッセージを表示する
        let gameModeMessage = '';
        if (gameMode === 'online') {
            gameModeMessage = 'オンラインモードでゲームを開始しました。';
        } else if (gameMode === 'offline') {
            gameModeMessage = 'オフライン（手渡し）モードでゲームを開始しました。';
        }

        // 役職を表示する
        gameContainer.style.display = 'block';
        roleDisplay.textContent = `あなたの役職：${playerRole[players[0]]}`;
        gameStatusDisplay.textContent = `プレイヤー: ${players.join(', ')}\n役職: ${Object.entries(playerRole).map(entry => `${entry[0]} (${entry[1]})`).join(', ')}\n${gameModeMessage}`;
    }
});
