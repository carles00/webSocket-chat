let myChat = {
    textInput: null,
    sendButton: null,
    messageContainer: null,

    init: function () {
        myChat.textInput = document.getElementById("input-text");
        myChat.sendButton = document.getElementById("send-text");
        myChat.messageContainer = document.getElementById("message-board");

        myChat.sendButton.addEventListener("click", myChat.sendMessage);
        myChat.textInput.addEventListener("keyup", (e) => {
            if (e.code === "Enter") {
                myChat.sendMessage();
            }
        });
    },

    sendMessage: function () {
        let message = myChat.textInput.value;
        if (message) {
            let msg = {
                type: "text",
                content: message,
                username: ""
            }
            myChat.appendMessageToBoard(msg);
        }
    },

    recieveMessage: function(msg){

    },

    appendMessageToBoard: function(msg){
        let messageDiv = document.createElement("div");
        
        let classString = "message user-message"
        if(msg.username){
            classString = "message contact-message"
            let authorDiv = document.createElement("div");
            authorDiv.className = "message-author"
            authorDiv.innerText = username;
            messageDiv.appendChild(authorDiv);
        }
        messageDiv.className = classString;
        let textDiv = document.createElement("div");
        textDiv.className = "message-content";
        textDiv.innerText = msg.content;
        messageDiv.appendChild(textDiv);
        myChat.messageContainer.prepend(messageDiv);  
        myChat.messageContainer.scrollTop = myChat.messageContainer.scrollHeight;
        myChat.textInput.value = "";
    }
};

myChat.init();


