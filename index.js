(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: Converter, processors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/converter */ \"./src/lib/converter.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Converter\", function() { return _lib_converter__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _lib_processors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/processors */ \"./src/lib/processors/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"processors\", function() { return _lib_processors__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/lib/converter.js":
/*!******************************!*\
  !*** ./src/lib/converter.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Converter; });\n/* harmony import */ var jmespath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jmespath */ \"jmespath\");\n/* harmony import */ var jmespath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jmespath__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _processors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./processors */ \"./src/lib/processors/index.js\");\n\n\nclass Converter {\n  constructor(template) {\n    this.template = template;\n    this.processors = _processors__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\n  }\n\n  assignDotted(obj, path, val) {\n    const keys = path.split('.');\n    const tailKey = keys.pop();\n    var tailObj = keys.reduce((obj, key) => {\n      return obj[key] = obj[key] || {};\n    }, obj);\n    tailObj[tailKey] = val;\n  }\n\n  applyProcessor(processor, value) {\n    var promisify = result => {\n      if (result instanceof Promise) return result;else return Promise.resolve(result);\n    }; // If processor is a string, call the property on this.processors with value\n\n\n    if (typeof processor == 'string') {\n      return promisify(this.processors[processor](value));\n    } // if processor is an object with a \"processor\" member, call the this.processors member with value, and processor.args\n\n\n    if (typeof processor == 'object') {\n      let args = processor.args || [];\n      return promisify(this.processors[processor.processor].apply(this.processors, [value, ...args]));\n    } // if processor is a function, call the function with value\n\n\n    if (typeof processor == 'function') {\n      return promisify(processor(value));\n    }\n  }\n\n  render(source) {\n    var asyncMapping = this.template.mappings.map(mapping => {\n      let asyncResult;\n\n      if (mapping.processors) {\n        let initialValue = mapping.value || jmespath__WEBPACK_IMPORTED_MODULE_0___default.a.search(source, mapping.query || '@');\n        asyncResult = mapping.processors.reduce((prev, curr) => {\n          return prev.then(result => {\n            return this.applyProcessor(curr, result);\n          });\n        }, Promise.resolve(initialValue)).then(outcome => {\n          return {\n            path: mapping.path,\n            result: outcome,\n            hook: mapping.hook\n          };\n        });\n      } else if (mapping.query) {\n        asyncResult = Promise.resolve({\n          path: mapping.path,\n          result: jmespath__WEBPACK_IMPORTED_MODULE_0___default.a.search(source, mapping.query),\n          hook: mapping.hook\n        });\n      } else if (mapping.value) {\n        asyncResult = Promise.resolve({\n          path: mapping.path,\n          result: mapping.value,\n          hook: mapping.hook\n        });\n      }\n\n      return asyncResult;\n    });\n    return Promise.all(asyncMapping).then(results => {\n      let processingResult = results.map(obj => {\n        if (obj.hook) {\n          obj.result = obj.hook(obj.result);\n        }\n\n        return obj;\n      }).reduce((obj, result) => {\n        this.assignDotted(obj, result.path, result.result);\n        return obj;\n      }, {});\n      return processingResult;\n    });\n  }\n\n}\n\n//# sourceURL=webpack:///./src/lib/converter.js?");

/***/ }),

/***/ "./src/lib/processors/index.js":
/*!*************************************!*\
  !*** ./src/lib/processors/index.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jmespath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jmespath */ \"jmespath\");\n/* harmony import */ var jmespath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jmespath__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  upper: value => value.toUpperCase(),\n  lower: value => value.toLowerCase(),\n  trim: value => value.trim(),\n  join: (value, joiner = ', ') => value.join(joiner),\n  map: function (arrayValue, fn) {\n    return Promise.all(arrayValue.map(v => {\n      let processorResult = this[fn](v);\n      if (processorResult instanceof Promise) return processorResult;else return Promise.resolve(processorResult);\n    }));\n  },\n  query: (value, query) => jmespath__WEBPACK_IMPORTED_MODULE_0___default.a.search(value, query),\n  slugify: value => {\n    return value.toString().toLowerCase().trim().replace(/\\s+/g, '-').replace(/[^\\w\\-]+/g, '').replace(/\\-\\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');\n  },\n  titleCase: value => {\n    return value.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');\n  },\n  toJson: value => JSON.stringify(value),\n  stringFormat: (value, template) => {\n    return template.replace(/{([^\\}]+)}/g, (m, s) => {\n      return typeof value[s] != 'undefined' ? value[s] : '';\n    });\n  },\n  sort: (value, fn) => value.sort(fn),\n  slice: (value, start, end) => value.slice(start, end),\n  dateFormat: value => {\n    let d = new Date(value);\n    return d.toISOString();\n  },\n  fetch: (value, params = {}) => {\n    return axios__WEBPACK_IMPORTED_MODULE_1___default.a.get(value, params).then(response => response.data);\n  }\n});\n\n//# sourceURL=webpack:///./src/lib/processors/index.js?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "jmespath":
/*!***************************!*\
  !*** external "jmespath" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jmespath\");\n\n//# sourceURL=webpack:///external_%22jmespath%22?");

/***/ })

/******/ })));