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

    if (input.trim() !== "") {
        userName = input;
        localStorage.setItem("username", userName);

        document.getElementById("nameDisplay").innerText = userName;

        updateTime();
        playSound();
        celebrateName();
        clearInputs();
    }
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
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("timer").innerText =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
    const minutes = document.getElementById("customMinutes").value;

    if (minutes && minutes > 0) {
        clearInterval(timer);
        timeLeft = minutes * 60;
        localStorage.setItem("timer", timeLeft);
        updateTimerDisplay();
        clearInputs();
    }
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if (text === "") return;

    let isDuplicate = tasks.some(task =>
        task.text.toLowerCase() === text.toLowerCase()
    );

    if (isDuplicate) return;

    tasks.push({ text: text, done: false });
    saveTasks();
    renderTasks();
    clearInputs();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

let links = JSON.parse(localStorage.getItem("links")) || [];

function addLink() {
    let nameInput = document.getElementById("linkName");
    let urlInput = document.getElementById("linkURL");

    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (name === "" || url === "") return;

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    links.push({ name, url });

    saveLinks();
    renderLinks();
    clearInputs();
}

function saveLinks() {
    localStorage.setItem("links", JSON.stringify(links));
}

function playSound() {
    const sound = document.getElementById("celebratePopsound");
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;

    const playPromise = sound.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {});
    }

    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
    }, 10000);
}

function clearInputs() {
    document.getElementById("nameInput").value = "";
    document.getElementById("taskInput").value = "";
    document.getElementById("linkName").value = "";
    document.getElementById("linkURL").value = "";
    document.getElementById("customMinutes").value = "";
}
