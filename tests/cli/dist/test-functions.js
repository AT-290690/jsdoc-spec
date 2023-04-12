"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percent = void 0;
/**
 * @param percent number
 * @param value number
 * @returns number
 *
 * @example percent(50, 100)
 * // 52
 * @example percent(12, 100)
 * // 12
 * @example percent(20, 300)
 * // 300 * (20 / 100)
 */
var percent = function (percent, value) {
    return Math.round(value * (percent / 100));
};
exports.percent = percent;
