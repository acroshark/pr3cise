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
let capitulos_en = {};
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

        budgetSelector.innerHTML = `<option value="">${window.t('budget.placeholder')}</option>`;

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
        budgetSelector.innerHTML = `<option value="">${window.t('budget.error')}</option>`;
    }
}

async function loadBudget(budgetId) {
    if (!budgetId) return;

    try {
        contentArea.style.opacity = '0.5';
        contentArea.innerHTML = `<div class="text-center py-12 text-gray-500"><p class="text-xl">${window.t('loading')}</p></div>`;

        const response = await fetch(`partidas/${budgetId}.json?v=` + Date.now());
        if (!response.ok) throw new Error(`No se pudo cargar el presupuesto: ${budgetId}`);
        const data = await response.json();

        // Actualizar variables globales
        currentBudgetId = budgetId;
        window.budgetData = data;
        capitulos = data.capitulos || {};
        capitulos_en = data.capitulos_en || {};
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
                <p class="text-xl font-bold">❌ ${window.t('budget.loadError')}</p>
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

    const lang = window.currentLang || 'es';
    // 21/05/2026 21:37 - Generalizado para cualquier idioma
    const localizedTitulo = lang !== 'es' && info['titulo_' + lang];
    const localizedDesc = lang !== 'es' && info['descripcion_' + lang];
    if (titleEl) titleEl.textContent = (localizedTitulo) ? localizedTitulo : (info.titulo || window.t('nodata.title'));
    if (descEl) descEl.textContent = (localizedDesc) ? localizedDesc : (info.descripcion || '');
    if (locationEl) locationEl.textContent = info.ubicacion ? `📍 ${info.ubicacion}` : '';
    if (refEl) refEl.textContent = info.referencia || '';
    if (logoEl && info.logo) logoEl.src = info.logo;
}

// 26/05/2026 - Helpers para contenido multilingüe del presupuesto
// 21/05/2026 21:37 - Generalizado para soportar cualquier idioma (no solo 'en')
function capName(capId) {
    const lang = window.currentLang || 'es';
    if (lang !== 'es') {
        const localizedCaps = window.budgetData && window.budgetData['capitulos_' + lang];
        if (localizedCaps && localizedCaps[capId]) return localizedCaps[capId];
    }
    return capitulos[capId] || capId;
}

// 21/05/2026 21:37 - Generalizado para soportar cualquier idioma (no solo 'en')
function iL(item, field) {
    const lang = window.currentLang || 'es';
    if (lang === 'es') return item[field];
    const localizedField = item[field + '_' + lang];
    if (localizedField) return localizedField;
    const bd = window.budgetData;
    const titulosKey = 'titulos_' + lang;
    if ((field === 'titulo' || field === 'desc') && bd && bd[titulosKey] && bd[titulosKey][item.id]) {
        return bd[titulosKey][item.id];
    }
    const longDescsKey = 'longDescs_' + lang;
    if (field === 'longDesc' && bd && bd[longDescsKey] && bd[longDescsKey][item.id]) {
        return bd[longDescsKey][item.id];
    }
    return item[field];
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
            desc: iL(d, 'desc'),
            ud: d.ud,
            rend: d.rend,
            price: d.precio
        }));
    }

    // Tarifas por capítulo — ajustadas por oficio y mercado Ibiza 2026
    const capRates = {
        '01': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '02': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '03': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '04': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '05': { od: 'Oficial fontanero',                or: 42, pd: 'Ayudante fontanería',     pr: 33 },
        '06': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '07': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '08': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '09': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '10': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '11': { od: 'Oficial carpintero / aluminio',    or: 48, pd: 'Peón especialista',       pr: 32 },
        '12': { od: 'Oficial carpintero',               or: 48, pd: 'Peón especialista',       pr: 32 },
        '13': { od: 'Oficial cerrajero',                or: 42, pd: 'Peón especialista',       pr: 32 },
        '14': { od: 'Oficial 1ª Albañil / yesero',      or: 40, pd: 'Peón especialista',       pr: 32 },
        '15': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '16': { od: 'Oficial 1ª solador',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '17': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '18': { od: 'Oficial pintor',                   or: 38, pd: 'Peón ayudante',           pr: 32 },
        '19': { od: 'Oficial fontanero',                or: 42, pd: 'Ayudante fontanería',     pr: 33 },
        '20': { od: 'Oficial fontanero',                or: 42, pd: 'Ayudante fontanería',     pr: 33 },
        '21': { od: 'Oficial electricista',             or: 44, pd: 'Ayudante electricista',   pr: 34 },
        '22': { od: 'Oficial electricista',             or: 44, pd: 'Ayudante electricista',   pr: 34 },
        '24': { od: 'Oficial climatización / elect.',   or: 44, pd: 'Ayudante electricista',   pr: 34 },
        '25': { od: 'Oficial fontanero',                or: 42, pd: 'Ayudante fontanería',     pr: 33 },
        '26': { od: 'Oficial fontanero',                or: 42, pd: 'Ayudante fontanería',     pr: 33 },
        '28': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '29': { od: 'Peón especialista',                or: 32, pd: 'Peón especialista',       pr: 32 },
        '30': { od: 'Peón especialista',                or: 32, pd: 'Peón especialista',       pr: 32 },
        '31': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '32': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '33': { od: 'Oficial 1ª Albañil',               or: 40, pd: 'Peón especialista',       pr: 32 },
        '34': { od: 'Peón especialista',                or: 32, pd: 'Peón especialista',       pr: 32 }
    };
    const rates = capRates[item.cap] || capRates['01'];
    const resources = [];
    if (item.mo > 0) {
        const mo01Item = dataMaterial.find(m => m.id === 'MO01');
        const mo02Item = dataMaterial.find(m => m.id === 'MO02');
        const mo01Desc = mo01Item ? iL(mo01Item, 'desc') : rates.od;
        const mo02Desc = mo02Item ? iL(mo02Item, 'desc') : rates.pd;
        if (item.mo > 35) {
            const hOf = (item.mo * 0.6) / rates.or;
            const hPe = (item.mo * 0.4) / rates.pr;
            resources.push({ type: 'mo', code: 'MO01', desc: mo01Desc, ud: 'h', rend: hOf, price: rates.or });
            resources.push({ type: 'mo', code: 'MO02', desc: mo02Desc, ud: 'h', rend: hPe, price: rates.pr });
        } else {
            resources.push({ type: 'mo', code: 'MO01', desc: mo01Desc, ud: 'h', rend: item.mo / rates.or, price: rates.or });
        }
    }
    if (item.mat > 0) {
        resources.push({ type: 'mat', code: 'MT01', desc: window.t('costes.autoResource.mat') + ' ' + item.desc.split(' ').slice(0, 5).join(' '), ud: item.ud, rend: 1.00, price: item.mat });
    }
    if (item.mo > 0 || item.mat > 0) {
        resources.push({ type: 'aux', code: 'MA01', desc: window.t('costes.autoResource.aux'), ud: '%', rend: 2.00, price: (item.mo + item.mat) * 0.02 });
    }
    return resources;
}

// --- FUNCIONES DE RENDERIZADO ---

function renderCliente() {
    if (dataCoste.length === 0) {
        contentArea.innerHTML = `<div class="text-center py-12 text-gray-400"><p>${window.t('nodata.client')}</p></div>`;
        return;
    }

    let totalCEM = 0;
    let totalVenta = 0;  // suma de importeVenta (ya incluye GG+BI por partida)
    let html = `<div class="space-y-6">`;

    // Ficha del cliente (si existe en info)
    if (window.budgetData && window.budgetData.info && window.budgetData.info.cliente) {
        const c = window.budgetData.info.cliente;
        const info = window.budgetData.info;
        html += `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-2">
                <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <span class="text-[#B08D57]">▍</span> ${window.t('client.ficha')}
                </h2>
                <dl class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                    <div>
                        <dt class="text-gray-400 text-xs uppercase tracking-wider mb-0.5">${window.t('client.clientLabel')}</dt>
                        <dd class="font-semibold text-gray-900">${c.nombre || '—'}</dd>
                    </div>
                    <div>
                        <dt class="text-gray-400 text-xs uppercase tracking-wider mb-0.5">${window.t('client.nifLabel')}</dt>
                        <dd class="font-semibold text-gray-900">${c.nif || '—'}</dd>
                    </div>
                    <div>
                        <dt class="text-gray-400 text-xs uppercase tracking-wider mb-0.5">${window.t('client.refLabel')}</dt>
                        <dd class="font-mono text-gray-700">${info.referencia || '—'}</dd>
                    </div>
                    <div>
                        <dt class="text-gray-400 text-xs uppercase tracking-wider mb-0.5">${window.t('client.address')}</dt>
                        <dd class="font-semibold text-gray-900">${c.direccion || '—'}</dd>
                    </div>
                    <div>
                        <dt class="text-gray-400 text-xs uppercase tracking-wider mb-0.5">${window.t('client.phone')}</dt>
                        <dd class="font-semibold text-gray-900">${c.telefono || '—'}</dd>
                    </div>
                    <div>
                        <dt class="text-gray-400 text-xs uppercase tracking-wider mb-0.5">${window.t('client.email')}</dt>
                        <dd class="font-semibold text-gray-900">${c.email || '—'}</dd>
                    </div>
                </dl>
            </div>
        `;
    }

    html += `
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">${window.t('client.title')}</h2>
            <p class="text-gray-600">${window.t('client.subtitle')}</p>
        </div>
    `;

    const sortedChapters = Object.keys(capitulos).sort();
    for (const capId of sortedChapters) {
        const chapterName = capName(capId);
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
            totalVenta += item.importeVenta;
            html += `
                <div class="item-container group border-b border-gray-100">
                    <div class="item-header" onclick="toggleDetails('${item.id.replace('.', '-')}')">
                        <div class="flex items-center gap-3 flex-1">
                            <div class="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors group-hover:bg-gray-300">
                                <span id="arrow-${item.id.replace('.', '-')}" class="transition-transform duration-300">▼</span>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900 text-sm group-hover:text-black transition-colors">${item.id} - ${iL(item,'titulo') || iL(item,'desc')}</p>
                                ${item.old_id ? `<p class="text-[11px] text-gray-500 font-medium mt-0.5">${window.t('item.refOrig')} ${item.old_id}</p>` : ''}
                                <p class="text-xs text-gray-600 font-medium mt-1">${DEC.format(item.cant)} ${item.ud} x ${EUR.format(item.pVenta)}</p>
                            </div>
                        </div>
                        <div class="font-mono font-bold text-gray-700 text-sm">
                            ${EUR.format(item.importeVenta)}
                        </div>
                    </div>
                    <div id="detail-${item.id.replace('.', '-')}" class="item-details">
                        <div class="p-4 bg-gray-50">
                            <h4 class="text-xs font-bold uppercase text-gray-800 mb-3 tracking-widest">${window.t('client.spec')}</h4>
                            <p class="text-sm leading-relaxed text-gray-600">${iL(item,'longDesc') || iL(item,'desc')}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Ítems compactos: bloque unificado sin expand
        if (compactItems.length > 0) {
            compactItems.forEach(item => { totalCEM += item.pCoste * item.cant; totalVenta += item.importeVenta; });
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

    // totalVenta ya incluye GG+BI por partida (con bi_modifier individual si lo hay)
    const baseImponible = totalVenta;
    const totalIVA = baseImponible * IVA;
    const totalPEC = baseImponible + totalIVA;

    // 16/05/2026 18:06 - Eliminada lista de notas importantes de la ficha de cliente; se muestra solo la validez del presupuesto
    html += `
        <div class="mt-8 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
            <p class="text-gray-800 text-sm font-medium flex items-center gap-2">
                <span>⏰</span> ${window.t('client.validity')}
            </p>
        </div>
    `;

    // Resumen Económico Cliente (estilo grid horizontal, fuera del grid principal)
    html += `
        <div class="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">${window.t('client.summary')}</h3>
            <dl class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-gray-500 text-xs uppercase tracking-wider mb-1">${window.t('client.baseImp')}</dt>
                    <dd class="font-bold font-mono text-gray-900 text-lg">${EUR.format(baseImponible)}</dd>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-gray-500 text-xs uppercase tracking-wider mb-1">${IVA === 0 ? 'IVA No incluido' : window.t('client.iva') + ' (' + (IVA * 100) + '%)'}</dt>
                    <dd class="font-bold font-mono text-gray-700 text-lg">${EUR.format(totalIVA)}</dd>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <dt class="text-gray-800 text-xs uppercase tracking-wider mb-1">${window.t('client.total')}</dt>
                    <dd class="font-bold font-mono text-gray-900 text-lg">${EUR.format(totalPEC)}</dd>
                </div>
            </dl>
        </div>

        <div class="mt-8 text-center bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
            <button onclick="descargarExcelConAuth('${currentBudgetId}')"
                class="inline-flex items-center justify-center gap-3 bg-[#107c41] hover:bg-[#185c37] text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-lg text-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                ${window.t('client.download')}
            </button>
            <p class="text-sm text-gray-500 mt-3 max-w-md mx-auto">${window.t('client.downloadDesc')}</p>
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderCostes() {
    if (dataCoste.length === 0) {
        contentArea.innerHTML = `<div class="text-center py-12 text-gray-400"><p>${window.t('nodata.costes')}</p></div>`;
        return;
    }

    let totalGeneral = 0;
    let totalCEM = 0;
    let html = `
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">${window.t('costes.title')}</h2>
                    <p class="text-sm text-gray-500">${window.t('costes.subtitle')}</p>
                </div>
                <div class="text-right text-xs text-gray-400">
                    <p>${window.t('costes.values')}</p>
                    <p>${window.t('costes.ggbi')}</p>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px]">
                    <thead>
                        <tr class="table-header sticky top-0 shadow-sm">
                            <th class="p-3 w-10"></th>
                            <th class="p-3 w-20">${window.t('costes.col.code')}</th>
                            <th class="p-3 text-left">${window.t('costes.col.item')}</th>
                            <th class="p-3 w-20 text-center">${window.t('costes.col.ud')}</th>
                            <th class="p-3 w-24 number">${window.t('costes.col.cant')}</th>
                            <th class="p-3 w-28 number">${window.t('costes.col.unit')}</th>
                            <th class="p-3 w-32 number">${window.t('costes.col.total')}</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
    `;

    const sortedChapters = Object.keys(capitulos).sort();
    for (const capId of sortedChapters) {
        const items = dataCoste.filter(i => i.cap === capId && !i.eliminado);
        if (items.length === 0) continue;

        let capCEM = 0;
        const capTotal = items.reduce((acc, curr) => {
            // Excluir títulos, subtítulos y ocultos del cálculo
            if (curr.tipo === 'titulo' || curr.subtitulo || curr.oculto) return acc;
            const factorMermas = (curr.ud !== 'ud') ? (1 + (mermasPercent / 100)) : 1;
            const factorAjuste2023 = 1 + (ajusteMateriales2023Percent / 100);
            const factorVolatilidad = 1 + (volatilidadPercent / 100);
            const costeMat = (curr.mat || 0) * factorMermas * factorVolatilidad * factorAjuste2023;
            const pCoste = costeMat + (curr.mo || 0);
            const itemBI = beneficioIndustrialPercent + (curr.bi_modifier || 0);
            capCEM += pCoste * (curr.cant || 0);
            return acc + (pCoste * (1 + GG + (itemBI / 100)) * (curr.cant || 0));
        }, 0);
        totalGeneral += capTotal;
        totalCEM += capCEM;

        html += `<tr><td colspan="7" class="table-chapter">${capId}. ${capName(capId)}</td></tr>`;

        items.forEach(item => {
            // Subtítulos y Títulos: fila sin expand, negrita, fondo gris claro (no se pueden desplegar)
            if (item.subtitulo || item.tipo === 'titulo') {
                html += `
                <tr class="bg-gray-50 border-t border-b border-gray-200">
                    <td colspan="7" class="p-2 pl-8">
                        <span class="font-bold text-gray-700 text-xs uppercase tracking-wide">↳ ${item.id} &nbsp;${iL(item,'desc')}</span>
                    </td>
                </tr>`;
                return;
            }

            const factorMermas = (item.ud !== 'ud') ? (1 + (mermasPercent / 100)) : 1;
            const factorAjuste2023 = 1 + (ajusteMateriales2023Percent / 100);
            const factorVolatilidad = 1 + (volatilidadPercent / 100);
            const pCosteUnit = (item.mat * factorMermas * factorVolatilidad * factorAjuste2023) + item.mo;
            const itemBI = beneficioIndustrialPercent + (item.bi_modifier || 0);
            const unitPrice = pCosteUnit * (1 + GG + (itemBI / 100));
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
                        <button onclick="window.promptEditQuantity('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 text-xs shadow-sm border border-blue-200 transition-colors" title="${window.t('costes.editQty')}">${window.t('costes.editQty')}</button>
                        <button onclick="window.promptEditBI('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded text-purple-700 text-xs shadow-sm border border-purple-200 transition-colors" title="${window.t('costes.editBI.title')}">${window.t('costes.editBI.btn')}</button>
                        <button onclick="window.toggleItemVisibility('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs shadow-sm border border-gray-200 transition-colors" title="${isHidden ? window.t('costes.showItem') : window.t('costes.hideItem')}">${isHidden ? window.t('costes.showItem') : window.t('costes.hideItem')}</button>
                        <button onclick="window.deleteItem('${item.cap}', '${item.id}', event)" class="px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-red-700 text-xs shadow-sm border border-red-200 transition-colors ml-auto" title="${window.t('costes.deleteItem.title')}">${window.t('costes.deleteItem')}</button>
                    </div>
                `;
            }
            
            const biModifierText = item.bi_modifier ? `<span class="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded ml-2 font-bold whitespace-nowrap" title="${window.t('costes.biModifier.title')}">BI: ${item.bi_modifier > 0 ? '+' : ''}${item.bi_modifier}%</span>` : '';

            html += `
                <tr class="cost-row ${hiddenClass}" onclick="window.toggleCostRow('${rowId}')" id="tr-${rowId}">
                    <td class="p-3 text-center text-gray-400 font-bold text-lg select-none transition-transform" id="icon-${rowId}">+</td>
                    <td class="p-3 font-mono text-xs text-gray-500">
                        <div class="font-bold text-gray-800">${item.id}</div>
                        ${item.old_id ? `<div class="text-[10px] text-gray-400 mt-1" title="${window.t('item.refOrig')}">${item.old_id}</div>` : ''}
                    </td>
                    <td class="p-3 font-medium text-gray-800">
                        <span style="${hiddenStyle}">${iL(item,'desc')}</span>
                        ${biModifierText}
                        ${isHidden ? `<span class="ml-2 text-xs text-red-600 font-bold uppercase tracking-wider bg-red-100 px-1 py-0.5 rounded">${window.t('costes.hidden')}</span>` : ''}
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
                            <h4 class="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">${window.t('costes.breakdown.netCostLabel')}: ${EUR.format(pCosteUnit)} → ${window.t('costes.breakdown.sellingPrice')}: ${EUR.format(unitPrice)} / ${item.ud}</h4>
                            <table class="w-full text-xs border border-gray-200 bg-white rounded shadow-sm">
                                <thead class="bg-gray-100 text-gray-600 border-b border-gray-200">
                                    <tr>
                                        <th class="p-2 text-left w-20">${window.t('costes.breakdown.type')}</th>
                                        <th class="p-2 text-left">${window.t('costes.breakdown.resource')}</th>
                                        <th class="p-2 text-center w-16">${window.t('costes.breakdown.ud')}</th>
                                        <th class="p-2 text-right w-20">${window.t('costes.breakdown.rend')}</th>
                                        <th class="p-2 text-right w-24">${window.t('costes.breakdown.price')}</th>
                                        <th class="p-2 text-right w-24">${window.t('costes.breakdown.import')}</th>
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

                // Botones editar en descompuesto (solo con descompuesto real, no autogenerado)
                const canEditDesg = window.isEditMode && item.descompuesto && item.descompuesto.length > 0;
                const editRendBtn = canEditDesg && res.type !== 'aux'
                    ? `<button onclick="window.editDescompuestoRend('${item.cap}','${item.id}','${res.code}',event)" class="ml-1 text-[10px] text-orange-400 hover:text-orange-600" title="${window.t('edit.rend')}">✏️</button>`
                    : '';
                const editDesgBtn = canEditDesg
                    ? `<button onclick="window.editDescompuestoPrice('${item.cap}','${item.id}','${res.code}',event)" class="ml-1 text-[10px] text-blue-400 hover:text-blue-600" title="${window.t('edit.price')}">✏️</button>`
                    : '';
                html += `
                    <tr>
                        <td class="p-2"><span class="badge-res ${badgeClass}">${typeLabel}</span></td>
                        <td class="p-2 text-gray-700">${res.desc}</td>
                        <td class="p-2 text-center text-gray-500">${res.ud}</td>
                        <td class="p-2 text-right font-mono text-gray-600">${DEC3.format(res.rend)}${editRendBtn}</td>
                        <td class="p-2 text-right font-mono text-gray-600">${EUR.format(res.price)}${editDesgBtn}</td>
                        <td class="p-2 text-right font-mono font-medium text-gray-800">${EUR.format(importRes)}</td>
                    </tr>
                `;
            });

            html += `
                                </tbody>
                                <tfoot class="bg-gray-50 font-bold text-gray-700 border-t border-gray-200">
                                    <tr>
                                        <td colspan="5" class="p-2 text-right uppercase text-[10px]">${window.t('costes.breakdown.netCost')}</td>
                                        <td class="p-2 text-right text-gray-900">${EUR.format(pCosteUnit)}</td>
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
                    ${window.t('costes.chapterTotal')} ${capName(capId)}
                </td>
                <td class="p-4 number font-bold text-indigo-900 text-lg">
                    ${EUR.format(capTotal)}
                </td>
            </tr>
        `;
    }

    html += `
                    <tr class="bg-gray-50 border-t-4 border-gray-300">
                        <td colspan="6" class="text-right p-6 uppercase tracking-wider text-sm text-gray-500 font-bold">${window.t('costes.totalWithGGBI')}</td>
                        <td class="number p-6 text-3xl font-bold text-gray-800">${EUR.format(totalGeneral)}</td>
                    </tr>
                </tbody>
            </table>

        </div></div>
        
        <!-- Resumen Económico Técnico -->
        <div class="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">${window.t('costes.econ.title')}</h3>
            <dl class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-gray-500 text-xs uppercase tracking-wider mb-1">${window.t('costes.cem')}</dt>
                    <dd class="font-bold font-mono text-gray-900 text-lg">${EUR.format(totalCEM)}</dd>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <dt class="text-gray-600 text-xs uppercase tracking-wider">${window.t('costes.gg')}</dt>
                        <span id="gg-value" class="font-bold text-gray-700">${ggPercent}%</span>
                    </div>
                    <input type="range" id="gg-slider" min="5" max="25" step="1" value="${ggPercent}"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500 mb-2"
                        oninput="updateGGPreview(this.value)"
                        onchange="updateGG(this.value)">
                    <dd class="font-bold font-mono text-gray-700 text-lg">${EUR.format(totalCEM * GG)}</dd>
                    <details class="mt-2">
                        <summary class="text-xs text-gray-400 cursor-pointer hover:text-gray-600">${window.t('costes.gg.help')}</summary>
                        <ul class="mt-2 text-xs text-gray-500 space-y-1 list-disc list-inside">
                            <li>${window.t('costes.gg.help1')}</li>
                            <li>${window.t('costes.gg.help2')}</li>
                            <li>${window.t('costes.gg.help3')}</li>
                            <li>${window.t('costes.gg.help4')}</li>
                        </ul>
                    </details>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <dt class="text-gray-600 text-xs uppercase tracking-wider">${window.t('costes.bi')}</dt>
                        <span id="bi-value" class="font-bold text-gray-700">${beneficioIndustrialPercent}%</span>
                    </div>
                    <input type="range" id="bi-slider" min="0" max="50" step="1" value="${beneficioIndustrialPercent}"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500 mb-2"
                        oninput="updateBIPreview(this.value)"
                        onchange="updateBI(this.value)">
                    <dd class="font-bold font-mono text-gray-800 text-lg">${EUR.format(totalGeneral - totalCEM * (1 + GG))}</dd>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-300">
                    <dt class="text-gray-900 text-xs uppercase tracking-wider mb-1">${window.t('costes.baseImp')}</dt>
                    <dd class="font-bold font-mono text-black text-lg">${EUR.format(totalGeneral)}</dd>
                </div>
            </dl>
        </div>
        <p class="mt-6 text-xs italic text-gray-400 text-right px-1">
            ${IVA === 0.10 ? window.t('costes.iva.reduced') : window.t('costes.iva.general')}
        </p>

        ${currentBudgetId === '5viviendas' ? `
        <!-- Nota de competitividad — solo para 5viviendas -->
        <div class="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div class="flex items-center gap-3 bg-gray-50 border-b border-gray-200 px-5 py-3">
                <span class="text-base">📊</span>
                <h4 class="text-xs font-bold uppercase tracking-widest text-gray-700">${window.t('costes.comp.title')}</h4>
            </div>
            <div class="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                    <p class="font-semibold text-gray-800 mb-1">${window.t('costes.comp.notes.title')}</p>
                    <ul class="space-y-2 mt-2 list-disc list-inside text-gray-600">
                        <li>${window.t('costes.comp.notes.1')}</li>
                        <li>${window.t('costes.comp.notes.2')}</li>
                        <li>${window.t('costes.comp.notes.3')}</li>
                    </ul>
                </div>
                <div>
                    <p class="font-semibold text-gray-800 mb-1">${window.t('costes.comp.market.title')}</p>
                    <ul class="space-y-1">
                        <li>${window.t('costes.comp.market.1')}</li>
                        <li>${window.t('costes.comp.market.2')}</li>
                        <li>${window.t('costes.comp.market.3')}</li>
                        <li>${window.t('costes.comp.market.4')}</li>
                    </ul>
                </div>
            </div>
            <div class="bg-amber-50 border-t border-amber-100 px-5 py-2">
                <p class="text-xs text-amber-800">${window.t('costes.comp.internal')}</p>
            </div>
        </div>` : ''}
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

function _getMOPrice(codigo) {
    for (const item of dataCoste) {
        if (!item.descompuesto) continue;
        const mo = item.descompuesto.find(d => d.tipo === 'mo' && d.codigo === codigo);
        if (mo) return mo.precio;
    }
    return codigo === 'MO01' ? 37.83 : 31.98;
}

function _renderMOSection() {
    // Leer oficios dinámicamente del dataMaterial del presupuesto cargado
    const moItems = dataMaterial.filter(d => d.tipo === 'mo');

    if (moItems.length > 0) {
        // Presupuesto con oficios definidos en dataMaterial (ej. Anne Becher)
        // 19/05/2026 17:30 - añadidos botones de edición por oficio cuando isEditMode está activo
        const icons = { mo: '👷', aux: '🔧', maq: '🚜' };
        let rows = moItems.map(mo => {
            const editBtn = window.isEditMode
                ? `<button onclick="window.editMOPrice('${mo.id}',event)" class="ml-2 px-2 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs rounded border border-orange-200 transition-colors flex-shrink-0" title="${window.t('edit.rate')} ${mo.id}">${window.t('mo.edit')}</button>`
                : '';
            return `
            <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-orange-100">
                <span class="text-orange-400 text-base">${icons.mo}</span>
                <span class="font-mono text-[11px] text-gray-400 w-14 flex-shrink-0">${mo.id}</span>
                <span class="text-gray-700 font-medium text-sm">${iL(mo, 'desc')}</span>
                <span class="font-mono font-bold text-gray-900 ml-auto whitespace-nowrap">${EUR.format(mo.precio)}/${mo.ud}</span>
                ${editBtn}
            </div>
        `;
        }).join('');
        const editHint = window.isEditMode
            ? `<p class="text-xs text-orange-500 mt-2 font-medium">${window.t('mo.editHint')}</p>`
            : '';
        return `
            <div class="mt-4 p-4 rounded-xl border border-orange-200 bg-orange-50">
                <h4 class="text-xs font-bold uppercase tracking-widest text-orange-700 mb-3">${window.t('mo.title')}</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    ${rows}
                </div>
                <p class="text-xs text-orange-600 mt-3 italic">${window.t('mo.note')}</p>
                ${editHint}
            </div>
        `;
    }

    // Fallback para presupuestos sin tipo:mo en dataMaterial (ej. 5viviendas)
    const mo01 = _getMOPrice('MO01');
    const mo02 = _getMOPrice('MO02');
    const editMO01 = window.isEditMode
        ? `<button onclick="window.editMOPrice('MO01',event)" class="ml-2 px-2 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs rounded border border-orange-200 transition-colors" title="${window.t('edit.rate')} MO01">${window.t('mo.edit')}</button>`
        : '';
    const editMO02 = window.isEditMode
        ? `<button onclick="window.editMOPrice('MO02',event)" class="ml-2 px-2 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs rounded border border-orange-200 transition-colors" title="${window.t('edit.rate')} MO02">${window.t('mo.edit')}</button>`
        : '';
    return `
        <div class="mt-4 p-4 rounded-xl border border-orange-200 bg-orange-50">
            <h4 class="text-xs font-bold uppercase tracking-widest text-orange-700 mb-3">${window.t('mo.title.fallback')}</h4>
            <div class="flex flex-col sm:flex-row gap-3 text-sm">
                <div class="flex items-center gap-2 flex-1 bg-white rounded-lg px-3 py-2 border border-orange-100">
                    <span class="text-orange-400 text-base">👷</span>
                    <span class="text-gray-700 font-medium">${window.t('mo.official')}</span>
                    <span class="font-mono font-bold text-gray-900 ml-auto">${EUR.format(mo01)}/h</span>
                    ${editMO01}
                </div>
                <div class="flex items-center gap-2 flex-1 bg-white rounded-lg px-3 py-2 border border-orange-100">
                    <span class="text-orange-400 text-base">🔧</span>
                    <span class="text-gray-700 font-medium">${window.t('mo.auxiliary')}</span>
                    <span class="font-mono font-bold text-gray-900 ml-auto">${EUR.format(mo02)}/h</span>
                    ${editMO02}
                </div>
            </div>
            <p class="text-xs text-orange-600 mt-2 italic">${window.t('mo.note')}</p>
        </div>
    `;
}

function renderMateriales() {
    if (dataMaterial.length === 0) {
        contentArea.innerHTML = `<div class="text-center py-12 text-gray-400"><p>${window.t('mat.noData')}</p></div>`;
        return;
    }

    // const factorMermas = 1 + (mermasPercent / 100); // Moved to individual item check
    let totalMateriales = 0;
    let totalConMermas = 0;

    let tableHtml = `
        <div class="summary-card">
            <h2 class="text-xl font-bold mb-2 text-gray-800">${window.t('mat.title')}</h2>
            <p class="mb-4 text-sm text-gray-500">${window.t('mat.subtitle')}</p>
            
            <!--Slider de Volatilidad-->
            <!--Slider de Volatilidad-->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 text-lg flex-shrink-0">
                        📈
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800">${window.t('mat.vol.title')}</h3>
                        <p class="text-xs text-gray-500">${window.t('mat.vol.desc')}</p>
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
                        <h3 class="font-bold text-gray-800">${window.t('mat.mermas.title')}</h3>
                        <p class="text-xs text-gray-500">${window.t('mat.mermas.desc')}</p>
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
                        <th class="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-28">${window.t('mat.col.code')}</th>
                        <th class="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">${window.t('mat.col.material')}</th>
                        <th class="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-14">${window.t('mat.col.ud')}</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-20">${window.t('mat.col.cantBase')}</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">${window.t('mat.col.cantMermas')}</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">${window.t('mat.col.pvp')}</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">${window.t('mat.col.neto')}</th>
                        <th class="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-28 bg-gray-100">${window.t('mat.col.total')}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
    `;

    dataMaterial.forEach(item => {
        // Entradas de mano de obra: se muestran en el bloque inferior, no en la tabla de materiales
        if (item.tipo === 'mo') return;

        if (item.tipo === 'titulo') {
            const isCapitulo = (item.desc || '').toUpperCase().startsWith('CAP');
            const titleLabel = iL(item, 'desc');
            if (isCapitulo) {
                // Capítulo principal
                tableHtml += `
                    <tr class="bg-indigo-50 border-t border-b border-indigo-200">
                        <td colspan="8" class="p-2 pl-4">
                            <div class="font-bold text-indigo-800 uppercase tracking-widest text-sm flex items-center gap-2">
                                <span class="text-indigo-400">📘</span> ${titleLabel}
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
                                <span class="text-gray-400">↳</span> ${titleLabel}
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

        const editPrecioBtn = window.isEditMode
            ? `<button onclick="event.stopPropagation();window.editMaterialPrice('${item.id}',event)" class="ml-1 text-blue-400 hover:text-blue-600 text-xs leading-none" title="${window.t('edit.basePrice')}">✏️</button>`
            : '';
        const editCantBtn = window.isEditMode
            ? `<button onclick="event.stopPropagation();window.editMaterialCant('${item.id}',event)" class="ml-1 text-blue-400 hover:text-blue-600 text-xs leading-none" title="${window.t('edit.qty')}">✏️</button>`
            : '';
        tableHtml += `
            <tr class="hover:bg-gray-50">
                <td class="p-3 font-mono text-xs text-gray-600 bg-gray-50">${item.id}</td>
                <td class="p-3 font-medium text-gray-800">
                    ${item.url ? `<a href="${item.url}" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
                        ${iL(item, 'desc')}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>` : iL(item, 'desc')}
                    ${item.ref_proveedor ? `<div class="text-[10px] text-gray-500 mt-1 font-mono">${window.t('item.refProv')} ${item.ref_proveedor}</div>` : ''}
                </td>
                <td class="p-3 text-center text-xs text-gray-500">${item.ud || '-'}</td>
                <td class="p-3 number text-gray-500">${DEC.format(cantBase)}${editCantBtn}</td>
                <td class="p-3 number font-bold ${mermasPercent > 0 && factorMermas > 1 ? 'text-gray-900 bg-gray-100' : 'text-gray-700'}">${DEC.format(cantConMermas)}</td>
                <td class="p-3 number text-gray-500">${item.pvp ? EUR.format(item.pvp) : '-'}</td>
                <td class="p-3 number ${volatilidadPercent !== 0 ? 'text-gray-800 font-medium' : 'text-gray-600'}">${precioUnitarioAjustado === 0 ? `<span class="text-red-500 text-xs uppercase font-bold">${window.t('mat.excluded')}</span>` : EUR.format(precioUnitarioAjustado)}${editPrecioBtn}</td>
                <td class="p-3 number font-bold text-gray-900 bg-gray-100">${precioConMermas === 0 ? `<span class="text-red-500 text-xs uppercase font-bold">${window.t('mat.excluded')}</span>` : EUR.format(precioConMermas)}</td>
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
                            <span class="text-xs uppercase tracking-wider">${window.t('mat.baseCost')}</span>
                        </td>
                        <td class="p-3 number font-bold">${EUR.format(totalMateriales)}</td>
                    </tr>
                    <tr class="bg-gray-100 text-gray-800">
                        <td colspan="7" class="p-3 text-right font-medium">
                            <span class="text-xs uppercase tracking-wider">${window.t('mat.wasteAdj')} (${mermasPercent}%)</span>
                        </td>
                        <td class="p-3 number font-bold text-gray-700">+${EUR.format(diferenciaMermas)}</td>
                    </tr>
                    ` : ''}
                    <tr class="bg-black text-white">
                        <td colspan="7" class="p-4 text-right font-bold uppercase tracking-wider">${window.t('mat.total')}</td>
                        <td class="p-4 number text-xl font-extrabold text-white">${EUR.format(totalConMermas)}</td>
                    </tr>
                </tfoot>
            </table>
            </div>
        </div>
        ${_renderMOSection()}
        ${currentBudgetId === '5viviendas' ? `
        <div class="mt-6 p-5 rounded-lg border" style="background:#FFFBF2; border-color:#D4BA8A;">
            <h4 class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#B08D57;">${window.t('notes.supplier.title')}</h4>
            <ul class="text-xs space-y-1" style="color:#334155; line-height:1.7;">
                <li>${window.t('mat.supplier.1')}</li>
                <li>${window.t('mat.supplier.2')}</li>
                <li>${window.t('mat.supplier.3')}</li>
                <li>${window.t('mat.supplier.4')}</li>
            </ul>
            <p class="mt-3 text-xs italic" style="color:#94A3B8;">${window.t('notes.supplier.footer')}</p>
        </div>` : ''}
        <!-- 16/05/2026 18:06 - Nota descuentos de proveedor restringida a 5viviendas -->
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

    // 19/05/2026 18:25 - El editor-toolbar (botones Restaurar/Editar) ahora SIEMPRE está visible
    // junto al selector de idioma en la barra fija; ya no se oculta al cambiar de pestaña.
    // Si el usuario está en Ficha Cliente y activa modo edición, los controles de edición no
    // aparecerán hasta que cambie a Costes o Materiales (es comportamiento natural).

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
// La contraseña del prompt (D3mo) se usa para autenticar
// la sesión PHP que protege el endpoint de descarga. 19/05/2026 17:25 - actualizado de Ib1za a D3mo
// ==========================================
window.descargarExcelConAuth = async function(budgetId) {
    const p = prompt('Ingrese contraseña para generar y descargar Excel:');
    if (p === null) return;                       // usuario canceló
    if (p !== 'Reformaselmanitas.') {             // 11/06/2026 - contraseña actualizada
        alert('❌ Contraseña incorrecta');
        return;
    }

    // Activar sesión PHP con la contraseña del servidor
    try {
        const res = await fetch('auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'Reformaselmanitas.' }), // 11/06/2026 - contraseña actualizada
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
