import { ColorwayCSS, colorToHex, proxyLazy, Button, ButtonLooks, Flex, Forms, Menu, Modals, Popout, ScrollerThin, Select, SettingsRouter, SettingsTab, TextInput, Tooltip } from "../../../common";
import { defaultColorwaySource, fallbackColorways } from "../constants";
import { generateCss, getAutoPresets, gradientBase } from "../css";
import type { Colorway, ModalProps } from "../../../global";
import ColorPickerModal from "./ColorPicker";
import CreatorModal from "./CreatorModal";
import ColorwayInfoModal from "./InfoModal";
import { useCallback, useEffect, useState } from "react";
import { Data, Webpack } from "betterdiscord";
import { CloseIcon } from "./Icons";
import AutoColorwaySelector from "./AutoColorwaySelector";

const { SelectionCircle } = proxyLazy(() => Webpack.getByKeys("SelectionCircle"));

function SelectorContainer({ children, isSettings, modalProps }: { children: React.ReactNode, isSettings?: boolean, modalProps: ModalProps; }) {
    if (!isSettings) {
        return <Modals.ModalRoot {...modalProps} className="colorwaySelectorModal">
            {children}
        </Modals.ModalRoot>;
    } else {
        return <SettingsTab title="Colors">
            <div className="colorwaysSettingsSelector-wrapper">
                {children}
            </div>
        </SettingsTab>;
    }
}

function SelectorHeader({ children, isSettings }: { children: React.ReactNode, isSettings?: boolean; }) {
    if (!isSettings) {
        return <Modals.ModalHeader className="colorwaySelectorModal-header">
            {children}
        </Modals.ModalHeader>;
    } else {
        return <Flex style={{ gap: "0" }}>
            {children}
        </Flex>;
    }
}

function SelectorContent({ children, isSettings }: { children: React.ReactNode, isSettings?: boolean; }) {
    if (!isSettings) {
        return <Modals.ModalContent className="colorwaySelectorModalContent">{children}</Modals.ModalContent>;
    } else {
        return <>{children}</>;
    }
}

export default function ({
    modalProps,
    isSettings
}: {
    modalProps: ModalProps,
    isSettings?: boolean
}): JSX.Element | any {
    const [currentColorway, setCurrentColorway] = useState<string>("");
    const [colorways, setColorways] = useState<Colorway[]>([]);
    const [thirdPartyColorways, setThirdPartyColorways] = useState<Colorway[]>([]);
    const [customColorways, setCustomColorways] = useState<Colorway[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [loaderHeight, setLoaderHeight] = useState<string>("2px");
    const [visibility, setVisibility] = useState<string>("all");
    const [showReloadMenu, setShowReloadMenu] = useState(false);
    let visibleColorwayArray: Colorway[];

    switch (visibility) {
        case "all":
            visibleColorwayArray = [...colorways, ...thirdPartyColorways, ...customColorways];
            break;
        case "official":
            visibleColorwayArray = [...colorways];
            break;
        case "3rdparty":
            visibleColorwayArray = [...thirdPartyColorways];
            break;
        case "custom":
            visibleColorwayArray = [...customColorways];
            break;
        default:
            visibleColorwayArray = [...colorways, ...thirdPartyColorways, ...customColorways];
            break;
    }

    async function loadUI(disableCache = false) {
        const responses: Response[] = await Promise.all(
            Data.load("settings").colorwayLists.map((url: string) =>
                fetch(url, (disableCache ? { cache: "no-store" }:{}))
            )
        );
        const data = await Promise.all(
            responses.map((res: Response) =>
                res.json().then(dt => { return { colorways: dt.colorways, url: res.url }; }).catch(() => { return { colorways: [], url: res.url }; })
            ));
        const colorways = data.flatMap((json) => json.url === defaultColorwaySource ? json.colorways : []);
        const thirdPartyColorwaysArr = data.flatMap((json) => json.url !== defaultColorwaySource ? json.colorways : []);
        setColorways(colorways || fallbackColorways);
        setThirdPartyColorways(thirdPartyColorwaysArr);
        setCustomColorways(Data.load("custom_colorways"));
        setCurrentColorway(Data.load("settings").activeColorwayID);
    }

    const cached_loadUI = useCallback(loadUI, [setColorways]);

    async function searchColorways(e: string) {
        if (!e) {
            cached_loadUI();
            return;
        }
        const data = await Promise.all(
            Data.load("settings").colorwayLists.map((url: string) =>
                fetch(url).then((res) => res.json().then(dt => { return { colorways: dt.colorways, url: res.url }; }).catch(() => { return { colorways: [], url: res.url }; }))
            )
        );
        const colorways = data.flatMap((json) => json.url === defaultColorwaySource ? json.colorways : []);
        const thirdPartyColorwaysArr = data.flatMap((json) => json.url !== defaultColorwaySource ? json.colorways : []);
        var results: Colorway[] = [];
        (colorways || fallbackColorways).find((Colorway: Colorway) => {
            if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                results.push(Colorway);
        });
        var thirdPartyResults: Colorway[] = [];
        (thirdPartyColorwaysArr).find((Colorway: Colorway) => {
            if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                thirdPartyResults.push(Colorway);
        });
        var customResults: Colorway[] = [];
        Data.load("custom_colorways").find((Colorway: Colorway) => {
            if (Colorway.name.toLowerCase().includes(e.toLowerCase()))
                customResults.push(Colorway);
        });
        setColorways(results);
        setThirdPartyColorways(thirdPartyResults);
        setCustomColorways(customResults);
    }

    useEffect(() => {
        if (!searchString) {
            cached_loadUI();
        }
        setLoaderHeight("0px");
    }, [searchString]);

    function ReloadPopout(onClose: () => void) {
        return (
            <Menu.Menu navId="dc-reload-menu" onClose={onClose} >
                <Menu.MenuItem
                    id="dc-force-reload"
                    label="Force Reload"
                    action={() => {
                        setLoaderHeight("2px");
                        cached_loadUI(true).then(() => setLoaderHeight("0px"));
                    }}
                />
            </Menu.Menu>
        );
    }

    return (
        <SelectorContainer modalProps={modalProps} isSettings={isSettings}>
            <SelectorHeader isSettings={isSettings}>
                <TextInput
                    className="colorwaySelector-search"
                    placeholder="Search for Colorways..."
                    value={searchString}
                    onChange={(e: string) => [searchColorways, setSearchString].forEach(t => t(e))}
                />
                <Tooltip text="Refresh Colorways...">
                    {({ onMouseEnter, onMouseLeave }) => {
                        return <Popout
                            position="bottom"
                            align="right"
                            animation={Popout.Animation.NONE}
                            shouldShow={showReloadMenu}
                            onRequestClose={() => setShowReloadMenu(false)}
                            renderPopout={() => ReloadPopout(() => setShowReloadMenu(false))}
                        >
                            {(_: any, { isShown }: any) => (
                                <Button
                                    innerClassName="colorwaysSettings-iconButtonInner"
                                    size={Button.Sizes.ICON}
                                    color={Button.Colors.PRIMARY}
                                    look={Button.Looks.OUTLINED}
                                    style={{ marginLeft: "8px" }}
                                    id="colorway-refreshcolorway"
                                    onMouseEnter={isShown ? () => { } : onMouseEnter}
                                    onMouseLeave={isShown ? () => { } : onMouseLeave}
                                    onClick={() => {
                                        setLoaderHeight("2px");
                                        cached_loadUI().then(() => setLoaderHeight("0px"));
                                    }}
                                    onContextMenu={() => { onMouseLeave(); setShowReloadMenu(v => !v); }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="20"
                                        height="20"
                                        style={{ padding: "6px", boxSizing: "content-box" }}
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <rect
                                            y="0"
                                            fill="none"
                                            width="24"
                                            height="24"
                                        />
                                        <path d="M6.351,6.351C7.824,4.871,9.828,4,12,4c4.411,0,8,3.589,8,8h2c0-5.515-4.486-10-10-10 C9.285,2,6.779,3.089,4.938,4.938L3,3v6h6L6.351,6.351z" />
                                        <path d="M17.649,17.649C16.176,19.129,14.173,20,12,20c-4.411,0-8-3.589-8-8H2c0,5.515,4.486,10,10,10 c2.716,0,5.221-1.089,7.062-2.938L21,21v-6h-6L17.649,17.649z" />
                                    </svg>
                                </Button>
                            )}
                        </Popout>;
                    }}
                </Tooltip>
                {!isSettings ? <Tooltip text="Open Settings">
                    {({ onMouseEnter, onMouseLeave }) => <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.ICON}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        style={{ marginLeft: "8px" }}
                        id="colorway-opensettings"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={() => {
                            SettingsRouter.open("ColorwaysSettings");
                            modalProps.onClose();
                        }}
                    >
                        <svg
                            aria-hidden="true"
                            role="img"
                            width="20"
                            height="20"
                            style={{ padding: "6px", boxSizing: "content-box" }}
                            viewBox="0 0 24 24"
                        >
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
                        </svg>
                    </Button>}
                </Tooltip> : <></>}
                <Tooltip text="Create Colorway...">
                    {({ onMouseEnter, onMouseLeave }) => <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.ICON}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        style={{ marginLeft: "8px" }}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={() => Modals.openModal((props: any) => <CreatorModal
                            modalProps={props}
                            loadUIProps={cached_loadUI}
                        />)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            width="20"
                            height="20"
                            style={{ padding: "6px", boxSizing: "content-box" }}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"
                            />
                        </svg>
                    </Button>}
                </Tooltip>
                <Tooltip text="Open Color Stealer">
                    {({ onMouseEnter, onMouseLeave }) => <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.ICON}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        style={{ marginLeft: "8px" }}
                        id="colorway-opencolorstealer"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={() => Modals.openModal((props: any) => <ColorPickerModal modalProps={props} />)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{ padding: "6px", boxSizing: "content-box" }} fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07zM8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                    </Button>}
                </Tooltip>
                {!isSettings ? <Tooltip text="Close">
                    {({ onMouseEnter, onMouseLeave }) => <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.ICON}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        id="colorwaySelector-pill_closeSelector"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={() => modalProps.onClose()}
                    >
                        <CloseIcon style={{ padding: "6px", boxSizing: "content-box" }} width={20} height={20} />
                    </Button>}
                </Tooltip> : <></>}
            </SelectorHeader>
            <SelectorContent isSettings={isSettings}>
                <div className="colorwaysLoader-barContainer"><div className="colorwaysLoader-bar" style={{ height: loaderHeight }} /></div>
                <ScrollerThin style={{ maxHeight: "450px" }} className="ColorwaySelectorWrapper">
                    {getComputedStyle(document.body).getPropertyValue("--os-accent-color") ? <Tooltip text="Auto">
                        {({ onMouseEnter, onMouseLeave }) => <div
                            className="discordColorway"
                            id="colorway-Auto"
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onClick={() => {
                                if (currentColorway === "Auto") {
                                    Data.save("settings", { ...Data.load("settings"), activeColorway: null })
                                    Data.save("settings", { ...Data.load("settings"), activeColorwayID: null })
                                    setCurrentColorway("");
                                    ColorwayCSS.remove();
                                } else {
                                    if(!Data.load("settings").activeAutoPreset) {
                                        Modals.openModal((props: ModalProps) => <AutoColorwaySelector modalProps={props} onChange={autoPresetId => {
                                            const demandedColorway = getAutoPresets(colorToHex(getComputedStyle(document.body).getPropertyValue("--os-accent-color")))[autoPresetId].preset();
                                            Data.save("settings", { ...Data.load("settings"), activeColorway: demandedColorway, activeColorwayID: "Auto" })
                                            ColorwayCSS.set(demandedColorway);
                                            setCurrentColorway("Auto");
                                        }}/>)
                                    } else {
                                        const demandedColorway = getAutoPresets(colorToHex(getComputedStyle(document.body).getPropertyValue("--os-accent-color")))[Data.load("settings").activeAutoPreset].preset();
                                        Data.save("settings", { ...Data.load("settings"), activeColorway: demandedColorway, activeColorwayID: "Auto" })
                                        ColorwayCSS.set(demandedColorway);
                                        setCurrentColorway("Auto");
                                    }
                                }
                            }}
                        >
                            <div
                                className="colorwayInfoIconContainer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Modals.openModal((props: ModalProps) => <AutoColorwaySelector modalProps={props} onChange={autoPresetId => {
                                        if(currentColorway === "Auto") {
                                            const demandedColorway = getAutoPresets(colorToHex(getComputedStyle(document.body).getPropertyValue("--os-accent-color")))[autoPresetId].preset();
                                            Data.save("settings", { ...Data.load("settings"), activeColorway: demandedColorway });
                                            ColorwayCSS.set(demandedColorway);
                                            setCurrentColorway("Auto");
                                        }
                                    }}/>)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" style={{ margin: "4px" }} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M 21.2856,9.6 H 24 v 4.8 H 21.2868 C 20.9976,15.5172 20.52,16.5576 19.878,17.4768 L 21.6,19.2 19.2,21.6 17.478,19.8768 c -0.9216,0.642 -1.9596,1.1208 -3.078,1.4088 V 24 H 9.6 V 21.2856 C 8.4828,20.9976 7.4436,20.5188 6.5232,19.8768 L 4.8,21.6 2.4,19.2 4.1232,17.4768 C 3.4812,16.5588 3.0024,15.5184 2.7144,14.4 H 0 V 9.6 H 2.7144 C 3.0024,8.4816 3.48,7.4424 4.1232,6.5232 L 2.4,4.8 4.8,2.4 6.5232,4.1232 C 7.4424,3.48 8.4816,3.0024 9.6,2.7144 V 0 h 4.8 v 2.7132 c 1.1184,0.2892 2.1564,0.7668 3.078,1.4088 l 1.722,-1.7232 2.4,2.4 -1.7232,1.7244 c 0.642,0.9192 1.1208,1.9596 1.4088,3.0768 z M 12,16.8 c 2.65092,0 4.8,-2.14908 4.8,-4.8 0,-2.650968 -2.14908,-4.8 -4.8,-4.8 -2.650968,0 -4.8,2.149032 -4.8,4.8 0,2.65092 2.149032,4.8 4.8,4.8 z"/>
                                </svg>
                            </div>
                            <div className="discordColorwayPreviewColorContainer" style={{ backgroundColor: "var(--os-accent-color)" }} />
                            {currentColorway === "Auto" && <SelectionCircle />}
                        </div>}
                    </Tooltip> : <></>}
                    {visibleColorwayArray.length === 0 && !getComputedStyle(document.body).getPropertyValue("--os-accent-color") ?
                        <Forms.FormTitle
                            style={{
                                marginBottom: 0,
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            No colorways...
                        </Forms.FormTitle> : <></>
                    }
                    {["all", "official", "3rdparty", "custom"].includes(visibility) && (
                        visibleColorwayArray.map((color: Colorway, ind: number) => {
                            var colors: Array<string> = color.colors || [
                                "accent",
                                "primary",
                                "secondary",
                                "tertiary",
                            ];
                            return (
                                <Tooltip text={color.name}>
                                    {({ onMouseEnter, onMouseLeave }) => <div
                                        className="discordColorway"
                                        id={"colorway-" + color.name}
                                        data-last-official={ind + 1 === colorways.length}
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                        onClick={() => {
                                            if (currentColorway === color.name) {
                                                Data.save("settings", { ...Data.load("settings"), activeColorway: null })
                                                Data.save("settings", { ...Data.load("settings"), activeColorwayID: null })
                                                setCurrentColorway("");
                                                ColorwayCSS.remove();
                                            } else {
                                                Data.save("settings", { ...Data.load("settings"), activeColorwayColors: color.colors })
                                                Data.save("settings", { ...Data.load("settings"), activeColorwayID: color.name })
                                                setCurrentColorway(color.name);
                                                if (Data.load("settings").onDemandWays) {
                                                    const demandedColorway = !color.isGradient ? generateCss(
                                                        colorToHex(color.primary),
                                                        colorToHex(color.secondary),
                                                        colorToHex(color.tertiary),
                                                        colorToHex(Data.load("settings").onDemandWaysOsAccentColor ? getComputedStyle(document.body).getPropertyValue("--os-accent-color") : color.accent),
                                                        Data.load("settings").onDemandWaysTintedText,
                                                        Data.load("settings").onDemandWaysDiscordSaturation
                                                    ) : gradientBase(colorToHex(Data.load("settings").onDemandWaysOsAccentColor ? getComputedStyle(document.body).getPropertyValue("--os-accent-color") : color.accent), Data.load("settings").onDemandWaysDiscordSaturation) + `:root:root {--custom-theme-background: linear-gradient(${color.linearGradient})}`;
                                                    Data.save("settings", { ...Data.load("settings"), activeColorway: demandedColorway })
                                                    ColorwayCSS.set(demandedColorway);
                                                } else {
                                                    Data.save("settings", { ...Data.load("settings"), activeColorway: color["dc-import"] })
                                                    ColorwayCSS.set(color["dc-import"]);
                                                }
                                            }
                                        }}
                                    >
                                        <div
                                            className="colorwayInfoIconContainer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                Modals.openModal((props: any) => <ColorwayInfoModal
                                                    modalProps={props}
                                                    colorwayProps={color}
                                                    discrimProps={customColorways.includes(color)}
                                                    loadUIProps={cached_loadUI}
                                                />)
                                            }}
                                        >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                </svg>
                                        </div>
                                        <div className="discordColorwayPreviewColorContainer">
                                            {!color.isGradient ? colors.map((colorItm) => <div
                                                className="discordColorwayPreviewColor"
                                                style={{
                                                    backgroundColor: color[colorItm],
                                                }}
                                            />) : <div
                                                className="discordColorwayPreviewColor"
                                                style={{
                                                    background: `linear-gradient(${color.linearGradient})`,
                                                }}
                                            />}
                                        </div>
                                        {currentColorway === color.name && <SelectionCircle/>}
                                    </div>}
                                </Tooltip>
                            );
                        })
                    )}
                </ScrollerThin>
            </SelectorContent >
            {!isSettings ? <Modals.ModalFooter>
                <Button
                    size={Button.Sizes.MEDIUM}
                    color={Button.Colors.PRIMARY}
                    look={Button.Looks.OUTLINED}
                    style={{ marginLeft: "8px" }}
                    onClick={() => {
                        SettingsRouter.open("ColorwaysSettings");
                        modalProps.onClose();
                    }}
                >
                    Settings
                </Button>
                <Button
                    size={Button.Sizes.MEDIUM}
                    color={Button.Colors.PRIMARY}
                    look={Button.Looks.OUTLINED}
                    onClick={() => modalProps.onClose()}
                >
                    Close
                </Button>
                <Select className={"colorwaySelector-sources " + ButtonLooks.OUTLINED} look={1} popoutClassName="colorwaySelector-sourceSelect" options={[{
                    value: "all",
                    label: "All"
                },
                {
                    value: "official",
                    label: "Official"
                },
                {
                    value: "3rdparty",
                    label: "3rd-Party"
                },
                {
                    value: "custom",
                    label: "Custom"
                }]} select={value => {
                    setVisibility(value);
                }} isSelected={value => visibility === value} serialize={String} popoutPosition="top" />
            </Modals.ModalFooter> : <></>}
        </SelectorContainer >
    );
}
