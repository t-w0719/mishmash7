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

  if (camera && !isIntersect) {
    var element = document.getElementById('camera'); 
    var cameraposition = element.getAttribute('position')
    var camerarotation = element.getAttribute('rotation')

    cameraposition.x -= 0.03 * Math.sin(Math.PI * (camerarotation.y) / 180);
    cameraposition.z -= 0.03 * Math.cos(Math.PI * (camerarotation.y) / 180);
    element.setAttribute('position', cameraposition);
  }
}

function render() {
  t += 0.01;
  requestAnimationFrame(render);
  movePlayer();
}
render();
