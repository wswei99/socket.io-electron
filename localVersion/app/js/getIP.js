function findIP(onNewIP) { //  onNewIp - your listener function for new IPs
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
  var pc = new myPeerConnection({iceServers: []}), // 空的ICE服务器（STUN或者TURN）
    noop = function() {},
    localIPs = {}, //记录有没有被调用到onNewIP这个listener上
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;
 
  function ipIterate(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  pc.createDataChannel(""); //create a bogus data channel
  // pc.createOffer().then(function(sdp) {
  //   sdp.sdp.split('\n').forEach(function(line) {
  //     if (line.indexOf('candidate') < 0) return;
  //     line.match(ipRegex).forEach(ipIterate);
  //   });
  //   pc.setLocalDescription(sdp, noop, noop);
  // }); // create offer and set local description

  pc.createOffer(function (sdp) {
    sdp.sdp.split('\n').forEach(function(line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(ipIterate);
    });
    pc.setLocalDescription(sdp, noop, noop);
  },function (err) {
    console.log(err);
  });

  pc.onicecandidate = function(ice) { //listen for candidate events
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
  };
}
// function addIP(ip) {
//   // console.log('got ip: ', ip);
//   console.log(ip);
// }
// findIP(addIP);
