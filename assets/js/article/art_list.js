$(function () {

    // 定义美化时间格式的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义查询参数对象q
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cata_id: '', // 文章分类的 ID
        state: '' // 文章的发布状态
    }

    // 请求文章列表数据并使用模板引擎渲染列表结构
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // 渲染
                var html = template('tpl-table', res)
                $('tbody').html(html)
                // 分页功能
                renderPage(res.total)
            }
        })
    }

    var form = layui.form
    // 发起请求获取并渲染文章分类的下拉选择框
    initCate()
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-option', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 实现筛选的功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 查询q参数
        q.cata_id = cate_id
        q.state = state
        // 重新渲染
        initTable()
    })

    // 分页功能
    var laypage = layui.laypage
    function renderPage(total) {
        // console.log(total); // 几条数据
        // 定义渲染分页的方法
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 第几页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条

            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 改变当前页面
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    // 删除
    var layer = layui.layer
    $('tbody').on('click', '.btn-del', function () {
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 页面删除出现的问题
                    if ($('.btn-del').length == 1 && q.pagenum > 1) q.pagenum--
                    // 重新渲染
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})