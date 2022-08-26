"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrentPage = exports.setBrowserCtx = exports.setBrowser = exports.browserCtx = exports.browser = exports.currentPage = exports.isTracing = exports.CloseBrowser = exports.OpenBrowserCtx = void 0;
const playwright_1 = require("playwright");
const fs_1 = require("fs");
let isTracing = true;
exports.isTracing = isTracing;
let currentPage;
exports.currentPage = currentPage;
let browser;
exports.browser = browser;
let browserCtx;
exports.browserCtx = browserCtx;
function OpenBrowserCtx(selectedBrowser, launchOptions, options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setBrowser(selectedBrowser, launchOptions);
        yield setBrowserCtx(options);
        yield setPage();
    });
}
exports.OpenBrowserCtx = OpenBrowserCtx;
function CloseBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        yield browser.close();
    });
}
exports.CloseBrowser = CloseBrowser;
function setPage(newPage) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setCurrentPage(newPage);
        // override the defaults of the page attributes
        currentPage.setDefaultTimeout(30000);
        // handling JS alert(), comfirm(), prompt() to always accept
        currentPage.on('dialog', (dialog) => __awaiter(this, void 0, void 0, function* () {
            yield dialog.accept();
        }));
        currentPage.on('download', (download) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let path = (_a = yield download.path()) !== null && _a !== void 0 ? _a : "";
            (0, fs_1.stat)(path, (err, stats) => {
                if (stats.size <= 0) {
                    throw new Error('Downloaded file is empty!');
                }
                if ((err === null || err === void 0 ? void 0 : err.errno) != undefined) {
                    throw err;
                }
                //Utils.Log('Downloaded file size: ' + stats.size.toString());
            });
            yield download.delete();
        }));
    });
}
function setBrowser(selectecBrowser, launchOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const avaiableBrowsers = {
            'chromium': playwright_1.chromium,
            'firefox': playwright_1.firefox,
            'webkit': playwright_1.webkit
        };
        if (browser) {
            throw new Error(`Browser already opened`);
        }
        let selectedBrowser = avaiableBrowsers[selectecBrowser] ? avaiableBrowsers[selectecBrowser] : avaiableBrowsers['chromium'];
        exports.browser = browser = yield selectedBrowser.launch(launchOptions);
    });
}
exports.setBrowser = setBrowser;
function setBrowserCtx(browserCtxOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.browserCtx = browserCtx = yield browser.newContext(browserCtxOptions);
    });
}
exports.setBrowserCtx = setBrowserCtx;
function setCurrentPage(newCurrentPage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newCurrentPage == undefined) {
            exports.currentPage = currentPage = yield browserCtx.newPage();
        }
        else {
            exports.currentPage = currentPage = newCurrentPage;
        }
    });
}
exports.setCurrentPage = setCurrentPage;
