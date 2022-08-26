"use strict";

import { request, APIRequestContext, APIResponse } from "playwright";

export let apiRequestContext: APIRequestContext;
export let httpResponse: APIResponse;

export async function OpenApiRequestCtx(options?: object) {
    if (apiRequestContext) {
        throw new Error('API tester already opened');
    }

    apiRequestContext = await request.newContext(options);
}

export async function CloseApiRequestCtx() {
    apiRequestContext.dispose();
}

export async function setHttpResponse(response: APIResponse) {
    httpResponse = response;
}