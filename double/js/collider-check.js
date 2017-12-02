
var t = 0;
var stop;
var isIntersect = false;
var isAcceleration = false;
var loseflg = false;

// 開始時間の取得
var start = new Date();

// その他経過時間表示用変数
var count = 120; //カウントダウンの数字を格納する変数
var min = 0; //残り時間「分」を格納する変数
var sec = 0; //残り時間「秒」を格納する変数
var stp = null; //setInerval・clearInervalを制御する変数
var i = 0; //ボタンの2回クリック等禁止イベントを制御する変数
var nowTime = 0;
var datet = 0;

// 歩数カウント用変数
var nowSteps = 0;

const HEIGHT_UPPER_LIMIT = 150;
const RIGING_SPEED = 2;
const LOOKING_DOWN_SPEED = 2;
const RETURN_START_TIME = 10;
//var cnt = 0;

// 勝敗結果表示用変数
//var result = '';

var socketio = io.connect('http://54.178.168.53:5000/');

socketio.on("getposition", function(player_id, cameraposition) {});
socketio.on("setposition", function (player_id, cameraposition) { synchro(player_id, cameraposition); });
socketio.on("setresult", function (player_id) { setmessage(player_id); });

//socketio.emit("getposition", player_id);

// ポジションをサーバに送信
function getposition() {
  var element = document.getElementById(player_id);
  var cameraposition = element.getAttribute('position')
  socketio.emit("getposition", player_id, cameraposition);
}

function synchro(player_id, cameraposition){

  var opponent = document.getElementById(player_id);
  //var opponentposition = opponent.getAttribute('position')
  opponent.setAttribute('position', cameraposition);
  var opponentposition = opponent.getAttribute('position')
  // 相手がゴールしたら負けフラグをたてる
  if (opponentposition.z <= 18){
    loseflg = true;
  }

}

// 対戦結果をサーバに送信
function setresult() {
  socketio.emit("setresult", player_id);
}

function setmessage(player_id){

  var camera = document.getElementById(player_id);
  var position = camera.getAttribute('position');

  if (position.z <= 18) {
  
    // player1の勝ち！
    if (player_id == 'camera'){
      var win1 = document.getElementById("win1");
      win1.setAttribute('visible', 'true');
      var lose2 = document.getElementById("lose2");
      lose2.setAttribute('visible', 'true');
    }
    // player2の勝ち！
    if (player_id == 'camera2'){
      var win2 = document.getElementById("win2");
      win2.setAttribute('visible', 'true');
      var lose1 = document.getElementById("lose1");
      lose1.setAttribute('visible', 'true');
    }
  
  }
  
}


AFRAME.registerComponent('collider-check', {
  dependencies: ['raycaster'],
  init: function () {
    this.el.addEventListener('raycaster-intersection', function () {
      isIntersect = true;
      
    });
    this.el.addEventListener('raycaster-intersection-cleared', function () {
      isIntersect = false;
    });
  }
});

/*
 * 重力加速度を取得するファンクション
 */
window.addEventListener("devicemotion", findAcceleration);
function findAcceleration(evt) {
  if (evt.acceleration.x > 2) {
    isAcceleration = true ;
  } else {
    isAcceleration = false ;
  }
}

function movePlayer() {

  var camera = document.getElementById(player_id);

    /* カメラの位置を取得 */
    var position = camera.getAttribute('position')
    var rotation = camera.getAttribute('rotation')

    /* isIntersect,x,y,z軸の値 */
    var str;
    /*str = isIntersect + ", " + position.x + ", " + position.y + ", " + position.z ;*/
    var camera1 = document.getElementById("camera");
    var position1 = camera1.getAttribute('position');
    //str = position1.x + ", " + position1.y + ", " + position1.z ;
    str = '';

    document.getElementById("cameraPos").textContent = str;

    // 勝敗判定
    if (!loseflg){
      // ゴール判定
      if ( position.z >= 18 ){
      
        //if (rotation.x < -25 ){
        
        if ( isAcceleration ) {

          if (camera && !isIntersect) {

            var cameraposition = camera.getAttribute('position')
            var camerarotation = camera.getAttribute('rotation')

            cameraposition.x -= 0.6 * Math.sin(Math.PI * (camerarotation.y) / 180);
            cameraposition.z -= 0.6 * Math.cos(Math.PI * (camerarotation.y) / 180);
            camera.setAttribute('position', cameraposition);

            // 歩数カウントのインクリメント
            //nowSteps ++;

            // 歩数の表示
            document.getElementById("steps").textContent = '';
          }

        }
        
      }
      else{
      
        setresult();

      }
    }
    else{
      // ゆっくり下を向く
      var camera = document.getElementById(player_id);
      var position = camera.getAttribute('position')
      var rotation = camera.getAttribute('rotation')
      
      if (rotation.x > -90 ){
          rotation.x = rotation.x - LOOKING_DOWN_SPEED;
      }
      camera.setAttribute('rotation', rotation);

      // 上限まで浮上
      if (position.y < HEIGHT_UPPER_LIMIT) {
        position.y += RIGING_SPEED;
        camera.setAttribute('position', position);
      }
    }

  getposition();

}

function dispTime() {
  // 現在時刻の取得
  nowTime = new Date();

  datet = parseInt((nowTime.getTime() - start.getTime()) / 1000);

  min = parseInt((datet / 60) % 60);
  sec = datet % 60;

  // 数値が1桁の場合、頭に0を付けて2桁で表示する指定
  if(min < 10) { min = "0" + min; }
  if(sec < 10) { sec = "0" + sec; }

  // フォーマットを指定
  var timer = min + ':' + sec;

  // 経過時間の表示
  document.getElementById("time").textContent = timer;
}

function render() {

  t += 0.01;
  requestAnimationFrame(render);

  movePlayer();

  dispTime();

}
render();
