// const remote = require('electron').remote;
// const Menu = remote.Menu;
// const MenuItem = remote.MenuItem;

//渲染进程
const ipc = require('electron').ipcRenderer;


console.log(ipc);

// var menu = new Menu.buildFromTemplate([
//     {
//         label: '菜单',
//         submenu: [
//             {
//                 label: '打开新窗口',
//                 click: function(){
//                     ipc.send('zqz-show') //注册的指令。send到主进程index.js中。
//                 }
//             }
//         ]
//     }
// ])

// document.getElementById('btn').onclick = function () {
//     ipc.send('zqz-show');
// }

// Menu.setApplicationMenu(menu);