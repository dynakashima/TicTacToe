#####################
#### Tic Tac Toe ####
#####################

2 Player real time tic tac toe game.  Very simple game where two people go
head to head at the classic game of tic tac toe.

Tic Tac Toe
Core
Application uses node.js
User 1 goes to http://localhost:8080/
User 1 is in a “Waiting for opponent state”
User 2 goes to http://localhost:8080/
User 1 and User 2 update to an empty 3x3 grid game board with User 1 to move.
User 1 places an X
User 2 places an O
 
…
 
When three X’s or O’s in a row appear, both User 1 and User 2 are taken to an 
end game state with “You win”, “You lose”, or “Cat’s game (Tie)” respectively 
displayed.

User 3 goes to http://localhost:8080/ (or User 1 or User 2 refreshes the page)
User 3 is in a “Waiting for opponent state”
 
Bonus
Style
Persist state to a database
Completed games
Turn by turn
Match list
Spectate a match

*** NOTE: Some behaviors that I defined, only two people can play at a given 
time, so if a third person joins then the players currently playing will be 
sent an interrupted game message and the third will be in the "waiting state"
****

== Setup ==
Requirements: 
Node and NPM if you do not have this on your computer go to
https://nodejs.org/en/download/
and download appropriate version

run...
npm install
node index.js

in browser, navigate to...
localhost:8080/

*** Note: internet connection is required for this game due to
using cdn's for socketio and jquery ***
