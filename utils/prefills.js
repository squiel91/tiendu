const { validationResult } = require('express-validator')

exports.create = (req) => {
  const fields = {}
  Object.entries(req.body).forEach(entry => fields[entry[0]] = { value: entry[1] })
  const validation = validationResult(req)
  validation.array().forEach(error => fields[error.param].error = error.msg)
  return [fields, validation.isEmpty()]
}

exports.retrive = (req) => {
  const prefillRaw = req.flash('prefill')
  const prefill = prefillRaw.length > 0? prefillRaw[0] : {}
  prefill.valueOfOr = function(field, ...values) {
    if (this[field] && (this[field].value || this[field].value === '')) return this[field].value
    else for (let value of values) if (values) return value;
    return ''
  }
  return prefill
}