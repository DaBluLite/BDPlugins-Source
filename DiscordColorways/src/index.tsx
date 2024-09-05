import { DOM, Patcher } from "betterdiscord";
import { ColorwayCSS, getSetting, saveSettings, getBulkSetting, Webpack, Filters, queryTree, hookFunctionComponent, findOwner, getFiber, openModal } from "../../common";
import styles from "./style.css";
import discordTheme from "./theme.discord.css";
import Selector from "./components/Selector";
import SettingsPage from "./components/SettingsTabs/SettingsPage";
import SourceManager from "./components/SettingsTabs/SourceManager";
import Store from "./components/SettingsTabs/Store";
import defaultsLoader from "./defaultsLoader";
import { closeWS, connect } from "./wsClient";
import ColorwaysButton from "./components/ColorwaysButton";
import { generateCss, getPreset, gradientBase, gradientPresetIds } from "./css";
import { colorToHex } from "./utils";
import { defaultColorwaySource } from "./constants";
import PCSMigrationModal from "./components/PCSMigrationModal";

export { useStateFromStores, UserStore, openModal, ColorPicker, Slider, FluxDispatcher, Toasts } from "../../common";
export type { FluxEvents } from "./types";

export { useState, useEffect, useRef, useReducer, useCallback } from "react";

export const DataStore = {
    get: async (key: string) => {
        return getSetting(key);
    },
    set: async (key: string, value: any) => {
        saveSettings({ [key]: value })
    },
    getMany: async (keys: string[]) => {
        return getBulkSetting(...keys);
    }
}

export const PluginProps = {
    pluginVersion: "6.4.0",
    clientMod: "BetterDiscord",
    UIVersion: "2.1.0",
    creatorVersion: "1.21"
};

// Data.save("settings", Object.assign(
//     {},
//     {
//         activeAutoPreset: null,
//         showInGuildBar: false,
//         onDemandWays: false,
//         onDemandWaysTintedText: false,
//         onDemandWaysDiscordSaturation: false,
//         onDemandWaysOsAccentColor: false,
//         isButtonThin: false,
//         activeColorwayObject: nullColorwayObj,
//         selectorViewMode: "grid",
//         showLabelsInSelectorGridView: false,
//         colorwaysPluginTheme: "discord"
//     },
//     Data.load("settings")
// ));

// if (getSetting("colorwayLists")) {
//     if (typeof getSetting("colorwayLists")[0] === "string") {
//         saveSettings({ colorwayLists: getSetting("colorwayLists").map((sourceURL: string, i: number) => {
//             return { name: sourceURL === defaultColorwaySource ? "Project Colorway" : `Source #${i}`, url: sourceURL };
//         }) });
//     }
// } else {
//     saveSettings({ colorwayLists: [{
//         name: "Project Colorway",
//         url: defaultColorwaySource
//     }] })
// }

// if (Data.load("custom_colorways")) {
//     if(Data.load("custom_colorways").length > 0) {
//         if(!Object.keys(Data.load("custom_colorways")[0]).includes("colorways")) {
//             Data.save("custom_colorways", [{ name: "Custom", colorways: Data.load("custom_colorways") }]);
//         }
//     }
// } else {
//     Data.save("custom_colorways", []);
// }

defaultsLoader();

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
    settingsSection = [
        {
            section: "DIVIDER"
        },
        {
            section: "HEADER",
            label: "Discord Colorways",
            className: "vc-settings-header"
        },
        {
            section: "ColorwaysSelector",
            label: "Colorways",
            element: () => <Selector hasTheme />,
            className: "dc-colorway-selector"
        },
        {
            section: "ColorwaysSettings",
            label: "Settings",
            element: () => <SettingsPage hasTheme />,
            className: "dc-colorway-settings"
        },
        {
            section: "ColorwaysSourceManager",
            label: "Sources",
            element: () => <SourceManager hasTheme />,
            className: "dc-colorway-sources-manager"
        },
        {
            section: "ColorwaysStore",
            label: "Store",
            element: () => <Store hasTheme />,
            className: "dc-colorway-store"
        }
    ]
    async start() {
        DOM.addStyle(styles);
        DOM.addStyle(discordTheme);
        ColorwayCSS.set(getSetting("activeColorwayObject").css);

        Patcher.after(
            GuildsNav,
            "type",
            (cancel: any, result: any, ...args: any[]) => {
                const target = queryTree(args[0], (node: { props: { className: string; }; }) => node?.props?.className?.split(" ").includes(guildStyles.guilds));
                if (!target) {
                    return console.error("Unable to find chain patch target");
                }
                hookFunctionComponent(target, (result: any) => {
                    const scroller = queryTree(result, (node: { props: { className: string; }; }) => node?.props?.className?.split(" ").includes(treeStyles.scroller));
                    if (!scroller) {
                        return console.error("Unable to find scroller");
                    }
                    const { children } = (scroller.props as any);
                    children.splice(children.indexOf((children as []).filter((child: { [key: string]: any } | null | []) => {
                        if (child !== null && !Array.isArray(child) && child.type && typeof child.type == "function" && (child.type as Function).toString().includes("guildSeparator")) {
                            return true
                        }
                    })[0]) + 1, 0, <ColorwaysButton />);
                });
            }
        );
        DOM.addStyle(styles + discordTheme);
        triggerRerender();

        // forceUpdate();

        // const UserSettings = await Webpack.getLazy(Filters.byPrototypeKeys("getPredicateSections"));

        // Patcher.after(UserSettings.prototype, "getPredicateSections", (thisObject, args, returnValue) => {
        //     let location = returnValue.findIndex(({ section }: { section: string }) => section.toLowerCase() == "billing") + 1;
        //     if (location < 0) return;
        //     const insert = (section: {}) => {
        //         returnValue.splice(location, 0, section);
        //         location++;
        //     };
        //     for (const section of this.settingsSection) {
        //         insert(section);
        //     }
        // });

        const [
            activeColorwayObject,
            colorwaysManagerAutoconnectPeriod,
            colorwaysManagerDoAutoconnect,
            colorwaySourceFiles,
            colorwaysPreset
        ] = getBulkSetting(
            "activeColorwayObject",
            "colorwaysManagerAutoconnectPeriod",
            "colorwaysManagerDoAutoconnect",
            "colorwaySourceFiles",
            "colorwaysPreset"
        );

        connect(colorwaysManagerDoAutoconnect as boolean, colorwaysManagerAutoconnectPeriod as number);

        const active: ColorwayObject = activeColorwayObject;

        if (active.id) {
            if (colorwaysPreset == "default") {
                ColorwayCSS.set(generateCss(
                    active.colors,
                    true,
                    true,
                    undefined,
                    active.id
                ));
            } else {
                if (gradientPresetIds.includes(colorwaysPreset)) {
                    const css = Object.keys(active).includes("linearGradient")
                        ? gradientBase(colorToHex(active.colors.accent), true) + `:root:root {--custom-theme-background: linear-gradient(${active.linearGradient})}`
                        : (getPreset(active.colors)[colorwaysPreset].preset as { full: string; }).full;
                    ColorwayCSS.set(css);
                } else {
                    ColorwayCSS.set(getPreset(active.colors)[colorwaysPreset].preset as string);
                }
            }
        }

        if ((colorwaySourceFiles as { name: string, url: string; }[]).map(i => i.url).includes("https://raw.githubusercontent.com/DaBluLite/ProjectColorway/master/index.json") || (!(colorwaySourceFiles as { name: string, url: string; }[]).map(i => i.url).includes("https://raw.githubusercontent.com/DaBluLite/ProjectColorway/master/index.json") && !(colorwaySourceFiles as { name: string, url: string; }[]).map(i => i.url).includes("https://raw.githubusercontent.com/ProjectColorway/ProjectColorway/master/index.json"))) {
            saveSettings({
                "colorwaySourceFiles": [{ name: "Project Colorway", url: defaultColorwaySource }, ...(colorwaySourceFiles as { name: string, url: string; }[]).filter(i => i.name !== "Project Colorway")]
            });
            openModal(props => <PCSMigrationModal modalProps={props} />);
        }
    }
    stop() {
        ColorwayCSS.remove();
        DOM.removeStyle();
        Patcher.unpatchAll();
        closeWS();
    }
};
