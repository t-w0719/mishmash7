var t = 0;
var isIntersect = false;
var isAcceleration = false;

// 開始時間の取得
var start = new Date();

// その他経過時間表示用変数
var nowTime = 0;
var min = 0;
var sec = 0;
var datet = 0;

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

  /* isIntersect,x,y,z軸の値 */
  var str;
  /*str = isIntersect + ", " + position.x + ", " + position.y + ", " + position.z ;*/
  str = rotation.x + ", " + rotation.y + ", " + rotation.z ;

  document.getElementById("cameraPos").textContent = str;

  // ゴール判定
  if ( position.z >= -2 ) {
    // 未ゴール
    dispTime();
    if (datet > 300) {
      // 120秒を経過したら、高さ30まで浮上

      // ゆっくり下を向く start
      if (rotation.x > -90 ){
          rotation.x = rotation.x - 1;
      }
      camera.setAttribute('rotation', rotation);
      // ゆっくり下を向く end

      if (position.y < 30) {
        position.y += 0.3;
        camera.setAttribute('position', position);
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

function render() {
  t += 0.01;
  requestAnimationFrame(render);
  movePlayer();
}
render();
