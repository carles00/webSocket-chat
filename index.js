let myChat = {
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

    init: function () {
        this.userInput = document.getElementById("user-name-input");
        this.roomCodeInput = document.getElementById("room-code-input");
        this.connectButton = document.getElementById("connect-button");

        this.textInput = document.getElementById("input-text");
        this.sendButton = document.getElementById("send-text");
        this.messageContainer = document.getElementById("message-board");
        
        this.connectButton.addEventListener("click",()=>{
            if(this.userInput.value && this.roomCodeInput.value){
                this.userName = this.userInput.value;
                this.connectToRoom(this.roomCodeInput.value);
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

    connectToRoom: function(roomCode){
        this.server.connect("wss://ecv-etic.upf.edu/node/9000/ws",`U161671CHAT-${roomCode}`);
        this.server.on_ready = this.onServerReady.bind(this);
        this.server.on_user_connected = this.onUserConnected.bind(this);
        this.server.on_user_disconnected = this.onUserDisconnected.bind(this);
        this.server.on_message = this.onMessage.bind(this);
    },

    onServerReady: function(id){
        this.userID = id;
    },

    onUserConnected: function(id){
        let msg = {
            type: "text",
            content: `${id} connected`,
            username: ""
        }
        console.log(id)
        myChat.appendSystemMessageToBoard(msg)
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
        console.log(msg);
        myChat.appendMessageToBoard(JSON.parse(msg));
    },

    sendMessage: function () {
        let message = myChat.textInput.value;
        if (message) {
            let msg = {
                type: "text",
                content: message,
                username: myChat.userName
            }
            myChat.appendMessageToBoard(msg);
            myChat.server.sendMessage(JSON.stringify(msg));
        }
    },

    appendMessageToBoard: function(msg){
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


