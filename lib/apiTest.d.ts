import { APIRequestContext, APIResponse } from "playwright";
export declare let apiRequestContext: APIRequestContext;
export declare let httpResponse: APIResponse;
export declare function OpenApiRequestCtx(options?: object): Promise<void>;
export declare function CloseApiRequestCtx(): Promise<void>;
export declare function setHttpResponse(response: APIResponse): Promise<void>;
