var isNotePage = true;
userObj.isPPT = true;;
var pageId = "#editerPage";
$('#changePage').click(function () {
	if (isNotePage) {
		pageId ="#editerPage";
	}else{
		pageId="#notePage";
	}

	changeView(pageId);

	if (userObj.roleType>2 && !userObj.noteOver) {
		// 讲师上课,来控制页面的切换
		socket.emit('changePage',pageId);
	}

	isNotePage = !isNotePage;
	userObj.isPPT = !userObj.isPPT;
})
var noteOver = false;
$('#file .dropdownmenu a').eq(0).off('click').on('click',function (e) {
	var div2=document.getElementById("div2");
    var div1=document.getElementById("div1");
    div1.className=(div1.className=="close1")?"open1":"close1";
    div2.className=(div2.className=="close2")?"open2":"close2";
    // 广播上下课,用来控制学生是否有权限观看ppt
    noteOver = !noteOver;
    userObj.noteOver = noteOver;
    socket.emit('noteOver',noteOver);
})
// 监听讲师时候切换页面
socket.on('changePage',function (data) {
	changeView(data);
})

// // 加载课程
// $('#impress').load(config+'/html/class.html', function () {
	
// })