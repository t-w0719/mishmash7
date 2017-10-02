var t = 0;
var isIntersect = false;

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

  if (rotation.x < -35 ){

    if (camera && !isIntersect) {
      var element = document.getElementById('camera'); 
      var cameraposition = element.getAttribute('position')
      var camerarotation = element.getAttribute('rotation')

      cameraposition.x -= 0.04 * Math.sin(Math.PI * (camerarotation.y) / 180);
      cameraposition.z -= 0.04 * Math.cos(Math.PI * (camerarotation.y) / 180);
      element.setAttribute('position', cameraposition);
    }

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
}

function render() {
  t += 0.01;
  requestAnimationFrame(render);
  movePlayer();
  dispTime();
}
render();
