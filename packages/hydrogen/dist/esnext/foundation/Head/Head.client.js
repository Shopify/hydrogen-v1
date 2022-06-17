import React from 'react';
import { Helmet, HelmetData as HeadData, } from 'react-helmet-async';
import { useEnvContext } from '../ssr-interop';
const clientHeadData = new HeadData({});
export function Head({ children, ...props }) {
    const headData = useEnvContext((req) => req.ctx.head, clientHeadData);
    return (
    // @ts-ignore
    React.createElement(Helmet, { ...props, helmetData: headData }, children));
}
