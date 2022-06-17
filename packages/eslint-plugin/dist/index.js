"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.rules = void 0;
const recommended_1 = __importDefault(require("./configs/recommended"));
const hydrogen_1 = __importDefault(require("./configs/hydrogen"));
const typescript_1 = __importDefault(require("./configs/typescript"));
var rules_1 = require("./rules");
Object.defineProperty(exports, "rules", { enumerable: true, get: function () { return rules_1.rules; } });
exports.configs = {
    recommended: recommended_1.default,
    hydrogen: hydrogen_1.default,
    typescript: typescript_1.default,
};
