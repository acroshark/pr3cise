// 20/01/2025 - Archivo JavaScript separado para lógica y datos - Reestructuración profesional
// 21/01/2025 - Modificado para carga dinámica de presupuestos desde JSON

// --- CONFIGURACIÓN ---
const EUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const DEC = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DEC3 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

// --- VARIABLES GLOBALES DINÁMICAS ---
let GG = 0.12;
let BI = 0.06;
let IVA = 0.10;
let capitulos = {};
let dataCoste = [];
let dataMaterial = [];
let currentBudgetId = null;

// --- REFERENCIAS DOM ---
const contentArea = document.getElementById('content-area');
const navButtons = document.querySelectorAll('.nav-button');
const budgetSelector = document.getElementById('budget-selector');
let currentView = 'cliente';

// --- FUNCIONES DE CARGA DE DATOS ---

async function loadBudgetIndex() {
    try {
        const response = await fetch('partidas/index.json?v=' + Date.now());
        if (!response.ok) throw new Error('No se pudo cargar el índice de presupuestos');
        const data = await response.json();

        budgetSelector.innerHTML = '<option value="">-- Seleccione un presupuesto --</option>';

        data.presupuestos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            budgetSelector.appendChild(option);
        });

        // Cargar por defecto "Elektel 54 viviendas" o el primero si no existe
        let defaultBudget = data.presupuestos.find(p => p.id === 'elektel_54_viviendas');
        if (!defaultBudget && data.presupuestos.length > 0) {
            defaultBudget = data.presupuestos[0];
        }

        if (defaultBudget) {
            budgetSelector.value = defaultBudget.id;
            await loadBudget(defaultBudget.id);
        }
    } catch (error) {
        console.error('Error cargando índice:', error);
        budgetSelector.innerHTML = '<option value="">Error al cargar presupuestos</option>';
    }
}

async function loadBudget(budgetId) {
    if (!budgetId) return;

    try {
        contentArea.style.opacity = '0.5';
        contentArea.innerHTML = '<div class="text-center py-12 text-gray-500"><p class="text-xl">⏳ Cargando presupuesto...</p></div>';

        const response = await fetch(`partidas/${budgetId}.json?v=` + Date.now());
        if (!response.ok) throw new Error(`No se pudo cargar el presupuesto: ${budgetId}`);
        const data = await response.json();

        // Actualizar variables globales
        currentBudgetId = budgetId;
        window.budgetData = data;
        capitulos = data.capitulos || {};
        dataCoste = data.dataCoste || [];
        dataMaterial = data.dataMaterial || [];

        // Actualizar configuración si existe
        if (data.config) {
            GG = data.config.GG !== undefined ? data.config.GG : 0.12;
            BI = data.config.BI !== undefined ? data.config.BI : 0.06;
            IVA = data.config.IVA !== undefined ? data.config.IVA : 0.10;
            
            // Sincronizar variable de porcentaje para sliders y cálculos
            beneficioIndustrialPercent = parseFloat((BI * 100).toFixed(1));
            ggPercent = parseFloat((GG * 100).toFixed(1));
            
            // Otras variables
            if (data.config.mermas !== undefined) mermasPercent = data.config.mermas;
            if (data.config.volatilidad !== undefined) volatilidadPercent = data.config.volatilidad;
            if (data.config.ajuste2023 !== undefined) ajusteMateriales2023Percent = data.config.ajuste2023;
        }


        // Actualizar cabecera
        updateHeader(data.info);

        // Renderizar vista actual
        contentArea.style.opacity = '1';
        renderCurrentView();

    } catch (error) {
        console.error('Error cargando presupuesto:', error);
        contentArea.style.opacity = '1';
        contentArea.innerHTML = `
            <div class="text-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-200">
                <p class="text-xl font-bold">❌ Error al cargar el presupuesto</p>
                <p class="text-sm mt-2">${error.message}</p>
            </div>
        `;
    }
}

function updateHeader(info) {
    if (!info) return;

    const titleEl = document.getElementById('project-title');
    const descEl = document.getElementById('project-desc');
    const locationEl = document.getElementById('project-location');
    const refEl = document.getElementById('ref-code');
    const logoEl = document.getElementById('project-logo');

    if (titleEl) titleEl.textContent = info.titulo || 'Sin título';
    if (descEl) descEl.textContent = info.descripcion || '';
    if (locationEl) locationEl.textContent = info.ubicacion ? `📍 ${info.ubicacion}` : '';
    if (refEl) refEl.textContent = info.referencia || '';
    if (logoEl && info.logo) logoEl.src = info.logo;
}

function renderCurrentView() {
    switch (currentView) {
        case 'cliente': renderCliente(); break;
        case 'costes': renderCostes(); break;
        case 'materiales': renderMateriales(); break;
    }
}

// --- HELPERS Y FORMATEADORES ---

function generateResources(item) {
    // Si el item tiene descompuesto definido en el JSON, usarlo directamente
    if (item.descompuesto && item.descompuesto.length > 0) {
        return item.descompuesto.map(d => ({
            type: d.tipo,
            code: d.codigo,
            desc: d.desc,
            ud: d.ud,
            rend: d.rend,
            price: d.precio
        }));
    }

    // Tarifas por capítulo
    const capRates = {
        '01': { od: 'Oficial 1ª Albañilería', or: 30.00, pd: 'Peón Albañilería', pr: 25.00 },
        '02': { od: 'Oficial Fontanero',       or: 30.00, pd: 'Ayudante Fontanería', pr: 25.00 },
        '03': { od: 'Oficial 1ª Pladur',       or: 30.00, pd: 'Peón Pladur', pr: 25.00 },
        '04': { od: 'Oficial Carpintero',       or: 45.00, pd: 'Auxiliar Carpintería', pr: 25.00 },
        '05': { od: 'Oficial Pintor',           or: 30.00, pd: 'Peón Pintura', pr: 25.00 },
        '06': { od: 'Oficial 1ª',              or: 30.00, pd: 'Peón', pr: 25.00 },
        '07': { od: 'Conductor / Peón',         or: 25.00, pd: 'Peón', pr: 25.00 }
    };
    const rates = capRates[item.cap] || capRates['01'];
    const resources = [];
    if (item.mo > 0) {
        if (item.mo > 35) {
            const hOf = (item.mo * 0.6) / rates.or;
            const hPe = (item.mo * 0.4) / rates.pr;
            resources.push({ type: 'mo', code: 'MO01', desc: rates.od, ud: 'h', rend: hOf, price: rates.or });
            resources.push({ type: 'mo', code: 'MO02', desc: rates.pd, ud: 'h', rend: hPe, price: rates.pr });
        } else {
            resources.push({ type: 'mo', code: 'MO01', desc: rates.od, ud: 'h', rend: item.mo / rates.or, price: rates.or });
        }
    }
    if (item.mat > 0) {
        resources.push({ type: 'mat', code: 'MT01', desc: 'Materiales: ' + item.desc.split(' ').slice(0, 5).join(' '), ud: item.ud, rend: 1.00, price: item.mat });
    }
    if (item.mo > 0 || item.mat > 0) {
        resources.push({ type: 'aux', code: 'MA01', desc: 'Medios Auxiliares', ud: '%', rend: 2.00, price: (item.mo + item.mat) * 0.02 });
    }
    return resources;
}

// --- FUNCIONES DE RENDERIZADO ---

function renderCliente() {
    if (dataCoste.length === 0) {
        contentArea.innerHTML = '<div class="text-center py-12 text-gray-400"><p>No hay datos de presupuesto cargados.</p></div>';
        return;
    }

    let totalCEM = 0;
    let html = `<div class="space-y-6">`;
    html += `
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Memoria Técnica y Económica</h2>
            <p class="text-gray-600">Haga clic en cualquier partida para ver la <strong>ficha técnica desplegable</strong> con el detalle de la ejecución.</p>
        </div>
    `;

    const sortedChapters = Object.keys(capitulos).sort();
    for (const capId of sortedChapters) {
        const chapterName = capitulos[capId];
        const items = dataCoste.filter(item => item.cap === capId && item.tipo !== 'titulo' && !item.subtitulo && !item.eliminado && !item.oculto).map(item => {
            const factorMermas = (item.ud !== 'ud') ? (1 + (mermasPercent / 100)) : 1;
            const factorAjuste2023 = 1 + (ajusteMateriales2023Percent / 100);
            const factorVolatilidad = 1 + (volatilidadPercent / 100);
            const costeMaterial = (item.mat || 0) * factorMermas * factorVolatilidad * factorAjuste2023;
            const pCoste = costeMaterial + (item.mo || 0);
            const itemBI = beneficioIndustrialPercent + (item.bi_modifier || 0);
            const pVenta = pCoste * (1 + GG + (itemBI / 100));
            const importeVenta = pVenta * (item.cant || 0);
            return { ...item, pVenta, importeVenta, pCoste };
        });

        if (items.length === 0) continue;

        const chapterTotal = items.reduce((sum, item) => sum + (item.importeVenta || 0), 0);

        html += `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <span class="font-bold text-gray-900 uppercase text-sm tracking-wide">${capId}. ${chapterName}</span>
                    <span class="font-bold text-gray-900">${EUR.format(chapterTotal)}</span>
                </div>
                <div class="border-t border-gray-100">
        `;

        // Separar ítems compactos (con descCliente) de ítems normales
        const compactItems = items.filter(i => i.descCliente);
        const normalItems  = items.filter(i => !i.descCliente);

        // Ítems normales: renderizado habitual expandible
        normalItems.forEach(item => {
            totalCEM += item.pCoste * item.cant;
            html += `
                <div class="item-container group border-b border-gray-100">
                    <div class="item-header" onclick="toggleDetails('${item.id.replace('.', '-')}')">
                        <div class="flex items-center gap-3 flex-1">
                            <div class="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors group-hover:bg-gray-300">
                                <span id="arrow-${item.id.replace('.', '-')}" class="transition-transform duration-300">▼</span>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900 text-sm group-hover:text-black transition-colors">${item.id} - ${item.titulo || item.desc}</p>
                                ${item.old_id ? `<p class="text-[11px] text-gray-500 font-medium mt-0.5">Ref. original: ${item.old_id}</p>` : ''}
                                <p class="text-xs text-gray-600 font-medium mt-1">${DEC.format(item.cant)} ${item.ud} x ${EUR.format(item.pVenta)}</p>
                            </div>
                        </div>
                        <div class="font-mono font-bold text-gray-700 text-sm">
                            ${EUR.format(item.importeVenta)}
                        </div>
                    </div>
                    <div id="detail-${item.id.replace('.', '-')}" class="item-details">
                        <div class="p-4 bg-gray-50">
                            <h4 class="text-xs font-bold uppercase text-gray-800 mb-3 tracking-widest">Especificación Técnica</h4>
                            <p class="text-sm leading-relaxed text-gray-600">${item.longDesc || item.desc}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Ítems compactos: bloque unificado sin expand
        if (compactItems.length > 0) {
            compactItems.forEach(item => { totalCEM += item.pCoste * item.cant; });
            html += `<div class="border-b border-gray-100 px-4 py-3 bg-gray-50">`;
            compactItems.forEach((item, idx) => {
                const sep = idx < compactItems.length - 1 ? 'border-b border-gray-200 pb-2 mb-2' : '';
                html += `
                    <div class="flex justify-between items-center ${sep}">
                        <span class="text-sm text-gray-700">${item.descCliente}</span>
                        <span class="font-mono text-sm font-semibold text-gray-700 ml-4 whitespace-nowrap">${EUR.format(item.importeVenta)}</span>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div></div>`;
    }
    html += `</div>`;

    const totalGG = totalCEM * GG;
    const totalBI = totalCEM * (beneficioIndustrialPercent / 100);
    const baseImponible = totalCEM + totalGG + totalBI;
    const totalIVA = baseImponible * IVA;
    const totalPEC = baseImponible + totalIVA;

    // Renderizar Notas Importantes entre partidas y resumen económico
    if (window.budgetData && window.budgetData.notas && window.budgetData.notas.length > 0) {
        html += `
            <div class="mt-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📋</span> Notas Importantes
                </h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    ${window.budgetData.notas.map(nota => `<li>${nota}</li>`).join('')}
                </ul>
                
                <div class="mt-6 pt-4 border-t border-gray-300">
                    <p class="text-gray-800 text-sm font-medium flex items-center gap-2">
                        <span>⏰</span> El presente presupuesto tiene una validez de <strong>30 días naturales</strong> desde su fecha de emisión.
                    </p>
                </div>
            </div>
        `;
    }

    // Resumen Económico Cliente (estilo grid horizontal, fuera del grid principal)
    html += `
        <div class="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Resumen Económico</h3>
            <dl class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-gray-500 text-xs uppercase tracking-wider mb-1">Base Imponible</dt>
                    <dd class="font-bold font-mono text-gray-900 text-lg">${EUR.format(baseImponible)}</dd>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-gray-500 text-xs uppercase tracking-wider mb-1">IVA (${IVA * 100}%)</dt>
                    <dd class="font-bold font-mono text-gray-700 text-lg">${EUR.format(totalIVA)}</dd>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <dt class="text-gray-800 text-xs uppercase tracking-wider mb-1">Total Presupuesto</dt>
                    <dd class="font-bold font-mono text-gray-900 text-lg">${EUR.format(totalPEC)}</dd>
                </div>
            </dl>
        </div>

        <div class="mt-8 text-center bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
            <button onclick="descargarExcelConAuth('${currentBudgetId}')"
                class="inline-flex items-center justify-center gap-3 bg-[#107c41] hover:bg-[#185c37] text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-lg text-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Descargar Presupuesto en Excel
            </button>
            <p class="text-sm text-gray-500 mt-3 max-w-md mx-auto">Descarga el documento completo con Especificaciones Técnicas, Materiales, y Precios Descompuestos en formato .xlsx editable.</p>
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderCostes() {
    if (dataCoste.length === 0) {
        contentArea.innerHTML = '<div class="text-center py-12 text-gray-400"><p>No hay datos de costes cargados.</p></div>';
        return;
    }

    let totalGeneral = 0;
    let html = `
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">Cuadro de Precios Descompuestos</h2>
                    <p class="text-sm text-gray-500">Desglose analítico de costes directos (Material, Mano de Obra, Maquinaria).</p>
                </div>
                <div class="text-right text-xs text-gray-400">
                    <p>Valores en Euros (€)</p>
                    <p>Sin IVA ni GG/BI</p>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px]">
                    <thead>
                        <tr class="table-header sticky top-0 shadow-sm">
                            <th class="p-3 w-10"></th>
                            <th class="p-3 w-20">Código</th>
                            <th class="p-3 text-left">Unidad de Obra</th>
                            <th class="p-3 w-20 text-center">Ud</th>
                            <th class="p-3 w-24 number">Cant.</th>
                            <th class="p-3 w-28 number">Precio Unit.</th>
                            <th class="p-3 w-32 number">Importe Total</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
    `;

    const sortedChapters = Object.keys(capitulos).sort();
    for (const capId of sortedChapters) {
        const items = dataCoste.filter(i => i.cap === capId && !i.eliminado);
        if (items.length === 0) continue;

        const capTotal = items.reduce((acc, curr) => {
            // Excluir títulos, subtítulos y ocultos del cálculo
            if (curr.tipo === 'titulo' || curr.subtitulo || curr.oculto) return acc;
            const factorMermas = (curr.ud !== 'ud') ? (1 + (mermasPercent / 100)) : 1;
            const factorAjuste2023 = 1 + (ajusteMateriales2023Percent / 100);
            const factorVolatilidad = 1 + (volatilidadPercent / 100);
            const costeMat = (curr.mat || 0) * factorMermas * factorVolatilidad * factorAjuste2023;
            return acc + ((costeMat + (curr.mo || 0)) * (curr.cant || 0));
        }, 0);
        totalGeneral += capTotal;

        html += `<tr><td colspan="7" class="table-chapter">${capId}. ${capitulos[capId]}</td></tr>`;

        items.forEach(item => {
            // Subtítulos y Títulos: fila sin expand, negrita, fondo gris claro (no se pueden desplegar)
            if (item.subtitulo || item.tipo === 'titulo') {
                html += `
                <tr class="bg-gray-50 border-t border-b border-gray-200">
                    <td colspan="7" class="p-2 pl-8">
                        <span class="font-bold text-gray-700 text-xs uppercase tracking-wide">↳ ${item.id} &nbsp;${item.desc}</span>
                    </td>
                </tr>`;
                return;
            }

            const factorMermas = (item.ud !== 'ud') ? (1 + (mermasPercent / 100)) : 1;
            const factorAjuste2023 = 1 + (ajusteMateriales2023Percent / 100);
            const factorVolatilidad = 1 + (volatilidadPercent / 100);
            const unitPrice = (item.mat * factorMermas * factorVolatilidad * factorAjuste2023) + item.mo;
            const totalPrice = unitPrice * item.cant;
            // 09/05/2026 17:06 — Fix: include cap to avoid duplicate IDs when same item.id appears in multiple chapters; replace all dots with regex
            const rowId = `cost-${item.cap.replace(/_/g, '-')}-${item.id.replace(/\./g, '-')}`;
            const resources = generateResources(item);

            const isHidden = item.oculto ? true : false;
            const hiddenClass = isHidden ? 'bg-red-50 opacity-75' : '';
            const hiddenStyle = isHidden ? 'color: #f87171;' : '';

            // Botones de edición
            let editButtonsHtml = '';
            if (window.isEditMode) {
                editButtonsHtml = `
                    <div class="flex gap-1 mt-2">
                        <button onclick="window.promptEditQuantity('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 text-xs shadow-sm border border-blue-200 transition-colors" title="Editar Cantidad">✏️ Cantidad</button>
                        <button onclick="window.promptEditBI('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded text-purple-700 text-xs shadow-sm border border-purple-200 transition-colors" title="Editar Beneficio Industrial">📈 BI (+/-)</button>
                        <button onclick="window.toggleItemVisibility('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs shadow-sm border border-gray-200 transition-colors" title="${isHidden ? 'Mostrar partida' : 'Ocultar partida'}">${isHidden ? '👁️‍🗨️ Mostrar' : '👁️ Ocultar'}</button>
                        <button onclick="window.deleteItem('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-red-700 text-xs shadow-sm border border-red-200 transition-colors ml-auto" title="Eliminar partida">🗑️ Eliminar</button>
                    </div>
                `;
            }
            
            const biModifierText = item.bi_modifier ? `<span class="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded ml-2 font-bold whitespace-nowrap" title="Modificador de Beneficio Industrial">BI: ${item.bi_modifier > 0 ? '+' : ''}${item.bi_modifier}%</span>` : '';

            html += `
                <tr class="cost-row ${hiddenClass}" onclick="window.toggleCostRow('${rowId}')" id="tr-${rowId}">
                    <td class="p-3 text-center text-gray-400 font-bold text-lg select-none transition-transform" id="icon-${rowId}">+</td>
                    <td class="p-3 font-mono text-xs text-gray-500">
                        <div class="font-bold text-gray-800">${item.id}</div>
                        ${item.old_id ? `<div class="text-[10px] text-gray-400 mt-1" title="Referencia de medición original">${item.old_id}</div>` : ''}
                    </td>
                    <td class="p-3 font-medium text-gray-800">
                        <span style="${hiddenStyle}">${item.desc}</span>
                        ${biModifierText}
                        ${isHidden ? '<span class="ml-2 text-xs text-red-600 font-bold uppercase tracking-wider bg-red-100 px-1 py-0.5 rounded">Oculta (No suma)</span>' : ''}
                        ${editButtonsHtml}
                    </td>
                    <td class="p-3 text-center text-xs text-gray-500">${item.ud}</td>
                    <td class="p-3 number text-gray-600">${DEC.format(item.cant)}</td>
                    <td class="p-3 number font-bold text-gray-700">${EUR.format(unitPrice)}</td>
                    <td class="p-3 number font-bold text-gray-900">${EUR.format(totalPrice)}</td>
                </tr>
                <!-- DESGLOSE (Hidden Row) -->
                <tr class="cost-detail-row" id="detail-${rowId}">
                    <td colspan="7" class="p-0">
                        <div class="p-4 pl-16 bg-gray-50 border-l-4 border-gray-300">
                            <h4 class="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Descompuesto del Precio Unitario (${EUR.format(unitPrice)} / ${item.ud})</h4>
                            <table class="w-full text-xs border border-gray-200 bg-white rounded shadow-sm">
                                <thead class="bg-gray-100 text-gray-600 border-b border-gray-200">
                                    <tr>
                                        <th class="p-2 text-left w-20">Tipo</th>
                                        <th class="p-2 text-left">Recurso / Concepto</th>
                                        <th class="p-2 text-center w-16">Ud</th>
                                        <th class="p-2 text-right w-20">Rendim.</th>
                                        <th class="p-2 text-right w-24">Precio</th>
                                        <th class="p-2 text-right w-24">Importe</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
            `;

            resources.forEach(res => {
                const importRes = res.type === 'aux' || res.desc.includes('auxiliar') ? res.price : (res.rend * res.price);
                let badgeClass = 'res-mat'; let typeLabel = 'MAT';
                if (res.type === 'mo') { badgeClass = 'res-mo'; typeLabel = 'MO'; }
                if (res.type === 'aux') { badgeClass = 'res-aux'; typeLabel = '%'; }
                if (res.type === 'maq') { badgeClass = 'res-maq'; typeLabel = 'MQ'; }

                html += `
                    <tr>
                        <td class="p-2"><span class="badge-res ${badgeClass}">${typeLabel}</span></td>
                        <td class="p-2 text-gray-700">${res.desc}</td>
                        <td class="p-2 text-center text-gray-500">${res.ud}</td>
                        <td class="p-2 text-right font-mono text-gray-600">${DEC3.format(res.rend)}</td>
                        <td class="p-2 text-right font-mono text-gray-600">${EUR.format(res.price)}</td>
                        <td class="p-2 text-right font-mono font-medium text-gray-800">${EUR.format(importRes)}</td>
                    </tr>
                `;
            });

            html += `
                                </tbody>
                                <tfoot class="bg-gray-50 font-bold text-gray-700 border-t border-gray-200">
                                    <tr>
                                        <td colspan="5" class="p-2 text-right uppercase text-[10px]">Total Coste Directo Unitario:</td>
                                        <td class="p-2 text-right text-gray-900">${EUR.format(unitPrice)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Fila de total del capítulo
        html += `
            <tr class="bg-indigo-50 border-t-2 border-indigo-100">
                <td colspan="6" class="text-right p-4 font-bold text-indigo-900 uppercase text-xs tracking-wider">
                    Total ${capitulos[capId]}
                </td>
                <td class="p-4 number font-bold text-indigo-900 text-lg">
                    ${EUR.format(capTotal)}
                </td>
            </tr>
        `;
    }

    html += `
                    <tr class="bg-gray-50 border-t-4 border-gray-300">
                        <td colspan="6" class="text-right p-6 uppercase tracking-wider text-sm text-gray-500 font-bold">Total Coste Ejecución Material</td>
                        <td class="number p-6 text-3xl font-bold text-gray-800">${EUR.format(totalGeneral)}</td>
                    </tr>
                </tbody>
            </table>

        </div></div>
        
        <!-- Resumen Económico Técnico -->
        <div class="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Desglose Económico del Presupuesto</h3>
            <dl class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-gray-500 text-xs uppercase tracking-wider mb-1">Ejecución Material (CEM)</dt>
                    <dd class="font-bold font-mono text-gray-900 text-lg">${EUR.format(totalGeneral)}</dd>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <dt class="text-gray-600 text-xs uppercase tracking-wider">Gastos Generales</dt>
                        <span id="gg-value" class="font-bold text-gray-700">${ggPercent}%</span>
                    </div>
                    <input type="range" id="gg-slider" min="5" max="25" step="1" value="${ggPercent}"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500 mb-2"
                        oninput="updateGGPreview(this.value)"
                        onchange="updateGG(this.value)">
                    <dd class="font-bold font-mono text-gray-700 text-lg">${EUR.format(totalGeneral * GG)}</dd>
                    <details class="mt-2">
                        <summary class="text-xs text-gray-400 cursor-pointer hover:text-gray-600">¿Qué incluyen los GG?</summary>
                        <ul class="mt-2 text-xs text-gray-500 space-y-1 list-disc list-inside">
                            <li><strong>Estructura empresarial:</strong> Alquiler de oficina o nave, sueldos del personal administrativo o contable, gestoría y teléfono.</li>
                            <li><strong>Logística y movilidad:</strong> Combustible de las furgonetas, mantenimiento de los vehículos, peajes o dietas.</li>
                            <li><strong>Equipamiento:</strong> Desgaste, mantenimiento y amortización de herramientas eléctricas, andamios y pequeña maquinaria.</li>
                            <li><strong>Seguros y cuotas:</strong> Seguros de Responsabilidad Civil, mutuas de accidentes y prevención de riesgos laborales.</li>
                        </ul>
                    </details>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <dt class="text-gray-600 text-xs uppercase tracking-wider">Beneficio Industrial</dt>
                        <span id="bi-value" class="font-bold text-gray-700">${beneficioIndustrialPercent}%</span>
                    </div>
                    <input type="range" id="bi-slider" min="0" max="50" step="1" value="${beneficioIndustrialPercent}" 
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500 mb-2"
                        oninput="updateBIPreview(this.value)"
                        onchange="updateBI(this.value)">
                    <dd class="font-bold font-mono text-gray-800 text-lg">${EUR.format(totalGeneral * (beneficioIndustrialPercent / 100))}</dd>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-300">
                    <dt class="text-gray-900 text-xs uppercase tracking-wider mb-1">Base Imponible</dt>
                    <dd class="font-bold font-mono text-black text-lg">${EUR.format(totalGeneral * (1 + GG + (beneficioIndustrialPercent / 100)))}</dd>
                </div>
            </dl>
        </div>
        <p class="mt-6 text-xs italic text-gray-400 text-right px-1">
            * Se aplica IVA general al <strong>21%</strong> (Art. 90 LIVA). El cliente es una entidad jurídica (promotor CPS SA CARANETA SL) y se trata de obra nueva, no de rehabilitación de vivienda particular. El IVA reducido del 10% (Art. 91.Uno.3 LIVA) no es de aplicación.
        </p>

        <!-- Nota de competitividad -->
        <div class="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div class="flex items-center gap-3 bg-gray-50 border-b border-gray-200 px-5 py-3">
                <span class="text-base">📊</span>
                <h4 class="text-xs font-bold uppercase tracking-widest text-gray-700">Análisis de Competitividad — Instalación Eléctrica Ibiza 2025/26</h4>
            </div>
            <div class="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                    <p class="font-semibold text-gray-800 mb-1">Notas y Aclaraciones</p>
                    <ul class="space-y-2 mt-2 list-disc list-inside text-gray-600">
                        <li><strong>Materiales de Alta Gama:</strong> Gran volumen de mecanismos de diseño Jung LS 990 (ej: >280 tomas de corriente).</li>
                        <li><strong>Cableado LGA:</strong> El gran distanciamiento desde contadores requiere >600m de cable libre de halógenos de 35mm² para evitar caída de tensión.</li>
                        <li><strong>Mediciones:</strong> Presupuesto basado estrictamente en la hoja de mediciones aportada. No nos hacemos responsables de posibles errores u omisiones en dichas mediciones.</li>
                    </ul>
                </div>
                <div>
                    <p class="font-semibold text-gray-800 mb-1">Posicionamiento en el mercado</p>
                    <ul class="space-y-1">
                        <li>✅ <strong>Mano de obra 45€/h:</strong> Electricista oficial en Ibiza. Precio competitivo para oficial autorizado en Baleares 2026 → <span class="text-green-700 font-semibold">precio ajustado a mercado insular</span></li>
                        <li>✅ <strong>Materiales Schneider:</strong> Descuento 75% sobre tarifa → precio neto competitivo vs. distribuidores locales</li>
                        <li>✅ <strong>Mecanismos Jung LS990:</strong> 50% descuento → gama alta a precio de gama media</li>
                        <li>⚠️ <strong>IVA 21%:</strong> Obra nueva con promotor empresarial. No aplica reducción al 10%.</li>

                    </ul>
                </div>
            </div>
            <div class="bg-amber-50 border-t border-amber-100 px-5 py-2">
                <p class="text-xs text-amber-800"><strong>Nota interna:</strong> Comparar siempre con instaladores homologados en Ibiza. Los precios de autónomos sin regularizar pueden ser un 30–40% inferiores pero sin garantías legales ni seguros de RC.</p>
            </div>
        </div>
        `;
    contentArea.innerHTML = html;
}

// Variables globales para ajustes
let mermasPercent = 2;
let volatilidadPercent = 0;
let beneficioIndustrialPercent = 7;
let ggPercent = 12;
let ajusteMateriales2023Percent = 0;

// Función de seguridad desbloqueo IPC
window.unlockIPC = function () {
    const password = prompt("Ingrese contraseña de administrador:");
    if (password === "1479") {
        document.getElementById('ipc-lock-overlay').style.display = 'none';
        document.getElementById('ipc-controls').classList.remove('opacity-0');
        alert("✅ Ajustes desbloqueados");
    } else {
        if (password !== null) alert("❌ Contraseña incorrecta");
    }
}

function renderMateriales() {
    if (dataMaterial.length === 0) {
        contentArea.innerHTML = '<div class="text-center py-12 text-gray-400"><p>No hay datos de materiales cargados.</p></div>';
        return;
    }

    // const factorMermas = 1 + (mermasPercent / 100); // Moved to individual item check
    let totalMateriales = 0;
    let totalConMermas = 0;

    let tableHtml = `
        <div class="summary-card">
            <h2 class="text-xl font-bold mb-2 text-gray-800">Listado de Materiales</h2>
            <p class="mb-4 text-sm text-gray-500">Materiales necesarios con códigos estandarizados BCCA.</p>
            
            <!--Slider de Volatilidad-->
            <!--Slider de Volatilidad-->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 text-lg flex-shrink-0">
                        📈
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800">Coeficiente de Volatilidad de Materiales</h3>
                        <p class="text-xs text-gray-500">Incrementa los precios unitarios de materiales por fluctuaciones de mercado. No afecta a la mano de obra.</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 md:w-64">
                    <input type="range" id="volatilidad-slider" min="-10" max="100" step="1" value="${volatilidadPercent}" 
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                        oninput="updateVolatilidadPreview(this.value)"
                        onchange="updateVolatilidad(this.value)">
                    <span id="volatilidad-value" class="font-bold text-gray-700 text-lg w-14 text-right">${volatilidadPercent >= 0 ? '+' : ''}${volatilidadPercent}%</span>
                </div>
            </div>
            
            <!--Slider de Mermas-->
            <!--Slider de Mermas-->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 text-lg flex-shrink-0">
                        ✏️
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800">Ajuste de Mermas / Desperdicio</h3>
                        <p class="text-xs text-gray-500">Estimación de material excedente necesario por cortes y ajustes en obra. No aplica a materiales medidos en unidades (ud).</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 md:w-64">
                    <input type="range" id="mermas-slider" min="0" max="20" step="1" value="${mermasPercent}" 
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                        oninput="updateMermasPreview(this.value)"
                        onchange="updateMermas(this.value)">
                    <span id="mermas-value" class="font-bold text-gray-700 text-lg w-12 text-right">${mermasPercent}%</span>
                </div>
            </div>
            
            <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full min-w-[900px]">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Código</th>
                        <th class="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Material</th>
                        <th class="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-14">Ud</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Cant. Base</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Cant. +Mermas</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">PVP</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Neto</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-28 bg-gray-100">Total</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
    `;

    dataMaterial.forEach(item => {
        if (item.tipo === 'titulo') {
            const isCapitulo = (item.desc || '').toUpperCase().startsWith('CAP');
            if (isCapitulo) {
                // Capítulo principal
                tableHtml += `
                    <tr class="bg-indigo-50 border-t border-b border-indigo-200">
                        <td colspan="8" class="p-2 pl-4">
                            <div class="font-bold text-indigo-800 uppercase tracking-widest text-sm flex items-center gap-2">
                                <span class="text-indigo-400">📘</span> ${item.desc}
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                // Subtítulo
                tableHtml += `
                    <tr class="bg-gray-100 border-t border-b border-gray-200">
                        <td colspan="8" class="p-2 pl-6">
                            <div class="font-bold text-gray-700 uppercase tracking-wider text-xs flex items-center gap-2">
                                <span class="text-gray-400">↳</span> ${item.desc}
                            </div>
                        </td>
                    </tr>
                `;
            }
            return;
        }

        const cantBase = item.cant || 0;
        const factorMermas = (item.ud !== 'ud') ? (1 + (mermasPercent / 100)) : 1;
        const cantConMermas = cantBase * factorMermas;
        const factorVolatilidad = 1 + (volatilidadPercent / 100);
        const factorAjuste2023 = 1 + (ajusteMateriales2023Percent / 100);
        const precioUnitarioAjustado = (item.precio || 0) * factorVolatilidad * factorAjuste2023;
        const precioBase = precioUnitarioAjustado * cantBase;
        const precioConMermas = precioUnitarioAjustado * cantConMermas;

        totalMateriales += precioBase;
        totalConMermas += precioConMermas;

        tableHtml += `
            <tr class="hover:bg-gray-50">
                <td class="p-3 font-mono text-xs text-gray-600 bg-gray-50">${item.id}</td>
                <td class="p-3 font-medium text-gray-800">
                    ${item.url ? `<a href="${item.url}" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
                        ${item.desc}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>` : item.desc}
                    ${item.ref_proveedor ? `<div class="text-[10px] text-gray-500 mt-1 font-mono">Ref. prov: ${item.ref_proveedor}</div>` : ''}
                </td>
                <td class="p-3 text-center text-xs text-gray-500">${item.ud || '-'}</td>
                <td class="p-3 number text-gray-500">${DEC.format(cantBase)}</td>
                <td class="p-3 number font-bold ${mermasPercent > 0 && factorMermas > 1 ? 'text-gray-900 bg-gray-100' : 'text-gray-700'}">${DEC.format(cantConMermas)}</td>
                <td class="p-3 number text-gray-500">${item.pvp ? EUR.format(item.pvp) : '-'}</td>
                <td class="p-3 number ${volatilidadPercent !== 0 ? 'text-gray-800 font-medium' : 'text-gray-600'}">${precioUnitarioAjustado === 0 ? '<span class="text-red-500 text-xs uppercase font-bold">Excluido</span>' : EUR.format(precioUnitarioAjustado)}</td>
                <td class="p-3 number font-bold text-gray-900 bg-gray-100">${precioConMermas === 0 ? '<span class="text-red-500 text-xs uppercase font-bold">Excluido</span>' : EUR.format(precioConMermas)}</td>
            </tr>
        `;
    });

    // Calcular diferencia por mermas
    const diferenciaMermas = totalConMermas - totalMateriales;

    tableHtml += `
                </tbody>
                <tfoot>
                    ${mermasPercent > 0 ? `
                    <tr class="bg-gray-100 text-gray-800">
                        <td colspan="7" class="p-3 text-right font-medium">
                            <span class="text-xs uppercase tracking-wider">Coste base materiales</span>
                        </td>
                        <td class="p-3 number font-bold">${EUR.format(totalMateriales)}</td>
                    </tr>
                    <tr class="bg-gray-100 text-gray-800">
                        <td colspan="7" class="p-3 text-right font-medium">
                            <span class="text-xs uppercase tracking-wider">+ Ajuste mermas (${mermasPercent}%)</span>
                        </td>
                        <td class="p-3 number font-bold text-gray-700">+${EUR.format(diferenciaMermas)}</td>
                    </tr>
                    ` : ''}
                    <tr class="bg-black text-white">
                        <td colspan="7" class="p-4 text-right font-bold uppercase tracking-wider">Total Materiales</td>
                        <td class="p-4 number text-xl font-extrabold text-white">${EUR.format(totalConMermas)}</td>
                    </tr>
                </tfoot>
            </table>
            </div>
        </div>
        <div class="mt-6 p-5 rounded-lg border" style="background:#FFFBF2; border-color:#D4BA8A;">
            <h4 class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#B08D57;">📋 Nota — Descuentos de Proveedor (CB Electric / Electrostock) *</h4>
            <ul class="text-xs space-y-1" style="color:#334155; line-height:1.7;">
                <li><strong>Aparamenta Schneider (Magnetotérmicos, etc.):</strong> −70/75% de descuento sobre tarifa oficial.</li>
                <li><strong>Envolventes Schneider (Cuadros):</strong> −50/55% de descuento sobre tarifa oficial.</li>
                <li><strong>Mecanismos Jung LS990 (Blanco):</strong> −50% de descuento aplicado.</li>
                <li><strong>Tubos y Mangueras Eléctricas:</strong> Precios netos especiales acordados directamente con el proveedor.</li>
            </ul>
            <p class="mt-3 text-xs italic" style="color:#94A3B8;">* Estos descuentos indicados son referencias obtenidas por el cliente y son orientativos. Pueden variar significativamente según temporada, disponibilidad de stock o producto concreto. Tómense únicamente como referencia estimativa.</p>
        </div>
        `;
    contentArea.innerHTML = tableHtml;
}

// Función para actualizar mermas en tiempo real
window.updateMermasPreview = function (value) {
    document.getElementById('mermas-value').textContent = value + '%';
}

window.updateMermas = function (value) {
    mermasPercent = parseInt(value);
    renderCurrentView();
}

// Función para actualizar volatilidad en tiempo real
window.updateVolatilidadPreview = function (value) {
    const prefix = parseInt(value) >= 0 ? '+' : '';
    document.getElementById('volatilidad-value').textContent = prefix + value + '%';
}

window.updateVolatilidad = function (value) {
    volatilidadPercent = parseInt(value);
    renderCurrentView();
}

// Función para actualizar GG en tiempo real
window.updateGGPreview = function (value) {
    document.getElementById('gg-value').textContent = value + '%';
}

window.updateGG = function (value) {
    ggPercent = parseInt(value);
    GG = ggPercent / 100;
    renderCurrentView();
}

// Función para actualizar beneficio industrial en tiempo real
window.updateBIPreview = function (value) {
    document.getElementById('bi-value').textContent = value + '%';
}

window.updateBI = function (value) {
    beneficioIndustrialPercent = parseInt(value);
    renderCurrentView();
}

// Función para actualizar ajuste 2023
window.updateAjuste2023Preview = function (value) {
    document.getElementById('ajuste2023-value').textContent = value + '%';
}

window.updateAjuste2023 = function (value) {
    ajusteMateriales2023Percent = parseInt(value);
    renderCurrentView();
}

// --- MANEJADORES DE EVENTOS Y NAVEGACIÓN ---
window.toggleDetails = function (id) {
    const detailBlock = document.getElementById(`detail-${id}`);
    const arrow = document.getElementById(`arrow-${id}`);
    if (detailBlock.classList.contains('open')) {
        detailBlock.classList.remove('open');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        detailBlock.classList.add('open');
        arrow.style.transform = 'rotate(180deg)';
    }
}

window.toggleCostRow = function (rowId) {
    const detailRow = document.getElementById(`detail-${rowId}`);
    const mainRow = document.getElementById(`tr-${rowId}`);
    const icon = document.getElementById(`icon-${rowId}`);

    if (detailRow.classList.contains('open')) {
        detailRow.classList.remove('open');
        mainRow.classList.remove('expanded');
        icon.innerText = '+';
        icon.style.transform = 'rotate(0deg)';
    } else {
        detailRow.classList.add('open');
        mainRow.classList.add('expanded');
        icon.innerText = '−';
        icon.style.transform = 'rotate(180deg)';
    }
}

function handleNav(event) {
    const targetBtn = event.target.closest('.nav-button');
    if (!targetBtn) return;

    const newView = targetBtn.id.split('-')[1];
    if (newView === currentView) return;

    currentView = newView;

    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `nav-${currentView}`) {
            btn.classList.add('active');
        }
    });

    contentArea.style.opacity = '0';
    setTimeout(() => {
        renderCurrentView();
        contentArea.style.opacity = '1';
    }, 150);
}

contentArea.style.transition = 'opacity 0.15s ease-in-out';

// --- EVENT LISTENERS ---
document.getElementById('nav-cliente').addEventListener('click', handleNav);
document.getElementById('nav-costes').addEventListener('click', handleNav);
document.getElementById('nav-materiales').addEventListener('click', handleNav);

// Listener para el selector de presupuesto
// Listener para el selector de presupuesto
let budgetUnlocked = false;

budgetSelector.addEventListener('mousedown', (e) => {
    if (!budgetUnlocked) {
        e.preventDefault(); // Evita que se despliegue
        const password = prompt("🔒 Ingrese contraseña para cambiar de presupuesto:");
        if (password === "3026") {
            budgetUnlocked = true;
            alert("✅ Acceso concedido. Haga clic de nuevo para seleccionar.");
            // Opcional: intentar re-abrir, pero requiere truco. Mejor pedir click de nuevo.
        } else {
            if (password !== null) alert("❌ Contraseña incorrecta");
        }
    }
});

budgetSelector.addEventListener('change', (e) => {
    loadBudget(e.target.value);
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    loadBudgetIndex();
});

// ==========================================
// DESCARGA EXCEL — Autentica sesión PHP antes de redirigir
// La contraseña del prompt (Ib1za) se usa para autenticar
// la sesión PHP que protege el endpoint de descarga. 11/05/2026 19:46 - actualizado de Murci4 a Ib1za
// ==========================================
window.descargarExcelConAuth = async function(budgetId) {
    const p = prompt('Ingrese contraseña para generar y descargar Excel:');
    if (p === null) return;                       // usuario canceló
    if (p !== 'Ib1za') {
        alert('❌ Contraseña incorrecta');
        return;
    }

    // Activar sesión PHP con la contraseña del servidor
    try {
        const res = await fetch('auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'Ib1za' }), // 11/05/2026 19:46 - actualizado de reformaselmanitas a Ib1za
            credentials: 'same-origin'
        });
        const data = await res.json();
        if (!data.success) {
            alert('❌ Error de autenticación en servidor. Contacte al administrador.');
            return;
        }
    } catch (e) {
        alert('❌ No se pudo conectar con el servidor. ¿Está el servidor PHP activo?');
        return;
    }

    // Sesión activa → redirigir al endpoint de descarga del Excel
    const phpFile = 'descargar_excel_' + budgetId.replace('elektel_', '').replace(/_/g, '') + '.php';
    window.location.href = phpFile;
};

// ==========================================
// DESCARGA PDF FICHA TÉCNICA — Imprime la vista Cliente actual
// Usa window.print() con estilos @media print para generar PDF.
// El usuario debe seleccionar "Guardar como PDF" en el diálogo de impresión.
// ==========================================
window.descargarPDFFichaTecnica = function() {
    // Asegurarse de que estamos en la vista Cliente
    if (currentView !== 'cliente') {
        if (!confirm('Esta función imprime la Ficha Técnica del Cliente.\n¿Cambiar a esa vista y continuar?')) return;
        currentView = 'cliente';
        renderCliente();
        setTimeout(() => window.print(), 400);
    } else {
        window.print();
    }
};
