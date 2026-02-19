import { state } from './state.js';
import { categories } from '../data/questions.js';
import { UI } from './ui.js';
import { translations } from '../data/translations.js';

export class QuizEngine {
    constructor(catId, config) {
        this.category = categories.find(c => c.id === catId);
        this.config = config; // { difficulty, count }
        this.index = 0;
        this.correct = 0;
        this.mistakes = [];
        this.lives = state.user.class === 'specialist' ? 4 : 3;
        this.timer = null;
        this.timeLeft = this.getInitialTime();
        this.questions = this.prepareQuestions();

        this.init();
    }

    getInitialTime() {
        if (this.config.difficulty === 'hard') return 10;
        if (this.config.difficulty === 'medium') return 15;
        return 20;
    }

    prepareQuestions() {
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        let qList = this.category.questions.map(q => ({
            ...q,
            options: shuffle(q.options)
        }));

        qList = shuffle(qList);

        const count = this.config.count === 'unlimited' ? 100 : parseInt(this.config.count);
        return qList.slice(0, count);
    }

    init() {
        this.renderScreen();
        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = this.getInitialTime();
        this.updateTimerUI();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            if (this.timeLeft <= 0) {
                this.handleAnswer(null); // Timeout is a wrong answer
            }
        }, 1000);
    }

    updateTimerUI() {
        const el = document.getElementById('quiz-timer');
        if (el) {
            el.innerText = this.timeLeft;
            const bar = document.getElementById('timer-bar');
            if (bar) {
                const percent = (this.timeLeft / this.getInitialTime()) * 100;
                bar.style.width = `${percent}%`;
                if (this.timeLeft <= 3) bar.classList.add('bg-danger');
                else bar.classList.remove('bg-danger');
            }
        }
    }

    renderScreen() {
        const dict = translations[state.user.lang];
        const q = this.questions[this.index];
        const total = this.config.count === 'unlimited' ? '∞' : this.questions.length;

        UI.container.innerHTML = `
            <div class="px-6 py-8 flex flex-col h-full animate-fadeIn max-w-2xl mx-auto">
                <div class="flex justify-between items-center mb-8">
                    <button onclick="window.episodeApp.exitQuiz()" class="text-slate-400 font-bold text-sm">
                        <i class="fas fa-times mr-1"></i> ${dict.exit_quiz}
                    </button>
                    <div class="flex gap-2">
                        ${Array(this.lives).fill(0).map(() => `<i class="fas fa-heart text-danger"></i>`).join('')}
                    </div>
                </div>

                <!-- Timer Bar -->
                <div class="w-full h-1.5 bg-slate-100 rounded-full mb-10 overflow-hidden">
                    <div id="timer-bar" class="h-full bg-primary transition-all duration-1000 linear"></div>
                </div>

                <div class="text-center mb-10">
                    <span class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">
                        ${dict.question} ${this.index + 1} / ${total}
                    </span>
                    <h2 class="text-4xl font-black text-slate-800 leading-tight">${q.q}</h2>
                </div>

                <div class="grid grid-cols-1 gap-3 mb-10">
                    ${q.options.map(opt => `
                        <button onclick="window.currentQuiz.handleAnswer('${opt}')" class="quiz-ans-btn group p-5 rounded-3xl bg-white border-2 border-slate-100 hover:border-primary transition-all text-left flex justify-between items-center">
                            <span class="font-bold text-slate-700">${opt}</span>
                            <div class="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-primary"></div>
                        </button>
                    `).join('')}
                </div>

                <!-- Powerups -->
                <div class="mt-auto grid grid-cols-3 gap-3">
                    <button onclick="window.currentQuiz.usePowerup('time_freeze')" class="p-4 rounded-2xl bg-blue-50 text-blue-600 flex flex-col items-center gap-1 border border-blue-100 disabled:opacity-30" ${state.user.inventory.time_freeze <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-snowflake"></i>
                        <span class="text-[10px] font-bold">${state.user.inventory.time_freeze}</span>
                    </button>
                    <button onclick="window.currentQuiz.usePowerup('skip')" class="p-4 rounded-2xl bg-amber-50 text-amber-600 flex flex-col items-center gap-1 border border-amber-100 disabled:opacity-30" ${state.user.inventory.skip <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-forward-step"></i>
                        <span class="text-[10px] font-bold">${state.user.inventory.skip}</span>
                    </button>
                    <button class="p-4 rounded-2xl bg-slate-50 text-slate-300 flex flex-col items-center gap-1 border border-slate-100" disabled>
                        <i class="fas fa-circle-half-stroke"></i>
                        <span class="text-[10px] font-bold">0</span>
                    </button>
                </div>
            </div>
        `;
    }

    handleAnswer(answer) {
        clearInterval(this.timer);
        const q = this.questions[this.index];
        const isCorrect = answer === q.a;

        // Visual Feedback
        const buttons = document.querySelectorAll('.quiz-ans-btn');
        buttons.forEach(btn => {
            const btnText = btn.querySelector('span').innerText;
            if (btnText === q.a) {
                btn.classList.add('correct');
            } else if (btnText === answer && !isCorrect) {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        });

        setTimeout(() => {
            if (isCorrect) {
                this.correct++;
            } else {
                this.lives--;
                this.mistakes.push({ q: q.q, correct: q.a, user: answer || 'TIMEOUT' });
                if (this.lives <= 0) {
                    this.finish();
                    return;
                }
            }

            this.index++;
            if (this.index >= this.questions.length) {
                this.finish();
            } else {
                this.renderScreen();
                this.startTimer();
            }
        }, 800);
    }

    usePowerup(id) {
        if (state.user.inventory[id] > 0) {
            state.user.inventory[id]--;
            state.save();

            if (id === 'time_freeze') {
                clearInterval(this.timer);
                alert("Time Frozen!");
            } else if (id === 'skip') {
                this.index++;
                if (this.index >= this.questions.length) this.finish();
                else {
                    this.renderScreen();
                    this.startTimer();
                }
            }
            this.renderScreen();
        }
    }

    finish() {
        clearInterval(this.timer);

        // Calculate Rewards
        let xpGain = this.correct * 10;
        let goldGain = this.correct * 5;

        if (this.config.difficulty === 'medium') { xpGain *= 1.5; goldGain *= 1.5; }
        if (this.config.difficulty === 'hard') { xpGain *= 2; goldGain *= 2; }

        state.addXP(Math.floor(xpGain));
        state.addGold(Math.floor(goldGain));

        // Update Quests
        state.updateQuest(1, 1); // First quiz quest
        state.updateQuest(2, Math.floor(xpGain)); // XP quest

        this.renderResults(Math.floor(xpGain), Math.floor(goldGain));
    }

    renderResults(xp, gold) {
        const dict = translations[state.user.lang];
        UI.container.innerHTML = `
            <div class="px-6 py-12 flex flex-col items-center animate-fadeIn">
                <div class="w-24 h-24 rounded-4xl bg-success text-white flex items-center justify-center text-4xl shadow-xl shadow-emerald-100 mb-6">
                    <i class="fas fa-trophy"></i>
                </div>
                <h2 class="text-3xl font-black text-slate-800 mb-2">${dict.results}</h2>
                <p class="text-slate-500 mb-10">${this.correct} / ${this.questions.length} ${dict.correct}</p>

                <div class="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm">
                        <span class="block text-[10px] font-bold text-slate-400 uppercase mb-1">+XP</span>
                        <span class="text-2xl font-black text-primary">${xp}</span>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm">
                        <span class="block text-[10px] font-bold text-slate-400 uppercase mb-1">+Gold</span>
                        <span class="text-2xl font-black text-warning">${gold}</span>
                    </div>
                </div>

                ${this.mistakes.length > 0 ? `
                    <div class="w-full max-w-sm mb-10">
                        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Mistakes</h4>
                        <div class="space-y-2">
                            ${this.mistakes.slice(0, 3).map(m => `
                                <div class="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
                                    <span class="font-bold text-red-800 text-sm">${m.q}</span>
                                    <span class="text-xs font-bold text-red-500">➜ ${m.correct}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <button onclick="window.episodeApp.navigateTo('home')" class="w-full max-w-sm py-5 rounded-3xl bg-slate-900 text-white font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    ${dict.continue}
                </button>
            </div>
        `;
        UI.updateHeader();
    }
}
