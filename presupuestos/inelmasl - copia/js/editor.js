// js/editor.js
// Funcionalidades de Edición Dinámica (Local-First)

window.isEditMode = false;
window.historyStack = [];

window.toggleEditMode = function() {
    window.isEditMode = !window.isEditMode;
    const btn = document.getElementById('btn-toggle-edit');
    const undoBtn = document.getElementById('btn-undo');
    const saveBtn = document.getElementById('btn-save-budget');
    
    if (window.isEditMode) {
        btn.innerHTML = '❌ Salir Modo Edición';
        btn.classList.add('bg-red-50', 'text-red-700', 'border-red-500');
        btn.classList.remove('btn-luxury');
        undoBtn.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';
        
        // Notification
        const notif = document.createElement('div');
        notif.id = 'edit-notif';
        notif.className = 'fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 shadow-lg z-50 rounded';
        notif.innerHTML = '<strong>Modo Edición Activado</strong><br>Haga clic en los iconos junto a las partidas en la vista "Desglose de Costes" para editarlas.';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 5000);
    } else {
        btn.innerHTML = '✏️ Activar Modo Edición';
        btn.classList.remove('bg-red-50', 'text-red-700', 'border-red-500');
        btn.classList.add('btn-luxury');
        undoBtn.style.display = 'none';
        saveBtn.style.display = 'none';
    }
    
    // Re-render the current view to show/hide edit controls
    if (typeof renderCurrentView === 'function') {
        renderCurrentView();
    }
}

window.pushHistory = function() {
    if (!window.budgetData) return;
    // Deep copy state
    const snapshot = JSON.stringify(window.budgetData);
    window.historyStack.push(snapshot);
    
    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) {
        undoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        undoBtn.disabled = false;
    }
    
    const saveBtn = document.getElementById('btn-save-budget');
    if (saveBtn) {
        saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        saveBtn.disabled = false;
    }
}

window.undoEdit = function() {
    if (window.historyStack.length === 0) return;
    
    const lastState = window.historyStack.pop();
    window.budgetData = JSON.parse(lastState);
    
    // Sincronizar las variables globales de script.js con el estado deshecho
    dataCoste = window.budgetData.dataCoste || [];
    dataMaterial = window.budgetData.dataMaterial || [];
    capitulos = window.budgetData.capitulos || {};
    
    if (window.historyStack.length === 0) {
        const undoBtn = document.getElementById('btn-undo');
        if (undoBtn) {
            undoBtn.classList.add('opacity-50', 'cursor-not-allowed');
            undoBtn.disabled = true;
        }
    }
    
    if (typeof renderCurrentView === 'function') {
        renderCurrentView();
    }
}

window.saveBudget = async function() {
    if (!window.budgetData || !currentBudgetId) return;
    
    const saveBtn = document.getElementById('btn-save-budget');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '⏳ Guardando...';
    saveBtn.disabled = true;
    
    // Ensure global settings are updated in budgetData before saving
    if (!window.budgetData.config) window.budgetData.config = {};
    
    // Update config using the global variables from script.js
    if (typeof ggPercent !== 'undefined') window.budgetData.config.GG = ggPercent / 100;
    if (typeof beneficioIndustrialPercent !== 'undefined') window.budgetData.config.BI = beneficioIndustrialPercent / 100;
    if (typeof mermasPercent !== 'undefined') window.budgetData.config.mermas = mermasPercent;
    if (typeof volatilidadPercent !== 'undefined') window.budgetData.config.volatilidad = volatilidadPercent;
    
    // Remove "eliminado" items from the JSON before saving permanently
    if (window.budgetData.dataCoste) {
        window.budgetData.dataCoste = window.budgetData.dataCoste.filter(item => !item.eliminado);
    }

    try {
        const response = await fetch('save_budget.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                budgetId: currentBudgetId,
                budgetData: window.budgetData
            })
        });
        
        const resData = await response.json();
        if (resData.success) {
            alert('✅ Presupuesto guardado y backup creado exitosamente.');
            saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
            // Clean up deleted items from global arrays since they are now saved
            dataCoste = window.budgetData.dataCoste;
            if (typeof renderCurrentView === 'function') renderCurrentView();
        } else {
            alert('❌ Error al guardar: ' + resData.message);
            saveBtn.disabled = false;
        }
    } catch (error) {
        console.error(error);
        alert('❌ Error de conexión al guardar.');
        saveBtn.disabled = false;
    } finally {
        saveBtn.innerHTML = originalText;
    }
}

// ---- ACCIONES DE EDICIÓN DE PARTIDAS ----

window.toggleItemVisibility = function(capId, itemId, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const idx = dataCoste.findIndex(i => i.cap === capId && i.id === itemId);
    if (idx !== -1) {
        window.pushHistory();
        dataCoste[idx].oculto = !dataCoste[idx].oculto;
        if (typeof renderCurrentView === 'function') renderCurrentView();
    }
}

window.deleteItem = function(capId, itemId, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    if (confirm('⚠️ ATENCIÓN: ¿Estás seguro de que quieres ELIMINAR esta partida? Se restará su importe del presupuesto.')) {
        const idx = dataCoste.findIndex(i => i.cap === capId && i.id === itemId);
        if (idx !== -1) {
            window.pushHistory();
            dataCoste[idx].eliminado = true;
            if (typeof renderCurrentView === 'function') renderCurrentView();
        }
    }
}

window.showCustomPrompt = function(title, message, defaultValue, placeholder = '') {
    return new Promise((resolve) => {
        // Remove existing if any
        const existing = document.getElementById('custom-prompt-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'custom-prompt-overlay';
        overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] opacity-0 transition-opacity duration-200';
        
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform scale-95 transition-transform duration-200';
        
        modal.innerHTML = `
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-900">${title}</h3>
                <p class="text-sm text-gray-500 mt-2">${message}</p>
            </div>
            <div class="mb-6">
                <input type="text" id="custom-prompt-input" value="${defaultValue}" placeholder="${placeholder}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 font-medium text-lg">
            </div>
            <div class="flex justify-end gap-3">
                <button id="custom-prompt-cancel" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                <button id="custom-prompt-confirm" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Confirmar</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            modal.classList.remove('scale-95');
        });

        const input = modal.querySelector('#custom-prompt-input');
        input.focus();
        input.select();
        
        // Input mask: only allow numbers, dot, comma, plus, minus
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.,+\-]/g, '');
        });

        const close = (value) => {
            overlay.classList.add('opacity-0');
            modal.classList.add('scale-95');
            setTimeout(() => {
                overlay.remove();
                resolve(value);
            }, 200);
        };

        modal.querySelector('#custom-prompt-confirm').addEventListener('click', () => close(input.value));
        modal.querySelector('#custom-prompt-cancel').addEventListener('click', () => close(null));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') close(input.value);
            if (e.key === 'Escape') close(null);
        });
    });
};

window.promptEditQuantity = async function(capId, itemId, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const idx = dataCoste.findIndex(i => i.cap === capId && i.id === itemId);
    if (idx === -1) return;
    
    const item = dataCoste[idx];
    const newCant = await window.showCustomPrompt(
        'Editar Cantidad',
        `Introduce la nueva cantidad para la partida <strong class="text-blue-600">${item.id}</strong>.<br>Unidad de medida: <strong>${item.ud}</strong>`,
        item.cant
    );
    
    if (newCant === null) return;
    
    let parsedCant = parseFloat(newCant.toString().replace(',', '.'));
    if (!isNaN(parsedCant) && parsedCant !== item.cant) {
        window.pushHistory();
        dataCoste[idx].cant = parsedCant;
        if (typeof renderCurrentView === 'function') renderCurrentView();
    }
}

window.promptEditBI = async function(capId, itemId, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const idx = dataCoste.findIndex(i => i.cap === capId && i.id === itemId);
    if (idx === -1) return;
    
    const item = dataCoste[idx];
    const newBi = await window.showCustomPrompt(
        'Modificador Beneficio Industrial',
        `Ajusta el % de Beneficio Industrial <strong>solo para esta partida</strong>.<br>Ejemplo: Escribe <code class="bg-gray-100 px-1 rounded text-purple-700">2</code> para sumar un +2%, o <code class="bg-gray-100 px-1 rounded text-red-600">-5</code> para restar un -5%.`,
        item.bi_modifier || 0
    );
    
    if (newBi === null) return;
    
    let parsedBiMod = parseFloat(newBi.toString().replace(',', '.'));
    if (!isNaN(parsedBiMod) && parsedBiMod !== (item.bi_modifier || 0)) {
        window.pushHistory();
        if (parsedBiMod === 0) {
            delete dataCoste[idx].bi_modifier;
        } else {
            dataCoste[idx].bi_modifier = parsedBiMod;
        }
        if (typeof renderCurrentView === 'function') renderCurrentView();
    }
}
