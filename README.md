<img alt="Tiendu" width="160" src="https://tiendu.uy/assets/tiendu-rainbow.png">

# Tiendu Ecommerce

**La tienda online minimalista para las PyMEs uruguayas.**

Especialmente diseñada para emprendimientos en crecimiento que buscan flexibilidad y un costo reducido de mantenimiento. Desarrollada en Nodejs y Vuejs, utilizando MongoDB y MercadoPago. Bajo la premisa de desarroladores-primero, toda la plataforma de ecommerce es facilmente extensible y personalizable a los requerimientos de cada negocio.

Podés ver la tienda demo en [demo.tiendu.uy](https://demo.tiendu.uy/). Usá el email `demo@tiendu.uy` y contraseña `demo1234` para ingresar y acceder al menú de administrador. Para mantener la integridad de los datos de esta tienda, todos los endpoints de administración que modifican los datos (POST, PATCH, DELETE) se  deshabilitaron (no así los de los clientes).

Se busca brindar una experiencia focalizada e intuitiva tanto para el comprador como para el administrador de la tienda, optimizada para su uso en teléfonos móviles.

Se incluye las siguientes funcionalidades 'out-of-the-box':
- Panel de gestión para: órdenes, productos, categorías, páginas, cupones de descuento, etc.
- Reseñas para los productos
- Redimensionado de imágenes (para hacer más ágil la carga)
- Integración de MercadoPago API para el checkout
- Subscripciones a newsletters

Para un setup o desarrollo de una nueva funcionalidad por el mismo creador, visitá [www.tiendu.uy](https://tiendu.uy) o escribinos a [info@tiendu.uy](mailto:info@tiendu.uy).

## Crear archivo .env
Este archivo debe crearse en la carpeta root del proyecto (donde se encuentra *server.js*).
```
NODE_ENV=development
PORT=5001
DATABASE=tiendu # base de datos de MongoDB
SESSION_SECRET=**** # some strong password to protect sessions 
SEND_EMAIL=false # o true, para enviar o no los emails a los administradores y usuarios. Si es falso no se deben especificar los parametros siguientes de email.

ADMIN_EMAILS=admin@tiendu.uy # email desde donde se mandan las notificaciones

EMAIL_PROVIDER=Zoho # remcomendamos Zoho, siendo gratis para hasta 5 usuarios
SENDING_EMAIL=notificaciones@tiendu.uy # casilla de correo de la cuenta que se utiliza para enviar las notificaciones
SENDING_EMAIL_PASS=**** # password de la cuenta de email anterior

MERCADOPAGO_PUBLIC_KEY=**** # test o producción
MERCADOPAGO_ACCESS_TOKEN=**** # test o producción
```

## Ejecutar entorno de desarrollo
1. Debe estar instalado Nodejs y MongoDB
2. Crear el .env descrito anteriormente
3. `$ npm install`
4. `$ npm run dev`
5. Entrá a localhost:5001 (o el puerto que se haya especificado en el .env) para acceder a la tienda

## Ejecutar en producción
1. Debe estar instalado Nodejs y MongoDB y Pm2 (administrador de procesos para producción)
2. Crear el .env descrito anteriormente (con las claves de producción de MercadoPago)
3. `$ npm install --only=prod`
4. `$ npm run prod`
5. Ahora solo resta configurar el reverse proxy (por ejemplo NGINX).

## ¿Querés colaborar?
Tiendu está en constante evolución y te invitamos a sumarte de forma activa a este proceso. Si descubrís un bug o queres proponer una nueva funcionalidad, no dudes en abrir una issue en GitHub, o mejor aún, hacer un Pull Request con la modificación. Si querés comunicarte con nosotros lo podés haces escribiéndonos a [open@tiendu.uy](mailto:open@tiendu.uy).

### Funcionalidades pendientes
- Agregar un blog, pudiendo escribir entradas de blog y ver todo el listado en *dominio-de-la-tienda.com/blog*.
- Descargar los usuarios subscriptos en un CSV tocando un botón

## Licencia
[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html), incluida todo tipo de usos comerciales. Para todas las instalaciones por terceros, es requerido agregar el mensaje: "Tienda creada usando [Tiendu](https://tiendu.uy/)." (incluido el link) al final de todas las páginas en la tienda online. Recomendamos agregarlo simplemente en el footer. Todas las versiones derivadas deben incluir esta misma licencia.
