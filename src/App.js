// src/App.js

import { initModal, openModal } from './components/Modal.js';

const cardGrid = document.getElementById('card-grid');
const searchBar = document.getElementById('search-bar');
const phaseFilter = document.getElementById('phase-filter');
const favBtn = document.getElementById('view-favorites');
const refBtn = document.getElementById('view-reflections');

let strategies = [];
let favorites = JSON.parse(localStorage.getItem('pedagogy_favorites')) || [];
let currentView = 'all'; // 'all' or 'favorites'

// Initialize Modal
initModal();

// 1. LOAD DATA
async function loadStrategies() {
    try {
        const response = await fetch('./public/data/strategies.json');
        if (!response.ok) throw new Error("Path not found");
        strategies = await response.json();
        renderCards(strategies);
    } catch (error) {
        console.warn("Trying fallback path...");
        const response = await fetch('./data/strategies.json');
        strategies = await response.json();
        renderCards(strategies);
    }
}

// 2. RENDER CARDS
function renderCards(data) {
    cardGrid.innerHTML = '';

    if (data.length === 0) {
        cardGrid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-slate-400 text-lg mb-2">No strategies found.</p>
                ${currentView === 'favorites' ? '<button id="clear-filter-btn" class="text-indigo-600 font-bold hover:underline">View all strategies</button>' : ''}
            </div>`;
        
        // Allow user to reset view if stuck in empty favorites
        const resetBtn = document.getElementById('clear-filter-btn');
        if(resetBtn) resetBtn.addEventListener('click', () => {
            currentView = 'all';
            filterStrategies();
        });
        return;
    }

    cardGrid.innerHTML = data.map(item => {
        const isFav = favorites.includes(item.id);
        return `
        <div class="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">${item.phase}</span>
                    <button data-fav-id="${item.id}" class="fav-btn text-2xl transition hover:scale-110 ${isFav ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}" aria-label="Toggle favorite">
                        ★
                    </button>
                </div>
                <h3 class="text-xl font-extrabold mb-2 group-hover:text-indigo-600 transition">${item.title}</h3>
                <p class="text-slate-600 text-sm mb-4 line-clamp-2">${item.description || item.instructions}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${item.commands ? item.commands.map(cmd => 
                        `<span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">#${cmd}</span>`
                    ).join('') : ''}
                </div>
            </div>
            <button data-id="${item.id}" class="view-btn w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors focus:ring-4 focus:ring-indigo-300">
                View Strategy
            </button>
        </div>
    `}).join('');

    attachListeners();
}

// 3. ATTACH LISTENERS (Clicks & Favorites)
function attachListeners() {
    // View Buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const strategy = strategies.find(s => s.id === id);
            if (strategy) openModal(strategy);
        });
    });

    // Favorite Buttons
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-fav-id');
            toggleFavorite(id);
        });
    });
}

// 4. FAVORITE LOGIC
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('pedagogy_favorites', JSON.stringify(favorites));
    
    // Re-render to show updated star state (or remove from view if in favorites mode)
    filterStrategies(); 
}

// 5. FILTER LOGIC
function filterStrategies() {
    const term = searchBar.value.toLowerCase();
    const phase = phaseFilter.value;

    let filtered = strategies.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(term) || 
                              (s.commands && s.commands.some(c => c.toLowerCase().includes(term)));
        const matchesPhase = phase === 'all' || s.phase === phase;
        return matchesSearch && matchesPhase;
    });

    // Apply Favorites Filter if active
    if (currentView === 'favorites') {
        filtered = filtered.filter(s => favorites.includes(s.id));
        // Update UI to show we are in Favorites mode
        favBtn.classList.add('text-indigo-600', 'font-bold');
        favBtn.innerHTML = "⭐ Favorites (Active)";
    } else {
        favBtn.classList.remove('text-indigo-600', 'font-bold');
        favBtn.innerHTML = "⭐ Favorites";
    }

    renderCards(filtered);
}

// 6. GLOBAL EVENT LISTENERS
searchBar.addEventListener('input', filterStrategies);
phaseFilter.addEventListener('change', filterStrategies);

favBtn.addEventListener('click', () => {
    currentView = currentView === 'favorites' ? 'all' : 'favorites';
    filterStrategies();
});

// Start
loadStrategies();
