// src/app.js
const cardGrid = document.getElementById('card-grid');
const searchBar = document.getElementById('search-bar');
const phaseFilter = document.getElementById('phase-filter');

let strategies = [];

// Fetch Data (ISO-safe, local path)
async function loadStrategies() {
    const response = await fetch('./data/strategies.json');
    strategies = await response.json();
    renderCards(strategies);
}

function renderCards(data) {
    cardGrid.innerHTML = data.map(item => `
        <div class="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">${item.phase}</span>
                    <button class="text-slate-300 hover:text-yellow-400 transition">⭐</button>
                </div>
                <h3 class="text-xl font-extrabold mb-2 group-hover:text-indigo-600 transition">${item.title}</h3>
                <p class="text-slate-600 text-sm mb-4 line-clamp-2">${item.description}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${item.commands.map(cmd => `<span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">#${cmd}</span>`).join('')}
                </div>
            </div>
            <button onclick="openActivity('${item.id}')" class="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors">
                View Strategy
            </button>
        </div>
    `).join('');
}

// Filtering Logic
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = strategies.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.commands.some(c => c.toLowerCase().includes(term))
    );
    renderCards(filtered);
});

loadStrategies();
