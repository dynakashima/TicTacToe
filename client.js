      var socket = io();
      var currentState = 'waiting';
      var lastPlayed = '';
      var letter = '';

      function addBoardToHtml(b) {
        for (var i = 0; i < b.length; i++) {
          var row = b[i];
          var htmlTag = '#row' + i;
          for (var j = 0; j < row.length; j++) {
            var letter = row[j];
            var newTag = ' [data-x="' + j + '"]';
            $(htmlTag + ' ' + newTag).html(letter);
          };
        };
      }

      function flashError($errorBox) {
        $errorBox.fadeIn(600, function() {
          $errorBox.fadeOut(600);
        });
      }

      function stateMux(state) {
        if (state === 'waiting') {
          $('h1').hide();
          $('#waiting').show();
          $('#main').hide();
        }
        else if (state === 'inGame') {
          $('h1').hide();
          $('#main').show();
        }
        // end game
        else if (state === 'win') {
          $('#main').hide();
          $('#win').show();
        }
        else if (state === 'loss') {
          $('#main').hide();
          $('#lost').show();
        }
        else if (state === 'tie') {
          $('#main').hide();
          $('#tie').show();
        }
        else if (state === 'interrupted') {
          $('#main').hide();
          $('#interrupted').show();
        }
      }

      // bind refresh button to refresh
      $('button').click(function() {location.reload(true);});

      // if it is correct turn, send out move and wait for
      // state change
      $('.col').click(function() {
        if (lastPlayed !== letter) {
          var data = $(this).data();
          data.letter = letter;
          socket.emit('player moved', data);
        }
        else {
          flashError($("#not-turn"));
        }
      });

      socket.on('status update', function(stats) {
        currentState = stats;
        stateMux(currentState);
      });

      socket.on('setletter', function(let) { letter = let; });

      socket.on('board changed', function(data) {
        addBoardToHtml(data.board);
        lastPlayed = data.player;
      });