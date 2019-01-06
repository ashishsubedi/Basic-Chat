const express = require('express');
const path = require('path');
var WebSocketServer = require('websocket').server;

const http = require('http');
const host = "localhost"
const Port = 3000;
const app = express();

const server = http.createServer(app);

let clients = [], history = [];

server.listen(Port, host, () => {
    console.log("Express Server at port " + host + " :" + Port);
});

app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/css', express.static(path.join(__dirname, '/css')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

//Handle web scokets
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', (req) => {
    console.log((new Date()) + " Connection from origin " + req.origin);
    
    /// console.log(req);
    const connection = req.accept(null, req.origin);
    clients.push(connection);
    var index = clients.length - 1;
    var username = false;
    console.log(new Date() + " Clients: ");
    clients.forEach(client =>{
        console.log(client.remoteAddress);
    })

    if (history.length > 0) {
        connection.sendUTF(JSON.stringify({
            type: 'history',
            data: history
        }));
    }

    connection.on('message', (data) => {

        if(username === false){
            username = data.utf8Data;
            console.log(new Date() + " Username set: "+ username);
        }else{
            console.log(new Date() + " Messaged Received from: "+ username + " message: "+ data.utf8Data);
            var obj =  {
                time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                text : data.utf8Data,
                username : username
            };
            history.push(obj);
            history = history.slice(-100);

            var json = JSON.stringify({type: 'message', data: obj});
            clients.forEach(client=>{
                client.sendUTF(json);
                console.log('Message sent to client');
            })
            
        }
    });

    connection.on('close', (req) => {
        console.log((new Date()) + " Connection closed from origin " + connection.remoteAddress);
        clients.splice(index, 1);
        /// console.log(req);
    });

});









