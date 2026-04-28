let userName = localStorage.getItem("username") || "Guest";

window.onload = function () {
    document.getElementById("nameDisplay").innerText = userName;
    document.getElementById("nameInput").value = userName;

    updateTime();
    updateTimerDisplay();
    renderTasks();
    renderLinks();
    loadTheme();

    document.getElementById("themeToggle").onclick = toggleTheme;
};

function saveName() {
    const input = document.getElementById("nameInput").value;

    if (input.trim() === "") return;

    userName = input;
    localStorage.setItem("username", userName);

    document.getElementById("nameDisplay").innerText = userName;

    updateTime();
    playSound();
    celebrateName();
    clearInputs();
}

function updateTime() {
    const now = new Date();

    document.getElementById("time").innerText = now.toLocaleTimeString();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("date").innerText =
        now.toLocaleDateString("en-US", options);

    let hour = now.getHours();
    let greeting = "";

    if (hour < 12) greeting = "🌞 Good Morning, ";
    else if (hour < 18) greeting = "🍯 Good Afternoon, ";
    else greeting = "🌙 Good Evening, ";

    document.getElementById("greeting").innerHTML =
        greeting + '<span id="nameDisplay">' + userName + "</span>";
}

setInterval(updateTime, 1000);

let timer;
let timeLeft = localStorage.getItem("timer")
    ? parseInt(localStorage.getItem("timer"))
    : 1500;

function updateTimerDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;

    document.getElementById("timer").innerText =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            localStorage.setItem("timer", timeLeft);
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            alert("Time's up! 🐣");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    localStorage.setItem("timer", timeLeft);
    updateTimerDisplay();
}

function setCustomTimer() {
    const val = document.getElementById("customMinutes").value;

    if (val === "" || val <= 0) return;

    clearInterval(timer);
    timeLeft = val * 60;
    localStorage.setItem("timer", timeLeft);
    updateTimerDisplay();

    clearInputs();
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    tasks.push({ text, done: false });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();

    clearInputs();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((t, i) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.innerText = t.text;

        span.onclick = () => {
            t.done = !t.done;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        };

        if (t.done) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        const btn = document.createElement("button");
        btn.innerText = "❌";
        btn.onclick = () => {
            tasks.splice(i, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        };

        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

let links = JSON.parse(localStorage.getItem("links")) || [];

function addLink() {
    const name = document.getElementById("linkName").value.trim();
    let url = document.getElementById("linkURL").value.trim();

    if (name === "" || url === "") return;

    if (!url.startsWith("http")) url = "https://" + url;

    links.push({ name, url });

    localStorage.setItem("links", JSON.stringify(links));
    renderLinks();

    clearInputs();
}

function renderLinks() {
    const container = document.getElementById("links");
    container.innerHTML = "";

    links.forEach((l, i) => {
        const div = document.createElement("div");

        const a = document.createElement("a");
        a.href = l.url;
        a.target = "_blank";
        a.innerText = l.name;

        const btn = document.createElement("button");
        btn.innerText = "❌";
        btn.onclick = () => {
            links.splice(i, 1);
            localStorage.setItem("links", JSON.stringify(links));
            renderLinks();
        };

        div.appendChild(a);
        div.appendChild(btn);
        container.appendChild(div);
    });
}

function playSound() {
    const sound = document.getElementById("celebratePopsound");
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(() => {});

    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
    }, 10000);
}

function celebrateName() {
    const end = Date.now() + 2000;

    (function frame() {
        confetti({
            particleCount: 6,
            spread: 120,
            origin: { x: 0.5, y: 0.6 }
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function clearInputs() {
    const ids = [
        "nameInput",
        "taskInput",
        "linkName",
        "linkURL",
        "customMinutes"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}
