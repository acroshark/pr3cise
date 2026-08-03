import json
import os

JSON_PATH = os.path.join("m:\\", "OneDrive", "Clear Ascend OÜ", "Pr3cise", "pr3cise", "presupuestos", "reformasdiazaguadosl", "Alberto", "partidas", "alberto.json")

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update capitulos
data['capitulos']['06'] = "Fontanería"

# Data to add
fontaneria_data = [
    {
        "id": "06.001", "cap": "06", "ud": "ud", "cant": 1,
        "titulo": "Llave general de corte + acometida interior, montaje y conexión",
        "desc": "Instalación de llave general de corte y acometida interior.",
        "mo": 45.0, "mat": 40.0,
        "longDesc": "Suministro e instalación de llave general de corte para la vivienda, incluyendo acometida interior, valvulería necesaria, montaje y conexión a la red existente."
    },
    {
        "id": "06.002", "cap": "06", "ud": "ud", "cant": 2,
        "titulo": "Punto completo AF+AC con desagüe (fregadero cocina + fregadero/lavadero)",
        "desc": "Punto de agua fría y caliente con desagüe (solo tomas).",
        "mo": 40.0, "mat": 38.0,
        "longDesc": "Punto completo de agua fría (AF) y agua caliente (AC) con desagüe para fregadero de cocina y fregadero/lavadero. Incluye trazado de tuberías, piezas especiales y tomas de pared preparadas para conexión de grifería."
    },
    {
        "id": "06.003", "cap": "06", "ud": "ud", "cant": 1,
        "titulo": "Punto AF para electrodoméstico (lavavajillas/lavadora)",
        "desc": "Punto de agua fría para electrodoméstico.",
        "mo": 20.0, "mat": 18.0,
        "longDesc": "Punto de agua fría (AF) para alimentación de electrodoméstico (lavavajillas o lavadora), incluyendo llave de escuadra y conexión a derivación principal."
    },
    {
        "id": "06.004", "cap": "06", "ud": "ud", "cant": 2,
        "titulo": "Punto completo AF+AC (lavabos baños)",
        "desc": "Punto de agua fría y caliente para lavabo.",
        "mo": 40.0, "mat": 32.0,
        "longDesc": "Punto completo de agua fría (AF) y agua caliente (AC) para lavabos en baños. Incluye derivación desde colector o red general, tubería, piezas especiales y llaves de escuadra."
    },
    {
        "id": "06.005", "cap": "06", "ud": "ud", "cant": 1,
        "titulo": "Punto AF+AC (bidé / ducha-bañera)",
        "desc": "Punto de agua fría y caliente para bidé o ducha/bañera.",
        "mo": 35.0, "mat": 33.0,
        "longDesc": "Punto de agua fría (AF) y agua caliente (AC) para bidé, ducha o bañera. Comprende canalización, codos, racorería y tomas terminales."
    },
    {
        "id": "06.006", "cap": "06", "ud": "ud", "cant": 2,
        "titulo": "Punto AF inodoro/cisterna",
        "desc": "Punto de agua fría para inodoro/cisterna.",
        "mo": 18.0, "mat": 14.0,
        "longDesc": "Punto de agua fría (AF) para alimentación de inodoro o cisterna, incluyendo llave de corte y pequeño material de conexión."
    },
    {
        "id": "06.007", "cap": "06", "ud": "ud", "cant": 1,
        "titulo": "Punto AF+AC (aseo/lavabo zona inferior derecha)",
        "desc": "Punto de agua fría y caliente para aseo o lavabo secundario.",
        "mo": 40.0, "mat": 32.0,
        "longDesc": "Punto de AF y AC para lavabo en aseo de la zona inferior derecha, con todo el pequeño material necesario hasta llave de escuadra."
    },
    {
        "id": "06.008", "cap": "06", "ud": "ml", "cant": 55,
        "titulo": "Distribución general tubería multicapa AF+AC",
        "desc": "Distribución tubería multicapa AF+AC con aislamiento.",
        "mo": 6.5, "mat": 6.0,
        "longDesc": "Distribución general de tubería multicapa para red de agua fría y agua caliente. Incluye montantes, derivaciones, manguitos de unión, coquilla de aislamiento térmico para AC y fijaciones."
    },
    {
        "id": "06.009", "cap": "06", "ud": "ud", "cant": 3,
        "titulo": "Colectores/distribuidores y llaves de sectorización por zona húmeda",
        "desc": "Batería de colectores y llaves de sectorización.",
        "mo": 20.0, "mat": 25.0,
        "longDesc": "Instalación de batería de colectores/distribuidores para sectorización de zonas húmedas, incluyendo válvulas de corte por ramal y caja de registro empotrada."
    },
    {
        "id": "06.010", "cap": "06", "ud": "pa", "cant": 1,
        "titulo": "Pruebas de estanqueidad, purgado y puesta en carga",
        "desc": "Pruebas de presión, purgado y comprobación de la instalación.",
        "mo": 90.0, "mat": 0.0,
        "longDesc": "Realización de pruebas de estanqueidad y presión de la red de fontanería, purgado de circuitos y puesta en carga para verificación de ausencia de fugas, según normativa vigente."
    },
    {
        "id": "06.011", "cap": "06", "ud": "pa", "cant": 1,
        "titulo": "Rozas, pasos y pequeño material de fijación (no incluye albañilería de cierre)",
        "desc": "Apertura de rozas y pasos para conducciones de fontanería.",
        "mo": 90.0, "mat": 30.0,
        "longDesc": "Apertura de rozas en tabiquería, pasos de forjado y muros para el trazado de instalaciones de fontanería, incluyendo pequeño material de fijación (abrazaderas, tacos). No incluye el posterior tapado con mortero o yeso."
    }
]

# We need to add descompuestos to match exactly unit price
# 06.001 -> 85.00
# 06.002 -> 78.00
# 06.003 -> 38.00
# 06.004 -> 72.00
# 06.005 -> 68.00
# 06.006 -> 32.00
# 06.007 -> 72.00
# 06.008 -> 12.50
# 06.009 -> 45.00
# 06.010 -> 90.00
# 06.011 -> 120.00

# The base cost formula is unit_price = mat * (1 + merma) + mo
# However, merma is 2% globally (0.02) if ud != 'ud' AND config.mermas=2.
# So if ud == 'ud' or 'pa', merma is 0. If ud == 'ml', merma is 0.02 on material.
# Let's verify this rule for 06.008: ud='ml', target unit price = 12.50.
# If mat=6.00, merma=2% of 6.00 = 0.12. mo = 12.50 - 6.12 = 6.38.

merma_pct = data.get('config', {}).get('mermas', 2) / 100.0

target_prices = {
    "06.001": 85.00,
    "06.002": 78.00,
    "06.003": 38.00,
    "06.004": 72.00,
    "06.005": 68.00,
    "06.006": 32.00,
    "06.007": 72.00,
    "06.008": 12.50,
    "06.009": 45.00,
    "06.010": 90.00,
    "06.011": 120.00
}

# New MO and MAT definitions to add if not present
new_materials = [
    {
      "id": "MO07",
      "desc": "Oficial 1ª fontanero",
      "ud": "h",
      "cant": 0,
      "precio": 35,
      "pvp": 35,
      "tipo": "mo"
    },
    {
      "id": "MO08",
      "desc": "Ayudante fontanero",
      "ud": "h",
      "cant": 0,
      "precio": 20,
      "pvp": 20,
      "tipo": "mo"
    },
    {
      "id": "TIT-FONT",
      "desc": "FONTANERÍA Y SANEAMIENTO",
      "ud": "",
      "cant": 0,
      "precio": 0,
      "pvp": 0,
      "tipo": "titulo"
    },
    {
      "id": "MAT101",
      "desc": "Materiales de fontanería varios (tuberías, llaves, accesorios)",
      "ud": "PA",
      "cant": 0,
      "precio": 1,
      "pvp": 1.2,
      "tipo": "mat"
    }
]

# Add MO07, MO08, TIT-FONT, MAT101 to dataMaterial if not present
existing_mat_ids = [m['id'] for m in data['dataMaterial']]
for nm in new_materials:
    if nm['id'] not in existing_mat_ids:
        data['dataMaterial'].append(nm)

# Create descompuestos
for item in fontaneria_data:
    target_p = target_prices[item['id']]
    # For simplicity, let's set MAT101 (precio 1) to match the required material cost, and MO07 (precio 35) + MO08 (precio 20) for mo.
    
    # Decide MO cost and MAT cost roughly.
    mo_val = item['mo']
    mat_val = item['mat']
    
    # Calculate exact mat_val and mo_val so that it perfectly hits target_p
    aplica_merma = (item['ud'] != 'ud') and (merma_pct > 0)
    factor = 1 + merma_pct if aplica_merma else 1.0
    
    # Adjust mo_val so mo_val + mat_val * factor = target_p
    mo_val = target_p - (mat_val * factor)
    
    item['mo'] = round(mo_val, 4)
    item['mat'] = round(mat_val, 4)
    
    # Now decompose MO into Official 1a (35/h) and Ayudante (20/h)
    # Just use Oficial 1a for everything to keep it simple, or combination
    # Let's just use MO07 to hit exactly mo_val
    rend_mo = round(mo_val / 35.0, 4)
    
    # And MAT101 (precio=1) to hit exactly mat_val
    rend_mat = round(mat_val / 1.0, 4)
    
    item['descompuesto'] = []
    
    if mo_val > 0:
        item['descompuesto'].append({
            "tipo": "mo",
            "codigo": "MO07",
            "desc": "Oficial 1ª fontanero",
            "ud": "h",
            "rend": rend_mo,
            "precio": 35
        })
        
    if mat_val > 0:
        item['descompuesto'].append({
            "tipo": "mat",
            "codigo": "MAT101",
            "desc": "Materiales de fontanería varios (tuberías, llaves, accesorios)",
            "ud": "PA",
            "rend": rend_mat,
            "precio": 1
        })
    
    # Make sure we don't duplicate items if running script multiple times
    existing_ids = [d['id'] for d in data['dataCoste']]
    if item['id'] not in existing_ids:
        data['dataCoste'].append(item)

# Sort dataCoste by id
data['dataCoste'] = sorted(data['dataCoste'], key=lambda x: x['id'])

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fontaneria added to alberto.json successfully.")
