document.addEventListener('DOMContentLoaded', function() {
    const startGameButton = document.getElementById('start-game-btn');
    const playerCountInput = document.getElementById('player-count');
    const rolesSelect = document.getElementById('roles-select');
    const gameContainer = document.getElementById('game-container');
    const roleDisplay = document.getElementById('player-role');
    const gameStatusDisplay = document.getElementById('game-status');

    let selectedRoles = [];

    startGameButton.addEventListener('click', function() {
        const playerCount = parseInt(playerCountInput.value);
        selectedRoles = Array.from(rolesSelect.selectedOptions, option => option.value);

        if (selectedRoles.length === 0) {
            alert('少なくとも1つの役職を選択してください。');
            return;
        }

        if (selectedRoles.length > playerCount) {
            alert('役職の数がプレイヤー人数より多いです。');
            return;
        }

        setupGame(playerCount, selectedRoles);
    });

    function setupGame(playerCount, selectedRoles) {
        gameContainer.style.display = 'block';

        // プレイヤーの役職をランダムに選択して表示する
        const randomRoleIndex = Math.floor(Math.random() * selectedRoles.length);
        const playerRole = selectedRoles[randomRoleIndex];
        roleDisplay.textContent = `あなたの役職：${playerRole}`;

        // ゲーム状態を表示する
        gameStatusDisplay.textContent = `人数: ${playerCount}, 役職: ${selectedRoles.join(', ')}`;
    }
});
