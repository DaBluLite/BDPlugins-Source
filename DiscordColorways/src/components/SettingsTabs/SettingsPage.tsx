import { defaultColorwaySource, fallbackColorways, knownColorwaySources } from "../../constants";
import type { Colorway, FluxEvents } from "../../../../global";
import { useState, useEffect } from "react";
import { Data } from "betterdiscord";
import { Button, Flex, FluxDispatcher, Forms, Modals, SettingsTab, Switch, Text, TextInput, Clipboard, Link, ScrollerThin } from "../../common";
import { CloseIcon, CopyIcon } from "../Icons";
import plugin from "../../plugin.json"
import { radioBarItem, radioBarItemFilled } from "../../../../common";

export default function () {
    const [colorways, setColorways] = useState<Colorway[]>([]);
    const [colorwaySourceFiles, setColorwaySourceFiles] = useState<string[]>(Data.load("settings").colorwayLists);
    const [colorsButtonVisibility, setColorsButtonVisibility] = useState<boolean>(Data.load("settings").showInGuildBar);
    const [isButtonThin, setIsButtonThin] = useState<boolean>(Data.load("settings").isButtonThin);

    useEffect(() => {
        (async function() {
            const responses: Response[] = await Promise.all(
                Data.load("settings").colorwayLists.map((url: string) =>
                    fetch(url)
                )
            );
            const data = await Promise.all(
                responses.map((res: Response) =>
                    res.json().catch(() => { return { colorways: [] }; })
                ));
            const colorways = data.flatMap(json => json.colorways);
            setColorways(colorways || fallbackColorways);
        })()
    }, []);

    return <SettingsTab title="Settings">
        <div className="colorwaysSettingsPage-wrapper">
            <Flex style={{ gap: "0", marginBottom: "8px" }}>
                <Forms.FormTitle tag="h5" style={{ width: "100%", marginBottom: "0", lineHeight: "32px" }}>Sources</Forms.FormTitle>
                <Button
                    className="colorwaysSettings-colorwaySourceAction"
                    innerClassName="colorwaysSettings-iconButtonInner"
                    style={{ flexShrink: "0" }}
                    size={Button.Sizes.SMALL}
                    color={Button.Colors.TRANSPARENT}
                    onClick={() => {
                        Modals.openModal((props: any) => {
                            var colorwaySource = "";
                            return <Modals.ModalRoot {...props} className="colorwaySourceModal">
                                <Modals.ModalHeader>
                                    <Text variant="heading-lg/semibold" tag="h1">
                                        Add a source:
                                    </Text>
                                </Modals.ModalHeader>
                                <TextInput
                                    placeholder="Enter a valid URL..."
                                    onChange={e => colorwaySource = e}
                                    style={{ margin: "8px", width: "calc(100% - 16px)" }}
                                />
                                <Modals.ModalFooter>
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        color={Button.Colors.BRAND}
                                        size={Button.Sizes.MEDIUM}
                                        look={Button.Looks.FILLED}
                                        onClick={() => {
                                            var sourcesArr: string[] = [];
                                            Data.load("settings").colorwayLists.map((source: string) => sourcesArr.push(source));
                                            if (colorwaySource !== defaultColorwaySource) {
                                                sourcesArr.push(colorwaySource);
                                            }
                                            Data.save("settings", { ...Data.load("settings"), colorwayLists: sourcesArr });
                                            setColorwaySourceFiles(sourcesArr);
                                            props.onClose();
                                        }}
                                    >
                                        Finish
                                    </Button>
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        color={Button.Colors.PRIMARY}
                                        size={Button.Sizes.MEDIUM}
                                        look={Button.Looks.OUTLINED}
                                        onClick={() => props.onClose()}
                                    >
                                        Cancel
                                    </Button>
                                </Modals.ModalFooter>
                            </Modals.ModalRoot>;
                        });
                    }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"
                        />
                    </svg>
                    Add a source...
                </Button>
            </Flex>
            <ScrollerThin orientation="vertical" style={{ maxHeight: "250px" }} className="colorwaysSettings-sourceScroller">
                {getComputedStyle(document.body).getPropertyValue("--os-accent-color") ? <div className={`${radioBarItem} ${radioBarItemFilled} colorwaysSettings-colorwaySource`}>
                    <Text className="colorwaysSettings-colorwaySourceLabel">OS Accent Color <div className="colorways-badge">Built-In</div></Text>
                </div> : <></>}
                {colorwaySourceFiles?.map((colorwaySourceFile: string) => <div className={`${radioBarItem} ${radioBarItemFilled} colorwaysSettings-colorwaySource`}>
                    {knownColorwaySources.find(o => o.url === colorwaySourceFile) ? <div className="hoverRoll">
                        <Text className="colorwaysSettings-colorwaySourceLabel hoverRoll_normal">
                            {knownColorwaySources.find(o => o.url === colorwaySourceFile)!.name} {colorwaySourceFile === defaultColorwaySource && <div className="colorways-badge">DEFAULT</div>}
                        </Text>
                        <Text className="colorwaysSettings-colorwaySourceLabel hoverRoll_hovered">
                            {colorwaySourceFile}
                        </Text>
                    </div>
                        : <Text className="colorwaysSettings-colorwaySourceLabel">
                            {colorwaySourceFile}
                        </Text>}
                    {colorwaySourceFile !== defaultColorwaySource
                        && <Button
                            innerClassName="colorwaysSettings-iconButtonInner"
                            size={Button.Sizes.ICON}
                            color={Button.Colors.PRIMARY}
                            look={Button.Looks.OUTLINED}
                            onClick={async () => {
                                var sourcesArr: string[] = [];
                                Data.load("settings").colorwayLists.map((source: string) => {
                                    if (source !== colorwaySourceFile) {
                                        sourcesArr.push(source);
                                    }
                                });
                                Data.save("settings", { ...Data.load("settings"), colorwayLists: sourcesArr });
                                setColorwaySourceFiles(sourcesArr);
                            }}
                        >
                            <CloseIcon width={20} height={20} />
                        </Button>}
                    <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.ICON}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        onClick={() => { Clipboard.copy(colorwaySourceFile); }}
                    >
                        <CopyIcon width={20} height={20} />
                    </Button>
                </div>
                )}
            </ScrollerThin>
            <Forms.FormDivider style={{ margin: "20px 0" }}/>
            <Forms.FormTitle tag="h5">Quick Switch</Forms.FormTitle>
            <Switch
                value={colorsButtonVisibility}
                onChange={(v: boolean) => {
                    setColorsButtonVisibility(v);
                    Data.save("settings", { ...Data.load("settings"), showInGuildBar: v });
                    FluxDispatcher.dispatch({
                        type: "COLORWAYS_UPDATE_BUTTON_VISIBILITY" as FluxEvents,
                        isVisible: v
                    });
                }}
                note="Shows a button on the top of the servers list that opens a colorway selector modal."
            >
                Enable Quick Switch
            </Switch>
            <Switch
                value={isButtonThin}
                onChange={(v: boolean) => {
                    setIsButtonThin(v);
                    Data.save("settings", { ...Data.load("settings"), isButtonThin: v });
                    FluxDispatcher.dispatch({
                        type: "COLORWAYS_UPDATE_BUTTON_HEIGHT" as FluxEvents,
                        isTall: v
                    });
                }}
                note="Replaces the icon on the colorways launcher button with text, making it more compact."
            >
                Use thin Quick Switch button
            </Switch>
            <Flex flexDirection="column" style={{ gap: 0 }}>
                <h1 style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "24px",
                    color: "var(--header-primary)",
                    lineHeight: "31px",
                    marginBottom: "0"
                }}>
                    Discord <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "24px",
                        backgroundColor: "var(--brand-500)",
                        padding: "0 4px",
                        borderRadius: "4px"
                    }}>Colorways</span>
                </h1>
                <Text
                    variant="text-xs/normal"
                    style={{
                        color: "var(--text-normal)",
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "12px"
                    }}
                >by Project Colorway</Text>
                <Forms.FormTitle style={{ marginBottom: 0 }}>
                    Plugin Version:
                </Forms.FormTitle>
                <Text
                    variant="text-xs/normal"
                    style={{
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "8px"
                    }}
                >
                    {plugin.version}
                </Text>
                <Forms.FormTitle style={{ marginBottom: 0 }}>
                    Creator Version:
                </Forms.FormTitle>
                <Text
                    variant="text-xs/normal"
                    style={{
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "8px"
                    }}
                >
                    {plugin.creatorVersion}{" "}
                    (Stable)
                </Text>
                <Forms.FormTitle style={{ marginBottom: 0 }}>
                    Loaded Colorways:
                </Forms.FormTitle>
                <Text
                    variant="text-xs/normal"
                    style={{
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "8px"
                    }}
                >
                    {[...colorways, ...Data.load("custom_colorways")].length}
                </Text>
                <Forms.FormTitle style={{ marginBottom: 0 }}>
                    Project Repositories:
                </Forms.FormTitle>
                <Forms.FormText style={{ marginBottom: "8px" }}>
                    <Link href="https://github.com/DaBluLite/DiscordColorways">DiscordColorways</Link>
                    <br />
                    <Link href="https://github.com/DaBluLite/ProjectColorway">Project Colorway</Link>
                </Forms.FormText>
            </Flex>
        </div>
    </SettingsTab>;
}
