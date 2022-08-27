"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorCorrection = exports.Log = exports.SetItemInObjectRepository = exports.SetCacheItem = exports.ResolvePlaceholder = void 0;
const process_1 = require("process");
const gauge_ts_1 = require("gauge-ts");
const randomstring = __importStar(require("randomstring"));
function ResolvePlaceholder(param) {
    let pattern = new RegExp(/(ENV:[^;]*;|CACHE:[^;]*;|RAND:[^;]*;|OR:[^;]*;)/g);
    return param.replace(pattern, (match) => {
        if (match.startsWith("ENV:")) {
            return getEnvironmentVariable(match);
        }
        else if (match.startsWith("CACHE:")) {
            return getCacheItem(match);
        }
        else if (match.startsWith("RAND:")) {
            return randomize(match);
        }
        else if (match.startsWith("OR:")) {
            return getItemFromObjectRepository(match);
        }
    });
}
exports.ResolvePlaceholder = ResolvePlaceholder;
function getEnvironmentVariable(param) {
    let paramName = getPlaceholderId(param);
    let paramValue = process_1.env[paramName];
    Log("ENV: " + paramValue);
    return paramValue;
}
function getCacheItem(param) {
    let key = getPlaceholderId(param);
    let specStore = gauge_ts_1.DataStoreFactory.getSpecDataStore();
    param = specStore.get(key);
    Log(key + ": " + param);
    return param;
}
function getPlaceholderId(placeHolder) {
    return placeHolder.split(":")[1].slice(0, -1);
}
function SetCacheItem(key, value) {
    let specStore = gauge_ts_1.DataStoreFactory.getSpecDataStore();
    specStore.put(key, value);
}
exports.SetCacheItem = SetCacheItem;
function randomize(placeHolder) {
    let charSet = getPlaceholderId(placeHolder);
    let length = parseInt(placeHolder.split(":")[2]);
    let generatedString = setPrefix(placeHolder);
    generatedString += randomstring.generate({
        charset: charSet,
        length: length,
    });
    Log("Generated random string: " + generatedString);
    return generatedString;
}
function setPrefix(placeholder) {
    let prefixedText = '';
    if (placeholder.split(":")[3] == 'PREFIX') {
        prefixedText = placeholder.split(":")[4];
    }
    return prefixedText;
}
function SetItemInObjectRepository(key, value) {
    let suiteStore = gauge_ts_1.DataStoreFactory.getSuiteDataStore();
    suiteStore.put(key, value);
}
exports.SetItemInObjectRepository = SetItemInObjectRepository;
function getItemFromObjectRepository(match) {
    let objectName = getPlaceholderId(match);
    let suiteStore = gauge_ts_1.DataStoreFactory.getSuiteDataStore();
    Log('OR: ' + objectName);
    return suiteStore.get(objectName);
}
function Log(msg) {
    gauge_ts_1.Gauge.writeMessage(msg);
    console.log(msg);
}
exports.Log = Log;
function SelectorCorrection(param, visible = '>> visible=true') {
    if (!param.startsWith('//')
        && !param.startsWith(".")
        && !param.startsWith("#")
        && !param.startsWith("css=")
        && !param.startsWith("xpath=")
        && !param.startsWith("text=")) {
        param = 'text=' + param;
    }
    return `${param} ${visible}`;
}
exports.SelectorCorrection = SelectorCorrection;
