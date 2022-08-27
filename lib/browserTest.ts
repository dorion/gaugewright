"use strict";

import {
    chromium,
    firefox,
    webkit,
    Browser,
    Page,
    BrowserContext,
    BrowserContextOptions,
    LaunchOptions,
    BrowserType
} from "playwright";
import { stat } from "fs";
import { Log } from "./utils";

export let currentPage: Page;
export let browser: Browser;
export let browserCtx: BrowserContext;
export let CurrentTraceMode: TraceMode;

export enum TraceMode {
    None,
    Failed,
    All
}

export async function StartTracing(mode: TraceMode, options?: object) {
    CurrentTraceMode = mode;

    if (mode !== TraceMode.None) {
        await browserCtx.tracing.start(options);
    }
}

export async function StopTracing(options?: object) {
    await browserCtx.tracing.stop(options);
}

export async function OpenBrowserCtx(selectedBrowser?: string, launchOptions?: LaunchOptions, options?: BrowserContextOptions) {
    selectedBrowser = selectedBrowser ?? 'chrome';
    launchOptions = launchOptions ?? {};
    options = options ?? {};
    
    await setBrowser(selectedBrowser, launchOptions);
    await setBrowserCtx(options);
    await setPage();
}

export async function CloseBrowser() {
    await browser.close();
}

async function setPage(newPage?: Page) {
    await setCurrentPage(newPage);

    // override the defaults of the page attributes
    currentPage.setDefaultTimeout(30000);

    // handling JS alert(), comfirm(), prompt() to always accept
    currentPage.on('dialog', async (dialog) => {
        Log(dialog.message());

        await dialog.accept();
    });

    currentPage.on('download', async (download) => {
        let path = await download.path() ?? "";

        stat(
            path,
            (err, stats) => {
            if (stats.size <= 0) {
                throw new Error('Downloaded file is empty!');
            }
            
            if (err?.errno != undefined) {
                throw err;
            }

            Log('Downloaded file size: ' + stats.size.toString());
        });
        await download.delete();
    });
}

async function setBrowser(selectecBrowser: string, launchOptions: LaunchOptions) {
    const avaiableBrowsers: any = {
        'chromium': chromium,
        'firefox': firefox,
        'webkit': webkit
    };

    if (browser) {
        throw new Error(`Browser already opened`);
    }

    let selectedBrowser: BrowserType = avaiableBrowsers[selectecBrowser] ? avaiableBrowsers[selectecBrowser] : avaiableBrowsers['chromium'];
    browser = await selectedBrowser.launch(launchOptions);
}

async function setBrowserCtx(browserCtxOptions: BrowserContextOptions) {
    browserCtx = await browser.newContext(browserCtxOptions);
}

export async function setCurrentPage(newCurrentPage?: Page) {
    if (newCurrentPage == undefined) {
        currentPage = await browserCtx.newPage();
    }
    else {
        currentPage = newCurrentPage;
    }
}