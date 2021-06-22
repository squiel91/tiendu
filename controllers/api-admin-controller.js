const User = require('../models/User')

// Admin authentication
exports.adminAuth = async (req, res, next) => {
  if (req.session.userId) {
    req.user = await User.findById(req.session.userId)
    if (req.user.admin) next()
    else {
      return res
        .status(401)
        .json({ error: true, message: 'Only admin access' })
    }
  } else {
    return res
      .status(401)
      .json({ error: true, message: 'You need to be authenticated as an admin' })
  }
}
