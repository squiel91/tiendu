const User = require('../models/User')
const stdRes = require('../utils/errors')
const userTemplate = require('../models/templates/user')

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)

    // TODO: only admins can access not listed
    if (!user) return stdRes._400(res, 'user not found')

    res.json({
      user: userTemplate(user)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

// NOT populated with it's products
exports.getUsers = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6
    const itemsCount = await User.find().countDocuments()

    const withPagination = req.query.all?.toLowerCase() !== 'true'
    // TODO: if not admin find({ listed: true })
    let users;
    if (withPagination) {
      users = await User.find()
        .sort({ updated: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    } else {
      users = await User.find().sort({ updated: -1 })
    }

    res.json({
      users: users?.map(user => userTemplate(user)),
      // eslint-disable-next-line multiline-ternary
      pagination: withPagination ? {
        items: itemsCount,
        pages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
        current: page,
        from: ITEMS_PER_PAGE * (page - 1) + 1,
        to: Math.min(itemsCount, ITEMS_PER_PAGE * page),
        hasNext: ITEMS_PER_PAGE * page < itemsCount,
        hasPrev: page > 1
      } : undefined
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.postUser = async (req, res, next) => {
  try {
    const email = req.body.email
    const duplicatedUser = await User.findOne({ email })
    if (duplicatedUser) return stdRes._400(res, 'email', 'There is already an user with that email')

    const passHash = await bcrypt.hash(req.body.password, 10)

    const firstUser = await User.countDocuments() === 0
    // TODO: add the owner param and check if the logged in user is a owner also.
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email,
      admin: req.body.admin? { owner: false } : undefined,
      passHash
    })
    user = await user.save()
    res.json({
      user: userTemplate(user)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.patchUser = async (req, res, next) => {
  try {
    // TODO: owner users cannot be change back to not admins
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      req.body
    )
    res.json({
      user: userTemplate(user)
    })
  } catch (error) { stdRes._500(res, error.message) }
}

exports.deleteUser = async (req, res, next) => {
  try {
    // TODO: owner users cannot be removed
    await User.findByIdAndDelete(req.params.userId)
    res.json({})
  } catch (error) { stdRes._500(res, error.message) }
}

exports.getEmailExist = async (req, res, next) => {
  try {
    const email = req.query.email
    const customer = await User.findOne({ email })
    res.json({
      exist: customer !== null
    })
  } catch (error) { stdRes._500(res, error.message) }
}