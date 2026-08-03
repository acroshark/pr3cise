import json
import re

user_text = """01. Demoliciones y trabajos previos;;;;;
;;;;;
01.001;Demolición de puerta;ud;10;19,70 €;197,00 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,2;30,00 €;6,00 €
MO;Peón albañilería;h;0,48;25,00 €;12,00 €
MAT;Saco de escombros de rafia 50 l;ud;2;0,85 €;1,70 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;19,70 €
;;;;;
01.002;Demolición de baño completo;ud;2;181,50 €;363,00 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1;30,00 €;30,00 €
MO;Peón albañilería;h;4,8;25,00 €;120,00 €
MAT;Saco de escombros de rafia 50 l;ud;30;0,85 €;25,50 €
MAT;Pequeño material de demolición (discos de corte, plásticos, cinta);PA;1;6,00 €;6,00 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;181,50 €
;;;;;
01.003;Demolición de cocina completa;ud;1;225,75 €;225,75 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1;30,00 €;30,00 €
MO;Peón albañilería;h;6,4;25,00 €;160,00 €
MAT;Saco de escombros de rafia 50 l;ud;35;0,85 €;29,75 €
MAT;Pequeño material de demolición (discos de corte, plásticos, cinta);PA;1;6,00 €;6,00 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;225,75 €
;;;;;
01.004;Demolición de rodapié y reparación;ml;69,5;3,76 €;260,97 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,05;30,00 €;1,50 €
MO;Peón albañilería;h;0,08;25,00 €;2,00 €
MAT;Saco de escombros de rafia 50 l;ud;0,1;0,85 €;0,09 €
MAT;Pasta de yeso B1 aplicación manual (saco 17 kg);kg;0,5;0,33 €;0,17 €
%;Mermas de materiales (2%);%;2;;0,01 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;3,76 €
;;;;;
01.005;Demolición de tabique;ml;25,3;10,04 €;254,02 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,1;30,00 €;3,00 €
MO;Peón albañilería;h;0,24;25,00 €;6,00 €
MAT;Saco de escombros de rafia 50 l;ud;1,2;0,85 €;1,02 €
%;Mermas de materiales (2%);%;2;;0,02 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;10,04 €
;;;;;
01.006;Remate de yeso en techo en demolición de tabique;ml;25,3;6,51 €;164,70 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,2;30,00 €;6,00 €
MAT;Pasta de yeso B1 aplicación manual (saco 17 kg);kg;1,5;0,33 €;0,50 €
%;Mermas de materiales (2%);%;2;;0,01 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;6,51 €
;;;;;
01.007;Demolición de ventana;ud;8;22,85 €;182,80 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,4;30,00 €;12,00 €
MO;Peón albañilería;h;0,4;25,00 €;10,00 €
MAT;Saco de escombros de rafia 50 l;ud;1;0,85 €;0,85 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;22,85 €
;;;;;
01.008;Demolición de armario;ud;2;37,55 €;75,10 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,5;30,00 €;15,00 €
MO;Peón albañilería;h;0,8;25,00 €;20,00 €
MAT;Saco de escombros de rafia 50 l;ud;3;0,85 €;2,55 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;37,55 €
;;;;;
02. Albañilería;;;;;
;;;;;
02.001;Remate en esquina en demolición de tabique;ud;10;20,06 €;200,60 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,5;30,00 €;15,00 €
MO;Peón albañilería;h;0,12;25,00 €;3,00 €
MAT;Guardavivos galvanizado 2,60 m;ud;1;1,40 €;1,40 €
MAT;Pasta de yeso B1 aplicación manual (saco 17 kg);kg;2;0,33 €;0,66 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;20,06 €
;;;;;
02.002;Remate en recto en demolición de tabique;ud;3;14,66 €;43,98 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,4;30,00 €;12,00 €
MO;Peón albañilería;h;0,08;25,00 €;2,00 €
MAT;Pasta de yeso B1 aplicación manual (saco 17 kg);kg;2;0,33 €;0,66 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;14,66 €
;;;;;
02.003;Aplicación de yeso;m²;25,1;12,87 €;322,94 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,25;30,00 €;7,50 €
MO;Peón albañilería;h;0,08;25,00 €;2,00 €
MAT;Pasta de yeso B1 aplicación manual (saco 17 kg);kg;10;0,33 €;3,30 €
%;Mermas de materiales (2%);%;2;;0,07 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;12,87 €
;;;;;
02.004;Colocación de plato de ducha;ud;2;63,30 €;126,60 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1,5;30,00 €;45,00 €
MO;Peón albañilería;h;0,4;25,00 €;10,00 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;25;0,14 €;3,50 €
MAT;Silicona neutra sanitaria (cartucho 290 ml);ud;1;4,80 €;4,80 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;63,30 €
;;;;;
02.005;Cambio de premarco de obra;ud;1;82,20 €;82,20 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1,5;30,00 €;45,00 €
MO;Peón albañilería;h;0,8;25,00 €;20,00 €
MAT;Precerco de pino 70×35 mm para puerta de paso;ud;1;16,50 €;16,50 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;5;0,14 €;0,70 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;82,20 €
;;;;;
02.006;Tabique de ladrillo de 12 cm;m²;4,3;55,20 €;237,35 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1,1;30,00 €;33,00 €
MO;Peón albañilería;h;0,2;25,00 €;5,00 €
MAT;Ladrillo cerámico hueco triple 24×11,5×11,5 cm;ud;33;0,46 €;15,18 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;12;0,14 €;1,68 €
%;Mermas de materiales (2%);%;2;;0,34 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;55,20 €
;;;;;
02.007;Apertura de hueco para puerta con premarco de obra;ud;1;121,90 €;121,90 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;2;30,00 €;60,00 €
MO;Peón albañilería;h;1,2;25,00 €;30,00 €
MAT;Precerco de pino 70×35 mm para puerta de paso;ud;1;16,50 €;16,50 €
MAT;Dintel metálico galvanizado para hueco de paso;ud;1;14,00 €;14,00 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;10;0,14 €;1,40 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;121,90 €
;;;;;
02.008;Demolición de revestimiento de azulejo y reparación;m²;23,1;13,84 €;319,61 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,15;30,00 €;4,50 €
MO;Peón albañilería;h;0,3;25,00 €;7,50 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;8;0,14 €;1,12 €
MAT;Saco de escombros de rafia 50 l;ud;0,8;0,85 €;0,68 €
%;Mermas de materiales (2%);%;2;;0,04 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;13,84 €
;;;;;
02.009;Roza de fontanería (hasta 2,5 ml);ud;3;28,84 €;86,52 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,6;30,00 €;18,00 €
MO;Peón albañilería;h;0,4;25,00 €;10,00 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;6;0,14 €;0,84 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;28,84 €
;;;;;
02.010;Instalación de ventanas;ud;8;68,50 €;548,00 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª carpintería;h;1;45,00 €;45,00 €
MO;Auxiliar carpintería;h;0,4;25,00 €;10,00 €
MAT;Silicona neutra sanitaria (cartucho 290 ml);ud;1;4,80 €;4,80 €
MAT;Espuma de poliuretano B2 (bote 750 ml);ud;1;6,20 €;6,20 €
MAT;Fijaciones y anclajes para colocación de ventana;PA;1;2,50 €;2,50 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;68,50 €
;;;;;
02.011;Ayudas de albañilería a climatización;ud;4;36,55 €;146,20 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,5;30,00 €;15,00 €
MO;Peón albañilería;h;0,8;25,00 €;20,00 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;5;0,14 €;0,70 €
MAT;Saco de escombros de rafia 50 l;ud;1;0,85 €;0,85 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;36,55 €
;;;;;
02.012;Yeso para baño;m²;27,8;18,04 €;501,49 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,3;30,00 €;9,00 €
MO;Peón albañilería;h;0,2;25,00 €;5,00 €
MAT;Pasta de yeso B1 aplicación manual (saco 17 kg);kg;12;0,33 €;3,96 €
%;Mermas de materiales (2%);%;2;;0,08 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;18,04 €
;;;;;
02.013;Cierre de hueco de puerta con ladrillo;ud;1;91,60 €;91,60 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1,5;30,00 €;45,00 €
MO;Peón albañilería;h;0,8;25,00 €;20,00 €
MAT;Ladrillo cerámico hueco doble 24×11,5×7 cm;ud;80;0,28 €;22,40 €
MAT;Mortero de cemento M-7,5 ensacado (saco 25 kg);kg;30;0,14 €;4,20 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;91,60 €
;;;;;
03. Tabiques y techos de pladur;;;;;
;;;;;
03.001;Tabique pladur hidrófugo 15 mm — estructura 48 (1 cara);m²;3,2;41,82 €;133,83 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,6;30,00 €;18,00 €
MO;Peón albañilería;h;0,4;25,00 €;10,00 €
MAT;Placa de yeso laminado hidrófuga (H1) 15 mm;m²;1,05;7,90 €;8,30 €
MAT;Perfilería galvanizada canal+montante 48 mm con banda estanca;m²;1;3,60 €;3,60 €
MAT;Pasta de juntas y cinta de papel;m²;1;1,10 €;1,10 €
MAT;Tornillería y fijaciones de placa (PM 25/45);m²;1;0,55 €;0,55 €
%;Mermas de materiales (2%);%;2;;0,27 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;41,82 €
;;;;;
03.002;Tabique pladur estándar 15 mm (1 cara);m²;5,9;31,97 €;188,60 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;0,5;30,00 €;15,00 €
MO;Peón albañilería;h;0,28;25,00 €;7,00 €
MAT;Placa de yeso laminado estándar 15 mm;m²;1,05;4,30 €;4,52 €
MAT;Perfilería galvanizada canal+montante 48 mm con banda estanca;m²;1;3,60 €;3,60 €
MAT;Pasta de juntas y cinta de papel;m²;1;1,10 €;1,10 €
MAT;Tornillería y fijaciones de placa (PM 25/45);m²;1;0,55 €;0,55 €
%;Mermas de materiales (2%);%;2;;0,20 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;31,97 €
;;;;;
03.003;Forrado de pilar en U con pladur;ud;1;83,25 €;83,25 €
;;;;;
;DESCOMPUESTO DEL PRECIO UNITARIO;;;;
Tipo;Recurso / Concepto;Ud;Rendim.;Precio;Importe
MO;Oficial 1ª albañilería;h;1,5;30,00 €;45,00 €
MO;Peón albañilería;h;1;25,00 €;25,00 €
MAT;Placa de yeso laminado estándar 15 mm;m²;1,5;4,30 €;6,45 €
MAT;Perfilería galvanizada canal+montante 48 mm con banda estanca;m²;1,2;3,60 €;4,32 €
MAT;Pasta de juntas y cinta de papel;m²;1,5;1,10 €;1,65 €
MAT;Tornillería y fijaciones de placa (PM 25/45);m²;1,5;0,55 €;0,83 €
;;;;TOTAL COSTE DIRECTO UNITARIO:;83,25 €
"""

import json

with open("alberto.json", "r", encoding="utf-8") as f:
    data = json.load(f)

lines = user_text.split("\n")
user_items = {}

current_id = None
for i in range(len(lines)):
    line = lines[i].strip()
    if not line:
        continue
    # if matches XX.XXX;...
    m = re.match(r"^(\d{2}\.\d{3});.*?;.*?;(.*?);(.*?);(.*)$", line)
    if m:
        current_id = m.group(1)
        user_items[current_id] = {
            "cant": float(m.group(2).replace(",", ".")),
            "descompuestos": []
        }
        continue
    
    if current_id and line.startswith("MO;") or line.startswith("MAT;"):
        parts = line.split(";")
        tipo = parts[0]
        desc = parts[1]
        ud = parts[2]
        rend = float(parts[3].replace(",", "."))
        precio = float(parts[4].replace(" €", "").replace(",", "."))
        importe = float(parts[5].replace(" €", "").replace(",", "."))
        user_items[current_id]["descompuestos"].append({
            "tipo": tipo.lower(),
            "desc": desc,
            "rend": rend
        })

diffs = []
for item in data["dataCoste"]:
    cid = item["id"]
    if cid in user_items:
        u_item = user_items[cid]
        if abs(u_item["cant"] - item["cant"]) > 0.001:
            diffs.append({
                "id": cid,
                "desc": "CANTIDAD",
                "json_rend": item["cant"],
                "user_rend": u_item["cant"]
            })
            
        # compute mo, mat
        u_mo = 0
        u_mat = 0
        for d_user in u_item["descompuestos"]:
            # find corresponding in json
            matched = False
            for d_json in item["descompuesto"]:
                if d_user["desc"] == d_json["desc"]:
                    matched = True
                    if abs(d_user["rend"] - d_json["rend"]) > 0.001:
                        diffs.append({
                            "id": cid,
                            "desc": d_json["desc"],
                            "json_rend": d_json["rend"],
                            "user_rend": d_user["rend"]
                        })
                    precio = d_json["precio"]
                    if d_user["tipo"] == "mo":
                        u_mo += d_user["rend"] * precio
                    else:
                        u_mat += d_user["rend"] * precio
        
        if abs(u_mo - item["mo"]) > 0.001:
            diffs.append({
                "id": cid,
                "desc": "MO TOTAL",
                "json_rend": item["mo"],
                "user_rend": u_mo
            })
        if abs(u_mat - item["mat"]) > 0.001:
            diffs.append({
                "id": cid,
                "desc": "MAT TOTAL",
                "json_rend": item["mat"],
                "user_rend": u_mat
            })

print("Differences found:")
for d in diffs:
    print(f"{d['id']} - {d['desc']}: JSON {d['json_rend']} -> USER {d['user_rend']}")
