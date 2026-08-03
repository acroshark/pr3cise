<?php
// Evita el listado del directorio si el servidor lo tuviera activado.
http_response_code(403);
exit('Acceso denegado.');
