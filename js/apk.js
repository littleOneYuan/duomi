// 游戏包链接
$(document).ready(function() {

    $.post(base_url + "gameInfo", {
            "pt": 1,
            "g": 125
        },
        function(res) {
            if (res.code === 200) {
                let data = res.data
                console.log(data)
                console.log("game_url:" + data.game_url)
            }
        });

});