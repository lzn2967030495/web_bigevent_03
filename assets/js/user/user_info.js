$(function () {

    // 校验表单数据
    var form = layui.form
    form.verify({
        nickname: function (value) {
            // 用户名称
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()
    // 获取用户的基本信息
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "获取用户基本信息成功！", data: {…}}
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！', { icon: 5 })
                }
                // 渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 表单重置
    $('#btnSend').on('click', function (e) {
        // 阻止重置行为
        e.preventDefault()
        // 渲染
        initUserInfo()
    })

    // 发起请求更新用户的信息
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "修改用户信息成功！"}
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！', { icon: 5 })
                }
                layer.msg('用户信息修改成功！', { icon: 6 })
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})