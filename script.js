const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const usernameInput = document.getElementById("username");
const typingDiv = document.getElementById("typing");
const searchInput = document.getElementById("search");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const darkToggle = document.getElementById("darkToggle");
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

alert('Turn on Desktop mode on mobile browser for max effect')

let messages = JSON.parse(localStorage.getItem("chatme")) || [];
let memory = JSON.parse(localStorage.getItem("chatme_memory")) || {};
let botOnline = true;
let inactivityTimer;

// BOT STATUS
function setBotOnline(){
  botOnline = true;
  statusDot.classList.replace("offline","online");
  statusText.textContent = "anonymous Online";
}
function setBotOffline(){
  botOnline = false;
  statusDot.classList.replace("online","offline");
  statusText.textContent = "anonymous Offline";
}
function resetInactivityTimer(){
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(setBotOffline,30000);
}

// SAVE / RENDER
function save(){
  localStorage.setItem("chatme",JSON.stringify(messages));
  localStorage.setItem("chatme_memory",JSON.stringify(memory));
}
function render(filter=""){
  messagesDiv.innerHTML="";
  messages.filter(m=>m.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((msg,index)=>{
      const div = document.createElement("div");
      div.className="message "+(msg.user===usernameInput.value?"sent":"received");
      div.innerHTML=`<strong>${msg.user}</strong><br>${msg.text}<div class="timestamp">${msg.time}</div>`;
      messagesDiv.appendChild(div);
    });
  messagesDiv.scrollTop=messagesDiv.scrollHeight;
}

// SEND MESSAGE
function sendMessage(){
  const text = messageInput.value.trim();
  const user = usernameInput.value.trim();
  if(!user){ alert("Please enter your name first!"); return; }
  if(!text) return;

  if(!botOnline){ setBotOnline(); addBotMessage("I'm back online! 👋"); }
  resetInactivityTimer();
  messages.push({user,text,time:new Date().toLocaleTimeString()});
  save(); render(); messageInput.value="";
  simulateReply(text);
}

// BOT KEYWORDS & RANDOMIZED REPLIES
const greetings = ["hi","hello","hey","yo","yoh","hiya","sup"];
const howAreYou = ["how are you","how's it going","what's up"];
const byeWords = ["bye","goodbye","see you","later"];
const identity = ["who are you","what are you","where are you from"];
const thanks = ["thanks","thank you","thx"];

function matchKeyword(text, keywords){ return keywords.some(k=>text.toLowerCase().includes(k)); }

function getRandomReply(list){ return list[Math.floor(Math.random()*list.length)]; }

// BOT REPLY LOGIC
function simulateReply(userText){
  if(!botOnline) return;
  typingDiv.textContent = "Bot is typing...";
  let delay = Math.min(Math.max(userText.length*50, 800), 2500); // delay based on length
  setTimeout(()=>{
    typingDiv.textContent="";
    let text = userText.toLowerCase(), response="";

    // remember name
    if(text.match(/my name is (.+)/)) { 
      memory.name = text.match(/my name is (.+)/)[1]; 
      response = `Nice to meet you, ${memory.name}! 😊`; 
    }
    else if(matchKeyword(text,greetings)) {
      const replies = memory.name? [`Hey ${memory.name}! 👋`, `Hi ${memory.name}, nice to see you! 😄`, `Hello ${memory.name}! How's it going?`, `Yo ${memory.name}! 😎`, `Hi ${memory.name}!`] :
                                      ["Hello there! 👋","Hey! How are you?","Hi there! 😄","Yo!","Hello!"];
      response = getRandomReply(replies);
    }
    else if(matchKeyword(text,howAreYou)) {
      const replies = ["I'm feeling great! How about you?", "Doing well, thanks!", "All good here 😄"];
      response = getRandomReply(replies);
    }
    else if(matchKeyword(text,thanks)) {
      const replies = ["You're welcome! 😊","No problem!","Anytime!"];
      response = getRandomReply(replies);
    }
    else if(matchKeyword(text,byeWords)) {
      const replies = ["Goodbye! 👋","See you later!","Bye bye!"];
      response = getRandomReply(replies);
    }
    else if(matchKeyword(text,identity)) {
      const replies = ["I'm ChatMe, your virtual chat buddy 😎","Just a friendly bot here!","I live in the cloud ☁️"];
      response = getRandomReply(replies);
    }
    else if(text.includes("😂")||text.includes("🤣")) response="Haha I see you're laughing! 😂";
    else if(text.includes("😢")||text.includes("😭")) response="Oh no 😢 want to talk about it?";
    else if(text.includes("😡")||text.includes("🤬")) response="Whoa, that sounds frustrating 😡";
    else if(text.match(/\b(happy|great|awesome|excited)\b/)) response="I love that energy! 😄";
    else if(text.match(/\b(sad|depressed|unhappy|tired)\b/)) response="I'm sorry you're feeling that way 💙";
    else response="You sound fake, blocked and bye";

    addBotMessage(response);
  }, delay);
}

// ADD BOT MESSAGE
function addBotMessage(text){
  messages.push({user:"Bot",text,time:new Date().toLocaleTimeString()});
  save(); render();
}

// DELETE / CLEAR / THEME
function deleteMsg(index){ messages.splice(index,1); save(); render(); }
function clearChat(){ localStorage.removeItem("chatme"); localStorage.removeItem("chatme_memory"); messages=[]; memory={}; render(); }
function toggleTheme(){ document.body.classList.toggle("dark"); }

// EVENTS
searchInput.addEventListener("input", e=>render(e.target.value));
messageInput.addEventListener("keypress", e=>{if(e.key==="Enter") sendMessage();});
darkToggle.addEventListener("change", toggleTheme);

// Mobile sidebar behavior: show overlay and lock body scroll
hamburger.addEventListener("click", ()=>{
  sidebar.classList.add("active");
  if(overlay) overlay.classList.add("visible");
  document.body.style.overflow = 'hidden';
});
closeSidebar.addEventListener("click", ()=>{
  sidebar.classList.remove("active");
  if(overlay) overlay.classList.remove("visible");
  document.body.style.overflow = '';
});
if(overlay){ overlay.addEventListener("click", ()=>{ sidebar.classList.remove("active"); overlay.classList.remove("visible"); document.body.style.overflow = ''; }); }

// INIT
setBotOnline();
resetInactivityTimer();
render();