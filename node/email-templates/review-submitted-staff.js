exports.subject = (user) => `NUEVA RESEÑA de ${user.firstName} ${user.lastName}`

exports.body = (user, product, valuation, review) => `
<p><a href="https://tiendu.uy/admin/usuarios/${user.id}">${user.firstName} ${user.lastName}</a> ha agregado una nueva reseña en
<a href="https://tiendu.uy/productos/${product.handle}">${product.title}</a></p>
<p>
  ${valuation} estrella${valuation === 1 ? '' : 's'}:<br>
  ---------<br>
  ${review}
  <br>---------
</p>
`
