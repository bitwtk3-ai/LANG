import { state } from './state.js';
import { translations } from '../data/translations.js';
import { UI } from './ui.js';
import { QuizEngine } from './logic.js';

class App {
    constructor() {
        this.currentScreen = 'home';
        this.init();
    }

    init() {
        state.load();
        this.updateI18n();
        this.bindEvents();

        // Initial view
        if (!state.user.class) {
            UI.renderClassSelection();
        } else {
            UI.renderHome();
        }

        UI.updateHeader();
    }

    bindEvents() {
        // Nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.getAttribute('data-screen');
                this.navigateTo(screen);
            });
        });

        // Language toggle
        document.getElementById('lang-toggle').addEventListener('click', () => {
            state.user.lang = state.user.lang === 'tr' ? 'en' : 'tr';
            state.save();
            location.reload(); // Simplest way to re-render everything
        });
    }

    selectClass(id) {
        state.user.class = id;
        state.save();
        UI.renderHome();
        UI.updateHeader();
    }

    startQuizConfig(catId) {
        UI.renderQuizConfig(catId);
    }

    startQuiz(catId) {
        const diff = document.querySelector('#diff-selector .bg-primary').getAttribute('data-val');
        const count = document.querySelector('#count-selector .bg-primary').getAttribute('data-val');

        UI.hideModal();
        window.currentQuiz = new QuizEngine(catId, { difficulty: diff, count: count });
    }

    exitQuiz() {
        if (confirm("Are you sure?")) {
            UI.renderHome();
        }
    }

    buyItem(itemId, price) {
        if (state.buyItem(itemId, price)) {
            UI.updateHeader();
            UI.renderShop();
            alert(this.t('buy_success'));
        } else {
            alert(this.t('not_enough_gold'));
        }
    }

    resetData() {
        if (confirm("Reset everything?")) {
            localStorage.removeItem('episode_rpg_state');
            location.reload();
        }
    }

    navigateTo(screen) {
        this.currentScreen = screen;

        // Update nav icons colors
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('data-screen') === screen) {
                btn.classList.add('text-primary');
                btn.classList.remove('text-slate-400');
            } else {
                btn.classList.remove('text-primary');
                btn.classList.add('text-slate-400');
            }
        });

        switch(screen) {
            case 'home': UI.renderHome(); break;
            case 'quests': UI.renderQuests(); break;
            case 'shop': UI.renderShop(); break;
            case 'profile': UI.renderProfile(); break;
        }
    }

    updateI18n() {
        const lang = state.user.lang || 'tr';
        const dict = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });

        document.getElementById('lang-toggle').innerText = lang.toUpperCase();
    }

    t(key) {
        const lang = state.user.lang || 'tr';
        return translations[lang][key] || key;
    }
}

// Global instance for debugging if needed
window.episodeApp = new App();
