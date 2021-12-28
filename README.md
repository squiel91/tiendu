﻿<img alt="Tiendu" width="160" src="https://tiendu.uy/assets/tiendu-rainbow.png">

# Tiendu ecommerce

**La tienda online para las PyMEs uruguayas y la región. Especialmente diseñada para emprendimientos en crecimiento que buscan flexibilidad de adaptación y un costo reducido de mantenimiento.**
 
Podés ver la tienda demo (de un vivero) en [demo.tiendu.uy](https://demo.tiendu.uy/). Usá el email `demo@tiendu.uy` y contraseña `demo1234` en la [página de ingreso](https://demo.tiendu.uy/cuenta/ingresar) para acceder al panel de administrador. 

[<img src="https://dabuttonfactory.com/button.png?t=Ver+DEMO&f=Calibri-Bold&ts=18&tc=fff&hp=20&vp=12&c=4&bgt=unicolored&bgc=00f">](https://demo.tiendu.uy/)

> Para mantener la integridad de los datos de esta tienda, todos los endpoints de administración que modifican los datos (POST, PATCH, DELETE) se  deshabilitaron (no así los de los clientes).

#### Tema Tiendu
<img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo1.jpg"> <img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo3.jpg"> <img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo6.jpg"> <img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo7.jpg"> <img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo8.jpg">

#### Panel de administación
<img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo4.jpg"> <img alt="Tiendu" width="400" src="https://tiendu.uy/assets/demo5.jpg">

Se busca brindar una experiencia focalizada e intuitiva tanto para el comprador como para el administrador de la tienda, responsiva y optimizada para su uso en teléfonos móviles.

Se incluye las siguientes funcionalidades 'out-of-the-box':
- Panel de gestión para: órdenes, productos, categorías, páginas, cupones de descuento, etc.
- Seguimiento de stock
- Reseñas para los productos
- Redimensionado de imágenes (para hacer más ágil la carga)
- Integración de MercadoPago API para el checkout
- Subscripciones a newsletters
- Envío de notifiaciones por email a el comprador y administradores
- Blog

Desarrollada en Nodejs y Vuejs, utilizando MongoDB y MercadoPago. Bajo la premisa de desarroladores-primero, toda la plataforma de ecommerce es facilmente extensible y personalizable a los requerimientos de cada negocio.

Para un setup o desarrollo de una nueva funcionalidad por el mismo creador, visitá [www.tiendu.uy](https://tiendu.uy) o escribinos a [info@tiendu.uy](mailto:info@tiendu.uy).

## Requerimientos
- NodeJs >= 14.17.1 (LTS)
- MongoDB (escuchando en el puerto local 27017)

## Crear archivo .env
Este archivo debe crearse en la carpeta *node* (donde se encuentra *server.js*).
```
NODE_ENV=development
PORT=5001
# base de datos de MongoDB
DATABASE=tiendu
# Una frase segura para usar para el encriptado
JWT_SECRET=****

# credenciales test o producción
MERCADOPAGO_PUBLIC_KEY=****
MERCADOPAGO_ACCESS_TOKEN=****

# true o false, para enviar o no los emails a los administradores y usuarios. Si es falso no se deben especificar los parametros siguientes de email.
SEND_EMAIL=false

# email desde donde se mandan las notificaciones a los administradores (cuando hay una venta o un nuevo comentario)
ADMIN_EMAILS=admin@tiendu.uy

# recomendamos Zoho, siendo gratis para hasta 5 usuarios
EMAIL_PROVIDER=Zoho
# casilla de correo de la cuenta que se utiliza para enviar las notificaciones
SENDING_EMAIL=notificaciones@tiendu.uy
# password de la cuenta de email anterior
SENDING_EMAIL_PASS=****

```

## Ejecutar entorno de desarrollo
1. Instala Nodejs (>= 14.17.1) y MongoDB
2. Crea el *.env* descrito anteriormente dentro de la carpeta *node*.
3. Sustituye tu clave pública de MercadoPago en el onMounted del componente *vue/store/src/pages/checkout.page.vue* como se muestra a continuación:

```
onMounted (() => {
  ...
  mpScriptLoader.onload = () => {
    mercadopago = new MercadoPago('TEST-63d6274b-f524-4daf-803d-05b77fb4e4c2'); <<<---- Tu propia clave pública
    getIdentificationTypes()
  }
})
```

4. Posicionado en la carpeta *node* en la terminal:
   - Instala las dependencias del backend con `$ npm install`
   - Ejecuta el servidor Rest API de desarrollo con `$ npm run dev`
5. Posicionado en la carpeta *vue*:
   - Instalar las dependencias del frontend con `$ npm install`
   - Ejecuta el servidor (Vite) de desarrollo con `$ npm run dev`

**¡Ya debería estar funcionando tu ambiente de desarrollo!**

6. Entrá a localhost:3000 (puerto por defecto de Vite) para acceder a la tienda
7. Creas tu cuenta de administrador yendo a la [página de registro de usuario](http://localhost:3000/cuenta/registrarse) (el primer usuario siempre será el dueño de la tienda, pudiendo invitar a nuevos administradores y hacerlos dueños también).
8. Es tiempo de agregar algunos productos y categorías desde el [panel de administrador](http://localhost:3000/admin).
9. En el panel de personalización define los items del menú y las categorías que se van a mostrar en la página de inicio.

## Ejecutar en producción

Es ideal para instalarlo en un servidor virtual (como [Digital Ocean](https://www.digitalocean.com/) o [Linode](https://www.linode.com/)), con una base de datos Mongo instalada localmente. Es posible correrlo en [Heroku](https://www.heroku.com/), pero hay que conectarlo con una base de datos remota ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas), por ejemplo) y un CDN para guardar los archivos (ya que en este tipo de servicios el sistema de archivos es virtual y se borra cada cierto tiempo).

En tu servidor web:
1. Crea una carpeta llamada *tiendu* o con nombre de tu emprendimiento (sin espacios pero pudiendo usar guiones) dende almacenarás el código y lás imágenes subidas a tu tienda. Por convención se suele colocar la carpeta en *var/www/* en Linux.
2. Copia todos los archivos (menos *node_modules*) de la carpeta *node* de tu ambiente local de desarrollo a la carpeta que recién creaste en el servidor.
3. Actualizá el archivo *.env* que copiaste en tu servidor web con NODE_ENV=production, las credenciales de producción de MercadoPago y completar todos los datos de email para habilitar el envío de email, si es que ya no lo hiciste.
4. De nuevo en tu servidor local de desarrollo, posicionate en al carpeta *vue* con la terminal y corre `$ npm run build`. Estó va a crear los archivos del frontend de producción. Copia los nuevos archivos creados dentro de la carpeta *vue/dist* en la carpeta *tiendu/public* de tu servidor web. 
5. Instala Nodejs (>= 14.17.1) y MongoDB en tu servidor.
6. Posicionado en la carpeta con tu tienda en la terminal:
   - Instala las dependencias de producción con `$ npm install --only=prod`
   - Ejecuta el servidor Rest API de desarrollo con `$ npm run prod` (podes chequear el status de la app en todo momento corriendo `$ pm2 list`)

**¡En teoría ya debería estar funcionando tu tienda!**

7. Ahora para que sea accesible a través de internet resta configurar:
   - Tu dominio para que apunte a tu servidor.
   - Un reverse proxy para redireccionar los pedidios al servidor de tu tienda (por ejemplo NGINX).
8. Sigue los pasos 7, 8 y 9 del ambiente desarrollo para subir tus productos y personalzar tu nueva tienda.

## Funcionalidades en camino

- [x] Blog
- [ ] Utilización de un linter estandar
- [ ] División de frontend y backoffice en dos Vue apps
- [ ] Metadata para redes sociales (Facebook, Instagram, Whatsapp)
- [ ] Refactoreo del código (comentarios explicativos, typescript, Vue composition API en todo componente)
- [ ] Optimización de los índices de Mongo
- [ ] Posibilidad de ofrecer productos digitales
- [ ] Módulo de estadísticas
- [ ] Metadata de productos para Google
- [ ] Agregar posibilidad para configurar diferentes opciones de envío
- [ ] Agregar opción de PayPal como gateway de pago
- [ ] Atención a hooks de MercadoPago
- [ ] Cambiar a paradigma de TTD
- [ ] Guía de uso
- [ ] Guía para el desarrollo

### ¿Querés colaborar?
Tiendu está en constante evolución y te invitamos a sumarte de forma activa a este proceso. Si descubrís un bug o queres proponer una nueva funcionalidad, no dudes en abrir una issue en GitHub, o mejor aún, hacer un Pull Request con la modificación. Si querés comunicarte con nosotros lo podés haces escribiéndonos a [open@tiendu.uy](mailto:open@tiendu.uy).

## Cambios
### Versión 2.0.1
- Cambiamos a Swiper para mostrar las imágenes de los productos.

### Versión 2.0.0
- Frontend de la tienda portado a Vuejs, dejando de utlizar Ejs completamente.
- Ahora se pueden escribir blogposts.
- Nuevo rediseño del tema principal de la tienda.

### Versión 1.2.2
- Nuevo menú contextual de administrador: ahora se puede acceder directamente a la edición de productos, categorias, páginas y órdenes desde la tienda).
- Los productos se muestran en lineas enteras, y no quedan 4 cuando hay linea de 3, por ejemplo.
- Se limita la cantidad de productos a mostrar en las categorías de la homepage (a 6), al igual que los productos destacados.

### Versión 1.2.1
- Ahora las variantes tiene una imágen asociada.
- Ahora se pueden subir múltiples imágenes al mismo tiempo.
- Rediseño de selector de imágenes.
- Los previews de los productos carga la imágen chica, precarga las grandes. 

### Versión 1.2.0
- Zoom sobre las imágenes de productos al pasar el mouse por arriba.
- Selección de variantes, un selector por opción.
- Fix varios (incluido aliniación de campos de ingresos de datos en Safari).

## Licencia
[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html), incluida todo tipo de usos comerciales. Para todas las instalaciones por terceros, es requerido agregar el mensaje: "Tienda creada usando [Tiendu](https://tiendu.uy/)." (incluido el link) al final de todas las páginas en la tienda online. Recomendamos agregarlo simplemente en el footer. Todas las versiones derivadas deben incluir esta misma licencia.
