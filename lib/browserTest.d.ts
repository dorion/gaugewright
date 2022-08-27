import { Browser, Page, BrowserContext, BrowserContextOptions, LaunchOptions } from "playwright";
export declare let currentPage: Page;
export declare let browser: Browser;
export declare let browserCtx: BrowserContext;
export declare let isTracing: boolean;
export declare function setTracing(tracing: boolean): void;
export declare function OpenBrowserCtx(selectedBrowser?: string, launchOptions?: LaunchOptions, options?: BrowserContextOptions): Promise<void>;
export declare function CloseBrowser(): Promise<void>;
export declare function setCurrentPage(newCurrentPage?: Page): Promise<void>;
