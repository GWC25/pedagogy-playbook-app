// src/components/Modal.js

export function initModal() {
    const modalHTML = `
    <div id="activity-modal" class="fixed inset-0 z-[100] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" id="modal-backdrop"></div>
        
        <div class="relative flex items-center justify-center min-h-screen p-4">
            <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all scale-95 opacity-0" id="modal-panel">
                
                <div class="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                    <div>
                        <span id="modal-phase" class="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-1 block">Phase</span>
                        <h2 id="modal-title" class="text-2xl font-bold text-slate-900">Activity Title</h2>
                    </div>
                    <button id="close-modal" class="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div class="overflow-y-auto p-6 space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div>
                            <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">📖 Instructions</h3>
                            <p id="modal-desc" class="text-slate-600 leading-relaxed mb-4"></p>
                            
                            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                                <span class="text-xs font-bold text-indigo-800 uppercase block mb-2">Command Words</span>
                                <div id="modal-commands" class="flex flex-wrap gap-2"></div>
                            </div>

                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Video Examples</h3>
                            <a id="video-search-btn" href="#" target="_blank" class="group flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all duration-300">
                                <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                </div>
                                <div>
                                    <span class="block text-slate-900 font-bold group-hover:text-red-700">Find examples on YouTube</span>
                                    <span class="text-xs text-slate-500 group-hover:text-red-600/80">Search: "<span id="search-query-text"></span>"</span>
                                </div>
                                <div class="ml-auto text-slate-300 group-hover:text-red-500">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </div>
                            </a>
                        </div>

                        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col h-full">
                            <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">📝 Reflection Notes</h3>
                            <p class="text-xs text-slate-500 mb-4">Evidence of development (Auto-saved).</p>
                            <textarea id="reflection-input" class="w-full flex-grow p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm leading-relaxed resize-none min-h-[150px]" placeholder="How could you apply this in your next session?"></textarea>
                            <div class="flex justify-between items-center mt-3">
                                <div id="save-status" class="text-xs text-green-600 font-medium opacity-0 transition-opacity">✅ Saved</div>
                                <button id="export-btn" class="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition bg-white border border-slate-200 px-3 py-2 rounded-lg hover:shadow-sm hover:border-indigo-200">📥 Export PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupListeners();
}

export function openModal(strategy) {
    const modal = document.getElementById('activity-modal');
    const panel = document.getElementById('modal-panel');
    
    document.getElementById('modal-title').textContent = strategy.title;
    document.getElementById('modal-phase').textContent = strategy.phase;
    document.getElementById('modal-desc').textContent = strategy.description || strategy.instructions;
    
    // Commands
    document.getElementById('modal-commands').innerHTML = strategy.commands ? strategy.commands.map(cmd => 
        `<span class="text-xs bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200 font-medium">${cmd}</span>`
    ).join('') : '';

    // Smart Search Logic
    const searchBtn = document.getElementById('video-search-btn');
    const querySpan = document.getElementById('search-query-text');
    
    // Create the search URL
    const query = strategy.searchQuery || `${strategy.title} pedagogy classroom example`;
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    
    searchBtn.href = url;
    querySpan.textContent = query;

    loadReflection(strategy.id);
    document.getElementById('reflection-input').dataset.currentId = strategy.id;
    document.getElementById('export-btn').dataset.currentTitle = strategy.title;

    modal.classList.remove('hidden');
    setTimeout(() => {
        panel.classList.remove('scale-95', 'opacity-0');
        panel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// ... (keep closemodal and setuplisteners the same as the previous file)
function closeModal() {
    const modal = document.getElementById('activity-modal');
    const panel = document.getElementById('modal-panel');
    panel.classList.remove('scale-100', 'opacity-100');
    panel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function setupListeners() {
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    
    const textarea = document.getElementById('reflection-input');
    textarea.addEventListener('input', (e) => {
        const id = e.target.dataset.currentId;
        if (!id) return;
        localStorage.setItem(`reflection_${id}`, e.target.value);
        const status = document.getElementById('save-status');
        status.classList.remove('opacity-0');
        setTimeout(() => status.classList.add('opacity-0'), 2000);
    });

    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) { alert("PDF Library not loaded."); return; }
        const doc = new jsPDF();
        const title = exportBtn.dataset.currentTitle;
        const notes = textarea.value;
        const date = new Date().toLocaleDateString();
        
        doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.text("Pedagogy Reflection Log", 20, 20);
        doc.setFontSize(12); doc.setTextColor(100); doc.text(`Date: ${date}`, 20, 30);
        doc.setDrawColor(200); doc.line(20, 35, 190, 35);
        doc.setFont("helvetica", "bold"); doc.setTextColor(0); doc.setFontSize(16); doc.text(`Activity: ${title}`, 20, 50);
        doc.setFont("helvetica", "normal"); doc.setFontSize(12);
        
        const splitNotes = doc.splitTextToSize(notes || "(No notes)", 170);
        doc.text(splitNotes, 20, 65);
        doc.save(`Reflection - ${title}.pdf`);
    });
}
function loadReflection(id) {
    const saved = localStorage.getItem(`reflection_${id}`);
    document.getElementById('reflection-input').value = saved || "";
}
