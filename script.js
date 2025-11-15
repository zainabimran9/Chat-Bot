const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
//MY KEY

const API_KEY = "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";

//YOUR KEY
//const API_KEY = "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";

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
    .then(res => {
        console.log("Response status:", res.status);
        if (!res.ok) {
            return res.json().then(errorData => {
                console.error("Error details:", errorData);
                throw new Error(`Error ${res.status}: ${errorData.error.message}`);
            });
        }
        return res.json();
    })
    .then(data => {
        console.log("API response data:", data);
        messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
        console.error("Error fetching response:", error);
        messageElement.classList.add("error");
        messageElement.textContent = `Oops! Something went wrong. Status: ${error.message}`;
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking....", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 880) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggle.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
