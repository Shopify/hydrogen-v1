import { memo, ScriptHTMLAttributes, startTransition, useEffect } from 'react';

const ScriptCache = new Map()
const LoadCache = new Set()

export interface HydrogenScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: 'afterHydrate' | 'lazily'
    id?: string
    onLoad?: (e: any) => void
    onError?: (e: any) => void,
    onReady?: () => void | null,
    children?: React.ReactNode
}

const DOMAttributeNames: Record<string, string> = {
    acceptCharset: 'accept-charset',
    className: 'class',
    httpEquiv: 'http-equiv',
    noModule: 'noModule',
}

const loadScript = (props: HydrogenScriptProps) => {
    const {
        src,
        id,
        onLoad = () => { },
        dangerouslySetInnerHTML,
        children = '',
        strategy = 'afterHydrate',
        onError
    } = props;

    const hydroCacheKey = src || id

    if (hydroCacheKey && LoadCache.has(hydroCacheKey)) return;

    if (ScriptCache.has(src)) {
        LoadCache.add(hydroCacheKey)
        ScriptCache.get(src).then(onLoad, onError)
        return;
    }

    const scriptEl = document.createElement("script")

    const loadPromise = new Promise<void>((resolve, reject) => {
        scriptEl.addEventListener('load', function (e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e)
            }
        })
        scriptEl.addEventListener('error', (e) => {
            reject(e);
        })
    }).catch((err) => {
        if (onError) {
            onError(err)
        }
    })

    if (src) {
        ScriptCache.set(src, loadPromise)
    }
    LoadCache.add(hydroCacheKey)

    if (dangerouslySetInnerHTML) {
        scriptEl.innerHTML = dangerouslySetInnerHTML.__html || ''
    } else if (children) {
        scriptEl.textContent =
            typeof children === 'string'
                ? children
                : Array.isArray(children)
                    ? children.join('')
                    : ''
    } else if (src) {
        scriptEl.src = src
    }

    for (const [k, value] of Object.entries(props)) {
        if (value === undefined || [
            'onLoad',
            'onReady',
            'dangerouslySetInnerHTML',
            'children',
            'onError',
            'strategy',
        ].includes(k)) {
            continue
        }
        const attr = DOMAttributeNames[k] || k.toLowerCase()
        scriptEl.setAttribute(attr, value)
    }


    scriptEl.setAttribute('data-hydro-script', strategy)

    document.body.appendChild(scriptEl)
}

export function handleClientScriptLoad(props: HydrogenScriptProps) {
    const { strategy = 'afterHydrate' } = props
    if (strategy === 'lazily') {
        window.addEventListener('load', () => {
            requestIdleCallback(() => {
                startTransition(() => {
                    loadScript(props)
                })
            })
        })
    } else {
        loadScript(props)
    }
}

function loadLazyScript(props: HydrogenScriptProps) {
    if (document.readyState === 'complete') {
        requestIdleCallback(() => {
            startTransition(() => {
                loadScript(props)
            })
        })
    } else {
        window.addEventListener('load', () => {
            requestIdleCallback(() => {
                startTransition(() => {
                    loadScript(props)
                })
            })
        })
    }
}

export function initScriptLoader(scriptLoaderItems: HydrogenScriptProps[]) {
    scriptLoaderItems.forEach(handleClientScriptLoad)
}


const HydrogenScript = memo((props: HydrogenScriptProps) => {
    const {
        id,
        src = '',
        onLoad = () => { },
        onReady = null,
        strategy = 'afterHydrate',
        onError,
        ...restProps
    } = props;

    useEffect(() => {
        const cacheKeyHydro = id || src
        if (onReady && cacheKeyHydro && LoadCache.has(cacheKeyHydro)) {
            onReady()
        }
    }, [onReady, id, src])

    useEffect(() => {
        if (strategy === 'afterHydrate') {
            loadScript(props)
        } else if (strategy === 'lazily') {
            loadLazyScript(props)
        }
    }, [props, strategy])


    return (
        <></>
    )
})

export default HydrogenScript;
