// 文章列表
const base_url = 'https://dmhd.***.com/dmhd/'

$(document).ready(function() {

    $.post(base_url + "articleList", {},
        function(res) {
            if (res.code === 200) {
                let data = res.data
                console.log(data)
                for (var i = 0; i < data.length; i++) {
                    var a = document.createElement('a')
                    a.setAttribute('class', 'page-link-item')
                    let url = 'file:///D:/vsprojects/duomicom/news/new-1.html?link_id=' + data[i].id
                    a.setAttribute('href', url)
                    var span_title = document.createElement('span')
                    var span_time = document.createElement('span')
                    span_title.innerHTML = data[i].title
                    span_time.innerHTML = data[i].add_time
                    span_title.setAttribute('id', data[i].id)
                    span_time.setAttribute('id', data[i].id)
                    a.append(span_title)
                    a.append(span_time)
                    $('#blog-link').append(a)
                }
                // let more_html = '<div class="blog-more"><a href="#">more</a></div>'
                // $('#blog-link').append(more_html)
            }
        });
});
