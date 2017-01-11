myApp.factory('notification', function() {

  var hidden = true;
  var _action = null;

  var show = function(notifid, text, type, icon, action) {

    notifelt = document.getElementById(notifid);
    _action = action;
    notifelt.addEventListener("click", function() { hide(notifid) });

    notifelt.classList.remove('w3-pale-red');
    notifelt.classList.remove('w3-khaki');
    notifelt.classList.remove('w3-light-green');

    if (type == 'alert') {
      notifelt.classList.add('w3-pale-red');
    } else if (type == 'success') {
      notifelt.classList.add('w3-light-green');
    } else if (type == 'inform') {
      notifelt.classList.add('w3-khaki');
    } else {
      notifelt.classList.add('w3-khaki');
    }

    iconstring = '';
    if (icon == 'thumbdown') {
      iconstring = '<i class="fa fa-thumbs-down w3-xxlarge" aria-hidden="true"></i>';
    } else if (icon == 'thumbup') {
      iconstring = '<i class="fa fa-thumbs-up w3-xxlarge" aria-hidden="true"></i>';
    }

    setTimeout(function(){ hide(notifid) }, 3000);

    notifelt.children[0].innerHTML = iconstring + '&emsp;<b>' + text +'</b>';

    dx = -100;

    var id = setInterval(frame, 10);

    function frame() {

      if (dx == 0) {
        clearInterval(id);
        hidden = false;
      } else {
        dx++;
      }
      notifelt.style.top = dx + 'px';
    }

  }

  var hide = function(notifid) {

    if (hidden) return;

    hidden = true;

    notifelt = document.getElementById(notifid);

    dx = 0;

    var id = setInterval(frame, 10);

    function frame() {

      if (dx == -100) {
        clearInterval(id);
        if (_action != undefined) {
          _action();
          _action = null;
        }
      } else {
        dx--;
      }
      notifelt.style.top = dx + 'px';
    }

  }

  return {
    show: show
  }


});
