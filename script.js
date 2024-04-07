$(document).ready(function() {
    const $playerList = $('#player-list');
    const $addPlayerBtn = $('#add-player-btn');
    const $gotoSetupBtn = $('#goto-setup-btn');
    const $setupContainer = $('#setup-container');

    let players = [];

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
        $setupContainer.show();
    });
});
