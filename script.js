window.ChatWidgetConfig = {
    webhook: {
        url: 'https://venkataramachandruduch.app.n8n.cloud/webhook/362d1c5d-22c7-4c9e-9ab5-300db483ff07/chat',
        route: 'general'
    }
};

// Generate or retrieve a unique chat ID
function getChatId() {
    let chatId = sessionStorage.getItem("chatId");
    if (!chatId) {
        chatId = "chat_" + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("chatId", chatId);
    }
    return chatId;
}

function appendMessage(message, type) {
    let chatBody = document.getElementById("chat-widget-body");
    let p = document.createElement("p");
    p.textContent = message;
    p.className = type === "user" ? "user-message" : "bot-message";
    chatBody.appendChild(p);
    chatBody.scrollTop = chatBody.scrollHeight; // auto-scroll
}

// Send message to n8n webhook
document.getElementById("chat-widget-send").addEventListener("click", sendMessage);
document.getElementById("chat-widget-input").addEventListener("keydown", function(e){
    if(e.key === "Enter") sendMessage();
});

function sendMessage() {
    let input = document.getElementById("chat-widget-input");
    let message = input.value.trim();
    if(message === "") return;

    appendMessage(message, "user");
    input.value = "";

    let chatId = getChatId();

    fetch(window.ChatWidgetConfig.webhook.url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({chatId, message, route: "general"})
    })
    .then(res => res.json())
    .then(data => {
        let botReply = data.output || data.message || "Sorry, I couldn't understand that.";
        appendMessage(botReply, "bot");
    })
    .catch(err => appendMessage("⚠️ Bot is unreachable.", "bot"));
}
