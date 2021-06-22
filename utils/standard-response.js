// if message empty, then a general message is send
exports._400 = (res, name, message) => {
  if (!message) {
    message = name
    return res.status(400).json({
      error: true,
      message
    })
  } else {
    return res.status(400).json({
      error: true,
      fields: [
        { name, message }
      ]
    })
  }
}

exports._500 = (res, message) => {
  return res.status(400).json({
    error: true,
    message: `Error en el servidor: ${message}`
  })
}
