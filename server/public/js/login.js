$(function () {

	var isLogin = true;
	// 切换注册登录按钮
	$(':submit').siblings().on('click',function () {
		if (isLogin) {
			// 切换成注册状态
			$(this).html('登录');
			$(':submit').val('注册');
		}else{
			// 切换成登录状态
			$(this).html('注册');
			$(':submit').val('登录');
		}
		isLogin = !isLogin;
	})

	// 点击注册登录按钮
	$(':submit').on('click',function (event) {
		if (isLogin) {
			// 登录功能
			var username = $('#username').val();
			var password = $('#password').val();
			if (username && password) {
				socket.emit('login',username,$.md5(password))
				return false;
			}


		}else{
			// 注册功能
			alert('该功能暂未开放!');
			return false;
		}


		
	})
})