      var socket = io();
      var status = 'waiting';
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

      function wipeBoard() {
        for (var i = 0; i < 3; i++) {
          var htmlTag = '#row' + i;
          for (var j = 0; j < 3; j++) {
            var newTag = htmlTag + ' .col' + j;
            $(newTag).html('');
          };
        };
      }

      function stateMux(state) {
        if (state === 'waiting') {
          $('h1').hide();
          $('#waiting').show();
          $('#main').hide();
          wipeBoard();
        }
        else if (state === 'inGame') {
          $('h1').hide();
          $('#main').show();
        }
        // end game
        else if (state === 'win') {
          $('#main').hide();
          $('#win').show();
          wipeBoard();
          socket.removeListener('status update');
          socket.removeListener('board changed');
        }
        else if (state === 'loss') {
          $('#main').hide();
          $('#lost').show();
          wipeBoard();
          socket.removeListener('status update');
          socket.removeListener('board changed');
        }
        else if (state === 'tie') {
          $('#main').hide();
          $('#tie').show();
          wipeBoard();
          socket.removeListener('status update');
          socket.removeListener('board changed');
        }
        else if (state === 'interrupted') {
          $('#main').hide();
          $('#interrupted').show();
          wipeBoard();
          socket.removeListener('status update');
          socket.removeListener('board changed');
        }
      }
      function flashError() {
        $("#not-turn").fadeIn(600, function() {
          $("#not-turn").fadeOut(600);
        });
      }
      $('.col').click(function() {
        console.log('lastPlayed', lastPlayed);
        console.log('letter', letter);
        if (lastPlayed !== letter) {
          var data = $(this).data();
          data.letter = letter;
          socket.emit('player moved', data);
        }
        else {
          flashError();
        }
      });

      socket.on('status update', function(stats) {
        status = stats;
        console.log(status);
        stateMux(status);
      });

      socket.on('setletter', function(let) { letter = let; });

      socket.on('board changed', function(data) {
        addBoardToHtml(data.board);
        
        lastPlayed = data.player;
      });
      socket.on('wipeBoard', wipeBoard);