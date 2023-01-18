let myChat = {
    textInput: document.getElementById("input-text"),
    sendButton: document.getElementById("send-text"),
    messageContainer: document.getElementById("message-board"),

    init: function () {
        this.sendButton.addEventListener("click", () =>{
            this.sendMessage();
        });
        this.textInput.addEventListener("keyup", (e) => {
            if (e.code === "Enter") {
                this.sendMessage();
            }
        });
    },

    sendMessage: function () {
        let message = this.textInput.value;
        if (message) {
            let msg = {
                type: "text",
                content: message,
                username: ""
            }
            this.appendMessageToBoard(msg);
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
            this.textInput.value = "";
        }
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

        this.messageContainer.prepend(messageDiv);  
    }
};

myChat.init();


