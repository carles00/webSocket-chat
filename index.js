let myChat = {
    log: [],

    userInput: null,
    roomCodeInput: null,
    connectButton: null,
    chatName: null,

    textInput: null,
    sendButton: null,
    messageContainer: null,

    server: null,
    userName: null,
    userID: null,
    roomCode: null,

    init: function () {
        this.userInput = document.getElementById("user-name-input");
        this.roomCodeInput = document.getElementById("room-code-input");
        this.connectButton = document.getElementById("connect-button");
        this.chatName = document.getElementById("chat-name");

        this.textInput = document.getElementById("input-text");
        this.sendButton = document.getElementById("send-text");
        this.messageContainer = document.getElementById("message-board");
        
        this.connectButton.addEventListener("click",()=>{
            if(this.userInput.value && this.roomCodeInput.value){
                this.roomCode = this.roomCodeInput.value
                this.userName = this.userInput.value;

                this.chatName.innerText = this.roomCodeInput.value;
                this.connectToRoom();
            }
        });

        this.sendButton.addEventListener("click", myChat.sendMessage);
        this.textInput.addEventListener("keyup", (e) => {
            if (e.code === "Enter") {
                myChat.sendMessage();
            }
        });

        this.server = new SillyClient();
    },

    connectToRoom: function(){
        this.server.connect("wss://ecv-etic.upf.edu/node/9000/ws",`U161671CHAT-${this.roomCode}`);
        
        //set sillyserver functions
        this.server.on_ready = this.onServerReady.bind(this);
        this.server.on_user_connected = this.onUserConnected.bind(this);
        this.server.on_user_disconnected = this.onUserDisconnected.bind(this);
        this.server.on_message = this.onMessage.bind(this);

        let msg = {
           type: "text",
           content: `You have connected to room ${this.roomCode}`,
           username: ""
        }
        myChat.appendSystemMessageToBoard(msg);
    },

    onServerReady: function(id){
        this.userID = id;
    },

    onUserConnected: function(id){
        //create system message
        let msg = {
            type: "text",
            content: `${id} connected`,
            username: ""
        }
        console.log(id)
        myChat.appendSystemMessageToBoard(msg);

        //send log to connected user
        myChat.server.getRoomInfo( `U161671CHAT-${myChat.roomCode}`, function(room_info) { 
            let clients = room_info.clients.sort();
            if(clients[0]==myChat.userID){
                let msg = {
                    type: "history",
                    content: myChat.log,
                    userName: ""
                }

                myChat.server.sendMessage(JSON.stringify(msg),[id]);
            }
        });
    },

    onUserDisconnected: function(id){
        let msg = {
            type: "text",
            content: `${id} disconnected`,
            username: ""
        }
        myChat.appendSystemMessageToBoard(msg);
    },

    onMessage: function(id, msg){
        let message = JSON.parse(msg);
        if(message.type === "text"){
            myChat.appendMessageToBoard(message);
        }else if(message.type === "history"){
            let log = message.content;
            console.log(log);
            log.forEach(element => {
                myChat.appendMessageToBoard(element);
            });
        }
        myChat.log.push(message);
    },

    sendMessage: function () {
        //create and send message to room
        let message = myChat.textInput.value;
        if (message) {
            let msg = {
                type: "text",
                content: message,
                username: myChat.userName
            }
            myChat.appendMessageToBoard(msg);
            myChat.log.push(msg);
            myChat.server.sendMessage(JSON.stringify(msg));
        }
    },

    appendMessageToBoard: function(msg){
        //create message div and append to message board
        let messageDiv = document.createElement("div");
        
        let classString = "message user-message"
        if(msg.username !== myChat.userName){
            classString = "message contact-message"
            let authorDiv = document.createElement("div");
            authorDiv.className = "message-author"
            authorDiv.innerText = msg.username;
            messageDiv.appendChild(authorDiv);
        }
        messageDiv.className = classString;
        let textDiv = document.createElement("div");
        textDiv.className = "message-content";
        textDiv.innerText = msg.content;
        messageDiv.appendChild(textDiv);

        this.messageContainer.prepend(messageDiv);  
        this.messageContainer.scrollTop = myChat.messageContainer.scrollHeight;
        this.textInput.value = "";
    },

    appendSystemMessageToBoard: function(msg){
        //create and append system message
        let messageDiv = document.createElement("div");
        
        let classString = "message sys-message"
        messageDiv.className = classString;
        let textDiv = document.createElement("div");
        textDiv.className = "sys-message-content";
        textDiv.innerText = msg.content;
        messageDiv.appendChild(textDiv);

        this.messageContainer.prepend(messageDiv);  
        this.messageContainer.scrollTop = myChat.messageContainer.scrollHeight;
        this.textInput.value = "";
    }
};

myChat.init();


