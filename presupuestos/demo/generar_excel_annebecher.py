import json
import xlsxwriter
import math
import os
import sys

# ==========================================
# CONFIGURACIÓN
# 16/05/2026 18:06 - Creado: generador Excel para presupuesto Anne Becher
# ==========================================
JSON_PATH   = os.path.join(os.path.dirname(__file__), 'partidas', 'anne_becher.json')
LOGO_PATH   = os.path.join(os.path.dirname(__file__), 'logo', 'logo.png')
OUTPUT_FILE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'Presupuesto_AnneBecher.xlsx')

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    proyecto = json.load(f)

workbook = xlsxwriter.Workbook(OUTPUT_FILE)

# ==========================================
# ESTILOS
# ==========================================
color_bg_page        = '#F8F9F9'
color_text_primary   = '#2C3E50'
color_text_secondary = '#7F8C8D'

style_header_main    = workbook.add_format({'bold': True, 'font_size': 14, 'font_color': color_text_primary,  'bg_color': color_bg_page})
style_subtitle_main  = workbook.add_format({'font_size': 9,  'font_color': color_text_secondary, 'bg_color': color_bg_page})
style_nav_active     = workbook.add_format({'bold': True, 'font_color': 'white', 'bg_color': '#1abc9c', 'align': 'center', 'valign': 'vcenter', 'border': 0})
style_chapter_bar    = workbook.add_format({'bold': True, 'bg_color': '#EBEDEF', 'font_color': '#17202A', 'valign': 'vcenter', 'top': 1, 'bottom': 1, 'border_color': '#D6DBDF'})
style_chapter_total  = workbook.add_format({'bold': True, 'bg_color': '#EBEDEF', 'font_color': '#17202A', 'num_format': '#,##0.00 €', 'align': 'right', 'valign': 'vcenter', 'top': 1, 'bottom': 1, 'border_color': '#D6DBDF'})

# Desglose Técnico
style_tec_main_row   = workbook.add_format({'bold': True, 'bg_color': 'white', 'valign': 'vcenter', 'top': 1, 'border_color': '#EAEDED'})
style_tec_main_price = workbook.add_format({'bold': True, 'bg_color': 'white', 'num_format': '#,##0.00 €', 'align': 'right', 'valign': 'vcenter', 'top': 1, 'border_color': '#EAEDED'})
style_sub_header     = workbook.add_format({'bold': True, 'font_size': 7, 'color': '#ABB2B9', 'bg_color': '#FDEDEC'})
style_desc_header    = workbook.add_format({'italic': True, 'font_size': 7, 'color': '#ABB2B9', 'bg_color': 'white'})
style_sub_type_mat   = workbook.add_format({'color': '#3498DB', 'border': 1, 'border_color': '#D6EAF8', 'align': 'center', 'font_size': 7})
style_sub_type_mo    = workbook.add_format({'color': '#E67E22', 'border': 1, 'border_color': '#FAE5D3', 'align': 'center', 'font_size': 7})
style_sub_text       = workbook.add_format({'font_size': 8, 'color': '#566573', 'text_wrap': True, 'valign': 'vcenter'})
style_sub_num        = workbook.add_format({'font_size': 8, 'color': '#566573', 'align': 'center'})
style_sub_curr       = workbook.add_format({'font_size': 8, 'color': '#566573', 'num_format': '#,##0.00 €', 'align': 'right'})
style_total_directo  = workbook.add_format({'font_size': 7, 'color': '#AAA', 'align': 'right', 'top': 1, 'border_color': '#EEE'})

# Materiales
style_mat_header     = workbook.add_format({'bold': True, 'font_size': 8, 'bg_color': '#F8F9F9', 'color': '#777', 'align': 'right', 'valign': 'bottom'})
style_mat_header_L   = workbook.add_format({'bold': True, 'font_size': 8, 'bg_color': '#F8F9F9', 'color': '#777', 'align': 'left',  'valign': 'bottom'})
style_mat_row        = workbook.add_format({'font_size': 9, 'color': '#333', 'bg_color': 'white', 'border': 0})
style_mat_row_bold   = workbook.add_format({'font_size': 9, 'bold': True, 'color': '#333', 'bg_color': 'white', 'border': 0, 'text_wrap': True, 'valign': 'vcenter'})
style_mat_row_R      = workbook.add_format({'font_size': 9, 'color': '#333', 'bg_color': 'white', 'border': 0, 'align': 'right'})
style_mat_row_bold_R = workbook.add_format({'font_size': 9, 'bold': True, 'color': '#333', 'bg_color': 'white', 'border': 0, 'align': 'right'})
style_mat_curr       = workbook.add_format({'font_size': 9, 'color': '#333', 'bg_color': 'white', 'border': 0, 'num_format': '#,##0.00 €', 'align': 'right'})
style_mat_curr_bold  = workbook.add_format({'font_size': 9, 'bold': True, 'color': '#333', 'bg_color': 'white', 'border': 0, 'num_format': '#,##0.00 €', 'align': 'right'})
style_mat_total_label = workbook.add_format({'bg_color': '#EBF5FB', 'color': '#1A5276', 'bold': True, 'font_size': 9, 'align': 'right', 'valign': 'vcenter', 'top': 1, 'bottom': 1, 'border_color': '#AED6F1'})
style_mat_total_val   = workbook.add_format({'bg_color': '#EBF5FB', 'color': '#1A5276', 'bold': True, 'font_size': 14, 'align': 'right', 'num_format': '#,##0.00 €', 'valign': 'vcenter', 'top': 1, 'bottom': 1, 'border_color': '#AED6F1'})
style_mat_precio_edit = workbook.add_format({'font_size': 9, 'color': '#1A5276', 'bg_color': '#FFFACD', 'border': 0, 'num_format': '#,##0.00 €', 'align': 'right', 'bold': True})

# ==========================================
# HOJAS
# ==========================================
ws_cliente    = workbook.add_worksheet('Cliente')
ws_tecnico    = workbook.add_worksheet('Desglose Técnico')
ws_materiales = workbook.add_worksheet('Materiales')

config    = proyecto.get('config', {})
GG        = config.get('GG',  0.10)
BI        = config.get('BI',  0.08)
IVA       = config.get('IVA', 0.10)
merma     = config.get('merma', 0.0)
ipc       = config.get('ipc',   0.0)
info      = proyecto.get('info', {})
capitulos = proyecto.get('capitulos', {})
sorted_chapters = sorted(capitulos.keys())

# ==========================================
# 1. DESGLOSE TÉCNICO
# ==========================================
ws_tecnico.hide_gridlines(2)
ws_tecnico.set_landscape()
ws_tecnico.set_column('A:A', 3)
ws_tecnico.set_column('B:B', 12.86)
ws_tecnico.set_column('C:C', 43)
ws_tecnico.set_column('D:D', 18)
ws_tecnico.set_column('E:E', 8)
ws_tecnico.set_column('F:F', 11.86)
ws_tecnico.set_column('G:G', 16.86)
ws_tecnico.set_column('H:H', 18)

row      = 2
data_map = {}

for cap_id in sorted_chapters:
    ws_tecnico.write(row, 1, f"{cap_id}. {capitulos[cap_id]}",
                     workbook.add_format({'bold': True, 'font_size': 11, 'color': '#2C3E50'}))
    row += 2
    items = [x for x in proyecto.get('dataCoste', []) if x.get('cap') == cap_id]

    for item in items:
        if item.get('subtitulo', False) or item.get('tipo') == 'titulo':
            continue

        ws_tecnico.write(row, 1, item['id'],   style_tec_main_row)
        ws_tecnico.write(row, 2, item.get('titulo', item.get('desc', '')), style_tec_main_row)
        ws_tecnico.write(row, 3, item.get('ud', ''), style_tec_main_row)
        ws_tecnico.write(row, 4, item.get('cant', 0),
                         workbook.add_format({'bold': True, 'align': 'center', 'bg_color': 'white',
                                              'top': 1, 'border_color': '#EAEDED'}))
        main_row = row
        row += 2

        descomp = item.get('descompuesto', [])
        if descomp:
            ws_tecnico.write(row, 2, "DESCOMPUESTO DEL PRECIO UNITARIO", style_desc_header)
            row += 1
            ws_tecnico.write_row(row, 1, ['Tipo', 'Recurso / Concepto', 'Ud', 'Rendim.', 'Precio', 'Importe'],
                                 style_sub_header)
            row += 1
            start_sub_row = row
            for sub in descomp:
                tipo = sub.get('tipo', 'mat').upper()
                tag  = style_sub_type_mat if tipo == 'MAT' else style_sub_type_mo
                ws_tecnico.write(row, 1, tipo,                tag)
                ws_tecnico.write(row, 2, sub.get('desc', ''), style_sub_text)
                ws_tecnico.write(row, 3, sub.get('ud',   ''), style_sub_num)
                ws_tecnico.write(row, 4, sub.get('rend',  0), style_sub_num)
                precio_base = sub.get('precio', 0)
                ws_tecnico.write(row, 5, precio_base, style_sub_curr)
                ws_tecnico.write_formula(row, 6, f"=E{row+1}*F{row+1}", style_sub_curr)
                _d_lines = max(1, math.ceil(len(sub.get('desc', '')) / 36))
                ws_tecnico.set_row(row, max(15, _d_lines * 13 + 3))
                row += 1
            ws_tecnico.write(row, 5, "TOTAL COSTE DIRECTO UNITARIO:", style_total_directo)
            ws_tecnico.write_formula(row, 6, f"=SUM(G{start_sub_row+1}:G{row})", style_sub_curr)
            unit_price_cell = f"G{row+1}"
        else:
            unit_price_base = item.get('mat', 0) + item.get('mo', 0)
            unit_price_cell = str(unit_price_base)
            ws_tecnico.write(row, 5, "PRECIO UNITARIO:", style_total_directo)
            ws_tecnico.write(row, 6, unit_price_base,   style_sub_curr)

        ws_tecnico.write_formula(main_row, 5, f"={unit_price_cell}", style_tec_main_price)
        ws_tecnico.write_formula(main_row, 6, f"=E{main_row+1}*F{main_row+1}", style_tec_main_price)
        data_map[item['id']] = {
            'total_cell': f"G{main_row+1}",
            'unit_cell':  f"F{main_row+1}",
            'cant_cell':  f"E{main_row+1}"
        }
        row += 2

row += 2
ws_tecnico.write(row, 5, "TOTAL COSTE EJECUCIÓN MATERIAL",
                 workbook.add_format({'bold': True, 'color': '#566573', 'align': 'right', 'font_size': 10}))
all_totals   = [v['total_cell'] for v in data_map.values()]
pem_cell_ref = f"G{row+1}"
if all_totals:
    ws_tecnico.write_formula(row, 6, f"=SUM({','.join(all_totals)})",
                             workbook.add_format({'bold': True, 'font_size': 14, 'num_format': '#,##0.00 €'}))
row_pem_tec = row

# Resumen económico en Desglose Técnico
row += 3
ws_tecnico.write(row, 1, "Desglose Económico del Presupuesto",
                 workbook.add_format({'bold': True, 'font_size': 10}))
row += 2

st_title_center = workbook.add_format({'font_size': 8, 'color': '#000080', 'bg_color': '#F8F9F9', 'bold': True,
                                       'left': 1, 'top': 1, 'border_color': '#EAEDED', 'align': 'center', 'valign': 'vcenter'})
st_title_right  = workbook.add_format({'font_size': 8, 'color': '#000080', 'bg_color': '#F8F9F9', 'bold': True,
                                       'left': 1, 'top': 1, 'right': 1, 'border_color': '#EAEDED'})
st_percent  = workbook.add_format({'font_size': 9, 'bold': True, 'color': '#2C3E50', 'bg_color': 'white',
                                   'num_format': '0%', 'align': 'center', 'valign': 'vcenter',
                                   'border': 1, 'border_color': '#BDC3C7'})
st_card_val = workbook.add_format({'font_size': 10, 'bold': True, 'color': '#333', 'bg_color': '#F8F9F9',
                                   'num_format': '#,##0.00 €', 'align': 'right',
                                   'left': 1, 'bottom': 1, 'right': 1, 'border_color': '#EAEDED'})
st_base_val = workbook.add_format({'font_size': 14, 'bold': True, 'color': '#000080', 'bg_color': '#F8F9F9',
                                   'num_format': '#,##0.00 €', 'align': 'right',
                                   'bottom': 1, 'left': 1, 'right': 1, 'border_color': '#EAEDED'})

ws_tecnico.write(row, 1, "CEM", st_title_right)
ws_tecnico.write(row, 2, "GASTOS GENERALES", st_title_center)
ws_tecnico.write(row, 3, GG, st_percent)
ws_tecnico.write(row, 4, "BI", st_title_center)
ws_tecnico.write(row, 5, BI, st_percent)
ws_tecnico.write(row, 6, "Base Imp", st_title_right)

gg_cell = f"D{row+1}"
bi_cell = f"F{row+1}"

ws_tecnico.write_formula(row+1, 1, f"={pem_cell_ref}", st_card_val)
ws_tecnico.merge_range(row+1, 2, row+1, 3, f"={pem_cell_ref}*{gg_cell}", st_card_val)
ws_tecnico.merge_range(row+1, 4, row+1, 5, f"={pem_cell_ref}*{bi_cell}", st_card_val)
ws_tecnico.write_formula(row+1, 6, f"={pem_cell_ref}*(1+{gg_cell}+{bi_cell})", st_base_val)

base_imp_cell_tec = f"G{row+2}"

# Notas importantes en Desglose Técnico
_notas = proyecto.get('notas', [])
if _notas:
    row += 4
    ws_tecnico.write(row, 1, "Notas Importantes",
                     workbook.add_format({'bold': True, 'font_size': 11,
                                          'font_color': '#E74C3C', 'bg_color': color_bg_page}))
    row += 1
    _nota_fmt = workbook.add_format({
        'bg_color': '#FFF9F9', 'font_size': 9, 'font_color': '#616A6B',
        'text_wrap': True, 'valign': 'top', 'border': 1, 'border_color': '#FADBD8'
    })
    _CHARS_PER_LINE = 100
    _LINE_PT        = 12
    for _nota in _notas:
        _text      = f"• {_nota}"
        _num_lines = max(1, math.ceil(len(_text) / _CHARS_PER_LINE))
        _row_h     = max(20, _num_lines * _LINE_PT + 8)
        ws_tecnico.set_row(row, _row_h)
        ws_tecnico.merge_range(row, 1, row, 6, _text, _nota_fmt)
        row += 1

# ==========================================
# 2. CLIENTE
# ==========================================
ws_cliente.hide_gridlines(2)
ws_cliente.set_portrait()
ws_cliente.set_column('A:A', 2)
ws_cliente.set_column('B:B', 27)
ws_cliente.set_column('C:C', 27)
ws_cliente.set_column('D:D', 27)
ws_cliente.set_column('E:E', 2)

if os.path.exists(LOGO_PATH):
    ws_cliente.insert_image('B2', LOGO_PATH, {'x_offset': 187, 'y_offset': 8, 'x_scale': 0.30, 'y_scale': 0.30})

row_cli = 7
ws_cliente.merge_range(f'B{row_cli}:D{row_cli}',
                       info.get('titulo', 'Proyecto'), style_header_main)
row_cli += 1
ws_cliente.merge_range(f'B{row_cli}:D{row_cli}',
                       info.get('descripcion', ''), style_subtitle_main)
row_cli += 1
ws_cliente.merge_range(f'B{row_cli}:D{row_cli}',
                       f"📍 {info.get('ubicacion', '')}  |  Ref: {info.get('referencia', '')}",
                       style_subtitle_main)
row_cli += 2
ws_cliente.merge_range(f'B{row_cli}:D{row_cli}', "  FICHA TÉCNICA DEL PRESUPUESTO  ", style_nav_active)
row_cli += 2
ws_cliente.merge_range(f'B{row_cli}:D{row_cli}', "Memoria Técnica y Económica",
                       workbook.add_format({'bold': True, 'font_size': 12, 'font_color': '#34495E', 'bg_color': color_bg_page}))
row_cli += 1
ws_cliente.merge_range(f'B{row_cli}:D{row_cli}', "Detalle pormenorizado de partidas por capítulo.",
                       workbook.add_format({'font_size': 9, 'font_color': '#7F8C8D', 'bg_color': color_bg_page}))
row_cli += 2

for cap_id in sorted_chapters:
    chapter_items = [x for x in proyecto.get('dataCoste', []) if x.get('cap') == cap_id]
    if not chapter_items:
        continue

    ws_cliente.merge_range(row_cli, 1, row_cli, 3, "", style_chapter_bar)
    ws_cliente.write(row_cli, 1, f"{cap_id}. {capitulos[cap_id]}", style_chapter_bar)

    cap_cells = [data_map[x['id']]['total_cell'] for x in chapter_items if x['id'] in data_map]
    if cap_cells:
        ws_cliente.write_formula(row_cli, 3,
                                 f"=SUM('Desglose Técnico'!{','.join(cap_cells)})", style_chapter_total)
    row_cli += 2

    for item in chapter_items:
        if item['id'] not in data_map:
            continue
        ref = data_map[item['id']]

        fmt_title = workbook.add_format({'bold': True, 'font_size': 10, 'bg_color': 'white', 'top': 1, 'left': 1,
                                          'border_color': '#E5E8E8', 'font_color': '#2C3E50',
                                          'text_wrap': True, 'valign': 'top'})
        fmt_price = workbook.add_format({'bold': True, 'font_size': 10, 'bg_color': 'white', 'top': 1, 'right': 1,
                                          'border_color': '#E5E8E8', 'num_format': '#,##0.00 €',
                                          'align': 'right', 'font_color': '#2C3E50'})
        ws_cliente.write(row_cli, 0, "▲",
                         workbook.add_format({'align': 'center', 'valign': 'top', 'font_color': '#BDC3C7', 'bg_color': color_bg_page}))
        _titulo_cli = f"{item['id']} — {item.get('titulo', item.get('desc', ''))}"
        ws_cliente.merge_range(row_cli, 1, row_cli, 2, _titulo_cli, fmt_title)
        ws_cliente.write_formula(row_cli, 3,
                                 f"='Desglose Técnico'!{ref['total_cell']}*(1+'Desglose Técnico'!{gg_cell}+'Desglose Técnico'!{bi_cell})", fmt_price)
        _t_lines = max(1, math.ceil(len(_titulo_cli) / 50))
        ws_cliente.set_row(row_cli, max(16, _t_lines * 13 + 4))
        row_cli += 1

        formula_qty = (f"='Desglose Técnico'!{ref['cant_cell']} & \" \" & \"{item.get('ud', '')}\" "
                       f"& \" x \" & TEXT('Desglose Técnico'!{ref['unit_cell']}*(1+'Desglose Técnico'!{gg_cell}+'Desglose Técnico'!{bi_cell}), \"0.00 €\")")
        fmt_mid = workbook.add_format({'bg_color': 'white', 'left': 1, 'border_color': '#E5E8E8',
                                        'font_size': 9, 'font_color': '#7F8C8D', 'italic': True})
        ws_cliente.merge_range(row_cli, 1, row_cli, 2, "", fmt_mid)
        ws_cliente.write_formula(row_cli, 1, formula_qty, fmt_mid)
        ws_cliente.write(row_cli, 3, "", workbook.add_format({'bg_color': 'white', 'right': 1, 'border_color': '#E5E8E8'}))
        row_cli += 1

        fmt_spec_lbl = workbook.add_format({'bg_color': 'white', 'left': 1, 'border_color': '#E5E8E8', 'font_size': 7,
                                             'bold': True, 'font_color': '#ABB2B9', 'valign': 'bottom',
                                             'top': 1, 'top_color': '#F2F3F4'})
        ws_cliente.write(row_cli, 1, "ESPECIFICACIÓN TÉCNICA", fmt_spec_lbl)
        ws_cliente.write(row_cli, 2, "", workbook.add_format({'bg_color': 'white', 'top': 1, 'top_color': '#F2F3F4'}))
        ws_cliente.write(row_cli, 3, "", workbook.add_format({'bg_color': 'white', 'right': 1, 'top': 1,
                                                               'top_color': '#F2F3F4', 'border_color': '#E5E8E8'}))
        row_cli += 1

        fmt_spec = workbook.add_format({'bg_color': 'white', 'left': 1, 'bottom': 1, 'right': 1, 'border_color': '#E5E8E8',
                                         'font_size': 8, 'font_color': '#566573', 'text_wrap': True, 'valign': 'top'})
        _ld = item.get('longDesc') or item.get('desc', '')
        ws_cliente.merge_range(row_cli, 1, row_cli, 3, _ld, fmt_spec)
        _ld_lines = max(1, math.ceil(len(_ld) / 75))
        ws_cliente.set_row(row_cli, max(30, _ld_lines * 10 + 6))
        row_cli += 2

# Resumen Económico
row_cli += 2
ws_cliente.write(row_cli, 1, "Resumen Económico",
                 workbook.add_format({'bold': True, 'font_size': 12, 'bg_color': color_bg_page}))
row_cli += 1
st_sum_title = workbook.add_format({'font_size': 9, 'color': '#AAA', 'bg_color': 'white', 'valign': 'top', 'align': 'left',
                                     'left': 1, 'top': 1, 'right': 1, 'border_color': '#EEE'})
st_sum_val   = workbook.add_format({'bold': True, 'font_size': 14, 'color': '#333', 'bg_color': 'white', 'valign': 'bottom',
                                     'align': 'left', 'left': 1, 'bottom': 1, 'right': 1, 'num_format': '#,##0.00 €', 'border_color': '#EEE'})

ws_cliente.write(row_cli,   1, "BASE IMPONIBLE",          st_sum_title)
ws_cliente.write(row_cli,   2, f"IVA ({int(IVA*100)}%)", st_sum_title)
ws_cliente.write(row_cli,   3, "TOTAL PRESUPUESTO",       st_sum_title)
ws_cliente.write_formula(row_cli+1, 1, f"='Desglose Técnico'!{base_imp_cell_tec}", st_sum_val)
ws_cliente.write_formula(row_cli+1, 2, f"=B{row_cli+2}*{IVA}", st_sum_val)
ws_cliente.write_formula(row_cli+1, 3, f"=B{row_cli+2}+C{row_cli+2}", st_sum_val)

# ==========================================
# 3. MATERIALES
# ==========================================
ws_materiales.hide_gridlines(2)
ws_materiales.set_landscape()
ws_materiales.set_column('A:A', 2)
ws_materiales.set_column('B:B', 15)
ws_materiales.set_column('C:C', 50)
ws_materiales.set_column('D:D', 6)
ws_materiales.set_column('E:E', 12)
ws_materiales.set_column('F:F', 12)
ws_materiales.set_column('G:G', 12)
ws_materiales.set_column('H:H', 15)

ws_materiales.merge_range('B2:H2', f"PREVISIÓN DE MATERIALES — {info.get('titulo', 'PROYECTO').upper()}", style_header_main)

editable = workbook.add_format({'bold': True, 'align': 'center', 'valign': 'vcenter', 'num_format': '0%',
                                  'bg_color': 'white', 'border': 1, 'border_color': '#BDC3C7', 'font_color': '#2C3E50'})
ws_materiales.write('G3', "Ajuste de Mermas / Desperdicio:",
                    workbook.add_format({'bold': True, 'color': '#555', 'align': 'right', 'valign': 'vcenter', 'font_size': 9}))
ws_materiales.write('H3', merma, editable)
ws_materiales.write('G4', "IPC Materiales:",
                    workbook.add_format({'bold': True, 'color': '#555', 'align': 'right', 'valign': 'vcenter', 'font_size': 9}))
ws_materiales.write('H4', ipc, editable)

row_mat = 6
headers = ['CÓDIGO', 'MATERIAL', 'UD', 'CANT.\nBASE', 'CANT.\n+MERMAS', 'PRECIO/UD', 'PRECIO TOTAL']
for i, h in enumerate(headers):
    ws_materiales.write(row_mat, i+1, h, style_mat_header_L if i < 2 else style_mat_header)

row_mat += 1
total_cells = []

for mat in proyecto.get('dataMaterial', []):
    if mat.get('tipo') == 'titulo':
        is_cap = (mat.get('desc', '')).upper().startswith('CAP')
        fmt_row = workbook.add_format({'bold': True, 'bg_color': '#EBF5FB' if is_cap else '#F2F3F4',
                                        'font_color': '#1A5276' if is_cap else '#555'})
        ws_materiales.merge_range(row_mat, 1, row_mat, 7, mat.get('desc', ''), fmt_row)
        row_mat += 1
        continue

    if mat.get('cant', 0) <= 0:
        continue

    ws_materiales.write(row_mat, 1, mat.get('id',    ''), style_mat_row)
    ws_materiales.write(row_mat, 2, mat.get('desc',  ''), style_mat_row_bold)
    ud = (mat.get('ud', '') or '').lower()
    ws_materiales.write(row_mat, 3, ud,                  style_mat_row_R)
    ws_materiales.write(row_mat, 4, mat.get('cant', 0),  style_mat_row_R)

    has_merma = ud not in ['ud', 'kit', 'paq']
    if has_merma:
        ws_materiales.write_formula(row_mat, 5, f"=E{row_mat+1}*(1+$H$3)", style_mat_row_bold_R)
    else:
        ws_materiales.write_formula(row_mat, 5, f"=E{row_mat+1}",           style_mat_row_bold_R)

    precio = mat.get('precio', 0)
    ws_materiales.write(row_mat, 6, precio, style_mat_precio_edit)
    ws_materiales.write_formula(row_mat, 7, f"=F{row_mat+1}*G{row_mat+1}*(1+$H$4)", style_mat_curr_bold)
    total_cells.append(f"H{row_mat+1}")

    _mat_lines = max(1, math.ceil(len(mat.get('desc', '')) / 40))
    ws_materiales.set_row(row_mat, max(15, _mat_lines * 14 + 3))
    row_mat += 2

row_mat += 1
ws_materiales.set_row(row_mat, 28)
ws_materiales.merge_range(row_mat, 1, row_mat, 6, "TOTAL MATERIALES", style_mat_total_label)
if total_cells:
    ws_materiales.write_formula(row_mat, 7, f"=SUM({','.join(total_cells)})", style_mat_total_val)
else:
    ws_materiales.write(row_mat, 7, 0, style_mat_total_val)

workbook.close()
print(f"Archivo generado: {OUTPUT_FILE}")
