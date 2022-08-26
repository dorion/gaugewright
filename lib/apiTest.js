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
exports.setHttpResponse = exports.CloseApiRequestCtx = exports.OpenApiRequestCtx = exports.httpResponse = exports.apiRequestContext = void 0;
const playwright_1 = require("playwright");
function OpenApiRequestCtx(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.apiRequestContext) {
            throw new Error('API tester already opened');
        }
        exports.apiRequestContext = yield playwright_1.request.newContext(options);
    });
}
exports.OpenApiRequestCtx = OpenApiRequestCtx;
function CloseApiRequestCtx() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.apiRequestContext.dispose();
    });
}
exports.CloseApiRequestCtx = CloseApiRequestCtx;
function setHttpResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.httpResponse = response;
    });
}
exports.setHttpResponse = setHttpResponse;
