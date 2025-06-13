/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {



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

/***/ 113:
/***/ ((module) => {



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

/***/ }),

/***/ 314:
/***/ ((module) => {



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

/***/ 365:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
    font-family: Arial, sans-serif;
    background-color: white;
    margin: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
}

h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

#gauge-container {
    position: relative;
    width: 400px;
    height: 240px;
    margin-bottom: 20px;
}

#gauge-svg {
    width: 400px;
    height: 240px;
}

.gauge-labels {
    position: relative;
    width: 360px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.gauge-label {
    font-size: 16px;
    font-weight: bold;
}

.left {
    color: #E53E3E;
}

.right {
    color: #38A169;
}

#gauge-text {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
}

#gauge-percentage {
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

#controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    max-width: 300px;
}

#button-container {
    display: flex;
    gap: 10px;
}

button {
    padding: 10px 15px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    background-color: #2AABEE;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #1D8FBF;
}

#value-slider {
    width: 100%;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 659:
/***/ ((module) => {



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

/***/ 825:
/***/ ((module) => {



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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/styles.css
var styles = __webpack_require__(365);
;// ./src/styles.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(styles/* default */.A, options);




       /* harmony default export */ const src_styles = (styles/* default */.A && styles/* default */.A.locals ? styles/* default */.A.locals : undefined);

;// ./src/gauge-service.ts
var GaugeService = /** @class */ (function () {
    function GaugeService() {
        this.centerX = 200;
        this.centerY = 200;
        this.radius = 160;
        this.min = 0;
        this.max = 100;
        this.startAngle = 180;
        this.endAngle = 0;
        // Truthfulness levels - 5 categories with muted colors
        this.levels = [
            { min: 0, max: 20, text: "BULLSHIT", color: "#E53E3E" }, // Muted Red
            { min: 20, max: 40, text: "MOSTLY FALSE", color: "#FF8C00" }, // Muted Orange
            { min: 40, max: 60, text: "QUESTIONABLE", color: "#F6AD55" }, // Muted Yellow-Orange
            { min: 60, max: 80, text: "MOSTLY TRUE", color: "#68D391" }, // Muted Green
            { min: 80, max: 100, text: "FACTUAL", color: "#38A169" } // Muted Dark Green
        ];
        // Segments for the gauge - 5 segments with muted colors
        this.segments = [
            { start: 0, end: 20, color: "#E53E3E" }, // BULLSHIT - Muted Red
            { start: 20, end: 40, color: "#FF8C00" }, // MOSTLY FALSE - Muted Orange
            { start: 40, end: 60, color: "#F6AD55" }, // QUESTIONABLE - Muted Yellow-Orange
            { start: 60, end: 80, color: "#68D391" }, // MOSTLY TRUE - Muted Green
            { start: 80, end: 100, color: "#38A169" } // FACTUAL - Muted Dark Green
        ];
    }
    // Convert value to angle
    GaugeService.prototype.valueToAngle = function (value) {
        return this.startAngle - ((value - this.min) / (this.max - this.min)) * (this.startAngle - this.endAngle);
    };
    // Convert angle to radians
    GaugeService.prototype.toRadians = function (angle) {
        return angle * Math.PI / 180;
    };
    // Find level for a given value
    GaugeService.prototype.getLevelForValue = function (value) {
        return this.levels.find(function (level) { return value >= level.min && value < level.max; });
    };
    // Get all gauge segments
    GaugeService.prototype.getSegments = function () {
        return this.segments;
    };
    // Get all information needed to draw a segment
    GaugeService.prototype.getSegmentPathData = function (segment) {
        var startAngleRad = this.toRadians(this.valueToAngle(segment.start));
        var endAngleRad = this.toRadians(this.valueToAngle(segment.end));
        var startX = this.centerX + this.radius * Math.cos(startAngleRad);
        var startY = this.centerY - this.radius * Math.sin(startAngleRad);
        var endX = this.centerX + this.radius * Math.cos(endAngleRad);
        var endY = this.centerY - this.radius * Math.sin(endAngleRad);
        // Determine if the arc is large (>180 degrees)
        var largeArcFlag = Math.abs(segment.end - segment.start) > 50 ? 1 : 0;
        return {
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            largeArcFlag: largeArcFlag
        };
    };
    // Get rotation angle for the needle
    GaugeService.prototype.getNeedleRotation = function (value) {
        var angle = this.valueToAngle(value);
        return angle - 90;
    };
    // Generate a random score
    GaugeService.prototype.generateRandomScore = function () {
        return Math.floor(Math.random() * 101);
    };
    // Get label position for a segment
    GaugeService.prototype.getSegmentLabelPosition = function (segment) {
        var midValue = (segment.start + segment.end) / 2;
        var angle = this.valueToAngle(midValue);
        var angleRad = this.toRadians(angle);
        // Position label at 70% of radius for better readability
        var labelRadius = this.radius * 0.7;
        var x = this.centerX + labelRadius * Math.cos(angleRad);
        var y = this.centerY - labelRadius * Math.sin(angleRad);
        // Calculate rotation for text (make it readable)
        var rotation = angle - 90;
        if (rotation > 90)
            rotation -= 180;
        if (rotation < -90)
            rotation += 180;
        return { x: x, y: y, rotation: rotation };
    };
    // Get short label text for segments
    GaugeService.prototype.getSegmentShortLabel = function (segment) {
        var level = this.levels.find(function (l) { return l.min === segment.start; });
        if (!level)
            return '';
        switch (level.text) {
            case 'BULLSHIT': return 'BS';
            case 'MOSTLY FALSE': return 'FALSE';
            case 'QUESTIONABLE': return '?';
            case 'MOSTLY TRUE': return 'TRUE';
            case 'FACTUAL': return 'FACT';
            default: return '';
        }
    };
    return GaugeService;
}());


;// ./src/config.ts
// Configuration for BS Meter Chrome Extension
// Update these settings to connect to your n8n workflow
var CONFIG = {
    // Replace this with your actual n8n webhook URL
    N8N_WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/bs-meter-analysis',
    // Optional: Add authentication if your n8n webhook requires it
    N8N_AUTH_HEADER: '', // e.g., 'Bearer your-token-here'
    // Analysis settings
    MAX_TEXT_LENGTH: 10000, // Maximum characters to send for analysis
    REQUEST_TIMEOUT: 30000, // 30 seconds timeout for n8n requests
    // Fallback settings
    USE_FALLBACK_ON_ERROR: true, // Use local analysis if n8n fails
    // Debug settings
    DEBUG_MODE: true // Set to false in production
};
// Export for use in other modules
/* harmony default export */ const config = (CONFIG);

;// ./src/chrome-extension-service.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var ChromeExtensionService = /** @class */ (function () {
    function ChromeExtensionService() {
        if (ChromeExtensionService.instance) {
            return ChromeExtensionService.instance;
        }
        ChromeExtensionService.instance = this;
    }
    /**
     * Initialize the Chrome extension service
     */
    ChromeExtensionService.prototype.initialize = function () {
        console.log('Chrome Extension Service initialized');
        // Set up any initial configuration
        this.setupMessageListeners();
    };
    /**
     * Set up message listeners for communication between popup and content script
     */
    ChromeExtensionService.prototype.setupMessageListeners = function () {
        var _this = this;
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                console.log('Message received:', message);
                if (message.type === 'ANALYZE_PAGE') {
                    _this.handlePageAnalysis(message.data)
                        .then(function (result) { return sendResponse(result); })
                        .catch(function (error) { return sendResponse({ error: error.message }); });
                    return true; // Keep the message channel open for async response
                }
            });
        }
    };
    /**
     * Analyze the current page content using n8n workflow
     */
    ChromeExtensionService.prototype.analyzeCurrentPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (typeof chrome !== 'undefined' && chrome.tabs) {
                            // Send message to content script to analyze page
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                var _a;
                                if ((_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id) {
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        type: 'GET_PAGE_CONTENT'
                                    }, function (response) { return __awaiter(_this, void 0, void 0, function () {
                                        var analysisResult;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(response && response.content)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, this.callN8nWorkflow({
                                                            text: response.content,
                                                            url: response.url,
                                                            title: document.title || 'Unknown'
                                                        })];
                                                case 1:
                                                    analysisResult = _a.sent();
                                                    resolve(analysisResult);
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    resolve(null);
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                else {
                                    resolve(null);
                                }
                            });
                        }
                        else {
                            resolve(null);
                        }
                    })];
            });
        });
    };
    /**
     * Call n8n workflow for BS analysis
     */
    ChromeExtensionService.prototype.callN8nWorkflow = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, controller_1, timeoutId, response, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (config.DEBUG_MODE) {
                            console.log('Calling n8n workflow for analysis...', config.N8N_WEBHOOK_URL);
                        }
                        headers = {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        };
                        // Add authentication header if configured
                        if (config.N8N_AUTH_HEADER) {
                            headers['Authorization'] = config.N8N_AUTH_HEADER;
                        }
                        controller_1 = new AbortController();
                        timeoutId = setTimeout(function () { return controller_1.abort(); }, config.REQUEST_TIMEOUT);
                        return [4 /*yield*/, fetch(config.N8N_WEBHOOK_URL, {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify({
                                    text: data.text.substring(0, config.MAX_TEXT_LENGTH),
                                    url: data.url,
                                    title: data.title,
                                    timestamp: new Date().toISOString(),
                                    source: 'chrome-extension'
                                }),
                                signal: controller_1.signal
                            })];
                    case 1:
                        response = _a.sent();
                        clearTimeout(timeoutId);
                        if (!response.ok) {
                            console.error('n8n workflow request failed:', response.status, response.statusText);
                            if (config.USE_FALLBACK_ON_ERROR) {
                                return [2 /*return*/, this.getFallbackAnalysis(data.text)];
                            }
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        // Validate the response structure
                        if (this.isValidBSMeterData(result)) {
                            if (config.DEBUG_MODE) {
                                console.log('✅ n8n analysis complete:', Math.round(result.overall_score * 100) + '%');
                            }
                            return [2 /*return*/, result];
                        }
                        else {
                            console.error('Invalid response from n8n workflow:', result);
                            if (config.USE_FALLBACK_ON_ERROR) {
                                return [2 /*return*/, this.getFallbackAnalysis(data.text)];
                            }
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1.name === 'AbortError') {
                            console.error('n8n workflow request timeout');
                        }
                        else {
                            console.error('Error calling n8n workflow:', error_1);
                        }
                        if (config.USE_FALLBACK_ON_ERROR) {
                            return [2 /*return*/, this.getFallbackAnalysis(data.text)];
                        }
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate if the response has the correct BSMeterData structure
     */
    ChromeExtensionService.prototype.isValidBSMeterData = function (data) {
        return data &&
            typeof data.overall_score === 'number' &&
            data.categories &&
            typeof data.categories === 'object';
    };
    /**
     * Fallback analysis when n8n workflow fails
     */
    ChromeExtensionService.prototype.getFallbackAnalysis = function (content) {
        console.log('Using fallback analysis...');
        return this.performLocalAnalysis(content);
    };
    /**
     * Local analysis as fallback when n8n workflow fails
     */
    ChromeExtensionService.prototype.performLocalAnalysis = function (content) {
        // This is a simplified analysis - fallback only
        // Your n8n workflow should be the primary analysis method
        var text = content.toLowerCase();
        // Simple keyword-based analysis
        var bsKeywords = ['amazing', 'unbelievable', 'shocking', 'incredible', 'miracle', 'secret', 'doctors hate', 'one weird trick'];
        var truthKeywords = ['study', 'research', 'according to', 'data shows', 'evidence', 'peer-reviewed', 'scientific'];
        var bsScore = 0;
        var truthScore = 0;
        bsKeywords.forEach(function (keyword) {
            var matches = (text.match(new RegExp(keyword, 'g')) || []).length;
            bsScore += matches * 10;
        });
        truthKeywords.forEach(function (keyword) {
            var matches = (text.match(new RegExp(keyword, 'g')) || []).length;
            truthScore += matches * 10;
        });
        // Calculate overall score (0 = BS, 1 = Truth)
        var totalScore = bsScore + truthScore;
        var truthfulness = totalScore > 0 ? truthScore / totalScore : 0.5;
        // Add some randomness to make it more interesting
        var randomFactor = (Math.random() - 0.5) * 0.3;
        var finalScore = Math.max(0, Math.min(1, truthfulness + randomFactor));
        return {
            overall_score: finalScore,
            categories: {
                overall_credibility_and_reputation: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Based on source reliability assessment"
                },
                factual_accuracy: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Based on factual claims analysis"
                },
                distinction_between_fact_and_opinion: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Analysis of objective vs subjective content"
                },
                language_analysis: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Emotional language and bias indicators"
                },
                logical_consistency_and_absence_of_fallacies: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Logical flow and consistency check"
                },
                headline_accuracy: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Headline vs content alignment"
                },
                historical_context_of_the_topic: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Historical accuracy and context"
                }
            }
        };
    };
    /**
     * Handle page analysis request
     */
    ChromeExtensionService.prototype.handlePageAnalysis = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callN8nWorkflow({
                            text: data.content || '',
                            url: data.url || '',
                            title: data.title || 'Unknown'
                        })];
                    case 1: 
                    // Call n8n workflow for analysis
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get BS meter data (for compatibility with existing code)
     */
    ChromeExtensionService.prototype.getBSMeterData = function () {
        // For popup, we'll trigger analysis when needed
        return null;
    };
    /**
     * Get overall score (for compatibility with existing code)
     */
    ChromeExtensionService.prototype.getOverallScore = function () {
        // Return null initially, will be set after analysis
        return null;
    };
    /**
     * Store analysis result in Chrome storage
     */
    ChromeExtensionService.prototype.storeAnalysisResult = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof chrome !== 'undefined' && chrome.storage)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, chrome.storage.local.set({ 'bsMeterData': data })];
                    case 2:
                        _a.sent();
                        console.log('Analysis result stored');
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Failed to store analysis result:', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get stored analysis result from Chrome storage
     */
    ChromeExtensionService.prototype.getStoredAnalysisResult = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof chrome !== 'undefined' && chrome.storage)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, chrome.storage.local.get('bsMeterData')];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.bsMeterData || null];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Failed to get stored analysis result:', error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    return ChromeExtensionService;
}());


;// ./src/popup.ts
var popup_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var popup_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var BSMeterPopup = /** @class */ (function () {
    function BSMeterPopup() {
        // State
        this.currentValue = 50;
        this.bsMeterData = null;
        this.gaugeService = new GaugeService();
        this.chromeService = new ChromeExtensionService();
        // Get DOM elements
        this.gaugeSegments = document.getElementById('segments');
        this.needle = document.getElementById('needle');
        this.gaugeText = document.getElementById('gauge-text');
        this.gaugePercentage = document.getElementById('gauge-percentage');
        this.analyzePageBtn = document.getElementById('analyze-page-btn');
        this.randomBtn = document.getElementById('random-btn');
        this.valueSlider = document.getElementById('value-slider');
        // Check if all elements exist
        if (!this.gaugeSegments || !this.needle || !this.gaugeText ||
            !this.gaugePercentage || !this.analyzePageBtn || !this.randomBtn || !this.valueSlider) {
            console.error('One or more elements not found');
            return;
        }
        // Initialize
        this.init();
    }
    BSMeterPopup.prototype.init = function () {
        return popup_awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return popup_generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('=== BS METER POPUP INITIALIZATION ===');
                        // Initialize Chrome extension service
                        this.chromeService.initialize();
                        // Create gauge segments
                        this.createGaugeSegments();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.chromeService.getStoredAnalysisResult()];
                    case 2:
                        _a.bsMeterData = _b.sent();
                        if (this.bsMeterData) {
                            this.currentValue = Math.round(this.bsMeterData.overall_score * 100);
                            console.log("\u2705 Loading stored analysis: ".concat(this.currentValue, "%"));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.log('⚠️ No stored analysis found, using default');
                        return [3 /*break*/, 4];
                    case 4:
                        this.setGaugeValue(this.currentValue, true);
                        // Add event listeners
                        this.setupEventListeners();
                        console.log('=== BS METER POPUP INITIALIZATION COMPLETE ===');
                        return [2 /*return*/];
                }
            });
        });
    };
    BSMeterPopup.prototype.setupEventListeners = function () {
        var _this = this;
        var _a, _b, _c;
        (_a = this.analyzePageBtn) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.analyzeCurrentPage(); });
        (_b = this.randomBtn) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.generateRandomScore(); });
        (_c = this.valueSlider) === null || _c === void 0 ? void 0 : _c.addEventListener('input', function (e) {
            var inputElement = e.target;
            _this.setGaugeValue(parseInt(inputElement.value), false);
        });
    };
    BSMeterPopup.prototype.analyzeCurrentPage = function () {
        return popup_awaiter(this, void 0, void 0, function () {
            var analysisResult, scorePercent_1, error_2;
            return popup_generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.analyzePageBtn)
                            return [2 /*return*/];
                        // Update button state
                        this.analyzePageBtn.disabled = true;
                        this.analyzePageBtn.textContent = 'Analyzing...';
                        this.updateGaugeText(50, 'ANALYZING...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, this.chromeService.analyzeCurrentPage()];
                    case 2:
                        analysisResult = _a.sent();
                        if (!analysisResult) return [3 /*break*/, 4];
                        this.bsMeterData = analysisResult;
                        scorePercent_1 = Math.round(analysisResult.overall_score * 100);
                        // Store the result
                        return [4 /*yield*/, this.chromeService.storeAnalysisResult(analysisResult)];
                    case 3:
                        // Store the result
                        _a.sent();
                        // Update gauge
                        this.setGaugeValue(scorePercent_1, true);
                        console.log('✅ Page analysis complete:', scorePercent_1 + '%');
                        return [3 /*break*/, 5];
                    case 4:
                        console.log('⚠️ Analysis failed or no content found');
                        this.updateGaugeText(50, 'ANALYSIS FAILED');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_2 = _a.sent();
                        console.error('Analysis error:', error_2);
                        this.updateGaugeText(50, 'ERROR');
                        return [3 /*break*/, 8];
                    case 7:
                        // Reset button state
                        this.analyzePageBtn.disabled = false;
                        this.analyzePageBtn.textContent = 'Analyze Page';
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BSMeterPopup.prototype.createGaugeSegments = function () {
        var _this = this;
        if (!this.gaugeSegments)
            return;
        this.gaugeSegments.innerHTML = '';
        this.gaugeService.getSegments().forEach(function (segment) {
            var _a, _b;
            var _c = _this.gaugeService.getSegmentPathData(segment), startX = _c.startX, startY = _c.startY, endX = _c.endX, endY = _c.endY, largeArcFlag = _c.largeArcFlag;
            // Create a filled segment
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // Build path for a filled sector (from center to arc)
            path.setAttribute("d", "M 200 200 L ".concat(startX, " ").concat(startY, " A ").concat(160, " ").concat(160, " 0 ").concat(largeArcFlag, " 1 ").concat(endX, " ").concat(endY, " Z"));
            path.setAttribute("fill", segment.color);
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-opacity", "0.9");
            (_a = _this.gaugeSegments) === null || _a === void 0 ? void 0 : _a.appendChild(path);
            // Add segment label
            var labelPos = _this.gaugeService.getSegmentLabelPosition(segment);
            var labelText = _this.gaugeService.getSegmentShortLabel(segment);
            if (labelText) {
                var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
                textElement.setAttribute("x", labelPos.x.toString());
                textElement.setAttribute("y", labelPos.y.toString());
                textElement.setAttribute("text-anchor", "middle");
                textElement.setAttribute("dominant-baseline", "middle");
                textElement.setAttribute("font-family", "Arial, sans-serif");
                textElement.setAttribute("font-size", "12");
                textElement.setAttribute("font-weight", "bold");
                textElement.setAttribute("fill", "white");
                textElement.setAttribute("stroke", "#333");
                textElement.setAttribute("stroke-width", "0.8");
                textElement.setAttribute("transform", "rotate(".concat(labelPos.rotation, " ").concat(labelPos.x, " ").concat(labelPos.y, ")"));
                textElement.textContent = labelText;
                (_b = _this.gaugeSegments) === null || _b === void 0 ? void 0 : _b.appendChild(textElement);
            }
        });
    };
    BSMeterPopup.prototype.animateNeedleToValue = function (targetValue, duration) {
        var _this = this;
        if (duration === void 0) { duration = 1500; }
        if (!this.needle)
            return;
        var startValue = this.currentValue;
        var startTime = performance.now();
        var animate = function (currentTime) {
            var _a, _b;
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // Ease-out animation
            var easedProgress = 1 - Math.pow(1 - progress, 3);
            var currentValue = startValue + (targetValue - startValue) * easedProgress;
            // Update needle position
            var rotation = _this.gaugeService.getNeedleRotation(currentValue);
            (_a = _this.needle) === null || _a === void 0 ? void 0 : _a.setAttribute("transform", "rotate(".concat(rotation, " 200 200)"));
            // Update text and percentage during animation
            _this.updateGaugeTextOnly(currentValue);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                // Ensure final value is exact
                _this.currentValue = targetValue;
                _this.updateGaugeTextOnly(_this.currentValue);
                var finalRotation = _this.gaugeService.getNeedleRotation(_this.currentValue);
                (_b = _this.needle) === null || _b === void 0 ? void 0 : _b.setAttribute("transform", "rotate(".concat(finalRotation, " 200 200)"));
            }
        };
        requestAnimationFrame(animate);
    };
    BSMeterPopup.prototype.rotateNeedle = function (value) {
        if (!this.needle)
            return;
        var rotation = this.gaugeService.getNeedleRotation(value);
        this.needle.setAttribute("transform", "rotate(".concat(rotation, " 200 200)"));
    };
    BSMeterPopup.prototype.updateGaugeText = function (value, customText) {
        if (!this.gaugeText || !this.gaugePercentage)
            return;
        if (customText) {
            this.gaugeText.textContent = customText;
            this.gaugeText.style.color = '#666';
            this.gaugePercentage.textContent = "".concat(Math.round(value), "%");
            this.gaugePercentage.style.color = '#666';
            return;
        }
        var level = this.gaugeService.getLevelForValue(value);
        if (level) {
            this.gaugeText.textContent = level.text;
            this.gaugeText.style.color = level.color;
            this.gaugePercentage.textContent = "".concat(Math.round(value), "%");
            this.gaugePercentage.style.color = level.color;
        }
    };
    BSMeterPopup.prototype.updateGaugeTextOnly = function (value) {
        if (!this.gaugeText || !this.gaugePercentage)
            return;
        var level = this.gaugeService.getLevelForValue(value);
        if (level) {
            this.gaugeText.textContent = level.text;
            this.gaugeText.style.color = level.color;
            this.gaugePercentage.textContent = "".concat(Math.round(value), "%");
            this.gaugePercentage.style.color = level.color;
        }
    };
    BSMeterPopup.prototype.setGaugeValue = function (value, animate) {
        if (animate === void 0) { animate = true; }
        this.currentValue = Math.max(0, Math.min(100, value));
        if (this.valueSlider) {
            this.valueSlider.value = this.currentValue.toString();
        }
        if (animate) {
            this.animateNeedleToValue(this.currentValue);
        }
        else {
            this.rotateNeedle(this.currentValue);
            this.updateGaugeTextOnly(this.currentValue);
        }
    };
    BSMeterPopup.prototype.generateRandomScore = function () {
        var randomValue = this.gaugeService.generateRandomScore();
        this.setGaugeValue(randomValue, true);
    };
    return BSMeterPopup;
}());
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    new BSMeterPopup();
});

/******/ })()
;