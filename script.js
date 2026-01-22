(() => {


const typeSpeed = 1;
const ALT_IMAGE_MAP = {
  "S3_01A.jpg": "./assets/images/Stage_3/S3_01B.jpg",
  "S3_02A.jpg": "./assets/images/Stage_3/S3_02B.jpg",
  "S3_03A.jpg": "./assets/images/Stage_3/S3_03B.jpg",
  "S3_04A.jpg": "./assets/images/Stage_3/S3_04B.jpg",
  "S3_05A.jpg": "./assets/images/Stage_3/S3_05B.jpg",
  "S3_06A.jpg": "./assets/images/Stage_3/S3_06B.jpg",
  "S3_07A.jpg": "./assets/images/Stage_3/S3_07B.png",
  "S3_08A.jpg": "./assets/images/Stage_3/S3_08B.jpg",
  "S3_09A.jpg": "./assets/images/Stage_3/S3_09B.jpg"
};

let activeScene = null;
let idCardActive = false;
let hymnSceneActive = false;
let interviewComplete = false;
let sceneSwitching = false;
const SHOW_DEBUG_TIMER = false;



// ============================
// SCORE SYSTEM
// ============================
const ScoreSystem = {
  totalScore: 0,
  questionTimerStart: null,
  timerInterval: null,
  debugTimerEl: null,

  init() {
  if (!SHOW_DEBUG_TIMER) return;

  this.debugTimerEl = document.createElement("div");
  this.debugTimerEl.style.position = "absolute";
  this.debugTimerEl.style.top = "8px";
  this.debugTimerEl.style.right = "12px";
  this.debugTimerEl.style.fontSize = "14px";
  this.debugTimerEl.style.opacity = "0.7";
  this.debugTimerEl.style.zIndex = "999";
  this.debugTimerEl.textContent = "0.0s";
  document.body.appendChild(this.debugTimerEl);
},


  startTimer() {
  this.questionTimerStart = performance.now();
  clearInterval(this.timerInterval);

  if (!SHOW_DEBUG_TIMER) return;

  this.timerInterval = setInterval(() => {
    const t = performance.now() - this.questionTimerStart;
    this.debugTimerEl.textContent = `${(t / 1000).toFixed(1)}s`;
  }, 100);
},


  stopTimer() {
  if (!this.questionTimerStart) return 0;
  const t = performance.now() - this.questionTimerStart;
  clearInterval(this.timerInterval);
  this.questionTimerStart = null;

  if (SHOW_DEBUG_TIMER) {
    this.debugTimerEl.textContent = "0.0s";
  }

  return Math.round(t);
}
};


// ===============================
// LOCAL STORAGE
// ===============================
const Storage = {
  KEY: "immigrationResult",
  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },
  load() {
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  }
};


// ===================================
// SCENE MANAGER 
// ===================================
const SceneManager = {
  switch(nextId) {
    if (sceneSwitching) return Promise.resolve();
    sceneSwitching = true;
  
    return new Promise((resolve) => {
      const current = document.querySelector(".scene.active");
      const next = document.getElementById(nextId);
      if (!next) {
        sceneSwitching = false;
        return resolve();
      }
  
      if (current) {
        current.classList.remove("active");
        current.classList.add("hidden");
      }
  
      next.classList.remove("hidden");
      next.classList.add("active");
  
      requestAnimationFrame(() => {
        sceneSwitching = false;
        resolve();
      });
    });
  }
  
};


// =================
// STAGE1
// =================
const dialogTextEl = document.getElementById("dialog-text");
const nextBtn = document.getElementById("next-btn");
const doneBtn = document.getElementById("dialog-done-btn");
const choiceContainer = document.getElementById("choice-container");

const inputContainer = document.getElementById("input-container");
const inputField = document.getElementById("dialog-input");
const inputSubmit = document.getElementById("input-submit");

const interviewData = {
  name: "",
  birthplace: "",
  birthdate: "",
  height: "",
  escape: ""
};

const PERSIST_DIALOG_HISTORY = true; 

let dialogLines = [
  {type: "text", text: "" },
  {type: "input", text: "STATE YOUR NAME.", key: "name" },
  {type: "input", text: "WHERE ARE YOU FROM?", key: "birthplace" },
  {type: "input", text: "WHEN WERE YOU BORN?", key: "birthdate" },
  {type: "input", text: "STATE YOUR HEIGHT.", key: "height" },
  {type: "input", text: "WHAT ARE YOU TRYING TO GET AWAY FROM?", key: "escape" },
  {
    type: "choice",
    text: "STATE YOUR GENDER.",
    clickAdvance: true,
    choices: [{ label: "Male" }, { label: "Female" }]
  },
  {
    type: "choice",
    text: "ARE YOU IN POSESSION OF CITIZENSHIP?",
    clickAdvance: true,
    choices: [{ label: "Yes" }, { label: "No" }]
  },
   {
    type: "choice",
    text: "ARE YOU VIOLENT?",
    clickAdvance: true,
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "DO YOU BELIEVE IN HIM?",
    clickAdvance: true,
    hoverSwap: { Yes: "He can't see me", No: "I can't see him" },
    choices: [{ label: "Yes" }, { label: "No" }]
  },

  {
    type: "choice",
    text: "SELECT YOUR DIFFICULTY.",
    clickAdvance: true,
    choices: [{ label: "White" }, { label: "Brown" }, { label: "Black" }]
  },
  {
    type: "choice",
    text: "ARE YOU ALONE?",
    clickAdvance: true,
    hoverSwap: { Yes: "Yes, I am.", No: "No, we are." },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
    {
    type: "choice",
    text: "WHAT IS DEMOCRACY?",
    clickAdvance: true,
    choices: [{ label: "Tyranny of the Majority" }, { label: "Tyranny of the minority" }]
  },
  {
    type: "choice",
    text: "WHAT IS TOTALITARIANISM?",
    clickAdvance: true,
    choices: [{ label: "Absolute totality" }, { label: "Rejection of exclusion" }]
  },
  {
    type: "choice",
    text: "WHAT IS THE PURPOSE OF STATE MACHINE?",
    clickAdvance: true,
    choices: [{ label: "Process" }, { label: "Suspension" }]
  },
  {
    type: "choice",
    text: "ARE YOU EXCITED OR LOOKING FORWARD TO?",
    clickAdvance: true,
    hoverSwap: { Yes: "No", No: "No" },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "DO YOU RECOGNIZE YOURSELF AS A SUBJECT?",
    clickAdvance: true,
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "WHAT MAKES A GOOD VERITANIAN CITIZEN?",
    clickAdvance: true,
    choices: [{ label: "Their non-existence" }, { label: "Their over-existence" }]
  },
  {
    type: "choice",
    text: "WHAT IS THE PRIMARY DUTY OF EVERY CITIZEN OF VERITANIA?",
    clickAdvance: true,
    choices: [{ label: "Love" }, { label: "Freedom" }, { label: "Sacrifice" }]
  },
  
  {
    type: "choice",
    text: "WHAT DO VERITANIAN CITIZENS GO TO SCHOOL FOR?",
    clickAdvance: true,
    choices: [{ label: "To encounter the state" },  { label: "To be away from family" }]
  },
  {
    type: "choice",
    text: "WHAT IS THE STATE SYMBOL OF VERITANIA?",
    clickAdvance: true,
    choices: [{ label: "The Sun Cross" }, { label: "The Red Square" }]
  },
  {
    type: "choice",
    text: "DO YOU RECOGNIZE THAT THE STATE IS REAL?",
    clickAdvance: true,
    hoverSwap: { Yes: "correct", No: "wrong" },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "DO YOU BELIEVE IN YOUR EYES OR OUR WORDS?",
    clickAdvance: true,
    hoverSwap: { Yes: "wrong", No: "correct" },
    choices: [{ label: "My eyes" }, { label: "Your words" }]
  },
  {
    type: "choice",
    text: "南蛮人ですか。",
    clickAdvance: true,
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "DO YOU WANT TO CHOOSE?",
    choices: [{ label: "No" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "TERROR OR VIRTUE?",
    choices: [{ label: "Yes." }]
  },
  {
    type: "choice",
    text: "SURRENDER YOUR PRIVATE LIFE TO THE PUBLIC.",
    choices: [{ label: "Yes." }]
  },
  {
    type: "choice",
    text: "YOU WILL PURCHASE.",
    choices: [{ label: "No." }]
  },
  {
    type: "choice",
    text: "YOU WILL LIKE.",
    choices: [{ label: "No." }]
  },
  {
    type: "choice",
    text: "YOU WILL DISLIKE.",
    choices: [{ label: "No." }]
  },
  {
    type: "choice",
    hoverSwap: { Yes: "Yes.", No: "Yes." },
    text: "YOU WILL ENLIST",
    choices: [{ label: "No" }]
  },
  {
    type: "choice",
    text: "HEADS OR TAILS?",
    randomCorrect: true,
    choices: [{ label: "HEADS" }, { label: "TAILS" }]
  },
  {type: "text", text: "Interview complete."
},
];


// ============================
// DIALOG SYSTEM
// ============================
const DialogSystem = {
  index: 0,
  typing: false,
  typingCancel: false,
  waitingForChoice: false,

  start() {
    this.index = 0;
    this.playLine(this.index);
  },

  typeWriter(text, callback) {
    this.typing = true;
    this.typingCancel = false;
    if (!PERSIST_DIALOG_HISTORY) {
  dialogTextEl.textContent = "";
}

    let i = 0;

    const step = () => {
      if (this.typingCancel) {
        if (!PERSIST_DIALOG_HISTORY) {
  dialogTextEl.textContent = text;
} else {
  dialogTextEl.innerHTML += text.slice(i);
}

        this.typing = false;
        callback && callback();
        return;
      }
      if (i < text.length) {
        dialogTextEl.innerHTML += text[i++];

        setTimeout(step, typeSpeed);
      } else {
        this.typing = false;
        callback && callback();
      }
    };

    step();
  },

  playLine(idx) {
    const line = dialogLines[idx];
    if (!line) return this.end();

    nextBtn.classList.add("hidden");
    doneBtn.classList.add("hidden");
    choiceContainer.classList.add("hidden");
    inputContainer.classList.add("hidden");

    if (PERSIST_DIALOG_HISTORY) {
  dialogTextEl.innerHTML += "<div></div>";
}

this.typeWriter(line.text, () => {

     if (line.type === "choice") {
  this.showChoices(line);

  if (line.clickAdvance) {
    this.waitingForChoice = false;
    nextBtn.classList.remove("hidden");
  }
}

      if (line.type === "input") this.showInput(line);
   if (line.type === "text") 
      nextBtn.classList.remove("hidden");
    });
  },

  next() {
    if (this.waitingForChoice) return;
    /* if (this.typing) {
      this.typingCancel = true; // Typing cancel flag
      return;
    } */
    this.index++;
    if (this.index < dialogLines.length) this.playLine(this.index);
    else this.end();
  },

  end() {
    nextBtn.classList.add("hidden");
    doneBtn.classList.remove("hidden");
  },

  showChoices(line) {
    this.waitingForChoice = true;
    choiceContainer.innerHTML = "";
    choiceContainer.classList.remove("hidden");
    let correctAnswer = null;

if (line.randomCorrect) {
  correctAnswer = Math.random() < 0.5 ? "HEADS" : "Tails";
}


    ScoreSystem.startTimer();

    line.choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = c.label;

      if (line.hoverSwap && line.hoverSwap[c.label]) {
        btn.onmouseenter = () =>
          (btn.textContent = line.hoverSwap[c.label]);
        btn.onmouseleave = () => (btn.textContent = c.label);
      }

      btn.onclick = () => {
        ScoreSystem.totalScore += ScoreSystem.stopTimer();
        if (!interviewComplete) {
          Storage.save({
            ...interviewData,
            score: ScoreSystem.totalScore
          });
        }
        

        if (line.randomCorrect) {
  if (btn.textContent !== correctAnswer) {
    SceneManager.switch("error-scene");
this.waitingForChoice = true;
this.typing = false;
return;

  }
}


        this.waitingForChoice = false;

if (PERSIST_DIALOG_HISTORY) {
  Array.from(choiceContainer.children).forEach(b => {
    b.disabled = true;
    b.style.opacity = "0.6";
    b.style.cursor = "default";
  });

  this.appendLine(`> ${btn.textContent}`);
} else {
  choiceContainer.classList.add("hidden");
}

this.next();

      };

      choiceContainer.appendChild(btn);
    });
  },

  showInput(line) {
    this.waitingForChoice = true;
    inputContainer.classList.remove("hidden");
    inputField.value = "";
    inputField.focus();

    ScoreSystem.startTimer();

    const submit = () => {
      if (!inputField.value.trim()) return;
    
      interviewData[line.key] = inputField.value.trim();
      ScoreSystem.totalScore += ScoreSystem.stopTimer();
    
      Storage.save({
        ...interviewData,
        score: ScoreSystem.totalScore
      });
    
      this.waitingForChoice = false;
    
      if (PERSIST_DIALOG_HISTORY) {
        this.appendLine(`_ ${inputField.value}`);
      } else {
        inputContainer.classList.add("hidden");
      }
    
      this.next();
    };
    

    inputSubmit.onclick = submit;
    inputField.onkeydown = (e) => {
      if (e.key === "Enter") submit();
    };
  },

  appendLine(html) {
  if (!PERSIST_DIALOG_HISTORY) return;
  dialogTextEl.innerHTML += `<div style="background: #ffffff4c;">${html}</div>`;
}

};


nextBtn.onclick = () => DialogSystem.next();

document.getElementById("dialog-box").onclick = (e) => {
  if (DialogSystem.typing) return;
  if (e.target.closest("button")) return;
  DialogSystem.next();
};



// ==============================
// NAVIGATION
// ==============================
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-next]");
  if (!btn) return;

  const nextId = btn.dataset.next;
  SceneManager.switch(nextId).then(() => {
  DialogSystem.start();

  if (!hymnSceneActive) {
  montage.stop();
}

activeScene = nextId;

idCardActive = nextId === "final-scene";
hymnSceneActive = nextId === "S2-scene";




  if (nextId === "final-scene") {
  const loader = document.getElementById("id-loading");
  const card = document.querySelector(".id-card-wrapper");
  const bus = document.getElementById("final");

  loader.classList.remove("hidden");
  card.style.display = "none";

  setTimeout(() => {
    if (activeScene !== "final-scene") return;
    loader.classList.add("hidden");
    bus.classList.remove("hidden");
    card.style.display = "block";
    enableTilt();
  }, 1000); // Load Time: 1000000 = ~16 min
}

});

});


(function init() {
  ScoreSystem.init();
  document.querySelectorAll(".scene").forEach((s) =>
    s.classList.remove("active")
  );
  document.getElementById("intro-scene").classList.add("active");
})();

// ====================
// STAGE2
// ====================
const hymnAudio = document.getElementById("hymn-audio");
const hymnPlayBtn = document.getElementById("hymn-play-btn");
const hymnContinueBtn = document.getElementById("S2-proceed-btn");

if (hymnAudio && hymnPlayBtn && hymnContinueBtn) {
  hymnPlayBtn.onclick = () => {
    hymnPlayBtn.classList.add("hidden");
  
    // Wait for audio to be ready
    if (hymnAudio.readyState >= 2) { // HAVE_CURRENT_DATA
      hymnAudio.play();
      hymnAudio.onpause = () => montage.stop();
      hymnAudio.onplay = () => montage.resume();
      montage.start();
    } else {
      hymnAudio.addEventListener("canplaythrough", function startOnce() {
        hymnAudio.removeEventListener("canplaythrough", startOnce);
        hymnAudio.play();
        hymnAudio.onpause = () => montage.stop();
        hymnAudio.onplay = () => montage.resume();
        montage.start();
      });
    }
  };
  

}

const progressContainer = document.getElementById("hymn-progress-container");
const progressBar = document.getElementById("hymn-progress-bar");

if (hymnAudio && progressBar) {
  hymnAudio.addEventListener("timeupdate", () => {
    const percent = (hymnAudio.currentTime / hymnAudio.duration) * 100;
    progressBar.style.width = percent + "%";
  });

  hymnAudio.addEventListener("ended", () => {
    progressBar.style.width = "0%";
  });
}


const montage = {
  images: [],
  index: 0,
  interval: null,

  start() {
    montageContainer.classList.remove("hidden");
    if (!this.images.length) return;
  
    // Only reset index if montage hasn't started yet
    if (this.index === 0 && !this.interval) {
      this.images.forEach(img => img.classList.remove("active"));
      this.images[this.index].classList.add("active");
    }
  
    const FIRST_RUN_COUNT = 4;
    const TOTAL_IMAGES = this.images.length;
    const IMAGE_DURATION = 11330 / hymnSpeedMultiplier;
  
    this.interval = setInterval(() => {
      const current = this.images[this.index];
      current.classList.remove("active");
  
      if (this.index < FIRST_RUN_COUNT - 1) {
        this.index++;
      } else {
        this.index = FIRST_RUN_COUNT + ((this.index - FIRST_RUN_COUNT + 1) % (TOTAL_IMAGES - FIRST_RUN_COUNT));
      }
  
      const next = this.images[this.index];
      next.classList.add("active");
    }, IMAGE_DURATION);
  },
  
  resume() {
    if (!this.images.length) return;
    if (this.interval) return; // already running
  
    const TOTAL_IMAGES = this.images.length;
    const FIRST_RUN_COUNT = 4;
    const IMAGE_DURATION = 11330 / hymnSpeedMultiplier;
  
    this.interval = setInterval(() => {
      const current = this.images[this.index];
      current.classList.remove("active");
  
      if (this.index < FIRST_RUN_COUNT - 1) {
        this.index++;
      } else {
        this.index = FIRST_RUN_COUNT + ((this.index - FIRST_RUN_COUNT + 1) % (TOTAL_IMAGES - FIRST_RUN_COUNT));
      }
  
      const next = this.images[this.index];
      next.classList.add("active");
    }, IMAGE_DURATION);
  }
  
,

  stop() {
    clearInterval(this.interval);
  }
};

let hymnSpeedMultiplier = 1;

const volumeSlider = document.getElementById("debug-hymn-volume");
const speedSlider = document.getElementById("debug-hymn-speed");

if (volumeSlider && hymnAudio) {
  volumeSlider.oninput = () => {
    hymnAudio.volume = parseFloat(volumeSlider.value);
  };
}

if (speedSlider) {
  speedSlider.oninput = () => {
    hymnSpeedMultiplier = parseFloat(speedSlider.value);

    if (hymnAudio) {
      hymnAudio.playbackRate = hymnSpeedMultiplier;
    }

    if (montage.interval) {
      montage.stop();
      montage.start();
    }
  };
}


const montageContainer = document.getElementById("hymn-montage");
if (montageContainer) {
  montage.images = Array.from(montageContainer.querySelectorAll("img"));
}

let hymnFinished = false;
let montageShrunk = false;

hymnAudio.onended = () => {
  montage.stop();
  hymnContinueBtn.classList.remove("hidden");
  hymnFinished = true;
};

montageContainer.addEventListener("click", () => {
  montageShrunk = !montageShrunk;
  montageContainer.classList.toggle("shrunk", montageShrunk);
});



// ====================
// STAGE3
// ====================
let chosenImage = null;
const grid = document.getElementById("image-grid");
const images = grid ? Array.from(grid.querySelectorAll("img")) : [];
const continueBtn = document.getElementById("S3-proceed-btn");

images.forEach((img) => {
  img.onclick = () => {
    img.classList.add("crossed");
    const remaining = images.filter(
      (i) => !i.classList.contains("crossed")
    );

    if (remaining.length === 1) {
      chosenImage = remaining[0].src;
      continueBtn.classList.remove("hidden");
      images.forEach((i) => (i.style.pointerEvents = "none"));
    }
  };
});

const centerText = document.getElementById("S3-center-text");

images.forEach((img) => {
  const title = img.dataset.title;
  if (!title) return;

  img.addEventListener("mouseenter", () => {
    centerText.textContent = title;
  });

  img.addEventListener("mouseleave", () => {
    centerText.textContent = "";
  });
});


// =========================
// FINAL SCENE
// =========================
if (continueBtn) {
  continueBtn.onclick = () => {
    if (!chosenImage) return;

    const finalImageEl = document.getElementById("final-image");
    const altImageEl = document.querySelector(".img-b");

    finalImageEl.src = chosenImage;

    const fileName = chosenImage.split("/").pop();
    const resolvedAltImage = ALT_IMAGE_MAP[fileName] || "";

    if (resolvedAltImage) {
      altImageEl.src = resolvedAltImage;
    }

    document.getElementById("id-name").textContent = interviewData.name;
    document.getElementById("score-value").textContent = ScoreSystem.totalScore;

    document.getElementById("stat-born").textContent = interviewData.birthplace;
    document.getElementById("stat-fled").textContent = interviewData.escape;
    document.getElementById("stat-date").textContent = interviewData.birthdate;
    document.getElementById("stat-height").textContent = interviewData.height;

    Storage.save({
      ...interviewData,
      score: ScoreSystem.totalScore,
      chosenImage: chosenImage,
      altImage: resolvedAltImage
    });
  };
}



// =====================
// DEBUG
// =====================
document
  .querySelectorAll('#controls input[data-toggle]')
  .forEach((input) => {
    const effectClass = input.dataset.toggle;
    const effectEl = document.querySelector(
      `#machine-container .${effectClass}`
    );

    if (!effectEl) return;

    effectEl.style.display = input.checked ? "block" : "none";

    input.addEventListener("change", () => {
      effectEl.style.display = input.checked ? "block" : "none";
    });
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      document.querySelectorAll(".scene").forEach((s) =>
        s.classList.remove("active")
      );
      document.getElementById("intro-scene").classList.add("active");
  
      DialogSystem.index = 0;
      DialogSystem.typing = false;
      DialogSystem.typingCancel = false;
      DialogSystem.waitingForChoice = false;
  
      nextBtn.classList.add("hidden");
      doneBtn.classList.add("hidden");
      choiceContainer.classList.add("hidden");
      inputContainer.classList.add("hidden");
    }
  });
  


})();


