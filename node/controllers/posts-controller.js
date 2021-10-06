const Post = require('../models/Post')

const postTemplate = require('../models/templates/post')
const { catchServerError } = require('../utils/errors')

const findBy = (handle, postId) => {
  if (handle) {
    return Post.findOne({ handle: postId }).populate('author')
  } else {
    return Post.findById(postId)
  }
}

exports.getPost = async (req, res, next) => {
  catchServerError(async () => {
    const post = await findBy(req.query.handle, req.params.postId).populate('cover')
  
    if (!post) return res.status(404).json({
      message: 'Post no encontrado.' 
    })
    
    if (!post.published && !req.user?.admin) return res.status(401).json({
      message: 'Unauthorized access (only admin can access unpublished posts)'
    })
  
    return res.json({
      post: postTemplate(post)
    })
  })
}

exports.getPosts = async (req, res, next) => {
  catchServerError(async () => {

    const page = req.query.page || 1
    const ITEMS_PER_PAGE = 6
    const publishedFilter = req.query.publishedOnly || !req.user?.admin ? { published: true } : {}
    const itemsCount = await Post.find(publishedFilter).countDocuments()
    
    const posts = await Post.find(publishedFilter)
      .populate('cover').populate('author')
      .sort({ updated: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    
    res.json({
      posts: posts.map(post => postTemplate(post)),
      pagination: {
        items: itemsCount,
        pages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
        current: page,
        from: ITEMS_PER_PAGE * (page - 1) + 1,
        to: Math.min(itemsCount, ITEMS_PER_PAGE * page),
        hasNext: ITEMS_PER_PAGE * page < itemsCount,
        hasPrev: page > 1
      }
    })
  })
}

exports.postPost = async (req, res, next) => {
  catchServerError(async () => {

    let post = new Post({
      title: req.body.title,
      handle: req.body.handle,
      cover: req.body.cover,
      author: req.user,
      content: req.body.content || undefined,
      published: req.body.published
    })
    post = await post.save()
    res.json({
      post: postTemplate(post)
    })
  })
}

exports.patchPost = async (req, res, next) => {
  catchServerError(async () => {
    const postId = req.params.postId
    const updatedData = req.body
    const post = await Post.findByIdAndUpdate(postId, updatedData, { new: true })
    res.json({
      post: postTemplate(post)
    })
  })
}

exports.deletePost = async (req, res) => {
  catchServerError(async () => {
    await Post.findByIdAndDelete(req.params.postId)
    res.json({})
  })
}