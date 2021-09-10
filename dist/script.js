/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/Features/configuration.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/Features/configuration.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initConfiguration": () => (/* binding */ initConfiguration)
/* harmony export */ });
/* harmony import */ var _Properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Properties */ "./node_modules/@workadventure/scripting-api-extra/dist/Properties.js");

async function initConfiguration(assetsUrl) {
    const map = await WA.room.getTiledMap();
    const configurationLayer = map.layers.find((layer) => layer.name === "configuration");
    if (configurationLayer) {
        const properties = new _Properties__WEBPACK_IMPORTED_MODULE_0__.Properties(configurationLayer.properties);
        const tag = properties.getString("tag");
        if (!tag || WA.player.tags.includes(tag)) {
            WA.ui.registerMenuCommand("Configure the room", () => {
                var _a;
                assetsUrl = (_a = assetsUrl !== null && assetsUrl !== void 0 ? assetsUrl : process.env.ASSETS_URL) !== null && _a !== void 0 ? _a : "";
                WA.nav.openCoWebSite(assetsUrl + "configuration.html", true);
            });
        }
    }
}
//# sourceMappingURL=configuration.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/Features/doors.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/Features/doors.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initDoors": () => (/* binding */ initDoors)
/* harmony export */ });
/* harmony import */ var _VariablesExtra__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../VariablesExtra */ "./node_modules/@workadventure/scripting-api-extra/dist/VariablesExtra.js");
/* harmony import */ var _LayersFlattener__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LayersFlattener */ "./node_modules/@workadventure/scripting-api-extra/dist/LayersFlattener.js");
/* harmony import */ var _Properties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Properties */ "./node_modules/@workadventure/scripting-api-extra/dist/Properties.js");
/* harmony import */ var _LayersExtra__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../LayersExtra */ "./node_modules/@workadventure/scripting-api-extra/dist/LayersExtra.js");




let layersMap;
let playerX = 0;
let playerY = 0;
function updateDoorLayers(variable) {
    if (WA.state[variable.name]) {
        let layers = variable.properties.mustGetString("openLayer");
        for (const layer of layers.split("\n")) {
            WA.room.showLayer(layer);
        }
        layers = variable.properties.mustGetString("closeLayer");
        for (const layer of layers.split("\n")) {
            WA.room.hideLayer(layer);
        }
    }
    else {
        let layers = variable.properties.mustGetString("openLayer");
        for (const layer of layers.split("\n")) {
            WA.room.hideLayer(layer);
        }
        layers = variable.properties.mustGetString("closeLayer");
        for (const layer of layers.split("\n")) {
            WA.room.showLayer(layer);
        }
    }
}
function playOpenSound(variable) {
    const url = variable.properties.getString("openSound");
    const radius = variable.properties.getNumber("soundRadius");
    let volume = 1;
    if (radius) {
        const distance = getDistance(variable.properties.mustGetString("openLayer").split("\n"));
        if (distance > radius) {
            return;
        }
        volume = 1 - distance / radius;
    }
    if (url) {
        WA.sound.loadSound(url).play({
            volume,
        });
    }
}
function playCloseSound(variable) {
    const url = variable.properties.getString("closeSound");
    const radius = variable.properties.getNumber("soundRadius");
    let volume = 1;
    if (radius) {
        const distance = getDistance(variable.properties.mustGetString("closeLayer").split("\n"));
        if (distance > radius) {
            return;
        }
        volume = 1 - distance / radius;
    }
    if (url) {
        WA.sound.loadSound(url).play({
            volume,
        });
    }
}
function getTileLayers(layerNames) {
    return layerNames
        .map((layerName) => layersMap.get(layerName))
        .filter((layer) => (layer === null || layer === void 0 ? void 0 : layer.type) === "tilelayer");
}
function getDistance(layerNames) {
    const layers = getTileLayers(layerNames);
    const boundaries = (0,_LayersExtra__WEBPACK_IMPORTED_MODULE_3__.findLayersBoundaries)(layers);
    const xLayer = ((boundaries.right - boundaries.left) / 2 + boundaries.left) * 32;
    const yLayer = ((boundaries.bottom - boundaries.top) / 2 + boundaries.top) * 32;
    return Math.sqrt(Math.pow(playerX - xLayer, 2) + Math.pow(playerY - yLayer, 2));
}
function initDoor(variable) {
    WA.state.onVariableChange(variable.name).subscribe(() => {
        if (WA.state[variable.name]) {
            playOpenSound(variable);
        }
        else {
            playCloseSound(variable);
        }
        updateDoorLayers(variable);
    });
    updateDoorLayers(variable);
}
function initDoorstep(layer, doorVariable, properties, assetsUrl) {
    const name = layer.name;
    let actionMessage = undefined;
    let keypadWebsite = undefined;
    let inZone = false;
    const zoneName = properties.getString("zone");
    if (!zoneName) {
        throw new Error('Missing "zone" property on doorstep layer "' + name + '"');
    }
    const tag = properties.getString("tag");
    let allowed = true;
    if (tag && !WA.player.tags.includes(tag)) {
        allowed = false;
    }
    const accessRestricted = !!tag;
    function displayCloseDoorMessage() {
        var _a;
        if (actionMessage) {
            actionMessage.remove();
        }
        actionMessage = WA.ui.displayActionMessage({
            message: (_a = properties.getString("closeTriggerMessage")) !== null && _a !== void 0 ? _a : "Press SPACE to close the door",
            callback: () => {
                WA.state[doorVariable.name] = false;
                displayOpenDoorMessage();
            },
        });
    }
    function displayOpenDoorMessage() {
        var _a;
        if (actionMessage) {
            actionMessage.remove();
        }
        actionMessage = WA.ui.displayActionMessage({
            message: (_a = properties.getString("openTriggerMessage")) !== null && _a !== void 0 ? _a : "Press SPACE to open the door",
            callback: () => {
                WA.state[doorVariable.name] = true;
                displayCloseDoorMessage();
            },
        });
    }
    function openKeypad(name) {
        const boundaries = (0,_LayersExtra__WEBPACK_IMPORTED_MODULE_3__.findLayersBoundaries)(getTileLayers(doorVariable.properties.mustGetString("closeLayer").split("\n")));
        keypadWebsite = WA.room.website.create({
            name: "doorKeypad" + name,
            url: assetsUrl + "/keypad.html#" + encodeURIComponent(name),
            position: {
                x: boundaries.right * 32,
                y: boundaries.top * 32,
                width: 32 * 3,
                height: 32 * 4,
            },
            allowApi: true,
        });
    }
    function closeKeypad() {
        if (keypadWebsite) {
            WA.room.website.delete(keypadWebsite.name);
            keypadWebsite = undefined;
        }
    }
    WA.room.onEnterZone(zoneName, () => {
        inZone = true;
        if (properties.getBoolean("autoOpen") && allowed) {
            WA.state[doorVariable.name] = true;
            return;
        }
        if (!WA.state[doorVariable.name] &&
            ((accessRestricted && !allowed) || !accessRestricted) &&
            (properties.getString("code") || properties.getString("codeVariable"))) {
            openKeypad(name);
            return;
        }
        if (!allowed) {
            return;
        }
        if (WA.state[doorVariable.name]) {
            displayCloseDoorMessage();
        }
        else {
            displayOpenDoorMessage();
        }
    });
    WA.room.onLeaveZone(zoneName, () => {
        inZone = false;
        if (properties.getBoolean("autoClose")) {
            WA.state[doorVariable.name] = false;
        }
        if (actionMessage) {
            actionMessage.remove();
        }
        closeKeypad();
    });
    WA.state.onVariableChange(doorVariable.name).subscribe(() => {
        if (inZone) {
            if (!properties.getBoolean("autoClose") && WA.state[doorVariable.name] === true) {
                displayCloseDoorMessage();
            }
            if (keypadWebsite && WA.state[doorVariable.name] === true) {
                closeKeypad();
            }
            if (!properties.getBoolean("autoOpen") && WA.state[doorVariable.name] === false) {
                displayOpenDoorMessage();
            }
        }
    });
}
function playBellSound(variable) {
    const url = variable.properties.mustGetString("bellSound");
    const radius = variable.properties.getNumber("soundRadius");
    let volume = 1;
    if (radius) {
        const distance = Math.sqrt(Math.pow(variable.x - playerX, 2) + Math.pow(variable.y - playerY, 2));
        if (distance > radius) {
            return;
        }
        volume = 1 - distance / radius;
    }
    WA.sound.loadSound(url).play({
        volume,
    });
}
function initBell(variable) {
    if (WA.state[variable.name] === undefined) {
        WA.state[variable.name] = 0;
    }
    WA.state.onVariableChange(variable.name).subscribe(() => {
        if (WA.state[variable.name]) {
            playBellSound(variable);
        }
    });
}
function initBellLayer(bellVariable, properties) {
    let popup = undefined;
    const zoneName = properties.mustGetString("zone");
    const bellPopupName = properties.getString("bellPopup");
    WA.room.onEnterZone(zoneName, () => {
        var _a;
        if (!bellPopupName) {
            WA.state[bellVariable] = WA.state[bellVariable] + 1;
        }
        else {
            popup = WA.ui.openPopup(bellPopupName, "", [
                {
                    label: (_a = properties.getString("bellButtonText")) !== null && _a !== void 0 ? _a : "Ring",
                    callback: () => {
                        WA.state[bellVariable] = WA.state[bellVariable] + 1;
                    },
                },
            ]);
        }
    });
    WA.room.onLeaveZone(zoneName, () => {
        if (popup) {
            popup.close();
            popup = undefined;
        }
    });
}
async function initDoors(assetsUrl) {
    var _a;
    assetsUrl = (_a = assetsUrl !== null && assetsUrl !== void 0 ? assetsUrl : process.env.ASSETS_URL) !== null && _a !== void 0 ? _a : "";
    const variables = await (0,_VariablesExtra__WEBPACK_IMPORTED_MODULE_0__.getAllVariables)();
    layersMap = await (0,_LayersFlattener__WEBPACK_IMPORTED_MODULE_1__.getLayersMap)();
    for (const variable of variables.values()) {
        if (variable.properties.get("door")) {
            initDoor(variable);
        }
        if (variable.properties.get("bell")) {
            initBell(variable);
        }
    }
    for (const layer of layersMap.values()) {
        const properties = new _Properties__WEBPACK_IMPORTED_MODULE_2__.Properties(layer.properties);
        const doorVariableName = properties.getString("doorVariable");
        if (doorVariableName && layer.type === "tilelayer") {
            const doorVariable = variables.get(doorVariableName);
            if (doorVariable === undefined) {
                throw new Error('Cannot find variable "' +
                    doorVariableName +
                    '" referred in the "doorVariable" property of layer "' +
                    layer.name +
                    '"');
            }
            initDoorstep(layer, doorVariable, properties, assetsUrl);
        }
        const bellVariable = properties.getString("bellVariable");
        if (bellVariable) {
            initBellLayer(bellVariable, properties);
        }
    }
    WA.player.onPlayerMove((moveEvent) => {
        playerX = moveEvent.x;
        playerY = moveEvent.y;
    });
}
//# sourceMappingURL=doors.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/Features/properties_templates.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/Features/properties_templates.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initPropertiesTemplates": () => (/* binding */ initPropertiesTemplates)
/* harmony export */ });
/* harmony import */ var _LayersFlattener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LayersFlattener */ "./node_modules/@workadventure/scripting-api-extra/dist/LayersFlattener.js");
/* harmony import */ var _TemplateValue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TemplateValue */ "./node_modules/@workadventure/scripting-api-extra/dist/TemplateValue.js");


async function initPropertiesTemplates() {
    var _a;
    const layers = await (0,_LayersFlattener__WEBPACK_IMPORTED_MODULE_0__.getLayersMap)();
    for (const [layerName, layer] of layers.entries()) {
        const properties = (_a = layer.properties) !== null && _a !== void 0 ? _a : [];
        for (const property of properties) {
            if (property.type === "int" || property.type === "bool" || property.type === "object") {
                continue;
            }
            const template = new _TemplateValue__WEBPACK_IMPORTED_MODULE_1__.TemplateValue(property.value, WA.state);
            if (template.isPureString()) {
                continue;
            }
            const newValue = template.getValue();
            setProperty(layerName, property.name, newValue);
            template.onChange((newValue) => {
                setProperty(layerName, property.name, newValue);
            });
        }
    }
}
function setProperty(layerName, propertyName, value) {
    WA.room.setProperty(layerName, propertyName, value);
    if (propertyName === "visible") {
        if (value) {
            WA.room.showLayer(layerName);
        }
        else {
            WA.room.hideLayer(layerName);
        }
    }
}
//# sourceMappingURL=properties_templates.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/Features/special_properties.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/Features/special_properties.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initSpecialProperties": () => (/* binding */ initSpecialProperties)
/* harmony export */ });
/* harmony import */ var _LayersFlattener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LayersFlattener */ "./node_modules/@workadventure/scripting-api-extra/dist/LayersFlattener.js");
/* harmony import */ var _Properties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Properties */ "./node_modules/@workadventure/scripting-api-extra/dist/Properties.js");
/* harmony import */ var _variable_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable_actions */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/variable_actions.js");



async function initSpecialProperties() {
    const layers = await (0,_LayersFlattener__WEBPACK_IMPORTED_MODULE_0__.getLayersMap)();
    for (const layer of layers.values()) {
        const properties = new _Properties__WEBPACK_IMPORTED_MODULE_1__.Properties(layer.properties);
        (0,_variable_actions__WEBPACK_IMPORTED_MODULE_2__.initVariableActionLayer)(properties);
    }
}
//# sourceMappingURL=special_properties.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/Features/variable_actions.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/Features/variable_actions.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initVariableActionLayer": () => (/* binding */ initVariableActionLayer)
/* harmony export */ });
function initVariableActionLayer(properties) {
    const variableName = properties.getString("bindVariable");
    if (variableName) {
        const zone = properties.getString("zone");
        if (!zone) {
            throw new Error('A layer with a "bindVariable" property must ALSO have a "zone" property.');
        }
        const enterValue = properties.get("enterValue");
        const leaveValue = properties.get("leaveValue");
        const triggerMessage = properties.getString("triggerMessage");
        const tag = properties.getString("tag");
        setupVariableActionLayer(variableName, zone, enterValue, leaveValue, triggerMessage, tag);
    }
}
function setupVariableActionLayer(variableName, zone, enterValue, leaveValue, triggerMessage, tag) {
    if (tag && !WA.player.tags.includes(tag)) {
        return;
    }
    if (enterValue !== undefined) {
        WA.room.onEnterZone(zone, () => {
            if (triggerMessage) {
            }
            else {
                WA.state[variableName] = enterValue;
            }
        });
    }
    if (leaveValue !== undefined) {
        WA.room.onLeaveZone(zone, () => {
            WA.state[variableName] = leaveValue;
        });
    }
}
//# sourceMappingURL=variable_actions.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/LayersExtra.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/LayersExtra.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findLayerBoundaries": () => (/* binding */ findLayerBoundaries),
/* harmony export */   "findLayersBoundaries": () => (/* binding */ findLayersBoundaries)
/* harmony export */ });
function findLayerBoundaries(layer) {
    let left = Infinity;
    let top = Infinity;
    let bottom = 0;
    let right = 0;
    const data = layer.data;
    if (typeof data === "string") {
        throw new Error("Unsupported tile layer data stored as string instead of CSV");
    }
    for (let j = 0; j < layer.height; j++) {
        for (let i = 0; i < layer.width; i++) {
            if (data[i + j * layer.width] !== 0) {
                left = Math.min(left, i);
                right = Math.max(right, i);
                top = Math.min(top, j);
                bottom = Math.max(bottom, j);
            }
        }
    }
    return {
        top,
        left,
        right: right + 1,
        bottom: bottom + 1,
    };
}
function findLayersBoundaries(layers) {
    let left = Infinity;
    let top = Infinity;
    let bottom = 0;
    let right = 0;
    for (const layer of layers) {
        const boundaries = findLayerBoundaries(layer);
        if (boundaries.left < left) {
            left = boundaries.left;
        }
        if (boundaries.top < top) {
            top = boundaries.top;
        }
        if (boundaries.right > right) {
            right = boundaries.right;
        }
        if (boundaries.bottom > bottom) {
            bottom = boundaries.bottom;
        }
    }
    return {
        top,
        left,
        right,
        bottom,
    };
}
//# sourceMappingURL=LayersExtra.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/LayersFlattener.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/LayersFlattener.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLayersMap": () => (/* binding */ getLayersMap)
/* harmony export */ });
let layersMapPromise = undefined;
async function getLayersMap() {
    if (layersMapPromise === undefined) {
        layersMapPromise = getLayersMapWithoutCache();
    }
    return layersMapPromise;
}
async function getLayersMapWithoutCache() {
    return flattenGroupLayersMap(await WA.room.getTiledMap());
}
function flattenGroupLayersMap(map) {
    const flatLayers = new Map();
    flattenGroupLayers(map.layers, "", flatLayers);
    return flatLayers;
}
function flattenGroupLayers(layers, prefix, flatLayers) {
    for (const layer of layers) {
        if (layer.type === "group") {
            flattenGroupLayers(layer.layers, prefix + layer.name + "/", flatLayers);
        }
        else {
            layer.name = prefix + layer.name;
            flatLayers.set(layer.name, layer);
        }
    }
}
//# sourceMappingURL=LayersFlattener.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/Properties.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/Properties.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Properties": () => (/* binding */ Properties)
/* harmony export */ });
class Properties {
    constructor(properties) {
        this.properties = properties !== null && properties !== void 0 ? properties : [];
    }
    get(name) {
        const values = this.properties
            .filter((property) => property.name === name)
            .map((property) => property.value);
        if (values.length > 1) {
            throw new Error('Expected only one property to be named "' + name + '"');
        }
        if (values.length === 0) {
            return undefined;
        }
        return values[0];
    }
    getString(name) {
        return this.getByType(name, "string");
    }
    getNumber(name) {
        return this.getByType(name, "number");
    }
    getBoolean(name) {
        return this.getByType(name, "boolean");
    }
    getByType(name, type) {
        const value = this.get(name);
        if (value === undefined) {
            return undefined;
        }
        if (typeof value !== type) {
            throw new Error('Expected property "' + name + '" to have type "' + type + '"');
        }
        return value;
    }
    mustGetString(name) {
        return this.mustGetByType(name, "string");
    }
    mustGetNumber(name) {
        return this.mustGetByType(name, "number");
    }
    mustGetBoolean(name) {
        return this.mustGetByType(name, "boolean");
    }
    mustGetByType(name, type) {
        const value = this.get(name);
        if (value === undefined) {
            throw new Error('Property "' + name + '" is missing');
        }
        if (typeof value !== type) {
            throw new Error('Expected property "' + name + '" to have type "' + type + '"');
        }
        return value;
    }
    getType(name) {
        const types = this.properties
            .filter((property) => property.name === name)
            .map((property) => property.type);
        if (types.length > 1) {
            throw new Error('Expected only one property to be named "' + name + '"');
        }
        if (types.length === 0) {
            return undefined;
        }
        return types[0];
    }
}
//# sourceMappingURL=Properties.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/TemplateValue.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/TemplateValue.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TemplateValue": () => (/* binding */ TemplateValue)
/* harmony export */ });
/* harmony import */ var mustache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mustache */ "./node_modules/mustache/mustache.mjs");

class TemplateValue {
    constructor(template, state) {
        this.template = template;
        this.state = state;
        this.ast = mustache__WEBPACK_IMPORTED_MODULE_0__.default.parse(template);
    }
    getValue() {
        if (this.value === undefined) {
            this.value = mustache__WEBPACK_IMPORTED_MODULE_0__.default.render(this.template, this.state);
        }
        return this.value;
    }
    onChange(callback) {
        const subscriptions = [];
        for (const variableName of this.getUsedVariables().values()) {
            subscriptions.push(this.state.onVariableChange(variableName).subscribe(() => {
                const newValue = mustache__WEBPACK_IMPORTED_MODULE_0__.default.render(this.template, this.state);
                if (newValue !== this.value) {
                    this.value = newValue;
                    callback(this.value);
                }
            }));
        }
        return {
            unsubscribe: () => {
                for (const subscription of subscriptions) {
                    subscription.unsubscribe();
                }
            },
        };
    }
    isPureString() {
        return this.ast.length === 0 || (this.ast.length === 1 && this.ast[0][0] === "text");
    }
    getUsedVariables() {
        const variables = new Set();
        this.recursiveGetUsedVariables(this.ast, variables);
        return variables;
    }
    recursiveGetUsedVariables(ast, variables) {
        for (const token of ast) {
            const type = token[0];
            const name = token[1];
            const subAst = token[4];
            if (["name", "&", "#", "^"].includes(type)) {
                variables.add(name);
            }
            if (subAst !== undefined && typeof subAst !== "string") {
                this.recursiveGetUsedVariables(subAst, variables);
            }
        }
    }
}
//# sourceMappingURL=TemplateValue.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/VariablesExtra.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/VariablesExtra.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VariableDescriptor": () => (/* binding */ VariableDescriptor),
/* harmony export */   "getAllVariables": () => (/* binding */ getAllVariables)
/* harmony export */ });
/* harmony import */ var _Properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Properties */ "./node_modules/@workadventure/scripting-api-extra/dist/Properties.js");

class VariableDescriptor {
    constructor(object) {
        this.name = object.name;
        this.x = object.x;
        this.y = object.y;
        this.properties = new _Properties__WEBPACK_IMPORTED_MODULE_0__.Properties(object.properties);
    }
    get isReadable() {
        const readableBy = this.properties.getString("readableBy");
        if (!readableBy) {
            return true;
        }
        return WA.player.tags.includes(readableBy);
    }
    get isWritable() {
        const writableBy = this.properties.getString("writableBy");
        if (!writableBy) {
            return true;
        }
        return WA.player.tags.includes(writableBy);
    }
}
async function getAllVariables() {
    const map = await WA.room.getTiledMap();
    const variables = new Map();
    getAllVariablesRecursive(map.layers, variables);
    return variables;
}
function getAllVariablesRecursive(layers, variables) {
    for (const layer of layers) {
        if (layer.type === "objectgroup") {
            for (const object of layer.objects) {
                if (object.type === "variable") {
                    variables.set(object.name, new VariableDescriptor(object));
                }
            }
        }
        else if (layer.type === "group") {
            getAllVariablesRecursive(layer.layers, variables);
        }
    }
}
//# sourceMappingURL=VariablesExtra.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VariableDescriptor": () => (/* reexport safe */ _VariablesExtra__WEBPACK_IMPORTED_MODULE_0__.VariableDescriptor),
/* harmony export */   "getAllVariables": () => (/* reexport safe */ _VariablesExtra__WEBPACK_IMPORTED_MODULE_0__.getAllVariables),
/* harmony export */   "Properties": () => (/* reexport safe */ _Properties__WEBPACK_IMPORTED_MODULE_1__.Properties),
/* harmony export */   "getLayersMap": () => (/* reexport safe */ _LayersFlattener__WEBPACK_IMPORTED_MODULE_2__.getLayersMap),
/* harmony export */   "findLayerBoundaries": () => (/* reexport safe */ _LayersExtra__WEBPACK_IMPORTED_MODULE_3__.findLayerBoundaries),
/* harmony export */   "findLayersBoundaries": () => (/* reexport safe */ _LayersExtra__WEBPACK_IMPORTED_MODULE_3__.findLayersBoundaries),
/* harmony export */   "initPropertiesTemplates": () => (/* reexport safe */ _Features_properties_templates__WEBPACK_IMPORTED_MODULE_4__.initPropertiesTemplates),
/* harmony export */   "initDoors": () => (/* reexport safe */ _Features_doors__WEBPACK_IMPORTED_MODULE_5__.initDoors),
/* harmony export */   "initVariableActionLayer": () => (/* reexport safe */ _Features_variable_actions__WEBPACK_IMPORTED_MODULE_6__.initVariableActionLayer),
/* harmony export */   "bootstrapExtra": () => (/* reexport safe */ _init__WEBPACK_IMPORTED_MODULE_7__.bootstrapExtra)
/* harmony export */ });
/* harmony import */ var _VariablesExtra__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VariablesExtra */ "./node_modules/@workadventure/scripting-api-extra/dist/VariablesExtra.js");
/* harmony import */ var _Properties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Properties */ "./node_modules/@workadventure/scripting-api-extra/dist/Properties.js");
/* harmony import */ var _LayersFlattener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LayersFlattener */ "./node_modules/@workadventure/scripting-api-extra/dist/LayersFlattener.js");
/* harmony import */ var _LayersExtra__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LayersExtra */ "./node_modules/@workadventure/scripting-api-extra/dist/LayersExtra.js");
/* harmony import */ var _Features_properties_templates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Features/properties_templates */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/properties_templates.js");
/* harmony import */ var _Features_doors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Features/doors */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/doors.js");
/* harmony import */ var _Features_variable_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Features/variable_actions */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/variable_actions.js");
/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./init */ "./node_modules/@workadventure/scripting-api-extra/dist/init.js");








//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@workadventure/scripting-api-extra/dist/init.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@workadventure/scripting-api-extra/dist/init.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootstrapExtra": () => (/* binding */ bootstrapExtra)
/* harmony export */ });
/* harmony import */ var _Features_doors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Features/doors */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/doors.js");
/* harmony import */ var _Features_special_properties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Features/special_properties */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/special_properties.js");
/* harmony import */ var _Features_configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Features/configuration */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/configuration.js");
/* harmony import */ var _Features_properties_templates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Features/properties_templates */ "./node_modules/@workadventure/scripting-api-extra/dist/Features/properties_templates.js");




function bootstrapExtra() {
    return WA.onInit().then(() => {
        (0,_Features_doors__WEBPACK_IMPORTED_MODULE_0__.initDoors)().catch((e) => console.error(e));
        (0,_Features_special_properties__WEBPACK_IMPORTED_MODULE_1__.initSpecialProperties)().catch((e) => console.error(e));
        (0,_Features_configuration__WEBPACK_IMPORTED_MODULE_2__.initConfiguration)().catch((e) => console.error(e));
        (0,_Features_properties_templates__WEBPACK_IMPORTED_MODULE_3__.initPropertiesTemplates)().catch((e) => console.error(e));
    });
}
//# sourceMappingURL=init.js.map

/***/ }),

/***/ "./node_modules/mustache/mustache.mjs":
/*!********************************************!*\
  !*** ./node_modules/mustache/mustache.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill (object) {
  return objectToString.call(object) === '[object Array]';
};

function isFunction (object) {
  return typeof object === 'function';
}

/**
 * More correct typeof string handling array
 * which normally returns typeof 'object'
 */
function typeStr (obj) {
  return isArray(obj) ? 'array' : typeof obj;
}

function escapeRegExp (string) {
  return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}

/**
 * Null safe way of checking whether or not an object,
 * including its prototype, has a given property
 */
function hasProperty (obj, propName) {
  return obj != null && typeof obj === 'object' && (propName in obj);
}

/**
 * Safe way of detecting whether or not the given thing is a primitive and
 * whether it has the given property
 */
function primitiveHasOwnProperty (primitive, propName) {
  return (
    primitive != null
    && typeof primitive !== 'object'
    && primitive.hasOwnProperty
    && primitive.hasOwnProperty(propName)
  );
}

// Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
// See https://github.com/janl/mustache.js/issues/189
var regExpTest = RegExp.prototype.test;
function testRegExp (re, string) {
  return regExpTest.call(re, string);
}

var nonSpaceRe = /\S/;
function isWhitespace (string) {
  return !testRegExp(nonSpaceRe, string);
}

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return entityMap[s];
  });
}

var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;

/**
 * Breaks up the given `template` string into a tree of tokens. If the `tags`
 * argument is given here it must be an array with two string values: the
 * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
 * course, the default is to use mustaches (i.e. mustache.tags).
 *
 * A token is an array with at least 4 elements. The first element is the
 * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
 * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
 * all text that appears outside a symbol this element is "text".
 *
 * The second element of a token is its "value". For mustache tags this is
 * whatever else was inside the tag besides the opening symbol. For text tokens
 * this is the text itself.
 *
 * The third and fourth elements of the token are the start and end indices,
 * respectively, of the token in the original template.
 *
 * Tokens that are the root node of a subtree contain two more elements: 1) an
 * array of tokens in the subtree and 2) the index in the original template at
 * which the closing tag for that section begins.
 *
 * Tokens for partials also contain two more elements: 1) a string value of
 * indendation prior to that tag and 2) the index of that tag on that line -
 * eg a value of 2 indicates the partial is the third tag on this line.
 */
function parseTemplate (template, tags) {
  if (!template)
    return [];
  var lineHasNonSpace = false;
  var sections = [];     // Stack to hold section tokens
  var tokens = [];       // Buffer to hold the tokens
  var spaces = [];       // Indices of whitespace tokens on the current line
  var hasTag = false;    // Is there a {{tag}} on the current line?
  var nonSpace = false;  // Is there a non-space char on the current line?
  var indentation = '';  // Tracks indentation for tags that use it
  var tagIndex = 0;      // Stores a count of number of tags encountered on a line

  // Strips all whitespace tokens array for the current line
  // if there was a {{#tag}} on it and otherwise only space.
  function stripSpace () {
    if (hasTag && !nonSpace) {
      while (spaces.length)
        delete tokens[spaces.pop()];
    } else {
      spaces = [];
    }

    hasTag = false;
    nonSpace = false;
  }

  var openingTagRe, closingTagRe, closingCurlyRe;
  function compileTags (tagsToCompile) {
    if (typeof tagsToCompile === 'string')
      tagsToCompile = tagsToCompile.split(spaceRe, 2);

    if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
      throw new Error('Invalid tags: ' + tagsToCompile);

    openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
    closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
    closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
  }

  compileTags(tags || mustache.tags);

  var scanner = new Scanner(template);

  var start, type, value, chr, token, openSection;
  while (!scanner.eos()) {
    start = scanner.pos;

    // Match any text between tags.
    value = scanner.scanUntil(openingTagRe);

    if (value) {
      for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
        chr = value.charAt(i);

        if (isWhitespace(chr)) {
          spaces.push(tokens.length);
          indentation += chr;
        } else {
          nonSpace = true;
          lineHasNonSpace = true;
          indentation += ' ';
        }

        tokens.push([ 'text', chr, start, start + 1 ]);
        start += 1;

        // Check for whitespace on the current line.
        if (chr === '\n') {
          stripSpace();
          indentation = '';
          tagIndex = 0;
          lineHasNonSpace = false;
        }
      }
    }

    // Match the opening tag.
    if (!scanner.scan(openingTagRe))
      break;

    hasTag = true;

    // Get the tag type.
    type = scanner.scan(tagRe) || 'name';
    scanner.scan(whiteRe);

    // Get the tag value.
    if (type === '=') {
      value = scanner.scanUntil(equalsRe);
      scanner.scan(equalsRe);
      scanner.scanUntil(closingTagRe);
    } else if (type === '{') {
      value = scanner.scanUntil(closingCurlyRe);
      scanner.scan(curlyRe);
      scanner.scanUntil(closingTagRe);
      type = '&';
    } else {
      value = scanner.scanUntil(closingTagRe);
    }

    // Match the closing tag.
    if (!scanner.scan(closingTagRe))
      throw new Error('Unclosed tag at ' + scanner.pos);

    if (type == '>') {
      token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
    } else {
      token = [ type, value, start, scanner.pos ];
    }
    tagIndex++;
    tokens.push(token);

    if (type === '#' || type === '^') {
      sections.push(token);
    } else if (type === '/') {
      // Check section nesting.
      openSection = sections.pop();

      if (!openSection)
        throw new Error('Unopened section "' + value + '" at ' + start);

      if (openSection[1] !== value)
        throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
    } else if (type === 'name' || type === '{' || type === '&') {
      nonSpace = true;
    } else if (type === '=') {
      // Set the tags for the next time around.
      compileTags(value);
    }
  }

  stripSpace();

  // Make sure there are no open sections when we're done.
  openSection = sections.pop();

  if (openSection)
    throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

  return nestTokens(squashTokens(tokens));
}

/**
 * Combines the values of consecutive text tokens in the given `tokens` array
 * to a single token.
 */
function squashTokens (tokens) {
  var squashedTokens = [];

  var token, lastToken;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];

    if (token) {
      if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
        lastToken[1] += token[1];
        lastToken[3] = token[3];
      } else {
        squashedTokens.push(token);
        lastToken = token;
      }
    }
  }

  return squashedTokens;
}

/**
 * Forms the given array of `tokens` into a nested tree structure where
 * tokens that represent a section have two additional items: 1) an array of
 * all tokens that appear in that section and 2) the index in the original
 * template that represents the end of that section.
 */
function nestTokens (tokens) {
  var nestedTokens = [];
  var collector = nestedTokens;
  var sections = [];

  var token, section;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];

    switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
    }
  }

  return nestedTokens;
}

/**
 * A simple string scanner that is used by the template parser to find
 * tokens in template strings.
 */
function Scanner (string) {
  this.string = string;
  this.tail = string;
  this.pos = 0;
}

/**
 * Returns `true` if the tail is empty (end of string).
 */
Scanner.prototype.eos = function eos () {
  return this.tail === '';
};

/**
 * Tries to match the given regular expression at the current position.
 * Returns the matched text if it can match, the empty string otherwise.
 */
Scanner.prototype.scan = function scan (re) {
  var match = this.tail.match(re);

  if (!match || match.index !== 0)
    return '';

  var string = match[0];

  this.tail = this.tail.substring(string.length);
  this.pos += string.length;

  return string;
};

/**
 * Skips all text until the given regular expression can be matched. Returns
 * the skipped string, which is the entire tail if no match can be made.
 */
Scanner.prototype.scanUntil = function scanUntil (re) {
  var index = this.tail.search(re), match;

  switch (index) {
    case -1:
      match = this.tail;
      this.tail = '';
      break;
    case 0:
      match = '';
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
  }

  this.pos += match.length;

  return match;
};

/**
 * Represents a rendering context by wrapping a view object and
 * maintaining a reference to the parent context.
 */
function Context (view, parentContext) {
  this.view = view;
  this.cache = { '.': this.view };
  this.parent = parentContext;
}

/**
 * Creates a new context using the given view with this context
 * as the parent.
 */
Context.prototype.push = function push (view) {
  return new Context(view, this);
};

/**
 * Returns the value of the given name in this context, traversing
 * up the context hierarchy if the value is absent in this context's view.
 */
Context.prototype.lookup = function lookup (name) {
  var cache = this.cache;

  var value;
  if (cache.hasOwnProperty(name)) {
    value = cache[name];
  } else {
    var context = this, intermediateValue, names, index, lookupHit = false;

    while (context) {
      if (name.indexOf('.') > 0) {
        intermediateValue = context.view;
        names = name.split('.');
        index = 0;

        /**
         * Using the dot notion path in `name`, we descend through the
         * nested objects.
         *
         * To be certain that the lookup has been successful, we have to
         * check if the last object in the path actually has the property
         * we are looking for. We store the result in `lookupHit`.
         *
         * This is specially necessary for when the value has been set to
         * `undefined` and we want to avoid looking up parent contexts.
         *
         * In the case where dot notation is used, we consider the lookup
         * to be successful even if the last "object" in the path is
         * not actually an object but a primitive (e.g., a string, or an
         * integer), because it is sometimes useful to access a property
         * of an autoboxed primitive, such as the length of a string.
         **/
        while (intermediateValue != null && index < names.length) {
          if (index === names.length - 1)
            lookupHit = (
              hasProperty(intermediateValue, names[index])
              || primitiveHasOwnProperty(intermediateValue, names[index])
            );

          intermediateValue = intermediateValue[names[index++]];
        }
      } else {
        intermediateValue = context.view[name];

        /**
         * Only checking against `hasProperty`, which always returns `false` if
         * `context.view` is not an object. Deliberately omitting the check
         * against `primitiveHasOwnProperty` if dot notation is not used.
         *
         * Consider this example:
         * ```
         * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
         * ```
         *
         * If we were to check also against `primitiveHasOwnProperty`, as we do
         * in the dot notation case, then render call would return:
         *
         * "The length of a football field is 9."
         *
         * rather than the expected:
         *
         * "The length of a football field is 100 yards."
         **/
        lookupHit = hasProperty(context.view, name);
      }

      if (lookupHit) {
        value = intermediateValue;
        break;
      }

      context = context.parent;
    }

    cache[name] = value;
  }

  if (isFunction(value))
    value = value.call(this.view);

  return value;
};

/**
 * A Writer knows how to take a stream of tokens and render them to a
 * string, given a context. It also maintains a cache of templates to
 * avoid the need to parse the same template twice.
 */
function Writer () {
  this.templateCache = {
    _cache: {},
    set: function set (key, value) {
      this._cache[key] = value;
    },
    get: function get (key) {
      return this._cache[key];
    },
    clear: function clear () {
      this._cache = {};
    }
  };
}

/**
 * Clears all cached templates in this writer.
 */
Writer.prototype.clearCache = function clearCache () {
  if (typeof this.templateCache !== 'undefined') {
    this.templateCache.clear();
  }
};

/**
 * Parses and caches the given `template` according to the given `tags` or
 * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
 * that is generated from the parse.
 */
Writer.prototype.parse = function parse (template, tags) {
  var cache = this.templateCache;
  var cacheKey = template + ':' + (tags || mustache.tags).join(':');
  var isCacheEnabled = typeof cache !== 'undefined';
  var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

  if (tokens == undefined) {
    tokens = parseTemplate(template, tags);
    isCacheEnabled && cache.set(cacheKey, tokens);
  }
  return tokens;
};

/**
 * High-level method that is used to render the given `template` with
 * the given `view`.
 *
 * The optional `partials` argument may be an object that contains the
 * names and templates of partials that are used in the template. It may
 * also be a function that is used to load partial templates on the fly
 * that takes a single argument: the name of the partial.
 *
 * If the optional `config` argument is given here, then it should be an
 * object with a `tags` attribute or an `escape` attribute or both.
 * If an array is passed, then it will be interpreted the same way as
 * a `tags` attribute on a `config` object.
 *
 * The `tags` attribute of a `config` object must be an array with two
 * string values: the opening and closing tags used in the template (e.g.
 * [ "<%", "%>" ]). The default is to mustache.tags.
 *
 * The `escape` attribute of a `config` object must be a function which
 * accepts a string as input and outputs a safely escaped string.
 * If an `escape` function is not provided, then an HTML-safe string
 * escaping function is used as the default.
 */
Writer.prototype.render = function render (template, view, partials, config) {
  var tags = this.getConfigTags(config);
  var tokens = this.parse(template, tags);
  var context = (view instanceof Context) ? view : new Context(view, undefined);
  return this.renderTokens(tokens, context, partials, template, config);
};

/**
 * Low-level method that renders the given array of `tokens` using
 * the given `context` and `partials`.
 *
 * Note: The `originalTemplate` is only ever used to extract the portion
 * of the original template that was contained in a higher-order section.
 * If the template doesn't use higher-order sections, this argument may
 * be omitted.
 */
Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
  var buffer = '';

  var token, symbol, value;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    value = undefined;
    token = tokens[i];
    symbol = token[0];

    if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
    else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
    else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
    else if (symbol === '&') value = this.unescapedValue(token, context);
    else if (symbol === 'name') value = this.escapedValue(token, context, config);
    else if (symbol === 'text') value = this.rawValue(token);

    if (value !== undefined)
      buffer += value;
  }

  return buffer;
};

Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) {
  var self = this;
  var buffer = '';
  var value = context.lookup(token[1]);

  // This function is used to render an arbitrary template
  // in the current context by higher-order sections.
  function subRender (template) {
    return self.render(template, context, partials, config);
  }

  if (!value) return;

  if (isArray(value)) {
    for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
      buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
    }
  } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
    buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
  } else if (isFunction(value)) {
    if (typeof originalTemplate !== 'string')
      throw new Error('Cannot use higher-order sections without the original template');

    // Extract the portion of the original template that the section contains.
    value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

    if (value != null)
      buffer += value;
  } else {
    buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
  }
  return buffer;
};

Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) {
  var value = context.lookup(token[1]);

  // Use JavaScript's definition of falsy. Include empty arrays.
  // See https://github.com/janl/mustache.js/issues/186
  if (!value || (isArray(value) && value.length === 0))
    return this.renderTokens(token[4], context, partials, originalTemplate, config);
};

Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
  var filteredIndentation = indentation.replace(/[^ \t]/g, '');
  var partialByNl = partial.split('\n');
  for (var i = 0; i < partialByNl.length; i++) {
    if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
      partialByNl[i] = filteredIndentation + partialByNl[i];
    }
  }
  return partialByNl.join('\n');
};

Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) {
  if (!partials) return;
  var tags = this.getConfigTags(config);

  var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
  if (value != null) {
    var lineHasNonSpace = token[6];
    var tagIndex = token[5];
    var indentation = token[4];
    var indentedValue = value;
    if (tagIndex == 0 && indentation) {
      indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
    }
    var tokens = this.parse(indentedValue, tags);
    return this.renderTokens(tokens, context, partials, indentedValue, config);
  }
};

Writer.prototype.unescapedValue = function unescapedValue (token, context) {
  var value = context.lookup(token[1]);
  if (value != null)
    return value;
};

Writer.prototype.escapedValue = function escapedValue (token, context, config) {
  var escape = this.getConfigEscape(config) || mustache.escape;
  var value = context.lookup(token[1]);
  if (value != null)
    return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value);
};

Writer.prototype.rawValue = function rawValue (token) {
  return token[1];
};

Writer.prototype.getConfigTags = function getConfigTags (config) {
  if (isArray(config)) {
    return config;
  }
  else if (config && typeof config === 'object') {
    return config.tags;
  }
  else {
    return undefined;
  }
};

Writer.prototype.getConfigEscape = function getConfigEscape (config) {
  if (config && typeof config === 'object' && !isArray(config)) {
    return config.escape;
  }
  else {
    return undefined;
  }
};

var mustache = {
  name: 'mustache.js',
  version: '4.2.0',
  tags: [ '{{', '}}' ],
  clearCache: undefined,
  escape: undefined,
  parse: undefined,
  render: undefined,
  Scanner: undefined,
  Context: undefined,
  Writer: undefined,
  /**
   * Allows a user to override the default caching strategy, by providing an
   * object with set, get and clear methods. This can also be used to disable
   * the cache by setting it to the literal `undefined`.
   */
  set templateCache (cache) {
    defaultWriter.templateCache = cache;
  },
  /**
   * Gets the default or overridden caching object from the default writer.
   */
  get templateCache () {
    return defaultWriter.templateCache;
  }
};

// All high-level mustache.* functions use this writer.
var defaultWriter = new Writer();

/**
 * Clears all cached templates in the default writer.
 */
mustache.clearCache = function clearCache () {
  return defaultWriter.clearCache();
};

/**
 * Parses and caches the given template in the default writer and returns the
 * array of tokens it contains. Doing this ahead of time avoids the need to
 * parse templates on the fly as they are rendered.
 */
mustache.parse = function parse (template, tags) {
  return defaultWriter.parse(template, tags);
};

/**
 * Renders the `template` with the given `view`, `partials`, and `config`
 * using the default writer.
 */
mustache.render = function render (template, view, partials, config) {
  if (typeof template !== 'string') {
    throw new TypeError('Invalid template! Template should be a "string" ' +
                        'but "' + typeStr(template) + '" was given as the first ' +
                        'argument for mustache#render(template, view, partials)');
  }

  return defaultWriter.render(template, view, partials, config);
};

// Export the escaping function so that the user may override it.
// See https://github.com/janl/mustache.js/issues/244
mustache.escape = escapeHtml;

// Export these mainly for testing, but also for advanced usage.
mustache.Scanner = Scanner;
mustache.Context = Context;
mustache.Writer = Writer;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mustache);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
const scripting_api_extra_1 = __webpack_require__(/*! @workadventure/scripting-api-extra */ "./node_modules/@workadventure/scripting-api-extra/dist/index.js");
console.log('Script started successfully');
function extendedFeatures() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield scripting_api_extra_1.bootstrapExtra();
            console.log('Scripting API Extra loaded successfully');
            const website = yield WA.room.website.get('cinemaScreen');
            console.log('website', website);
            website.x = 800;
            website.y = 1000;
            website.width = 320;
            website.height = 240;
        }
        catch (error) {
            console.error('Scripting API Extra ERROR', error);
        }
    });
}
extendedFeatures();
let currentZone;
let currentPopup;
const config = [
    {
        zone: 'needHelp',
        message: 'Do you need some guidance? We are happy to help you out.',
        cta: [
            {
                label: 'Meet us',
                className: 'primary',
                callback: () => WA.openTab('https://play.staging.workadventu.re/@/tcm/workadventure/wa-village'),
            }
        ]
    },
    {
        zone: 'followUs',
        message: 'Hey! Have you already started following us?',
        cta: [
            {
                label: 'LinkedIn',
                className: 'primary',
                callback: () => WA.openTab('https://www.linkedin.com/company/workadventu-re'),
            },
            {
                label: 'Twitter',
                className: 'primary',
                callback: () => WA.openTab('https://twitter.com/workadventure_'),
            }
        ]
    },
];
WA.onEnterZone('needHelp', () => {
    currentZone = 'needHelp';
    openPopup(currentZone, currentZone + 'Popup');
});
WA.onEnterZone('followUs', () => {
    currentZone = 'followUs';
    openPopup(currentZone, currentZone + 'Popup');
});
WA.onLeaveZone('needHelp', closePopup);
WA.onLeaveZone('followUs', closePopup);
function openPopup(zoneName, popupName) {
    const zone = config.find((item) => {
        return item.zone == zoneName;
    });
    if (typeof zone !== 'undefined') {
        // @ts-ignore otherwise we can't use zone.cta object
        currentPopup = WA.openPopup(popupName, zone.message, zone.cta);
    }
}
function closePopup() {
    if (typeof currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}


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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93b3JrYWR2ZW50dXJlLW1hcC1zdGFydGVyLWtpdC8uL25vZGVfbW9kdWxlcy9Ad29ya2FkdmVudHVyZS9zY3JpcHRpbmctYXBpLWV4dHJhL2Rpc3QvRmVhdHVyZXMvY29uZmlndXJhdGlvbi5qcyIsIndlYnBhY2s6Ly93b3JrYWR2ZW50dXJlLW1hcC1zdGFydGVyLWtpdC8uL25vZGVfbW9kdWxlcy9Ad29ya2FkdmVudHVyZS9zY3JpcHRpbmctYXBpLWV4dHJhL2Rpc3QvRmVhdHVyZXMvZG9vcnMuanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9ub2RlX21vZHVsZXMvQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYS9kaXN0L0ZlYXR1cmVzL3Byb3BlcnRpZXNfdGVtcGxhdGVzLmpzIiwid2VicGFjazovL3dvcmthZHZlbnR1cmUtbWFwLXN0YXJ0ZXIta2l0Ly4vbm9kZV9tb2R1bGVzL0B3b3JrYWR2ZW50dXJlL3NjcmlwdGluZy1hcGktZXh0cmEvZGlzdC9GZWF0dXJlcy9zcGVjaWFsX3Byb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9ub2RlX21vZHVsZXMvQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYS9kaXN0L0ZlYXR1cmVzL3ZhcmlhYmxlX2FjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9ub2RlX21vZHVsZXMvQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYS9kaXN0L0xheWVyc0V4dHJhLmpzIiwid2VicGFjazovL3dvcmthZHZlbnR1cmUtbWFwLXN0YXJ0ZXIta2l0Ly4vbm9kZV9tb2R1bGVzL0B3b3JrYWR2ZW50dXJlL3NjcmlwdGluZy1hcGktZXh0cmEvZGlzdC9MYXllcnNGbGF0dGVuZXIuanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9ub2RlX21vZHVsZXMvQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYS9kaXN0L1Byb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9ub2RlX21vZHVsZXMvQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYS9kaXN0L1RlbXBsYXRlVmFsdWUuanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9ub2RlX21vZHVsZXMvQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYS9kaXN0L1ZhcmlhYmxlc0V4dHJhLmpzIiwid2VicGFjazovL3dvcmthZHZlbnR1cmUtbWFwLXN0YXJ0ZXIta2l0Ly4vbm9kZV9tb2R1bGVzL0B3b3JrYWR2ZW50dXJlL3NjcmlwdGluZy1hcGktZXh0cmEvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly93b3JrYWR2ZW50dXJlLW1hcC1zdGFydGVyLWtpdC8uL25vZGVfbW9kdWxlcy9Ad29ya2FkdmVudHVyZS9zY3JpcHRpbmctYXBpLWV4dHJhL2Rpc3QvaW5pdC5qcyIsIndlYnBhY2s6Ly93b3JrYWR2ZW50dXJlLW1hcC1zdGFydGVyLWtpdC8uL25vZGVfbW9kdWxlcy9tdXN0YWNoZS9tdXN0YWNoZS5tanMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dvcmthZHZlbnR1cmUtbWFwLXN0YXJ0ZXIta2l0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd29ya2FkdmVudHVyZS1tYXAtc3RhcnRlci1raXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93b3JrYWR2ZW50dXJlLW1hcC1zdGFydGVyLWtpdC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQTJDO0FBQ3BDO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1EQUFVO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSx5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJvRDtBQUNGO0FBQ1A7QUFDVztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtFQUFvQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FB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QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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RkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tIFwiLi4vUHJvcGVydGllc1wiO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRDb25maWd1cmF0aW9uKGFzc2V0c1VybCkge1xuICAgIGNvbnN0IG1hcCA9IGF3YWl0IFdBLnJvb20uZ2V0VGlsZWRNYXAoKTtcbiAgICBjb25zdCBjb25maWd1cmF0aW9uTGF5ZXIgPSBtYXAubGF5ZXJzLmZpbmQoKGxheWVyKSA9PiBsYXllci5uYW1lID09PSBcImNvbmZpZ3VyYXRpb25cIik7XG4gICAgaWYgKGNvbmZpZ3VyYXRpb25MYXllcikge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMoY29uZmlndXJhdGlvbkxheWVyLnByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCB0YWcgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcInRhZ1wiKTtcbiAgICAgICAgaWYgKCF0YWcgfHwgV0EucGxheWVyLnRhZ3MuaW5jbHVkZXModGFnKSkge1xuICAgICAgICAgICAgV0EudWkucmVnaXN0ZXJNZW51Q29tbWFuZChcIkNvbmZpZ3VyZSB0aGUgcm9vbVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGFzc2V0c1VybCA9IChfYSA9IGFzc2V0c1VybCAhPT0gbnVsbCAmJiBhc3NldHNVcmwgIT09IHZvaWQgMCA/IGFzc2V0c1VybCA6IHByb2Nlc3MuZW52LkFTU0VUU19VUkwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgV0EubmF2Lm9wZW5Db1dlYlNpdGUoYXNzZXRzVXJsICsgXCJjb25maWd1cmF0aW9uLmh0bWxcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmZpZ3VyYXRpb24uanMubWFwIiwiaW1wb3J0IHsgZ2V0QWxsVmFyaWFibGVzIH0gZnJvbSBcIi4uL1ZhcmlhYmxlc0V4dHJhXCI7XG5pbXBvcnQgeyBnZXRMYXllcnNNYXAgfSBmcm9tIFwiLi4vTGF5ZXJzRmxhdHRlbmVyXCI7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSBcIi4uL1Byb3BlcnRpZXNcIjtcbmltcG9ydCB7IGZpbmRMYXllcnNCb3VuZGFyaWVzIH0gZnJvbSBcIi4uL0xheWVyc0V4dHJhXCI7XG5sZXQgbGF5ZXJzTWFwO1xubGV0IHBsYXllclggPSAwO1xubGV0IHBsYXllclkgPSAwO1xuZnVuY3Rpb24gdXBkYXRlRG9vckxheWVycyh2YXJpYWJsZSkge1xuICAgIGlmIChXQS5zdGF0ZVt2YXJpYWJsZS5uYW1lXSkge1xuICAgICAgICBsZXQgbGF5ZXJzID0gdmFyaWFibGUucHJvcGVydGllcy5tdXN0R2V0U3RyaW5nKFwib3BlbkxheWVyXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycy5zcGxpdChcIlxcblwiKSkge1xuICAgICAgICAgICAgV0Eucm9vbS5zaG93TGF5ZXIobGF5ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGxheWVycyA9IHZhcmlhYmxlLnByb3BlcnRpZXMubXVzdEdldFN0cmluZyhcImNsb3NlTGF5ZXJcIik7XG4gICAgICAgIGZvciAoY29uc3QgbGF5ZXIgb2YgbGF5ZXJzLnNwbGl0KFwiXFxuXCIpKSB7XG4gICAgICAgICAgICBXQS5yb29tLmhpZGVMYXllcihsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBsYXllcnMgPSB2YXJpYWJsZS5wcm9wZXJ0aWVzLm11c3RHZXRTdHJpbmcoXCJvcGVuTGF5ZXJcIik7XG4gICAgICAgIGZvciAoY29uc3QgbGF5ZXIgb2YgbGF5ZXJzLnNwbGl0KFwiXFxuXCIpKSB7XG4gICAgICAgICAgICBXQS5yb29tLmhpZGVMYXllcihsYXllcik7XG4gICAgICAgIH1cbiAgICAgICAgbGF5ZXJzID0gdmFyaWFibGUucHJvcGVydGllcy5tdXN0R2V0U3RyaW5nKFwiY2xvc2VMYXllclwiKTtcbiAgICAgICAgZm9yIChjb25zdCBsYXllciBvZiBsYXllcnMuc3BsaXQoXCJcXG5cIikpIHtcbiAgICAgICAgICAgIFdBLnJvb20uc2hvd0xheWVyKGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHBsYXlPcGVuU291bmQodmFyaWFibGUpIHtcbiAgICBjb25zdCB1cmwgPSB2YXJpYWJsZS5wcm9wZXJ0aWVzLmdldFN0cmluZyhcIm9wZW5Tb3VuZFwiKTtcbiAgICBjb25zdCByYWRpdXMgPSB2YXJpYWJsZS5wcm9wZXJ0aWVzLmdldE51bWJlcihcInNvdW5kUmFkaXVzXCIpO1xuICAgIGxldCB2b2x1bWUgPSAxO1xuICAgIGlmIChyYWRpdXMpIHtcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBnZXREaXN0YW5jZSh2YXJpYWJsZS5wcm9wZXJ0aWVzLm11c3RHZXRTdHJpbmcoXCJvcGVuTGF5ZXJcIikuc3BsaXQoXCJcXG5cIikpO1xuICAgICAgICBpZiAoZGlzdGFuY2UgPiByYWRpdXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2b2x1bWUgPSAxIC0gZGlzdGFuY2UgLyByYWRpdXM7XG4gICAgfVxuICAgIGlmICh1cmwpIHtcbiAgICAgICAgV0Euc291bmQubG9hZFNvdW5kKHVybCkucGxheSh7XG4gICAgICAgICAgICB2b2x1bWUsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHBsYXlDbG9zZVNvdW5kKHZhcmlhYmxlKSB7XG4gICAgY29uc3QgdXJsID0gdmFyaWFibGUucHJvcGVydGllcy5nZXRTdHJpbmcoXCJjbG9zZVNvdW5kXCIpO1xuICAgIGNvbnN0IHJhZGl1cyA9IHZhcmlhYmxlLnByb3BlcnRpZXMuZ2V0TnVtYmVyKFwic291bmRSYWRpdXNcIik7XG4gICAgbGV0IHZvbHVtZSA9IDE7XG4gICAgaWYgKHJhZGl1cykge1xuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IGdldERpc3RhbmNlKHZhcmlhYmxlLnByb3BlcnRpZXMubXVzdEdldFN0cmluZyhcImNsb3NlTGF5ZXJcIikuc3BsaXQoXCJcXG5cIikpO1xuICAgICAgICBpZiAoZGlzdGFuY2UgPiByYWRpdXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2b2x1bWUgPSAxIC0gZGlzdGFuY2UgLyByYWRpdXM7XG4gICAgfVxuICAgIGlmICh1cmwpIHtcbiAgICAgICAgV0Euc291bmQubG9hZFNvdW5kKHVybCkucGxheSh7XG4gICAgICAgICAgICB2b2x1bWUsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFRpbGVMYXllcnMobGF5ZXJOYW1lcykge1xuICAgIHJldHVybiBsYXllck5hbWVzXG4gICAgICAgIC5tYXAoKGxheWVyTmFtZSkgPT4gbGF5ZXJzTWFwLmdldChsYXllck5hbWUpKVxuICAgICAgICAuZmlsdGVyKChsYXllcikgPT4gKGxheWVyID09PSBudWxsIHx8IGxheWVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBsYXllci50eXBlKSA9PT0gXCJ0aWxlbGF5ZXJcIik7XG59XG5mdW5jdGlvbiBnZXREaXN0YW5jZShsYXllck5hbWVzKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gZ2V0VGlsZUxheWVycyhsYXllck5hbWVzKTtcbiAgICBjb25zdCBib3VuZGFyaWVzID0gZmluZExheWVyc0JvdW5kYXJpZXMobGF5ZXJzKTtcbiAgICBjb25zdCB4TGF5ZXIgPSAoKGJvdW5kYXJpZXMucmlnaHQgLSBib3VuZGFyaWVzLmxlZnQpIC8gMiArIGJvdW5kYXJpZXMubGVmdCkgKiAzMjtcbiAgICBjb25zdCB5TGF5ZXIgPSAoKGJvdW5kYXJpZXMuYm90dG9tIC0gYm91bmRhcmllcy50b3ApIC8gMiArIGJvdW5kYXJpZXMudG9wKSAqIDMyO1xuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3cocGxheWVyWCAtIHhMYXllciwgMikgKyBNYXRoLnBvdyhwbGF5ZXJZIC0geUxheWVyLCAyKSk7XG59XG5mdW5jdGlvbiBpbml0RG9vcih2YXJpYWJsZSkge1xuICAgIFdBLnN0YXRlLm9uVmFyaWFibGVDaGFuZ2UodmFyaWFibGUubmFtZSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKFdBLnN0YXRlW3ZhcmlhYmxlLm5hbWVdKSB7XG4gICAgICAgICAgICBwbGF5T3BlblNvdW5kKHZhcmlhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBsYXlDbG9zZVNvdW5kKHZhcmlhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVEb29yTGF5ZXJzKHZhcmlhYmxlKTtcbiAgICB9KTtcbiAgICB1cGRhdGVEb29yTGF5ZXJzKHZhcmlhYmxlKTtcbn1cbmZ1bmN0aW9uIGluaXREb29yc3RlcChsYXllciwgZG9vclZhcmlhYmxlLCBwcm9wZXJ0aWVzLCBhc3NldHNVcmwpIHtcbiAgICBjb25zdCBuYW1lID0gbGF5ZXIubmFtZTtcbiAgICBsZXQgYWN0aW9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICBsZXQga2V5cGFkV2Vic2l0ZSA9IHVuZGVmaW5lZDtcbiAgICBsZXQgaW5ab25lID0gZmFsc2U7XG4gICAgY29uc3Qgem9uZU5hbWUgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcInpvbmVcIik7XG4gICAgaWYgKCF6b25lTmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJ6b25lXCIgcHJvcGVydHkgb24gZG9vcnN0ZXAgbGF5ZXIgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgICBjb25zdCB0YWcgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcInRhZ1wiKTtcbiAgICBsZXQgYWxsb3dlZCA9IHRydWU7XG4gICAgaWYgKHRhZyAmJiAhV0EucGxheWVyLnRhZ3MuaW5jbHVkZXModGFnKSkge1xuICAgICAgICBhbGxvd2VkID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGFjY2Vzc1Jlc3RyaWN0ZWQgPSAhIXRhZztcbiAgICBmdW5jdGlvbiBkaXNwbGF5Q2xvc2VEb29yTWVzc2FnZSgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoYWN0aW9uTWVzc2FnZSkge1xuICAgICAgICAgICAgYWN0aW9uTWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25NZXNzYWdlID0gV0EudWkuZGlzcGxheUFjdGlvbk1lc3NhZ2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogKF9hID0gcHJvcGVydGllcy5nZXRTdHJpbmcoXCJjbG9zZVRyaWdnZXJNZXNzYWdlXCIpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBcIlByZXNzIFNQQUNFIHRvIGNsb3NlIHRoZSBkb29yXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIFdBLnN0YXRlW2Rvb3JWYXJpYWJsZS5uYW1lXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRpc3BsYXlPcGVuRG9vck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkaXNwbGF5T3BlbkRvb3JNZXNzYWdlKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChhY3Rpb25NZXNzYWdlKSB7XG4gICAgICAgICAgICBhY3Rpb25NZXNzYWdlLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGFjdGlvbk1lc3NhZ2UgPSBXQS51aS5kaXNwbGF5QWN0aW9uTWVzc2FnZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiAoX2EgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcIm9wZW5UcmlnZ2VyTWVzc2FnZVwiKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogXCJQcmVzcyBTUEFDRSB0byBvcGVuIHRoZSBkb29yXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIFdBLnN0YXRlW2Rvb3JWYXJpYWJsZS5uYW1lXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGlzcGxheUNsb3NlRG9vck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvcGVuS2V5cGFkKG5hbWUpIHtcbiAgICAgICAgY29uc3QgYm91bmRhcmllcyA9IGZpbmRMYXllcnNCb3VuZGFyaWVzKGdldFRpbGVMYXllcnMoZG9vclZhcmlhYmxlLnByb3BlcnRpZXMubXVzdEdldFN0cmluZyhcImNsb3NlTGF5ZXJcIikuc3BsaXQoXCJcXG5cIikpKTtcbiAgICAgICAga2V5cGFkV2Vic2l0ZSA9IFdBLnJvb20ud2Vic2l0ZS5jcmVhdGUoe1xuICAgICAgICAgICAgbmFtZTogXCJkb29yS2V5cGFkXCIgKyBuYW1lLFxuICAgICAgICAgICAgdXJsOiBhc3NldHNVcmwgKyBcIi9rZXlwYWQuaHRtbCNcIiArIGVuY29kZVVSSUNvbXBvbmVudChuYW1lKSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogYm91bmRhcmllcy5yaWdodCAqIDMyLFxuICAgICAgICAgICAgICAgIHk6IGJvdW5kYXJpZXMudG9wICogMzIsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMyICogMyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyICogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbGxvd0FwaTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb3NlS2V5cGFkKCkge1xuICAgICAgICBpZiAoa2V5cGFkV2Vic2l0ZSkge1xuICAgICAgICAgICAgV0Eucm9vbS53ZWJzaXRlLmRlbGV0ZShrZXlwYWRXZWJzaXRlLm5hbWUpO1xuICAgICAgICAgICAga2V5cGFkV2Vic2l0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBXQS5yb29tLm9uRW50ZXJab25lKHpvbmVOYW1lLCAoKSA9PiB7XG4gICAgICAgIGluWm9uZSA9IHRydWU7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmdldEJvb2xlYW4oXCJhdXRvT3BlblwiKSAmJiBhbGxvd2VkKSB7XG4gICAgICAgICAgICBXQS5zdGF0ZVtkb29yVmFyaWFibGUubmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghV0Euc3RhdGVbZG9vclZhcmlhYmxlLm5hbWVdICYmXG4gICAgICAgICAgICAoKGFjY2Vzc1Jlc3RyaWN0ZWQgJiYgIWFsbG93ZWQpIHx8ICFhY2Nlc3NSZXN0cmljdGVkKSAmJlxuICAgICAgICAgICAgKHByb3BlcnRpZXMuZ2V0U3RyaW5nKFwiY29kZVwiKSB8fCBwcm9wZXJ0aWVzLmdldFN0cmluZyhcImNvZGVWYXJpYWJsZVwiKSkpIHtcbiAgICAgICAgICAgIG9wZW5LZXlwYWQobmFtZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFdBLnN0YXRlW2Rvb3JWYXJpYWJsZS5uYW1lXSkge1xuICAgICAgICAgICAgZGlzcGxheUNsb3NlRG9vck1lc3NhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlPcGVuRG9vck1lc3NhZ2UoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFdBLnJvb20ub25MZWF2ZVpvbmUoem9uZU5hbWUsICgpID0+IHtcbiAgICAgICAgaW5ab25lID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmdldEJvb2xlYW4oXCJhdXRvQ2xvc2VcIikpIHtcbiAgICAgICAgICAgIFdBLnN0YXRlW2Rvb3JWYXJpYWJsZS5uYW1lXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25NZXNzYWdlKSB7XG4gICAgICAgICAgICBhY3Rpb25NZXNzYWdlLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNsb3NlS2V5cGFkKCk7XG4gICAgfSk7XG4gICAgV0Euc3RhdGUub25WYXJpYWJsZUNoYW5nZShkb29yVmFyaWFibGUubmFtZSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKGluWm9uZSkge1xuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzLmdldEJvb2xlYW4oXCJhdXRvQ2xvc2VcIikgJiYgV0Euc3RhdGVbZG9vclZhcmlhYmxlLm5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheUNsb3NlRG9vck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXlwYWRXZWJzaXRlICYmIFdBLnN0YXRlW2Rvb3JWYXJpYWJsZS5uYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNsb3NlS2V5cGFkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMuZ2V0Qm9vbGVhbihcImF1dG9PcGVuXCIpICYmIFdBLnN0YXRlW2Rvb3JWYXJpYWJsZS5uYW1lXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5T3BlbkRvb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHBsYXlCZWxsU291bmQodmFyaWFibGUpIHtcbiAgICBjb25zdCB1cmwgPSB2YXJpYWJsZS5wcm9wZXJ0aWVzLm11c3RHZXRTdHJpbmcoXCJiZWxsU291bmRcIik7XG4gICAgY29uc3QgcmFkaXVzID0gdmFyaWFibGUucHJvcGVydGllcy5nZXROdW1iZXIoXCJzb3VuZFJhZGl1c1wiKTtcbiAgICBsZXQgdm9sdW1lID0gMTtcbiAgICBpZiAocmFkaXVzKSB7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHZhcmlhYmxlLnggLSBwbGF5ZXJYLCAyKSArIE1hdGgucG93KHZhcmlhYmxlLnkgLSBwbGF5ZXJZLCAyKSk7XG4gICAgICAgIGlmIChkaXN0YW5jZSA+IHJhZGl1cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZvbHVtZSA9IDEgLSBkaXN0YW5jZSAvIHJhZGl1cztcbiAgICB9XG4gICAgV0Euc291bmQubG9hZFNvdW5kKHVybCkucGxheSh7XG4gICAgICAgIHZvbHVtZSxcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGluaXRCZWxsKHZhcmlhYmxlKSB7XG4gICAgaWYgKFdBLnN0YXRlW3ZhcmlhYmxlLm5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgV0Euc3RhdGVbdmFyaWFibGUubmFtZV0gPSAwO1xuICAgIH1cbiAgICBXQS5zdGF0ZS5vblZhcmlhYmxlQ2hhbmdlKHZhcmlhYmxlLm5hbWUpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmIChXQS5zdGF0ZVt2YXJpYWJsZS5uYW1lXSkge1xuICAgICAgICAgICAgcGxheUJlbGxTb3VuZCh2YXJpYWJsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGluaXRCZWxsTGF5ZXIoYmVsbFZhcmlhYmxlLCBwcm9wZXJ0aWVzKSB7XG4gICAgbGV0IHBvcHVwID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHpvbmVOYW1lID0gcHJvcGVydGllcy5tdXN0R2V0U3RyaW5nKFwiem9uZVwiKTtcbiAgICBjb25zdCBiZWxsUG9wdXBOYW1lID0gcHJvcGVydGllcy5nZXRTdHJpbmcoXCJiZWxsUG9wdXBcIik7XG4gICAgV0Eucm9vbS5vbkVudGVyWm9uZSh6b25lTmFtZSwgKCkgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghYmVsbFBvcHVwTmFtZSkge1xuICAgICAgICAgICAgV0Euc3RhdGVbYmVsbFZhcmlhYmxlXSA9IFdBLnN0YXRlW2JlbGxWYXJpYWJsZV0gKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcG9wdXAgPSBXQS51aS5vcGVuUG9wdXAoYmVsbFBvcHVwTmFtZSwgXCJcIiwgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IChfYSA9IHByb3BlcnRpZXMuZ2V0U3RyaW5nKFwiYmVsbEJ1dHRvblRleHRcIikpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiUmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgV0Euc3RhdGVbYmVsbFZhcmlhYmxlXSA9IFdBLnN0YXRlW2JlbGxWYXJpYWJsZV0gKyAxO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFdBLnJvb20ub25MZWF2ZVpvbmUoem9uZU5hbWUsICgpID0+IHtcbiAgICAgICAgaWYgKHBvcHVwKSB7XG4gICAgICAgICAgICBwb3B1cC5jbG9zZSgpO1xuICAgICAgICAgICAgcG9wdXAgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0RG9vcnMoYXNzZXRzVXJsKSB7XG4gICAgdmFyIF9hO1xuICAgIGFzc2V0c1VybCA9IChfYSA9IGFzc2V0c1VybCAhPT0gbnVsbCAmJiBhc3NldHNVcmwgIT09IHZvaWQgMCA/IGFzc2V0c1VybCA6IHByb2Nlc3MuZW52LkFTU0VUU19VUkwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiXCI7XG4gICAgY29uc3QgdmFyaWFibGVzID0gYXdhaXQgZ2V0QWxsVmFyaWFibGVzKCk7XG4gICAgbGF5ZXJzTWFwID0gYXdhaXQgZ2V0TGF5ZXJzTWFwKCk7XG4gICAgZm9yIChjb25zdCB2YXJpYWJsZSBvZiB2YXJpYWJsZXMudmFsdWVzKCkpIHtcbiAgICAgICAgaWYgKHZhcmlhYmxlLnByb3BlcnRpZXMuZ2V0KFwiZG9vclwiKSkge1xuICAgICAgICAgICAgaW5pdERvb3IodmFyaWFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YXJpYWJsZS5wcm9wZXJ0aWVzLmdldChcImJlbGxcIikpIHtcbiAgICAgICAgICAgIGluaXRCZWxsKHZhcmlhYmxlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVyc01hcC52YWx1ZXMoKSkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMobGF5ZXIucHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IGRvb3JWYXJpYWJsZU5hbWUgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcImRvb3JWYXJpYWJsZVwiKTtcbiAgICAgICAgaWYgKGRvb3JWYXJpYWJsZU5hbWUgJiYgbGF5ZXIudHlwZSA9PT0gXCJ0aWxlbGF5ZXJcIikge1xuICAgICAgICAgICAgY29uc3QgZG9vclZhcmlhYmxlID0gdmFyaWFibGVzLmdldChkb29yVmFyaWFibGVOYW1lKTtcbiAgICAgICAgICAgIGlmIChkb29yVmFyaWFibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdmFyaWFibGUgXCInICtcbiAgICAgICAgICAgICAgICAgICAgZG9vclZhcmlhYmxlTmFtZSArXG4gICAgICAgICAgICAgICAgICAgICdcIiByZWZlcnJlZCBpbiB0aGUgXCJkb29yVmFyaWFibGVcIiBwcm9wZXJ0eSBvZiBsYXllciBcIicgK1xuICAgICAgICAgICAgICAgICAgICBsYXllci5uYW1lICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbml0RG9vcnN0ZXAobGF5ZXIsIGRvb3JWYXJpYWJsZSwgcHJvcGVydGllcywgYXNzZXRzVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiZWxsVmFyaWFibGUgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcImJlbGxWYXJpYWJsZVwiKTtcbiAgICAgICAgaWYgKGJlbGxWYXJpYWJsZSkge1xuICAgICAgICAgICAgaW5pdEJlbGxMYXllcihiZWxsVmFyaWFibGUsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFdBLnBsYXllci5vblBsYXllck1vdmUoKG1vdmVFdmVudCkgPT4ge1xuICAgICAgICBwbGF5ZXJYID0gbW92ZUV2ZW50Lng7XG4gICAgICAgIHBsYXllclkgPSBtb3ZlRXZlbnQueTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRvb3JzLmpzLm1hcCIsImltcG9ydCB7IGdldExheWVyc01hcCB9IGZyb20gXCIuLi9MYXllcnNGbGF0dGVuZXJcIjtcbmltcG9ydCB7IFRlbXBsYXRlVmFsdWUgfSBmcm9tIFwiLi4vVGVtcGxhdGVWYWx1ZVwiO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRQcm9wZXJ0aWVzVGVtcGxhdGVzKCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBsYXllcnMgPSBhd2FpdCBnZXRMYXllcnNNYXAoKTtcbiAgICBmb3IgKGNvbnN0IFtsYXllck5hbWUsIGxheWVyXSBvZiBsYXllcnMuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSAoX2EgPSBsYXllci5wcm9wZXJ0aWVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkudHlwZSA9PT0gXCJpbnRcIiB8fCBwcm9wZXJ0eS50eXBlID09PSBcImJvb2xcIiB8fCBwcm9wZXJ0eS50eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZVZhbHVlKHByb3BlcnR5LnZhbHVlLCBXQS5zdGF0ZSk7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUuaXNQdXJlU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGVtcGxhdGUuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgIHNldFByb3BlcnR5KGxheWVyTmFtZSwgcHJvcGVydHkubmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgdGVtcGxhdGUub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0UHJvcGVydHkobGF5ZXJOYW1lLCBwcm9wZXJ0eS5uYW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNldFByb3BlcnR5KGxheWVyTmFtZSwgcHJvcGVydHlOYW1lLCB2YWx1ZSkge1xuICAgIFdBLnJvb20uc2V0UHJvcGVydHkobGF5ZXJOYW1lLCBwcm9wZXJ0eU5hbWUsIHZhbHVlKTtcbiAgICBpZiAocHJvcGVydHlOYW1lID09PSBcInZpc2libGVcIikge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIFdBLnJvb20uc2hvd0xheWVyKGxheWVyTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXQS5yb29tLmhpZGVMYXllcihsYXllck5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJvcGVydGllc190ZW1wbGF0ZXMuanMubWFwIiwiaW1wb3J0IHsgZ2V0TGF5ZXJzTWFwIH0gZnJvbSBcIi4uL0xheWVyc0ZsYXR0ZW5lclwiO1xuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gXCIuLi9Qcm9wZXJ0aWVzXCI7XG5pbXBvcnQgeyBpbml0VmFyaWFibGVBY3Rpb25MYXllciB9IGZyb20gXCIuL3ZhcmlhYmxlX2FjdGlvbnNcIjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0U3BlY2lhbFByb3BlcnRpZXMoKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gYXdhaXQgZ2V0TGF5ZXJzTWFwKCk7XG4gICAgZm9yIChjb25zdCBsYXllciBvZiBsYXllcnMudmFsdWVzKCkpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKGxheWVyLnByb3BlcnRpZXMpO1xuICAgICAgICBpbml0VmFyaWFibGVBY3Rpb25MYXllcihwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGVjaWFsX3Byb3BlcnRpZXMuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGluaXRWYXJpYWJsZUFjdGlvbkxheWVyKHByb3BlcnRpZXMpIHtcbiAgICBjb25zdCB2YXJpYWJsZU5hbWUgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcImJpbmRWYXJpYWJsZVwiKTtcbiAgICBpZiAodmFyaWFibGVOYW1lKSB7XG4gICAgICAgIGNvbnN0IHpvbmUgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcInpvbmVcIik7XG4gICAgICAgIGlmICghem9uZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGxheWVyIHdpdGggYSBcImJpbmRWYXJpYWJsZVwiIHByb3BlcnR5IG11c3QgQUxTTyBoYXZlIGEgXCJ6b25lXCIgcHJvcGVydHkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW50ZXJWYWx1ZSA9IHByb3BlcnRpZXMuZ2V0KFwiZW50ZXJWYWx1ZVwiKTtcbiAgICAgICAgY29uc3QgbGVhdmVWYWx1ZSA9IHByb3BlcnRpZXMuZ2V0KFwibGVhdmVWYWx1ZVwiKTtcbiAgICAgICAgY29uc3QgdHJpZ2dlck1lc3NhZ2UgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcInRyaWdnZXJNZXNzYWdlXCIpO1xuICAgICAgICBjb25zdCB0YWcgPSBwcm9wZXJ0aWVzLmdldFN0cmluZyhcInRhZ1wiKTtcbiAgICAgICAgc2V0dXBWYXJpYWJsZUFjdGlvbkxheWVyKHZhcmlhYmxlTmFtZSwgem9uZSwgZW50ZXJWYWx1ZSwgbGVhdmVWYWx1ZSwgdHJpZ2dlck1lc3NhZ2UsIHRhZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0dXBWYXJpYWJsZUFjdGlvbkxheWVyKHZhcmlhYmxlTmFtZSwgem9uZSwgZW50ZXJWYWx1ZSwgbGVhdmVWYWx1ZSwgdHJpZ2dlck1lc3NhZ2UsIHRhZykge1xuICAgIGlmICh0YWcgJiYgIVdBLnBsYXllci50YWdzLmluY2x1ZGVzKHRhZykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZW50ZXJWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIFdBLnJvb20ub25FbnRlclpvbmUoem9uZSwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRyaWdnZXJNZXNzYWdlKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBXQS5zdGF0ZVt2YXJpYWJsZU5hbWVdID0gZW50ZXJWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChsZWF2ZVZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgV0Eucm9vbS5vbkxlYXZlWm9uZSh6b25lLCAoKSA9PiB7XG4gICAgICAgICAgICBXQS5zdGF0ZVt2YXJpYWJsZU5hbWVdID0gbGVhdmVWYWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmFyaWFibGVfYWN0aW9ucy5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gZmluZExheWVyQm91bmRhcmllcyhsYXllcikge1xuICAgIGxldCBsZWZ0ID0gSW5maW5pdHk7XG4gICAgbGV0IHRvcCA9IEluZmluaXR5O1xuICAgIGxldCBib3R0b20gPSAwO1xuICAgIGxldCByaWdodCA9IDA7XG4gICAgY29uc3QgZGF0YSA9IGxheWVyLmRhdGE7XG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHRpbGUgbGF5ZXIgZGF0YSBzdG9yZWQgYXMgc3RyaW5nIGluc3RlYWQgb2YgQ1NWXCIpO1xuICAgIH1cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxheWVyLmhlaWdodDsgaisrKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGF5ZXIud2lkdGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRhdGFbaSArIGogKiBsYXllci53aWR0aF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gTWF0aC5taW4obGVmdCwgaSk7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSBNYXRoLm1heChyaWdodCwgaSk7XG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5taW4odG9wLCBqKTtcbiAgICAgICAgICAgICAgICBib3R0b20gPSBNYXRoLm1heChib3R0b20sIGopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHRvcCxcbiAgICAgICAgbGVmdCxcbiAgICAgICAgcmlnaHQ6IHJpZ2h0ICsgMSxcbiAgICAgICAgYm90dG9tOiBib3R0b20gKyAxLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZExheWVyc0JvdW5kYXJpZXMobGF5ZXJzKSB7XG4gICAgbGV0IGxlZnQgPSBJbmZpbml0eTtcbiAgICBsZXQgdG9wID0gSW5maW5pdHk7XG4gICAgbGV0IGJvdHRvbSA9IDA7XG4gICAgbGV0IHJpZ2h0ID0gMDtcbiAgICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycykge1xuICAgICAgICBjb25zdCBib3VuZGFyaWVzID0gZmluZExheWVyQm91bmRhcmllcyhsYXllcik7XG4gICAgICAgIGlmIChib3VuZGFyaWVzLmxlZnQgPCBsZWZ0KSB7XG4gICAgICAgICAgICBsZWZ0ID0gYm91bmRhcmllcy5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChib3VuZGFyaWVzLnRvcCA8IHRvcCkge1xuICAgICAgICAgICAgdG9wID0gYm91bmRhcmllcy50b3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvdW5kYXJpZXMucmlnaHQgPiByaWdodCkge1xuICAgICAgICAgICAgcmlnaHQgPSBib3VuZGFyaWVzLnJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChib3VuZGFyaWVzLmJvdHRvbSA+IGJvdHRvbSkge1xuICAgICAgICAgICAgYm90dG9tID0gYm91bmRhcmllcy5ib3R0b207XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wLFxuICAgICAgICBsZWZ0LFxuICAgICAgICByaWdodCxcbiAgICAgICAgYm90dG9tLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1MYXllcnNFeHRyYS5qcy5tYXAiLCJsZXQgbGF5ZXJzTWFwUHJvbWlzZSA9IHVuZGVmaW5lZDtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMYXllcnNNYXAoKSB7XG4gICAgaWYgKGxheWVyc01hcFByb21pc2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsYXllcnNNYXBQcm9taXNlID0gZ2V0TGF5ZXJzTWFwV2l0aG91dENhY2hlKCk7XG4gICAgfVxuICAgIHJldHVybiBsYXllcnNNYXBQcm9taXNlO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF5ZXJzTWFwV2l0aG91dENhY2hlKCkge1xuICAgIHJldHVybiBmbGF0dGVuR3JvdXBMYXllcnNNYXAoYXdhaXQgV0Eucm9vbS5nZXRUaWxlZE1hcCgpKTtcbn1cbmZ1bmN0aW9uIGZsYXR0ZW5Hcm91cExheWVyc01hcChtYXApIHtcbiAgICBjb25zdCBmbGF0TGF5ZXJzID0gbmV3IE1hcCgpO1xuICAgIGZsYXR0ZW5Hcm91cExheWVycyhtYXAubGF5ZXJzLCBcIlwiLCBmbGF0TGF5ZXJzKTtcbiAgICByZXR1cm4gZmxhdExheWVycztcbn1cbmZ1bmN0aW9uIGZsYXR0ZW5Hcm91cExheWVycyhsYXllcnMsIHByZWZpeCwgZmxhdExheWVycykge1xuICAgIGZvciAoY29uc3QgbGF5ZXIgb2YgbGF5ZXJzKSB7XG4gICAgICAgIGlmIChsYXllci50eXBlID09PSBcImdyb3VwXCIpIHtcbiAgICAgICAgICAgIGZsYXR0ZW5Hcm91cExheWVycyhsYXllci5sYXllcnMsIHByZWZpeCArIGxheWVyLm5hbWUgKyBcIi9cIiwgZmxhdExheWVycyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsYXllci5uYW1lID0gcHJlZml4ICsgbGF5ZXIubmFtZTtcbiAgICAgICAgICAgIGZsYXRMYXllcnMuc2V0KGxheWVyLm5hbWUsIGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxheWVyc0ZsYXR0ZW5lci5qcy5tYXAiLCJleHBvcnQgY2xhc3MgUHJvcGVydGllcyB7XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcykge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzICE9PSBudWxsICYmIHByb3BlcnRpZXMgIT09IHZvaWQgMCA/IHByb3BlcnRpZXMgOiBbXTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5wcm9wZXJ0aWVzXG4gICAgICAgICAgICAuZmlsdGVyKChwcm9wZXJ0eSkgPT4gcHJvcGVydHkubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgIC5tYXAoKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS52YWx1ZSk7XG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBvbmx5IG9uZSBwcm9wZXJ0eSB0byBiZSBuYW1lZCBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlc1swXTtcbiAgICB9XG4gICAgZ2V0U3RyaW5nKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QnlUeXBlKG5hbWUsIFwic3RyaW5nXCIpO1xuICAgIH1cbiAgICBnZXROdW1iZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCeVR5cGUobmFtZSwgXCJudW1iZXJcIik7XG4gICAgfVxuICAgIGdldEJvb2xlYW4obmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCeVR5cGUobmFtZSwgXCJib29sZWFuXCIpO1xuICAgIH1cbiAgICBnZXRCeVR5cGUobmFtZSwgdHlwZSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHByb3BlcnR5IFwiJyArIG5hbWUgKyAnXCIgdG8gaGF2ZSB0eXBlIFwiJyArIHR5cGUgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIG11c3RHZXRTdHJpbmcobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tdXN0R2V0QnlUeXBlKG5hbWUsIFwic3RyaW5nXCIpO1xuICAgIH1cbiAgICBtdXN0R2V0TnVtYmVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVzdEdldEJ5VHlwZShuYW1lLCBcIm51bWJlclwiKTtcbiAgICB9XG4gICAgbXVzdEdldEJvb2xlYW4obmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tdXN0R2V0QnlUeXBlKG5hbWUsIFwiYm9vbGVhblwiKTtcbiAgICB9XG4gICAgbXVzdEdldEJ5VHlwZShuYW1lLCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXQobmFtZSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IFwiJyArIG5hbWUgKyAnXCIgaXMgbWlzc2luZycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IHR5cGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgcHJvcGVydHkgXCInICsgbmFtZSArICdcIiB0byBoYXZlIHR5cGUgXCInICsgdHlwZSArICdcIicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0VHlwZShuYW1lKSB7XG4gICAgICAgIGNvbnN0IHR5cGVzID0gdGhpcy5wcm9wZXJ0aWVzXG4gICAgICAgICAgICAuZmlsdGVyKChwcm9wZXJ0eSkgPT4gcHJvcGVydHkubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgIC5tYXAoKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS50eXBlKTtcbiAgICAgICAgaWYgKHR5cGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgb25seSBvbmUgcHJvcGVydHkgdG8gYmUgbmFtZWQgXCInICsgbmFtZSArICdcIicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVzWzBdO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVByb3BlcnRpZXMuanMubWFwIiwiaW1wb3J0IE11c3RhY2hlIGZyb20gXCJtdXN0YWNoZVwiO1xuZXhwb3J0IGNsYXNzIFRlbXBsYXRlVmFsdWUge1xuICAgIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBzdGF0ZSkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5hc3QgPSBNdXN0YWNoZS5wYXJzZSh0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gTXVzdGFjaGUucmVuZGVyKHRoaXMudGVtcGxhdGUsIHRoaXMuc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICBvbkNoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmFyaWFibGVOYW1lIG9mIHRoaXMuZ2V0VXNlZFZhcmlhYmxlcygpLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLnB1c2godGhpcy5zdGF0ZS5vblZhcmlhYmxlQ2hhbmdlKHZhcmlhYmxlTmFtZSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IE11c3RhY2hlLnJlbmRlcih0aGlzLnRlbXBsYXRlLCB0aGlzLnN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJzY3JpcHRpb24gb2Ygc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBpc1B1cmVTdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzdC5sZW5ndGggPT09IDAgfHwgKHRoaXMuYXN0Lmxlbmd0aCA9PT0gMSAmJiB0aGlzLmFzdFswXVswXSA9PT0gXCJ0ZXh0XCIpO1xuICAgIH1cbiAgICBnZXRVc2VkVmFyaWFibGVzKCkge1xuICAgICAgICBjb25zdCB2YXJpYWJsZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMucmVjdXJzaXZlR2V0VXNlZFZhcmlhYmxlcyh0aGlzLmFzdCwgdmFyaWFibGVzKTtcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlcztcbiAgICB9XG4gICAgcmVjdXJzaXZlR2V0VXNlZFZhcmlhYmxlcyhhc3QsIHZhcmlhYmxlcykge1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIGFzdCkge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRva2VuWzBdO1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHRva2VuWzFdO1xuICAgICAgICAgICAgY29uc3Qgc3ViQXN0ID0gdG9rZW5bNF07XG4gICAgICAgICAgICBpZiAoW1wibmFtZVwiLCBcIiZcIiwgXCIjXCIsIFwiXlwiXS5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgICAgICAgICAgIHZhcmlhYmxlcy5hZGQobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3ViQXN0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHN1YkFzdCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjdXJzaXZlR2V0VXNlZFZhcmlhYmxlcyhzdWJBc3QsIHZhcmlhYmxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1UZW1wbGF0ZVZhbHVlLmpzLm1hcCIsImltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tIFwiLi9Qcm9wZXJ0aWVzXCI7XG5leHBvcnQgY2xhc3MgVmFyaWFibGVEZXNjcmlwdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihvYmplY3QpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gb2JqZWN0Lm5hbWU7XG4gICAgICAgIHRoaXMueCA9IG9iamVjdC54O1xuICAgICAgICB0aGlzLnkgPSBvYmplY3QueTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IFByb3BlcnRpZXMob2JqZWN0LnByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBnZXQgaXNSZWFkYWJsZSgpIHtcbiAgICAgICAgY29uc3QgcmVhZGFibGVCeSA9IHRoaXMucHJvcGVydGllcy5nZXRTdHJpbmcoXCJyZWFkYWJsZUJ5XCIpO1xuICAgICAgICBpZiAoIXJlYWRhYmxlQnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBXQS5wbGF5ZXIudGFncy5pbmNsdWRlcyhyZWFkYWJsZUJ5KTtcbiAgICB9XG4gICAgZ2V0IGlzV3JpdGFibGUoKSB7XG4gICAgICAgIGNvbnN0IHdyaXRhYmxlQnkgPSB0aGlzLnByb3BlcnRpZXMuZ2V0U3RyaW5nKFwid3JpdGFibGVCeVwiKTtcbiAgICAgICAgaWYgKCF3cml0YWJsZUJ5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gV0EucGxheWVyLnRhZ3MuaW5jbHVkZXMod3JpdGFibGVCeSk7XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbFZhcmlhYmxlcygpIHtcbiAgICBjb25zdCBtYXAgPSBhd2FpdCBXQS5yb29tLmdldFRpbGVkTWFwKCk7XG4gICAgY29uc3QgdmFyaWFibGVzID0gbmV3IE1hcCgpO1xuICAgIGdldEFsbFZhcmlhYmxlc1JlY3Vyc2l2ZShtYXAubGF5ZXJzLCB2YXJpYWJsZXMpO1xuICAgIHJldHVybiB2YXJpYWJsZXM7XG59XG5mdW5jdGlvbiBnZXRBbGxWYXJpYWJsZXNSZWN1cnNpdmUobGF5ZXJzLCB2YXJpYWJsZXMpIHtcbiAgICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycykge1xuICAgICAgICBpZiAobGF5ZXIudHlwZSA9PT0gXCJvYmplY3Rncm91cFwiKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiBsYXllci5vYmplY3RzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC50eXBlID09PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzLnNldChvYmplY3QubmFtZSwgbmV3IFZhcmlhYmxlRGVzY3JpcHRvcihvYmplY3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGF5ZXIudHlwZSA9PT0gXCJncm91cFwiKSB7XG4gICAgICAgICAgICBnZXRBbGxWYXJpYWJsZXNSZWN1cnNpdmUobGF5ZXIubGF5ZXJzLCB2YXJpYWJsZXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VmFyaWFibGVzRXh0cmEuanMubWFwIiwiZXhwb3J0ICogZnJvbSBcIi4vVmFyaWFibGVzRXh0cmFcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1Byb3BlcnRpZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0xheWVyc0ZsYXR0ZW5lclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vTGF5ZXJzRXh0cmFcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0ZlYXR1cmVzL3Byb3BlcnRpZXNfdGVtcGxhdGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9GZWF0dXJlcy9kb29yc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vRmVhdHVyZXMvdmFyaWFibGVfYWN0aW9uc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vaW5pdFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiaW1wb3J0IHsgaW5pdERvb3JzIH0gZnJvbSBcIi4vRmVhdHVyZXMvZG9vcnNcIjtcbmltcG9ydCB7IGluaXRTcGVjaWFsUHJvcGVydGllcyB9IGZyb20gXCIuL0ZlYXR1cmVzL3NwZWNpYWxfcHJvcGVydGllc1wiO1xuaW1wb3J0IHsgaW5pdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi9GZWF0dXJlcy9jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBpbml0UHJvcGVydGllc1RlbXBsYXRlcyB9IGZyb20gXCIuL0ZlYXR1cmVzL3Byb3BlcnRpZXNfdGVtcGxhdGVzXCI7XG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwRXh0cmEoKSB7XG4gICAgcmV0dXJuIFdBLm9uSW5pdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBpbml0RG9vcnMoKS5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gICAgICAgIGluaXRTcGVjaWFsUHJvcGVydGllcygpLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAgICAgICAgaW5pdENvbmZpZ3VyYXRpb24oKS5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gICAgICAgIGluaXRQcm9wZXJ0aWVzVGVtcGxhdGVzKCkuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5pdC5qcy5tYXAiLCIvKiFcbiAqIG11c3RhY2hlLmpzIC0gTG9naWMtbGVzcyB7e211c3RhY2hlfX0gdGVtcGxhdGVzIHdpdGggSmF2YVNjcmlwdFxuICogaHR0cDovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qc1xuICovXG5cbnZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheVBvbHlmaWxsIChvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBNb3JlIGNvcnJlY3QgdHlwZW9mIHN0cmluZyBoYW5kbGluZyBhcnJheVxuICogd2hpY2ggbm9ybWFsbHkgcmV0dXJucyB0eXBlb2YgJ29iamVjdCdcbiAqL1xuZnVuY3Rpb24gdHlwZVN0ciAob2JqKSB7XG4gIHJldHVybiBpc0FycmF5KG9iaikgPyAnYXJyYXknIDogdHlwZW9mIG9iajtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bXFwtXFxbXFxde30oKSorPy4sXFxcXFxcXiR8I1xcc10vZywgJ1xcXFwkJicpO1xufVxuXG4vKipcbiAqIE51bGwgc2FmZSB3YXkgb2YgY2hlY2tpbmcgd2hldGhlciBvciBub3QgYW4gb2JqZWN0LFxuICogaW5jbHVkaW5nIGl0cyBwcm90b3R5cGUsIGhhcyBhIGdpdmVuIHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5IChvYmosIHByb3BOYW1lKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAocHJvcE5hbWUgaW4gb2JqKTtcbn1cblxuLyoqXG4gKiBTYWZlIHdheSBvZiBkZXRlY3Rpbmcgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIHRoaW5nIGlzIGEgcHJpbWl0aXZlIGFuZFxuICogd2hldGhlciBpdCBoYXMgdGhlIGdpdmVuIHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIHByaW1pdGl2ZUhhc093blByb3BlcnR5IChwcmltaXRpdmUsIHByb3BOYW1lKSB7XG4gIHJldHVybiAoXG4gICAgcHJpbWl0aXZlICE9IG51bGxcbiAgICAmJiB0eXBlb2YgcHJpbWl0aXZlICE9PSAnb2JqZWN0J1xuICAgICYmIHByaW1pdGl2ZS5oYXNPd25Qcm9wZXJ0eVxuICAgICYmIHByaW1pdGl2ZS5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSlcbiAgKTtcbn1cblxuLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9pc3N1ZXMuYXBhY2hlLm9yZy9qaXJhL2Jyb3dzZS9DT1VDSERCLTU3N1xuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8xODlcbnZhciByZWdFeHBUZXN0ID0gUmVnRXhwLnByb3RvdHlwZS50ZXN0O1xuZnVuY3Rpb24gdGVzdFJlZ0V4cCAocmUsIHN0cmluZykge1xuICByZXR1cm4gcmVnRXhwVGVzdC5jYWxsKHJlLCBzdHJpbmcpO1xufVxuXG52YXIgbm9uU3BhY2VSZSA9IC9cXFMvO1xuZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChzdHJpbmcpIHtcbiAgcmV0dXJuICF0ZXN0UmVnRXhwKG5vblNwYWNlUmUsIHN0cmluZyk7XG59XG5cbnZhciBlbnRpdHlNYXAgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmIzM5OycsXG4gICcvJzogJyYjeDJGOycsXG4gICdgJzogJyYjeDYwOycsXG4gICc9JzogJyYjeDNEOydcbn07XG5cbmZ1bmN0aW9uIGVzY2FwZUh0bWwgKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvWyY8PlwiJ2A9XFwvXS9nLCBmdW5jdGlvbiBmcm9tRW50aXR5TWFwIChzKSB7XG4gICAgcmV0dXJuIGVudGl0eU1hcFtzXTtcbiAgfSk7XG59XG5cbnZhciB3aGl0ZVJlID0gL1xccyovO1xudmFyIHNwYWNlUmUgPSAvXFxzKy87XG52YXIgZXF1YWxzUmUgPSAvXFxzKj0vO1xudmFyIGN1cmx5UmUgPSAvXFxzKlxcfS87XG52YXIgdGFnUmUgPSAvI3xcXF58XFwvfD58XFx7fCZ8PXwhLztcblxuLyoqXG4gKiBCcmVha3MgdXAgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgc3RyaW5nIGludG8gYSB0cmVlIG9mIHRva2Vucy4gSWYgdGhlIGB0YWdzYFxuICogYXJndW1lbnQgaXMgZ2l2ZW4gaGVyZSBpdCBtdXN0IGJlIGFuIGFycmF5IHdpdGggdHdvIHN0cmluZyB2YWx1ZXM6IHRoZVxuICogb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzIHVzZWQgaW4gdGhlIHRlbXBsYXRlIChlLmcuIFsgXCI8JVwiLCBcIiU+XCIgXSkuIE9mXG4gKiBjb3Vyc2UsIHRoZSBkZWZhdWx0IGlzIHRvIHVzZSBtdXN0YWNoZXMgKGkuZS4gbXVzdGFjaGUudGFncykuXG4gKlxuICogQSB0b2tlbiBpcyBhbiBhcnJheSB3aXRoIGF0IGxlYXN0IDQgZWxlbWVudHMuIFRoZSBmaXJzdCBlbGVtZW50IGlzIHRoZVxuICogbXVzdGFjaGUgc3ltYm9sIHRoYXQgd2FzIHVzZWQgaW5zaWRlIHRoZSB0YWcsIGUuZy4gXCIjXCIgb3IgXCImXCIuIElmIHRoZSB0YWdcbiAqIGRpZCBub3QgY29udGFpbiBhIHN5bWJvbCAoaS5lLiB7e215VmFsdWV9fSkgdGhpcyBlbGVtZW50IGlzIFwibmFtZVwiLiBGb3JcbiAqIGFsbCB0ZXh0IHRoYXQgYXBwZWFycyBvdXRzaWRlIGEgc3ltYm9sIHRoaXMgZWxlbWVudCBpcyBcInRleHRcIi5cbiAqXG4gKiBUaGUgc2Vjb25kIGVsZW1lbnQgb2YgYSB0b2tlbiBpcyBpdHMgXCJ2YWx1ZVwiLiBGb3IgbXVzdGFjaGUgdGFncyB0aGlzIGlzXG4gKiB3aGF0ZXZlciBlbHNlIHdhcyBpbnNpZGUgdGhlIHRhZyBiZXNpZGVzIHRoZSBvcGVuaW5nIHN5bWJvbC4gRm9yIHRleHQgdG9rZW5zXG4gKiB0aGlzIGlzIHRoZSB0ZXh0IGl0c2VsZi5cbiAqXG4gKiBUaGUgdGhpcmQgYW5kIGZvdXJ0aCBlbGVtZW50cyBvZiB0aGUgdG9rZW4gYXJlIHRoZSBzdGFydCBhbmQgZW5kIGluZGljZXMsXG4gKiByZXNwZWN0aXZlbHksIG9mIHRoZSB0b2tlbiBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUuXG4gKlxuICogVG9rZW5zIHRoYXQgYXJlIHRoZSByb290IG5vZGUgb2YgYSBzdWJ0cmVlIGNvbnRhaW4gdHdvIG1vcmUgZWxlbWVudHM6IDEpIGFuXG4gKiBhcnJheSBvZiB0b2tlbnMgaW4gdGhlIHN1YnRyZWUgYW5kIDIpIHRoZSBpbmRleCBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgYXRcbiAqIHdoaWNoIHRoZSBjbG9zaW5nIHRhZyBmb3IgdGhhdCBzZWN0aW9uIGJlZ2lucy5cbiAqXG4gKiBUb2tlbnMgZm9yIHBhcnRpYWxzIGFsc28gY29udGFpbiB0d28gbW9yZSBlbGVtZW50czogMSkgYSBzdHJpbmcgdmFsdWUgb2ZcbiAqIGluZGVuZGF0aW9uIHByaW9yIHRvIHRoYXQgdGFnIGFuZCAyKSB0aGUgaW5kZXggb2YgdGhhdCB0YWcgb24gdGhhdCBsaW5lIC1cbiAqIGVnIGEgdmFsdWUgb2YgMiBpbmRpY2F0ZXMgdGhlIHBhcnRpYWwgaXMgdGhlIHRoaXJkIHRhZyBvbiB0aGlzIGxpbmUuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUgKHRlbXBsYXRlLCB0YWdzKSB7XG4gIGlmICghdGVtcGxhdGUpXG4gICAgcmV0dXJuIFtdO1xuICB2YXIgbGluZUhhc05vblNwYWNlID0gZmFsc2U7XG4gIHZhciBzZWN0aW9ucyA9IFtdOyAgICAgLy8gU3RhY2sgdG8gaG9sZCBzZWN0aW9uIHRva2Vuc1xuICB2YXIgdG9rZW5zID0gW107ICAgICAgIC8vIEJ1ZmZlciB0byBob2xkIHRoZSB0b2tlbnNcbiAgdmFyIHNwYWNlcyA9IFtdOyAgICAgICAvLyBJbmRpY2VzIG9mIHdoaXRlc3BhY2UgdG9rZW5zIG9uIHRoZSBjdXJyZW50IGxpbmVcbiAgdmFyIGhhc1RhZyA9IGZhbHNlOyAgICAvLyBJcyB0aGVyZSBhIHt7dGFnfX0gb24gdGhlIGN1cnJlbnQgbGluZT9cbiAgdmFyIG5vblNwYWNlID0gZmFsc2U7ICAvLyBJcyB0aGVyZSBhIG5vbi1zcGFjZSBjaGFyIG9uIHRoZSBjdXJyZW50IGxpbmU/XG4gIHZhciBpbmRlbnRhdGlvbiA9ICcnOyAgLy8gVHJhY2tzIGluZGVudGF0aW9uIGZvciB0YWdzIHRoYXQgdXNlIGl0XG4gIHZhciB0YWdJbmRleCA9IDA7ICAgICAgLy8gU3RvcmVzIGEgY291bnQgb2YgbnVtYmVyIG9mIHRhZ3MgZW5jb3VudGVyZWQgb24gYSBsaW5lXG5cbiAgLy8gU3RyaXBzIGFsbCB3aGl0ZXNwYWNlIHRva2VucyBhcnJheSBmb3IgdGhlIGN1cnJlbnQgbGluZVxuICAvLyBpZiB0aGVyZSB3YXMgYSB7eyN0YWd9fSBvbiBpdCBhbmQgb3RoZXJ3aXNlIG9ubHkgc3BhY2UuXG4gIGZ1bmN0aW9uIHN0cmlwU3BhY2UgKCkge1xuICAgIGlmIChoYXNUYWcgJiYgIW5vblNwYWNlKSB7XG4gICAgICB3aGlsZSAoc3BhY2VzLmxlbmd0aClcbiAgICAgICAgZGVsZXRlIHRva2Vuc1tzcGFjZXMucG9wKCldO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcGFjZXMgPSBbXTtcbiAgICB9XG5cbiAgICBoYXNUYWcgPSBmYWxzZTtcbiAgICBub25TcGFjZSA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIG9wZW5pbmdUYWdSZSwgY2xvc2luZ1RhZ1JlLCBjbG9zaW5nQ3VybHlSZTtcbiAgZnVuY3Rpb24gY29tcGlsZVRhZ3MgKHRhZ3NUb0NvbXBpbGUpIHtcbiAgICBpZiAodHlwZW9mIHRhZ3NUb0NvbXBpbGUgPT09ICdzdHJpbmcnKVxuICAgICAgdGFnc1RvQ29tcGlsZSA9IHRhZ3NUb0NvbXBpbGUuc3BsaXQoc3BhY2VSZSwgMik7XG5cbiAgICBpZiAoIWlzQXJyYXkodGFnc1RvQ29tcGlsZSkgfHwgdGFnc1RvQ29tcGlsZS5sZW5ndGggIT09IDIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFnczogJyArIHRhZ3NUb0NvbXBpbGUpO1xuXG4gICAgb3BlbmluZ1RhZ1JlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAodGFnc1RvQ29tcGlsZVswXSkgKyAnXFxcXHMqJyk7XG4gICAgY2xvc2luZ1RhZ1JlID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZVJlZ0V4cCh0YWdzVG9Db21waWxlWzFdKSk7XG4gICAgY2xvc2luZ0N1cmx5UmUgPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlUmVnRXhwKCd9JyArIHRhZ3NUb0NvbXBpbGVbMV0pKTtcbiAgfVxuXG4gIGNvbXBpbGVUYWdzKHRhZ3MgfHwgbXVzdGFjaGUudGFncyk7XG5cbiAgdmFyIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcih0ZW1wbGF0ZSk7XG5cbiAgdmFyIHN0YXJ0LCB0eXBlLCB2YWx1ZSwgY2hyLCB0b2tlbiwgb3BlblNlY3Rpb247XG4gIHdoaWxlICghc2Nhbm5lci5lb3MoKSkge1xuICAgIHN0YXJ0ID0gc2Nhbm5lci5wb3M7XG5cbiAgICAvLyBNYXRjaCBhbnkgdGV4dCBiZXR3ZWVuIHRhZ3MuXG4gICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChvcGVuaW5nVGFnUmUpO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgdmFsdWVMZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCB2YWx1ZUxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNociA9IHZhbHVlLmNoYXJBdChpKTtcblxuICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGNocikpIHtcbiAgICAgICAgICBzcGFjZXMucHVzaCh0b2tlbnMubGVuZ3RoKTtcbiAgICAgICAgICBpbmRlbnRhdGlvbiArPSBjaHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgICAgIGxpbmVIYXNOb25TcGFjZSA9IHRydWU7XG4gICAgICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9rZW5zLnB1c2goWyAndGV4dCcsIGNociwgc3RhcnQsIHN0YXJ0ICsgMSBdKTtcbiAgICAgICAgc3RhcnQgKz0gMTtcblxuICAgICAgICAvLyBDaGVjayBmb3Igd2hpdGVzcGFjZSBvbiB0aGUgY3VycmVudCBsaW5lLlxuICAgICAgICBpZiAoY2hyID09PSAnXFxuJykge1xuICAgICAgICAgIHN0cmlwU3BhY2UoKTtcbiAgICAgICAgICBpbmRlbnRhdGlvbiA9ICcnO1xuICAgICAgICAgIHRhZ0luZGV4ID0gMDtcbiAgICAgICAgICBsaW5lSGFzTm9uU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1hdGNoIHRoZSBvcGVuaW5nIHRhZy5cbiAgICBpZiAoIXNjYW5uZXIuc2NhbihvcGVuaW5nVGFnUmUpKVxuICAgICAgYnJlYWs7XG5cbiAgICBoYXNUYWcgPSB0cnVlO1xuXG4gICAgLy8gR2V0IHRoZSB0YWcgdHlwZS5cbiAgICB0eXBlID0gc2Nhbm5lci5zY2FuKHRhZ1JlKSB8fCAnbmFtZSc7XG4gICAgc2Nhbm5lci5zY2FuKHdoaXRlUmUpO1xuXG4gICAgLy8gR2V0IHRoZSB0YWcgdmFsdWUuXG4gICAgaWYgKHR5cGUgPT09ICc9Jykge1xuICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChlcXVhbHNSZSk7XG4gICAgICBzY2FubmVyLnNjYW4oZXF1YWxzUmUpO1xuICAgICAgc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd7Jykge1xuICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nQ3VybHlSZSk7XG4gICAgICBzY2FubmVyLnNjYW4oY3VybHlSZSk7XG4gICAgICBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgdHlwZSA9ICcmJztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgIH1cblxuICAgIC8vIE1hdGNoIHRoZSBjbG9zaW5nIHRhZy5cbiAgICBpZiAoIXNjYW5uZXIuc2NhbihjbG9zaW5nVGFnUmUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCB0YWcgYXQgJyArIHNjYW5uZXIucG9zKTtcblxuICAgIGlmICh0eXBlID09ICc+Jykge1xuICAgICAgdG9rZW4gPSBbIHR5cGUsIHZhbHVlLCBzdGFydCwgc2Nhbm5lci5wb3MsIGluZGVudGF0aW9uLCB0YWdJbmRleCwgbGluZUhhc05vblNwYWNlIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRva2VuID0gWyB0eXBlLCB2YWx1ZSwgc3RhcnQsIHNjYW5uZXIucG9zIF07XG4gICAgfVxuICAgIHRhZ0luZGV4Kys7XG4gICAgdG9rZW5zLnB1c2godG9rZW4pO1xuXG4gICAgaWYgKHR5cGUgPT09ICcjJyB8fCB0eXBlID09PSAnXicpIHtcbiAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJy8nKSB7XG4gICAgICAvLyBDaGVjayBzZWN0aW9uIG5lc3RpbmcuXG4gICAgICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gICAgICBpZiAoIW9wZW5TZWN0aW9uKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vub3BlbmVkIHNlY3Rpb24gXCInICsgdmFsdWUgKyAnXCIgYXQgJyArIHN0YXJ0KTtcblxuICAgICAgaWYgKG9wZW5TZWN0aW9uWzFdICE9PSB2YWx1ZSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCBzZWN0aW9uIFwiJyArIG9wZW5TZWN0aW9uWzFdICsgJ1wiIGF0ICcgKyBzdGFydCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnbmFtZScgfHwgdHlwZSA9PT0gJ3snIHx8IHR5cGUgPT09ICcmJykge1xuICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJz0nKSB7XG4gICAgICAvLyBTZXQgdGhlIHRhZ3MgZm9yIHRoZSBuZXh0IHRpbWUgYXJvdW5kLlxuICAgICAgY29tcGlsZVRhZ3ModmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHN0cmlwU3BhY2UoKTtcblxuICAvLyBNYWtlIHN1cmUgdGhlcmUgYXJlIG5vIG9wZW4gc2VjdGlvbnMgd2hlbiB3ZSdyZSBkb25lLlxuICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gIGlmIChvcGVuU2VjdGlvbilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHNlY3Rpb24gXCInICsgb3BlblNlY3Rpb25bMV0gKyAnXCIgYXQgJyArIHNjYW5uZXIucG9zKTtcblxuICByZXR1cm4gbmVzdFRva2VucyhzcXVhc2hUb2tlbnModG9rZW5zKSk7XG59XG5cbi8qKlxuICogQ29tYmluZXMgdGhlIHZhbHVlcyBvZiBjb25zZWN1dGl2ZSB0ZXh0IHRva2VucyBpbiB0aGUgZ2l2ZW4gYHRva2Vuc2AgYXJyYXlcbiAqIHRvIGEgc2luZ2xlIHRva2VuLlxuICovXG5mdW5jdGlvbiBzcXVhc2hUb2tlbnMgKHRva2Vucykge1xuICB2YXIgc3F1YXNoZWRUb2tlbnMgPSBbXTtcblxuICB2YXIgdG9rZW4sIGxhc3RUb2tlbjtcbiAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBpZiAodG9rZW5bMF0gPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4gJiYgbGFzdFRva2VuWzBdID09PSAndGV4dCcpIHtcbiAgICAgICAgbGFzdFRva2VuWzFdICs9IHRva2VuWzFdO1xuICAgICAgICBsYXN0VG9rZW5bM10gPSB0b2tlblszXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNxdWFzaGVkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3F1YXNoZWRUb2tlbnM7XG59XG5cbi8qKlxuICogRm9ybXMgdGhlIGdpdmVuIGFycmF5IG9mIGB0b2tlbnNgIGludG8gYSBuZXN0ZWQgdHJlZSBzdHJ1Y3R1cmUgd2hlcmVcbiAqIHRva2VucyB0aGF0IHJlcHJlc2VudCBhIHNlY3Rpb24gaGF2ZSB0d28gYWRkaXRpb25hbCBpdGVtczogMSkgYW4gYXJyYXkgb2ZcbiAqIGFsbCB0b2tlbnMgdGhhdCBhcHBlYXIgaW4gdGhhdCBzZWN0aW9uIGFuZCAyKSB0aGUgaW5kZXggaW4gdGhlIG9yaWdpbmFsXG4gKiB0ZW1wbGF0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGVuZCBvZiB0aGF0IHNlY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG5lc3RUb2tlbnMgKHRva2Vucykge1xuICB2YXIgbmVzdGVkVG9rZW5zID0gW107XG4gIHZhciBjb2xsZWN0b3IgPSBuZXN0ZWRUb2tlbnM7XG4gIHZhciBzZWN0aW9ucyA9IFtdO1xuXG4gIHZhciB0b2tlbiwgc2VjdGlvbjtcbiAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgc3dpdGNoICh0b2tlblswXSkge1xuICAgICAgY2FzZSAnIyc6XG4gICAgICBjYXNlICdeJzpcbiAgICAgICAgY29sbGVjdG9yLnB1c2godG9rZW4pO1xuICAgICAgICBzZWN0aW9ucy5wdXNoKHRva2VuKTtcbiAgICAgICAgY29sbGVjdG9yID0gdG9rZW5bNF0gPSBbXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICcvJzpcbiAgICAgICAgc2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuICAgICAgICBzZWN0aW9uWzVdID0gdG9rZW5bMl07XG4gICAgICAgIGNvbGxlY3RvciA9IHNlY3Rpb25zLmxlbmd0aCA+IDAgPyBzZWN0aW9uc1tzZWN0aW9ucy5sZW5ndGggLSAxXVs0XSA6IG5lc3RlZFRva2VucztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb2xsZWN0b3IucHVzaCh0b2tlbik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5lc3RlZFRva2Vucztcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSBzdHJpbmcgc2Nhbm5lciB0aGF0IGlzIHVzZWQgYnkgdGhlIHRlbXBsYXRlIHBhcnNlciB0byBmaW5kXG4gKiB0b2tlbnMgaW4gdGVtcGxhdGUgc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gU2Nhbm5lciAoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICB0aGlzLnRhaWwgPSBzdHJpbmc7XG4gIHRoaXMucG9zID0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdGFpbCBpcyBlbXB0eSAoZW5kIG9mIHN0cmluZykuXG4gKi9cblNjYW5uZXIucHJvdG90eXBlLmVvcyA9IGZ1bmN0aW9uIGVvcyAoKSB7XG4gIHJldHVybiB0aGlzLnRhaWwgPT09ICcnO1xufTtcblxuLyoqXG4gKiBUcmllcyB0byBtYXRjaCB0aGUgZ2l2ZW4gcmVndWxhciBleHByZXNzaW9uIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICogUmV0dXJucyB0aGUgbWF0Y2hlZCB0ZXh0IGlmIGl0IGNhbiBtYXRjaCwgdGhlIGVtcHR5IHN0cmluZyBvdGhlcndpc2UuXG4gKi9cblNjYW5uZXIucHJvdG90eXBlLnNjYW4gPSBmdW5jdGlvbiBzY2FuIChyZSkge1xuICB2YXIgbWF0Y2ggPSB0aGlzLnRhaWwubWF0Y2gocmUpO1xuXG4gIGlmICghbWF0Y2ggfHwgbWF0Y2guaW5kZXggIT09IDApXG4gICAgcmV0dXJuICcnO1xuXG4gIHZhciBzdHJpbmcgPSBtYXRjaFswXTtcblxuICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKHN0cmluZy5sZW5ndGgpO1xuICB0aGlzLnBvcyArPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHJldHVybiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIFNraXBzIGFsbCB0ZXh0IHVudGlsIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gY2FuIGJlIG1hdGNoZWQuIFJldHVybnNcbiAqIHRoZSBza2lwcGVkIHN0cmluZywgd2hpY2ggaXMgdGhlIGVudGlyZSB0YWlsIGlmIG5vIG1hdGNoIGNhbiBiZSBtYWRlLlxuICovXG5TY2FubmVyLnByb3RvdHlwZS5zY2FuVW50aWwgPSBmdW5jdGlvbiBzY2FuVW50aWwgKHJlKSB7XG4gIHZhciBpbmRleCA9IHRoaXMudGFpbC5zZWFyY2gocmUpLCBtYXRjaDtcblxuICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgY2FzZSAtMTpcbiAgICAgIG1hdGNoID0gdGhpcy50YWlsO1xuICAgICAgdGhpcy50YWlsID0gJyc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDA6XG4gICAgICBtYXRjaCA9ICcnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG1hdGNoID0gdGhpcy50YWlsLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKGluZGV4KTtcbiAgfVxuXG4gIHRoaXMucG9zICs9IG1hdGNoLmxlbmd0aDtcblxuICByZXR1cm4gbWF0Y2g7XG59O1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSByZW5kZXJpbmcgY29udGV4dCBieSB3cmFwcGluZyBhIHZpZXcgb2JqZWN0IGFuZFxuICogbWFpbnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBjb250ZXh0LlxuICovXG5mdW5jdGlvbiBDb250ZXh0ICh2aWV3LCBwYXJlbnRDb250ZXh0KSB7XG4gIHRoaXMudmlldyA9IHZpZXc7XG4gIHRoaXMuY2FjaGUgPSB7ICcuJzogdGhpcy52aWV3IH07XG4gIHRoaXMucGFyZW50ID0gcGFyZW50Q29udGV4dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGNvbnRleHQgdXNpbmcgdGhlIGdpdmVuIHZpZXcgd2l0aCB0aGlzIGNvbnRleHRcbiAqIGFzIHRoZSBwYXJlbnQuXG4gKi9cbkNvbnRleHQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoICh2aWV3KSB7XG4gIHJldHVybiBuZXcgQ29udGV4dCh2aWV3LCB0aGlzKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIG5hbWUgaW4gdGhpcyBjb250ZXh0LCB0cmF2ZXJzaW5nXG4gKiB1cCB0aGUgY29udGV4dCBoaWVyYXJjaHkgaWYgdGhlIHZhbHVlIGlzIGFic2VudCBpbiB0aGlzIGNvbnRleHQncyB2aWV3LlxuICovXG5Db250ZXh0LnByb3RvdHlwZS5sb29rdXAgPSBmdW5jdGlvbiBsb29rdXAgKG5hbWUpIHtcbiAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcblxuICB2YXIgdmFsdWU7XG4gIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHZhbHVlID0gY2FjaGVbbmFtZV07XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBpbnRlcm1lZGlhdGVWYWx1ZSwgbmFtZXMsIGluZGV4LCBsb29rdXBIaXQgPSBmYWxzZTtcblxuICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICBpZiAobmFtZS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVZhbHVlID0gY29udGV4dC52aWV3O1xuICAgICAgICBuYW1lcyA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVc2luZyB0aGUgZG90IG5vdGlvbiBwYXRoIGluIGBuYW1lYCwgd2UgZGVzY2VuZCB0aHJvdWdoIHRoZVxuICAgICAgICAgKiBuZXN0ZWQgb2JqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogVG8gYmUgY2VydGFpbiB0aGF0IHRoZSBsb29rdXAgaGFzIGJlZW4gc3VjY2Vzc2Z1bCwgd2UgaGF2ZSB0b1xuICAgICAgICAgKiBjaGVjayBpZiB0aGUgbGFzdCBvYmplY3QgaW4gdGhlIHBhdGggYWN0dWFsbHkgaGFzIHRoZSBwcm9wZXJ0eVxuICAgICAgICAgKiB3ZSBhcmUgbG9va2luZyBmb3IuIFdlIHN0b3JlIHRoZSByZXN1bHQgaW4gYGxvb2t1cEhpdGAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgc3BlY2lhbGx5IG5lY2Vzc2FyeSBmb3Igd2hlbiB0aGUgdmFsdWUgaGFzIGJlZW4gc2V0IHRvXG4gICAgICAgICAqIGB1bmRlZmluZWRgIGFuZCB3ZSB3YW50IHRvIGF2b2lkIGxvb2tpbmcgdXAgcGFyZW50IGNvbnRleHRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJbiB0aGUgY2FzZSB3aGVyZSBkb3Qgbm90YXRpb24gaXMgdXNlZCwgd2UgY29uc2lkZXIgdGhlIGxvb2t1cFxuICAgICAgICAgKiB0byBiZSBzdWNjZXNzZnVsIGV2ZW4gaWYgdGhlIGxhc3QgXCJvYmplY3RcIiBpbiB0aGUgcGF0aCBpc1xuICAgICAgICAgKiBub3QgYWN0dWFsbHkgYW4gb2JqZWN0IGJ1dCBhIHByaW1pdGl2ZSAoZS5nLiwgYSBzdHJpbmcsIG9yIGFuXG4gICAgICAgICAqIGludGVnZXIpLCBiZWNhdXNlIGl0IGlzIHNvbWV0aW1lcyB1c2VmdWwgdG8gYWNjZXNzIGEgcHJvcGVydHlcbiAgICAgICAgICogb2YgYW4gYXV0b2JveGVkIHByaW1pdGl2ZSwgc3VjaCBhcyB0aGUgbGVuZ3RoIG9mIGEgc3RyaW5nLlxuICAgICAgICAgKiovXG4gICAgICAgIHdoaWxlIChpbnRlcm1lZGlhdGVWYWx1ZSAhPSBudWxsICYmIGluZGV4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGluZGV4ID09PSBuYW1lcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgbG9va3VwSGl0ID0gKFxuICAgICAgICAgICAgICBoYXNQcm9wZXJ0eShpbnRlcm1lZGlhdGVWYWx1ZSwgbmFtZXNbaW5kZXhdKVxuICAgICAgICAgICAgICB8fCBwcmltaXRpdmVIYXNPd25Qcm9wZXJ0eShpbnRlcm1lZGlhdGVWYWx1ZSwgbmFtZXNbaW5kZXhdKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgIGludGVybWVkaWF0ZVZhbHVlID0gaW50ZXJtZWRpYXRlVmFsdWVbbmFtZXNbaW5kZXgrK11dO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnRlcm1lZGlhdGVWYWx1ZSA9IGNvbnRleHQudmlld1tuYW1lXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT25seSBjaGVja2luZyBhZ2FpbnN0IGBoYXNQcm9wZXJ0eWAsIHdoaWNoIGFsd2F5cyByZXR1cm5zIGBmYWxzZWAgaWZcbiAgICAgICAgICogYGNvbnRleHQudmlld2AgaXMgbm90IGFuIG9iamVjdC4gRGVsaWJlcmF0ZWx5IG9taXR0aW5nIHRoZSBjaGVja1xuICAgICAgICAgKiBhZ2FpbnN0IGBwcmltaXRpdmVIYXNPd25Qcm9wZXJ0eWAgaWYgZG90IG5vdGF0aW9uIGlzIG5vdCB1c2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBDb25zaWRlciB0aGlzIGV4YW1wbGU6XG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKiBNdXN0YWNoZS5yZW5kZXIoXCJUaGUgbGVuZ3RoIG9mIGEgZm9vdGJhbGwgZmllbGQgaXMge3sjbGVuZ3RofX17e2xlbmd0aH19e3svbGVuZ3RofX0uXCIsIHtsZW5ndGg6IFwiMTAwIHlhcmRzXCJ9KVxuICAgICAgICAgKiBgYGBcbiAgICAgICAgICpcbiAgICAgICAgICogSWYgd2Ugd2VyZSB0byBjaGVjayBhbHNvIGFnYWluc3QgYHByaW1pdGl2ZUhhc093blByb3BlcnR5YCwgYXMgd2UgZG9cbiAgICAgICAgICogaW4gdGhlIGRvdCBub3RhdGlvbiBjYXNlLCB0aGVuIHJlbmRlciBjYWxsIHdvdWxkIHJldHVybjpcbiAgICAgICAgICpcbiAgICAgICAgICogXCJUaGUgbGVuZ3RoIG9mIGEgZm9vdGJhbGwgZmllbGQgaXMgOS5cIlxuICAgICAgICAgKlxuICAgICAgICAgKiByYXRoZXIgdGhhbiB0aGUgZXhwZWN0ZWQ6XG4gICAgICAgICAqXG4gICAgICAgICAqIFwiVGhlIGxlbmd0aCBvZiBhIGZvb3RiYWxsIGZpZWxkIGlzIDEwMCB5YXJkcy5cIlxuICAgICAgICAgKiovXG4gICAgICAgIGxvb2t1cEhpdCA9IGhhc1Byb3BlcnR5KGNvbnRleHQudmlldywgbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsb29rdXBIaXQpIHtcbiAgICAgICAgdmFsdWUgPSBpbnRlcm1lZGlhdGVWYWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQgPSBjb250ZXh0LnBhcmVudDtcbiAgICB9XG5cbiAgICBjYWNoZVtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKVxuICAgIHZhbHVlID0gdmFsdWUuY2FsbCh0aGlzLnZpZXcpO1xuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogQSBXcml0ZXIga25vd3MgaG93IHRvIHRha2UgYSBzdHJlYW0gb2YgdG9rZW5zIGFuZCByZW5kZXIgdGhlbSB0byBhXG4gKiBzdHJpbmcsIGdpdmVuIGEgY29udGV4dC4gSXQgYWxzbyBtYWludGFpbnMgYSBjYWNoZSBvZiB0ZW1wbGF0ZXMgdG9cbiAqIGF2b2lkIHRoZSBuZWVkIHRvIHBhcnNlIHRoZSBzYW1lIHRlbXBsYXRlIHR3aWNlLlxuICovXG5mdW5jdGlvbiBXcml0ZXIgKCkge1xuICB0aGlzLnRlbXBsYXRlQ2FjaGUgPSB7XG4gICAgX2NhY2hlOiB7fSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCAoa2V5LCB2YWx1ZSkge1xuICAgICAgdGhpcy5fY2FjaGVba2V5XSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2tleV07XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQ2xlYXJzIGFsbCBjYWNoZWQgdGVtcGxhdGVzIGluIHRoaXMgd3JpdGVyLlxuICovXG5Xcml0ZXIucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgaWYgKHR5cGVvZiB0aGlzLnRlbXBsYXRlQ2FjaGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy50ZW1wbGF0ZUNhY2hlLmNsZWFyKCk7XG4gIH1cbn07XG5cbi8qKlxuICogUGFyc2VzIGFuZCBjYWNoZXMgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBgdGFnc2Agb3JcbiAqIGBtdXN0YWNoZS50YWdzYCBpZiBgdGFnc2AgaXMgb21pdHRlZCwgIGFuZCByZXR1cm5zIHRoZSBhcnJheSBvZiB0b2tlbnNcbiAqIHRoYXQgaXMgZ2VuZXJhdGVkIGZyb20gdGhlIHBhcnNlLlxuICovXG5Xcml0ZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKHRlbXBsYXRlLCB0YWdzKSB7XG4gIHZhciBjYWNoZSA9IHRoaXMudGVtcGxhdGVDYWNoZTtcbiAgdmFyIGNhY2hlS2V5ID0gdGVtcGxhdGUgKyAnOicgKyAodGFncyB8fCBtdXN0YWNoZS50YWdzKS5qb2luKCc6Jyk7XG4gIHZhciBpc0NhY2hlRW5hYmxlZCA9IHR5cGVvZiBjYWNoZSAhPT0gJ3VuZGVmaW5lZCc7XG4gIHZhciB0b2tlbnMgPSBpc0NhY2hlRW5hYmxlZCA/IGNhY2hlLmdldChjYWNoZUtleSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKHRva2VucyA9PSB1bmRlZmluZWQpIHtcbiAgICB0b2tlbnMgPSBwYXJzZVRlbXBsYXRlKHRlbXBsYXRlLCB0YWdzKTtcbiAgICBpc0NhY2hlRW5hYmxlZCAmJiBjYWNoZS5zZXQoY2FjaGVLZXksIHRva2Vucyk7XG4gIH1cbiAgcmV0dXJuIHRva2Vucztcbn07XG5cbi8qKlxuICogSGlnaC1sZXZlbCBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIHJlbmRlciB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCB3aXRoXG4gKiB0aGUgZ2l2ZW4gYHZpZXdgLlxuICpcbiAqIFRoZSBvcHRpb25hbCBgcGFydGlhbHNgIGFyZ3VtZW50IG1heSBiZSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGVcbiAqIG5hbWVzIGFuZCB0ZW1wbGF0ZXMgb2YgcGFydGlhbHMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgdGVtcGxhdGUuIEl0IG1heVxuICogYWxzbyBiZSBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBsb2FkIHBhcnRpYWwgdGVtcGxhdGVzIG9uIHRoZSBmbHlcbiAqIHRoYXQgdGFrZXMgYSBzaW5nbGUgYXJndW1lbnQ6IHRoZSBuYW1lIG9mIHRoZSBwYXJ0aWFsLlxuICpcbiAqIElmIHRoZSBvcHRpb25hbCBgY29uZmlnYCBhcmd1bWVudCBpcyBnaXZlbiBoZXJlLCB0aGVuIGl0IHNob3VsZCBiZSBhblxuICogb2JqZWN0IHdpdGggYSBgdGFnc2AgYXR0cmlidXRlIG9yIGFuIGBlc2NhcGVgIGF0dHJpYnV0ZSBvciBib3RoLlxuICogSWYgYW4gYXJyYXkgaXMgcGFzc2VkLCB0aGVuIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgdGhlIHNhbWUgd2F5IGFzXG4gKiBhIGB0YWdzYCBhdHRyaWJ1dGUgb24gYSBgY29uZmlnYCBvYmplY3QuXG4gKlxuICogVGhlIGB0YWdzYCBhdHRyaWJ1dGUgb2YgYSBgY29uZmlnYCBvYmplY3QgbXVzdCBiZSBhbiBhcnJheSB3aXRoIHR3b1xuICogc3RyaW5nIHZhbHVlczogdGhlIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFncyB1c2VkIGluIHRoZSB0ZW1wbGF0ZSAoZS5nLlxuICogWyBcIjwlXCIsIFwiJT5cIiBdKS4gVGhlIGRlZmF1bHQgaXMgdG8gbXVzdGFjaGUudGFncy5cbiAqXG4gKiBUaGUgYGVzY2FwZWAgYXR0cmlidXRlIG9mIGEgYGNvbmZpZ2Agb2JqZWN0IG11c3QgYmUgYSBmdW5jdGlvbiB3aGljaFxuICogYWNjZXB0cyBhIHN0cmluZyBhcyBpbnB1dCBhbmQgb3V0cHV0cyBhIHNhZmVseSBlc2NhcGVkIHN0cmluZy5cbiAqIElmIGFuIGBlc2NhcGVgIGZ1bmN0aW9uIGlzIG5vdCBwcm92aWRlZCwgdGhlbiBhbiBIVE1MLXNhZmUgc3RyaW5nXG4gKiBlc2NhcGluZyBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBkZWZhdWx0LlxuICovXG5Xcml0ZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzLCBjb25maWcpIHtcbiAgdmFyIHRhZ3MgPSB0aGlzLmdldENvbmZpZ1RhZ3MoY29uZmlnKTtcbiAgdmFyIHRva2VucyA9IHRoaXMucGFyc2UodGVtcGxhdGUsIHRhZ3MpO1xuICB2YXIgY29udGV4dCA9ICh2aWV3IGluc3RhbmNlb2YgQ29udGV4dCkgPyB2aWV3IDogbmV3IENvbnRleHQodmlldywgdW5kZWZpbmVkKTtcbiAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIHRlbXBsYXRlLCBjb25maWcpO1xufTtcblxuLyoqXG4gKiBMb3ctbGV2ZWwgbWV0aG9kIHRoYXQgcmVuZGVycyB0aGUgZ2l2ZW4gYXJyYXkgb2YgYHRva2Vuc2AgdXNpbmdcbiAqIHRoZSBnaXZlbiBgY29udGV4dGAgYW5kIGBwYXJ0aWFsc2AuXG4gKlxuICogTm90ZTogVGhlIGBvcmlnaW5hbFRlbXBsYXRlYCBpcyBvbmx5IGV2ZXIgdXNlZCB0byBleHRyYWN0IHRoZSBwb3J0aW9uXG4gKiBvZiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgdGhhdCB3YXMgY29udGFpbmVkIGluIGEgaGlnaGVyLW9yZGVyIHNlY3Rpb24uXG4gKiBJZiB0aGUgdGVtcGxhdGUgZG9lc24ndCB1c2UgaGlnaGVyLW9yZGVyIHNlY3Rpb25zLCB0aGlzIGFyZ3VtZW50IG1heVxuICogYmUgb21pdHRlZC5cbiAqL1xuV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJUb2tlbnMgPSBmdW5jdGlvbiByZW5kZXJUb2tlbnMgKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUsIGNvbmZpZykge1xuICB2YXIgYnVmZmVyID0gJyc7XG5cbiAgdmFyIHRva2VuLCBzeW1ib2wsIHZhbHVlO1xuICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgc3ltYm9sID0gdG9rZW5bMF07XG5cbiAgICBpZiAoc3ltYm9sID09PSAnIycpIHZhbHVlID0gdGhpcy5yZW5kZXJTZWN0aW9uKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSwgY29uZmlnKTtcbiAgICBlbHNlIGlmIChzeW1ib2wgPT09ICdeJykgdmFsdWUgPSB0aGlzLnJlbmRlckludmVydGVkKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSwgY29uZmlnKTtcbiAgICBlbHNlIGlmIChzeW1ib2wgPT09ICc+JykgdmFsdWUgPSB0aGlzLnJlbmRlclBhcnRpYWwodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBjb25maWcpO1xuICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJyYnKSB2YWx1ZSA9IHRoaXMudW5lc2NhcGVkVmFsdWUodG9rZW4sIGNvbnRleHQpO1xuICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ25hbWUnKSB2YWx1ZSA9IHRoaXMuZXNjYXBlZFZhbHVlKHRva2VuLCBjb250ZXh0LCBjb25maWcpO1xuICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ3RleHQnKSB2YWx1ZSA9IHRoaXMucmF3VmFsdWUodG9rZW4pO1xuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICBidWZmZXIgKz0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gYnVmZmVyO1xufTtcblxuV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJTZWN0aW9uID0gZnVuY3Rpb24gcmVuZGVyU2VjdGlvbiAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlLCBjb25maWcpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYnVmZmVyID0gJyc7XG4gIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcblxuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcmVuZGVyIGFuIGFyYml0cmFyeSB0ZW1wbGF0ZVxuICAvLyBpbiB0aGUgY3VycmVudCBjb250ZXh0IGJ5IGhpZ2hlci1vcmRlciBzZWN0aW9ucy5cbiAgZnVuY3Rpb24gc3ViUmVuZGVyICh0ZW1wbGF0ZSkge1xuICAgIHJldHVybiBzZWxmLnJlbmRlcih0ZW1wbGF0ZSwgY29udGV4dCwgcGFydGlhbHMsIGNvbmZpZyk7XG4gIH1cblxuICBpZiAoIXZhbHVlKSByZXR1cm47XG5cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgZm9yICh2YXIgaiA9IDAsIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBqIDwgdmFsdWVMZW5ndGg7ICsraikge1xuICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LnB1c2godmFsdWVbal0pLCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSwgY29uZmlnKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlLCBjb25maWcpO1xuICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaWYgKHR5cGVvZiBvcmlnaW5hbFRlbXBsYXRlICE9PSAnc3RyaW5nJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBoaWdoZXItb3JkZXIgc2VjdGlvbnMgd2l0aG91dCB0aGUgb3JpZ2luYWwgdGVtcGxhdGUnKTtcblxuICAgIC8vIEV4dHJhY3QgdGhlIHBvcnRpb24gb2YgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRoYXQgdGhlIHNlY3Rpb24gY29udGFpbnMuXG4gICAgdmFsdWUgPSB2YWx1ZS5jYWxsKGNvbnRleHQudmlldywgb3JpZ2luYWxUZW1wbGF0ZS5zbGljZSh0b2tlblszXSwgdG9rZW5bNV0pLCBzdWJSZW5kZXIpO1xuXG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICBidWZmZXIgKz0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSwgY29uZmlnKTtcbiAgfVxuICByZXR1cm4gYnVmZmVyO1xufTtcblxuV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJJbnZlcnRlZCA9IGZ1bmN0aW9uIHJlbmRlckludmVydGVkICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUsIGNvbmZpZykge1xuICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG5cbiAgLy8gVXNlIEphdmFTY3JpcHQncyBkZWZpbml0aW9uIG9mIGZhbHN5LiBJbmNsdWRlIGVtcHR5IGFycmF5cy5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8xODZcbiAgaWYgKCF2YWx1ZSB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSlcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlLCBjb25maWcpO1xufTtcblxuV3JpdGVyLnByb3RvdHlwZS5pbmRlbnRQYXJ0aWFsID0gZnVuY3Rpb24gaW5kZW50UGFydGlhbCAocGFydGlhbCwgaW5kZW50YXRpb24sIGxpbmVIYXNOb25TcGFjZSkge1xuICB2YXIgZmlsdGVyZWRJbmRlbnRhdGlvbiA9IGluZGVudGF0aW9uLnJlcGxhY2UoL1teIFxcdF0vZywgJycpO1xuICB2YXIgcGFydGlhbEJ5TmwgPSBwYXJ0aWFsLnNwbGl0KCdcXG4nKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0aWFsQnlObC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwYXJ0aWFsQnlObFtpXS5sZW5ndGggJiYgKGkgPiAwIHx8ICFsaW5lSGFzTm9uU3BhY2UpKSB7XG4gICAgICBwYXJ0aWFsQnlObFtpXSA9IGZpbHRlcmVkSW5kZW50YXRpb24gKyBwYXJ0aWFsQnlObFtpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcnRpYWxCeU5sLmpvaW4oJ1xcbicpO1xufTtcblxuV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJQYXJ0aWFsID0gZnVuY3Rpb24gcmVuZGVyUGFydGlhbCAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBjb25maWcpIHtcbiAgaWYgKCFwYXJ0aWFscykgcmV0dXJuO1xuICB2YXIgdGFncyA9IHRoaXMuZ2V0Q29uZmlnVGFncyhjb25maWcpO1xuXG4gIHZhciB2YWx1ZSA9IGlzRnVuY3Rpb24ocGFydGlhbHMpID8gcGFydGlhbHModG9rZW5bMV0pIDogcGFydGlhbHNbdG9rZW5bMV1dO1xuICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgIHZhciBsaW5lSGFzTm9uU3BhY2UgPSB0b2tlbls2XTtcbiAgICB2YXIgdGFnSW5kZXggPSB0b2tlbls1XTtcbiAgICB2YXIgaW5kZW50YXRpb24gPSB0b2tlbls0XTtcbiAgICB2YXIgaW5kZW50ZWRWYWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0YWdJbmRleCA9PSAwICYmIGluZGVudGF0aW9uKSB7XG4gICAgICBpbmRlbnRlZFZhbHVlID0gdGhpcy5pbmRlbnRQYXJ0aWFsKHZhbHVlLCBpbmRlbnRhdGlvbiwgbGluZUhhc05vblNwYWNlKTtcbiAgICB9XG4gICAgdmFyIHRva2VucyA9IHRoaXMucGFyc2UoaW5kZW50ZWRWYWx1ZSwgdGFncyk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIGluZGVudGVkVmFsdWUsIGNvbmZpZyk7XG4gIH1cbn07XG5cbldyaXRlci5wcm90b3R5cGUudW5lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbiB1bmVzY2FwZWRWYWx1ZSAodG9rZW4sIGNvbnRleHQpIHtcbiAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG5Xcml0ZXIucHJvdG90eXBlLmVzY2FwZWRWYWx1ZSA9IGZ1bmN0aW9uIGVzY2FwZWRWYWx1ZSAodG9rZW4sIGNvbnRleHQsIGNvbmZpZykge1xuICB2YXIgZXNjYXBlID0gdGhpcy5nZXRDb25maWdFc2NhcGUoY29uZmlnKSB8fCBtdXN0YWNoZS5lc2NhcGU7XG4gIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGVzY2FwZSA9PT0gbXVzdGFjaGUuZXNjYXBlKSA/IFN0cmluZyh2YWx1ZSkgOiBlc2NhcGUodmFsdWUpO1xufTtcblxuV3JpdGVyLnByb3RvdHlwZS5yYXdWYWx1ZSA9IGZ1bmN0aW9uIHJhd1ZhbHVlICh0b2tlbikge1xuICByZXR1cm4gdG9rZW5bMV07XG59O1xuXG5Xcml0ZXIucHJvdG90eXBlLmdldENvbmZpZ1RhZ3MgPSBmdW5jdGlvbiBnZXRDb25maWdUYWdzIChjb25maWcpIHtcbiAgaWYgKGlzQXJyYXkoY29uZmlnKSkge1xuICAgIHJldHVybiBjb25maWc7XG4gIH1cbiAgZWxzZSBpZiAoY29uZmlnICYmIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy50YWdzO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbldyaXRlci5wcm90b3R5cGUuZ2V0Q29uZmlnRXNjYXBlID0gZnVuY3Rpb24gZ2V0Q29uZmlnRXNjYXBlIChjb25maWcpIHtcbiAgaWYgKGNvbmZpZyAmJiB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiAhaXNBcnJheShjb25maWcpKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5lc2NhcGU7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxudmFyIG11c3RhY2hlID0ge1xuICBuYW1lOiAnbXVzdGFjaGUuanMnLFxuICB2ZXJzaW9uOiAnNC4yLjAnLFxuICB0YWdzOiBbICd7eycsICd9fScgXSxcbiAgY2xlYXJDYWNoZTogdW5kZWZpbmVkLFxuICBlc2NhcGU6IHVuZGVmaW5lZCxcbiAgcGFyc2U6IHVuZGVmaW5lZCxcbiAgcmVuZGVyOiB1bmRlZmluZWQsXG4gIFNjYW5uZXI6IHVuZGVmaW5lZCxcbiAgQ29udGV4dDogdW5kZWZpbmVkLFxuICBXcml0ZXI6IHVuZGVmaW5lZCxcbiAgLyoqXG4gICAqIEFsbG93cyBhIHVzZXIgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgY2FjaGluZyBzdHJhdGVneSwgYnkgcHJvdmlkaW5nIGFuXG4gICAqIG9iamVjdCB3aXRoIHNldCwgZ2V0IGFuZCBjbGVhciBtZXRob2RzLiBUaGlzIGNhbiBhbHNvIGJlIHVzZWQgdG8gZGlzYWJsZVxuICAgKiB0aGUgY2FjaGUgYnkgc2V0dGluZyBpdCB0byB0aGUgbGl0ZXJhbCBgdW5kZWZpbmVkYC5cbiAgICovXG4gIHNldCB0ZW1wbGF0ZUNhY2hlIChjYWNoZSkge1xuICAgIGRlZmF1bHRXcml0ZXIudGVtcGxhdGVDYWNoZSA9IGNhY2hlO1xuICB9LFxuICAvKipcbiAgICogR2V0cyB0aGUgZGVmYXVsdCBvciBvdmVycmlkZGVuIGNhY2hpbmcgb2JqZWN0IGZyb20gdGhlIGRlZmF1bHQgd3JpdGVyLlxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlQ2FjaGUgKCkge1xuICAgIHJldHVybiBkZWZhdWx0V3JpdGVyLnRlbXBsYXRlQ2FjaGU7XG4gIH1cbn07XG5cbi8vIEFsbCBoaWdoLWxldmVsIG11c3RhY2hlLiogZnVuY3Rpb25zIHVzZSB0aGlzIHdyaXRlci5cbnZhciBkZWZhdWx0V3JpdGVyID0gbmV3IFdyaXRlcigpO1xuXG4vKipcbiAqIENsZWFycyBhbGwgY2FjaGVkIHRlbXBsYXRlcyBpbiB0aGUgZGVmYXVsdCB3cml0ZXIuXG4gKi9cbm11c3RhY2hlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgcmV0dXJuIGRlZmF1bHRXcml0ZXIuY2xlYXJDYWNoZSgpO1xufTtcblxuLyoqXG4gKiBQYXJzZXMgYW5kIGNhY2hlcyB0aGUgZ2l2ZW4gdGVtcGxhdGUgaW4gdGhlIGRlZmF1bHQgd3JpdGVyIGFuZCByZXR1cm5zIHRoZVxuICogYXJyYXkgb2YgdG9rZW5zIGl0IGNvbnRhaW5zLiBEb2luZyB0aGlzIGFoZWFkIG9mIHRpbWUgYXZvaWRzIHRoZSBuZWVkIHRvXG4gKiBwYXJzZSB0ZW1wbGF0ZXMgb24gdGhlIGZseSBhcyB0aGV5IGFyZSByZW5kZXJlZC5cbiAqL1xubXVzdGFjaGUucGFyc2UgPSBmdW5jdGlvbiBwYXJzZSAodGVtcGxhdGUsIHRhZ3MpIHtcbiAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucGFyc2UodGVtcGxhdGUsIHRhZ3MpO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBgdGVtcGxhdGVgIHdpdGggdGhlIGdpdmVuIGB2aWV3YCwgYHBhcnRpYWxzYCwgYW5kIGBjb25maWdgXG4gKiB1c2luZyB0aGUgZGVmYXVsdCB3cml0ZXIuXG4gKi9cbm11c3RhY2hlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzLCBjb25maWcpIHtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRlbXBsYXRlISBUZW1wbGF0ZSBzaG91bGQgYmUgYSBcInN0cmluZ1wiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dCBcIicgKyB0eXBlU3RyKHRlbXBsYXRlKSArICdcIiB3YXMgZ2l2ZW4gYXMgdGhlIGZpcnN0ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FyZ3VtZW50IGZvciBtdXN0YWNoZSNyZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKScpO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscywgY29uZmlnKTtcbn07XG5cbi8vIEV4cG9ydCB0aGUgZXNjYXBpbmcgZnVuY3Rpb24gc28gdGhhdCB0aGUgdXNlciBtYXkgb3ZlcnJpZGUgaXQuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzI0NFxubXVzdGFjaGUuZXNjYXBlID0gZXNjYXBlSHRtbDtcblxuLy8gRXhwb3J0IHRoZXNlIG1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28gZm9yIGFkdmFuY2VkIHVzYWdlLlxubXVzdGFjaGUuU2Nhbm5lciA9IFNjYW5uZXI7XG5tdXN0YWNoZS5Db250ZXh0ID0gQ29udGV4dDtcbm11c3RhY2hlLldyaXRlciA9IFdyaXRlcjtcblxuZXhwb3J0IGRlZmF1bHQgbXVzdGFjaGU7XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B3b3JrYWR2ZW50dXJlL2lmcmFtZS1hcGktdHlwaW5ncy9pZnJhbWVfYXBpLmQudHNcIiAvPlxuaW1wb3J0IHtib290c3RyYXBFeHRyYX0gZnJvbSAnQHdvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYSdcblxuY29uc29sZS5sb2coJ1NjcmlwdCBzdGFydGVkIHN1Y2Nlc3NmdWxseScpO1xuXG5hc3luYyBmdW5jdGlvbiBleHRlbmRlZEZlYXR1cmVzKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGJvb3RzdHJhcEV4dHJhKClcbiAgICAgICAgY29uc29sZS5sb2coJ1NjcmlwdGluZyBBUEkgRXh0cmEgbG9hZGVkIHN1Y2Nlc3NmdWxseScpO1xuXG4gICAgICAgIGNvbnN0IHdlYnNpdGUgPSBhd2FpdCBXQS5yb29tLndlYnNpdGUuZ2V0KCdjaW5lbWFTY3JlZW4nKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnd2Vic2l0ZScsd2Vic2l0ZSlcblxuICAgICAgICB3ZWJzaXRlLnggPSA4MDA7XG4gICAgICAgIHdlYnNpdGUueSA9IDEwMDA7XG4gICAgICAgIHdlYnNpdGUud2lkdGggPSAzMjA7XG4gICAgICAgIHdlYnNpdGUuaGVpZ2h0ID0gMjQwO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NjcmlwdGluZyBBUEkgRXh0cmEgRVJST1InLGVycm9yKTtcbiAgICB9XG59XG5cbmV4dGVuZGVkRmVhdHVyZXMoKTtcblxubGV0IGN1cnJlbnRab25lOiBzdHJpbmc7XG5sZXQgY3VycmVudFBvcHVwOiBhbnk7XG5cbmNvbnN0IGNvbmZpZyA9IFtcbiAgICB7XG4gICAgICAgIHpvbmU6ICduZWVkSGVscCcsXG4gICAgICAgIG1lc3NhZ2U6ICdEbyB5b3UgbmVlZCBzb21lIGd1aWRhbmNlPyBXZSBhcmUgaGFwcHkgdG8gaGVscCB5b3Ugb3V0LicsXG4gICAgICAgIGN0YTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnTWVldCB1cycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncHJpbWFyeScsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IFdBLm9wZW5UYWIoJ2h0dHBzOi8vcGxheS5zdGFnaW5nLndvcmthZHZlbnR1LnJlL0AvdGNtL3dvcmthZHZlbnR1cmUvd2EtdmlsbGFnZScpLFxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHpvbmU6ICdmb2xsb3dVcycsXG4gICAgICAgIG1lc3NhZ2U6ICdIZXkhIEhhdmUgeW91IGFscmVhZHkgc3RhcnRlZCBmb2xsb3dpbmcgdXM/JyxcbiAgICAgICAgY3RhOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdMaW5rZWRJbicsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncHJpbWFyeScsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IFdBLm9wZW5UYWIoJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9jb21wYW55L3dvcmthZHZlbnR1LXJlJyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnVHdpdHRlcicsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncHJpbWFyeScsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IFdBLm9wZW5UYWIoJ2h0dHBzOi8vdHdpdHRlci5jb20vd29ya2FkdmVudHVyZV8nKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG5dXG5cblxuV0Eub25FbnRlclpvbmUoJ25lZWRIZWxwJywgKCkgPT4ge1xuICAgIGN1cnJlbnRab25lID0gJ25lZWRIZWxwJ1xuICAgIG9wZW5Qb3B1cChjdXJyZW50Wm9uZSwgY3VycmVudFpvbmUgKyAnUG9wdXAnKVxufSk7XG5XQS5vbkVudGVyWm9uZSgnZm9sbG93VXMnLCAoKSA9PiB7XG4gICAgY3VycmVudFpvbmUgPSAnZm9sbG93VXMnXG4gICAgb3BlblBvcHVwKGN1cnJlbnRab25lLCBjdXJyZW50Wm9uZSArICdQb3B1cCcpXG59KTtcbldBLm9uTGVhdmVab25lKCduZWVkSGVscCcsIGNsb3NlUG9wdXApO1xuV0Eub25MZWF2ZVpvbmUoJ2ZvbGxvd1VzJywgY2xvc2VQb3B1cCk7XG5cblxuZnVuY3Rpb24gb3BlblBvcHVwKHpvbmVOYW1lOiBzdHJpbmcsIHBvcHVwTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgem9uZSA9IGNvbmZpZy5maW5kKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtLnpvbmUgPT0gem9uZU5hbWVcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIHpvbmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgb3RoZXJ3aXNlIHdlIGNhbid0IHVzZSB6b25lLmN0YSBvYmplY3RcbiAgICAgICAgY3VycmVudFBvcHVwID0gV0Eub3BlblBvcHVwKHBvcHVwTmFtZSwgem9uZS5tZXNzYWdlLCB6b25lLmN0YSlcbiAgICB9XG59XG5mdW5jdGlvbiBjbG9zZVBvcHVwKCl7XG4gICAgaWYgKHR5cGVvZiBjdXJyZW50UG9wdXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjdXJyZW50UG9wdXAuY2xvc2UoKTtcbiAgICAgICAgY3VycmVudFBvcHVwID0gdW5kZWZpbmVkO1xuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==