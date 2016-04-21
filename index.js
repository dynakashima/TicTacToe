var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Set = require("collections/set");
var List = require("collections/list");

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.get('/tictac.css', function(req, res){
	res.sendFile(__dirname + '/tictac.css');
});
app.get('/client.js', function(req, res){
	res.sendFile(__dirname + '/client.js');
});

Array.prototype.remove = function(elem) {
	var index = this.indexOf(elem);
	if (index > -1) {
	    this.splice(index, 1);
	    return true;
	}
	return false;
};


var currentState = 'waiting';

var board = [
	['', '', ''],
	['', '', ''],
	['', '', '']
];

var users = [];


function isWinner(l, b) {
	// accross
	return (l === b[0][0] && l === b[0][1] && l === b[0][2]) ||
	(l === b[1][0] && l === b[1][1] && l === b[1][2]) ||
	(l === b[2][0] && l === b[2][1] && l === b[2][2]) ||
	// vertical
	(l === b[0][0] && l === b[1][0] && l === b[2][0]) ||
	(l === b[0][1] && l === b[1][1] && l === b[2][1]) ||
	(l === b[0][2] && l === b[1][2] && l === b[2][2]) ||
	// diagonals
	(l === b[0][0] && l === b[1][1] && l === b[2][2]) ||
	(l === b[0][2] && l === b[1][1] && l === b[2][0]);
}

function wipeBoard(b) {
	for (var i = 0; i < b.length; i++) {
		b[i] = ['','','']
	};
	return b;
}

function isTie(board) {
	for (var i = 0; i < board.length; i++) {
		var row = board[i]
		for (var j = 0; j < row.length; j++) {
			var letter = row[j];
			if (letter === '') {
				return false;
			}
		};
	};
	return true;
}

function isEven(num) {return num%2==0;}
function isOdd(num) {return num%2==1;}

function determineNextState(currState, letter) {

	var numUsers = users.length;
	
	if (currState === 'waiting') {
	 	if (numUsers >= 2 && isEven(numUsers)) {
			return 'inGame';
		}
		else {
			return 'waiting';
		}
	}
	else if (currState === 'inGame') {

	 	if (isOdd(numUsers)) {
	 		return 'waiting'
	 	}
	 	else if (isWinner(letter, board)) {
			return 'win';
		}
		else if (isTie(board)) {
			return 'tie'
		}
		return 'inGame'
	}
	return 'waiting';
}

io.on('connection', function(socket){
	function endCurrentGame() {
		var player1 = users[0];
		var player2 = users[1];

		users.remove(player1);
		users.remove(player2);

		io.sockets.connected[player1].disconnect();
		io.sockets.connected[player2].disconnect();
	}

	users.push(socket.id);
	console.log('adding', socket.id);
	console.log('before', users);

	// someone interrupted the game by joining destroy current
	// game and restart state
	if (currentState === 'inGame') {
		if (users.length > 2) {
			endCurrentGame();
			socket.broadcast.emit('status update', 'interrupted');
		}
	}
	console.log('users ->', users);

	var nextState = determineNextState(currentState);
	currentState = nextState;
	console.log('next state', nextState);
	
	var letter = isEven(users.length) ? 'O' : 'X';
	socket.emit('setletter', letter);
  	io.emit('status update', currentState);

	socket.on('player moved', function(move) {
		console.log('users ->', users);
		
		board[move.y][move.x] = move.letter;

		var nextState = determineNextState(currentState, move.letter);

		if (currentState==='inGame') {

		 	if (nextState === 'win') {
		 		// notify winner
				socket.emit('status update', 'win');
				// notify other loss
 				socket.broadcast.emit('status update', 'loss');
 				
 				wipeBoard(board);

 				endCurrentGame();
 			}
 			else if (nextState === 'tie') {
 				io.emit('status update', 'tie');
 				wipeBoard(board);
 				// socket.disconnect();
 				endCurrentGame();
 				users.remove(socket.id);
 			}
		}
		io.emit('board changed', {board: board, player: move.letter});
	});

	socket.on('disconnect', function () {
    	users.remove(socket.id);
  	});
});


http.listen(8080, function(){
  console.log('listening on *:8080');
});
