export const state = {
    user: {
        level: 1,
        xp: 0,
        gold: 0,
        class: null, // 'scholar', 'merchant', 'specialist'
        inventory: {
            time_freeze: 0,
            extra_life: 0,
            skip: 0
        },
        lang: 'tr',
        quests: [
            { id: 1, title_key: 'quest_first_quiz', target: 1, current: 0, reward: 50, completed: false },
            { id: 2, title_key: 'quest_earn_100_xp', target: 100, current: 0, reward: 100, completed: false }
        ]
    },

    save() {
        localStorage.setItem('episode_rpg_state', JSON.stringify(this.user));
    },

    load() {
        const saved = localStorage.getItem('episode_rpg_state');
        if (saved) {
            this.user = { ...this.user, ...JSON.parse(saved) };
        }
    },

    addXP(amount) {
        if (this.user.class === 'scholar') amount = Math.floor(amount * 1.2);
        this.user.xp += amount;

        let targetXP = this.user.level * 100;
        while (this.user.xp >= targetXP) {
            this.user.xp -= targetXP;
            this.user.level++;
            targetXP = this.user.level * 100;
            // Level up event can be triggered here
        }
        this.save();
    },

    addGold(amount) {
        if (this.user.class === 'merchant') amount = Math.floor(amount * 1.2);
        this.user.gold += amount;
        this.save();
    },

    updateQuest(id, progress) {
        const quest = this.user.quests.find(q => q.id === id);
        if (quest && !quest.completed) {
            quest.current += progress;
            if (quest.current >= quest.target) {
                quest.current = quest.target;
                quest.completed = true;
                this.addGold(quest.reward);
            }
            this.save();
        }
    },

    buyItem(itemId, price) {
        if (this.user.gold >= price) {
            this.user.gold -= price;
            this.user.inventory[itemId]++;
            this.save();
            return true;
        }
        return false;
    }
};

export const shopItems = [
    { id: 'time_freeze', icon: 'fa-snowflake', price: 50, color: 'bg-blue-400' },
    { id: 'extra_life', icon: 'fa-heart', price: 100, color: 'bg-red-400' },
    { id: 'skip', icon: 'fa-forward-step', price: 75, color: 'bg-amber-400' }
];
