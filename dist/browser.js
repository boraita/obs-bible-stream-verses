/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/broadcastChannels.js":
/*!***************************************!*\
  !*** ./src/core/broadcastChannels.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bgContent: () => (/* binding */ bgContent),
/* harmony export */   channel: () => (/* binding */ channel),
/* harmony export */   settingsChannel: () => (/* binding */ settingsChannel)
/* harmony export */ });
var bgContainer = document.getElementById("bg-container");
var messageDisplay = document.getElementById("messageDisplay");
var channel = new BroadcastChannel("myChannel");
var bgContent = new BroadcastChannel("bgContent");
var settingsChannel = new BroadcastChannel("settings");
var savedTitleColor = localStorage.getItem('titleColor');

// Text channel
channel.onmessage = function (event) {
  var message = event.data;
  messageDisplay.innerHTML = message;
  localStorage.setItem('savedMessage', message);
  if (savedTitleColor) {
    var dspans = document.querySelectorAll("#messageDisplay span");
    dspans.forEach(function (dspan) {
      return dspan.style.color = savedTitleColor;
    });
  }
};

// settings channel
settingsChannel.onmessage = function (event) {
  var _Object$keys;
  switch ((_Object$keys = Object.keys(event.data)) === null || _Object$keys === void 0 ? void 0 : _Object$keys[0]) {
    case 'selectedFont':
      var selectedFont = event.data['selectedFont'];
      bgContainer.style.fontFamily = selectedFont;
      localStorage.setItem('fontFamily', selectedFont);
      break;
    case 'opacityColor':
      var opacityColor = event.data['opacityColor'];
      bgContainer.style.backgroundColor = opacityColor;
      localStorage.setItem('bgColor', opacityColor);
      break;
    case 'roundedCorner':
      var roundedCorner = event.data['roundedCorner'];
      bgContainer.style.borderRadius = roundedCorner + "px";
      localStorage.setItem('borderRadius', roundedCorner);
      break;
    case 'selectedBgColor':
      var selectedBgColor = event.data['selectedBgColor'];
      bgContainer.style.backgroundColor = selectedBgColor;
      localStorage.setItem('bgColor', selectedBgColor);
      break;
    case 'selectedFontColor':
      var selectedFontColor = event.data['selectedFontColor'];
      bgContainer.style.color = selectedFontColor;
      localStorage.setItem('fontColor', selectedFontColor);
      break;
    case 'selectedTitleColor':
      var selectedTitleColor = event.data['selectedTitleColor'];
      var spans = document.querySelectorAll("#messageDisplay span");
      spans.forEach(function (span) {
        return span.style.color = selectedTitleColor;
      });
      localStorage.setItem('titleColor', selectedTitleColor);
      break;
    case 'currentBoldState':
      var currentBoldState = event.data['currentBoldState'];
      messageDisplay.style.fontWeight = currentBoldState;
      localStorage.setItem('boldState', currentBoldState);
      break;
    case 'currentItalicState':
      var currentItalicState = event.data['currentItalicState'];
      messageDisplay.style.fontStyle = currentItalicState;
      localStorage.setItem('italicState', currentItalicState);
      break;
    case 'currentUnderlineState':
      var currentUnderlineState = event.data['currentUnderlineState'];
      messageDisplay.style.textDecoration = currentUnderlineState;
      localStorage.setItem('underlineState', currentUnderlineState);
      break;
    case 'selectedTextAlignment':
      var selectedTextAlignment = event.data['selectedTextAlignment'];
      messageDisplay.style.textAlign = selectedTextAlignment;
      localStorage.setItem('textAlign', selectedTextAlignment);
      break;
  }
};

// container hidden or shown
bgContent.onmessage = function (event) {
  if (event.data === 'hidden') {
    bgContainer.style.display = 'none';
  } else {
    bgContainer.style.display = 'inline';
  }
};


/***/ }),

/***/ "./src/core/browser_app.js":
/*!*********************************!*\
  !*** ./src/core/browser_app.js ***!
  \*********************************/
/***/ (() => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function hasVerticalScroll() {
  return document.documentElement.clientHeight < document.documentElement.scrollHeight;
}
function adjustFontSizeBasedOnScroll() {
  // Get the message element by its ID
  var message = document.getElementById('messageDisplay');

  // Get the current font size
  var fontSize = parseInt(window.getComputedStyle(message).fontSize);

  // Check if there is vertical scroll
  if (hasVerticalScroll()) {
    while (hasVerticalScroll() && fontSize > 1) {
      fontSize -= 1;
      message.style.fontSize = fontSize + 'px';
    }
  } else {
    while (!hasVerticalScroll() && fontSize < 90) {
      fontSize += 1;
      message.style.fontSize = fontSize + 'px';
      if (hasVerticalScroll()) {
        fontSize -= 1;
        message.style.fontSize = fontSize + 'px';
        break;
      }
    }
  }
}

// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
  var _iterator = _createForOfIteratorHelper(mutationsList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mutation = _step.value;
      if (mutation.type === 'childList' && mutation.target.id === 'messageDisplay') {
        // Call the function to adjust font size
        adjustFontSizeBasedOnScroll();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

// Create a new MutationObserver instance
var observer = new MutationObserver(handleMutation);

// Start observing changes in the inner HTML of the <p> element
observer.observe(document.getElementById('messageDisplay'), {
  childList: true
});

/***/ }),

/***/ "./src/core/load_settings.js":
/*!***********************************!*\
  !*** ./src/core/load_settings.js ***!
  \***********************************/
/***/ (() => {

// Check if a background color is saved in localStorage
var savedBgColor = localStorage.getItem('bgColor');
var savedFontFamily = localStorage.getItem('fontFamily');
var savedFontColor = localStorage.getItem('fontColor');
var savedBorderRadius = localStorage.getItem('borderRadius');
var savedTitleColor = localStorage.getItem('titleColor');
var savedMessage = localStorage.getItem('savedMessage');
var savedBoldState = localStorage.getItem('boldState');
var savedItalicState = localStorage.getItem('italicState');
var savedUnderlineState = localStorage.getItem('underlineState');
var savedTextAlign = localStorage.getItem('textAlign');
var bgContainer = document.getElementById("bg-container");
if (savedMessage) {
  messageDisplay.innerHTML = savedMessage;
}
if (savedBgColor) {
  bgContainer.style.backgroundColor = savedBgColor;
}
if (savedFontFamily) {
  bgContainer.style.fontFamily = savedFontFamily;
}
if (savedFontColor) {
  messageDisplay.style.fontColor = savedFontColor;
}
if (savedBorderRadius) {
  bgContainer.style.borderRadius = savedBorderRadius;
}
if (savedTitleColor) {
  var dspans = document.querySelectorAll("#messageDisplay span");
  dspans.forEach(function (dspan) {
    return dspan.style.color = savedTitleColor;
  });
}
if (savedBoldState) {
  messageDisplay.style.fontWeight = savedBoldState;
}
if (savedItalicState) {
  messageDisplay.style.fontStyle = savedItalicState;
}
if (savedUnderlineState) {
  messageDisplay.style.textDecoration = savedUnderlineState;
}
if (savedTextAlign) {
  messageDisplay.style.textAlign = savedTextAlign;
}

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./src/styles/browser_style.css":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./src/styles/browser_style.css ***!
  \*******************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

body{
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    overflow-y: hidden;
}

.bg-container{
    width: 100%;
    height: 100%;
    background-color: rgb(201, 201, 201);
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    text-align: center;
    margin: 0;
    padding: 0.1em;
    overflow-y: hidden;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
   
#messageDisplay {
    opacity: 1;
    font-size: 5em;
    font-weight: bold;
    text-align: center;
    margin: 0;
    padding: 50px 100px;
    width: 100%;
    white-space: pre-wrap;
    overflow-y: hidden;
}

#messageDisplay span{
    color: #ff6450;
    overflow-y: hidden;
    opacity: 1;
}

#messageDisplay ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow-y: hidden;
}




`, "",{"version":3,"sources":["webpack://./src/styles/browser_style.css"],"names":[],"mappings":"AAAA;IACI,SAAS;IACT,UAAU;IACV,sBAAsB;EACxB;;AAEF;IACI,kCAAkC;IAClC,WAAW;IACX,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,qBAAqB;IACrB,aAAa;IACb,SAAS;IACT,UAAU;IACV,uBAAuB;IACvB,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,oCAAoC;IACpC,aAAa;IACb,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,kBAAkB;IAClB,SAAS;IACT,cAAc;IACd,kBAAkB;IAClB,UAAU;IACV,aAAa;IACb,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,UAAU;IACV,cAAc;IACd,iBAAiB;IACjB,kBAAkB;IAClB,SAAS;IACT,mBAAmB;IACnB,WAAW;IACX,qBAAqB;IACrB,kBAAkB;AACtB;;AAEA;IACI,cAAc;IACd,kBAAkB;IAClB,UAAU;AACd;;AAEA;IACI,qBAAqB;IACrB,SAAS;IACT,UAAU;IACV,kBAAkB;AACtB","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n  }\r\n\r\nbody{\r\n    background-color: rgba(0, 0, 0, 0);\r\n    color: #fff;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    align-content: center;\r\n    height: 100vh;\r\n    margin: 0;\r\n    padding: 0;\r\n    font-family: sans-serif;\r\n    overflow-y: hidden;\r\n}\r\n\r\n.bg-container{\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgb(201, 201, 201);\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.container {\r\n    text-align: center;\r\n    margin: 0;\r\n    padding: 0.1em;\r\n    overflow-y: hidden;\r\n    opacity: 1;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n   \r\n#messageDisplay {\r\n    opacity: 1;\r\n    font-size: 5em;\r\n    font-weight: bold;\r\n    text-align: center;\r\n    margin: 0;\r\n    padding: 50px 100px;\r\n    width: 100%;\r\n    white-space: pre-wrap;\r\n    overflow-y: hidden;\r\n}\r\n\r\n#messageDisplay span{\r\n    color: #ff6450;\r\n    overflow-y: hidden;\r\n    opacity: 1;\r\n}\r\n\r\n#messageDisplay ul{\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow-y: hidden;\r\n}\r\n\r\n\r\n\r\n\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js ***!
  \********************************************************************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \***************************************************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/browser_style.css":
/*!**************************************!*\
  !*** ./src/styles/browser_style.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./browser_style.css */ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./src/styles/browser_style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*************************************************************************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***************************************************************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \********************************************************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**************************************************************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************!*\
  !*** ./src/public/browser/browser.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_browser_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../styles/browser_style.css */ "./src/styles/browser_style.css");
/* harmony import */ var _core_broadcastChannels_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/broadcastChannels.js */ "./src/core/broadcastChannels.js");
/* harmony import */ var _core_browser_app_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/browser_app.js */ "./src/core/browser_app.js");
/* harmony import */ var _core_browser_app_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_browser_app_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_load_settings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/load_settings.js */ "./src/core/load_settings.js");
/* harmony import */ var _core_load_settings_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_load_settings_js__WEBPACK_IMPORTED_MODULE_3__);




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBd0M7QUFDQztBQUNOIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2JzLWJpYmxlLXBsdWdpbi8uL3NyYy9jb3JlL2Jyb2FkY2FzdENoYW5uZWxzLmpzIiwid2VicGFjazovL29icy1iaWJsZS1wbHVnaW4vLi9zcmMvY29yZS9icm93c2VyX2FwcC5qcyIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luLy4vc3JjL2NvcmUvbG9hZF9zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luLy4vc3JjL3N0eWxlcy9icm93c2VyX3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luLy4vbm9kZV9tb2R1bGVzLy5wbnBtL2Nzcy1sb2FkZXJANy4xLjFfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luLy4vbm9kZV9tb2R1bGVzLy5wbnBtL2Nzcy1sb2FkZXJANy4xLjFfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vb2JzLWJpYmxlLXBsdWdpbi8uL3NyYy9zdHlsZXMvYnJvd3Nlcl9zdHlsZS5jc3M/NzNmNiIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luLy4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWxvYWRlckA0LjAuMF93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vb2JzLWJpYmxlLXBsdWdpbi8uL25vZGVfbW9kdWxlcy8ucG5wbS9zdHlsZS1sb2FkZXJANC4wLjBfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luLy4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWxvYWRlckA0LjAuMF93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vb2JzLWJpYmxlLXBsdWdpbi8uL25vZGVfbW9kdWxlcy8ucG5wbS9zdHlsZS1sb2FkZXJANC4wLjBfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29icy1iaWJsZS1wbHVnaW4vLi9ub2RlX21vZHVsZXMvLnBucG0vc3R5bGUtbG9hZGVyQDQuMC4wX3dlYnBhY2tANS45MS4wL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL29icy1iaWJsZS1wbHVnaW4vLi9ub2RlX21vZHVsZXMvLnBucG0vc3R5bGUtbG9hZGVyQDQuMC4wX3dlYnBhY2tANS45MS4wL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL29icy1iaWJsZS1wbHVnaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2JzLWJpYmxlLXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vYnMtYmlibGUtcGx1Z2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2JzLWJpYmxlLXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29icy1iaWJsZS1wbHVnaW4vd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL29icy1iaWJsZS1wbHVnaW4vLi9zcmMvcHVibGljL2Jyb3dzZXIvYnJvd3Nlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBiZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmctY29udGFpbmVyXCIpO1xyXG5jb25zdCBtZXNzYWdlRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVzc2FnZURpc3BsYXlcIik7XHJcbmNvbnN0IGNoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbChcIm15Q2hhbm5lbFwiKTtcclxuY29uc3QgYmdDb250ZW50ID0gbmV3IEJyb2FkY2FzdENoYW5uZWwoXCJiZ0NvbnRlbnRcIik7XHJcbmNvbnN0IHNldHRpbmdzQ2hhbm5lbCA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKFwic2V0dGluZ3NcIik7XHJcbmNvbnN0IHNhdmVkVGl0bGVDb2xvciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aXRsZUNvbG9yJyk7XHJcblxyXG4vLyBUZXh0IGNoYW5uZWxcclxuY2hhbm5lbC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcclxuICBjb25zdCBtZXNzYWdlID0gZXZlbnQuZGF0YTtcclxuICBtZXNzYWdlRGlzcGxheS5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZE1lc3NhZ2UnLCBtZXNzYWdlKTtcclxuXHJcbiAgaWYgKHNhdmVkVGl0bGVDb2xvcikge1xyXG4gICAgY29uc3QgZHNwYW5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNtZXNzYWdlRGlzcGxheSBzcGFuXCIpO1xyXG4gICAgZHNwYW5zLmZvckVhY2goZHNwYW4gPT4gZHNwYW4uc3R5bGUuY29sb3IgPSBzYXZlZFRpdGxlQ29sb3IpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIHNldHRpbmdzIGNoYW5uZWxcclxuc2V0dGluZ3NDaGFubmVsLm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xyXG5cclxuICBzd2l0Y2ggKE9iamVjdC5rZXlzKGV2ZW50LmRhdGEpPy5bMF0pIHtcclxuICAgIGNhc2UgJ3NlbGVjdGVkRm9udCc6XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkRm9udCA9IGV2ZW50LmRhdGFbJ3NlbGVjdGVkRm9udCddO1xyXG4gICAgICBiZ0NvbnRhaW5lci5zdHlsZS5mb250RmFtaWx5ID0gc2VsZWN0ZWRGb250O1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZm9udEZhbWlseScsIHNlbGVjdGVkRm9udCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnb3BhY2l0eUNvbG9yJzpcclxuICAgICAgY29uc3Qgb3BhY2l0eUNvbG9yID0gZXZlbnQuZGF0YVsnb3BhY2l0eUNvbG9yJ107XHJcbiAgICAgIGJnQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wYWNpdHlDb2xvcjtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2JnQ29sb3InLCBvcGFjaXR5Q29sb3IpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3JvdW5kZWRDb3JuZXInOlxyXG4gICAgICBjb25zdCByb3VuZGVkQ29ybmVyID0gZXZlbnQuZGF0YVsncm91bmRlZENvcm5lciddO1xyXG4gICAgICBiZ0NvbnRhaW5lci5zdHlsZS5ib3JkZXJSYWRpdXMgPSByb3VuZGVkQ29ybmVyICsgXCJweFwiO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9yZGVyUmFkaXVzJywgcm91bmRlZENvcm5lcik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnc2VsZWN0ZWRCZ0NvbG9yJzpcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRCZ0NvbG9yID0gZXZlbnQuZGF0YVsnc2VsZWN0ZWRCZ0NvbG9yJ107XHJcbiAgICAgIGJnQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHNlbGVjdGVkQmdDb2xvcjtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2JnQ29sb3InLCBzZWxlY3RlZEJnQ29sb3IpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3NlbGVjdGVkRm9udENvbG9yJzpcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRGb250Q29sb3IgPSBldmVudC5kYXRhWydzZWxlY3RlZEZvbnRDb2xvciddO1xyXG4gICAgICBiZ0NvbnRhaW5lci5zdHlsZS5jb2xvciA9IHNlbGVjdGVkRm9udENvbG9yO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZm9udENvbG9yJywgc2VsZWN0ZWRGb250Q29sb3IpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3NlbGVjdGVkVGl0bGVDb2xvcic6XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGl0bGVDb2xvciA9IGV2ZW50LmRhdGFbJ3NlbGVjdGVkVGl0bGVDb2xvciddO1xyXG4gICAgICBjb25zdCBzcGFucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVzc2FnZURpc3BsYXkgc3BhblwiKTtcclxuICAgICAgc3BhbnMuZm9yRWFjaChzcGFuID0+IHNwYW4uc3R5bGUuY29sb3IgPSBzZWxlY3RlZFRpdGxlQ29sb3IpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGl0bGVDb2xvcicsIHNlbGVjdGVkVGl0bGVDb2xvcik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnY3VycmVudEJvbGRTdGF0ZSc6XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRCb2xkU3RhdGUgPSBldmVudC5kYXRhWydjdXJyZW50Qm9sZFN0YXRlJ107XHJcbiAgICAgIG1lc3NhZ2VEaXNwbGF5LnN0eWxlLmZvbnRXZWlnaHQgPSBjdXJyZW50Qm9sZFN0YXRlO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9sZFN0YXRlJywgY3VycmVudEJvbGRTdGF0ZSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnY3VycmVudEl0YWxpY1N0YXRlJzpcclxuICAgICAgY29uc3QgY3VycmVudEl0YWxpY1N0YXRlID0gZXZlbnQuZGF0YVsnY3VycmVudEl0YWxpY1N0YXRlJ107XHJcbiAgICAgIG1lc3NhZ2VEaXNwbGF5LnN0eWxlLmZvbnRTdHlsZSA9IGN1cnJlbnRJdGFsaWNTdGF0ZTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2l0YWxpY1N0YXRlJywgY3VycmVudEl0YWxpY1N0YXRlKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdjdXJyZW50VW5kZXJsaW5lU3RhdGUnOlxyXG4gICAgICBjb25zdCBjdXJyZW50VW5kZXJsaW5lU3RhdGUgPSBldmVudC5kYXRhWydjdXJyZW50VW5kZXJsaW5lU3RhdGUnXTtcclxuICAgICAgbWVzc2FnZURpc3BsYXkuc3R5bGUudGV4dERlY29yYXRpb24gPSBjdXJyZW50VW5kZXJsaW5lU3RhdGU7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1bmRlcmxpbmVTdGF0ZScsIGN1cnJlbnRVbmRlcmxpbmVTdGF0ZSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnc2VsZWN0ZWRUZXh0QWxpZ25tZW50JzpcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0QWxpZ25tZW50ID0gZXZlbnQuZGF0YVsnc2VsZWN0ZWRUZXh0QWxpZ25tZW50J107XHJcbiAgICAgIG1lc3NhZ2VEaXNwbGF5LnN0eWxlLnRleHRBbGlnbiA9IHNlbGVjdGVkVGV4dEFsaWdubWVudDtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RleHRBbGlnbicsIHNlbGVjdGVkVGV4dEFsaWdubWVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIGNvbnRhaW5lciBoaWRkZW4gb3Igc2hvd25cclxuYmdDb250ZW50Lm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xyXG4gIGlmIChldmVudC5kYXRhID09PSAnaGlkZGVuJykge1xyXG4gICAgYmdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICB9IGVsc2Uge1xyXG4gICAgYmdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7IGNoYW5uZWwsIGJnQ29udGVudCwgc2V0dGluZ3NDaGFubmVsIH07XHJcbiIsImZ1bmN0aW9uIGhhc1ZlcnRpY2FsU2Nyb2xsKCkge1xyXG4gIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IDwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRqdXN0Rm9udFNpemVCYXNlZE9uU2Nyb2xsKCkge1xyXG4gIC8vIEdldCB0aGUgbWVzc2FnZSBlbGVtZW50IGJ5IGl0cyBJRFxyXG4gIHZhciBtZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2VEaXNwbGF5Jyk7XHJcblxyXG4gIC8vIEdldCB0aGUgY3VycmVudCBmb250IHNpemVcclxuICB2YXIgZm9udFNpemUgPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShtZXNzYWdlKS5mb250U2l6ZSk7XHJcblxyXG4gIC8vIENoZWNrIGlmIHRoZXJlIGlzIHZlcnRpY2FsIHNjcm9sbFxyXG4gIGlmIChoYXNWZXJ0aWNhbFNjcm9sbCgpKSB7XHJcbiAgICB3aGlsZSAoaGFzVmVydGljYWxTY3JvbGwoKSAmJiBmb250U2l6ZSA+IDEpIHtcclxuICAgICAgZm9udFNpemUgLT0gMTtcclxuICAgICAgbWVzc2FnZS5zdHlsZS5mb250U2l6ZSA9IGZvbnRTaXplICsgJ3B4JztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUgKCFoYXNWZXJ0aWNhbFNjcm9sbCgpICYmIGZvbnRTaXplIDwgOTApIHtcclxuICAgICAgZm9udFNpemUgKz0gMTtcclxuICAgICAgbWVzc2FnZS5zdHlsZS5mb250U2l6ZSA9IGZvbnRTaXplICsgJ3B4JztcclxuICAgICAgaWYoaGFzVmVydGljYWxTY3JvbGwoKSl7XHJcbiAgICAgICAgZm9udFNpemUgLT0gMTtcclxuICAgICAgICBtZXNzYWdlLnN0eWxlLmZvbnRTaXplID0gZm9udFNpemUgKyAncHgnO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHRoZSBNdXRhdGlvbk9ic2VydmVyXHJcbmZ1bmN0aW9uIGhhbmRsZU11dGF0aW9uKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSB7XHJcbiAgZm9yICh2YXIgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkge1xyXG4gICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnICYmIG11dGF0aW9uLnRhcmdldC5pZCA9PT0gJ21lc3NhZ2VEaXNwbGF5Jykge1xyXG4gICAgICAvLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBhZGp1c3QgZm9udCBzaXplXHJcbiAgICAgIGFkanVzdEZvbnRTaXplQmFzZWRPblNjcm9sbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgbmV3IE11dGF0aW9uT2JzZXJ2ZXIgaW5zdGFuY2VcclxudmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlTXV0YXRpb24pO1xyXG5cclxuLy8gU3RhcnQgb2JzZXJ2aW5nIGNoYW5nZXMgaW4gdGhlIGlubmVyIEhUTUwgb2YgdGhlIDxwPiBlbGVtZW50XHJcbm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2VEaXNwbGF5JyksIHsgY2hpbGRMaXN0OiB0cnVlIH0pO1xyXG4iLCIvLyBDaGVjayBpZiBhIGJhY2tncm91bmQgY29sb3IgaXMgc2F2ZWQgaW4gbG9jYWxTdG9yYWdlXHJcbmNvbnN0IHNhdmVkQmdDb2xvciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdiZ0NvbG9yJyk7XHJcbmNvbnN0IHNhdmVkRm9udEZhbWlseSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmb250RmFtaWx5Jyk7XHJcbmNvbnN0IHNhdmVkRm9udENvbG9yID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZvbnRDb2xvcicpO1xyXG5jb25zdCBzYXZlZEJvcmRlclJhZGl1cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib3JkZXJSYWRpdXMnKTtcclxuY29uc3Qgc2F2ZWRUaXRsZUNvbG9yID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RpdGxlQ29sb3InKTtcclxudmFyIHNhdmVkTWVzc2FnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZE1lc3NhZ2UnKTtcclxudmFyIHNhdmVkQm9sZFN0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2JvbGRTdGF0ZScpO1xyXG52YXIgc2F2ZWRJdGFsaWNTdGF0ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpdGFsaWNTdGF0ZScpO1xyXG52YXIgc2F2ZWRVbmRlcmxpbmVTdGF0ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1bmRlcmxpbmVTdGF0ZScpO1xyXG52YXIgc2F2ZWRUZXh0QWxpZ24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGV4dEFsaWduJyk7XHJcbmNvbnN0IGJnQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiZy1jb250YWluZXJcIik7XHJcblxyXG5pZiAoc2F2ZWRNZXNzYWdlKSB7XHJcbiAgICBtZXNzYWdlRGlzcGxheS5pbm5lckhUTUwgPSBzYXZlZE1lc3NhZ2U7XHJcbn1cclxuXHJcbmlmIChzYXZlZEJnQ29sb3IpIHtcclxuICAgIGJnQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHNhdmVkQmdDb2xvcjtcclxufVxyXG5cclxuaWYgKHNhdmVkRm9udEZhbWlseSkge1xyXG4gICAgYmdDb250YWluZXIuc3R5bGUuZm9udEZhbWlseSA9IHNhdmVkRm9udEZhbWlseTtcclxufVxyXG5cclxuaWYgKHNhdmVkRm9udENvbG9yKSB7XHJcbiAgICBtZXNzYWdlRGlzcGxheS5zdHlsZS5mb250Q29sb3IgPSBzYXZlZEZvbnRDb2xvcjtcclxufVxyXG5cclxuaWYgKHNhdmVkQm9yZGVyUmFkaXVzKSB7XHJcbiAgICBiZ0NvbnRhaW5lci5zdHlsZS5ib3JkZXJSYWRpdXMgPSBzYXZlZEJvcmRlclJhZGl1cztcclxufVxyXG5cclxuaWYgKHNhdmVkVGl0bGVDb2xvcikge1xyXG4gICAgY29uc3QgZHNwYW5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNtZXNzYWdlRGlzcGxheSBzcGFuXCIpO1xyXG4gICAgZHNwYW5zLmZvckVhY2goZHNwYW4gPT4gZHNwYW4uc3R5bGUuY29sb3IgPSBzYXZlZFRpdGxlQ29sb3IpO1xyXG59XHJcblxyXG5pZiAoc2F2ZWRCb2xkU3RhdGUpe1xyXG4gICAgbWVzc2FnZURpc3BsYXkuc3R5bGUuZm9udFdlaWdodCA9IHNhdmVkQm9sZFN0YXRlO1xyXG59XHJcblxyXG5pZiAoc2F2ZWRJdGFsaWNTdGF0ZSl7XHJcbiAgICBtZXNzYWdlRGlzcGxheS5zdHlsZS5mb250U3R5bGUgPSBzYXZlZEl0YWxpY1N0YXRlO1xyXG59XHJcblxyXG5pZiAoc2F2ZWRVbmRlcmxpbmVTdGF0ZSl7XHJcbiAgICBtZXNzYWdlRGlzcGxheS5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IHNhdmVkVW5kZXJsaW5lU3RhdGU7XHJcbn1cclxuXHJcbmlmIChzYXZlZFRleHRBbGlnbil7XHJcbiAgICBtZXNzYWdlRGlzcGxheS5zdHlsZS50ZXh0QWxpZ24gPSBzYXZlZFRleHRBbGlnbjtcclxufSIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vY3NzLWxvYWRlckA3LjEuMV93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2Nzcy1sb2FkZXJANy4xLjFfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIH1cclxuXHJcbmJvZHl7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xyXG4gICAgY29sb3I6ICNmZmY7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xyXG4gICAgaGVpZ2h0OiAxMDB2aDtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxufVxyXG5cclxuLmJnLWNvbnRhaW5lcntcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIwMSwgMjAxLCAyMDEpO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLmNvbnRhaW5lciB7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwLjFlbTtcclxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcbiAgIFxyXG4jbWVzc2FnZURpc3BsYXkge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIGZvbnQtc2l6ZTogNWVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiA1MHB4IDEwMHB4O1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuXHJcbiNtZXNzYWdlRGlzcGxheSBzcGFue1xyXG4gICAgY29sb3I6ICNmZjY0NTA7XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbiAgICBvcGFjaXR5OiAxO1xyXG59XHJcblxyXG4jbWVzc2FnZURpc3BsYXkgdWx7XHJcbiAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvYnJvd3Nlcl9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtFQUN4Qjs7QUFFRjtJQUNJLGtDQUFrQztJQUNsQyxXQUFXO0lBQ1gsYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIscUJBQXFCO0lBQ3JCLGFBQWE7SUFDYixTQUFTO0lBQ1QsVUFBVTtJQUNWLHVCQUF1QjtJQUN2QixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsWUFBWTtJQUNaLG9DQUFvQztJQUNwQyxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixTQUFTO0lBQ1QsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixVQUFVO0lBQ1YsYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxVQUFVO0lBQ1YsY0FBYztJQUNkLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsU0FBUztJQUNULG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gscUJBQXFCO0lBQ3JCLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsVUFBVTtBQUNkOztBQUVBO0lBQ0kscUJBQXFCO0lBQ3JCLFNBQVM7SUFDVCxVQUFVO0lBQ1Ysa0JBQWtCO0FBQ3RCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICB9XFxyXFxuXFxyXFxuYm9keXtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcXHJcXG4gICAgY29sb3I6ICNmZmY7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XFxyXFxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmJnLWNvbnRhaW5lcntcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIwMSwgMjAxLCAyMDEpO1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbnRhaW5lciB7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwLjFlbTtcXHJcXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xcclxcbiAgICBvcGFjaXR5OiAxO1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuICAgXFxyXFxuI21lc3NhZ2VEaXNwbGF5IHtcXHJcXG4gICAgb3BhY2l0eTogMTtcXHJcXG4gICAgZm9udC1zaXplOiA1ZW07XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogNTBweCAxMDBweDtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcXHJcXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xcclxcbn1cXHJcXG5cXHJcXG4jbWVzc2FnZURpc3BsYXkgc3BhbntcXHJcXG4gICAgY29sb3I6ICNmZjY0NTA7XFxyXFxuICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcXHJcXG4gICAgb3BhY2l0eTogMTtcXHJcXG59XFxyXFxuXFxyXFxuI21lc3NhZ2VEaXNwbGF5IHVse1xcclxcbiAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG5cXHJcXG5cXHJcXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zdHlsZS1sb2FkZXJANC4wLjBfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWxvYWRlckA0LjAuMF93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWxvYWRlckA0LjAuMF93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zdHlsZS1sb2FkZXJANC4wLjBfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWxvYWRlckA0LjAuMF93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWxvYWRlckA0LjAuMF93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2Nzcy1sb2FkZXJANy4xLjFfd2VicGFja0A1LjkxLjAvbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9icm93c2VyX3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xub3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vY3NzLWxvYWRlckA3LjEuMV93ZWJwYWNrQDUuOTEuMC9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2Jyb3dzZXJfc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4uLy4uL3N0eWxlcy9icm93c2VyX3N0eWxlLmNzcyc7XHJcbmltcG9ydCAnLi4vLi4vY29yZS9icm9hZGNhc3RDaGFubmVscy5qcyc7XHJcbmltcG9ydCAnLi4vLi4vY29yZS9icm93c2VyX2FwcC5qcyc7XHJcbmltcG9ydCAnLi4vLi4vY29yZS9sb2FkX3NldHRpbmdzLmpzJzsiXSwibmFtZXMiOlsiYmdDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWVzc2FnZURpc3BsYXkiLCJjaGFubmVsIiwiQnJvYWRjYXN0Q2hhbm5lbCIsImJnQ29udGVudCIsInNldHRpbmdzQ2hhbm5lbCIsInNhdmVkVGl0bGVDb2xvciIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm1lc3NhZ2UiLCJkYXRhIiwiaW5uZXJIVE1MIiwic2V0SXRlbSIsImRzcGFucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZHNwYW4iLCJzdHlsZSIsImNvbG9yIiwiX09iamVjdCRrZXlzIiwiT2JqZWN0Iiwia2V5cyIsInNlbGVjdGVkRm9udCIsImZvbnRGYW1pbHkiLCJvcGFjaXR5Q29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJyb3VuZGVkQ29ybmVyIiwiYm9yZGVyUmFkaXVzIiwic2VsZWN0ZWRCZ0NvbG9yIiwic2VsZWN0ZWRGb250Q29sb3IiLCJzZWxlY3RlZFRpdGxlQ29sb3IiLCJzcGFucyIsInNwYW4iLCJjdXJyZW50Qm9sZFN0YXRlIiwiZm9udFdlaWdodCIsImN1cnJlbnRJdGFsaWNTdGF0ZSIsImZvbnRTdHlsZSIsImN1cnJlbnRVbmRlcmxpbmVTdGF0ZSIsInRleHREZWNvcmF0aW9uIiwic2VsZWN0ZWRUZXh0QWxpZ25tZW50IiwidGV4dEFsaWduIiwiZGlzcGxheSIsImhhc1ZlcnRpY2FsU2Nyb2xsIiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWRqdXN0Rm9udFNpemVCYXNlZE9uU2Nyb2xsIiwiZm9udFNpemUiLCJwYXJzZUludCIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJoYW5kbGVNdXRhdGlvbiIsIm11dGF0aW9uc0xpc3QiLCJvYnNlcnZlciIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJtdXRhdGlvbiIsInZhbHVlIiwidHlwZSIsInRhcmdldCIsImlkIiwiZXJyIiwiZSIsImYiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInNhdmVkQmdDb2xvciIsInNhdmVkRm9udEZhbWlseSIsInNhdmVkRm9udENvbG9yIiwic2F2ZWRCb3JkZXJSYWRpdXMiLCJzYXZlZE1lc3NhZ2UiLCJzYXZlZEJvbGRTdGF0ZSIsInNhdmVkSXRhbGljU3RhdGUiLCJzYXZlZFVuZGVybGluZVN0YXRlIiwic2F2ZWRUZXh0QWxpZ24iLCJmb250Q29sb3IiXSwic291cmNlUm9vdCI6IiJ9