# Tiendu

La tienda online minimalista para Uruguay y el resto de Latinoamérica.
Desarrollada en Nodejs y Vuejs, utilizando MongoDB y MercadoPago. Bajo la premisa de desarroladores-primero, toda la plataforma es facilmente extensible y personalizable a diferentes requerimientos.

Se buscó brindar una experiencia focalizada e intuitiva tanto para el comprador como para el administrador de la tienda, sobre todo pensada para telefonos móviles.

Se incluye las siguientes funcionalidades 'out-of-the-box':
- Panel de gestión para: órdenes, productos, categorías, páginas, cupones de descuento, etc.
- Reseñas para los productos
- Redimensionado de imágenes (para hacer más ágil la carga)
- Integración de MercadoPago API para el checkout
- Subscripciones a newsletters (y la posibilidad de bajarlos en un CSV)

Para un setup o desarrollo de una nueva funcionalidad por el mismo creador, visitá [www.tiendu.uy](https://tiendu.uy) o escribinos a [info@tiendu.uy](mailto:info@tiendu.uy).

## Crear archivo .env
Este archivo debe crearse en la carpeta root del proyecto (donde se encuentra server.js).
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

## Licencia
GNU GPLv3, incluida todo tipo de usos comerciales. Para todas las instalaciones por terceros, es requerido agregar el mensaje: "Tienda creada usando [Tiendu](https://tiendu.uy/)." (incluido el link) al final de todas las páginas en la tienda online. Recomendamos agregarlo simplemente en el footer. Todas las versiones derivadas deben incluir esta misma licencia.
