"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const client_component_banned_hooks_1 = require("./client-component-banned-hooks");
const server_component_banned_hooks_1 = require("./server-component-banned-hooks");
const prefer_image_component_1 = require("./prefer-image-component");
const server_no_json_parse_1 = require("./server-no-json-parse");
const prefer_gql_1 = require("./prefer-gql");
exports.rules = {
    'client-component-banned-hooks': client_component_banned_hooks_1.clientComponentBannedHooks,
    'server-component-banned-hooks': server_component_banned_hooks_1.serverComponentBannedHooks,
    'prefer-image-component': prefer_image_component_1.preferImageComponent,
    'server-no-json-parse': server_no_json_parse_1.serverNoJsonParse,
    'prefer-gql': prefer_gql_1.preferGQL,
};
