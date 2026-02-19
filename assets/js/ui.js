import { state } from './state.js';
import { translations } from '../data/translations.js';
import { categories } from '../data/questions.js';

export const UI = {
    container: document.getElementById('app-container'),
    modal: document.getElementById('modal-overlay'),
    modalContent: document.getElementById('modal-content'),

    updateHeader() {
        document.getElementById('header-gold').innerText = state.user.gold;
        document.getElementById('header-level').innerText = state.user.level;

        const targetXP = state.user.level * 100;
        const progress = (state.user.xp / targetXP) * 100;
        document.getElementById('header-xp-bar').style.width = `${progress}%`;
    },

    renderHome() {
        const lang = state.user.lang;
        const dict = translations[lang];

        let html = `
            <div class="px-6 py-8 animate-fadeIn">
                <h1 class="text-3xl font-extrabold text-slate-800 mb-2">${dict.welcome_back}, ${this.getClassName()}!</h1>
                <p class="text-slate-500 mb-8">${dict.choose_category}</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        `;

        categories.forEach(cat => {
            html += `
                <div class="quiz-card card-perspective cursor-pointer" onclick="window.episodeApp.startQuizConfig('${cat.id}')">
                    <div class="card-inner relative h-48 rounded-4xl bg-gradient-to-br ${cat.color} p-8 text-white shadow-xl hover:scale-[1.02] transition-transform overflow-hidden group">
                        <i class="fas ${cat.icon} absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform"></i>
                        <h3 class="text-2xl font-black mb-2">${dict[cat.name_key]}</h3>
                        <p class="text-sm opacity-80">${cat.questions.length} Questions</p>
                        <div class="mt-auto">
                            <span class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                                ${dict.start_quiz} <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        this.container.innerHTML = html;
    },

    renderClassSelection() {
        const lang = state.user.lang;
        const dict = translations[lang];

        this.container.innerHTML = `
            <div class="px-6 py-12 flex flex-col items-center justify-center min-h-full animate-fadeIn">
                <h2 class="text-3xl font-black text-slate-800 mb-4 text-center">${dict.class_selection}</h2>
                <div class="grid grid-cols-1 gap-4 w-full max-w-sm">
                    ${this.createClassBtn('scholar', 'fa-book-open', 'bg-blue-500', dict.scholar_desc, dict.class_scholar)}
                    ${this.createClassBtn('merchant', 'fa-coins', 'bg-amber-500', dict.merchant_desc, dict.class_merchant)}
                    ${this.createClassBtn('specialist', 'fa-shield-heart', 'bg-emerald-500', dict.specialist_desc, dict.class_specialist)}
                </div>
            </div>
        `;
    },

    createClassBtn(id, icon, color, desc, name) {
        return `
            <button onclick="window.episodeApp.selectClass('${id}')" class="flex items-center gap-4 p-5 rounded-3xl bg-white border-2 border-slate-100 hover:border-primary transition-all text-left group shadow-sm">
                <div class="w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <i class="fas ${icon}"></i>
                </div>
                <div>
                    <h4 class="font-extrabold text-slate-800">${name}</h4>
                    <p class="text-xs text-slate-500 mt-1">${desc}</p>
                </div>
            </button>
        `;
    },

    getClassName() {
        const dict = translations[state.user.lang];
        const classes = {
            scholar: dict.class_scholar,
            merchant: dict.class_merchant,
            specialist: dict.class_specialist
        };
        return classes[state.user.class] || '';
    },

    showModal(content) {
        this.modalContent.innerHTML = content;
        this.modal.classList.remove('hidden');
        setTimeout(() => {
            this.modalContent.classList.remove('scale-95', 'opacity-0');
            this.modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    },

    hideModal() {
        this.modalContent.classList.remove('scale-100', 'opacity-100');
        this.modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            this.modal.classList.add('hidden');
        }, 300);
    },

    renderQuizConfig(catId) {
        const dict = translations[state.user.lang];
        const cat = categories.find(c => c.id === catId);

        let html = `
            <div class="p-8">
                <div class="flex items-center gap-4 mb-8">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800">${dict[cat.name_key]}</h3>
                </div>

                <div class="space-y-6">
                    <div>
                        <label class="block text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">${dict.difficulty}</label>
                        <div class="grid grid-cols-3 gap-2" id="diff-selector">
                            ${['easy', 'medium', 'hard'].map(d => `
                                <button onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('bg-primary','text-white')); this.classList.add('bg-primary','text-white')"
                                        data-val="${d}" class="py-3 rounded-2xl border border-slate-100 font-bold text-sm transition-all ${d==='easy'?'bg-primary text-white':''}">
                                    ${dict[d]}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">${dict.question_count}</label>
                        <div class="grid grid-cols-4 gap-2" id="count-selector">
                            ${[10, 20, 50, 'unlimited'].map(c => `
                                <button onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('bg-primary','text-white')); this.classList.add('bg-primary','text-white')"
                                        data-val="${c}" class="py-3 rounded-2xl border border-slate-100 font-bold text-sm transition-all ${c===10?'bg-primary text-white':''}">
                                    ${c === 'unlimited' ? '∞' : c}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mt-10">
                    <button onclick="UI.hideModal()" class="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">${dict.cancel}</button>
                    <button onclick="window.episodeApp.startQuiz('${catId}')" class="flex-[2] py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all">
                        ${dict.start_quiz}
                    </button>
                </div>
            </div>
        `;
        this.showModal(html);
    },

    renderQuests() {
        const dict = translations[state.user.lang];
        let html = `
            <div class="px-6 py-8 animate-fadeIn">
                <h2 class="text-3xl font-black text-slate-800 mb-6">${dict.nav_quests}</h2>
                <div class="space-y-4">
        `;

        state.user.quests.forEach(q => {
            const progress = (q.current / q.target) * 100;
            html += `
                <div class="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm ${q.completed ? 'opacity-60' : ''}">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-bold text-slate-800">${dict[q.title_key]}</h4>
                            <p class="text-xs text-slate-500">${q.current} / ${q.target}</p>
                        </div>
                        <div class="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                            <i class="fas fa-coins text-[10px]"></i> ${q.reward}
                        </div>
                    </div>
                    <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-success transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        this.container.innerHTML = html;
    },

    renderShop() {
        const dict = translations[state.user.lang];
        import('./state.js').then(({ shopItems }) => {
            let html = `
                <div class="px-6 py-8 animate-fadeIn">
                    <h2 class="text-3xl font-black text-slate-800 mb-6">${dict.shop_title}</h2>
                    <div class="grid grid-cols-1 gap-4">
            `;

            shopItems.forEach(item => {
                html += `
                    <div class="bg-white rounded-4xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group">
                        <div class="flex items-center gap-5">
                            <div class="w-16 h-16 rounded-3xl ${item.color} flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-100">
                                <i class="fas ${item.icon}"></i>
                            </div>
                            <div>
                                <h4 class="font-black text-slate-800">${dict['item_' + item.id]}</h4>
                                <p class="text-xs text-slate-500">${dict.owned}: ${state.user.inventory[item.id]}</p>
                            </div>
                        </div>
                        <button onclick="window.episodeApp.buyItem('${item.id}', ${item.price})" class="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <i class="fas fa-coins text-amber-400 text-xs"></i> ${item.price}
                        </button>
                    </div>
                `;
            });

            html += `</div></div>`;
            this.container.innerHTML = html;
        });
    },

    renderProfile() {
        const dict = translations[state.user.lang];
        this.container.innerHTML = `
            <div class="px-6 py-8 animate-fadeIn">
                <h2 class="text-3xl font-black text-slate-800 mb-6">${dict.nav_profile}</h2>
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-4xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
                    <i class="fas fa-shield-halved absolute -right-10 -bottom-10 text-[12rem] opacity-10"></i>
                    <div class="relative z-10">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h3 class="text-2xl font-black uppercase tracking-tight">${this.getClassName()}</h3>
                                <p class="text-sm opacity-60">Level ${state.user.level} Player</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                                <span class="block text-[10px] uppercase font-bold opacity-50 mb-1">${dict.total_xp}</span>
                                <span class="text-xl font-black">${state.user.xp} <span class="text-xs opacity-50">/ ${state.user.level * 100}</span></span>
                            </div>
                            <div class="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                                <span class="block text-[10px] uppercase font-bold opacity-50 mb-1">${dict.total_gold}</span>
                                <span class="text-xl font-black text-amber-400"><i class="fas fa-coins mr-1 text-sm"></i> ${state.user.gold}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 class="font-black text-slate-800 mb-4 px-2 uppercase tracking-widest text-xs opacity-50">Inventory</h3>
                <div class="grid grid-cols-3 gap-3 mb-10">
                    ${this.createInvItem('time_freeze', 'fa-snowflake', 'bg-blue-100 text-blue-600')}
                    ${this.createInvItem('extra_life', 'fa-heart', 'bg-red-100 text-red-600')}
                    ${this.createInvItem('skip', 'fa-forward-step', 'bg-amber-100 text-amber-600')}
                </div>

                <button onclick="window.episodeApp.resetData()" class="w-full py-4 rounded-3xl text-danger font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors">
                    <i class="fas fa-trash-can mr-2"></i> Reset Data
                </button>
            </div>
        `;
    },

    createInvItem(id, icon, colors) {
        return `
            <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-2xl ${colors} flex items-center justify-center text-lg">
                    <i class="fas ${icon}"></i>
                </div>
                <span class="text-sm font-black">${state.user.inventory[id]}</span>
            </div>
        `;
    }
};
