import { Browser, Page, BrowserContext, BrowserContextOptions, LaunchOptions } from "playwright";
export declare let currentPage: Page;
export declare let browser: Browser;
export declare let browserCtx: BrowserContext;
export declare let CurrentTraceMode: TraceMode;
export declare enum TraceMode {
    None = 0,
    Failed = 1,
    All = 2
}
export declare function StartTracing(mode: TraceMode, options?: object): Promise<void>;
export declare function StopTracing(options?: object): Promise<void>;
export declare function OpenBrowserCtx(selectedBrowser?: string, launchOptions?: LaunchOptions, options?: BrowserContextOptions): Promise<void>;
export declare function CloseBrowser(): Promise<void>;
export declare function setPage(newPage?: Page): Promise<void>;
