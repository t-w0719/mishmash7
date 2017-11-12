var fs = require("fs");
var server = require("http").createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(3000);
var io = require("socket.io").listen(server);

// ���[�U�Ǘ��n�b�V��
var userHash = {};

var camera, camera2;

var player1 = 'camera';
var player2 = 'camera2';
var position1 = '49 2 105';
var position2 = '51 2 105';

io.sockets.on("connection", function (socket) {

  // �ڑ��J�n�J�X�^���C�x���g
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

  // �v���[���[�̈ʒu��񑗐M
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
      //�v���[���[�P�������܂���
      io.sockets.emit("setresult", player_id, "");
    }
    else{
      //�v���[���[�Q�������܂���
      io.sockets.emit("setresult", player_id, "");
    }

  
  });

});
