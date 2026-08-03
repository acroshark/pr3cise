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

// ---- RECÁLCULO DE COSTES DESDE DESCOMPUESTO ----

window._recalcItemCosts = function(item) {
    if (!item.descompuesto || item.descompuesto.length === 0) return;
    let moTotal = 0, matTotal = 0;
    for (const d of item.descompuesto) {
        if (d.tipo === 'mo')  moTotal  += d.rend * d.precio;
        else if (d.tipo === 'mat') matTotal += d.rend * d.precio;
    }
    item.mo  = Math.round(moTotal  * 100) / 100;
    item.mat = Math.round(matTotal * 100) / 100;
};

// ---- EDICIÓN DE PRECIO EN DESCOMPUESTO (Desglose Técnico) ----

window.editDescompuestoPrice = async function(capId, itemId, codigo, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const itemIdx = dataCoste.findIndex(i => i.cap === capId && i.id === itemId);
    if (itemIdx === -1 || !dataCoste[itemIdx].descompuesto) return;
    const item = dataCoste[itemIdx];
    const desgIdx = item.descompuesto.findIndex(d => d.codigo === codigo);
    if (desgIdx === -1) return;
    const d = item.descompuesto[desgIdx];

    const newVal = await window.showCustomPrompt(
        'Editar Precio',
        `Precio de <strong class="text-blue-600">${d.desc}</strong><br>Rendimiento: ${d.rend} ${d.ud} × precio/ud`,
        d.precio, 'Precio en €'
    );
    if (newVal === null) return;
    const parsed = parseFloat(newVal.toString().replace(',', '.'));
    if (isNaN(parsed) || parsed === d.precio) return;

    window.pushHistory();
    item.descompuesto[desgIdx].precio = parsed;
    window._recalcItemCosts(item);

    // Propagar a dataMaterial si es un material
    if (d.tipo === 'mat') {
        const descKey = d.desc.trim();
        const dmIdx = dataMaterial.findIndex(m => {
            if (!m.desc) return false;
            const md = m.desc.trim();
            const len = Math.min(descKey.length, md.length, 55);
            return len >= 15 && descKey.slice(0, len) === md.slice(0, len);
        });
        if (dmIdx !== -1) dataMaterial[dmIdx].precio = parsed;
    }

    if (typeof renderCurrentView === 'function') renderCurrentView();
};

window.editDescompuestoRend = async function(capId, itemId, codigo, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const itemIdx = dataCoste.findIndex(i => i.cap === capId && i.id === itemId);
    if (itemIdx === -1 || !dataCoste[itemIdx].descompuesto) return;
    const item = dataCoste[itemIdx];
    const desgIdx = item.descompuesto.findIndex(d => d.codigo === codigo);
    if (desgIdx === -1) return;
    const d = item.descompuesto[desgIdx];

    const newVal = await window.showCustomPrompt(
        'Editar Rendimiento',
        `Rendimiento de <strong class="text-orange-600">${d.desc}</strong><br>Precio unitario: ${d.precio} €/${d.ud}`,
        d.rend, `Rendimiento en ${d.ud}`
    );
    if (newVal === null) return;
    const parsed = parseFloat(newVal.toString().replace(',', '.'));
    if (isNaN(parsed) || parsed === d.rend || parsed < 0) return;

    window.pushHistory();
    item.descompuesto[desgIdx].rend = parsed;
    window._recalcItemCosts(item);

    if (typeof renderCurrentView === 'function') renderCurrentView();
};

// ---- EDICIÓN DE PRECIO/CANT EN MATERIALES ----

window.editMaterialPrice = async function(matId, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const matIdx = dataMaterial.findIndex(m => m.id === matId);
    if (matIdx === -1) return;
    const mat = dataMaterial[matIdx];

    const newVal = await window.showCustomPrompt(
        'Editar Precio Base',
        `Precio unitario de <strong class="text-blue-600">${mat.desc}</strong><br><span class="text-xs text-gray-500">Los factores de volatilidad e IPC se aplican aparte.</span>`,
        mat.precio, 'Precio en €/ud'
    );
    if (newVal === null) return;
    const parsed = parseFloat(newVal.toString().replace(',', '.'));
    if (isNaN(parsed) || parsed === mat.precio) return;

    window.pushHistory();
    dataMaterial[matIdx].precio = parsed;

    // Propagar a todos los descompuestos que usen este material
    const descKey = mat.desc.trim();
    for (const item of dataCoste) {
        if (!item.descompuesto) continue;
        let changed = false;
        for (const d of item.descompuesto) {
            if (d.tipo !== 'mat') continue;
            const dd = d.desc.trim();
            const len = Math.min(descKey.length, dd.length, 55);
            if (len >= 15 && descKey.slice(0, len) === dd.slice(0, len)) {
                d.precio = parsed;
                changed = true;
            }
        }
        if (changed) window._recalcItemCosts(item);
    }

    if (typeof renderCurrentView === 'function') renderCurrentView();
};

window.editMaterialCant = async function(matId, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;
    const matIdx = dataMaterial.findIndex(m => m.id === matId);
    if (matIdx === -1) return;
    const mat = dataMaterial[matIdx];

    const newVal = await window.showCustomPrompt(
        'Editar Cantidad',
        `Cantidad base de <strong class="text-blue-600">${mat.desc}</strong> (${mat.ud || 'ud'})`,
        mat.cant, 'Cantidad'
    );
    if (newVal === null) return;
    const parsed = parseFloat(newVal.toString().replace(',', '.'));
    if (isNaN(parsed) || parsed === mat.cant) return;

    window.pushHistory();
    dataMaterial[matIdx].cant = parsed;

    if (typeof renderCurrentView === 'function') renderCurrentView();
};

// ---- EDICIÓN DE TARIFA MO (Materiales) ----

window.editMOPrice = async function(codigo, e) {
    e.stopPropagation();
    if (!window.isEditMode) return;

    let currentPrice = codigo === 'MO01' ? 37.83 : 31.98;
    for (const item of dataCoste) {
        if (!item.descompuesto) continue;
        const mo = item.descompuesto.find(d => d.tipo === 'mo' && d.codigo === codigo);
        if (mo) { currentPrice = mo.precio; break; }
    }

    const label = codigo === 'MO01' ? 'Oficial de Primera Electricista' : 'Auxiliar Electricista';
    const newVal = await window.showCustomPrompt(
        'Editar Tarifa Mano de Obra',
        `Precio/hora de <strong class="text-orange-600">${codigo} — ${label}</strong>.<br><span class="text-xs text-gray-500">Se actualizará en todas las partidas del presupuesto.</span>`,
        currentPrice, '€/h'
    );
    if (newVal === null) return;
    const parsed = parseFloat(newVal.toString().replace(',', '.'));
    if (isNaN(parsed) || parsed === currentPrice) return;

    window.pushHistory();
    for (const item of dataCoste) {
        if (!item.descompuesto) continue;
        let changed = false;
        for (const d of item.descompuesto) {
            if (d.tipo === 'mo' && d.codigo === codigo) { d.precio = parsed; changed = true; }
        }
        if (changed) window._recalcItemCosts(item);
    }

    if (typeof renderCurrentView === 'function') renderCurrentView();
};

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

// ---- RESTAURAR COPIAS DE SEGURIDAD ----

window.showRestoreBackups = async function() {
    if (!currentBudgetId) { alert('No hay presupuesto cargado.'); return; }

    const existing = document.getElementById('restore-backup-overlay');
    if (existing) existing.remove();

    // Crear overlay con spinner mientras carga
    const overlay = document.createElement('div');
    overlay.id = 'restore-backup-overlay';
    overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999]';
    overlay.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 class="text-base font-bold text-gray-900">🕐 Restaurar copia de seguridad</h3>
                <button onclick="document.getElementById('restore-backup-overlay').remove()" class="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
            </div>
            <div id="restore-backup-body" class="px-6 py-8 text-center text-gray-400 text-sm">Cargando copias...</div>
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button onclick="document.getElementById('restore-backup-overlay').remove()" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Cerrar al clicar fuera del modal
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    try {
        const res = await fetch(`list_backups.php?budgetId=${encodeURIComponent(currentBudgetId)}`);
        const data = await res.json();
        const body = document.getElementById('restore-backup-body');

        if (!data.success) {
            body.textContent = 'Error al cargar las copias: ' + data.message;
            return;
        }
        if (data.backups.length === 0) {
            body.innerHTML = '<p class="text-gray-500 py-4">No hay copias de seguridad disponibles.</p>';
            return;
        }

        let listHtml = '<ul class="divide-y divide-gray-100 max-h-72 overflow-y-auto -mx-6 px-6">';
        for (const bk of data.backups) {
            listHtml += `
                <li class="flex items-center justify-between py-3 gap-4">
                    <span class="text-sm text-gray-700">${bk.label}</span>
                    <button onclick="window._restoreBackup('${bk.filename}', '${bk.label}')"
                        class="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors"
                        style="background:#B08D57;" onmouseover="this.style.background='#9A7A45'" onmouseout="this.style.background='#B08D57'">
                        Restaurar
                    </button>
                </li>`;
        }
        listHtml += '</ul>';
        body.innerHTML = `<p class="text-xs text-gray-400 mb-3">Selecciona la versión a la que quieres volver. El estado actual se guardará como backup antes de restaurar.</p>${listHtml}`;

    } catch (err) {
        const body = document.getElementById('restore-backup-body');
        if (body) body.textContent = 'Error de conexión.';
    }
};

window._restoreBackup = async function(filename, label) {
    if (!confirm(`⚠️ ¿Restaurar la versión:\n"${label}"?\n\nEl estado actual se guardará como copia antes de restaurar.`)) return;

    const overlay = document.getElementById('restore-backup-overlay');
    if (overlay) overlay.remove();

    try {
        const res = await fetch('restore_budget.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budgetId: currentBudgetId, filename })
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ Copia restaurada correctamente. Se recargará el presupuesto.');
            location.reload();
        } else {
            alert('❌ Error al restaurar: ' + data.message);
        }
    } catch (err) {
        alert('❌ Error de conexión al restaurar.');
    }
};
