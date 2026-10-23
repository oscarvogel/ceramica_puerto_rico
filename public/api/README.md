# Configuración del endpoint de contacto (PHP)

Por seguridad, el archivo real `api/contact.php` valida el origen y aplica
honeypot + rate limit.

## Qué carga el endpoint, en este orden

1. `../vendor/autoload.php` — PHPMailer. En el hosting está en la raíz del
   docroot (`/vendor`), que es donde lo dejó la versión anterior de la web.
   Si no está, el endpoint no manda mail y pasa al modo log.
2. `api/config.php` — archivo **que no va al repo** (está en `.gitignore`).
   Define las constantes de SMTP. Si no está, el endpoint queda en modo log.

## Activar el envío por SMTP

Subir `api/config.php` al servidor con estas constantes:

```php
<?php
declare(strict_types=1);
define('CERAMICA_SMTP_ENABLED', true);
define('CERAMICA_SMTP_HOST', 'smtp.gmail.com');
define('CERAMICA_SMTP_PORT', 587);
define('CERAMICA_SMTP_SECURE', 'tls');
define('CERAMICA_SMTP_USER', 'cuenta@gmail.com');
define('CERAMICA_SMTP_PASS', '****');
define('CERAMICA_SMTP_FROM', 'cuenta@gmail.com');
define('CERAMICA_MAIL_TO', 'ventas@ceramicaptorico.com.ar');
```

El archivo es PHP (no `.env`): Apache lo ejecuta, así que la clave no se
descarga desde el navegador. Un `.env` en el docroot sí se puede descargar,
por eso no se usa.

## Modo log (sin SMTP)

Si no hay SMTP configurado, o si el envío falla, la consulta se guarda en un
log y la respuesta sigue siendo `ok`. El log **no** se escribe dentro del
docroot (contiene nombre, email y teléfono del cliente): se busca primero una
carpeta fuera de `public_html`, después el temporal del servidor y, como
último recurso, `api/logs/`. El `.htaccess` bloquea el acceso a `*.log`.

## Campos que acepta

`name`, `email`, `phone`, `profile`, `locality`, `message` y el honeypot
`website`.

`profile` es **opcional**: el formulario de la home no lo manda (el de
`/contacto` sí, y ahí el select es obligatorio). `message` sí es obligatorio
en los dos formularios.
