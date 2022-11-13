import config from "./text.json" assert{type: 'json'}

var body = document.querySelector("body");
document.addEventListener("mousemove",function(e){
  var heart = document.createElement("span");
  var size = randomRange(40,60);
  heart.style.width = 2 +'rem';
  heart.style.height = 2 +'rem';
  heart.style.left = e.clientX + 'px';
  heart.style.top = e.clientY + 'px';

  body.appendChild(heart);
  setTimeout(function(){
    heart.remove();
  }, 500)
  
})


const button = document.getElementById("start-button");
button.addEventListener("click", () => {
  var audio = document.getElementById("01");
  audio.volume = 0.4;
  audio.play();

  const buttonContainer = document.getElementById("start-button-container");
  fadeAnimation(false, 500, 0, buttonContainer, () => {
    buttonContainer.remove();
    startProgress();
  })
})

function startProgress() {
  const progress = document.getElementById("progress");
  const quote = document.getElementById("quote");
  progress.removeAttribute("hidden");
  progress.style ="width: 0;"
  quote.removeAttribute("hidden");

  const sentences = config.sentences;
  let index = 0;
  
  const getDuration = (sentence) => sentence.length * config.timePerLetter;
  const loadPercentages = createLoadPercentages(sentences.length); 
  let percentage = loadPercentages[index];

  setTimeout(function showProgressChunk() {
    quote.innerText = sentences[index];
    progress.style = `width: ${percentage}%; transition: all ${getDuration(sentences[index])}ms ease`;
    
    progress.addEventListener("transitionend", function next() {
      progress.removeEventListener("transitionend", next);
      index++;
      
      if (index < sentences.length) {
        percentage += loadPercentages[index];
        setTimeout(showProgressChunk, randomRange(300, 1000), 0);
      }
      else {
        fadeAnimation(false, 400, 0, progress);
        fadeAnimation(false, 700, 0, quote, () => {
          progress.remove();
          quote.remove();
          startHeart();
        });
      }
    });
  }, 0);
}

function startHeart() {
  const mainContent = document.getElementById("main-content");
  const heart = document.getElementById("heart");
  fadeAnimation(true, 1000, 500, mainContent, null);
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLoadPercentages(amount) {
  const iv = new Array(amount).fill(0).map(_ => randomRange(30, 50));
  const sum = iv.reduce((sum, current) => sum + current, 0);
  return iv.map(value => (value / sum) * 100);
}

function fadeAnimation(isFadeIn, duration, delay, elem, afterShowHandler) {
  if (isFadeIn) {
    elem.setAttribute("hidden", "");
  }

  setTimeout(() => {
    elem.removeAttribute("hidden");
    elem.style = `animation: show ${duration}ms ease-out 0ms 1 ${isFadeIn ? "normal" : "reverse"} forwards;`;
    
    if (afterShowHandler) {
      elem.addEventListener("animationend", function f() {
        elem.removeEventListener("animationend", f);
        afterShowHandler();
      });  
    }
  }, delay);
}

function getDistance(x1, y1, x2, y2){
  return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))
}
