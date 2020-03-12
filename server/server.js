const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const socket_io = require('socket.io');
const io = socket_io.listen(server);
const cors = require('cors');


const port = process.env.PORT || 3001;

app.use(cors());
app.get('/', (req, res) =>{
    res.send("API working properly!");
});
/*
app.use('/src', express.static(__dirname + '\\src'));// Routing
console.log(__dirname + '\\src');

//app.use('/static', express.static(__dirname + '/src'));// Routing
//app.use('/public', express.static(__dirname + "\\public"));
console.log(__dirname + '\\src');
app.get('/', function(req, res) {
    res.send("API working properly");
    //res.sendFile(path.join(__dirname, '\\public\\index.html'));
});

 */


// create players object
let players = {};

io.on('connection', (socket) => {
    console.log("A User has connected");

    io.emit('hello');
    io.emit("new player");
    console.log("Emitting hello!");
    // when a player joins the game, I should provide them with a starting coordinate

    socket.on('new player', () => {
        console.log("Creating new player");
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });

    socket.on("Player movement", (position) => {
        console.log("Server logging player movement");
        players[socket.id] = {
            x: position[0],
            y: position[1]
        }

        socket.emit("Redraw positions", players)
    })
    /*
    // my movement_obj is an object with 4 keys: left, right, up, down. All are booleans
    socket.on('movement', (movement_obj) =>{
        let player = players[socket.id];

        if(movement_obj.left){
            player.x -= 10;
        }
        if(movement_obj.right){
            player.x += 10;
        }
        if(movement_obj.up){
            player.y -= 10;
        }
        if(movement_obj.down){
            player.y += 10;
        }

    });

     */
});

/*
// this is how often I am emitting the state of the players (position)
setInterval(()=>{
   io.sockets.emit("state", players);
}, 1000/20);
*/

// our http server listens to port 4000
server.listen(port, (err) => {
    if (err) throw err;
    console.log('listening on *:' + port);
});