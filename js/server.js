const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

// State variables
let userMessage = null;
let isResponseGenerating = false;
let isFirstInteraction = true; // Global flag for first interaction

// API configuration
const API_KEY = "AIzaSyCfu7WTmohN6Koj_vGXnsNnj11nkaK96UE"; // Your API key here
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY;

// Load theme and chat data from local storage on page load
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = (localStorage.getItem("themeColor") === "light_mode");
  // Apply the stored theme
  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
  // Restore saved chats or clear the chat container
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
}

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;
  const typingInterval = setInterval(() => {
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
}

// Fetch response from the API based on user message with prompt engineering
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");
  try {
    // Retrieve the current mode from the radio buttons
    const modeElem = document.querySelector('input[name="mode"]:checked');
    const mode = modeElem ? modeElem.value : "resume";

    // Construct the prompt based on the selected mode and whether it's the first interaction
    let prompt = '';
    if (mode === 'resume') {
      if (isFirstInteraction) {
        prompt = `You are a career coach. Provide tailored advice for improving a resume specifically for a target job. Ask clarifying follow-up questions if needed before giving detailed feedback. The applicant's resume input: ${userMessage}`;
      } else {
        prompt = `You are a career coach. Provide tailored advice for improving a resume for a target job. The applicant's resume input: ${userMessage}`;
      }
    } else if (mode === 'interview') {
      if (isFirstInteraction) {
        prompt = `You are a career coach specializing in behavioral interview preparation. Simulate a behavioral interview by asking relevant questions for a candidate applying to a target position. Start by asking what position or company the candidate is targeting. Candidate input: ${userMessage}`;
      } else {
        prompt = `You are a career coach specializing in behavioral interview preparation. Provide direct feedback and additional questions based on the candidate's input: ${userMessage}`;
      }
    }
    
    // Send a POST request to the API with the engineered prompt
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          role: "user", 
          parts: [{ text: prompt }] 
        }] 
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    // Get the API response text and remove asterisks from it
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Show typing effect
  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
}

// Show a loading animation while waiting for the API response
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="images/gemini.svg" alt="Gemini avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  generateAPIResponse(incomingMessageDiv);
}

// Copy message text to the clipboard
const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done"; // Show confirmation icon
  setTimeout(() => copyButton.innerText = "content_copy", 1000); // Revert icon after 1 second
}

// Handle sending outgoing chat messages
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return; // Exit if there is no message or response is generating
  isResponseGenerating = true;
  
  // Set the first-interaction flag to false right after the first outgoing message
  if (isFirstInteraction) {
    isFirstInteraction = false;
  }
  
  const html = `<div class="message-content">
                  <img class="avatar" src="images/user.jpg" alt="User avatar">
                  <p class="text"></p>
                </div>`;
  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  
  typingForm.reset(); // Clear input field
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
}

// Toggle between light and dark themes
toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Delete all chats from local storage when button is clicked
deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
});

// Set userMessage and handle outgoing chat when a suggestion is clicked
suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});

// Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
  e.preventDefault(); 
  handleOutgoingChat();
});
