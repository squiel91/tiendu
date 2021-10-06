// if message empty, then a general message is send
exports._400 = (res, name, message) => {
  if (!message) {
    message = name
    return res.status(400).json({
      message,
      error: message
    })
  } else {
    return res.status(400).json({
      fields: [
        { name, message }
      ]
    })
  }
}

exports._500 = (res, message) => {
  return res.status(500).json({
    error: `Error en el servidor: ${message}`
  })
}

exports.catchServerError = (handler) => {
  try {
    handler()
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message
    })
  }
}