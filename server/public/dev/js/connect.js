
	
// 全局变量,用来判断是否可以编辑网页代码
var socket = null;
var isSocketOk = false;
// 记录用户
var userObj;

findIP(function (ip) {
	
	var $li = $('<p>'+ip+'</p>');
		$li.appendTo($('.ipAddress'));
	$li.click(function () {
		connectSocket($(this).html());
		$(this).parent().remove();
		$('.dialog').show();
	})
})

// 发起连接
function connectSocket(ip) {
	var baseIP = ip.split('.').slice(0,3).join('.');
	var i = 0;// wang

	// 获取提示信息条
	var dialog = $('.dialog');
	function connectServer() {
		if (i++>=255) {
			dialog.html('抱歉😞!未发现服务器,点击重试或手动连接!');
			$('.ipServer').show().find('button').off('click').on('click',function () {
				if ($(this).siblings().val()) {
					var newIP = 'http://'+$(this).siblings().val()+':8889';
					socket = io.connect(newIP);
					socket.on('connect',function () {
						// $('.ipServer').hide();
						// isSocketOk = true;
						// connectSuccess(socket,dialog);
						connectSuccess(newIP,socket);
					})
					socket.on('connect_error',function () {
						if (!isSocketOk) {
							socket.disconnect();
							socket.close();
							dialog.html('手动连接依然失败,请重新连接!!!');
						}
					})
				}
			});
			dialog.off('click').on('click',function () {
				i = 0;
				connectServer();
			})
			// dialog.parent().css('background','white');
			return;
		}
		var newIP = 'http://'+baseIP+'.'+i+':8889';

		dialog.html('正在查询'+baseIP+'.'+i+'是否为服务器,请稍后'+(i%3 == 1 ? '.':(i%3 == 2 ? '..':'...')))
		socket = io.connect(newIP,{timeout:100,forceNew: true});
		;
		socket.on('connect',function () {

			connectSuccess(newIP,socket);

			// listener(socket,dialog);
			// dialog.html('开始上课!');
			// isSocketOk = true;
			// $('.login').css('display','block');
			// dialog.parent().css('background','white');
			// dialog.off('click').on('click',function () {
			// 	if ($('#username').val()) {
			// 		// 开始发送用户名,用来验证
			// 		socket.emit('login',$('#username').val());
			// 	}else{
			// 		dialog.html('开始上课!'+'名字不可为空');
			// 	}
			// })
		})
		socket.on('connect_error',function () {
			if (!isSocketOk) {
				socket.disconnect();
				socket.close();
				connectServer();
			}
		})
	}
	connectServer();
}

function connectSuccess(ip,socket) {
	// 记录连接成功
	isSocketOk = true;
	$('.bg-model').remove();
	$('#mainDiv').empty();

	// 引入登录页面
	$('#mainDiv').load(ip+'/html/login.html', function () {
		// 动态加载css文件
		loadStyles(ip+'/css/login.css','mainDiv');
		// 动态加载js文件
		
		$.getScript(ip+'/js/jquery.md5.js',function () {
			$.getScript(ip+'/js/login.js', function () {
			})
		})
	})


	// 监听登录成功与否

	socket.on('login',function (obj) {
		if (obj) {
			// 登录成功
			userObj = obj;
			$('#login-html').remove();


			// 改变窗口大小
			try{
				ipc.send('zqz-show');
			}catch(err){
				console.log(err);
			}
			
			// 加载主页面
			$('#mainDiv').load(ip+'/main.html',function () {
				if (obj.roleType>2) {
					$('#file').show();
				}else{
					$('#file').hide();
				}
				//加载css文件
				loadStyles(ip+'/lib/codemirror.css','mainDiv')
				loadStyles(ip+'/css/style.css','mainDiv')
				loadStyles(ip+'/css/themes.css','mainDiv')
				loadStyles(ip+'/css/mobile.css','mainDiv')
				loadStyles(ip+'/css/modal.css','mainDiv')
				loadStyles(ip+'/css/font.css','mainDiv')
				loadStyles(ip+'/css/note.css','mainDiv')
				loadStyles(ip+'/css/animations.css','mainDiv')
				loadStyles(ip+'/note/css/style.css','mainDiv')

				//加载js文件/
				loadScript(ip+'/js/user.js');
				// loadScript(ip+'/js/socket.io.js');
				// loadScript(ip+'/js/getIP.js');
				// loadScript(ip+'/js/wang.js');
				loadScript(ip+'/js/modernizr.custom.js');
				loadScript(ip+'/js/animation.js');
				loadScript(ip+'/note/js/impress.js');
				console.log(userObj);
				$.getScript(ip+'/js/jsbin-4.0.4.js',function () {
					// 加载编辑器
					start({"html":"<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width\">\n  <title>JS Bin</title>\n</head>\n<body>\n\n</body>\n</html>","css":"","javascript":"","url":"http://jsbin.com"}, {"state":{"title":"","description":"","token":"wQecTBfl-EJj8abEn1vcRSFXVctw6DmQ4KpY","stream":false,"streaming":false,"code":null,"revision":null,"processors":{},"checksum":null,"metadata":{},"latest":false},"name":"JS Bin","settings":{"panels":[]},"user":{"settings":{}}}, window, document,undefined,socket,ip);
				})
				// 加载配置文件js
				loadScript(ip+'/js/config.js');
			})
		}else{
			// 登录失败
			$('#login-dialog').html('对不起,用户名或者密码有误!');
		}
	})
	var timeout = null;
	// 消息提示框
	socket.on('tip',function (data) {
		console.log(data);
		console.log($('#tip')[0]);
		if (timeout) {
			clearTimeout(timeout);
		}
		$('#tip').addClass('error').show().find('p').html(data);
		timeout = setTimeout(function () {
			$('#tip a').trigger('click');
		},1500);
	})
	// 监听课程是否结束
	socket.on('noteOver',function (data) {
		userObj.noteOver = data;
	})










}
// 动态加载css文件
function loadStyles(url,id) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementById(id).appendChild(link);
}
// 动态加载js脚本文件
function loadScript(url) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}















