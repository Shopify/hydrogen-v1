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
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
function ExternalVideo(props) {
  const _a = props, {
    data,
    options,
    id = data.id,
    frameBorder = "0",
    allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen = true
  } = _a, passthroughProps = __objRest(_a, [
    "data",
    "options",
    "id",
    "frameBorder",
    "allow",
    "allowFullScreen"
  ]);
  if (!data.embedUrl) {
    throw new Error(`<ExternalVideo/> requires the 'embedUrl' property`);
  }
  const url = useEmbeddedVideoUrl(data.embedUrl, options);
  return /* @__PURE__ */ jsx("iframe", __spreadProps(__spreadValues({}, passthroughProps), {
    id: id ?? data.embedUrl,
    frameBorder,
    allow,
    allowFullScreen,
    src: url,
    "data-testid": "video-iframe"
  }));
}
function useEmbeddedVideoUrl(url, parameters) {
  return useMemo(() => {
    if (!parameters) {
      return url;
    }
    return addParametersToEmbeddedVideoUrl(url, parameters);
  }, [url, parameters]);
}
function addParametersToEmbeddedVideoUrl(url, parameters) {
  if (parameters == null) {
    return url;
  }
  const params = Object.keys(parameters).reduce((accumulator, param) => {
    const value = parameters[param];
    if (value == null) {
      return accumulator;
    }
    return accumulator + `&${param}=${value}`;
  }, "");
  return `${url}?${params}`;
}
export { ExternalVideo, addParametersToEmbeddedVideoUrl, useEmbeddedVideoUrl };
//# sourceMappingURL=ExternalVideo.js.map
