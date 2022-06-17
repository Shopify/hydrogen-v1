import * as React from "react";
const PRODUCTION_CDN_HOSTNAMES = [
  "cdn.shopify.com",
  "cdn.shopifycdn.net",
  "shopify-assets.shopifycdn.com",
  "shopify-assets.shopifycdn.net"
];
const LOCAL_CDN_HOSTNAMES = ["spin.dev"];
function addImageSizeParametersToUrl(url, { width, height, crop, scale, format }) {
  const newUrl = new URL(url);
  const sizePath = width || height ? `_${width ?? ""}x${height ?? ""}` : "";
  const cropPath = crop ? `_crop_${crop}` : "";
  const scalePath = scale ? `@${scale}x` : "";
  const progressive = format === "pjpg" ? `.progressive` : "";
  const asJPG = format === "jpg" ? `.jpg` : "";
  const fileDelimiterIndex = newUrl.pathname.lastIndexOf(".");
  const fileName = newUrl.pathname.substr(0, fileDelimiterIndex);
  const fileType = newUrl.pathname.substr(fileDelimiterIndex);
  newUrl.pathname = `${fileName}${sizePath}${cropPath}${scalePath}${progressive}${fileType}${asJPG}`;
  return newUrl.toString();
}
function shopifyImageLoader({ src, options }) {
  const newSrc = new URL(src);
  const allowedCDNHostnames = PRODUCTION_CDN_HOSTNAMES.concat(LOCAL_CDN_HOSTNAMES);
  const isShopifyServedImage = allowedCDNHostnames.some((allowedHostname) => newSrc.hostname.endsWith(allowedHostname));
  if (!isShopifyServedImage || options == null || !options.width && !options.height && !options.crop && !options.scale && !options.format) {
    return src;
  }
  return addImageSizeParametersToUrl(src, options);
}
function useImageUrl(src, options) {
  return React.useMemo(() => {
    return src ? shopifyImageLoader({ src, options }) : src;
  }, [options, src]);
}
export { addImageSizeParametersToUrl, shopifyImageLoader, useImageUrl };
//# sourceMappingURL=image_size.js.map
