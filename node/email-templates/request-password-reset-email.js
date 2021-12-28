exports.subject = () => 'Solicitud de nueva Contraseña'

exports.body = (token, urlHead) => `
<h2>Alguien pidió resetear tu contraseña</h2>
<p><b>¡No reenvies nunca este email!</b></p>
<p>Si fuiste vos, seguí el siguiente link (o copialo en tu navegador preferido) <a href="${urlHead}/cuenta/restablecer/${token}">${urlHead}/cuenta/restablecer/${token}</a> para restablecer tu contraseña.
Si este link no functiona, :</p>
<p>El link es solo válido por una hora.</p>
`
