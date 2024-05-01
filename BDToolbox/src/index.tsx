import { Patcher, Plugins, Webpack } from "betterdiscord";
import { useState } from "react"
import { Menu, Popout } from "./common";
import { findExportedComponentLazy } from "../../common";

const InboxButton = Webpack.getByStrings("useInDesktopNotificationCenterExperiment", { defaultExport: false });

const { icon: IconClass } = Webpack.getByKeys("iconWrapper", "icon", "clickable")

const HeaderBarIcon = findExportedComponentLazy("Icon", "Divider");

function BetterDiscordToolbox(onClose: () => void) {
    const pluginEntries = [] as React.ReactNode[];

    for (const plugin of Object.values(Plugins.getAll())) {
        if (plugin.exports.prototype.getToolboxActions && Plugins.isEnabled(plugin.name)) {
            pluginEntries.push(
                <Menu.MenuGroup
                    label={plugin.name}
                    key={`bd-toolbox-${plugin.name}`}
                >
                    {Object.entries(plugin.exports.prototype.getToolboxActions()).map(([text, action]) => {
                        const key = `bd-toolbox-${plugin.name}-${text}`;

                        return (
                            <Menu.MenuItem
                                id={key}
                                key={key}
                                label={text}
                                action={action}
                            />
                        );
                    })}
                </Menu.MenuGroup>
            );
        }
    }

    return (
        <Menu.Menu
            navId="bd-toolbox"
            onClose={onClose}
        >
            {...pluginEntries}
        </Menu.Menu>
    );
}

function BetterDiscordToolboxButton() {
    const [show, setShow] = useState(false);

    return (
        <Popout
            position="bottom"
            align="right"
            animation={Popout.Animation.NONE}
            shouldShow={show}
            onRequestClose={() => setShow(false)}
            renderPopout={() => BetterDiscordToolbox(() => setShow(false))}
        >
            {(_, { isShown }) => (
                <HeaderBarIcon
                    className="bd-toolbox-btn"
                    onClick={() => setShow(v => !v)}
                    tooltip={isShown ? null : "BetterDiscord Toolbox"}
                    icon={() => <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 2000 2000" className={IconClass} width={24} height={24}>
                        <g>
                            <path fill="currentColor" d="M1402.2,631.7c-9.7-353.4-286.2-496-642.6-496H68.4v714.1l442,398V490.7h257c274.5,0,274.5,344.9,0,344.9H597.6v329.5h169.8c274.5,0,274.5,344.8,0,344.8h-699v354.9h691.2c356.3,0,632.8-142.6,642.6-496c0-162.6-44.5-284.1-122.9-368.6C1357.7,915.8,1402.2,794.3,1402.2,631.7z"/>
                            <path fill="currentColor" d="M1262.5,135.2L1262.5,135.2l-76.8,0c26.6,13.3,51.7,28.1,75,44.3c70.7,49.1,126.1,111.5,164.6,185.3c39.9,76.6,61.5,165.6,64.3,264.6l0,1.2v1.2c0,141.1,0,596.1,0,737.1v1.2l0,1.2c-2.7,99-24.3,188-64.3,264.6c-38.5,73.8-93.8,136.2-164.6,185.3c-22.6,15.7-46.9,30.1-72.6,43.1h72.5c346.2,1.9,671-171.2,671-567.9V716.7C1933.5,312.2,1608.7,135.2,1262.5,135.2z"/>
                        </g>
                    </svg>}
                    selected={isShown}
                />
            )}
        </Popout>
    );
}


export default class BDToolbox {
    start() {
        Patcher.after(
            InboxButton,
            "default",
            (cancel: any, result: any, returnValue: any[]) => {
                return [returnValue, <BetterDiscordToolboxButton/>];
            }
        )
    }
    stop() {
        Patcher.unpatchAll();
    }
}