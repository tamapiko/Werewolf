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
        players.forEach(function(player) {
            const confirmMessage = `本人確認：${player} さん、あなたの役職を表示しますか？`;
            const confirmed = confirm(confirmMessage);
            if (confirmed) {
                assignRole(player);
            }
        });
    }

    // 役職割り当て
    function assignRole(playerName) {
        const roles = Object.keys(roleCounts).filter(role => roleCounts[role] > 0);
        const randomRole = roles[Math.floor(Math.random() * roles.length)];

        $playerRoleDisplay.textContent = `あなたの役職：${randomRole}`;
        $playerRole.textContent = '';

        const gameStatus = `プレイヤー: ${players.join(', ')}\n役職: 村人 (${roleCounts['villager']}名), 人狼 (${roleCounts['werewolf']}名), 占い師 (${roleCounts['fortune-teller']}名), 守護者 (${roleCounts['guard']}名), 狩人 (${roleCounts['hunter']}名), 魔女 (${roleCounts['witch']}名), 霊媒師 (${roleCounts['medium']}名), 呪われし者 (${roleCounts['cursed']}名), 共有者 (${roleCounts['mason']}名), 裏切り者 (${roleCounts['traitor']}名)`; // 役職に合わせて変更する
        $gameStatusDisplay.textContent = gameStatus;
    }
});
