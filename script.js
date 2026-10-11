
/* ==========================================
   RISHI ❤️ SANJUU LOVE QUIZ
   Complete Hinglish JavaScript
========================================== */

"use strict";

const TOTAL_LEVELS = 100;
const QUESTIONS_PER_LEVEL = 20;
const STORAGE_KEY = "rishiSanjuuLoveQuizV2";
const SOUND_KEY = "rishiQuizSound";

const $ = (id) => document.getElementById(id);
const screens = ["welcome", "quiz", "handoff", "result"];

const defaultState = {
    level: 1,
    completedLevels: [],
    memories: [],
    badges: [],
    soundEnabled: true,
    midnightMode: false,
    streak: 0,
    lastPlayedDate: "",
    unlockedRewards: [],
    history: []
};

let state = loadState();
let questions = [];
let questionIndex = 0;
let currentPlayer = "Rishi";
let answers = [];
let rishiAnswers = [];
let sanjuuAnswers = [];
let selectedOption = null;
let answerSubmitted = false;
let audioContext = null;
let toastTimer = null;
let wheelBusy = false;

/* ---------- HINGLISH QUESTION BANK ---------- */

const loveQuestions = [
    {
        q: "Rishi aur Sanjuu, relationship ko strong banane ke liye sabse zaroori kya hai?",
        options: ["Ek dusre par trust aur respect", "Sirf mehange gifts", "Har ladai jeetna", "Ek dusre ko ignore karna"]
    },
    {
        q: "Agar tumhara partner sad ho, toh use khush kaise karoge?",
        options: ["Uski baat sununga aur support karunga", "Uski feelings ignore karunga", "Usse ladne lagunga", "Uska mazaak udaunga"]
    },
    {
        q: "Tum dono ki sabse pyaari date kaisi hogi?",
        options: ["Saath mein kuch special karna", "Poora time phone chalana", "Har baat par competition karna", "Jaldi-jaldi ghar chale jaana"]
    },
    {
        q: "Agar tum dono ki ladai ho jaaye, toh kya karna chahiye?",
        options: ["Pyaar se baat karke problem solve karna", "Zor-zor se chillana", "Purani galtiyan ginana", "Baat karna band kar dena"]
    },
    {
        q: "Apne partner ko special feel kaise karaoge?",
        options: ["Uski efforts ki dil se tareef karunga", "Use for granted lunga", "Dusron se compare karunga", "Uski mehnat notice nahi karunga"]
    },
    {
        q: "Sanjuu ko surprise dena ho, toh kya karoge?",
        options: ["Uski pasand ki koi pyaari si cheez dunga", "Apni naapasand ki cheez dunga", "Bina baat ladai karunga", "Promise karke tod dunga"]
    },
    {
        q: "Relationship mein trust kaise bana rehta hai?",
        options: ["Sach bolne aur apni baat nibhaane se", "Har baat chhupane se", "Bina soche promise karne se", "Ek dusre ko confuse karne se"]
    },
    {
        q: "Roz ki kaunsi aadat relationship ko aur pyaara banati hai?",
        options: ["Ek dusre ka haal poochhna aur baat sunna", "Sirf zaroorat par baat karna", "Jaan-bujhkar messages ignore karna", "Har waqt complaints karna"]
    },
    {
        q: "Partner ki personal boundaries ke saath kya karna chahiye?",
        options: ["Unki respect karni chahiye", "Unhe ignore karna chahiye", "Unka mazaak udaana chahiye", "Baar-baar test karna chahiye"]
    },
    {
        q: "Koi memory special kis wajah se banti hai?",
        options: ["Usse judi feelings aur saath bitaya time", "Uski price", "Log usko kitna rate karte hain", "Woh kitni jaldi khatam hui"]
    },
    {
        q: "Agar Sanjuu apna koi dream poora karna chahe, toh kya karoge?",
        options: ["Uska confidence badhaunga aur support karunga", "Uske plans ko bekaar bolunga", "Use guilty feel karaunga", "Use dusron se compare karunga"]
    },
    {
        q: "Agar galti tumhari ho, toh sorry kaise bologe?",
        options: ["Apni galti maanunga aur sudharunga", "Kisi aur par blame daalunga", "Aise act karunga jaise kuch hua hi nahi", "Turant maaf karne ka pressure dunga"]
    },
    {
        q: "Saath mein quality time spend karne ka matlab kya hai?",
        options: ["Ek dusre ko time aur attention dena", "Saath baithkar alag-alag phone chalana", "Har cheez jaldi-jaldi karna", "Ek dusre ko ignore karna"]
    },
    {
        q: "Agar partner apni feelings share kare, toh kya karoge?",
        options: ["Bina judge kiye uski baat sununga", "Us par hasunga", "Uski baat bina permission sabko bataunga", "Har baar topic change kar dunga"]
    },
    {
        q: "Ek dusre ko aur achhe se kaise jaan sakte ho?",
        options: ["Questions poochhkar aur dhyaan se sunkar", "Soch lena ki sab kuch pehle se pata hai", "Baat karna avoid karna", "Kabhi kuch naya try na karna"]
    },
    {
        q: "Sanjuu ko bhejne ke liye sabse pyaara message kaisa hoga?",
        options: ["Dil se likha hua personal message", "Koi insult copy karke bhejna", "Attention ke liye demand karna", "Use embarrass karne wala message"]
    },
    {
        q: "Relationship mein apni hobbies rakhna kaisa hai?",
        options: ["Apni hobbies rakhna aur ek dusre ko support karna", "Har activity control karna", "Kabhi saath time na bitana", "Apni saari hobbies chhod dena"]
    },
    {
        q: "Agar tumhara plan achanak change ho jaaye, toh kya karoge?",
        options: ["Ek dusre ko bata kar milkar adjust karenge", "Baat chhupa lunga", "Bina soche partner ko blame karunga", "Baat karna band kar dunga"]
    },
    {
        q: "Agar Sanjuu kuch achieve kare, toh kya karoge?",
        options: ["Dil se khush hokar uski celebration karunga", "Baat apne baare mein karne lagunga", "Uski mehnat ko chhota bataunga", "Usse compete karunga"]
    },
    {
        q: "Kisi promise ki value kab hoti hai?",
        options: ["Jab promise soch-samajhkar karo aur use nibhao", "Jab badi-badi baatein karo", "Jab promise turant bhool jao", "Jab saara kaam dusre se karwao"]
    },
    {
        q: "Sanjuu ko good morning bolne ka pyaara tareeka kya hai?",
        options: ["Pyaar se ek sweet sa message bhejna", "Subah-subah complaint karna", "Bina baat ladai karna", "Kabhi reply hi na dena"]
    },
    {
        q: "Agar tum dono busy ho, toh connection kaise bana rahega?",
        options: ["Thoda sa time nikaal kar baat karenge", "Har waqt reply maangunga", "Bina baat bura sochunga", "Ek dusre ki situation nahi samjhunga"]
    },
    {
        q: "Gift ko special kya banata hai?",
        options: ["Gift choose karne ke peeche ki feelings", "Sirf uska size", "Sirf uski price", "Us par milne wale likes"]
    },
    {
        q: "Partner ko kaise feel karaoge ki tum uski baat samajhte ho?",
        options: ["Dhyaan se sununga aur questions poochhunga", "Har baat beech mein kaatunga", "Topic change kar dunga", "Uski problem ignore karunga"]
    },
    {
        q: "Partner ki galti ke baare mein kaise baat karni chahiye?",
        options: ["Respect se problem par baat karni chahiye", "Uski insult karni chahiye", "Har purani galti yaad dilani chahiye", "Sabke saamne embarrass karna chahiye"]
    },
    {
        q: "Relationship ko time ke saath better kya banata hai?",
        options: ["Dono ki taraf se effort aur care", "Sirf ek insaan ka effort", "Har difficult topic avoid karna", "Perfect hone ki expectation rakhna"]
    },
    {
        q: "Ek peaceful evening saath mein kaise spend karoge?",
        options: ["Pyaari baatein, relaxation ya koi common hobby", "Har baat par competition", "Ek dusre ko ignore karna", "Baithe-baithe ladai karna"]
    },
    {
        q: "Partner ki achievement par best reaction kya hoga?",
        options: ["Use celebrate karna aur encourage karna", "Use feel karana ki woh deserve nahi karta", "Baat badal dena", "Credit khud le lena"]
    },
    {
        q: "Relationship mein safe feel kab hota hai?",
        options: ["Jab respect, honesty aur kindness ho", "Jab dar aur control ho", "Jab har waqt shak ho", "Jab galti par saza mile"]
    },
    {
        q: "Saath mein nayi memory banane ka best tareeka kya hai?",
        options: ["Koi experience saath enjoy karna", "Dusron se compare karna", "Perfect photo ki tension lena", "Har cheez jaldi khatam karna"]
    },
    {
        q: "Koi difficult baat discuss karna easy kaise hoga?",
        options: ["Sabr rakhkar ek dusre ki baat sunne se", "Taane aur insults maarne se", "Dhamki dene se", "Baat sunne se mana karne par"]
    },
    {
        q: "Agar Sanjuu thaki hui ho, toh kya karoge?",
        options: ["Poochhunga ki use kis cheez ki zaroorat hai", "Attention dene ki demand karunga", "Us par aur pressure daalunga", "Uski thakaan ka mazaak udaunga"]
    },
    {
        q: "Agar tum dono ki hobbies alag hon, toh kya karoge?",
        options: ["Ek dusre ki pasand ki respect karenge", "Same hobbies rakhne ka pressure denge", "Ek dusre ka mazaak udaayenge", "Hobbies par baat nahi karenge"]
    },
    {
        q: "Tum dono ke inside jokes special kyun hote hain?",
        options: ["Unke peeche tum dono ki shared memory hoti hai", "Kisi aur ko samajh nahi aate", "Woh mehange hote hain", "Woh embarrassment karte hain"]
    },
    {
        q: "Partner ke liye gratitude kaise show karoge?",
        options: ["Uski efforts notice karke thank you bolunga", "Aur zyada expect karunga", "Apni feelings chhupaunga", "Dono ke efforts compare karunga"]
    },
    {
        q: "Agar tumhe partner ke saath time spend karna ho, toh kya karoge?",
        options: ["Pyaar se poochhkar dono ke liye time nikaalunga", "Guilt feel karaunga", "Turant attention maangunga", "Late reply par punish karunga"]
    },
    {
        q: "Agar future ko lekar confusion ho, toh kya karoge?",
        options: ["Honestly baat karke milkar solution dhoondhenge", "Khud hi assumptions bana lunga", "Afwaah phailaunga", "Har conversation avoid karunga"]
    },
    {
        q: "Anniversary ko special kya banata hai?",
        options: ["Apni journey aur saath bitaye time ko celebrate karna", "Zaroorat se zyada kharch karna", "Dusre couples se compete karna", "Har cheez perfect hone ki demand"]
    },
    {
        q: "Agar partner ki opinion tumse alag ho, toh kya karoge?",
        options: ["Disagree hone par bhi uski baat sununga", "Uski insult karunga", "Uski baat sunne se mana karunga", "Uski personal baat bina permission share karunga"]
    },
    {
        q: "Relationship mein connection banaaye rakhne ki achhi habit kya hai?",
        options: ["Regularly pyaar se baat karna", "Sirf ladai ke time baat karna", "Dil mein narazgi chhupana", "Ek dusre ki loyalty test karna"]
    },
    {
        q: "Agar kisi message ka galat matlab samajh aa jaaye, toh kya karoge?",
        options: ["Pyaar se poochhkar clear karunga", "Sabse bura assume karunga", "Gusse mein reply karunga", "Hamesha ke liye ignore kar dunga"]
    },
    {
        q: "Partner ka confidence kaise badhaoge?",
        options: ["Dil se support aur appreciation dunga", "Har waqt kamiyaan nikaalunga", "Dusron se compare karunga", "Uski feelings ignore karunga"]
    },
    {
        q: "Chhoti si celebration ko special kaise banaoge?",
        options: ["Apne tareeke se khushi saath share karenge", "Sabse mehangi cheez khareedenge", "Dusron ko jealous karenge", "Use competition bana denge"]
    },
    {
        q: "Agar partner ko thoda space chahiye, toh kya karoge?",
        options: ["Uski baat respect karke baad mein reconnect karenge", "Baar-baar contact karunga", "Use guilty feel karaunga", "Soch lunga ki relationship khatam ho gayi"]
    },
    {
        q: "Long-distance call ko special kaise banaoge?",
        options: ["Ek dusre ko poora attention denge", "Bina sune doosre kaam karunga", "Reply time par ladai karunga", "Apne din ke baare mein nahi bataunga"]
    },
    {
        q: "Jab life stressful ho, toh couple kya kar sakta hai?",
        options: ["Ek dusre ko support karke needs discuss karenge", "Ek dusre ko blame karenge", "Busy hone ka competition karenge", "Har tension chhupa lenge"]
    },
    {
        q: "Future ke plans kaise banane chahiye?",
        options: ["Apne dreams aur practical plans saath discuss karenge", "Maan lunga ki partner agree hai", "Har decision akele lunga", "Future par baat nahi karunga"]
    },
    {
        q: "Maaf karne ka matlab kya hota hai?",
        options: ["Hurt ko samajhkar healthy boundaries ke saath aage badhna", "Aise dikhana jaise kuch hua hi nahi", "Saari boundaries bhool jaana", "Turant maaf karne ka pressure dena"]
    },
    {
        q: "Normal se din ko bhi special kaise banaoge?",
        options: ["Thodi kindness, pyaari baatein aur hasi share karke", "Sirf special occasions ka wait karke", "Apne din ko dusron se compare karke", "Har cheez mein kami nikaal kar"]
    },
    {
        q: "Time ke saath pyaar kaise badhta hai?",
        options: ["Dono ki care, trust aur regular effort se", "Jealousy aur control se", "Ek dusre ka hisaab rakhne se", "Partner se mind-reading expect karne se"]
    },
    {
        q: "Couple ko ek team kya banata hai?",
        options: ["Problems ko milkar solve karna", "Ek dusre ko haraane ki koshish", "Shared decisions chhupana", "Har baat ka blame ek par daalna"]
    },
    {
        q: "Partner ke din mein interest kaise dikhaoge?",
        options: ["Uska din kaisa gaya poochhkar dhyaan se sununga", "Bas formality ke liye poochhkar tokunga", "Uski baat ko bekaar bolunga", "Turant topic badal dunga"]
    },
    {
        q: "Agar tumhe koi baat buri lage, toh kaise bataoge?",
        options: ["Shaanti se apni feelings samjhaunga", "Insult karunga", "Dhamki dunga", "Expect karunga ki partner khud samajh jaaye"]
    },
    {
        q: "Agar tumhara partner kuch naya try kare, toh kya karoge?",
        options: ["Use encourage karunga aur interest dikhaunga", "Shuru hone se pehle mazaak udaunga", "Use rok dunga", "Uski pehli try ko experts se compare karunga"]
    },
    {
        q: "Compliment dil ko tab chhoota hai jab...",
        options: ["Woh sachcha aur dil se diya gaya ho", "Kisi kaam ke liye diya gaya ho", "Partner ko ex se compare kare", "Tareef ke naam par insult ho"]
    },
    {
        q: "Agar partner ke saath embarrassing moment ho jaaye, toh kya karoge?",
        options: ["Uska support karunga aur respect rakhunga", "Bina permission sabko bataunga", "Mana karne ke baad bhi tease karunga", "Use competition bana dunga"]
    },
    {
        q: "Relationship mein expectations healthy kaise rahengi?",
        options: ["Apni needs discuss karke realistic rehne se", "Expect karne se ki partner sab samajh jaaye", "Bina discussion rules banaane se", "Har galti ko failure samajhne se"]
    },
    {
        q: "Tum dono ki koi special tradition meaningful kyun hoti hai?",
        options: ["Kyunki usse connection aur memories banti hain", "Kyunki woh mehengi hoti hai", "Kyunki woh popular dikhti hai", "Kyunki strangers impress hote hain"]
    },
    {
        q: "Busy week ke baad ek dusre se reconnect kaise karoge?",
        options: ["Saath baat karne aur enjoy karne ka time nikaalenge", "Ek dusre se poori report maangenge", "Compare karenge kisne zyada kaam kiya", "Milte hi complaints shuru karenge"]
    },
    {
        q: "Long-term commitment ki strong foundation kya hai?",
        options: ["Honesty, dono ki marzi aur saath mein effort", "Pressure aur dar", "Sirf public promises", "Apni boundaries chhod dena"]
    }
];

/* ---------- STORAGE ---------- */

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

        if (!saved || typeof saved !== "object") {
            return { ...defaultState };
        }

        return {
            ...defaultState,
            ...saved,
            level: Math.min(TOTAL_LEVELS, Math.max(1, Number(saved.level) || 1)),
            completedLevels: Array.isArray(saved.completedLevels) ? saved.completedLevels : [],
            memories: Array.isArray(saved.memories) ? saved.memories : [],
            badges: Array.isArray(saved.badges) ? saved.badges : [],
            unlockedRewards: Array.isArray(saved.unlockedRewards) ? saved.unlockedRewards : [],
            history: Array.isArray(saved.history) ? saved.history : []
        };
    } catch (error) {
        console.warn("Saved game could not be loaded:", error);
        return { ...defaultState };
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        showToast("Progress save nahi ho paaya. Browser storage check karo.");
    }
}

function loadSoundPreference() {
    try {
        const saved = localStorage.getItem(SOUND_KEY);
        if (saved !== null) state.soundEnabled = saved === "true";
    } catch (error) {
        console.warn("Sound preference unavailable.");
    }
}

/* ---------- SCREEN NAVIGATION ---------- */

function showScreen(screenId) {
    screens.forEach((id) => {
        const element = $(id);
        if (element) element.classList.toggle("active", id === screenId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateHeader() {
    $("levelBadge").textContent = `Level ${state.level} / ${TOTAL_LEVELS}`;
}

function updateWelcome() {
    $("savedLevel").textContent = `Level ${state.level}`;

    const completed = state.completedLevels.length;
    $("savedProgressText").textContent =
        `${completed} level complete ho chuke hain. Tumhari progress isi device par save hai.`;

    $("streakText").textContent =
        `🔥 Couple streak: ${state.streak} din`;

    updateLoveMeter();
    renderRewards();
    renderBadges();
    renderMemories();
    updateHeader();
}

/* ---------- SOUND ---------- */

function playTone(frequency = 660, duration = 0.12, type = "sine") {
    if (!state.soundEnabled) return;

    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        audioContext = audioContext || new AudioCtx();

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.warn("Sound could not play.");
    }
}

function playSuccess() {
    playTone(523, 0.12);
    window.setTimeout(() => playTone(659, 0.12), 100);
    window.setTimeout(() => playTone(784, 0.2), 200);
}

function updateSoundButton() {
    $("soundToggle").textContent = state.soundEnabled ? "🔊" : "🔇";
    $("soundToggle").setAttribute(
        "aria-label",
        state.soundEnabled ? "Sound band karo" : "Sound chalu karo"
    );
}

/* ---------- HINGLISH PHONE PASS VOICE ---------- */

function speakPassPhone(playerName) {
    if (!("speechSynthesis" in window)) return;

    try {
        window.speechSynthesis.cancel();

        const message = new SpeechSynthesisUtterance(
            `Arey ${playerName}, ab tumhari baari hai! Phone lo aur apna answer do.`
        );

        message.lang = "hi-IN";
        message.rate = 0.9;
        message.pitch = 1.1;
        message.volume = 0.9;

        window.speechSynthesis.speak(message);
    } catch (error) {
        console.warn("Voice unavailable.");
    }
}

/* ---------- QUESTION SELECTION ---------- */

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function prepareQuestions() {
    const mixed = shuffle(loveQuestions);

    questions = Array.from({ length: QUESTIONS_PER_LEVEL }, (_, index) => {
        const source = mixed[index % mixed.length];

        return {
            q: source.q,
            options: shuffle(
                source.options.map((text, originalIndex) => ({
                    text,
                    correct: originalIndex === 0
                }))
            )
        };
    });
}

function currentQuestion() {
    return questions[questionIndex];
}

/* ---------- START GAME ---------- */

function startGame() {
    questionIndex = 0;
    currentPlayer = "Rishi";
    answers = [];
    rishiAnswers = [];
    sanjuuAnswers = [];
    selectedOption = null;
    answerSubmitted = false;

    prepareQuestions();
    updateHeader();
    showScreen("quiz");
    renderQuestion();
    playTone(660, 0.12);
}

function renderQuestion() {
    const question = currentQuestion();
    if (!question) return;

    selectedOption = null;
    answerSubmitted = false;

    $("turnLabel").textContent = `${currentPlayer} ki baari hai 💖`;
    $("progressText").textContent =
        `Question ${questionIndex + 1} / ${QUESTIONS_PER_LEVEL}`;
    $("questionNumber").textContent = `Question ${questionIndex + 1}`;
    $("currentLevelLabel").textContent = `Level ${state.level}`;
    $("questionText").textContent = question.q;
    $("errorText").textContent = "";
    $("nextBtn").textContent = "Answer Submit Karo 💖";
    $("progressBar").style.width =
        `${(questionIndex / QUESTIONS_PER_LEVEL) * 100}%`;

    const optionsContainer = $("options");
    optionsContainer.replaceChildren();

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-btn";
        button.setAttribute("aria-pressed", "false");

        const letter = document.createElement("strong");
        letter.textContent = `${String.fromCharCode(65 + index)}.`;

        const label = document.createElement("span");
        label.textContent = option.text;

        button.append(letter, label);

        button.addEventListener("click", () => {
            if (answerSubmitted) return;

            selectedOption = index;

            optionsContainer.querySelectorAll(".option-btn").forEach((item) => {
                item.classList.remove("selected");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");
            $("errorText").textContent = "";
            playTone(550, 0.06);
        });

        optionsContainer.appendChild(button);
    });

    updateQuizLoveMeter();
}

function submitAnswer() {
    if (answerSubmitted) return;

    if (selectedOption === null) {
        $("errorText").textContent = "Arey pehle apna answer toh select karo! 💗";
        playTone(230, 0.12, "triangle");
        return;
    }

    answerSubmitted = true;

    const question = currentQuestion();
    const option = question.options[selectedOption];

    const record = {
        player: currentPlayer,
        question: question.q,
        answer: option.text,
        correct: Boolean(option.correct)
    };

    answers.push(record);

    if (currentPlayer === "Rishi") {
        rishiAnswers.push(record);
    } else {
        sanjuuAnswers.push(record);
    }

    $("options").querySelectorAll(".option-btn").forEach((button) => {
        button.disabled = true;
    });

    $("errorText").textContent = option.correct
        ? "Waah! Kya pyaara answer diya hai! 💖"
        : "Answer save ho gaya! Chalo ek dusre ko aur jaante hain. 💕";

    if (option.correct) playSuccess();
    else playTone(440, 0.1);

    $("nextBtn").textContent = "Agla Question ➜";
    $("progressBar").style.width =
        `${((questionIndex + 1) / QUESTIONS_PER_LEVEL) * 100}%`;

    updateQuizLoveMeter();
}

function nextQuestion() {
    if (!answerSubmitted) {
        submitAnswer();
        return;
    }

    if (questionIndex >= QUESTIONS_PER_LEVEL - 1) {
        finishLevel();
        return;
    }

    questionIndex++;

    if (questionIndex % 2 === 0) {
        currentPlayer = currentPlayer === "Rishi" ? "Sanjuu" : "Rishi";
        showHandoff();
        return;
    }

    renderQuestion();
}

function showHandoff() {
    $("handoffTitle").textContent = `${currentPlayer}, ab tumhari baari hai! 💗`;
    $("handoffText").textContent =
        `Phone ${currentPlayer} ko de do! Agla question tumhara wait kar raha hai. ❤️`;

    showScreen("handoff");
    speakPassPhone(currentPlayer);
}

function continueAfterHandoff() {
    showScreen("quiz");
    renderQuestion();
    playTone(600, 0.1);
}

/* ---------- LOVE METER ---------- */

function calculateMatch() {
    if (answers.length === 0) return 0;

    const correctCount = answers.filter((item) => item.correct).length;
    return Math.round((correctCount / answers.length) * 100);
}

function updateLoveMeter() {
    const match = calculateMatch();
    const percentage = state.completedLevels.length
        ? Math.max(match, Math.min(100, state.completedLevels.length))
        : match;

    $("loveMeterFill").style.width = `${percentage}%`;
    $("loveMeterText").textContent =
        `${percentage}% game score — pyaar se ek dusre ko aur samjho! 💗`;
}

function updateQuizLoveMeter() {
    const percentage = answers.length === 0 ? 0 : calculateMatch();
    $("quizLoveMeterFill").style.width = `${percentage}%`;
}

/* ---------- STREAK AND LEVEL COMPLETION ---------- */

function updateStreak() {
    const today = new Date().toLocaleDateString("en-CA");
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString("en-CA");

    if (state.lastPlayedDate === today) {
        // Aaj ka streak same rahega.
    } else if (state.lastPlayedDate === yesterday) {
        state.streak++;
    } else {
        state.streak = 1;
    }

    state.lastPlayedDate = today;
}

function finishLevel() {
    const finishedLevel = state.level;

    if (!state.completedLevels.includes(finishedLevel)) {
        state.completedLevels.push(finishedLevel);
    }

    state.history.push({
        level: finishedLevel,
        date: new Date().toISOString(),
        match: calculateMatch(),
        rishiScore: rishiAnswers.filter((item) => item.correct).length,
        sanjuuScore: sanjuuAnswers.filter((item) => item.correct).length
    });

    updateStreak();
    checkUnlocks(finishedLevel);
    saveState();
    renderResult(finishedLevel);
    showScreen("result");
    playSuccess();
}

function renderResult(finishedLevel) {
    const match = calculateMatch();
    const rishiScore = rishiAnswers.filter((item) => item.correct).length;
    const sanjuuScore = sanjuuAnswers.filter((item) => item.correct).length;

    $("matchScore").textContent = `${match}%`;
    $("rishiScore").textContent = rishiScore;
    $("sanjuuScore").textContent = sanjuuScore;

    $("resultTitle").textContent =
        match >= 80 ? "Waah! Kya pyaari bonding hai! 💖" :
        match >= 50 ? "Dheere-dheere aur close aa rahe ho! 💕" :
        "Abhi toh ek dusre ko aur jaan-na baaki hai! 🌷";

    $("resultMessage").textContent =
        `Rishi aur Sanjuu, tum dono ne Level ${finishedLevel} complete kar liya! Har baat ek dusre ko aur achhe se jaan-ne ka mauka hai. ❤️`;

    $("resultLevelText").textContent =
        `Level ${finishedLevel} complete · Total ${state.completedLevels.length} levels complete`;

    const matchList = $("matchList");
    matchList.replaceChildren();

    answers.slice(0, 6).forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "match-item";

        const title = document.createElement("strong");
        title.textContent = `${index + 1}. ${item.player} ka answer`;

        const content = document.createElement("p");
        content.textContent = `${item.question} — ${item.answer}`;

        div.append(title, content);
        matchList.appendChild(div);
    });

    $("levelReward").textContent = getRewardMessage(finishedLevel);

    $("nextLevelBtn").disabled = finishedLevel >= TOTAL_LEVELS;
    $("nextLevelBtn").textContent =
        finishedLevel >= TOTAL_LEVELS
            ? "Saare 100 Levels Complete! 🏆"
            : `Level ${finishedLevel + 1} par chalo ➜`;

    updateWelcome();
}

/* ---------- REWARDS AND BADGES ---------- */

function checkUnlocks(level) {
    const rewardLevels = [1, 3, 5, 10, 20, 30, 50, 75, 100];

    if (rewardLevels.includes(level) && !state.unlockedRewards.includes(level)) {
        state.unlockedRewards.push(level);
    }

    const badgeRules = [
        { level: 1, id: "lovebirds", name: "Lovebirds 💞" },
        { level: 5, id: "explorers", name: "Heart Explorers 🧭" },
        { level: 10, id: "dream-team", name: "Dream Team ✨" },
        { level: 25, id: "strong-bond", name: "Strong Bond 💗" },
        { level: 50, id: "soulmates", name: "Soulmates 💝" },
        { level: 100, id: "legendary", name: "Legendary Couple 👑" }
    ];

    badgeRules.forEach((badge) => {
        if (level >= badge.level && !state.badges.includes(badge.id)) {
            state.badges.push(badge.id);
            showToast(`Naya badge unlock hua: ${badge.name}`);
        }
    });
}

function getRewardMessage(level) {
    const rewards = {
        1: "🎁 Pehla level complete! Tumhari pyaari journey shuru ho gayi.",
        3: "💌 Reward unlock! Partner ko ek sweet message bhejo.",
        5: "🌹 Reward unlock! Saath mein ek chhota surprise plan karo.",
        10: "✨ Reward unlock! Apni favourite memory share karo.",
        20: "💖 Reward unlock! Ek dusre ki dil se tareef karo.",
        30: "🎀 Reward unlock! Ek cute si date plan karo.",
        50: "💝 Aadhe levels complete! Apni journey celebrate karo.",
        75: "👑 Tumhari bonding badh rahi hai. Ek special memory banao.",
        100: "🏆 Saare 100 levels complete! Kya baat hai, Rishi aur Sanjuu!"
    };

    return rewards[level] || "💕 Level complete! Saath mein aur pyaari memories banao.";
}

function renderRewards() {
    const container = $("rewardsList");
    container.replaceChildren();

    const rewards = [
        { level: 1, name: "First Spark", icon: "💗" },
        { level: 5, name: "Love Surprise", icon: "🎁" },
        { level: 10, name: "Sweet Memories", icon: "📸" },
        { level: 20, name: "Love Champion", icon: "🏆" },
        { level: 50, name: "Golden Heart", icon: "💝" },
        { level: 100, name: "Forever Team", icon: "👑" }
    ];

    rewards.forEach((reward) => {
        const unlocked = state.unlockedRewards.includes(reward.level);
        const item = document.createElement("div");
        item.className = `reward-item${unlocked ? " unlocked" : ""}`;

        const icon = document.createElement("span");
        icon.textContent = unlocked ? reward.icon : "🔒";

        const label = document.createElement("span");
        label.textContent = unlocked
            ? reward.name
            : `Level ${reward.level} par unlock hoga`;

        item.append(icon, label);
        container.appendChild(item);
    });
}

function renderBadges() {
    const container = $("badgesList");
    container.replaceChildren();

    const badges = [
        { id: "lovebirds", name: "Lovebirds", icon: "💞" },
        { id: "explorers", name: "Explorers", icon: "🧭" },
        { id: "dream-team", name: "Dream Team", icon: "✨" },
        { id: "strong-bond", name: "Strong Bond", icon: "💗" },
        { id: "soulmates", name: "Soulmates", icon: "💝" },
        { id: "legendary", name: "Legendary", icon: "👑" }
    ];

    badges.forEach((badge) => {
        const unlocked = state.badges.includes(badge.id);
        const item = document.createElement("div");
        item.className = `badge-item${unlocked ? " unlocked" : ""}`;

        const icon = document.createElement("span");
        icon.textContent = unlocked ? badge.icon : "🔒";

        const label = document.createElement("span");
        label.textContent = unlocked ? badge.name : "Abhi locked hai";

        item.append(icon, label);
        container.appendChild(item);
    });
}

/* ---------- MEMORIES BOOK ---------- */

function saveMemory() {
    const input = $("memoryInput");
    const text = input.value.trim();

    if (!text) {
        showToast("Pehle koi pyaari memory toh likho! 💗");
        input.focus();
        return;
    }

    const memory = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text,
        date: new Date().toLocaleDateString()
    };

    state.memories.unshift(memory);
    state.memories = state.memories.slice(0, 100);

    saveState();
    input.value = "";
    renderMemories();
    showToast("Tumhari memory save ho gayi! 📸");
    playSuccess();
}

function renderMemories() {
    const container = $("memoriesList");
    container.replaceChildren();

    if (!state.memories.length) {
        const empty = document.createElement("p");
        empty.className = "small-note";
        empty.textContent = "Tumhari saved memories yahan dikhengi.";
        container.appendChild(empty);
        return;
    }

    state.memories.forEach((memory) => {
        const card = document.createElement("article");
        card.className = "memory-item";

        const text = document.createElement("p");
        text.textContent = memory.text;

        const date = document.createElement("small");
        date.textContent = `📅 ${memory.date || ""}`;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "memory-delete-btn";
        remove.textContent = "Memory delete karo";

        remove.addEventListener("click", () => {
            state.memories = state.memories.filter((item) => item.id !== memory.id);
            saveState();
            renderMemories();
            showToast("Memory delete ho gayi.");
        });

        card.append(text, date, remove);
        container.appendChild(card);
    });
}

/* ---------- SECRET LOVE LETTER ---------- */

function openLetter() {
    $("letterModal").classList.add("open");
    $("letterModal").setAttribute("aria-hidden", "false");
    $("closeLetterBtn").focus();
    playTone(740, 0.15);
}

function closeLetter() {
    $("letterModal").classList.remove("open");
    $("letterModal").setAttribute("aria-hidden", "true");
    $("openLetterBtn").focus();
}

/* ---------- LOVE WHEEL ---------- */

function spinLoveWheel() {
    if (wheelBusy) return;

    wheelBusy = true;

    const resultElement = $("wheelResult");

    const challenges = [
        "💌 Sanjuu ko apni 3 favourite baatein batao.",
        "🎵 Ek aisa gaana share karo jo tum dono ki yaad dilata ho.",
        "📸 Agar dono comfortable ho, toh ek cute photo lo.",
        "🌹 Ek dusre ke liye chhota sa surprise plan karo.",
        "😂 Apni sabse funny shared memory batao.",
        "💗 Ek dusre ki dil se tareef karo.",
        "☕ Bina distraction ke baithkar pyaari baatein karo.",
        "🎬 Saath mein movie ya koi activity choose karo.",
        "📝 Ek dusre ke liye chhota sa love note likho.",
        "🌙 Apne future ka ek sapna ek dusre se share karo."
    ];

    resultElement.classList.add("spinning");
    resultElement.textContent = "Tumhari love wheel spin ho rahi hai... 🎡";

    playTone(420, 0.1);

    window.setTimeout(() => {
        const result = challenges[Math.floor(Math.random() * challenges.length)];

        resultElement.classList.remove("spinning");
        resultElement.textContent = result;

        wheelBusy = false;
        playSuccess();
    }, 1200);
}

/* ---------- MIDNIGHT LOVE MODE ---------- */

function toggleMidnightMode() {
    state.midnightMode = !state.midnightMode;
    document.body.classList.toggle("midnight-mode", state.midnightMode);

    $("midnightModeBtn").textContent = state.midnightMode
        ? "☀️ Midnight Mode Band Karo"
        : "🌙 Midnight Love Mode Chalu Karo";

    saveState();

    showToast(
        state.midnightMode
            ? "Midnight Love Mode chalu ho gaya! 🌙"
            : "Pink love theme wapas aa gayi! 💗"
    );
}

/* ---------- TOAST MESSAGE ---------- */

function showToast(message) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* ---------- EVENTS ---------- */

function bindEvents() {
    $("startBtn").addEventListener("click", startGame);
    $("nextBtn").addEventListener("click", nextQuestion);
    $("continueBtn").addEventListener("click", continueAfterHandoff);
    $("restartBtn").addEventListener("click", startGame);

    $("nextLevelBtn").addEventListener("click", () => {
        if (state.level >= TOTAL_LEVELS) {
            showToast("Rishi aur Sanjuu, tumne saare 100 levels complete kar liye! 🏆");
            return;
        }

        state.level++;
        saveState();
        updateWelcome();
        startGame();
    });

    $("homeBtn").addEventListener("click", () => {
        updateWelcome();
        showScreen("welcome");
    });

    $("soundToggle").addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;

        try {
            localStorage.setItem(SOUND_KEY, String(state.soundEnabled));
        } catch (error) {
            console.warn("Sound setting save nahi hui.");
        }

        updateSoundButton();

        if (state.soundEnabled) playTone(660, 0.12);
    });

    $("openLetterBtn").addEventListener("click", openLetter);
    $("closeLetterBtn").addEventListener("click", closeLetter);
    $("closeLetterBottomBtn").addEventListener("click", closeLetter);

    $("letterModal").addEventListener("click", (event) => {
        if (event.target === $("letterModal")) closeLetter();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && $("letterModal").classList.contains("open")) {
            closeLetter();
        }
    });

    $("spinWheelBtn").addEventListener("click", spinLoveWheel);
    $("saveMemoryBtn").addEventListener("click", saveMemory);
    $("midnightModeBtn").addEventListener("click", toggleMidnightMode);

    $("memoryInput").addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            saveMemory();
        }
    });
}

/* ---------- INITIALIZE ---------- */

function initialize() {
    loadSoundPreference();
    updateSoundButton();

    document.body.classList.toggle("midnight-mode", state.midnightMode);

    $("midnightModeBtn").textContent = state.midnightMode
        ? "☀️ Midnight Mode Band Karo"
        : "🌙 Midnight Love Mode Chalu Karo";

    bindEvents();
    updateWelcome();
    showScreen("welcome");
}

initialize();
