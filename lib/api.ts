"use strict";

import { request, APIRequestContext, APIResponse } from "playwright";

export let apiRequestContext: APIRequestContext;
export let httpResponse: APIResponse;

export async function OpenApiRequestContext(options?: object) {
    if (apiRequestContext) {
        throw new Error(`API tester already opened`);
    }

    apiRequestContext = await request.newContext(options);
}

export async function closeApiRequestContext() {
    apiRequestContext.dispose();
}

export async function setHttpResponse(response: APIResponse) {
    httpResponse = response;
}