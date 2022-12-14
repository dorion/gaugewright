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
exports.TakeScreenshot = exports.setPage = exports.CloseBrowser = exports.OpenBrowserCtx = exports.StopTracing = exports.StartTracing = exports.TraceMode = exports.CurrentTraceMode = exports.browserCtx = exports.browser = exports.currentPage = void 0;
const playwright_1 = require("playwright");
const fs_1 = require("fs");
const utils_1 = require("./utils");
var TraceMode;
(function (TraceMode) {
    TraceMode[TraceMode["None"] = 0] = "None";
    TraceMode[TraceMode["Failed"] = 1] = "Failed";
    TraceMode[TraceMode["All"] = 2] = "All";
})(TraceMode = exports.TraceMode || (exports.TraceMode = {}));
function StartTracing(mode, options) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.CurrentTraceMode = mode;
        if (mode !== TraceMode.None) {
            yield exports.browserCtx.tracing.start(options);
        }
    });
}
exports.StartTracing = StartTracing;
function StopTracing(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.browserCtx.tracing.stop(options);
    });
}
exports.StopTracing = StopTracing;
function OpenBrowserCtx(selectedBrowser, launchOptions, options) {
    return __awaiter(this, void 0, void 0, function* () {
        selectedBrowser = selectedBrowser !== null && selectedBrowser !== void 0 ? selectedBrowser : 'chrome';
        launchOptions = launchOptions !== null && launchOptions !== void 0 ? launchOptions : {};
        options = options !== null && options !== void 0 ? options : {};
        yield setBrowser(selectedBrowser, launchOptions);
        yield setBrowserCtx(options);
        yield setPage();
    });
}
exports.OpenBrowserCtx = OpenBrowserCtx;
function CloseBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.browser.close();
    });
}
exports.CloseBrowser = CloseBrowser;
function setPage(newPage) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setCurrentPage(newPage);
        // override the defaults of the page attributes
        exports.currentPage.setDefaultTimeout(30000);
        // handling JS alert(), comfirm(), prompt() to always accept
        exports.currentPage.on('dialog', (dialog) => __awaiter(this, void 0, void 0, function* () {
            yield dialog.accept();
            (0, utils_1.Log)('Dialog event: ' + dialog.message());
        }));
        exports.currentPage.on('download', (download) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let path = (_a = yield download.path()) !== null && _a !== void 0 ? _a : "";
            (0, fs_1.stat)(path, (err, stats) => {
                if (stats.size <= 0) {
                    throw new Error('Downloaded file is empty!');
                }
                if ((err === null || err === void 0 ? void 0 : err.errno) != undefined) {
                    throw err;
                }
                (0, utils_1.Log)('Downloaded file size: ' + stats.size.toString());
            });
            yield download.delete();
        }));
    });
}
exports.setPage = setPage;
function setBrowser(selectecBrowser, launchOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const avaiableBrowsers = {
            'chromium': playwright_1.chromium,
            'firefox': playwright_1.firefox,
            'webkit': playwright_1.webkit
        };
        if (exports.browser) {
            throw new Error(`Browser already opened`);
        }
        let selectedBrowser = avaiableBrowsers[selectecBrowser] ? avaiableBrowsers[selectecBrowser] : avaiableBrowsers['chromium'];
        exports.browser = yield selectedBrowser.launch(launchOptions);
    });
}
function setBrowserCtx(browserCtxOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.browserCtx = yield exports.browser.newContext(browserCtxOptions);
    });
}
function setCurrentPage(newCurrentPage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newCurrentPage == undefined) {
            exports.currentPage = yield exports.browserCtx.newPage();
        }
        else {
            exports.currentPage = newCurrentPage;
        }
    });
}
function TakeScreenshot(options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let pageScreenshotOptions = {
            path: options.path,
            fullPage: (_a = options.fullPage) !== null && _a !== void 0 ? _a : false,
            type: (_b = options.type) !== null && _b !== void 0 ? _b : 'png'
        };
        yield exports.currentPage.screenshot(pageScreenshotOptions);
    });
}
exports.TakeScreenshot = TakeScreenshot;
