document.addEventListener('DOMContentLoaded', function() {
    const $playerList = document.getElementById('player-list');
    const $addPlayerBtn = document.getElementById('add-player-btn');
    const $gotoSetupBtn = document.getElementById('goto-setup-btn');
    const $setupContainer = document.getElementById('setup-container');
    const $gameContainer = document.getElementById('game-container');
    const $playerRoleDisplay = document.getElementById('player-role-display');
    const $playerRole = document.getElementById('player-role');
    const $gameStatusDisplay = document.getElementById('game-status');
    
    let players = [];
    let roleCounts = {
        'villager': 0,
        'werewolf': 0,
        'fortune-teller': 0,
        'guard': 0,
        'hunter': 0,
        'witch': 0,
        'medium': 0,
        'cursed': 0,
        'mason': 0,
        'traitor': 0
    };

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

    // 設定完了ボタンのクリックイベント
    $gotoSetupBtn.addEventListener('click', function() {
        if (confirm('本人確認を行いますか？（オフラインモードのみ）')) {
            setupRoles();
            $setupContainer.style.display = 'none';
            $gameContainer.style.display = 'block';
        } else {
            alert('本人確認に失敗しました。');
        }
    });

    // 役職設定処理
    function setupRoles() {
        const roles = Object.keys(roleCounts);
        roles.forEach(function(role) {
            let count = parseInt(prompt(`役職「${role}」の人数を入力してください：`));
            while (isNaN(count) || count < 0 || count > players.length) {
                count = parseInt(prompt(`無効な入力です。役職「${role}」の人数を再度入力してください：`));
            }
            roleCounts[role] = count;
        });

        assignRolesToPlayers(); // 役職をプレイヤーに割り当てる
    }

    // 役職をプレイヤーに割り当てる
    function assignRolesToPlayers() {
        let availableRoles = [];
        Object.keys(roleCounts).forEach(function(role) {
            for (let i = 0; i < roleCounts[role]; i++) {
                availableRoles.push(role);
            }
        });

        players.forEach(function(player) {
            const randomIndex = Math.floor(Math.random() * availableRoles.length);
            const assignedRole = availableRoles.splice(randomIndex, 1)[0];
            const confirmMessage = `本人確認：${player} さん、あなたの役職は「${assignedRole}」です。`;
            alert(confirmMessage);
            displayPlayerRole(player, assignedRole); // プレイヤーに役職を表示する
        });
    }

    // プレイヤーに役職を表示する
    function displayPlayerRole(playerName, role) {
        const roleDisplayMessage = `${playerName} さん、あなたの役職は「${role}」です。`;
        alert(roleDisplayMessage);
        $playerRoleDisplay.textContent = roleDisplayMessage;
    }
});
