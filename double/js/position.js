/* デバイスの傾きや方角の値が変化したとき */
window.addEventListener('deviceorientation',function(event) {

  /* カメラの位置を取得 */
  var element = document.getElementById('camera'); 
  var position = element.getAttribute('position')

  /* x,y,z軸の値 */
  var str;
  str = position.x + ", " + position.y + ", " + position.z ;

  /* 下記コメントを外すと画面にポジションが表示されます。 */
  /* alert(str); */

});
