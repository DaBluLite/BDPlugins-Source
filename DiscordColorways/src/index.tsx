import { Data, DOM, Patcher } from "betterdiscord";
import { ColorwayCSS, Webpack, Filters, queryTree, hookFunctionComponent, findOwner, getFiber } from "../../common";
import styles from "./style.css";
import discordTheme from "./theme.discord.css";
import defaultsLoader from "./defaultsLoader";
import { closeWS, connect } from "./wsClient";
import ColorwaysButton from "./components/ColorwaysButton";
import { generateCss, getPreset, gradientBase, gradientPresetIds } from "./css";
import { initContexts } from "./contexts";

export { useStateFromStores, UserStore, openModal, Forms, FluxDispatcher, Toasts, ContextMenuApi, FocusLock, Popout } from "../../common";
export type { FluxEvents } from "./types";

export { useState, useEffect, useRef, useReducer, useCallback } from "react";

export const DataStore = {
    get: async (key: string) => {
        return Data.load(key) || null;
    },
    set: async (key: string, value: any) => {
        Data.save(key, value);
    },
    getMany: async (keys: string[]) => {
        return keys.map(setting => Data.load(setting) || null);
    }
}

export const PluginProps = {
    pluginVersion: "7.0.0",
    clientMod: "BetterDiscord",
    UIVersion: "2.2.0",
    creatorVersion: "1.23"
};

const guildStyles = Webpack.getModule(Filters.byKeys("guilds", "base"), { searchExports: false, defaultExport: true });
const treeStyles = Webpack.getModule(Filters.byKeys("tree", "scroller"), { searchExports: false, defaultExport: true });
const GuildsNav = Webpack.getModule(Filters.bySource("guildsnav"), { searchExports: true, defaultExport: true });

const instead = (object: { [x: string]: any; }, method: string | number, callback: (arg0: any, arg1: any, arg2: any) => any, options: { once: boolean; silent: boolean; name?: boolean; }) => {
    const original = object?.[method];
    if (!(original instanceof Function)) {
        throw TypeError(`patch target ${original} is not a function`);
    }
    const cancel: () => void = Patcher.instead(object, method, options.once ? (...args: any) => {
        const result = callback(cancel, original, args);
        cancel();
        return result;
    } : (...args: any) => callback(cancel, original, args));
    if (!options.silent) {
        console.log(`Patched ${options.name ?? String(method)}`);
    }
    return cancel;
}

const forceFullRerender = (fiber: any) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        const { stateNode } = owner;
        instead(stateNode, "render", () => null, { once: true, silent: true });
        stateNode.forceUpdate(() => stateNode.forceUpdate(() => resolve(true)));
    }
    else {
        resolve(false);
    }
});

const triggerRerender = async () => {
    const node = document.getElementsByClassName(guildStyles.guilds)?.[0];
    const fiber = getFiber(node);
    if (!await forceFullRerender(fiber)) {
        console.warn("Unable to rerender guilds")
    }
};

export default class DiscordColorways {
    load() { }
    start() {
        Patcher.after(
            GuildsNav,
            "type",
            (cancel: any, result: any, ...args: any[]) => {
                const target = queryTree(args[0], (node: { props: { className: string; }; }) => node?.props?.className?.split(" ").includes(guildStyles.guilds));
                if (!target) {
                    return console.error("Unable to find chain patch target");
                }
                hookFunctionComponent(target, (result: any) => {
                    const scroller = queryTree(result, (node: { props: any; }) => node?.props?.value?.includes("guilds list"));
                    if (!scroller) {
                        return console.error("Unable to find scroller");
                    }
                    const { children } = (scroller.props as any);
                    const Child = children.props.children();
                    const list = Child.props.children.props.children.find((child: any) => child.props.className.includes(treeStyles.scroller)) as { props: { children: any[] } }
                    console.log(list);
                    list.props.children.splice(list.props.children.indexOf(list.props.children.filter(child => child !== null && typeof child.type === "string")[0]), 0, <ColorwaysButton/>);
                    children.props.children = () => Child;
                });
            }
        );
        DOM.addStyle(styles + discordTheme);
        triggerRerender();
        defaultsLoader();

        connect();

        initContexts().then(contexts => {
            if (contexts.activeColorwayObject.id) {
                if (contexts.colorwaysPreset === "default") {
                    ColorwayCSS.set(generateCss(
                        contexts.activeColorwayObject.colors,
                        true,
                        true,
                        undefined,
                        contexts.activeColorwayObject.id
                    ));
                } else {
                    if (gradientPresetIds.includes(contexts.colorwaysPreset)) {
                        const css = Object.keys(contexts.activeColorwayObject).includes("linearGradient")
                            ? gradientBase(contexts.activeColorwayObject.colors, true) + `:root:root {--custom-theme-background: linear-gradient(${contexts.activeColorwayObject.linearGradient})}`
                            : (getPreset(contexts.activeColorwayObject.colors)[contexts.colorwaysPreset].preset as { full: string; }).full;
                        ColorwayCSS.set(css);
                    } else {
                        ColorwayCSS.set(getPreset(contexts.activeColorwayObject.colors)[contexts.colorwaysPreset].preset as string);
                    }
                }
            }
        });
    }
    stop() {
        ColorwayCSS.remove();
        DOM.removeStyle();
        Patcher.unpatchAll();
        closeWS();
    }
};
