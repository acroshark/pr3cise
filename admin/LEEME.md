# Panel de administración — PR3CISE

Panel privado para consultar las empresas captadas (leads) y el estado del
outreach. Hecho en PHP para que funcione en el mismo hosting que la web.

---

## Acceso

**URL:** `https://pr3cise.com/admin/`
**Contraseña:** ver el gestor de contraseñas (no se guarda aquí en texto plano).

Para **cambiar la contraseña**, genera un hash nuevo y pégalo en `config.php`:

```bash
php -r 'echo password_hash("TU_NUEVA_CLAVE", PASSWORD_DEFAULT);'
```

---

## Subida al servidor (FTP)

1. Sube la carpeta `admin/` completa a tu espacio web (junto a `index.html`).

2. **Sube la base de datos FUERA de la carpeta pública.** En OVH tu espacio
   suele ser `/home/tuusuario/www`, así que la BD va en:

   ```
   /home/tuusuario/pr3cise_data/pr3cise.db
   ```

   Así es **imposible** descargarla desde internet. El panel la busca ahí
   automáticamente.

   > Si no puedes subir fuera de `www`, ponla en `admin/data/pr3cise.db`. Ahí
   > funciona igual, pero la protección depende del `.htaccess` — menos seguro.

3. Comprueba que entras en `https://pr3cise.com/admin/`.

---

## Actualizar los datos

El panel lee una **copia** de la base de datos del bot. Cuando captes o
contactes empresas nuevas, sube el fichero actualizado:

```
Origen : M:\OneDrive\Clear Ascend OÜ\Scrapper Bot2\pr3cise.db
Destino: /home/tuusuario/pr3cise_data/pr3cise.db
```

---

## Qué muestra

- **Estadísticas**: empresas captadas, con email, pendientes, contactadas,
  respondidas y favoritas (se recalculan según los filtros aplicados).
- **Tabla de empresas** con web, email, teléfono, oficio y estado.
- **Filtros**: país, ciudad, oficio, estado, favoritas y buscador libre.
- **Resumen por mercado** y **últimos envíos** realizados.

### Estados de un lead
| Estado | Significado |
|---|---|
| `nuevo` | Captado, sin email todavía |
| `enriquecido` | Tiene email, aún no contactado |
| `contactado` | Se le envió el email |
| `respondido` | Ha contestado |
| `sin_web` | Se buscó su web y no se encontró |
| `descartado` | Fuera de sector (proveedor, jardinería…) |
| `muerto` | Email inválido / rebotado |

---

## Seguridad

- La contraseña se guarda **hasheada** (bcrypt), nunca en texto plano.
- Sesión de 8 horas, cookie `HttpOnly` + `SameSite=Strict`.
- Página marcada `noindex, nofollow`: no aparece en Google.
- La carpeta `admin/data/` está bloqueada por `.htaccess` e `index.php`.
- La base de datos, si se sube fuera del web root, es inaccesible por URL.

**No subas `config.php` a repositorios públicos** (contiene el hash).
