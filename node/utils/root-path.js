const path = require('path')

module.exports = (...paths) => {
  return path.join(
    path.dirname(require.main.filename),
    ...paths
  )
}
