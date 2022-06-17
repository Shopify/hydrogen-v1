"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
const core_1 = __importDefault(require("./core"));
const hydrogen_1 = __importDefault(require("./hydrogen"));
const recommended = (0, utilities_1.merge)(core_1.default, hydrogen_1.default);
exports.default = recommended;
