// src/App.js

// 1. IMPORT THE NEW MODAL SYSTEM
import { initModal, openModal } from './components/Modal.js';

const cardGrid = document.getElementById('card-grid');
const searchBar = document.getElementById('search-bar');
const phaseFilter = document.getElementById('phase-filter');

let strategies = [];

// 2. INITIALIZE THE MODAL HTML (Injects it into the page immediately)
initModal();

// 3. LOAD DATA
// Tries multiple paths to ensure it works on both GitHub Pages and Localhost
async function loadStrategies() {
    try {
        // Primary path (Standard for many build tools)
        const response = await fetch('./public/data/strategies.json');
        if (!response.ok) throw new Error("Path not found");
        strategies = await response.json();
        renderCards(strategies);
    } catch (error) {
        console.warn("Trying fallback path for data...");
        // Fallback path (Often needed for raw GitHub Pages)
        const response = await fetch('./data/strategies.json');
        strategies = await response.json();
        renderCards(strategies);
    }
}

// 4. RENDER CARDS
function renderCards(data) {
    if (data.length === 0) {
        cardGrid.innerHTML = `<p class="text-slate-500 col-span-full text-center py-10">No activities found matching your criteria.</p>`;
        return;
    }

    cardGrid.innerHTML = data.map(item => `
        <div class="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">${item.phase}</span>
                    <button class="text-slate-300 hover:text-yellow-400 transition" aria-label="Add to favorites">⭐</button>
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
    `).join('');

    // Attach event listeners to the new buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            openActivity(id);
        });
    });
}

// 5. FILTER LOGIC
function filterStrategies() {
    const term = searchBar.value.toLowerCase();
    const phase = phaseFilter.value;

    const filtered = strategies.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(term) || 
                              (s.commands && s.commands.some(c => c.toLowerCase().includes(term)));
        const matchesPhase = phase === 'all' || s.phase === phase;
        
        return matchesSearch && matchesPhase;
    });

    renderCards(filtered);
}

// 6. OPEN ACTIVITY (The Connector)
// This function finds the data for the clicked card and sends it to the Modal component
window.openActivity = (id) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
        // Call the imported function from Modal.js
        openModal(strategy);
    } else {
        console.error("Strategy not found:", id);
    }
};

// 7. EVENT LISTENERS
searchBar.addEventListener('input', filterStrategies);
phaseFilter.addEventListener('change', filterStrategies);

// Start the app
loadStrategies();
