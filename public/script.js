const IS_DEV_MODE = true;
let sugarMode = 'default';

const sugarDialogueTrees = {
    default: {
        nodeId: "start",
        text: "So, what's up?",
        choices: [
            { text: "You look super energetic today!", next: "energetic_path" },
            { text: "Are you hiding something from your blog?", next: "blog_path" },
            { text: "Let's just chill and listen to music.", next: "chill_path" }
        ]
    },
    energetic_path: {
        nodeId: "energetic_path",
        text: "Right?! I had way too much caffeine and a brilliant layout idea. Want to hear about it?",
        effect: { affection: 5, stress: 2 },
        choices: [
            { text: "Always! Tell me everything.", next: "energetic_deep_dive" },
            { text: "Maybe tone it down a bit before you crash.", next: "energetic_warning" }
        ]
    },
    energetic_deep_dive: {
        nodeId: "energetic_deep_dive",
        text: "YES! Okay, so imagine neon pink blinking margins, flashing marquee tags, and a custom cursor that leaves rainbow sparkles—",
        effect: { affection: 10, stress: -5 },
        choices: [
            { text: "That sounds like a masterpiece.", next: "end_positive" },
            { text: "That sounds like a migraine waiting to happen.", next: "end_tease" }
        ]
    },
    energetic_warning: {
        nodeId: "energetic_warning",
        text: "...Hmph. You sound like my calendar. But... yeah, okay, maybe a little break is fine.",
        effect: { affection: 2, stress: -10 },
        choices: [
            { text: "See? Trust me.", next: "end_positive" }
        ]
    },
    blog_path: {
        nodeId: "blog_path",
        text: "W-what?! No! I'm just typing regular journal stuff. Why, did you read something?!",
        effect: { affection: -2, stress: 8 },
        choices: [
            { text: "Just a hunch. You're acting suspicious.", next: "blog_defensive" },
            { text: "Relax, I'm just teasing you.", next: "blog_calm" }
        ]
    },
    blog_defensive: {
        nodeId: "blog_defensive",
        text: "Ugh, leave me alone! Sometimes my brain is just too loud and writing is the only way out...",
        effect: { stress: 10 },
        choices: [
            { text: "Hey, sorry. Take all the time you need.", next: "end_gentle" }
        ]
    },
    blog_calm: {
        nodeId: "blog_calm",
        text: "...Oh. Okay. Sorry for snapping. It's just hard keeping everything synchronized sometimes.",
        effect: { affection: 5, stress: -5 },
        choices: [
            { text: "We can talk about it whenever you're ready.", next: "end_positive" }
        ]
    },
    chill_path: {
        nodeId: "chill_path",
        text: "Oh, mood. Honestly, the playlist has been hitting just right today anyway.",
        effect: { affection: 5, stress: -5 },
        choices: [
            { text: "What song are you vibing to most?", next: "chill_music" }
        ]
    },
    chill_music: {
        nodeId: "chill_music",
        text: "Definitely the electronic tracks. They match the site's neon aesthetic perfectly.",
        effect: { affection: 5 },
        choices: [
            { text: "Couldn't agree more.", next: "end_positive" }
        ]
    },
    end_positive: {
        nodeId: "end_positive",
        text: "Hehe, yeah! Thanks for hanging out with me.",
        effect: { affection: 5, stress: -5 },
        choices: []
    },
    end_tease: {
        nodeId: "end_tease",
        text: "Hey! Rude! But... fine, maybe a little chaotic.",
        effect: { affection: 3, stress: 0 },
        choices: []
    },
    end_gentle: {
        nodeId: "end_gentle",
        text: "...Thanks. You're alright, you know that?",
        effect: { affection: 8, stress: -8 },
        choices: []
    }
};

let currentDialogueNode = sugarDialogueTrees.default;

function setSugarMode(mode) {
    sugarMode = mode;
    const avatarImg = document.getElementById("sugar-avatar");
    const dialogueBox = document.getElementById("dialogue-box");
    const optionsBox = document.getElementById("options-box");

    if (!avatarImg || !dialogueBox) return;

    switch (sugarMode) {
        case 'busy':
            avatarImg.src = "assets/art/Empty-(Jul-12-2026).png";
            dialogueBox.innerText = "Sugar is busy right now...";
            if (optionsBox) optionsBox.innerHTML = "";
            break;
        case 'gaming':
            avatarImg.src = "assets/art/Sugar-5-(Jul-8-2026).gif";
            dialogueBox.innerText = "Sugar is busy playing video games.";
            if (optionsBox) optionsBox.innerHTML = "";
            break;
        case 'blogging':
            avatarImg.src = "assets/art/Sugar-8-(Jul-11-2026).gif";
            dialogueBox.innerText = "Sugar is typing a new blog...";
            if (optionsBox) optionsBox.innerHTML = "";
            setTimeout(() => setSugarMode('default'), 5000);
            break;
        case 'sleep':
            avatarImg.src = "assets/art/Sugar-9-(Jul-12-2026).gif";
            dialogueBox.innerText = "Sugar is sleeping... Zzz...";
            if (optionsBox) optionsBox.innerHTML = "";
            break;
        case 'andy':
            avatarImg.src = "assets/art/Andy-(Jul-16-2026).png";
            dialogueBox.innerText = "...don't look at me.";
            document.body.classList.add('andy-mode');
            renderAndyOptions();
            break;
        default:
            avatarImg.src = "assets/art/Sugar-11-(Jul-25-2026).gif";
            dialogueBox.innerText = "So, what's up?";
            document.body.classList.remove('andy-mode');
            renderDefaultOptions();
            break;
    }
}

function renderDialogueNode(node) {
    const dialogueBox = document.getElementById("dialogue-box");
    const optionsBox = document.getElementById("options-box");
    if (!dialogueBox || !optionsBox) return;

    optionsBox.innerHTML = "";

    typeWriterEffect(dialogueBox, node.text, 25, () => {
        if (node.effect) {
            applyStatChanges(node.effect);
        }

        if (!node.choices || node.choices.length === 0) {
            const btn = document.createElement("button");
            btn.className = "dialogue-choice";
            btn.innerText = "► (Back)";
            btn.onclick = () => {
                currentDialogueNode = sugarDialogueTrees.default;
                renderDialogueNode(currentDialogueNode);
            };
            optionsBox.appendChild(btn);
            return;
        }

        node.choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "dialogue-choice";
            btn.innerText = `► ${choice.text}`;
            btn.onclick = () => {
                if (sugarDialogueTrees[choice.next]) {
                    currentDialogueNode = sugarDialogueTrees[choice.next];
                    renderDialogueNode(currentDialogueNode);
                }
            };
            optionsBox.appendChild(btn);
        });
    });
}

let typingInterval = null;

function typeWriterEffect(element, text, speed = 25, callback = null) {
    if (!element) return;
    
    if (typingInterval) {
        clearInterval(typingInterval);
    }

    element.innerText = "";
    let i = 0;

    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            if (callback) callback();
        }
    }, speed);
}

function applyStatChanges(effect) {
    console.log("Applying stat changes:", effect);
    
    const stressMeter = document.getElementById('meter-stress');
    const affectionMeter = document.getElementById('meter-affection');
    
    let currentStress = parseInt(document.getElementById('txt-stress').innerText) || 0;
    let currentAffection = parseInt(document.getElementById('txt-affection').innerText) || 0;

    if (effect.stress) {
        currentStress = Math.max(0, Math.min(100, currentStress + effect.stress));
    }
    if (effect.affection) {
        currentAffection = Math.max(0, Math.min(100, currentAffection + effect.affection));
    }

    if (stressMeter) stressMeter.style.width = currentStress + '%';
    const txtStress = document.getElementById('txt-stress');
    if (txtStress) txtStress.innerText = currentStress + '%';

    if (affectionMeter) affectionMeter.style.width = currentAffection + '%';
    const txtAffection = document.getElementById('txt-affection');
    if (txtAffection) txtAffection.innerText = currentAffection + '%';
}

function renderDefaultOptions() {
    currentDialogueNode = sugarDialogueTrees.default;
    renderDialogueNode(currentDialogueNode);
}

function renderAndyOptions() {
    const optionsBox = document.getElementById("options-box");
    const dialogueBox = document.getElementById("dialogue-box");
    if (!optionsBox) return;
    
    optionsBox.innerHTML = "";
    
    const andyChoices = [
        { text: "Are you okay?", response: "No. Leave it alone." },
        { text: "What happened?", response: "Just life. Don't worry about it." },
        { text: "Rest...", response: "...I am trying." }
    ];

    andyChoices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "dialogue-choice";
        btn.innerText = `► ${choice.text}`;
        btn.onclick = () => { 
            if (dialogueBox) dialogueBox.innerText = choice.response; 
        };
        optionsBox.appendChild(btn);
    });
}

async function loadSiteData() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/SugarHyou/sugarhyperdose/main/public/output/journal.json', {
            cache: 'no-store'
        });
        const data = await res.json();

        const container = document.getElementById('blog-posts-container');
        if (!container || !data.posts) return;

        container.innerHTML = "";

        data.posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.style.marginBottom = "20px";
            postEl.style.borderBottom = "1px solid #ccc";
            postEl.style.paddingBottom = "10px";

            postEl.innerHTML = `
                <div class="flex" style="align-items: center; gap: 8px; margin-bottom: 5px;">
                    <img src="assets/art/Sugar-3-(Jul-4-2026).png" style="width: 40px; height: 40px; border: 2px solid red;">
                    <div class="flex column">
                        <span>SugarHyperdose</span>
                        <span style="margin-top: 2.5px; font-size: 0.7rem; opacity: 0.6;">${post.date}</span>
                    </div>
                </div>
                <h3 style="margin: 0 0 5px 0;">${post.title}</h3>
                <div style="font-size: 0.9rem;">${post.content}</div>
            `;
            container.appendChild(postEl);
        });

    } catch (e) {
        console.error("Failed to load blog data:", e);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    checkSleepStatus();

    if (sugarMode !== 'sleep') {
        const savedMode = localStorage.getItem('sugar_mode_request') || 'default';
        setSugarMode(savedMode);
    }

    setInterval(checkSleepStatus, 60000);

    makeWindowsDraggable();
    loadSiteData();
    populatePlaylist();
});

function playSong(trackName, audioSrc) {
    const audioEngine = document.getElementById('audio-engine');
    const playerTitle = document.getElementById('player-track-title');

    if (!audioEngine || !playerTitle) return;

    audioEngine.src = audioSrc;
    audioEngine.play();

    playerTitle.innerText = `NOW PLAYING: ${trackName}`;
}

function controlAudio(action) {
    const audioEngine = document.getElementById('audio-engine');
    const playerTitle = document.getElementById('player-track-title');
    if (!audioEngine) return;

    if (action === 'play' && audioEngine.src) {
        audioEngine.play();
    } else if (action === 'pause') {
        audioEngine.pause();
    } else if (action === 'stop') {
        audioEngine.pause();
        audioEngine.currentTime = 0;
        if (playerTitle) {
            playerTitle.innerText = "TRACK: [ IDLE / STOPPED ]";
            playerTitle.style.color = "lime";
        }
    }
}

const myPlaylist = [
    { title: "混沌ブギ 初音ミク", file: "assets/audio/music/混沌ブギ 初音ミク.mp3" },
    { title: "＋♂", file: "assets/audio/music/plus-boy.mp3" },
    { title: "BANG BANG BANG", file: "assets/audio/music/BANG BANG BANG.mp3" },
    { title: "Chiwawa", file: "assets/audio/music/Chiwawa.mp3" },
    { title: "Confessions of a Rotten Girl", file: "assets/audio/music/Confessions of a Rotten Girl.mp3" },
    { title: "ELECTRIC WEEKEND ZONE", file: "assets/audio/music/ELECTRIC WEEKEND ZONE.mp3" }
];

function populatePlaylist() {
    const container = document.getElementById('playlist-container');
    if (!container) return;

    container.innerHTML = "";

    myPlaylist.forEach((song, index) => {
        const trackDiv = document.createElement('div');
        trackDiv.className = "playlist-track";
        trackDiv.style.cursor = "pointer";
        trackDiv.style.padding = "4px";
        trackDiv.innerText = `${(index + 1).toString().padStart(2, '0')}. ${song.title}`;

        trackDiv.onclick = () => playSong(song.title, song.file);

        container.appendChild(trackDiv);
    });
}

function toggleWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.toggle('hidden');
    }
}

const windowRestorationPositions = {};

function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        const saved = windowRestorationPositions[id];
        if (saved) {
            win.style.top = saved.top;
            win.style.left = saved.left;
            win.style.width = saved.width;
            win.style.height = saved.height;
        }
    } else {
        windowRestorationPositions[id] = {
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height
        };

        win.classList.add('maximized');
        win.style.top = "0px";
        win.style.left = "0px";
        win.style.width = "100vw";
        win.style.height = "100vh";
    }
}

function makeWindowsDraggable() {
    const titles = document.querySelectorAll('.window-title');

    titles.forEach(title => {
        const win = title.closest('.window');
        if (!win) return;

        title.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || win.classList.contains('maximized')) return;

            document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
            win.style.zIndex = "100";

            let startX = e.clientX;
            let startY = e.clientY;

            let rect = win.getBoundingClientRect();
            let startLeft = rect.left;
            let startTop = rect.top;

            function elementDrag(e) {
                e.preventDefault();
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                win.style.left = (startLeft + dx) + "px";
                win.style.top = (startTop + dy) + "px";

                win.style.margin = "0";
            }

            function closeDragElement() {
                document.removeEventListener('mouseup', closeDragElement);
                document.removeEventListener('mousemove', elementDrag);
            }

            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        });
    });
}

function switchAboutTab(tabId) {
    const tabs = document.querySelectorAll('.about-tab-content');
    tabs.forEach(tab => tab.style.display = 'none');

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.style.display = 'flex';

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.style.border = "2px outset #fff";
        btn.style.opacity = "0.6";
    });

    const clickedBtn = event.currentTarget;
    clickedBtn.style.border = "2px inset #000";
    clickedBtn.style.opacity = "1";
}

window.addEventListener('storage', (event) => {
    if (event.key === 'sugar_mode_request') {
        const newMode = event.newValue;
        if (newMode) {
            setSugarMode(newMode);
            console.log("Mode updated from dashboard: " + newMode);
        }
    }
});

const openSound = new Audio('assets/audio/ui/Maximize.wav');

function playOpen() {
    openSound.currentTime = 0;
    openSound.play().catch(e => console.log("Open audio blocked by browser policy"));
}

function handleSugarClick() {
    if (sugarMode === 'default') {
        const dialogueBox = document.getElementById("dialogue-box");
        if (dialogueBox) {
            dialogueBox.innerText = "Stop poking me!";
            setTimeout(() => setSugarMode('default'), 2000);
        }
    }
}

function triggerBlogAnimation() {
    const chatWin = document.getElementById('window-chat');
    if (chatWin) {
        chatWin.classList.remove('hidden');
        setSugarMode('blogging');
        playOpen();
    }
}

async function updateUIStats() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/SugarHyou/sugarhyperdose/main/public/output/journal.json');
        const data = await res.json();

        if (data.currentStats) {
            const stats = data.currentStats;

            document.getElementById('meter-stress').style.width = stats.stress + '%';
            document.getElementById('txt-stress').innerText = stats.stress + '%';

            document.getElementById('meter-affection').style.width = stats.affection + '%';
            document.getElementById('txt-affection').innerText = stats.affection + '%';
        }
    } catch (error) {
        console.error("Failed to sync stats:", error);
    }
}

window.addEventListener('load', () => {
    updateUIStats();
});

let date = new Date();

const characterEvents = {
    "4-25": ["SugarHyou's Neocities Anniversary! ✨"],
    "10-14": ["SugarHyou's Birthday! ✨"],
    "2026-5-2": ["One4AllTeam Cosplay Meetup"],
    "2026-5-15": ["Comic-Con Revolution Early Badge Pickup"],
    "2026-5-16": ["Comic-Con Revolution! ✨"],
    "2026-5-17": ["Comic-Con Revolution! ✨"],
    "2026-5-21": ["BN Appt"],
    "2026-5-24": ["BKawaii Market x Kira Kira Gals! ✨"],
    "2026-5-30": ["Anime Riverside ✨"],
    "2026-5-31": ["Anime Riverside ✨"],
    "2026-6-6": ["One4AllTeam "],
    "2026-6-8": ["Photoshoot"],
    "2026-6-19": ["The Nostalgia Con"],
    "2026-6-20": ["Anime Night Mart", "Harajuku Day Swap Meet", "The Nostalgia Con", "Jade's Furry Friends 5K Run/Walk", "QCON", "Santa Ana Flea Market"],
    "2026-6-21": ["The Nostalgia Con", "Anime Night Mart"],
    "2026-6-22": ["STEP"],
    "2026-6-23": ["STEP"],
    "2026-6-24": ["STEP"],
    "2026-6-25": ["STEP"],
    "2026-6-26": ["Fan Expo Anaheim"],
    "2026-6-27": ["Fan Expo Anaheim"],
    "2026-6-28": ["Fan Expo Anaheim"],
    "2026-6-29": ["STEP"],
    "2026-6-30": ["STEP"],
    "2026-7-1": ["STEP"],
    "2026-7-2": ["Anime Expo! ✨", "STEP"],
    "2026-7-3": ["Anime Expo! ✨"],
    "2026-7-4": ["Harajuku Day Swap Meet", "Anime Expo"],
    "2026-7-5": ["Anime Expo"],
    "2026-7-11": ["Spirit of Japan Festival! ✨"],
    "2026-7-12": ["Spirit of Japan Festival! ✨"],
    "2026-7-15": ["New Patient Intake"],
    "2026-7-18": ["Santa Ana Flea Market"],
    "2026-7-21": ["Counseling"],
    "2026-8-7": ["Drop"],
    "2026-8-15": ["Sonic Boost"],
    "2026-8-16": ["Sonic Boost"],
    "2026-8-24": ["First day of School"],
    "2026-9-5": ["Anime San Diego! ✨"],
    "2026-9-6": ["Anime San Diego! ✨"],
};

let fetchedHolidays = {};
let calDate = new Date();

function fetchHolidays(year) {
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/US`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(holiday => {
                const parts = holiday.date.split('-');
                const key = `${parseInt(parts[0], 10)}-${parseInt(parts[1], 10)}-${parseInt(parts[2], 10)}`;
                fetchedHolidays[key] = holiday.localName;
            });
            renderCalendar();
        })
        .catch(err => console.error("Error fetching holidays:", err));
}

function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const grid = document.getElementById('calendarGrid');
    if (!grid || !monthDisplay) return;

    grid.innerHTML = "";
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthName = calDate.toLocaleString('default', { month: 'long' });
    monthDisplay.innerText = `${monthName} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    for (let i = 1; i <= lastDate; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = i;
        const absKey = `${year}-${month + 1}-${i}`;
        const recKey = `${month + 1}-${i}`;

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayDiv.classList.add('today');

        let dayEvents = [];
        if (characterEvents[absKey]) dayEvents = dayEvents.concat(characterEvents[absKey]);
        if (characterEvents[recKey]) dayEvents = dayEvents.concat(characterEvents[recKey]);
        if (fetchedHolidays[absKey]) dayEvents.push(fetchedHolidays[absKey]);

        if (dayEvents.length > 0) {
            dayDiv.classList.add('event-day');
            const combinedText = dayEvents.join('\n');
            dayDiv.title = combinedText;
            dayDiv.onclick = () => alert(`Events for today:\n\n${combinedText}`);
        }
        grid.appendChild(dayDiv);
    }
}

const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
if (prevBtn) prevBtn.onclick = () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); };
if (nextBtn) nextBtn.onclick = () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); };

fetchHolidays(calDate.getFullYear());

function checkSleepStatus() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 2 && hour < 9) {
        setSugarMode('sleep');
    } else if (sugarMode === 'sleep') {
        setSugarMode('default');
    }
}

async function loadStatusWidgets() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/SugarHyou/sugarhyperdose/main/public/output/journal.json');
        const data = await response.json();

        document.getElementById('widget-art-img').src = data.art.image;
        document.getElementById('widget-art-title').innerText = data.art.title;
        document.getElementById('widget-art-desc').innerText = data.art.desc;

        document.getElementById('widget-play-img').src = data.playing.image;
        document.getElementById('widget-play-title').innerText = data.playing.title;
        document.getElementById('widget-play-desc').innerText = data.playing.desc;

        document.getElementById('widget-watch-img').src = data.watching.image;
        document.getElementById('widget-watch-title').innerText = data.watching.title;
        document.getElementById('widget-watch-desc').innerText = data.watching.desc;
    } catch (error) {
        console.error("Failed to load status widgets:", error);
    }
}

loadStatusWidgets();