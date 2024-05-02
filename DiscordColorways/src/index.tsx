import { Patcher, Data, DOM } from "betterdiscord";
import { hookFunctionComponent, getFiber, findOwner, queryTree, ColorwayCSS, Webpack, colorToHex } from "../../common";
import ColorwaysButton from "./components/ColorwaysButton";
import { Filters } from "../../common";
import styles from "./style.css";
import SettingsPage from "./components/SettingsTabs/SettingsPage";
import OnDemandPage from "./components/SettingsTabs/OnDemandPage";
import ManageColorwaysPage from "./components/SettingsTabs/ManageColorwaysPage";
import { Forms, Modals, SettingsRouter } from "./common";
import CreatorModal from "./components/CreatorModal";
import Selector from "./components/Selector";
import ColorPicker from "./components/ColorPicker";
import type { ModalProps } from "../../global";
import plugin from "./plugin.json"
import AutoColorwaySelector from "./components/AutoColorwaySelector";
import { getAutoPresets } from "./css";

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
        activeColorway: null,
        activeColorwayID: null,
        activeAutoPreset: null,
        showInGuildBar: false,
        colorwayLists: ["https://raw.githubusercontent.com/DaBluLite/ProjectColorway/master/index.json"],
        onDemandWays: false,
        onDemandWaysTintedText: false,
        onDemandWaysDiscordSaturation: false,
        onDemandWaysOsAccentColor: false,
        isButtonThin: false
    },
    Data.load("settings")
));

Data.save("custom_colorways", Object.assign([], Data.load("custom_colorways")));

const SettingsSection = [
    {
        section: "CUSTOM",
        className: "vc-settings-header",
        element: () => <Forms.FormTitle style={{
            marginBottom: 0,
            padding: "6px 10px",
            color: "var(--channels-default)",
            display: "flex",
            justifyContent: "space-between"
        }}>
            Discord Colorways
            <Forms.FormTitle style={{
                marginBottom: 0,
                color: "var(--channels-default)",
                marginLeft: "auto"
            }}>v{plugin.version}</Forms.FormTitle>
        </Forms.FormTitle>
    },
    {
        section: "ColorwaysSelector",
        label: "Colorways",
        element: () => <Selector modalProps={{ onClose: () => new Promise(() => {}), transitionState: 1 }} isSettings />,
        className: "dc-colorway-selector"
    },
    {
        section: "ColorwaysSettings",
        label: "Settings",
        element: SettingsPage,
        className: "dc-colorway-settings"
    },
    {
        section: "ColorwaysOnDemand",
        label: "On-Demand",
        element: OnDemandPage,
        className: "dc-colorway-ondemand"
    },
    {
        section: "ColorwaysManagement",
        label: "Manage...",
        element: ManageColorwaysPage,
        className: "dc-colorway-management"
    },
    {
        section: "DIVIDER"
    }
].filter(Boolean);

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
        ColorwayCSS.set(Data.load("settings").activeColorway);

        Webpack.waitForModule(Filters.byStrings("Messages.ACTIVITY_SETTINGS"), { defaultExport: false }).then(SettingsComponent => {
            Patcher.after(SettingsComponent,
                "default",
                (cancel: any, result: any, returnValue: any[]) => {
                    let location = returnValue.findIndex(s => s.section.toLowerCase() == "appearance") - 1;
                    returnValue.splice(0, returnValue.length, ...[...[...returnValue].splice(0, location), ...SettingsSection, ...[...returnValue].splice(location, returnValue.length - 1)])
                }
            )
        });
    }
    getToolboxActions() {
        return {
            "Change Colorway": () => Modals.openModal((props: ModalProps) => <Selector modalProps={props} />),
            "Open Colorway Creator": () => Modals.openModal((props: ModalProps) => <CreatorModal modalProps={props} />),
            "Open Color Stealer": () => Modals.openModal((props: ModalProps) => <ColorPicker modalProps={props} />),
            "Open Settings": () => SettingsRouter.open("ColorwaysSettings"),
            "Open On-Demand Settings": () => SettingsRouter.open("ColorwaysOnDemand"),
            "Manage Colorways...": () => SettingsRouter.open("ColorwaysManagement"),
            "Change Auto Colorway Preset": async () => {
                Modals.openModal((props: ModalProps) => <AutoColorwaySelector modalProps={props} onChange={autoPresetId => {
                    if (Data.load("settings").activeColorwayID === "Auto") {
                        const demandedColorway = getAutoPresets(colorToHex(getComputedStyle(document.body).getPropertyValue("--os-accent-color")))[autoPresetId].preset();
                        Data.save("settings", { ...Data.load("settings"), activeColorway: demandedColorway });
                        ColorwayCSS.set(demandedColorway);
                    }
                }} />);
            }
        }
    };
    stop() {
        ColorwayCSS.remove();
        DOM.removeStyle();
        Patcher.unpatchAll();
        triggerRerender();
    }
};
