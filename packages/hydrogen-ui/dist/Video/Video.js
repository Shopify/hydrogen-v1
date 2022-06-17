var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { useImageUrl } from "../Image/image_size.js";
import { jsx } from "react/jsx-runtime";
function Video(props) {
  var _b;
  const _a = props, {
    data,
    options,
    id = data.id,
    playsInline = true,
    controls = true
  } = _a, passthroughProps = __objRest(_a, [
    "data",
    "options",
    "id",
    "playsInline",
    "controls"
  ]);
  const posterUrl = useImageUrl((_b = data.previewImage) == null ? void 0 : _b.url, options);
  if (!data.sources) {
    throw new Error(`<Video/> requires a 'data.sources' array`);
  }
  return /* @__PURE__ */ jsx("video", __spreadProps(__spreadValues({}, passthroughProps), {
    id,
    playsInline,
    controls,
    poster: posterUrl,
    "data-testid": "video",
    children: data.sources.map((source) => {
      if (!((source == null ? void 0 : source.url) && (source == null ? void 0 : source.mimeType))) {
        throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
      }
      return /* @__PURE__ */ jsx("source", {
        src: source.url,
        type: source.mimeType,
        "data-testid": "video-screen"
      }, source.url);
    })
  }));
}
export { Video };
//# sourceMappingURL=Video.js.map
