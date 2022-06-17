import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
export default function AnalyticsErrorBoundary({ children, }) {
    // Analytics fail to load, most likely due to an ad blocker
    return (React.createElement(ErrorBoundary, { fallbackRender: () => {
            return null;
        } }, children));
}
