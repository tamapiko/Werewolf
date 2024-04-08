document.addEventListener('DOMContentLoaded', function() {
    const $playerList = document.getElementById('player-list');
    const $addPlayerBtn = document.getElementById('add-player-btn');
    const $gotoSetupBtn = document.getElementById('goto-setup-btn');
    const $setupContainer = document.getElementById('setup-container');
    const $roleList = document.getElementById('role-list');
    const $startGameBtn = document.getElementById('start-game-btn');
    const $gameContainer = document.getElementById('game-container');
    const $playerRoleDisplay = document.getElementById('player-role-display');
    const $gameStatusDisplay = document.getElementById('game-status');
    
    let players = [];
    let roles = [];

    // プレイヤー追加ボタンのクリックイベント
    $addPlayerBtn.addEventListener('click', function() {
        const playerName = prompt('プレイヤー名を入力してください（トランプのように表示されます）:');
        if (playerName && !players.includes(playerName)) {
            players.push(playerName);
            renderPlayerList();
        } else {
            alert('無効な名前です。もう一度お試しください。');
        }
    });

    // プレイヤーリスト表示
    function renderPlayerList() {
        $playerList.innerHTML = '';
        players.forEach(function(player) {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');

            const playerName = document.createElement('div');
            playerName.classList.add('player-name');
            playerName.textContent = playerNameToCardFormat(player);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', function() {
                const index = players.indexOf(player);
                if (index !== -1) {
                    players.splice(index, 1);
                    renderPlayerList();
                }
            });

            playerCard.appendChild(playerName);
            playerCard.appendChild(deleteBtn);
            $playerList.appendChild(playerCard);
        });

        if (players.length >= 4) {
            $gotoSetupBtn.style.display = 'block';
        } else {
            $gotoSetupBtn.style.display = 'none';
        }
    }

    // プレイヤー名をトランプ風にフォーマットする関数
    function playerNameToCardFormat(playerName) {
        if (playerName.length > 7) {
            return playerName.slice(0, 7) + '...';
        } else {
            return playerName.padEnd(7, ' '); // トランプのような幅に調整
        }
    }

    // ゲーム設定へ移動するボタンのクリックイベント
    $gotoSetupBtn.addEventListener('click', function() {
        setupRoles();
        $playerRegistration.style.display = 'none'; // メンバー登録画面を非表示にする
        $setupContainer.style.display = 'block'; // ゲーム設定画面を表示する
    });

    // 役職選択処理
    function setupRoles() {
        roles = ['村人', '人狼', '占い師', '狩人', '霊媒師', '狂人', '共有者', '妖狐', '猫又', 'ボディーガード'];
        $roleList.innerHTML = '';
        roles.forEach(function(role) {
            const roleOption = document.createElement('div');
            roleOption.classList.add('role-option');

            const roleName = document.createElement('span');
            roleName.textContent = role;

            const roleCountInput = document.createElement('input');
            roleCountInput.setAttribute('type', 'number');
            roleCountInput.setAttribute('min', '0');
            roleCountInput.setAttribute('max', players.length.toString());
            roleCountInput.value = '0';

            roleOption.appendChild(roleName);
            roleOption.appendChild(roleCountInput);
            $roleList.appendChild(roleOption);
        });
    }

    // ゲーム開始ボタンのクリックイベント
    $startGameBtn.addEventListener('click', function() {
        assignRoles();
    });

    // 役職割り当て処理
    function assignRoles() {
        roles.forEach(function(role, index) {
            const roleCountInput = $roleList.children[index].querySelector('input');
            const count = parseInt(roleCountInput.value);
            if (count > 0) {
                assignRoleToPlayers(role, count);
            }
        });
    }

    // プレイヤーに役職を割り当てる
    function assignRoleToPlayers(role, count) {
        const assignedPlayers = [];
        for (let i = 0; i < count; i++) {
            let playerIndex = getRandomPlayerIndex();
            while (assignedPlayers.includes(playerIndex)) {
                playerIndex = getRandomPlayerIndex();
            }
            assignedPlayers.push(playerIndex);
            const playerName = players[playerIndex];
            const roleDisplayMessage = `${playerName} さんの役職は「${role}」です。`;
            alert(roleDisplayMessage);
        }
    }

    // ランダムなプレイヤーインデックスを取得する
    function getRandomPlayerIndex() {
        return Math.floor(Math.random() * players.length);
    }
});
