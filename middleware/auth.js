exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.redirect('/cuenta')
  if (req.user.admin) next()
  else res.redirect('/')
}

exports.isCustomer = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/cuenta')
  }
}
