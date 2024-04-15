/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/broadcastChannels.js":
/*!***************************************!*\
  !*** ./src/core/broadcastChannels.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   bgContent: () => (/* binding */ bgContent),\n/* harmony export */   channel: () => (/* binding */ channel),\n/* harmony export */   settingsChannel: () => (/* binding */ settingsChannel)\n/* harmony export */ });\nvar bgContainer = document.getElementById(\"bg-container\");\nvar messageDisplay = document.getElementById(\"messageDisplay\");\nvar bgContainerBtn = document.getElementById('bg-container-btn');\nvar channel = new BroadcastChannel(\"myChannel\");\nvar bgContent = new BroadcastChannel(\"bgContent\");\nvar settingsChannel = new BroadcastChannel(\"settings\");\n\n// Text channel\nchannel.onmessage = function (event) {\n  var message = event.data;\n  messageDisplay.innerHTML = message;\n  localStorage.setItem('savedMessage', message);\n  if (savedTitleColor) {\n    var dspans = document.querySelectorAll(\"#messageDisplay span\");\n    dspans.forEach(function (dspan) {\n      return dspan.style.color = savedTitleColor;\n    });\n  }\n};\n\n// settings channel\nsettingsChannel.onmessage = function (event) {\n  var _Object$keys;\n  switch ((_Object$keys = Object.keys(event.data)) === null || _Object$keys === void 0 ? void 0 : _Object$keys[0]) {\n    case 'selectedFont':\n      var selectedFont = event.data['selectedFont'];\n      bgContainer.style.fontFamily = selectedFont;\n      localStorage.setItem('fontFamily', selectedFont);\n      break;\n    case 'opacityColor':\n      var opacityColor = event.data['opacityColor'];\n      bgContainer.style.backgroundColor = opacityColor;\n      localStorage.setItem('bgColor', opacityColor);\n      break;\n    case 'roundedCorner':\n      var roundedCorner = event.data['roundedCorner'];\n      bgContainer.style.borderRadius = roundedCorner + \"px\";\n      localStorage.setItem('borderRadius', roundedCorner);\n      break;\n    case 'selectedBgColor':\n      var selectedBgColor = event.data['selectedBgColor'];\n      bgContainer.style.backgroundColor = selectedBgColor;\n      localStorage.setItem('bgColor', selectedBgColor);\n      break;\n    case 'selectedFontColor':\n      var selectedFontColor = event.data['selectedFontColor'];\n      bgContainer.style.color = selectedFontColor;\n      localStorage.setItem('fontColor', selectedFontColor);\n      break;\n    case 'selectedTitleColor':\n      var selectedTitleColor = event.data['selectedTitleColor'];\n      var spans = document.querySelectorAll(\"#messageDisplay span\");\n      spans.forEach(function (span) {\n        return span.style.color = selectedTitleColor;\n      });\n      localStorage.setItem('titleColor', selectedTitleColor);\n      break;\n    case 'currentBoldState':\n      var currentBoldState = event.data['currentBoldState'];\n      messageDisplay.style.fontWeight = currentBoldState;\n      localStorage.setItem('boldState', currentBoldState);\n      break;\n    case 'currentItalicState':\n      var currentItalicState = event.data['currentItalicState'];\n      messageDisplay.style.fontStyle = currentItalicState;\n      localStorage.setItem('italicState', currentItalicState);\n      break;\n    case 'currentUnderlineState':\n      var currentUnderlineState = event.data['currentUnderlineState'];\n      messageDisplay.style.textDecoration = currentUnderlineState;\n      localStorage.setItem('underlineState', currentUnderlineState);\n      break;\n    case 'selectedTextAlignment':\n      var selectedTextAlignment = event.data['selectedTextAlignment'];\n      messageDisplay.style.textAlign = selectedTextAlignment;\n      localStorage.setItem('textAlign', selectedTextAlignment);\n      break;\n  }\n};\n\n// container hidden or shown\nbgContent.onmessage = function (event) {\n  if (event.data === 'hidden') {\n    bgContainer.style.display = 'none';\n  } else {\n    bgContainer.style.display = 'inline';\n  }\n};\n\n\n//# sourceURL=webpack://obs-bible-plugin/./src/core/broadcastChannels.js?");

/***/ }),

/***/ "./src/core/browser_app.js":
/*!*********************************!*\
  !*** ./src/core/browser_app.js ***!
  \*********************************/
/***/ (() => {

eval("function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== \"undefined\" && o[Symbol.iterator] || o[\"@@iterator\"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction hasVerticalScroll() {\n  return document.documentElement.clientHeight < document.documentElement.scrollHeight;\n}\nfunction adjustFontSizeBasedOnScroll() {\n  // Get the message element by its ID\n  var message = document.getElementById('messageDisplay');\n\n  // Get the current font size\n  var fontSize = parseInt(window.getComputedStyle(message).fontSize);\n\n  // Check if there is vertical scroll\n  if (hasVerticalScroll()) {\n    while (hasVerticalScroll() && fontSize > 1) {\n      fontSize -= 1;\n      message.style.fontSize = fontSize + 'px';\n    }\n  } else {\n    while (!hasVerticalScroll() && fontSize < 90) {\n      fontSize += 1;\n      message.style.fontSize = fontSize + 'px';\n      if (hasVerticalScroll()) {\n        fontSize -= 1;\n        message.style.fontSize = fontSize + 'px';\n        break;\n      }\n    }\n  }\n}\n\n// Callback function for the MutationObserver\nfunction handleMutation(mutationsList, observer) {\n  var _iterator = _createForOfIteratorHelper(mutationsList),\n    _step;\n  try {\n    for (_iterator.s(); !(_step = _iterator.n()).done;) {\n      var mutation = _step.value;\n      if (mutation.type === 'childList' && mutation.target.id === 'messageDisplay') {\n        // Call the function to adjust font size\n        adjustFontSizeBasedOnScroll();\n      }\n    }\n  } catch (err) {\n    _iterator.e(err);\n  } finally {\n    _iterator.f();\n  }\n}\n\n// Create a new MutationObserver instance\nvar observer = new MutationObserver(handleMutation);\n\n// Start observing changes in the inner HTML of the <p> element\nobserver.observe(document.getElementById('messageDisplay'), {\n  childList: true\n});\n\n//# sourceURL=webpack://obs-bible-plugin/./src/core/browser_app.js?");

/***/ }),

/***/ "./src/core/load_settings.js":
/*!***********************************!*\
  !*** ./src/core/load_settings.js ***!
  \***********************************/
/***/ (() => {

eval("// Check if a background color is saved in localStorage\nvar savedBgColor = localStorage.getItem('bgColor');\nvar savedFontFamily = localStorage.getItem('fontFamily');\nvar savedFontColor = localStorage.getItem('fontColor');\nvar savedBorderRadius = localStorage.getItem('borderRadius');\nvar savedTitleColor = localStorage.getItem('titleColor');\nvar savedMessage = localStorage.getItem('savedMessage');\nvar savedBoldState = localStorage.getItem('boldState');\nvar savedItalicState = localStorage.getItem('italicState');\nvar savedUnderlineState = localStorage.getItem('underlineState');\nvar savedTextAlign = localStorage.getItem('textAlign');\nif (savedMessage) {\n  messageDisplay.innerHTML = savedMessage;\n}\nif (savedBgColor) {\n  bgContainer.style.backgroundColor = savedBgColor;\n}\nif (savedFontFamily) {\n  bgContainer.style.fontFamily = savedFontFamily;\n}\nif (savedFontColor) {\n  messageDisplay.style.fontColor = savedFontColor;\n}\nif (savedBorderRadius) {\n  bgContainer.style.borderRadius = savedBorderRadius;\n}\nif (savedTitleColor) {\n  var dspans = document.querySelectorAll(\"#messageDisplay span\");\n  dspans.forEach(function (dspan) {\n    return dspan.style.color = savedTitleColor;\n  });\n}\nif (savedBoldState) {\n  messageDisplay.style.fontWeight = savedBoldState;\n}\nif (savedItalicState) {\n  messageDisplay.style.fontStyle = savedItalicState;\n}\nif (savedUnderlineState) {\n  messageDisplay.style.textDecoration = savedUnderlineState;\n}\nif (savedTextAlign) {\n  messageDisplay.style.textAlign = savedTextAlign;\n}\n\n//# sourceURL=webpack://obs-bible-plugin/./src/core/load_settings.js?");

/***/ }),

/***/ "./src/public/browser/browser.js":
/*!***************************************!*\
  !*** ./src/public/browser/browser.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_browser_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../styles/browser_style.css */ \"./src/styles/browser_style.css\");\n/* harmony import */ var _core_broadcastChannels_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/broadcastChannels.js */ \"./src/core/broadcastChannels.js\");\n/* harmony import */ var _core_browser_app_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/browser_app.js */ \"./src/core/browser_app.js\");\n/* harmony import */ var _core_browser_app_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_browser_app_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _core_load_settings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/load_settings.js */ \"./src/core/load_settings.js\");\n/* harmony import */ var _core_load_settings_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_load_settings_js__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n\n//# sourceURL=webpack://obs-bible-plugin/./src/public/browser/browser.js?");

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./src/styles/browser_style.css":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./src/styles/browser_style.css ***!
  \*******************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n  }\r\n\r\nbody{\r\n    background-color: rgba(0, 0, 0, 0);\r\n    color: #fff;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    align-content: center;\r\n    height: 100vh;\r\n    margin: 0;\r\n    padding: 0;\r\n    font-family: sans-serif;\r\n    overflow-y: hidden;\r\n}\r\n\r\n.bg-container{\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgb(201, 201, 201);\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.container {\r\n    text-align: center;\r\n    margin: 0;\r\n    padding: 0.1em;\r\n    overflow-y: hidden;\r\n    opacity: 1;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n   \r\n#messageDisplay {\r\n    opacity: 1;\r\n    font-size: 5em;\r\n    font-weight: bold;\r\n    text-align: center;\r\n    margin: 0;\r\n    padding: 50px 100px;\r\n    width: 100%;\r\n    white-space: pre-wrap;\r\n    overflow-y: hidden;\r\n}\r\n\r\n#messageDisplay span{\r\n    color: #ff6450;\r\n    overflow-y: hidden;\r\n    opacity: 1;\r\n}\r\n\r\n#messageDisplay ul{\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow-y: hidden;\r\n}\r\n\r\n\r\n\r\n\r\n`, \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://obs-bible-plugin/./src/styles/browser_style.css?./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js ***!
  \********************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = [];\n\n  // return the list of modules as css string\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n      content += cssWithMappingToString(item);\n      if (needLayer) {\n        content += \"}\";\n      }\n      if (item[2]) {\n        content += \"}\";\n      }\n      if (item[4]) {\n        content += \"}\";\n      }\n      return content;\n    }).join(\"\");\n  };\n\n  // import a list of modules into the list\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n    var alreadyImportedModules = {};\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n      list.push(item);\n    }\n  };\n  return list;\n};\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \*****************************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./src/styles/browser_style.css":
/*!**************************************!*\
  !*** ./src/styles/browser_style.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./browser_style.css */ \"./node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!./src/styles/browser_style.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\noptions.insert = _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\noptions.domAPI = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_pnpm_style_loader_4_0_0_webpack_5_91_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_pnpm_css_loader_7_1_1_webpack_5_91_0_node_modules_css_loader_dist_cjs_js_browser_style_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://obs-bible-plugin/./src/styles/browser_style.css?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*********************************************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar stylesInDOM = [];\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n  return result;\n}\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n    identifiers.push(identifier);\n  }\n  return identifiers;\n}\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n  return updater;\n}\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n    var newLastIdentifiers = modulesToDom(newList, options);\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n      var _index = getIndexByIdentifier(_identifier);\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*************************************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar memo = {};\n\n/* istanbul ignore next  */\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target);\n\n    // Special case to return head of iframe instead of iframe itself\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n    memo[target] = styleTarget;\n  }\n  return memo[target];\n}\n\n/* istanbul ignore next  */\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n  target.appendChild(style);\n}\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***************************************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \********************************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n  var needLayer = typeof obj.layer !== \"undefined\";\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n  css += obj.css;\n  if (needLayer) {\n    css += \"}\";\n  }\n  if (obj.media) {\n    css += \"}\";\n  }\n  if (obj.supports) {\n    css += \"}\";\n  }\n  var sourceMap = obj.sourceMap;\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  }\n\n  // For old IE\n  /* istanbul ignore if  */\n  options.styleTagTransform(css, styleElement, options.options);\n}\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n  styleElement.parentNode.removeChild(styleElement);\n}\n\n/* istanbul ignore next  */\nfunction domAPI(options) {\n  if (typeof document === \"undefined\") {\n    return {\n      update: function update() {},\n      remove: function remove() {}\n    };\n  }\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**************************************************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://obs-bible-plugin/./node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0/node_modules/style-loader/dist/runtime/styleTagTransform.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/public/browser/browser.js");
/******/ 	
/******/ })()
;