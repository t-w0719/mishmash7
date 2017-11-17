// 定数群
const TIME_OUT = 20;

var t = 0;
var isIntersect = false;
var isAcceleration = false;
var isDis = false; // ゴールした際に時間経過を１回だけ行うためのフラグ

var animationFrameId;

// その他経過時間表示用変数
var count = TIME_OUT; //カウントダウンの数字を格納する変数
var min = 0; //残り時間「分」を格納する変数
var sec = 0; //残り時間「秒」を格納する変数
var stp = null; //setInerval・clearInervalを制御する変数
var i = 0; //ボタンの2回クリック等禁止イベントを制御する変数

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

function movePlayer() {

  var camera = document.getElementById('camera');

  /* カメラの位置を取得 */
  var position = camera.getAttribute('position');
  var rotation = camera.getAttribute('rotation');

  // ゴール判定
  if ( position.z >= -2 ) {
    // 未ゴール
    if (count <= 0) {
      // 120秒を経過したら、高さ30まで浮上
      // ゆっくり下を向く start
//      if (rotation.x > -90 ){
  //        rotation.x = rotation.x - 1;
    //  }
      //camera.setAttribute('rotation', rotation);
      // ゆっくり下を向く end

      if (position.y < 100) {
        position.y += 2.5;
        camera.setAttribute('position', position);
      }

      if (!isDis) {
        isDis = true;
        setTimeout(function(){
          var msg = document.getElementById('msg');
          msg.setAttribute('visible', 'true');
        }, 3000);
      }

//      if (count < -10 ){
//        count_reset();
  //    }
    } else if ( isAcceleration ) {
    // 特定の加速度になったら進む(足踏みで動く程度の加速度)
      if (camera && !isIntersect) {

        position.x -= 0.6 * Math.sin(Math.PI * (rotation.y) / 180);
        position.z -= 0.6 * Math.cos(Math.PI * (rotation.y) / 180);
        camera.setAttribute('position', position);

        // 歩数カウントのインクリメント
        nowSteps ++;
        nowSteps = nowSteps + 0.06;
        tmpNowSteps = Math.round(nowSteps);

        // 歩数の表示
        document.getElementById("steps").textContent = tmpNowSteps;
        var steps2 = document.getElementById('steps2');
        steps2.setAttribute('value', tmpNowSteps);
      } else {
        // 衝突したら跳ね返る
        position.x += 0.6 * Math.sin(Math.PI * (rotation.y) / 180);
        position.z += 0.6 * Math.cos(Math.PI * (rotation.y) / 180);
        camera.setAttribute('position', position);
      }
    }
  } 
/*
else if (position.z < -2 && !isGoal) {
    // ゴール
    isGoal = true;
    goal_action();

    var goal = document.getElementById('goal');
    goal.setAttribute('visible', 'true');

    var audiomain = document.getElementById('audiomain');
    audiomain.components.sound.stopSound();
 
    var audiogoal = document.getElementById('audiogoal');
    audiogoal.components.sound.playSound();
  }
*/
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
  } else if(count <= 0) {
    count--;
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

// タイマーストップ時のアクション
function count_stop(){
  clearInterval(stp);
  i = 0;
}

// ゴールした時のアクション
function goal_action(){
  if (isGoal) {
    count_stop();
    setTimeout(function(){
      var audiogoal = document.getElementById('audiogoal');
      audiogoal.components.sound.stopSound();
      var audiomain = document.getElementById('audiomain');
      audiomain.components.sound.playSound();
      var goal = document.getElementById('goal');
      goal.setAttribute('visible', 'false');
      isGoal = false;
      count_reset();
    }, 12500);
  }
}

// タイマーリセット時のアクション
function count_reset(){
  var camera = document.getElementById('camera');
  var cur_camera = document.getElementById('cur_camera');

  // カメラの位置を取得
  var position = camera.getAttribute('position');
  var rotation = camera.getAttribute('rotation');

  // カーソルの位置を取得
  var cur_position = cur_camera.getAttribute('position');

  // 位置の初期化
  position.x = 35;
  position.y = 2;
  position.z = 75;
  cur_position.x = 35;
  cur_position.y = 2;
  cur_position.z = 75;
  camera.setAttribute('position', position);
  cur_camera.setAttribute('position', cur_position);

  // 向きの初期化
  rotation.x = 0;
  rotation.y = 0;
  rotation.z = 0;
  camera.setAttribute('rotation', rotation);

  // 歩数の初期化
  nowSteps = 0;
  document.getElementById("steps").textContent = nowSteps;
  var steps2 = document.getElementById('steps2');
  steps2.setAttribute('value', nowSteps);

  // タイマーの初期化
  count_stop();
  count = TIME_OUT;
  min = parseInt(count / 60);
  sec = count % 60;
  i = 0;
  var count_down = document.getElementById("default");
  var timer = ("0"+min).slice(-2) + ":" + ("0"+sec).slice(-2);
  document.getElementById("time").textContent = timer;
  var time2 = document.getElementById('time2');
  time2.setAttribute('value', timer);

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

