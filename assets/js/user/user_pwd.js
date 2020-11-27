$(function () {

    // 导入 form 模块
    var form = layui.form
    // 定义规则
    form.verify({
        // 密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不重复
        samePwd: function (value) {
            // value 新密码
            // 获取旧密码
            if (value == $('[name=oldPwd]').val()) {
                return '原密码不能与新密码相同'
            }
        },
        // 两次密码输入相同
        rePwd: function (value) {
            // value 确认密码
            // 获取新密码
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function (e) {
        // 给form表单绑定 submit 事件，在事件处理函数里面取消默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                layui.layer.msg('修改密码成功！', { icon: 6 })
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })

})