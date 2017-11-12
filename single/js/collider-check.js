var t = 0;
var isIntersect = false;
var isAcceleration = false;

var animationFrameId;

// 開始時間の取得
var start = new Date();

// その他経過時間表示用変数
var nowTime = 0;
var min = 0;
var sec = 0;
var datet = 0;

const GOAL_Z_POS = -2;

const INIT_X_POS = 50;
const INIT_Y_POS = 2;
const INIT_Z_POS = 105;

const TIME_OUT = 10;

const HEIGHT_UPPER_LIMIT = 150;

const RIGING_SPEED = 2;
const LOOKING_DOWN_SPEED = 2;
const RETURN_START_TIME = 10;

// 歩数カウント用変数
var nowSteps = 0;

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
 * add watanabe
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

  var camera = document.getElementById('camera');

  /* カメラの位置を取得 */
  var position = camera.getAttribute('position')
  var rotation = camera.getAttribute('rotation')

 // ゴール判定
  if ( position.z >= GOAL_Z_POS ) {
    // 未ゴール
    dispTime();
    if (datet >= TIME_OUT) {

      // ゆっくり下を向く
      if (rotation.x > -90 ){
          rotation.x = rotation.x - LOOKING_DOWN_SPEED;
      }
      camera.setAttribute('rotation', rotation);

      // 上限まで浮上
      if (position.y < HEIGHT_UPPER_LIMIT) {
        position.y += RIGING_SPEED;
        camera.setAttribute('position', position);
      }

      // 浮上後、特定の時間の経過後、スタートの状態に戻る。
      if (datet >= TIME_OUT + RETURN_START_TIME) {
        returnStart();
      }
    } else if ( isAcceleration ) {
    // 特定の加速度になったら進む(足踏みで動く程度の加速度)
      if (camera && !isIntersect) {

        position.x -= 0.80 * Math.sin(Math.PI * (rotation.y) / 180);
        position.z -= 0.80 * Math.cos(Math.PI * (rotation.y) / 180);
        camera.setAttribute('position', position);

        // 歩数カウントのインクリメント
        nowSteps ++;

        // 歩数の表示
        document.getElementById("steps").textContent = nowSteps;
        var steps2 = document.getElementById('steps2');
        steps2.setAttribute('value', nowSteps);
      } else {
        // 衝突したら跳ね返る
        position.x += 0.3 * Math.sin(Math.PI * (rotation.y) / 180);
        position.z += 0.3 * Math.cos(Math.PI * (rotation.y) / 180);
        camera.setAttribute('position', position);
      }
    }
  } else {
    // ゴール
    var audiomain = document.getElementById('audiomain');
    audiomain.components.sound.stopSound();
 
    var audiogoal = document.getElementById('audiogoal');
    audiogoal.components.sound.playSound();
  }
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

  var time2 = document.getElementById('time2');
  time2.setAttribute('value', timer);
}

function returnStart() {

  var camera = document.getElementById('camera');

  /* カメラの位置を取得 */
  var position = camera.getAttribute('position')
  var rotation = camera.getAttribute('rotation')

  // 位置の初期化
  position.x = INIT_X_POS;
  position.y = INIT_Y_POS;
  position.z = INIT_Z_POS;
  camera.setAttribute('position', position);

  // 向きの初期化
  rotation.x = 0;
  rotation.y = 0;
  rotation.z = 0;
  camera.setAttribute('rotation', rotation);

  // 時間の初期化
  start = new Date();

  // 歩数の初期化
  owSteps = 0;
  
  var steps2 = document.getElementById('steps2');
  steps2.setAttribute('visible', 'false');
  
  var time2 = document.getElementById('time2');
  time2.setAttribute('visible', 'false');

  var cur = document.getElementById('cur');
  cur.setAttribute('visible', 'true');
  
  var start_obj = document.getElementById('start_obj');
  start_obj.setAttribute('visible', 'true');
  
  cancelAnimationFrame(animationFrameId);
}

function render() {
  t += 0.01;
  animationFrameId = requestAnimationFrame(render);
  movePlayer();
}

