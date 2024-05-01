import { DOM, Data, Patcher, Webpack } from "betterdiscord";
import { FluxDispatcher, GuildStore, SelectedGuildStore, Switch } from "./common";
import { findOwner, getFiber } from "../../common";
import { useState } from "react";
import ReactDOM from "react-dom";

const { app: AppClass } = Webpack.getByKeys("app", "layers");

Data.save("settings", Object.assign(
    {},
    {
        useServerBgTheme: false
    },
    Data.load("settings")
))

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

const gradientBase = `@import url(//dablulite.github.io/css-snippets/NitroThemesFix/import.css);
.theme-dark {
    --bg-overlay-color: 0 0 0;
    --bg-overlay-color-inverse: 255 255 255;
    --bg-overlay-opacity-1: 0.85;
    --bg-overlay-opacity-2: 0.8;
    --bg-overlay-opacity-3: 0.7;
    --bg-overlay-opacity-4: 0.5;
    --bg-overlay-opacity-5: 0.4;
    --bg-overlay-opacity-6: 0.1;
    --bg-overlay-opacity-hover: 0.5;
    --bg-overlay-opacity-hover-inverse: 0.08;
    --bg-overlay-opacity-active: 0.45;
    --bg-overlay-opacity-active-inverse: 0.1;
    --bg-overlay-opacity-selected: 0.4;
    --bg-overlay-opacity-selected-inverse: 0.15;
    --bg-overlay-opacity-chat: 0.8;
    --bg-overlay-opacity-home: 0.85;
    --bg-overlay-opacity-home-card: 0.8;
    --bg-overlay-opacity-app-frame: var(--bg-overlay-opacity-4);
}
.theme-light {
    --bg-overlay-color: 255 255 255;
    --bg-overlay-color-inverse: 0 0 0;
    --bg-overlay-opacity-1: 0.9;
    --bg-overlay-opacity-2: 0.8;
    --bg-overlay-opacity-3: 0.7;
    --bg-overlay-opacity-4: 0.6;
    --bg-overlay-opacity-5: 0.3;
    --bg-overlay-opacity-6: 0.15;
    --bg-overlay-opacity-hover: 0.7;
    --bg-overlay-opacity-hover-inverse: 0.02;
    --bg-overlay-opacity-active: 0.65;
    --bg-overlay-opacity-active-inverse: 0.03;
    --bg-overlay-opacity-selected: 0.6;
    --bg-overlay-opacity-selected-inverse: 0.04;
    --bg-overlay-opacity-chat: 0.9;
    --bg-overlay-opacity-home: 0.7;
    --bg-overlay-opacity-home-card: 0.9;
    --bg-overlay-opacity-app-frame: var(--bg-overlay-opacity-5);
}
.children_cde9af:after, .form_d8a4a1:before {
    content: none;
}
.scroller_de945b {
    background: var(--bg-overlay-app-frame,var(--background-tertiary));
}
.expandedFolderBackground_b1385f {
    background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
}
.wrapper__8436d:not(:hover):not(.selected_ae80f7) .childWrapper_a6ce15 {
    background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
}
.folder__17546:has(.expandedFolderIconWrapper__324c1) {
    background: var(--bg-overlay-6,var(--background-secondary));
}
.circleIconButton__05cf2:not(.selected_aded59) {
    background: rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6));
}
.auto_a3c0bd::-webkit-scrollbar-thumb,
.thin_b1c063::-webkit-scrollbar-thumb {
    background-size: 200vh;
    background-image: -webkit-gradient(linear,left top,left bottom,from(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4))),to(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4)))),var(--custom-theme-background);
    background-image: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-4))),var(--custom-theme-background);
}
.auto_a3c0bd::-webkit-scrollbar-track {
    background-size: 200vh;
    background-image: -webkit-gradient(linear,left top,left bottom,from(rgb(var(--bg-overlay-color)/.4)),to(rgb(var(--bg-overlay-color)/.4))),var(--custom-theme-background);
    background-image: linear-gradient(rgb(var(--bg-overlay-color)/.4),rgb(var(--bg-overlay-color)/.4)),var(--custom-theme-background);
}
.cssutils-container {
    --bg-overlay-1: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-1)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-1))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-2: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-2)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-2))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-3: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-3)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-3))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-4: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-4)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-4))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-5: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-5)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-5))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-6: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-6))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-hover: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-hover-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-hover-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-hover)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-hover))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-active: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-active-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-active-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-active)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-active))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-selected: linear-gradient(rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-selected-inverse)),rgb(var(--bg-overlay-color-inverse)/var(--bg-overlay-opacity-selected-inverse))) fixed 0 0/cover,linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-selected)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-selected))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-chat: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-chat)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-chat))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-home: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-home-card: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home-card)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-home-card))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
    --bg-overlay-app-frame: linear-gradient(rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-app-frame)),rgb(var(--bg-overlay-color)/var(--bg-overlay-opacity-app-frame))) fixed 0 0/cover,var(--custom-theme-background) fixed 0 0/cover;
}`

const forceFullRerender = (fiber: any) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        const { stateNode } = owner;
        instead(stateNode, "render", () => null, { once: true, silent: true });
        Patcher.after(stateNode, "render", (e: any) => {
            const NewContainer = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
                const [hasBg, setHasBg] = useState<boolean>(SelectedGuildStore?.getGuildId() !== null && GuildStore?.getGuild(SelectedGuildStore?.getGuildId()).banner !== null);
                const [style, setStyle] = useState<any>({ "--custom-theme-background": SelectedGuildStore?.getGuildId() !== null && GuildStore?.getGuild(SelectedGuildStore?.getGuildId()).banner !== null ? `url('https://cdn.discordapp.com/banners/${SelectedGuildStore?.getGuildId()}/${GuildStore?.getGuild(SelectedGuildStore?.getGuildId()).banner}.webp?size=240')` : "none" });
                const [serverBgTheme, setServerBgTheme] = useState<boolean>(Data.load("settings").useServerBgTheme);

                FluxDispatcher.subscribe("UPDATE_SERVER_BG", () => {
                    setHasBg(SelectedGuildStore?.getGuildId() !== null && GuildStore?.getGuild(SelectedGuildStore?.getGuildId()).banner !== null);
                    setStyle({ "--custom-theme-background": SelectedGuildStore?.getGuildId() !== null && GuildStore?.getGuild(SelectedGuildStore?.getGuildId()).banner !== null ? `url('https://cdn.discordapp.com/banners/${SelectedGuildStore?.getGuildId()}/${GuildStore?.getGuild(SelectedGuildStore?.getGuildId()).banner}.webp?size=240')` : "none" });
                });

                FluxDispatcher.subscribe("USE_SERVER_BG_THEME", ({ enabled }: { enabled: boolean }) => {
                    setServerBgTheme(enabled);
                });

                return <>
                    {hasBg && serverBgTheme? <style>{gradientBase}</style> : <></>}
                    <div {...props} style={{ ...props.style, ...style }} className={props.className + " cssutils-container"} data-test="hi" data-has-server-bg={hasBg} />
                </>
            }
            return <NewContainer {...e.props}/>
        });
        stateNode.forceUpdate(() => stateNode.forceUpdate(() => resolve(true)));
    }
    else {
        resolve(false);
    }
});

const triggerRerender = async () => {
    const node = document.getElementsByClassName(AppClass)?.[0];
    const fiber = getFiber(node);
    if (!await forceFullRerender(fiber)) {
        console.warn("Unable to rerender app")
    }
};

export default class CSSUtils {
    start() {
        triggerRerender();
    }
    onSwitch() {
        FluxDispatcher.dispatch({ type: "UPDATE_SERVER_BG" });
    }
    stop() {
        Patcher.unpatchAll();
    }
    getSettingsPanel() {
        const SettingsContainer = DOM.createElement("div");

        function SettingsPanel() {
            const [serverBgTheme, setServerBgTheme] = useState<boolean>(Data.load("settings").useServerBgTheme);
            return <>
                <Switch value={serverBgTheme} onChange={(e) => {
                    setServerBgTheme(e);
                    FluxDispatcher.dispatch({ type: "USE_SERVER_BG_THEME", enabled: e });
                    Data.save("settings", { ...Data.load("settings"), useServerBgTheme: e });
                }} hideBorder>
                    Use built-in server background theme
                </Switch>
            </>
        }

        ReactDOM.render(<SettingsPanel/>, SettingsContainer);

        return SettingsContainer;
    }
}