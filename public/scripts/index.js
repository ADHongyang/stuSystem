
function removeStudent(id, name) {
    $('#removeModal .modal-body').text('点击确定将删除' + name)

    $('#removeModal').modal()

    // 防止你瞬间点击两次
    $('#removeModal .btn-danger')
        .off('click')   //移除click事件
        .on('click', function () { //绑定click事件
            $.post(
                '/api/student/remove/' + id,
                null,
                function (res) {
                    if (res.code == 'success') {
                        location.reload()
                    }
                    else {
                        alert(res.message)
                    }
                }
            )
        })
}

// page 当前页
// pageCount 总页数
function showPage(page, pageCount) {
    // 控制一下page的取值范围
    if (page < 1) page = 1
    if (page > pageCount) page = pageCount

    $.post(
        '/api/index/' + 2 + '/' + page,
        $('form').serialize(), // 向服务器端传送的查询数据
        function (res) {
            if (res.code == 'success') {
                var html = template('table-template', res.returnData)
                $('.data').html(html)
            }
            else {
                alert(res.message)
            }
        }
    )
}

// 取第一页的值时执行
showPage(1, 1)