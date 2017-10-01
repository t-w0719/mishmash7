var t = 0;
var isIntersect = false;

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
  var rotation = camera.getAttribute('rotation')

  /* isIntersect,x,y,z軸の値 */
  var str;
  str = rotation.x + ", " + rotation.y + ", " + rotation.z ;

  document.getElementById("cameraPos").textContent = str;

  var element = document.getElementById('camera'); 
    var cameraposition = element.getAttribute('position')
    var camerarotation = element.getAttribute('rotation')

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

function render() {
  t += 0.01;
  requestAnimationFrame(render);
  movePlayer();
}
render();
