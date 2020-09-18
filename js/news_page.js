// 文章标题生成

$(document).ready(function() {

    const base_url = 'https://dmhd.caohua.com/dmhd/'

    function getQueryString(name) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
        const str = window.location.search.substr(1).match(reg)
        if (str !== null) {
            return decodeURI(str[2])
        }
        return null
    }

    var link_id = getQueryString("link_id")

    $.post(base_url + "articleInfo", {
            "id": link_id
        },
        function(res) {
            if (res.code === 200) {
                let data = res.data
                console.log(data)
                $("#h1").text(data.title)
                $("#content").html(data.content)
                $("#description").text(data.description)
            }
        });

});