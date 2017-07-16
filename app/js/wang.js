;

// 获取编辑器中的内容
function getData() {
	jsbin.panels.panels.html.getCode()
}
// 设置编辑器的内容
function setData(data) {
	jsbin.panels.panels.html.SetCode(data)
}
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

function connectSuccess(socket,dialog) {
	listener(socket,dialog);
	dialog.html('开始上课!');
	isSocketOk = true;
	$('.login').css('display','block');
	dialog.parent().css('background','white');
	dialog.off('click').on('click',function () {
		if ($('#username').val()) {
			// 开始发送用户名,用来验证
			socket.emit('login',$('#username').val());
		}else{
			dialog.html('开始上课!'+'名字不可为空');
		}
	})
}


function connectSocket(ip) {
	var baseIP = ip.split('.').slice(0,3).join('.');
	var i = 100;// wang

	// 获取提示信息条
	var dialog = $('.dialog');
	function connectServer() {
		if (i++>=255) {
			dialog.html('抱歉😞!未发现服务器,点击重试!');
			$('.ipServer').show().find('button').click(function () {
				if ($(this).siblings().val()) {
					socket = io.connect('http://'+$(this).siblings().val()+':8889');
					console.log('手动连接');
					socket.on('connect',function () {
						$('.ipServer').hide();
						isSocketOk = true;
						connectSuccess(socket,dialog);
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

		dialog.html('正在查询'+baseIP+'.'+i+'是否为服务器,请稍后')
		socket = io.connect(newIP,{timeout:100,forceNew: true});
		;
		socket.on('connect',function () {
			listener(socket,dialog);
			dialog.html('开始上课!');
			isSocketOk = true;
			$('.login').css('display','block');
			dialog.parent().css('background','white');
			dialog.off('click').on('click',function () {
				if ($('#username').val()) {
					// 开始发送用户名,用来验证
					socket.emit('login',$('#username').val());
				}else{
					dialog.html('开始上课!'+'名字不可为空');
				}
			})
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


function listener(socket,dialog) {
	// 监听用户登录
	socket.on('login',function (obj) {
		if (obj) {
			userObj = obj;
			$('#user').html($('#username').val());

			// 管理员权限设置


			$('.bg-model').css('display','none');

			// 加载编辑器
			var oHead = document.getElementsByTagName('body').item(0);
			var oScript= document.createElement("script");
			oScript.type = "text/javascript";
			oScript.src="js/start.js";
			oHead.appendChild( oScript);

		}else{
			dialog.html('用户名不在本班级中');
		}
	})
	// 监听课程是否结束
	socket.on('noteOver',function (data) {
		userObj.noteOver = data;
	})
}


var isNotePage = true;
$(function () {
	$('#changePage').click(function () {
		if (isNotePage) {
			changeView("#editerPage");
		}else{
			changeView("#notePage");
		}
		isNotePage = !isNotePage;
	})
	var noteOver = false;
	$('#file .dropdownmenu a').eq(0).off('click').on('click',function (e) {
		var div2=document.getElementById("div2");
        var div1=document.getElementById("div1");
        div1.className=(div1.className=="close1")?"open1":"close1";
        div2.className=(div2.className=="close2")?"open2":"close2";
        // 广播上下课,用来控制学生是否有权限观看ppt
        noteOver = !noteOver;
        socket.emit('noteOver',noteOver);
	})
	
})



// 实例化socket对象
// var socket = io.connect('http://172.18.8.7');
// 建立链接通道
// socket.on('connect',function () {
	// 通道连接成功
	
	// socket.emit('join',prompt('大侠!雁过留声,人过留名!'));
	// 放开聊天窗口,让它显示出来
	// document.getElementById('chat').style.display = 'block';

	// // 获取别人进入聊天室的事件
	// socket.on('announcement',function (msg) {
	// 	var li = document.createElement('li');
	// 	li.innerHTML = msg;
	// 	document.getElementById('messages').appendChild(li);
	// })
// })

// // 获取到输入框
// var input = document.getElementById('input');
// document.getElementById('form').onsubmit = function () {
// 	// 发送数据,先把自己发送的数据展示在自己的窗口上
// 	addMessage('我',input.value);
// 	// 发送消息给后台,让后台广播给其他人
// 	socket.emit('text',input.value);
// 	// 清空聊天框内容
// 	input.value = '';
// 	// 重新获取焦点
// 	input.focus();
// 	return false;
// }

// // 展示自己发送的数据
// function addMessage(from,text) {
// 	var li = document.createElement('li');
// 	li.innerHTML = '<b>'+from+'</b>:'+text;
// 	document.getElementById('messages').appendChild(li);

// 	// 让消息始终保持在最底部.
// 	$('ul').scrollTop($('ul')[0].scrollHeight);
// }

// // 接受其他人发来消息
// socket.on('text',addMessage);










