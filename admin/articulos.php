<?php
/**
 * admin/articulos.php — Sección de artículos de captación.
 *
 * Los artículos se ESCRIBEN en local con la herramienta del usuario
 * (M:\OneDrive\herramientas\generador-local\generar_articulo.py), no desde aquí:
 * el hosting compartido no ejecuta Python y la clave de la API vive en el PC,
 * que es donde debe quedarse.
 *
 * Esta sección es la mesa de revisión: lista los borradores pendientes, los deja
 * leer con formato y muestra cuáles ya están publicados en la web.
 *
 * Flujo:
 *   1. Se genera el .md en local  ->  admin/borradores/
 *   2. Se revisa aquí
 *   3. Al aprobarlo se convierte en página HTML dentro de /blog/ y entra en el
 *      sitemap (eso lo hace el asistente, que además le pone el marcado SEO)
 */
require_once __DIR__ . '/config.php';

if (!admin_is_authed()) {
    header('Location: index.php');
    exit;
}

const DIR_BORRADORES = __DIR__ . '/borradores';
const DIR_BLOG_ES    = __DIR__ . '/../blog';
const DIR_BLOG_EN    = __DIR__ . '/../en/blog';

/** Lee el front matter YAML sencillo de la cabecera de un .md. */
function leer_articulo(string $ruta): array {
    $bruto = (string)file_get_contents($ruta);
    $meta  = ['title' => basename($ruta, '.md'), 'description' => '', 'date' => '', 'tags' => []];
    $cuerpo = $bruto;

    if (preg_match('/^---\R(.*?)\R---\R(.*)$/s', $bruto, $m)) {
        $cuerpo  = $m[2];
        $lineas  = preg_split('/\R/', $m[1]);
        $clave_abierta = '';                      // para listas YAML en varias líneas

        foreach ($lineas as $linea) {
            // La herramienta emite las etiquetas de dos formas:
            //   tags: ["a", "b"]        (lista en línea)
            //   tags:\n  - a\n  - b     (lista YAML por guiones)
            // Sin este caso, el segundo formato se perdía sin avisar.
            if ($clave_abierta !== '' && preg_match('/^\s+-\s+(.*)$/', $linea, $li)) {
                $meta[$clave_abierta][] = trim($li[1], " \"'");
                continue;
            }
            if (!preg_match('/^([a-z]+):\s*(.*)$/i', trim($linea), $kv)) continue;

            $clave = strtolower($kv[1]);
            $valor = trim($kv[2], " \"'");
            $clave_abierta = '';

            if ($clave === 'tags') {
                if ($valor === '') {              // empieza una lista por guiones
                    $meta['tags'] = [];
                    $clave_abierta = 'tags';
                } else {
                    $meta['tags'] = array_values(array_filter(array_map(
                        fn($t) => trim($t, " \"'"), explode(',', trim($valor, '[]'))
                    )));
                }
            } elseif (array_key_exists($clave, $meta)) {
                $meta[$clave] = $valor;
            }
        }
    }
    $meta['cuerpo']   = $cuerpo;
    $meta['palabras'] = str_word_count(strip_tags($cuerpo));
    return $meta;
}

/** Markdown mínimo -> HTML. Escapa primero: el contenido nunca se inyecta crudo. */
function md_a_html(string $md): string {
    $lineas = preg_split('/\R/', $md);
    $out = '';
    $en_lista = false;
    foreach ($lineas as $linea) {
        $t = rtrim($linea);
        $esc = h($t);

        // negrita, cursiva y enlaces (sobre el texto ya escapado)
        $esc = preg_replace('/\*\*(.+?)\*\*/', '<strong>$1</strong>', $esc);
        $esc = preg_replace('/(?<!\*)\*([^*]+)\*(?!\*)/', '<em>$1</em>', $esc);
        $esc = preg_replace('/\[(.+?)\]\((https?:[^)\s]+)\)/', '<a href="$2" target="_blank" rel="noopener">$1</a>', $esc);

        if ($t === '') { if ($en_lista) { $out .= "</ul>\n"; $en_lista = false; } continue; }

        if (preg_match('/^---+$/', $t)) {
            if ($en_lista) { $out .= "</ul>\n"; $en_lista = false; }
            $out .= "<hr>\n"; continue;
        }
        if (preg_match('/^(#{1,4})\s+(.*)$/', $t, $m)) {
            if ($en_lista) { $out .= "</ul>\n"; $en_lista = false; }
            $n = min(strlen($m[1]) + 1, 5);           // # del .md -> h2 en la página
            $txt = preg_replace('/\*\*(.+?)\*\*/', '<strong>$1</strong>', h($m[2]));
            $out .= "<h$n>$txt</h$n>\n"; continue;
        }
        if (preg_match('/^\s*[-*]\s+(.*)$/', $esc, $m)) {
            if (!$en_lista) { $out .= "<ul>\n"; $en_lista = true; }
            $item = preg_replace('/^\[[ x]\]\s*/i', '', $m[1]);
            $out .= "<li>$item</li>\n"; continue;
        }
        if (preg_match('/^\s*(\d+)\.\s+(.*)$/', $esc, $m)) {
            if (!$en_lista) { $out .= "<ul>\n"; $en_lista = true; }
            $out .= "<li>{$m[2]}</li>\n"; continue;
        }
        if ($en_lista) { $out .= "</ul>\n"; $en_lista = false; }
        $out .= "<p>$esc</p>\n";
    }
    if ($en_lista) $out .= "</ul>\n";
    return $out;
}

// ── Inventario ───────────────────────────────────────────────────────────
$borradores = [];
if (is_dir(DIR_BORRADORES)) {
    foreach (glob(DIR_BORRADORES . '/*.md') as $ruta) {
        $a = leer_articulo($ruta);
        $a['archivo'] = basename($ruta);
        $a['idioma']  = preg_match('/-en\.md$/', $ruta) ? 'EN' : 'ES';
        $borradores[] = $a;
    }
    usort($borradores, fn($x, $y) => strcmp($x['archivo'], $y['archivo']));
}

$publicados = [];
foreach ([['ES', DIR_BLOG_ES, '/blog/'], ['EN', DIR_BLOG_EN, '/en/blog/']] as [$idi, $dir, $url]) {
    if (!is_dir($dir)) continue;
    foreach (glob($dir . '/*.html') as $ruta) {
        if (basename($ruta) === 'index.html') continue;
        $html = (string)file_get_contents($ruta);
        preg_match('/<title>(.*?)<\/title>/is', $html, $mt);
        $publicados[] = [
            'titulo' => $mt[1] ?? basename($ruta),
            'url'    => $url . basename($ruta),
            'idioma' => $idi,
            'fecha'  => date('Y-m-d', (int)filemtime($ruta)),
        ];
    }
}

// ── Artículo abierto ─────────────────────────────────────────────────────
$abierto = null;
$pedido  = basename((string)($_GET['ver'] ?? ''));      // basename: corta cualquier ../
if ($pedido !== '' && preg_match('/^[\w.-]+\.md$/', $pedido)) {
    $ruta = DIR_BORRADORES . '/' . $pedido;
    if (is_file($ruta)) {
        $abierto = leer_articulo($ruta);
        $abierto['archivo'] = $pedido;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Artículos · Pr3cise</title>
<link rel="icon" href="../favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="panel.css">
<style>
  .art-list{list-style:none}
  .art-list li{border-bottom:1px solid var(--border-lux)}
  .art-list li:last-child{border-bottom:none}
  .art-list a{display:block;padding:13px 18px;color:var(--text-main)}
  .art-list a:hover{background:#FCFCFD;text-decoration:none}
  .art-list a.on{background:#FEF9F3;border-left:3px solid var(--accent-gold)}
  .art-list .t{font-weight:600;color:var(--primary-dark);line-height:1.4}
  .art-list .m{font-size:12px;color:var(--muted);margin-top:4px}
  .pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:600;
        letter-spacing:.04em;text-transform:uppercase}
  .pill.es{background:var(--amber-bg);color:var(--amber)}
  .pill.en{background:#DBEAFE;color:#1D4ED8}
  .pill.pub{background:var(--green-bg);color:var(--green)}
  .lectura{padding:26px 30px;max-width:760px}
  .lectura h2{font-family:var(--font-heading);font-size:21px;color:var(--primary-dark);margin:30px 0 12px;line-height:1.3}
  .lectura h3{font-family:var(--font-heading);font-size:16px;color:var(--primary-dark);margin:24px 0 10px}
  .lectura h4{font-family:var(--font-heading);font-size:14px;color:var(--primary-dark);margin:18px 0 8px}
  .lectura p{margin:0 0 14px;line-height:1.75}
  .lectura ul{margin:0 0 16px 20px}
  .lectura li{margin-bottom:7px;line-height:1.7}
  .lectura hr{border:none;border-top:1px solid var(--border-lux);margin:26px 0}
  .meta-box{background:var(--bg-stone);border:1px solid var(--border-lux);border-radius:10px;
            padding:14px 16px;margin-bottom:22px;font-size:13px}
  .meta-box div{margin-bottom:5px}
  .meta-box div:last-child{margin-bottom:0}
  .meta-box b{color:var(--primary-dark)}
  .vacio{padding:34px 30px;color:var(--muted)}
  .cmd{background:var(--primary-dark);color:#E2E8F0;border-radius:10px;padding:14px 16px;
       font-family:'IBM Plex Mono',Consolas,monospace;font-size:12px;line-height:1.7;
       overflow-x:auto;white-space:pre;margin-top:10px}
  .nota{font-size:12.5px;color:var(--muted);line-height:1.65;margin-top:10px}
</style>
</head>
<body>

<header>
  <div class="brand">PR<span>3</span>CISE</div>
  <div class="tag">Artículos de captación</div>
  <div class="right">
    <a href="index.php">Leads</a>
    <a href="../index.html">Ver web</a>
    <a href="index.php?logout=1">Salir</a>
  </div>
</header>

<main>

  <div class="stats">
    <div class="card amber"><div class="lbl">Borradores por revisar</div><div class="val"><?= count($borradores) ?></div></div>
    <div class="card green"><div class="lbl">Publicados en la web</div><div class="val"><?= count($publicados) ?></div></div>
    <div class="card"><div class="lbl">Palabras en borrador</div><div class="val"><?= number_format(array_sum(array_column($borradores,'palabras')),0,',','.') ?></div></div>
  </div>

  <div class="cols">

    <div class="panel">
      <?php if ($abierto): ?>
        <h2><?= h($abierto['archivo']) ?></h2>
        <div class="lectura">
          <div class="meta-box">
            <div><b>Título:</b> <?= h($abierto['title']) ?></div>
            <?php if ($abierto['description']): ?><div><b>Meta description:</b> <?= h($abierto['description']) ?> <span style="color:var(--muted)">(<?= mb_strlen($abierto['description']) ?> caracteres)</span></div><?php endif; ?>
            <?php if ($abierto['tags']): ?><div><b>Etiquetas:</b> <?= h(implode(' · ', $abierto['tags'])) ?></div><?php endif; ?>
            <div><b>Extensión:</b> <?= number_format($abierto['palabras'],0,',','.') ?> palabras</div>
          </div>
          <?= md_a_html($abierto['cuerpo']) ?>
        </div>
      <?php else: ?>
        <h2>Revisión de borradores</h2>
        <div class="vacio">
          <?php if ($borradores): ?>
            Elige un borrador en la lista de la derecha para leerlo entero.
          <?php else: ?>
            No hay borradores pendientes. Genera uno con la herramienta y déjalo en
            <code>admin/borradores/</code>.
          <?php endif; ?>

          <p style="margin-top:20px"><b style="color:var(--primary-dark)">Cómo se crea un artículo nuevo</b></p>
          <p class="nota">Se escribe en tu PC, no desde el panel: el hosting no ejecuta Python y la clave
          de la API se queda en local, que es donde debe estar. Desde la carpeta del generador:</p>
          <div class="cmd">python generar_articulo.py "TEMA DEL ARTICULO" \
  --palabras 1100 --seo \
  --tono "tecnico, directo, de profesional a profesional" \
  --contexto contexto-pr3cise.txt \
  -o "RUTA/pr3cise/admin/borradores/mi-articulo-es.md"</div>
          <p class="nota">Termina el nombre en <code>-en.md</code> si el artículo va en inglés: la lista lo
          etiqueta sola. Cuando lo apruebes, se convierte en página dentro de <code>/blog/</code> con su
          marcado SEO y entra en el sitemap.</p>
        </div>
      <?php endif; ?>
    </div>

    <div style="display:grid;gap:20px">
      <div class="panel">
        <h2>Pendientes de revisar</h2>
        <?php if (!$borradores): ?>
          <div class="vacio" style="padding:20px">Ninguno.</div>
        <?php else: ?>
          <ul class="art-list">
            <?php foreach ($borradores as $b): ?>
              <li>
                <a href="?ver=<?= urlencode($b['archivo']) ?>" class="<?= ($abierto && $abierto['archivo']===$b['archivo'])?'on':'' ?>">
                  <div class="t"><?= h($b['title']) ?></div>
                  <div class="m">
                    <span class="pill <?= strtolower($b['idioma']) ?>"><?= $b['idioma'] ?></span>
                    <?= number_format($b['palabras'],0,',','.') ?> palabras
                    <?= $b['date'] ? ' · ' . h($b['date']) : '' ?>
                  </div>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        <?php endif; ?>
      </div>

      <div class="panel">
        <h2>Publicados</h2>
        <?php if (!$publicados): ?>
          <div class="vacio" style="padding:20px">Todavía ninguno.</div>
        <?php else: ?>
          <ul class="art-list">
            <?php foreach ($publicados as $p): ?>
              <li>
                <a href="<?= h($p['url']) ?>" target="_blank" rel="noopener">
                  <div class="t"><?= h($p['titulo']) ?></div>
                  <div class="m">
                    <span class="pill pub">Publicado</span>
                    <span class="pill <?= strtolower($p['idioma']) ?>"><?= $p['idioma'] ?></span>
                    <?= h($p['fecha']) ?>
                  </div>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        <?php endif; ?>
      </div>
    </div>

  </div>
</main>
</body>
</html>
