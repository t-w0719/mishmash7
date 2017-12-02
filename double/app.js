var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(5000);
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

var camera, camera2;

var player1 = 'camera';
var player2 = 'camera2';
var position1 = '34 2 77';
var position2 = '36 2 77';

var cnt = 50;

io.sockets.on("connection", function (socket) {

  // 接続開始カスタムイベント
  socket.on("connected", function (name) {
  
    if (camera === undefined) {
      camera = {};
      camera.socketid = socket.id;
      name = 'camera';
      userHash[socket.id] = name;
      io.to(socket.id).emit("set_player", name);
    
    }
    else {
    
      camera2 = {};
      camera2.socketid = socket.id;
      name = 'camera2';
      userHash[socket.id] = name;
      io.to(socket.id).emit("set_player", name);
    
    }

  });
  
  socket.on("disconnect", function(name) {
    if (socket.id === camera) {
        name = undefined;
        return;
    }

    if (socket.id === camera2) {
        name = undefined;
        return;
    }
    
  });

  // プレーヤーの位置情報送信
  socket.on("getposition", function(player_id, cameraposition) {

    if (player_id == 'camera'){
      position1 = cameraposition;
    }
    else{
      position2 = cameraposition;
    }
    
    if (player_id == 'camera'){
      io.sockets.emit("setposition", player2, position2);
    }
    else{
      io.sockets.emit("setposition", player1, position1);
    }
    
  });
  
  socket.on("setresult", function(player_id) {
  
    if (player_id == 'camera'){
      //プレーヤー１が勝ちました
      io.sockets.emit("setresult", player_id, "");
    }
    else{
      //プレーヤー２が勝ちました
      io.sockets.emit("setresult", player_id, "");
    }

  });
  
  // カウントダウン表示
  socket.on("countdown", function (count) {

    count = cnt;
    
    
    io.sockets.emit("setcount", count);
    
    cnt--;

  });
  

});
