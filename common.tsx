import React from "react";
import ReactDOM from "react-dom";
import { DOM, Webpack as Webpack$1 } from "betterdiscord";

export const Filters = {
    ...Webpack$1.Filters,
    byName: (name: any) => {
        return (target: { displayName: any; constructor: { displayName: any; }; }) => (target?.displayName ?? target?.constructor?.displayName) === name;
    },
    byKeys: (...keys: any[]) => {
        return (target: any) => target instanceof Object && keys.every((key) => key in target);
    },
    byProtos: (...protos: any[]) => {
        return (target: { prototype: any; }) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
    },
    bySource: (...fragments: any[]) => {
        return (target: { render: any; type: any; toString: () => any; prototype: { render: { toString: () => any; }; }; }) => {
            while (target instanceof Object && "$$typeof" in target) {
                target = target.render ?? target.type;
            }
            if (target instanceof Function) {
                const source = target.toString();
                const renderSource = target.prototype?.render?.toString();
                return fragments.every((fragment) => typeof fragment === "string" ? (source.includes(fragment) || renderSource?.includes(fragment)) : (fragment(source) || renderSource && fragment(renderSource)));
            }
            else {
                return false;
            }
        };
    }
}

const hasThrown = new WeakSet();

const wrapFilter = (filter: any) => (exports: { default: { remove: any; set: any; clear: any; get: any; sort: any; getToken: any; getEmail: any; showToken: any; }; remove: any; set: any; clear: any; get: any; sort: any; getToken: any; getEmail: any; showToken: any; }, module?: any, moduleId?: any) => {
    try {
        if (exports?.default?.remove && exports?.default?.set && exports?.default?.clear && exports?.default?.get && !exports?.default?.sort) return false;
        if (exports.remove && exports.set && exports.clear && exports.get && !exports.sort) return false;
        if (exports?.default?.getToken || exports?.default?.getEmail || exports?.default?.showToken) return false;
        if (exports.getToken || exports.getEmail || exports.showToken) return false;
        return filter(exports, module, moduleId);
    }
    catch (err) {
        if (!hasThrown.has(filter)) console.warn("WebpackModules~getModule", "Module filter threw an exception.", filter, err);
        hasThrown.add(filter);
        return false;
    }
};

const listeners = new Set();

function addListener(listener: unknown) {
    listeners.add(listener);
    return removeListener.bind(null, listener);
}

function removeListener(listener: unknown) {return listeners.delete(listener);}

export const Webpack = {
    ...Webpack$1,
    getLazy: (filter: any, options: { signal?: any, defaultExport?: boolean, searchExports?: boolean } = {}) => {
        const {signal: abortSignal, defaultExport = true, searchExports = false} = options;
        const fromCache = Webpack.getModule(filter, {defaultExport, searchExports});
        if (fromCache) return Promise.resolve(fromCache);

        const wrappedFilter = wrapFilter(filter);

        return new Promise((resolve) => {
            const cancel = () => removeListener(listener);
            const listener = function(exports: any | HTMLElement) {
                if (!exports || exports === window || exports === document.documentElement || exports[Symbol.toStringTag] === "DOMTokenList") return;

                let foundModule = null;
                if (typeof(exports) === "object" && searchExports && !exports.TypedArray) {
                    for (const key in exports) {
                        foundModule = null;
                        const wrappedExport = exports[key];
                        if (!wrappedExport) continue;
                        if (wrappedFilter(wrappedExport)) foundModule = wrappedExport;
                    }
                }
                else {
                    if (exports.Z && wrappedFilter(exports.Z)) foundModule = defaultExport ? exports.Z : exports;
                    if (exports.ZP && wrappedFilter(exports.ZP)) foundModule = defaultExport ? exports.ZP : exports;
                    if (exports.__esModule && exports.default && wrappedFilter(exports.default)) foundModule = defaultExport ? exports.default : exports;
                    if (wrappedFilter(exports)) foundModule = exports;

                }
                
                if (!foundModule) return;
                cancel();
                resolve(foundModule);
            };

            addListener(listener);
            abortSignal?.addEventListener("abort", () => {
                cancel();
                resolve(null);
            });
        });
    }
}

export const ReactDOMInternals = (ReactDOM as any)?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.Events ?? [];
export const [getInstanceFromNode, getNodeFromInstance, getFiberCurrentPropsFromNode, enqueueStateRestore, restoreStateIfNeeded, batchedUpdates] = ReactDOMInternals;

const FCHook = ({ children: { type, props }, callback }: { children: { type: any, props: any }, callback: any }) => {
    const result = type(props);
    return callback(result, props) ?? result;
};

export const hookFunctionComponent = (target: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>, callback: (result: any) => void) => {
    const props = {
        children: { ...target },
        callback
    };
    target.props = props;
    target.type = FCHook;
    return target;
};

export const queryTree = (node: any, predicate: any) => {
    const worklist = [node].flat();
    while (worklist.length !== 0) {
        const node = worklist.shift();
        if (React.isValidElement(node)) {
            if (predicate(node)) {
                return node;
            }
            const children = (node?.props as any)?.children;
            if (children) {
                worklist.push(...[children].flat());
            }
        }
    }
    return null;
};

export const getFiber = (node: Element) => getInstanceFromNode(node ?? {});

const queryFiber = (fiber: { return: any; child: any; }, predicate: { (node: any): boolean; (arg0: any): any; }, direction = "up", depth = 30) => {
    if (depth < 0) {
        return null;
    }
    if (predicate(fiber)) {
        return fiber;
    }
    if (direction === "up" || direction === "both") {
        let count = 0;
        let parent = fiber.return;
        while (parent && count < depth) {
            if (predicate(parent)) {
                return parent;
            }
            count++;
            parent = parent.return;
        }
    }
    if (direction === "down" || direction === "both") {
        let child = fiber.child;
        while (child) {
            const result: any = queryFiber(child, predicate, "down", depth - 1);
            if (result) {
                return result;
            }
            child = child.sibling;
        }
    }
    return null;
};

export const findOwner = (fiber: any, depth = 50) => {
    return queryFiber(fiber, (node: { stateNode: any; }) => node?.stateNode instanceof React.Component, "up", depth);
};

export const ColorwayCSS = {
    get: () => document.getElementById("activeColorwayCSS")?.textContent || "",
    set: (e: string) => {
        if(e == "") {
            DOM.removeStyle("activeColorwayCSS")
        } else {
            if (!document.getElementById("activeColorwayCSS")) {
                DOM.addStyle("activeColorwayCSS", e)
            } else document.getElementById("activeColorwayCSS")!.textContent = e;
        }
    },
    remove: () => DOM.removeStyle("activeColorwayCSS"),
};

/**
 * Some internals for the Discord Desktop app
 */
export var DiscordNative: {
    "isRenderer": boolean,
    "nativeModules": {
        "canBootstrapNewUpdater": boolean
    },
    "process": {
        "platform": string,
        "arch": string,
        "env": {}
    },
    "os": {
        "appArch": string,
        "arch": string,
        "release": string
    },
    "app": {
        "dock": {}
    },
    "clipboard": {},
    "ipc": {},
    "gpuSettings": {},
    "window": {
        "USE_OSX_NATIVE_TRAFFIC_LIGHTS": boolean
    },
    "powerMonitor": {},
    "spellCheck": {},
    "crashReporter": {},
    "desktopCapture": {},
    "fileManager": {
        "openFiles": (options: {}) => {
            [key: string]: any
        },
        "saveWithDialog": (data: any, filename: string) => void
    },
    "clips": {},
    "processUtils": {},
    "powerSaveBlocker": {},
    "http": {},
    "accessibility": {},
    "features": {},
    "settings": {},
    "userDataCache": {},
    "thumbar": {},
    "safeStorage": {},
    "globalOverlay": {
        "WINDOW_KEY": string
    },
    "hardware": {},
    "remoteApp": {
        "dock": {}
    },
    "remotePowerMonitor": {},
    "webAuthn": {}
} = (window as any).DiscordNative;

export function hslToHex(h: number, s: number, l: number) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: any, g: any, b: any;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHex(r: number, g: number, b: number) {
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function colorToHex(color: string) {
    var colorType = "hex";
    if (color.includes("hsl")) {
        colorType = "hsl";
    } else if (color.includes("rgb")) {
        colorType = "rgb";
    }
    color = color.replaceAll(",", "").replace(/.+?\(/, "").replace(")", "").replaceAll(/[ \t]+\/[ \t]+/g, " ").replaceAll("%", "").replaceAll("/", "");
    if (colorType === "hsl") {
        color = hslToHex(Number(color.split(" ")[0]), Number(color.split(" ")[1]), Number(color.split(" ")[2]));
    }
    if (colorType === "rgb") {
        color = rgbToHex(Number(color.split(" ")[0]), Number(color.split(" ")[1]), Number(color.split(" ")[2]));
    }
    return color.replace("#", "");
}

export function makeLazy<T>(factory: () => T, attempts = 5): () => T {
    let tries = 0;
    let cache: T;
    return () => {
        if (!cache && attempts > tries++) {
            cache = factory();
            if (!cache && attempts === tries)
                console.error("Lazy factory failed:", factory);
        }
        return cache;
    };
}

import type { ComponentType } from "react";

const NoopComponent = () => null;

/**
 * A lazy component. The factory method is called on first render.
 * @param factory Function returning a Component
 * @param attempts How many times to try to get the component before giving up
 * @returns Result of factory function
 */
export function LazyComponent<T extends object = any>(factory: () => React.ComponentType<T>, attempts = 5) {
    const get = makeLazy(factory, attempts);
    const LazyComponent = (props: T) => {
        const Component = get() ?? NoopComponent;
        return <Component {...props} />;
    };

    LazyComponent.$$vencordInternal = get;

    return LazyComponent as ComponentType<T>;
}

export function handleModuleNotFound(method: string, ...filter: unknown[]) {
    const err = new Error(`webpack.${method} found no module`);
    console.error(err, "Filter:", filter);
}

export function findExportedComponentLazy<T extends object = any>(...props: string[]) {
    return LazyComponent<T>(() => {
        const res = Webpack.getModule(Filters.byProps(...props));
        if (!res)
            handleModuleNotFound("findExportedComponent", ...props);
        return res[props[0]];
    });
}

export const { radioBar, item: radioBarItem, itemFilled: radioBarItemFilled, radioPositionLeft } = Webpack.getByKeys("radioBar");