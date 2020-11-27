$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    var form = layui.form
    form.verify({
        // 密码规则
        Pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        rePwd: function (value) {
            // console.log(value);
            // value - 再次确认密码 通过形参拿到的是确认密码框中的内容
            var pwd = $('.reg-box input[name=password]').val() // 密码
            if (value !== pwd) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 注册功能
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault()
        // 发起注册用户的Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "注册成功！"}
                // 判断返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 提交成功后处理
                layer.msg('注册成功，请登录！', { icon: 6 })
                // 手动切换登录表单
                $('#link_login').click()
                // 重置表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 登录功能
    $("#form_login").on('submit', function (e) {
        // 阻止表达提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "登录成功！", token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC…2MDN9.h9vG4dkOs-8fYc_ArigyUQ-B1Es9Be4FcpuahGOVIBY"}
                // 校验返回状态
                if (res.status !== 0) {
                    // 失败
                    return layer.msg(res.message, { icon: 5 })
                }
                // 成功 提示信息
                layer.msg('恭喜您，登录成功！', { icon: 6 })
                // 保存token值
                localStorage.setItem('token', res.token)
                // 跳转
                location.href = '/index.html'
            }
        })
    })
})