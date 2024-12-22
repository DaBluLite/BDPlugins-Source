import * as API from "./api";
import { Discord } from "./api";
import { ContextMenu, Patcher, Themes, React, Webpack } from "betterdiscord";
import SwatchLauncher from "./components/SwatchLauncher";
export { ModalAPI } from "../../common";

export { useStateFromStores, UserStore, openModal, CustomColorPicker, FluxDispatcher, Toasts, FocusLock, Popout, hljs, ThemeStore, Forms } from "../../common";

export const getThemesList = async () => Themes.getAll();
export const getThemeData = async (themeName: string) => Themes.getAll().find(theme => theme.filename === themeName).CSS;

let DiscordThemeSelector: any;

export const ContextMenuApi = {
    ...ContextMenu,
    closeContextMenu() {
        this.close();
    },
    openContextMenu(event: React.MouseEvent, menuComponent: React.ComponentType<any>, config?: {
        position?: "right" | "left";
        align?: "top" | "bottom";
        onClose?: (...args: any) => void;
        noBlurEvent?: boolean;
    }) {
        this.open(event, menuComponent, config);
    }
};

export const { useState, useEffect, useRef, useReducer, useCallback } = React;

export default class DiscordColorways {
    ProjectColorway = API
    load() {
        DiscordThemeSelector = Webpack.getByKeys("Basic");
    }
    start() {
        Patcher.after(DiscordThemeSelector, "Basic", (_, props, child) => {
            const oldChild = child.props.children;
            child.props.children = [oldChild, <SwatchLauncher/>]
        })

        // DC-Specific
        Discord.start();
    }
    stop() {
        Patcher.unpatchAll();

        Discord.stop();
    }
};
