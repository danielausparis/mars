myApp.controller('LadderController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {


    var Avatar = function(labelparm, idparm) {

      var avt = {};

      avt.slotheight = 90;

      avt.x = 700;

      avt.color = randomColor({luminosity: 'bright'});
      avt.label = "";
      if (labelparm) {
        avt.label = labelparm.substring(0, 6);
      }

      avt.domelt = null;
      avt.id = idparm;


      // deep copy constructor
      avt.copy = function() {

        var avatar = new Avatar(avt.label, avt.id);
        if (avt.x != null) {
          avatar.x = avt.x;
        }
        avatar.color = avt.color;
        if (avt.domelt) {
          avatar.domelt = [];
          for (var i = 0; i < avt.domelt.length; i++) {
            avatar.domelt[i] = avt.domelt[i];
          }
        } else {
          avatar.domelt = null;
        }
        return avatar;
      }

      avt.print = function() {
        console.log(avt.label + ' id: ' + avt.id + ' ' + avt.color + ' x=' + avt.x);
      }

      avt.addAvatarTo = function(eltToAppend) {
        var html = '<div class="w3-padding-16 w3-circle w3-center" '
        + 'style="width: 70%; background-color: ' + avt.color
        + '; position: absolute; top: 0;">';
        html += '<h5><b>' + avt.label + '</b></h5>';
        html += '</div>';
        avt.domelt = angular.element(html);
        avt.domelt[0].style.top = avt.x + 'px';
        angular.element(eltToAppend).append(avt.domelt);
      }

      avt.removeAvatarFrom = function(eltContaining) {
        avt.moveToSlot(10);
        //angular.element(eltContaining).remove(domelt);
      }

      avt.moveTo = function(height) {
        avt.x = height;
        avt.domelt[0].style.top = x + 'px';
      }

      avt.moveToSlot = function(slot) {

        var h = slot * avt.slotheight;
        var dx = avt.x;
        avt.x = h;

        console.log('move ' + avt.label + ' from ' + dx + ' to ' + h);

        var id = setInterval(frame, 10);

        function frame() {

          if (dx == h) {
            clearInterval(id);
            console.log('move finished');
          } else if (dx < h) {
            dx++;
          } else if (dx > h) {
            dx--;
          }

          avt.domelt[0].style.top = dx + 'px';
        }

      }

      return avt;

    }


    var AvatarTable = function() {

      var avatartable = [];
      var newavatartable = [];
      var ranktable = [];
      var ladderelt = null;

      var setAvatar = function(i, x) {
        //console.log('set ' + avatartable[i].label + ' to ' + x);
        avatartable[i].x = x;
      }

      var logit = function(table) {
        for (var i = 0; i < table.length; i++) {
          table[i].print();
        }
      }

      var exists = function(id, table) {
        for (var i = 0; i < table.length; i++) {
          if (table[i].id == id) return i;
        }
        return null;
      }

      var firstpass = function(ranktable) {
        // for each initalized elt of avatartable,
        // get its rank in the new rank table
        // and put it at this position in the newavatartable
        // (or eliminate if absent)
        console.log('first pass');
        //logit(avatartable);
        for (var i = 0; i < avatartable.length; i++) {
          avatartable[i].print();
          if (avatartable[i].id) {
            var rank = exists(avatartable[i].id, ranktable);
            if (rank != null) {
              newavatartable[rank] = avatartable[i].copy();
              if (i != rank) {
                //console.log('i=' + i + ' rank=' + rank)
                console.log('move ' + avatartable[i].label + ' to ' + rank);
                avatartable[i].moveToSlot(rank);
                //newavatartable[rank].x = avatartable[i].newX(rank);
                //console.log('new table ' + newavatartable[rank].label
                //  + ' set to ' + avatartable[i].newX(rank));
                //console.log('after move :');
                //avatartable[i].print();
              }
            } else {
              console.log(avatartable[i].label + ' disappears');
              avatartable[i].removeAvatarFrom(ladderelt);
            }
          } else {
            console.log(avatartable[i].id + ' is null');
          }
        }
      }

      var secondpass = function(ranktable) {
        // for each elt of ranktable,
        // check if present in the newavatarTable
        // if not, put it in its place
        console.log('second pass');

        for (var i = 0; i < ranktable.length; i++) {
          var rank = exists(ranktable[i].id, newavatartable);
          if (rank!=null && rank == i) {
            // do nothing
          } else {
            console.log('intro ' + ranktable[i].nickname + ' to ' + i);
            newavatartable[i] = new Avatar(ranktable[i].nickname, ranktable[i].id);
            newavatartable[i].addAvatarTo(ladderelt);
            newavatartable[i].moveToSlot(i);
          }
        }
      }


      var deepcopy = function(sourcetable, desttable) {
        for (var i = 0; i < laddersize; i++) {
          desttable[i] = sourcetable[i].copy();
        }
      }

      var finish = function() {
        //console.log('====================== FINISH =====================');
        deepcopy(newavatartable, avatartable);
        newavatartable = [];
        for (var i = 0; i < laddersize; i++)
          newavatartable.push(Avatar("",null));
      }

      var init = function(table) {

        avatartable = [];
        newavatartable = [];
        ranktable = [];
        for (var i = 0; i < laddersize; i++) {
          avatartable.push(new Avatar("",null));
          newavatartable.push(new Avatar("",null));
          ranktable.push(new Avatar("",null));
        }

        ladderelt = document.getElementById('ladder');

      }

      var process = function(newranktable) {
        firstpass(newranktable);
        console.log('result first pass:');
        logit(avatartable);
        secondpass(newranktable);
        //console.log('result second pass:');
        //logit(avatartable);
        finish();
        //console.log('final result:');
        //logit(avatartable);
        //console.log();
      }


      return {
        init : init,
        process: process,
        setAvatar: setAvatar
      }
    }();


    console.log('ladder');
    $scope.statics = statics;

    var laddersize = 5;

    AvatarTable.init([]);

    $scope.$on('displayavatars', function() {

      // console.log('************received displayavatars event***************');
      // console.log(JSON.stringify(statics.ranktable, null, 4));
      AvatarTable.process(statics.ranktable);

    });

  }
]);
