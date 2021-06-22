/* eslint-disable no-undef */
// {
//   method: POST [ default ] 
//   params: object
//   success: function (error)
//   error: function (object)
//   internalError: function (object)
// }
function showFieldErrors (fieldErrors) {
  for (const fieldError of fieldErrors) {
    const validatableInput = $(`.validatable-input.${fieldError.name}`)
    validatableInput.addClass('error')
    const errorTooltip = validatableInput.find('.secondlyErrorMessage')
    if (errorTooltip.length > 0) {
      const tippyInstance = errorTooltip[0]._tippy
      tippyInstance.setContent(fieldError.message)
      tippyInstance.show()
    }
  }
}

// eslint-disable-next-line no-unused-vars
function fetchApi (url, options) {
  $('.errorMessage').empty()

  const method = options.method || 'POST'
  const params = options.params
  const successCallback = options.success
  const errorCallback = options.error || function (data) {
    if (data.message) $('.errorMessage').text(data.message)
    if (data.fields) showFieldErrors(data.fields)
    if (options.executeOnError) options.executeOnError(data)
  }
  const internalErrorCallback = options.internalError || function (error) {
    $('.errorMessage').text(`There was an error: ${error.message}.`)
    console.error(error)
    if (options.executeOnError) options.executeOnError(error)
  }

  fetch(url, {
    method: method,
    credentials: 'same-origin',
    xhrFields: { withCredentials: true },
    headers: { 'Content-Type': 'application/json' },
    body: params ? JSON.stringify(params) : undefined
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.success) {
        if (successCallback) successCallback(data)
      } else {
        if (errorCallback) errorCallback(data)
      }
    })
    .catch(function (error) {
      if (error) internalErrorCallback(error)
    })
}

class Validator {
  constructor () {
    this.fieldErrors = []
  }

  check (variables, options) {
    Object.keys(variables).forEach(varName => {
      const varValue = variables[varName].trim()

      if (options.notEmpty && !varValue) {
        this.fieldErrors.push({
          name: varName,
          message: options.notEmpty.replace('_NAME', varName)
        })
      }

      // positive float
      if (options.isFloat && !/^[0-9]+(\.[0-9]*)?$/.test(varValue)) {
        this.fieldErrors.push({
          name: varName,
          message: options.isFloat.replace('_NAME', varName)
        })
      }

      if (options.isNatural && !/^[0-9]+$/.test(varValue)) {
        this.fieldErrors.push({
          name: varName,
          message: options.isFloat.replace('_NAME', varName)
        })
      }
    })
  }

  hasErrors () {
    return this.fieldErrors.length > 0
  }

  showErrors () {
    for (const fieldError of this.fieldErrors) {
      const validatableInput = $(`.validatable-input.${fieldError.name}`)
      validatableInput.addClass('error')
      const errorTooltip = validatableInput.find('.secondlyErrorMessage')
      if (errorTooltip.length > 0) {
        const tippyInstance = errorTooltip[0]._tippy
        tippyInstance.setContent(fieldError.message)
        tippyInstance.show()
      }
    }
  }

  reset () {
    this.fieldErrors = []
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function setButtonState (options) {
  const toDisableSelector = 'input:not(.dontDisable), select:not(.dontDisable), button:not(.dontDisable)'
  const statefullButton = $('button.statefull')
  if (options.loading) {
    this.originalText = statefullButton.html()
    statefullButton.text(options.loading).attr('disabled', true)
    $(toDisableSelector).prop('disabled', true)
  }
  if (options.default) {
    statefullButton.html(this.originalText).attr('disabled', false)
    $(toDisableSelector).prop('disabled', false)
  }
  if (options.success) {
    statefullButton.text(options.success).attr('disabled', true).addClass('success')
    if (options.callback) {
      setTimeout(function () {
        options.callback()
      }, 2000)
    }
  }
}