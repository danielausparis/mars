
function Avatar(color, label) {

  var x = 0;
  var y = 0;
  var color = color;
  var label = label;

  var toString = function() {
    console.log('avatar ' + label + ' ' + color + ' x=' + x);
  }

  var incremx = function() {
    x++;
  }

  return {
    toString : toString,
    incremx : incremx
  }
}

var tutu = Avatar('blue', 'pouet');
tutu.toString();

tutu.incremx();
tutu.toString();
