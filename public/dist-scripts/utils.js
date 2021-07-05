'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-undef */
// {
//   method: POST [ default ] 
//   params: object
//   success: function (error)
//   error: function (object)
//   internalError: function (object)
// }
function showFieldErrors(fieldErrors) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fieldErrors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fieldError = _step.value;

      var validatableInput = $('.validatable-input.' + fieldError.name);
      validatableInput.addClass('error');
      var errorTooltip = validatableInput.find('.secondlyErrorMessage');
      if (errorTooltip.length > 0) {
        var tippyInstance = errorTooltip[0]._tippy;
        tippyInstance.setContent(fieldError.message);
        tippyInstance.show();
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
function fetchApi(url, options) {
  $('.errorMessage').empty();

  var method = options.method || 'POST';
  var params = options.params;
  var successCallback = options.success;
  var errorCallback = options.error || function (data) {
    if (data.message) $('.errorMessage').text(data.message);
    if (data.fields) showFieldErrors(data.fields);
    if (options.executeOnError) options.executeOnError(data);
  };
  var internalErrorCallback = options.internalError || function (error) {
    $('.errorMessage').text('There was an error: ' + error.message + '.');
    console.error(error);
    if (options.executeOnError) options.executeOnError(error);
  };

  fetch(url, {
    method: method,
    credentials: 'same-origin',
    xhrFields: { withCredentials: true },
    headers: { 'Content-Type': 'application/json' },
    body: params ? JSON.stringify(params) : undefined
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.success) {
      if (successCallback) successCallback(data);
    } else {
      if (errorCallback) errorCallback(data);
    }
  }).catch(function (error) {
    if (error) internalErrorCallback(error);
  });
}

var Validator = function () {
  function Validator() {
    _classCallCheck(this, Validator);

    this.fieldErrors = [];
  }

  _createClass(Validator, [{
    key: 'check',
    value: function check(variables, options) {
      var _this = this;

      Object.keys(variables).forEach(function (varName) {
        var varValue = variables[varName].trim();

        if (options.notEmpty && !varValue) {
          _this.fieldErrors.push({
            name: varName,
            message: options.notEmpty.replace('_NAME', varName)
          });
        }

        // positive float
        if (options.isFloat && !/^[0-9]+(\.[0-9]*)?$/.test(varValue)) {
          _this.fieldErrors.push({
            name: varName,
            message: options.isFloat.replace('_NAME', varName)
          });
        }

        if (options.isNatural && !/^[0-9]+$/.test(varValue)) {
          _this.fieldErrors.push({
            name: varName,
            message: options.isFloat.replace('_NAME', varName)
          });
        }
      });
    }
  }, {
    key: 'hasErrors',
    value: function hasErrors() {
      return this.fieldErrors.length > 0;
    }
  }, {
    key: 'showErrors',
    value: function showErrors() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.fieldErrors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var fieldError = _step2.value;

          var validatableInput = $('.validatable-input.' + fieldError.name);
          validatableInput.addClass('error');
          var errorTooltip = validatableInput.find('.secondlyErrorMessage');
          if (errorTooltip.length > 0) {
            var tippyInstance = errorTooltip[0]._tippy;
            tippyInstance.setContent(fieldError.message);
            tippyInstance.show();
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.fieldErrors = [];
    }
  }]);

  return Validator;
}();

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function setButtonState(options) {
  var toDisableSelector = 'input:not(.dontDisable), select:not(.dontDisable), button:not(.dontDisable)';
  var statefullButton = $('button.statefull');
  if (options.loading) {
    this.originalText = statefullButton.html();
    statefullButton.text(options.loading).attr('disabled', true);
    $(toDisableSelector).prop('disabled', true);
  }
  if (options.default) {
    statefullButton.html(this.originalText).attr('disabled', false);
    $(toDisableSelector).prop('disabled', false);
  }
  if (options.success) {
    statefullButton.text(options.success).attr('disabled', true).addClass('success');
    if (options.callback) {
      setTimeout(function () {
        options.callback();
      }, 2000);
    }
  }
}