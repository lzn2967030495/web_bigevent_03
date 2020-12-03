$(function () {

    // 封装函数 获取数据
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // 渲染数据
                var html = template('tpl-table', res)
                $('tbody').html(html)
            }
        })
    }

    var indexAdd = null

    // 给添加类别实现弹出层
    var layer = layui.layer
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: '1',
            title: '添加文章分类',
            area: ['500px', '300px'],
            content: $("#btn-add").html()
        });
    })

    // 添加文章分类的功能
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止提交
        e.preventDefault()
        // 发送请求
        $.ajax({
            method: "post",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "新增文章分类成功！"}
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 重新渲染
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })

    // 修改表单 展示
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        // 显示添加区域
        indexEdit = layer.open({
            type: '1',
            title: '修改文章分类',
            area: ['500px', '300px'],
            content: $("#btn-edit").html()
        });
        // 获取id，发送请求，渲染页面
        var id = $(this).attr('data-id')
        // alert(id)
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改表单 提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 重新渲染
                initArtCateList()
                layer.msg(res.message)
                layer.close(indexEdit)
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-del', function () {
        // 获取id
        var id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 关闭
                    layer.close(index);
                    // 重新渲染
                    initArtCateList()
                }
            })
        });
    })
})