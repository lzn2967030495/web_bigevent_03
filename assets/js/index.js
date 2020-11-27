$(function () {
    // 渲染图片头像和文字头像
    getUserInfo()

    // 实现退出功能
    var layer = layui.layer
    $('#btnOut').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储中的 token
            localStorage.removeItem('token')
            // localStorage.removeItem('href')
            // 重新跳转登录页面
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
})

// 渲染图片头像和文字头像
function getUserInfo() {
    // 发送ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求配置对象 /my/ 开头都需要
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            // {status: 0, message: "获取用户基本信息成功！", data: {…}}
            // 判断
            if (res.status !== 0) {
                return layer.msg("获取用户信息失败！", { icon: 5 })
            }
            // 成功渲染头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户名称
    // data: {id: 26079, username: "An", nickname: "阿楠", email: "2967030495@qq.com"}
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    // user_pic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQA…l+IKkkyVxAV0yk+Pn/R+J710oxM74bAAAAABJRU5ErkJggg=="
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        // 文本头像隐藏
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase() // toUpperCase() 大写 第一个字或字母
        // console.log(first);
        $('.text-avatar').html(first).show()
    }
}