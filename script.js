(() => {


// ========================
// constants
// ========================
const TRANS_MS = 1000;
const typeSpeed = 48;

const ALT_IMAGE_MAP = {
  "./assets/images/Stage_3/S3_01A.jpg": "./assets/images/Stage_3/S3_01B.jpg",
  "./assets/images/Stage_3/S3_02A.jpg": "./assets/images/Stage_3/S3_02B.jpg",
  "./assets/images/Stage_3/S3_03A.jpg": "./assets/images/Stage_3/S3_03B.jpg",
  "./assets/images/Stage_3/S3_04A.jpg": "./assets/images/Stage_3/S3_04B.jpg",
  "./assets/images/Stage_3/S3_05A.jpg": "./assets/images/Stage_3/S3_05B.jpg",
  "./assets/images/Stage_3/S3_06A.jpg": "./assets/images/Stage_3/S3_06B.jpg",
  "./assets/images/Stage_3/S3_07A.jpg": "./assets/images/Stage_3/S3_07B.png",
  "./assets/images/Stage_3/S3_08A.jpg": "./assets/images/Stage_3/S3_08B.jpg",
  "./assets/images/Stage_3/S3_09A.jpg": "./assets/images/Stage_3/S3_09B.jpg",
};

// ========================
// SCORE SYSTEM (OBJECT)
// ========================
const ScoreSystem = {
  totalScore: 0,
  questionTimerStart: null,
  timerInterval: null,
  debugTimerEl: null,

  init() {
    this.debugTimerEl = document.createElement("div");
    this.debugTimerEl.style.position = "absolute";
    this.debugTimerEl.style.top = "8px";
    this.debugTimerEl.style.right = "12px";
    this.debugTimerEl.style.fontSize = "14px";
    this.debugTimerEl.style.opacity = "0.7";
    this.debugTimerEl.style.zIndex = "999";
    this.debugTimerEl.textContent = "⏱ 0.0s";
    document.body.appendChild(this.debugTimerEl);
  },

  startTimer() {
    this.questionTimerStart = performance.now();
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      const t = performance.now() - this.questionTimerStart;
      this.debugTimerEl.textContent = `⏱ ${(t / 1000).toFixed(1)}s`;
    }, 100);
  },

  stopTimer() {
    if (!this.questionTimerStart) return 0;
    const t = performance.now() - this.questionTimerStart;
    clearInterval(this.timerInterval);
    this.questionTimerStart = null;
    this.debugTimerEl.textContent = "⏱ 0.0s";
    return Math.round(t);
  }
};


// ==========================
// LOCAL STORAGE (OBJECT)
// ==========================
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

// (Dialog system code remains unchanged)


// ==========================
// SCENE MANAGER (OBJECT)
// ==========================
const SceneManager = {
  switch(nextId) {
    return new Promise((resolve) => {
      const current = document.querySelector(".scene.active");
      const next = document.getElementById(nextId);
      if (!next) return resolve();

      if (current) {
        current.classList.remove("active");
        current.classList.add("hidden");
      }

      next.classList.remove("hidden");
      next.classList.add("active");
      resolve();
    });
  }
};


// ==========================
// Dialog system (UNCHANGED)
// ==========================
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

const PERSIST_DIALOG_HISTORY = true; // ← set to false to restore old behavior

let dialogLines = [
  {type: "text", text: "" },
  {type: "input", text: "What is your name?", key: "name" },
  {type: "input", text: "Where are you from?", key: "birthplace" },
  {type: "input", text: "When were you born?", key: "birthdate" },
  {type: "input", text: "Height?", key: "height" },
  {type: "input", text: "What are you trying to get away from?", key: "escape" },
  {
    type: "choice",
    text: "Are you in possession of citizenship?",
    clickAdvance: true,
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "what is your gender?",
    clickAdvance: true,
    choices: [{ label: "Male" }, { label: "Female" }]
  },
  {
    type: "choice",
    text: "What do you place your faith in him?",
    hoverSwap: { Yes: "he can't see me", No: "I can't see him" },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "Are you violent?",
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "What is your preferred difficulty setting?",
    choices: [{ label: "White" }, { label: "Brown" }, { label: "Black" }]
  },
  {
    type: "choice",
    text: "Are you alone?",
    hoverSwap: { Yes: "Yes, I am.", No: "No, we are." },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
    {
    type: "choice",
    text: "What is democracy?",
    choices: [{ label: "Tyranny of the Majority." }, { label: "Tyranny of the minority." }]
  },
  {
    type: "choice",
    text: "What is totalitarianism?",
    choices: [{ label: "Assumption of totality." }, { label: "Rejection of exclusion." }]
  },
  {
    type: "choice",
    text: "What is the purpose of state machine?",
    choices: [{ label: "Process" }, { label: "Suspension" }]
  },
  {
    type: "choice",
    text: "Are you excited for or looking forward to?",
    hoverSwap: { Yes: "No", No: "No" },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "Do you recognize yourself as a subject?",
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "What makes a good Veritanian citizen?",
    choices: [{ label: "Their non-existence" }, { label: "Their over-existence" }]
  },
  {
    type: "choice",
    text: "What is a the duty of every citizen of Veritania?",
    choices: [{ label: "Love" }, { label: "Freedom" }, { label: "Sacrifice" }]
  },
  
  {
    type: "choice",
    text: "What do Veritanian citizens go to school for?",
    choices: [{ label: "To encounter the public." },  { label: "To be away from family." }]
  },
  {
    type: "choice",
    text: "What is the national symbol of Veritania?",
    choices: [{ label: "The Sun Cross" }, { label: "None" }]
  },
  {
    type: "choice",
    text: "Do you recognize that the state is real?",
    hoverSwap: { Yes: "correct", No: "wrong" },
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "Do you believe your eyes or our words?",
    hoverSwap: { Yes: "wrong", No: "correct" },
    choices: [{ label: "My eyes" }, { label: "Your words" }]
  },
  {
    type: "choice",
    text: "南蛮人ですか。",
    choices: [{ label: "Yes" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "Do you want to choose.",
    choices: [{ label: "No" }, { label: "No" }]
  },
  {
    type: "choice",
    text: "Terror or virtue?",
    choices: [{ label: "Yes." }]
  },
  {
    type: "choice",
    text: "Surrender your private life to the public.",
    choices: [{ label: "Yes." }]
  },
  {
    type: "choice",
    hoverSwap: { Yes: "Yes.", No: "Yes." },
    text: "You will enlist.",
    choices: [{ label: "No" }]
  },
  {
    type: "choice",
    text: "Heads or Tails.",
    randomCorrect: true,
    choices: [{ label: "Heads" }, { label: "Tails" }]
  },
  {type: "text", text: "Interview complete."
},
];


// ==========================
// DIALOG SYSTEM (OBJECT)
// ==========================
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
      // nothing to show, just allow clicking through
      nextBtn.classList.remove("hidden");
    });
  },

  next() {
    if (this.waitingForChoice) return;
    if (this.typing) {
      this.typingCancel = true;
      return;
    }
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
  correctAnswer = Math.random() < 0.5 ? "Heads" : "Tails";
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
        Storage.save({
          ...interviewData,
          score: ScoreSystem.totalScore
        });

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
  // lock all buttons
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



// ==========================
// Controls
// ==========================
nextBtn.onclick = () => DialogSystem.next();

document.getElementById("dialog-box").onclick = (e) => {
  if (e.target.closest("button")) return;
  DialogSystem.next();
};


// ==========================
// Navigation (SceneManager swap only)
// ==========================
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-next]");
  if (!btn) return;

  const nextId = btn.dataset.next;
  SceneManager.switch(nextId).then(() => {
  if (nextId === "S1-scene") {
    dialogIndex = 0;
    playLine(dialogIndex);
  }

  if (nextId === "final-scene") {
  const loader = document.getElementById("id-loading");
  const card = document.querySelector(".id-card-wrapper");
  const bus = document.getElementById("final");

  loader.classList.remove("hidden");
  card.style.display = "none";

  setTimeout(() => {
    loader.classList.add("hidden");
    bus.classList.remove("hidden");
    card.style.display = "block";
    enableTilt();
  }, 5000);
}

});

});


// ==========================
// Init
// ==========================
(function init() {
  ScoreSystem.init();
  document.querySelectorAll(".scene").forEach((s) =>
    s.classList.remove("active")
  );
  document.getElementById("intro-scene").classList.add("active");
})();

// ==========================
// HYMN SCENE
// ==========================
const hymnAudio = document.getElementById("hymn-audio");
const hymnPlayBtn = document.getElementById("hymn-play-btn");
const MONTAGE_DELAY = 1110; // milliseconds (adjust freely)
const hymnContinueBtn = document.getElementById("S2-proceed-btn");

if (hymnAudio && hymnPlayBtn && hymnContinueBtn) {
  hymnPlayBtn.onclick = () => {
  hymnPlayBtn.classList.add("hidden");
  hymnAudio.play();
  montage.start();
    
};

hymnAudio.onended = () => {
  montage.stop();
  hymnContinueBtn.classList.remove("hidden");
};

}

const progressContainer = document.getElementById("hymn-progress-container");
const progressBar = document.getElementById("hymn-progress-bar");

if (hymnAudio && progressBar) {
  // Update bar continuously
  hymnAudio.addEventListener("timeupdate", () => {
    const percent = (hymnAudio.currentTime / hymnAudio.duration) * 100;
    progressBar.style.width = percent + "%";
  });

  // Reset bar when audio ends
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

  // show first image immediately
  this.index = 0;
  this.images[this.index].classList.add("active");

  const FIRST_RUN_COUNT = 4;
  const TOTAL_IMAGES = this.images.length;
  const IMAGE_DURATION = 11310 / hymnSpeedMultiplier;

  this.interval = setInterval(() => {
    const current = this.images[this.index];
    current.classList.remove("active");

    // determine next index
    if (this.index < FIRST_RUN_COUNT - 1) {
      // still in first-run, just increment
      this.index++;
    } else {
      // loop images starting from index 4
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

    // Restart montage with new speed if running
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
  montageContainer.classList.add("clickable");
};

montageContainer.addEventListener("click", () => {
  montageShrunk = !montageShrunk;
  montageContainer.classList.toggle("shrunk", montageShrunk);
});



// ==========================
// STAGE 3 — IMAGE SELECTION
// ==========================
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

// ==========================
// STAGE 3 — CENTER TITLE HOVER
// ==========================
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


// ==========================
// FINAL STAGE
// ==========================
if (continueBtn) {
  continueBtn.onclick = () => {
    const finalImageEl = document.getElementById("final-image");
    const altImageEl = document.querySelector(".img-b");

    const url = new URL(chosenImage);
    const normalizedChosen = "." + decodeURIComponent(url.pathname);

    finalImageEl.src = normalizedChosen;

    let resolvedAltImage = null;
    if (ALT_IMAGE_MAP[normalizedChosen]) {
      resolvedAltImage = ALT_IMAGE_MAP[normalizedChosen];
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
      chosenImage: normalizedChosen,
      altImage: resolvedAltImage
    });
  };
}


// ==========================
// EFFECT TOGGLES (OVERLAY-BASED)
// ==========================
document
  .querySelectorAll('#controls input[data-toggle]')
  .forEach((input) => {
    const effectClass = input.dataset.toggle;
    const effectEl = document.querySelector(
      `#machine-container .${effectClass}`
    );

    if (!effectEl) return;

    // initial state
    effectEl.style.display = input.checked ? "block" : "none";

    // toggle on change
    input.addEventListener("change", () => {
      effectEl.style.display = input.checked ? "block" : "none";
    });
  });


  // ==========================
// MOVING EYES
// ==========================

        const eyes = document.querySelectorAll(".eye");
      const MAX_OFFSET = 3;

      document.addEventListener("mousemove", (e) => {
        eyes.forEach((eye) => {
          const pupil = eye.querySelector(".pupil");
          const rect = eye.getBoundingClientRect();

          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const dx = e.clientX - cx;
          const dy = e.clientY - cy;

          const angle = Math.atan2(dy, dx);
          const distance = Math.min(MAX_OFFSET, Math.hypot(dx, dy) / 12);

          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          pupil.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
      });


      const serialEl = document.getElementById("serial-value");
if (serialEl) {
  serialEl.textContent =
    "S-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}


})();


