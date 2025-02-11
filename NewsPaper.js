let lastMouseActivity = Date.now();
let checkTimer;
let isActive = true;
const INACTIVITY_DELAY = 30000;
const CHECK_INTERVAL = 1000;

function updateLastActivity() {
    lastMouseActivity = Date.now();
    document.getElementById("newspaper").classList.remove("show");
    isActive = true;
}

function checkInactivity() {
    const currentTime = Date.now();
    const inactiveTime = currentTime - lastMouseActivity;
    
    if (isActive && inactiveTime >= INACTIVITY_DELAY) {
        isActive = false;
        const newsSystem = new NewsSystem();
        const news = newsSystem.generateNews();
        document.getElementById("newspaper-text").innerHTML = news;
        document.getElementById("newspaper").classList.add("show")
    }
}

document.addEventListener('mousemove', updateLastActivity);
document.addEventListener('mousedown', updateLastActivity);

checkTimer = setInterval(checkInactivity, CHECK_INTERVAL);