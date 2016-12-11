myApp.controller('LadderController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {


    function Avatar(labelparm, idparm) {

      var slotheight = 90;

      var x = 0;
      var color = randomColor({luminosity: 'bright'});
      var label = labelparm.substr(0, 9);
      var domelt = null;
      var id = idparm;

      var toString = function() {
        console.log('avatar ' + label + ' ' + color + ' x=' + x);
      }

      var addAvatarTo = function(eltToAppend) {
        var html = '<div class="w3-padding-16 w3-circle w3-center" '
        + 'style="width: 70%; background-color: ' + color
        + '; position: absolute; top: 0;">';
        html += '<h5><b>' + label + '</b></h5>';
        html += '</div>';
        domelt = angular.element(html);
        domelt[0].style.top = x + 'px';
        angular.element(eltToAppend).append(domelt);
      }

      var removeAvatarFrom = function(eltContaining) {
        angular.element(eltContaining).remove(domelt);
      }

      var moveTo = function(height) {
        x = height;
        domelt[0].style.top = x + 'px';
      }

      var moveToSlow = function(height) {
        var h = height;
        console.log('move ' + label + ' to ' + height);
        var id = setInterval(frame, 10);
        function frame() {
          if (x == h) {
              clearInterval(id);
          }
          if (x < h) {
              x++;
          }
          if (x > h) {
              x--;
          }
          domelt[0].style.top = x + 'px';
        }
      }

      var moveToSlot = function(slot) {
        console.log(label + ' is going to ' + (slot * slotheight));
        moveToSlow(slot * slotheight);
      }

      return {
        toString : toString,
        addAvatarTo : addAvatarTo,
        moveTo : moveTo,
        moveToSlow : moveToSlow,
        moveToSlot : moveToSlot,
        label : label,
        removeAvatarFrom : removeAvatarFrom
      }
    }

    var AvatarTable = function() {

      var avatarTable = [];
      var maxsize = 6;

      var exists = function(id) {
        for (var i = 0; i < avatarTable.length; i++) {
          if (avatarTable[i].id == id) return i;
        }
        return null;
      }

      var insertAvatar = function(id, label, rank) {

        if(exists(id)) {
          
        }


      }


      return {

        insertAvatar : insertAvatar

      }
    }


    console.log('ladder');
    $scope.statics = statics;


    var avatarTable = [];
    for (var j = 0; j < 5; j++) {
      avatarTable[j] = Avatar(j.toString(), 23);
      avatarTable[j].addAvatarTo(ladder);
      avatarTable[j].moveTo(0);
      avatarTable[j].toString();
    }

    var timervar = setInterval(onemove, 2000);
    var iters = 0;
    function onemove() {
      console.log('move ' + iters);
      for (var j = 0; j < 5; j++) {
        var slotnum = Math.floor((Math.random() * 5) + 1);
        console.log('moving ' + avatarTable[j].label + ' to slot ' + slotnum);
        avatarTable[j].moveToSlot(slotnum);
      }
      iters++;
      if (iters > 9) {
        clearInterval(timervar);
      }
    }


  }
]);
