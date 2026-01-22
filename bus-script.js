//====================================
// LOAD
//====================================
      const savedData =
        JSON.parse(localStorage.getItem("immigrationResult")) || {};

      const {
        name = "NAME",
        birthplace = "",
        birthdate = "",
        height = "",
        escape = "",
        score = 0,
        chosenImage = "",
        altImage = "",
      } = savedData;

      document.getElementById("id-name").textContent = name;
      document.getElementById("score-value").textContent = score;

      document.getElementById("stat-born").textContent = birthplace;
      document.getElementById("stat-fled").textContent = escape;
      document.getElementById("stat-date").textContent = birthdate;
      document.getElementById("stat-height").textContent = height;

      const imgA = document.querySelector(".img-a");
      const imgB = document.querySelector(".img-b");

      if (imgA && chosenImage) imgA.src = chosenImage;
      if (imgB && altImage) imgB.src = altImage;

//====================================
// TILT MECHANICS
//====================================

      const corner = document.getElementById("id-card-corner");
      const perspective = document.getElementById("id-card-perspective");
      const card = document.getElementById("id-card");

      let enlarged = false;
      const smallScale = 0.35;
      const offset = 20;
      let lastMouseX = 0;
      let lastMouseY = 0;

      document.addEventListener("mousemove", (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (!enlarged) {
          corner.style.left = `${e.clientX + offset}px`;
          corner.style.top = `${e.clientY + offset}px`;
          corner.style.transform = `scale(${smallScale})`;

          card.style.transform = "rotateX(0deg) rotateY(0deg)";
          imgA.style.opacity = 1;
          imgB.style.opacity = 0;
          return;
        }

        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (cy - e.clientY) / (rect.height / 2);

        const clampedX = Math.max(-1, Math.min(1, nx));
        const clampedY = Math.max(-1, Math.min(1, ny));

        const maxRotX = 18;
        const maxRotY = 35;

        const rotX = clampedY * maxRotX;
        const rotY = clampedX * maxRotY;

        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        const revealAngle = 6; // degrees before alt image starts appearing

        let fade = (Math.abs(rotY) - revealAngle) / (maxRotY - revealAngle);
        fade = Math.max(0, Math.min(1, fade));

        imgB.style.opacity = fade;
        imgA.style.opacity = 1 - fade;
      });

      document.addEventListener("click", () => {
        enlarged = !enlarged;

        if (enlarged) {
          corner.classList.add("enlarged");
          corner.style.left = "";
          corner.style.top = "";
          corner.style.transform = "translate(-92%, -92%) scale(1)";
        } else {
          corner.classList.remove("enlarged");
          card.style.transform = "rotateX(0deg) rotateY(0deg)";

          corner.style.left = `${lastMouseX + offset}px`;
          corner.style.top = `${lastMouseY + offset}px`;
          corner.style.transform = `scale(${smallScale})`;
        }
      });

      const ST_COUNT = 24;
      const LINE_COUNT = 20;

      const table = document.getElementById("schedule");

      function randomTime() {
        const h = Math.floor(Math.random() * 23);
        const m = Math.floor(Math.random() * 59);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }

//====================================
// TIMETABLE
//====================================

      /* ---------- HEADER ---------- */
      const thead = document.createElement("thead");
      const hr = document.createElement("tr");

      const thStop = document.createElement("th");
      thStop.textContent = "ST";
      thStop.className = "stop";
      hr.appendChild(thStop);

      for (let l = 1; l <= LINE_COUNT; l++) {
        const th = document.createElement("th");
        th.textContent = `${String(l).padStart(2)}`;
        hr.appendChild(th);
      }

      thead.appendChild(hr);
      table.appendChild(thead);

      /* ---------- BODY ---------- */
      const tbody = document.createElement("tbody");

      function generateBody() {
        tbody.innerHTML = "";

        for (let s = 1; s <= ST_COUNT; s++) {
          /* ---------- ANKUNFT ---------- */
          const trArr = document.createElement("tr");

          const tdStop = document.createElement("td");
          tdStop.className = "stop";
          tdStop.rowSpan = 2;
          tdStop.textContent = `ST-${String(s).padStart(4, "0")}`;
          trArr.appendChild(tdStop);

          for (let l = 1; l <= LINE_COUNT; l++) {
            const td = document.createElement("td");
            const holds = Math.random() < 0.22;
            td.textContent = holds ? randomTime() : "—";
            trArr.appendChild(td);
          }

          /* ---------- ABFAHRT ---------- */
          const trDep = document.createElement("tr");

          for (let l = 1; l <= LINE_COUNT; l++) {
            const td = document.createElement("td");
            const holds = Math.random() < 0.22;
            td.textContent = holds ? randomTime() : "—";
            trDep.appendChild(td);
          }

          tbody.appendChild(trArr);
          tbody.appendChild(trDep);
        }
      }

      table.appendChild(tbody);
      generateBody();

      setInterval(generateBody, 10000);