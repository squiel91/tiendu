exports.subject = (user) => `${user.firstName}, bienvenido al Vimero.`

exports.body = (user) => `
<h2>¡Gracias ${user.firstName} por ser parte del Vivero!</h2>
<p>Estamos muy contentos de que seas parte de este proyecto.</p>
<p>Cualquier consulta, idea o recomendación no dudes en contactarnos.</p>
`
