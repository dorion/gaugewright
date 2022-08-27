"use strict";

import { env } from "process";
import { DataStore, DataStoreFactory, Gauge } from "gauge-ts";
import * as randomstring from "randomstring";

export function ResolvePlaceholder(param: string): string {
    let pattern: RegExp = new RegExp(/(ENV:[^;]*;|CACHE:[^;]*;|RAND:[^;]*;|OR:[^;]*;)/g);
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

function getEnvironmentVariable(param: string) {
    let paramName = getPlaceholderId(param);
    let paramValue = env[paramName];

    Log("ENV: " + paramValue);

    return paramValue;
}

function getCacheItem(param: string) {
    let key = getPlaceholderId(param);

    let specStore: DataStore = DataStoreFactory.getSpecDataStore();
    param = specStore.get(key) as string;
    Log(key + ": " + param);

    return param;
}

function getPlaceholderId(placeHolder: string): string {
    return placeHolder.split(":")[1].slice(0, -1);
}

export function SetCacheItem(key: string, value: string) {
    let specStore: DataStore = DataStoreFactory.getSpecDataStore();
    specStore.put(key, value);
}

function randomize(placeHolder: string): string {
    placeHolder = placeHolder.slice(0, -1);
    
    let charSet = placeHolder.split(":")[1];    
    let length = parseInt(placeHolder.split(":")[2]);

    let generatedString = setPrefix(placeHolder);
    
    generatedString += randomstring.generate({
        charset: charSet,
        length: length,
    });

    Log("Random: " + generatedString);

    return generatedString;
}

function setPrefix(placeholder: string): string {
    let prefix = '';
    
    if (placeholder.split(":")[3] == 'PREFIX') {
        prefix = placeholder.split(":")[4];
    }

    return prefix;
}

export function SetItemInObjectRepository(key: string, value: string) {
    let suiteStore: DataStore = DataStoreFactory.getSuiteDataStore();
    suiteStore.put(key, value);
}

function getItemFromObjectRepository(match: string): any {
    let objectName = getPlaceholderId(match)
    let suiteStore: DataStore = DataStoreFactory.getSuiteDataStore();

    Log('OR: ' + objectName);

    return suiteStore.get(objectName);
}

export function Log(msg: string) {
    Gauge.writeMessage(msg);

    console.log(msg);
}

export function SelectorCorrection(param: string, visible: string = '>> visible=true') {
    if (
        !param.startsWith('//')
        && !param.startsWith(".")
        && !param.startsWith("#")
        && !param.startsWith("css=")
        && !param.startsWith("xpath=")
        && !param.startsWith("text=")
    ) {
        param = 'text=' + param
    }

    return `${param} ${visible}`;
}
