var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Set = require("collections/set");
var List = require("collections/list");

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


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

var state = {
	status: 'waiting'
};
var board = [
	['', '', ''],
	['', '', ''],
	['', '', '']
];

var users = [];

function removeArray(array, elem) {
	var index = array.indexOf(elem);
	if (index > -1) {
	    array.splice(index, 1);
	    return false;
	}
	return array;
}
function isEven(num) {return num%2==0;}
function isOdd(num) {return num%2==1;}

io.on('connection', function(socket){
	// users.add(socket.id);
	users.push(socket.id);
	var numUsers = users.length;
	console.log(users.toArray());
	
	if (numUsers >= 2 && 
		isEven(numUsers) &&
		state.status === 'waiting') {
		state.status = 'inGame';
	}
	else {
		state.status = 'waiting';
	}
	io.emit('status update', state.status);
	// io.emit('board changed', board);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	socket.on('player moved', function(move) {
		console.log(move);
		console.log(socket.id);
		var letter = isEven(users.indexOf(socket.id)) ? 'O' : 'X';
		console.log(socket.id);
		board[move.y][move.x] = letter;
		io.emit('board changed', board);
	});
	socket.on('disconnect', function () {
    	removeArray(users, socket.id);
		console.log(users.toArray());
    	io.emit('user disconnected');
  	});
});


http.listen(8080, function(){
  console.log('listening on *:8080');
});
