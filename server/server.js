var express = require('express'),sio = require('socket.io');
var _ = require('underscore');
var app = express();
var server = require('http').createServer(app);
app.use('/',express.static(__dirname+'/public'));

server.listen(8889,function () {
	console.log('server success');
});


var userArr = [
	{username:'wang',password:'4297f44b13955235245b2497399d7a93',isEditer:true,group:1,roleType:3,noteOver:false},
	{username:'王涛',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:true,group:1,roleType:1,noteOver:false},
	{username:'邓广宁',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'李杨红',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'张笔文',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'李钇潮',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'康亚芳',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'郭强强',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'李宗阳',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'宋法旭',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'黄建超',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'王钥',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'闫磊',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'袁雄飞',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'李聪珊',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'张苗',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'肖亚男',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'李宇',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'王旭蕾',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'于涛',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'王严慧',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'王震',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'沈杰',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'马超',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'黄陟宸',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'孔德斌',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},
	{username:'aaa',password:'e10adc3949ba59abbe56e057f20f883e',isEditer:false,group:2,roleType:1,noteOver:false},

]


var io = sio.listen(server);
io.sockets.on('connection',function (socket) {
	// socket.on('join',function (name) {
	// 	console.log(name);
	// 	// 记录当前链接者,并记录其名字
	// 	socket.nickname = name;
	// 	// 发出广播,告诉其他人我进来了
	// 	socket.broadcast.emit('announcement','大侠'+name+'进入武林了!');
	// })
	// socket.on('text',function (msg) {
	// 	// 接受消息后,广播给其他人.
	// 	socket.broadcast.emit('text',socket.nickname,msg);
	// })
	socket.on('login',function (username,password) {
		socket.name = username;
		// var index = Object.keys(user).indexOf(name);
		// var obj = index != -1 ? user[name] : null;
		var user = _.findWhere(userArr,{username:username});
		var obj = null;
		if (user && user.password == password) {
			obj = user;
		}
		socket.emit('login',obj);

		// socket.emit('login',user);
		socket.broadcast.emit('tip',username+' 同学进入了课堂!');

	})
	// 监听修改编辑器
	socket.on('updateEditer',function (data) {
		socket.broadcast.emit('updateEditer',data);
	})
	// 监听修改编辑器
	socket.on('scroll',function (data) {
		socket.broadcast.emit('scroll',data);
	})
	// 监听课程是否结束
	socket.on('noteOver',function (data) {
		socket.broadcast.emit('noteOver',data);
	})
	// 监听roletype改变
	socket.on('roleTypeChange',function (data) {
		var name = data.name;
		var roleType = data.roleType;
		var toSocket ;
		if (toSocket = _.findWhere(io.sockets.sockets,{name:name})) {
			toSocket.emit('roleTypeChange',roleType);
		}
	})
	// 监听讲师播放ppt
	socket.on('nextPage',function (data) {
		socket.broadcast.emit('nextPage',data);
	})
	// 监听讲师切换页面
	socket.on('changePage',function (data) {
		socket.broadcast.emit('changePage',data);
	})
})


