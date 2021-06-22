module.exports = subscription => {
  return {
    id: subscription.id,
    email: subscription.email,
    since: subscription.updated?.toLocaleDateString('es-UY')
  }
}
