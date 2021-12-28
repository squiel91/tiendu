const MILLIS_IN_DAY = 86400000

// user is sent (optionally) so to identify their own reviews
module.exports = (review, user) => {
  const rawDaysFromNow = (Date.now() - review.created.getTime()) / MILLIS_IN_DAY
  let timeLiteral
  const daysFromNow = Math.floor(rawDaysFromNow)
  if (daysFromNow < 1) timeLiteral = 'hace un momento'
  else {
    if (daysFromNow === 1) {
      timeLiteral = 'ayer'
    } else {
      timeLiteral = `hace ${daysFromNow} dias`
    }
  }

  return {
    id: review.id,
    isAuthor: user?._id.equals((review.user?._id || review.user) ) || undefined,
    author: review.name,
    value: review.value,
    comment: review.comment,
    created: timeLiteral,
    prodTitle: review.prodTitle,
    prodHandle: review.prodHandle
  }
}