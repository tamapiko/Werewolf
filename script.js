document.addEventListener('DOMContentLoaded', function() {
    const registrationContainer = document.getElementById('registration-container');
    const setupContainer = document.getElementById('setup-container');
    const gameContainer = document.getElementById('game-container');
    const addPlayerButton = document.getElementById('add-player-btn');
    const startSetupButton = document.getElementById('start-setup-btn');
    const startGameButton = document.getElementById('start-game-btn');
    const rolesSelect = document.getElementById('roles-select');
    const gameModeSelect = document.getElementById('game-mode');
    const roleDisplay = document.getElementById('player-role');
    const gameStatusDisplay = document.getElementById('game-status');
    let playerCount = 0;

    addPlayerButton.addEventListener('click', function() {
        playerCount++;
        const newPlayerInput = document.createElement('input');
        newPlayerInput.setAttribute('type', 'text');
        newPlayerInput.setAttribute('placeholder', `プレイヤー${playerCount}の名前`);
        newPlayerInput.classList.add('player-input');
        document.getElementById('player-list').appendChild(newPlayerInput);

        // プレイヤーが1人以上登録されたら設定画面へのボタンを表示
        if (playerCount >= 1) {
            startSetupButton.style.display = 'block';
        }
    });

    startSetupButton.addEventListener('click', function() {
        registrationContainer.style.display = 'none';
        setupContainer.style.display = 'block';
    });

    startGameButton.addEventListener('click', function() {
        const playerNames = [];
        document.querySelectorAll('.player-input').forEach(input => {
            const playerName = input.value.trim();
            if (playerName !== '') {
                playerNames.push(playerName);
            }
        });

        if (playerNames.length === 0) {
            alert('プレイヤー名を入力してください。');
            return;
        }

        const selectedRoles = Array.from(rolesSelect.selectedOptions, option => option.value);

        if (selectedRoles.length === 0) {
            alert('少なくとも1つの役職を選択してください。');
            return;
        }

        if (selectedRoles.length > playerNames.length) {
            alert('役職の数がプレイヤー人数より多いです。');
            return;
        }

        const gameMode = gameModeSelect.value;
        setupGame(playerNames, selectedRoles, gameMode);
    });

    function setupGame(players, selectedRoles, gameMode) {
        setupContainer.style.display = 'none';
        gameContainer.style.display = 'block';

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
        roleDisplay.textContent = `あなたの役職：${playerRole[players[0]]}`;
        gameStatusDisplay.textContent = `プレイヤー: ${players.join(', ')}\n役職: ${Object.entries(playerRole).map(entry => `${entry[0]} (${entry[1]})`).join(', ')}\n${gameModeMessage}`;
    }
});
