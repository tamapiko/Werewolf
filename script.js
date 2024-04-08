document.addEventListener('DOMContentLoaded', function() {
    const players = [];
    const roleCounts = {
        'villager': 0,
        'werewolf': 0,
        // 他の役職も追加
    };

    const $playerList = document.getElementById('player-list');
    const $roleSettings = document.getElementById('role-settings');
    const $addPlayerBtn = document.getElementById('add-player-btn');
    const $gotoSetupBtn = document.getElementById('goto-setup-btn');
    const $setupContainer = document.getElementById('setup-container');
    const $gameContainer = document.getElementById('game-container');
    const $playerRoleDisplay = document.getElementById('player-role');
    const $playerRoleIcon = document.getElementById('player-role-icon');
    const $gameStatusDisplay = document.getElementById('game-status');

    // プレイヤー追加ボタン
    $addPlayerBtn.addEventListener('click', function() {
        const playerName = prompt('プレイヤー名を入力してください:');
        if (playerName && playerName.trim() !== '') {
            players.push(playerName.trim());
            renderPlayerList();
        }
    });

    // 役職人数変更ボタン
    const $numBtns = document.querySelectorAll('.num-btn');
    $numBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const role = btn.getAttribute('data-role');
            if (role) {
                if (btn.textContent === '-') {
                    if (roleCounts[role] > 0) {
                        roleCounts[role]--;
                        updateRoleCount(role);
                    }
                } else if (btn.textContent === '+') {
                    roleCounts[role]++;
                    updateRoleCount(role);
                }
            }
        });
    });

    // 役職人数更新
    function updateRoleCount(role) {
        const $countSpan = document.getElementById(`${role}-count`);
        if ($countSpan) {
            $countSpan.textContent = roleCounts[role];
        }
    }

    // プレイヤーリスト表示
    function renderPlayerList() {
        $playerList.innerHTML = '';
        players.forEach(function(player) {
            const playerItem = document.createElement('li');
            playerItem.textContent = player;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '削除';
            removeBtn.addEventListener('click', function() {
                const index = players.indexOf(player);
                if (index !== -1) {
                    players.splice(index, 1);
                    renderPlayerList();
                }
            });

            playerItem.appendChild(removeBtn);
            $playerList.appendChild(playerItem);
        });

        if (players.length >= 4) {
            $gotoSetupBtn.style.display = 'block';
        } else {
            $gotoSetupBtn.style.display = 'none';
        }
    }

    // 設定完了ボタン
    $gotoSetupBtn.addEventListener('click', function() {
        setupRoles();
        $setupContainer.style.display = 'none';
        $gameContainer.style.display = 'block';
    });

    // 役職設定処理
    function setupRoles() {
        // ここに役職設定のロジックを追加する
        // 役職アイコンの表示や役職説明、初夜占いなしの設定などを実装する
        // 例:
        const currentPlayer = players[0];
        const playerRole = '村人'; // 仮の役職
        const roleIcon = 'villager_icon.png'; // 仮の役職アイコン

        $playerRoleDisplay.textContent = `あなたの役職: ${playerRole}`;
        $playerRoleIcon.src = roleIcon;

        const gameStatus = `プレイヤー: ${players.join(', ')}\n役職: 村人 (${roleCounts['villager']}名), 人狼 (${roleCounts['werewolf']}名)`; // 役職に合わせて変更する
        $gameStatusDisplay.textContent = gameStatus;
    }
});
