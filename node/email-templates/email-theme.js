exports.head = () => `
<html>
  <head>
    <style>
      .email__header {
        background-color: #5f9061;
        color: white;
        padding: 16px;
        border-radius: 4px;
        font-weight: bold;
      }

      .content-body {
        padding: 16px;
      }

      a {
        color: #5f9061;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="email__header">VIVERO</div>
    <div class="content-body">
`

exports.tail = () => `
      <br>
      <img style="width: 100px" alt="logo del Vivero" src="http://localhost:9000/assets/algo%20(4).svg">
      <p style="font-style: italic;">Equipo del Vivero</p>
      Tienda: <a href="https://tiendu.uy/">www.tiendu.uy</a><br>
      Email: <a href="mailto:info@tiendu.uy">info@tiendu.uy</a><br>
      Teléfono: <a href="tel:099579667">099 579 667</a><br>
      WhatsApp: <a href="https://api.whatsapp.com/send?phone=59899579667">presiona aquí</a><br>
    </div>
  </body>
</html>
`
