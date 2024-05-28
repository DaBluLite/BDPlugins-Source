import { Patcher, Data, DOM } from "betterdiscord";
import { hookFunctionComponent, getFiber, findOwner, queryTree, ColorwayCSS, Webpack, colorToHex, openModal, getSetting, saveSettings, ModalRoot, ModalContent, ModalHeader } from "../../common";
import ColorwaysButton from "./components/ColorwaysButton";
import styles from "./style.css";
import { Text, Filters } from "../../common";
import CreatorModal from "./components/CreatorModal";
import Selector from "./components/Selector";
import ColorPicker from "./components/ColorPicker";
import AutoColorwaySelector from "./components/AutoColorwaySelector";
import { getAutoPresets } from "./css";
import { defaultColorwaySource } from "./constants";
import SettingsModal, { SettingsTab } from "./components/SettingsModal";
import ReactDOM from "react-dom";

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

Data.save("settings", Object.assign(
    {},
    {
        activeAutoPreset: null,
        showInGuildBar: false,
        onDemandWays: false,
        onDemandWaysTintedText: false,
        onDemandWaysDiscordSaturation: false,
        onDemandWaysOsAccentColor: false,
        isButtonThin: false,
        activeColorwayObject: { id: null, css: null, sourceType: null, source: null },
        selectorViewMode: "grid",
        showLabelsInSelectorGridView: false
    },
    Data.load("settings")
));

if (getSetting("colorwayLists")) {
    if (typeof getSetting("colorwayLists")[0] === "string") {
        saveSettings({ colorwayLists: getSetting("colorwayLists").map((sourceURL: string, i: number) => {
            return { name: sourceURL === defaultColorwaySource ? "Project Colorway" : `Source #${i}`, url: sourceURL };
        }) });
    }
} else {
    saveSettings({ colorwayLists: [{
        name: "Project Colorway",
        url: defaultColorwaySource
    }] })
}

if (Data.load("custom_colorways")) {
    if (!Data.load("custom_colorways")[0].colorways) {
        Data.save("custom_colorways", [{ name: "Custom", colorways: Data.load("custom_colorways") }]);
    }
} else {
    Data.save("custom_colorways", []);
}

export default class DiscordColorways {
    load() { }
    async start() {
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
        DOM.addStyle(styles);
        triggerRerender();
        ColorwayCSS.set(getSetting("activeColorwayObject").css);
    }
    getToolboxActions() {
        return {
            "Change Colorway": () => openModal((props: ModalProps) => <Selector modalProps={props} />),
            "Open Colorway Creator": () => openModal((props: ModalProps) => <CreatorModal modalProps={props} />),
            "Open Color Stealer": () => openModal((props: ModalProps) => <ColorPicker modalProps={props} />),
            "Open Settings": () => openModal((props: ModalProps) => <ModalRoot {...props} size="medium">
                <ModalHeader separator={false}>
                    <Text variant="heading-lg/semibold" tag="h1">
                        Settings
                    </Text>
                </ModalHeader>
                <ModalContent><SettingsModal/></ModalContent>
            </ModalRoot>),
            "Open On-Demand Settings": () => openModal((props: ModalProps) => <ModalRoot {...props} size="medium">
                <ModalHeader separator={false}>
                    <Text variant="heading-lg/semibold" tag="h1">
                        Settings
                    </Text>
                </ModalHeader>
                <ModalContent><SettingsModal tab={SettingsTab.OnDemand}/></ModalContent>
            </ModalRoot>),
            "Manage Colorway Sources": () => openModal((props: ModalProps) => <ModalRoot {...props} size="medium">
                <ModalHeader separator={false}>
                    <Text variant="heading-lg/semibold" tag="h1">
                        Settings
                    </Text>
                </ModalHeader>
                <ModalContent><SettingsModal tab={SettingsTab.Sources}/></ModalContent>
            </ModalRoot>),
            "Open Colorway Store": () => openModal((props: ModalProps) => <ModalRoot {...props} size="medium">
                <ModalHeader separator={false}>
                    <Text variant="heading-lg/semibold" tag="h1">
                        Settings
                    </Text>
                </ModalHeader>
                <ModalContent><SettingsModal tab={SettingsTab.Store}/></ModalContent>
            </ModalRoot>),
            "Change Auto Colorway Preset": async () => {
                openModal((props: ModalProps) => <AutoColorwaySelector modalProps={props} onChange={autoPresetId => {
                    if (getSetting("activeColorwayObject").id === "Auto") {
                        const demandedColorway = getAutoPresets(colorToHex(getComputedStyle(document.body).getPropertyValue("--os-accent-color")))[autoPresetId].preset();
                        saveSettings({ activeColorwayObject: { id: "Auto", css: demandedColorway, sourceType: "online", source: null } });
                        ColorwayCSS.set(demandedColorway);
                    }
                }} />);
            }
        }
    };
    getSettingsPanel() {
        const elem = document.createElement("div");

        ReactDOM.render(<SettingsModal/>, elem);

        return elem
    }
    stop() {
        ColorwayCSS.remove();
        DOM.removeStyle();
        Patcher.unpatchAll();
        triggerRerender();
    }
};
