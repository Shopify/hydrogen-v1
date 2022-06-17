"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
exports.default = () => {
    const buildCacheId = crypto_1.default.randomBytes(8).toString('hex').slice(0, 8);
    return {
        name: 'vite-plugin-purge-query-cache',
        enforce: 'pre',
        transform(code) {
            return code.replace('__QUERY_CACHE_ID__', buildCacheId);
        },
    };
};
