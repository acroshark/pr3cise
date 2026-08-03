<?php
// 06/05/2026 19:35 - Generador XLSX completo: Ficha Cliente, Precios Descompuestos, Materiales + Logo
// 06/05/2026 19:58 - Reemplazado ZipArchive por ejecución de script Python con xlsxwriter

session_start();
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    exit('Acceso no autorizado');
}

$scriptPath = __DIR__ . DIRECTORY_SEPARATOR . 'generar_excel_juandeborbon.py';

// Usar ruta temporal para evitar conflictos con el archivo fijo (p.ej. abierto en Excel)
$outputFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'presupuesto_jdb_' . uniqid() . '.xlsx';

// Buscar Python 3.6+ (necesario para f-strings). Probar python3 primero.
$pythonCmd = null;
foreach (['python3', 'python3.12', 'python3.11', 'python3.10', 'python3.9', 'python3.8', 'python3.7', 'python3.6', 'python', 'py'] as $cmd) {
    $test = @shell_exec($cmd . ' --version 2>&1');
    if ($test && preg_match('/Python (\d+)\.(\d+)/', $test, $m)) {
        $major = (int)$m[1];
        $minor = (int)$m[2];
        if ($major > 3 || ($major === 3 && $minor >= 6)) {
            $pythonCmd = $cmd;
            break;
        }
    }
}
if (!$pythonCmd) {
    exit('Error: No se encontró Python 3.6+ en el servidor. Versiones detectadas: ' .
         implode(', ', array_filter(array_map(fn($c) => ($v = @shell_exec($c . ' --version 2>&1')) ? "$c: $v" : null,
         ['python', 'python3', 'py']))));
}

// Asegurar que xlsxwriter está instalado (se instala si falta, sin necesidad de SSH)
$checkXlsx = @shell_exec($pythonCmd . ' -c "import xlsxwriter" 2>&1');
if ($checkXlsx !== '') {
    // No está instalado — intentar instalarlo
    @shell_exec($pythonCmd . ' -m pip install xlsxwriter --user --quiet 2>&1');
}

// Ejecutar script pasando la ruta temporal como argumento
$cmd    = $pythonCmd . ' ' . escapeshellarg($scriptPath) . ' ' . escapeshellarg($outputFile) . ' 2>&1';
$output = []; $code = 0;
exec($cmd, $output, $code);

if ($code !== 0 || !file_exists($outputFile)) {
    exit('Error al generar Excel (código ' . $code . '):<br>' . nl2br(htmlspecialchars(implode("\n", $output))));
}

// Servir el archivo y eliminarlo tras la descarga
$filename = 'Presupuesto_JuandeBorbon_' . date('Ymd') . '.xlsx';
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: max-age=0');
header('Content-Length: ' . filesize($outputFile));
readfile($outputFile);
@unlink($outputFile);
exit;


// ── Everything below is the old ZipArchive implementation (kept for reference) ──
// ── It is never reached. ──
if (false) {

// ─────────────────────────────────────────────────────────
// 1. CARGA DE DATOS
// ─────────────────────────────────────────────────────────
$jsonPath = __DIR__ . '/partidas/juandeborbon.json';
$data     = json_decode(file_get_contents($jsonPath), true);

$GG        = (float)$data['config']['GG'];
$BI        = (float)$data['config']['BI'];
$IVA       = (float)$data['config']['IVA'];
$capitulos = $data['capitulos'];
$dataCoste = $data['dataCoste'];
$dataMat   = $data['dataMaterial'];
$info      = $data['info'];

$logoFile  = __DIR__ . '/logo/logo.png';
$hasLogo   = file_exists($logoFile);

// ─────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────
function xe($s) { return htmlspecialchars((string)$s, ENT_XML1 | ENT_QUOTES, 'UTF-8'); }
function n2($v) { return number_format((float)$v, 2, '.', ''); }
function n3($v) { return number_format((float)$v, 3, '.', ''); }
function col2l($n) {
    $r = '';
    for ($n++; $n > 0; $n = intdiv($n, 26))
        $r = chr(65 + ($n - 1) % 26) . $r;
    return $r;
}
function cref($c, $r) { return col2l($c) . $r; }

// ─────────────────────────────────────────────────────────
// 3. SHARED STRINGS (global, populated by buildSheetXml)
// ─────────────────────────────────────────────────────────
$SS  = [];
$SSI = [];
function addSS($s) {
    global $SS, $SSI;
    $s = (string)$s;
    if (!isset($SSI[$s])) { $SSI[$s] = count($SS); $SS[] = $s; }
    return $SSI[$s];
}

// ─────────────────────────────────────────────────────────
// 4. STYLE INDEX CONSTANTS
// ─────────────────────────────────────────────────────────
define('S_NORMAL',    0);
define('S_HDR_DARK',  1);
define('S_CHAPTER',   2);
define('S_BOLD',      3);
define('S_EUR',       4);
define('S_EUR_BOLD',  5);
define('S_TITLE',     6);
define('S_GRAY',      7);
define('S_TOTAL',     8);
define('S_TOTAL_TXT', 9);
define('S_EUR_GRAY', 10);
define('S_CTR',      11);
define('S_DEC3',     12);
define('S_SMALL',    13);

// ─────────────────────────────────────────────────────────
// 5. SHEET DATA BUILDERS
// Returns array of rows; each row = array of cell arrays:
//   ['v'=>value, 's'=>styleId, 't'=>'s'|'n'|'', 'merge'=>extraCols]
// ─────────────────────────────────────────────────────────

function c($v, $s, $t = 's', $merge = 0) {
    return ['v' => $v, 's' => $s, 't' => $t, 'merge' => $merge];
}
function cn($v, $s) { return ['v' => (float)$v, 's' => $s, 't' => 'n', 'merge' => 0]; }
function ce($s_id) { return ['v' => '', 's' => $s_id, 't' => '', 'merge' => 0]; }

function emptyRow($n) { return array_fill(0, $n, ce(S_NORMAL)); }

// ── Sheet 1: Ficha Cliente ────────────────────────────────
function buildSheet1($data, $GG, $BI, $IVA, $hasLogo) {
    $info      = $data['info'];
    $capitulos = $data['capitulos'];
    $dataCoste = $data['dataCoste'];
    $NCOLS = 6;
    $rows  = [];

    // Rows 1-4 reserved for logo image overlay
    if ($hasLogo) {
        for ($i = 0; $i < 4; $i++) $rows[] = emptyRow($NCOLS);
    }

    // Title block
    $rows[] = [c('PRESUPUESTO — ' . strtoupper($info['titulo']), S_TITLE, 's', 5),
               ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE)];
    $rows[] = [c($info['descripcion'], S_NORMAL, 's', 3),
               ce(S_NORMAL), ce(S_NORMAL), ce(S_NORMAL),
               c('Referencia:', S_BOLD), c($info['referencia'], S_NORMAL)];
    $rows[] = [c('Ubicación: ' . $info['ubicacion'], S_SMALL, 's', 5),
               ce(S_SMALL), ce(S_SMALL), ce(S_SMALL), ce(S_SMALL), ce(S_SMALL)];
    $rows[] = emptyRow($NCOLS);

    // Header
    $rows[] = [c('Código', S_HDR_DARK), c('Descripción', S_HDR_DARK),
               c('Ud', S_HDR_DARK), c('Cantidad', S_HDR_DARK),
               c('Precio Unit. (€)', S_HDR_DARK), c('Importe (€)', S_HDR_DARK)];

    $ksorted = array_keys($capitulos); sort($ksorted);
    $grandTotal = 0.0;

    foreach ($ksorted as $capId) {
        $capName = $capitulos[$capId];
        $items = array_values(array_filter($dataCoste, fn($i) =>
            $i['cap'] === $capId &&
            ($i['tipo'] ?? '') !== 'titulo' &&
            !($i['subtitulo'] ?? false)
        ));
        if (!$items) continue;

        // Chapter row
        $rows[] = [c($capId . '. ' . strtoupper($capName), S_CHAPTER, 's', 5),
                   ce(S_CHAPTER), ce(S_CHAPTER), ce(S_CHAPTER), ce(S_CHAPTER), ce(S_CHAPTER)];

        $capTotal = 0.0;
        foreach ($items as $item) {
            $factorMermas = ($item['ud'] !== 'ud') ? 1.05 : 1.0;
            $costeMat     = ($item['mat'] ?? 0) * $factorMermas;
            $pCoste       = $costeMat + ($item['mo'] ?? 0);
            $pVenta       = $pCoste * (1 + $GG + $BI);
            $importe      = $pVenta * ($item['cant'] ?? 0);
            $capTotal    += $importe;
            $grandTotal  += $importe;

            $rows[] = [
                c($item['id'], S_GRAY),
                c($item['titulo'] ?? $item['desc'], S_NORMAL),
                c($item['ud'], S_CTR),
                cn(n2($item['cant']), S_EUR),
                cn(n2($pVenta), S_EUR),
                cn(n2($importe), S_EUR_BOLD),
            ];
        }

        $rows[] = [ce(S_TOTAL_TXT),
                   c('TOTAL ' . strtoupper($capName), S_TOTAL_TXT, 's', 3),
                   ce(S_TOTAL_TXT), ce(S_TOTAL_TXT), ce(S_TOTAL_TXT),
                   cn(n2($capTotal), S_TOTAL)];
    }

    // Economic summary
    $baseImponible = $grandTotal;
    $totalIVA      = $baseImponible * $IVA;
    $totalPEC      = $baseImponible + $totalIVA;

    $rows[] = emptyRow($NCOLS);
    $rows[] = [c('RESUMEN ECONÓMICO', S_TITLE, 's', 5),
               ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE)];
    $rows[] = [c('Base Imponible (sin IVA)', S_BOLD, 's', 4),
               ce(S_BOLD), ce(S_BOLD), ce(S_BOLD), ce(S_BOLD),
               cn(n2($baseImponible), S_EUR_BOLD)];
    $rows[] = [c('IVA (' . ($IVA * 100) . '%)', S_NORMAL, 's', 4),
               ce(S_NORMAL), ce(S_NORMAL), ce(S_NORMAL), ce(S_NORMAL),
               cn(n2($totalIVA), S_EUR)];
    $rows[] = [c('TOTAL PRESUPUESTO CON IVA', S_TOTAL_TXT, 's', 4),
               ce(S_TOTAL_TXT), ce(S_TOTAL_TXT), ce(S_TOTAL_TXT), ce(S_TOTAL_TXT),
               cn(n2($totalPEC), S_TOTAL)];

    return $rows;
}

// ── Sheet 2: Precios Descompuestos ────────────────────────
function buildSheet2($data, $GG, $BI) {
    $capitulos = $data['capitulos'];
    $dataCoste = $data['dataCoste'];
    $NCOLS = 7;
    $rows  = [];

    $rows[] = [c('CUADRO DE PRECIOS DESCOMPUESTOS', S_TITLE, 's', 6),
               ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE)];
    $rows[] = emptyRow($NCOLS);
    $rows[] = [c('Tipo', S_HDR_DARK), c('Código', S_HDR_DARK),
               c('Recurso / Concepto', S_HDR_DARK), c('Ud', S_HDR_DARK),
               c('Rendim.', S_HDR_DARK), c('Precio Unit.', S_HDR_DARK), c('Importe', S_HDR_DARK)];

    $ksorted = array_keys($capitulos); sort($ksorted);

    foreach ($ksorted as $capId) {
        $capName = $capitulos[$capId];
        $items = array_values(array_filter($dataCoste, fn($i) =>
            $i['cap'] === $capId &&
            ($i['tipo'] ?? '') !== 'titulo' &&
            !($i['subtitulo'] ?? false)
        ));
        if (!$items) continue;

        $rows[] = [c($capId . '. ' . strtoupper($capName), S_CHAPTER, 's', 6),
                   ce(S_CHAPTER), ce(S_CHAPTER), ce(S_CHAPTER),
                   ce(S_CHAPTER), ce(S_CHAPTER), ce(S_CHAPTER)];

        foreach ($items as $item) {
            $factorMermas = ($item['ud'] !== 'ud') ? 1.05 : 1.0;
            $costeMat     = ($item['mat'] ?? 0) * $factorMermas;
            $unitPrice    = $costeMat + ($item['mo'] ?? 0);
            $totalPrice   = $unitPrice * ($item['cant'] ?? 0);

            // Item header
            $rows[] = [
                ce(S_BOLD),
                c($item['id'], S_BOLD),
                c($item['titulo'] ?? $item['desc'], S_BOLD, 's', 2),
                ce(S_BOLD),
                cn(n2($item['cant']), S_EUR),
                cn(n2($unitPrice), S_EUR),
                cn(n2($totalPrice), S_EUR_BOLD),
            ];

            // Descompuesto lines
            if (!empty($item['descompuesto'])) {
                $typeMap = ['mo' => 'MO', 'mat' => 'MAT', 'aux' => '%', 'maq' => 'MQ'];
                foreach ($item['descompuesto'] as $d) {
                    $imp       = ($d['tipo'] === 'aux') ? $d['precio'] : ((float)$d['rend'] * (float)$d['precio']);
                    $typeLabel = $typeMap[$d['tipo']] ?? $d['tipo'];
                    $rows[] = [
                        c($typeLabel, S_SMALL),
                        c($d['codigo'], S_SMALL),
                        c($d['desc'], S_NORMAL, 's', 1),
                        c($d['ud'], S_CTR),
                        cn(n3($d['rend']), S_DEC3),
                        cn(n2($d['precio']), S_EUR),
                        cn(n2($imp), S_EUR),
                    ];
                }
            }

            // Subtotal line
            $rows[] = [
                ce(S_EUR_GRAY), ce(S_EUR_GRAY),
                c('Coste Directo Unitario / ' . $item['ud'], S_SMALL, 's', 3),
                ce(S_EUR_GRAY), ce(S_EUR_GRAY),
                cn(n2($unitPrice), S_EUR_GRAY),
                cn(n2($totalPrice), S_EUR_GRAY),
            ];
        }
    }

    return $rows;
}

// ── Sheet 3: Materiales ───────────────────────────────────
function buildSheet3($data) {
    $dataMat = $data['dataMaterial'];
    $NCOLS   = 7;
    $rows    = [];

    $rows[] = [c('LISTADO DE MATERIALES', S_TITLE, 's', 6),
               ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE), ce(S_TITLE)];
    $rows[] = emptyRow($NCOLS);
    $rows[] = [c('Código', S_HDR_DARK), c('Material', S_HDR_DARK),
               c('Ud', S_HDR_DARK), c('Cant. Base', S_HDR_DARK),
               c('Cant. +Mermas', S_HDR_DARK), c('PVP', S_HDR_DARK), c('Neto', S_HDR_DARK)];

    $totalBase   = 0.0;
    $totalMermas = 0.0;

    foreach ($dataMat as $item) {
        if (($item['tipo'] ?? '') === 'titulo') {
            $isCap = stripos($item['desc'] ?? '', 'CAP') === 0;
            $s = $isCap ? S_CHAPTER : S_BOLD;
            $rows[] = [c($item['desc'], $s, 's', 6),
                       ce($s), ce($s), ce($s), ce($s), ce($s), ce($s)];
            continue;
        }

        $cant        = (float)($item['cant'] ?? 0);
        $factor      = ($item['ud'] !== 'ud') ? 1.05 : 1.0;
        $cantMermas  = $cant * $factor;
        $precio      = (float)($item['precio'] ?? 0);
        $pvp         = (float)($item['pvp'] ?? 0);
        $totalBase   += $precio * $cant;
        $totalMermas += $precio * $cantMermas;

        $neto_cell = $precio > 0
            ? cn(n2($precio), S_EUR)
            : c('Excluido', S_SMALL, 's', 0);
        $pvp_cell  = $pvp > 0 ? cn(n2($pvp), S_EUR) : ce(S_NORMAL);

        $rows[] = [
            c($item['id'], S_GRAY),
            c($item['desc'], S_NORMAL),
            c($item['ud'] ?? '-', S_CTR),
            cn(n2($cant), S_EUR),
            cn(n2($cantMermas), S_EUR_BOLD),
            $pvp_cell,
            $neto_cell,
        ];
    }

    $rows[] = emptyRow($NCOLS);
    $diferencia = $totalMermas - $totalBase;
    $rows[] = [c('Coste base materiales', S_BOLD, 's', 5),
               ce(S_BOLD), ce(S_BOLD), ce(S_BOLD), ce(S_BOLD), ce(S_BOLD),
               cn(n2($totalBase), S_EUR_BOLD)];
    $rows[] = [c('+ Ajuste mermas (5%)', S_NORMAL, 's', 5),
               ce(S_NORMAL), ce(S_NORMAL), ce(S_NORMAL), ce(S_NORMAL), ce(S_NORMAL),
               cn(n2($diferencia), S_EUR)];
    $rows[] = [c('TOTAL MATERIALES (con mermas 5%)', S_TOTAL_TXT, 's', 5),
               ce(S_TOTAL_TXT), ce(S_TOTAL_TXT), ce(S_TOTAL_TXT), ce(S_TOTAL_TXT), ce(S_TOTAL_TXT),
               cn(n2($totalMermas), S_TOTAL)];

    return $rows;
}

// ─────────────────────────────────────────────────────────
// 6. XML BUILDERS
// ─────────────────────────────────────────────────────────

function buildSheetXml($rows, $colWidths = [], $hasDrawing = false) {
    $xml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    $ns   = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
    $nsr  = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
    $xml .= $hasDrawing ? "<worksheet $ns $nsr>" : "<worksheet $ns>";

    if ($colWidths) {
        $xml .= '<cols>';
        foreach ($colWidths as $i => $w)
            $xml .= '<col min="' . ($i+1) . '" max="' . ($i+1) . '" width="' . $w . '" customWidth="1"/>';
        $xml .= '</cols>';
    }

    $merges = [];
    $xml .= '<sheetData>';
    foreach ($rows as $ri => $row) {
        $rowNum = $ri + 1;
        if (empty($row)) { $xml .= "<row r=\"$rowNum\"/>"; continue; }
        $xml .= "<row r=\"$rowNum\">";
        foreach ($row as $ci => $cell) {
            $cr  = cref($ci, $rowNum);
            $v   = $cell['v'] ?? '';
            $s   = (int)($cell['s'] ?? 0);
            $t   = $cell['t'] ?? '';
            $mg  = (int)($cell['merge'] ?? 0);
            if ($mg > 0)
                $merges[] = $cr . ':' . cref($ci + $mg, $rowNum);
            if ($v === '' || $v === null) {
                $xml .= "<c r=\"$cr\" s=\"$s\"/>";
                continue;
            }
            if ($t === 'n') {
                $xml .= "<c r=\"$cr\" s=\"$s\" t=\"n\"><v>" . xe($v) . "</v></c>";
            } else {
                $idx = addSS((string)$v);
                $xml .= "<c r=\"$cr\" s=\"$s\" t=\"s\"><v>$idx</v></c>";
            }
        }
        $xml .= '</row>';
    }
    $xml .= '</sheetData>';

    if ($merges) {
        $xml .= '<mergeCells count="' . count($merges) . '">';
        foreach ($merges as $m) $xml .= "<mergeCell ref=\"$m\"/>";
        $xml .= '</mergeCells>';
    }
    if ($hasDrawing) $xml .= '<drawing r:id="rId1"/>';
    $xml .= '</worksheet>';
    return $xml;
}

function buildStylesXml() {
    $xml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    $xml .= '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

    $xml .= '<numFmts count="2">'
          . '<numFmt numFmtId="164" formatCode="#,##0.00\ &quot;€&quot;"/>'
          . '<numFmt numFmtId="165" formatCode="#,##0.000"/>'
          . '</numFmts>';

    // fonts: 0=normal 1=bold 2=big-bold 3=white-bold 4=small-gray 5=white-bold-total
    $xml .= '<fonts count="6">'
          . '<font><sz val="11"/><name val="Calibri"/></font>'
          . '<font><b/><sz val="11"/><name val="Calibri"/></font>'
          . '<font><b/><sz val="13"/><name val="Calibri"/></font>'
          . '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'
          . '<font><sz val="9"/><color rgb="FF6B7280"/><name val="Calibri"/></font>'
          . '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'
          . '</fonts>';

    // fills: 0=none 1=gray125(req) 2=dark-hdr 3=chapter 4=light-gray 5=total-dark 6=gold
    $xml .= '<fills count="7">'
          . '<fill><patternFill patternType="none"/></fill>'
          . '<fill><patternFill patternType="gray125"/></fill>'
          . '<fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/></patternFill></fill>'
          . '<fill><patternFill patternType="solid"><fgColor rgb="FFE5E7EB"/></patternFill></fill>'
          . '<fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/></patternFill></fill>'
          . '<fill><patternFill patternType="solid"><fgColor rgb="FF374151"/></patternFill></fill>'
          . '<fill><patternFill patternType="solid"><fgColor rgb="FFB08D57"/></patternFill></fill>'
          . '</fills>';

    $thin = '<left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right>'
          . '<top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/>';
    $xml .= '<borders count="2">'
          . '<border><left/><right/><top/><bottom/><diagonal/></border>'
          . '<border>' . $thin . '</border>'
          . '</borders>';

    $xml .= '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';

    $aR  = '<alignment horizontal="right"/>';
    $aCt = '<alignment horizontal="center" vertical="center" wrapText="1"/>';
    $aW  = '<alignment wrapText="1" vertical="center"/>';
    $aVc = '<alignment vertical="center"/>';

    $xml .= '<cellXfs>'
    // 0: S_NORMAL
          . '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
    // 1: S_HDR_DARK
          . '<xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' . $aCt . '</xf>'
    // 2: S_CHAPTER
          . '<xf numFmtId="0" fontId="1" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">' . $aVc . '</xf>'
    // 3: S_BOLD
          . '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
    // 4: S_EUR
          . '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1">' . $aR . '</xf>'
    // 5: S_EUR_BOLD
          . '<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1" applyAlignment="1">' . $aR . '</xf>'
    // 6: S_TITLE (gold bg, big bold)
          . '<xf numFmtId="0" fontId="2" fillId="6" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">' . $aW . '</xf>'
    // 7: S_GRAY (light gray bg, small font)
          . '<xf numFmtId="0" fontId="4" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
    // 8: S_TOTAL (dark bg, white bold, currency)
          . '<xf numFmtId="164" fontId="5" fillId="5" borderId="0" xfId="0" applyFont="1" applyFill="1" applyNumberFormat="1" applyAlignment="1">' . $aR . '</xf>'
    // 9: S_TOTAL_TXT (dark bg, white bold, text)
          . '<xf numFmtId="0" fontId="5" fillId="5" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">' . $aVc . '</xf>'
    // 10: S_EUR_GRAY (light gray bg, currency)
          . '<xf numFmtId="164" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyNumberFormat="1" applyAlignment="1">' . $aR . '</xf>'
    // 11: S_CTR (bold centered)
          . '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center"/></xf>'
    // 12: S_DEC3 (3-decimal right)
          . '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1">' . $aR . '</xf>'
    // 13: S_SMALL (small gray text)
          . '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
          . '</cellXfs>';

    $xml .= '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>';
    $xml .= '</styleSheet>';
    return $xml;
}

function buildSharedStringsXml() {
    global $SS;
    $count = count($SS);
    $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    $xml .= '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
          . ' count="' . $count . '" uniqueCount="' . $count . '">';
    foreach ($SS as $s)
        $xml .= '<si><t xml:space="preserve">' . xe($s) . '</t></si>';
    $xml .= '</sst>';
    return $xml;
}

// ─────────────────────────────────────────────────────────
// 7. LOGO DRAWING XML
// ─────────────────────────────────────────────────────────
$emuW = 1371600; $emuH = 514350; // default ~150×56px @96dpi
if ($hasLogo) {
    $sz = @getimagesize($logoFile);
    if ($sz) {
        $emuW = (int)($sz[0] * 914400 / 96);
        $emuH = (int)($sz[1] * 914400 / 96);
    }
}

$drawingXml  = '';
$drawingRels = '';
$sheet1Rels  = '';

if ($hasLogo) {
    $ns_xdr = 'xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"';
    $ns_a   = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"';
    $ns_r   = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
    $drawingXml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                 . "<xdr:wsDr $ns_xdr $ns_a $ns_r>"
                 . '<xdr:twoCellAnchor editAs="oneCell">'
                 . '<xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>'
                 . '<xdr:to><xdr:col>1</xdr:col><xdr:colOff>457200</xdr:colOff><xdr:row>3</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to>'
                 . '<xdr:pic>'
                 . '<xdr:nvPicPr><xdr:cNvPr id="2" name="Logo"/><xdr:cNvPicPr/></xdr:nvPicPr>'
                 . '<xdr:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>'
                 . '<xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' . $emuW . '" cy="' . $emuH . '"/></a:xfrm>'
                 . '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>'
                 . '</xdr:pic><xdr:clientData/>'
                 . '</xdr:twoCellAnchor></xdr:wsDr>';

    $relsNs      = 'xmlns="http://schemas.openxmlformats.org/package/2006/relationships"';
    $imgType     = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
    $drwType     = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing';
    $drawingRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                 . "<Relationships $relsNs>"
                 . "<Relationship Id=\"rId1\" Type=\"$imgType\" Target=\"../media/logo.png\"/>"
                 . '</Relationships>';
    $sheet1Rels  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                 . "<Relationships $relsNs>"
                 . "<Relationship Id=\"rId1\" Type=\"$drwType\" Target=\"../drawings/drawing1.xml\"/>"
                 . '</Relationships>';
}

// ─────────────────────────────────────────────────────────
// 8. ASSEMBLE ALL XML
// ─────────────────────────────────────────────────────────

// Column widths (character units)
$w1 = [10, 44, 7, 11, 17, 17];
$w2 = [6,  11, 44, 6, 11, 14, 14];
$w3 = [13, 50, 6, 12, 14, 12, 12];

// Build sheets (this populates $SS shared strings)
$s1xml = buildSheetXml(buildSheet1($data, $GG, $BI, $IVA, $hasLogo), $w1, $hasLogo);
$s2xml = buildSheetXml(buildSheet2($data, $GG, $BI), $w2, false);
$s3xml = buildSheetXml(buildSheet3($data), $w3, false);

// After sheets are built, generate shared strings and styles
$ssXml     = buildSharedStringsXml();
$stylesXml = buildStylesXml();

$relsNs = 'xmlns="http://schemas.openxmlformats.org/package/2006/relationships"';
$wbNs   = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
$wbNsR  = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
$wsType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';
$ssType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings';
$stType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';
$odType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';

$workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
             . "<workbook $wbNs $wbNsR><sheets>"
             . '<sheet name="Ficha Cliente" sheetId="1" r:id="rId1"/>'
             . '<sheet name="Precios Descompuestos" sheetId="2" r:id="rId2"/>'
             . '<sheet name="Materiales" sheetId="3" r:id="rId3"/>'
             . '</sheets></workbook>';

$relsRoot = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          . "<Relationships $relsNs>"
          . "<Relationship Id=\"rId1\" Type=\"$odType\" Target=\"xl/workbook.xml\"/>"
          . '</Relationships>';

$relsWb = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . "<Relationships $relsNs>"
        . "<Relationship Id=\"rId1\" Type=\"$wsType\" Target=\"worksheets/sheet1.xml\"/>"
        . "<Relationship Id=\"rId2\" Type=\"$wsType\" Target=\"worksheets/sheet2.xml\"/>"
        . "<Relationship Id=\"rId3\" Type=\"$wsType\" Target=\"worksheets/sheet3.xml\"/>"
        . "<Relationship Id=\"rId4\" Type=\"$ssType\" Target=\"sharedStrings.xml\"/>"
        . "<Relationship Id=\"rId5\" Type=\"$stType\" Target=\"styles.xml\"/>"
        . '</Relationships>';

$ctXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
       . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
       . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
       . '<Default Extension="xml" ContentType="application/xml"/>'
       . ($hasLogo ? '<Default Extension="png" ContentType="image/png"/>' : '')
       . '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
       . '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
       . '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
       . '<Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
       . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
       . '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
       . ($hasLogo ? '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>' : '')
       . '</Types>';

// ─────────────────────────────────────────────────────────
// 9. CREATE ZIP AND STREAM
// ─────────────────────────────────────────────────────────
$tmpFile = tempnam(sys_get_temp_dir(), 'prs_xlsx_');
$zip = new ZipArchive();
$zip->open($tmpFile, ZipArchive::OVERWRITE);

$zip->addFromString('[Content_Types].xml',          $ctXml);
$zip->addFromString('_rels/.rels',                  $relsRoot);
$zip->addFromString('xl/workbook.xml',              $workbookXml);
$zip->addFromString('xl/_rels/workbook.xml.rels',   $relsWb);
$zip->addFromString('xl/styles.xml',                $stylesXml);
$zip->addFromString('xl/sharedStrings.xml',         $ssXml);
$zip->addFromString('xl/worksheets/sheet1.xml',     $s1xml);
$zip->addFromString('xl/worksheets/sheet2.xml',     $s2xml);
$zip->addFromString('xl/worksheets/sheet3.xml',     $s3xml);

if ($hasLogo) {
    $zip->addFromString('xl/worksheets/_rels/sheet1.xml.rels', $sheet1Rels);
    $zip->addFromString('xl/drawings/drawing1.xml',            $drawingXml);
    $zip->addFromString('xl/drawings/_rels/drawing1.xml.rels', $drawingRels);
    $zip->addFile($logoFile, 'xl/media/logo.png');
}

$zip->close();

$filename = 'Presupuesto_JuandeBorbon_' . date('Ymd') . '.xlsx';
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: max-age=0');
header('Content-Length: ' . filesize($tmpFile));
readfile($tmpFile);
unlink($tmpFile);
exit;

} // fin if(false) — bloque ZipArchive antiguo, nunca ejecutado
