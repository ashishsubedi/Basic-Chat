window.WebSocket = window.WebSocket || window.MozWebSocket
const connection = new WebSocket("ws://localhost:3000");

var chatHistory = document.getElementById('history');
var chatForm = document.getElementById('chat');
var submitButton = document.getElementById('send');





var myname = false;
var clickSubmit = false;

var input = document.getElementById('msg_text');
input.addEventListener('keydown', sendMessage);

connection.onopen = (e) => {
    input.removeAttribute('disabled');
    input.setAttribute('placeholder', "Enter Username");
};

connection.onerror = (err) => {
    console.log(err);
};

connection.onclose = (e) => {
    console.log("Connection close with server");
};


connection.onmessage = (data) => {
    console.log("Message Received ");
    console.log(data);
    try {
        var json = JSON.parse(data.data);
    } catch (err) {
        console.log('Invalid JSON: ', data.data);
        return;
    }
    if (json.type === 'history') {
        json.data.forEach(obj => {
            chatHistory.innerHTML += 
               ` <p><span> >>> ${obj.username}@${obj.time} : ${obj.text} </span></p>
            `;
        });
    }
    if (json.type === 'message') {
        console.log('Message Received');
        chatHistory.innerHTML += ' <p><span> >>>' + json.data.username + '@' + json.data.time + ':  ' + json.data.text + '</span></p>'; chatHistory.append();

    }

   
    chatHistory.scrollTop = chatHistory.scrollHeight;
};

function sendMessage(e) {
    
    if (e.code === 'Enter' || clickSubmit === true) {
        e.preventDefault();
        var msg = input.value;
        if (!msg) {
            return;
        }
        connection.send(msg);
        input.setAttribute('placeholder', 'Enter Message here and hit enter to send');

        input.value = '';

        if (myname === false) {
            myname = msg;
        }
        clickSubmit = false;
    }
}
