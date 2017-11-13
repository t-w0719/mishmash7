// 定数群
const TIME_OUT = 120;

var t = 0;
var isIntersect = false;
var isAcceleration = false;

// その他経過時間表示用変数
var count = TIME_OUT;　//カウントダウンの数字を格納する変数
var min = 0;　//残り時間「分」を格納する変数
var sec = 0;　//残り時間「秒」を格納する変数
var stp = null; //setInerval・clearInervalを制御する変数
var i = 0;　//ボタンの2回クリック等禁止イベントを制御する変数

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

// タイマーカウントスタート
count_start();

function movePlayer() {

  var camera = document.getElementById('camera');

  /* カメラの位置を取得 */
  var position = camera.getAttribute('position')
  var rotation = camera.getAttribute('rotation')

  // ゴール判定
  if ( position.z >= -2 ) {
    // 未ゴール
    if (count === 0) {
      // 120秒を経過したら、高さ30まで浮上
      count_stop();
      // ゆっくり下を向く start
      if (rotation.x > -90 ){
          rotation.x = rotation.x - 1;
      }
      camera.setAttribute('rotation', rotation);
      // ゆっくり下を向く end

      if (position.y < 30) {
        position.y += 0.8;
        camera.setAttribute('position', position);
      }

    } else if ( isAcceleration ) {
    // 特定の加速度になったら進む(足踏みで動く程度の加速度)
      if (camera && !isIntersect) {

        position.x -= 0.8 * Math.sin(Math.PI * (rotation.y) / 180);
        position.z -= 0.8 * Math.cos(Math.PI * (rotation.y) / 180);
        camera.setAttribute('position', position);

        // 歩数カウントのインクリメント
        nowSteps ++;

        // 歩数の表示
        document.getElementById("steps").textContent = nowSteps;
        var steps2 = document.getElementById('steps2');
        steps2.setAttribute('value', nowSteps);
      } else {
        // 衝突したら跳ね返る
        position.x += 0.8 * Math.sin(Math.PI * (rotation.y) / 180);
        position.z += 0.8 * Math.cos(Math.PI * (rotation.y) / 180);
        camera.setAttribute('position', position);
      }
    }
  } else if (position.z < -2) {
    // ゴール
    count_stop();
    var audiomain = document.getElementById('audiomain');
    audiomain.components.sound.stopSound();
 
    var audiogoal = document.getElementById('audiogoal');
    audiogoal.components.sound.playSound();
  }
}

// 1000ミリ秒毎にcount_down関数を呼び出す
function count_start(){
  i++;
  if(i === 1){
    stp = setInterval(count_down,1000);
  } else {
    i = 0;
  }
}

// カウンドダウン表示
function count_down(){
  var time2 = document.getElementById('time2');
  if(count === 1){
    count = 0;
    var display = document.getElementById("default");
    document.getElementById("time").textContent = "TIME UP!";
    time2.setAttribute('value', "TIME UP!");
    clearInterval(stp);
  } else {
    count--;
    min = parseInt(count / 60);
    sec = count % 60;
    var count_down = document.getElementById("default");
    var timer = ("0"+min).slice(-2) + ":" + ("0"+sec).slice(-2);
    time2.setAttribute('value', timer);
    document.getElementById("time").textContent = timer;
  }
}

// ストップボタンクリック時のアクション
function count_stop(){
  clearInterval(stp);
  i = 0;
}

// リセットボタンクリック時のアクション(まだ未実装)
function count_reset(){
  count = TIME_OUT;
  min = parseInt(count / 60);
  sec = count % 60;
  i = 0;
  var count_down = document.getElementById("default");
  var timer = ("0"+min).slice(-2) + ":" + ("0"+sec).slice(-2);
  document.getElementById("time").textContent = timer;
  var time2 = document.getElementById('time2');
  time2.setAttribute('value', timer);
}

function render() {
  t += 0.01;
  requestAnimationFrame(render);
  movePlayer();
}
render();
