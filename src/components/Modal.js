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
                            <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                📖 Instructions
                            </h3>
                            <p id="modal-desc" class="text-slate-600 leading-relaxed mb-4"></p>
                            
                            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <span class="text-xs font-bold text-indigo-800 uppercase block mb-2">Command Words</span>
                                <div id="modal-commands" class="flex flex-wrap gap-2"></div>
                            </div>
                        </div>

                        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col h-full">
                            <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                📝 Reflection Notes
                            </h3>
                            <p class="text-xs text-slate-500 mb-4">Evidence of development (Auto-saved to your device).</p>
                            
                            <textarea id="reflection-input" class="w-full flex-grow p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm leading-relaxed resize-none min-h-[150px]" placeholder="How could you apply this in your next session? What are the potential barriers?"></textarea>
                            
                            <div class="flex justify-between items-center mt-3">
                                <div id="save-status" class="text-xs text-green-600 font-medium opacity-0 transition-opacity">
                                    ✅ Saved
                                </div>
                                <button id="export-btn" class="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition">
                                    📥 Export to PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="w-full">
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Video Demonstration</h3>
                        <div class="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
                            <iframe id="modal-video" class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupListeners();
}

// ... (Keep the openModal, closeModal, loadReflection, and setupListeners functions exactly the same as before)
// ... Just make sure setupListeners includes the new export button listener eventually.

export function openModal(strategy) {
    const modal = document.getElementById('activity-modal');
    const panel = document.getElementById('modal-panel');
    
    document.getElementById('modal-title').textContent = strategy.title;
    document.getElementById('modal-phase').textContent = strategy.phase;
    document.getElementById('modal-desc').textContent = strategy.description || strategy.instructions;
    
    const cmdContainer = document.getElementById('modal-commands');
    cmdContainer.innerHTML = strategy.commands ? strategy.commands.map(cmd => 
        `<span class="text-xs bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200 font-medium">${cmd}</span>`
    ).join('') : '';

    const videoFrame = document.getElementById('modal-video');
    if (strategy.youtube) {
        videoFrame.src = strategy.youtube;
        videoFrame.parentElement.style.display = 'block';
    } else {
        videoFrame.parentElement.style.display = 'none';
    }

    loadReflection(strategy.id);

    // Trap ID for saving
    document.getElementById('reflection-input').dataset.currentId = strategy.id;
    // Trap Title for export
    document.getElementById('export-btn').dataset.currentTitle = strategy.title;

    modal.classList.remove('hidden');
    setTimeout(() => {
        panel.classList.remove('scale-95', 'opacity-0');
        panel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('activity-modal');
    const panel = document.getElementById('modal-panel');
    const videoFrame = document.getElementById('modal-video');

    panel.classList.remove('scale-100', 'opacity-100');
    panel.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        videoFrame.src = ""; 
    }, 300);
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
}

function loadReflection(id) {
    const saved = localStorage.getItem(`reflection_${id}`);
    document.getElementById('reflection-input').value = saved || "";
}
