import { fallbackColorways } from "../../constants";
import { useState, useEffect } from "react";
import { Data } from "betterdiscord";
import plugin from "../../plugin.json"
import { Flex, FluxDispatcher, Forms, SettingsTab, Switch, Text, Link, getSetting, saveSettings } from "../../../../common";
import type { FluxEvents } from "../../../../FluxEvents";

export default function ({ inModal }: { inModal?: boolean }) {
    const [colorways, setColorways] = useState<Colorway[]>([]);
    const [colorsButtonVisibility, setColorsButtonVisibility] = useState<boolean>(getSetting("showColorwaysButton"));
    const [isButtonThin, setIsButtonThin] = useState<boolean>(getSetting("useThinMenuButton"));
    const [showLabelsInSelectorGridView, setShowLabelsInSelectorGridView] = useState<boolean>(getSetting("showLabelsInSelectorGridView"));

    useEffect(() => {
        (async function () {
            const responses: Response[] = await Promise.all(
                getSetting("colorwayLists").map(({ url }: { url: string }) =>
                    fetch(url)
                )
            );

            const data = await Promise.all(
                responses.map((res: Response) =>
                    res.json()
                ));
            const colorways = data.flatMap(json => json.colorways);
            setColorways(colorways || fallbackColorways);
        })();
    }, []);

    return <SettingsTab title="Settings" inModal={inModal}>
        <div className="colorwaysSettingsPage-wrapper">
            <Forms.FormTitle tag="h5">Quick Switch</Forms.FormTitle>
            <Switch
                value={colorsButtonVisibility}
                onChange={(v: boolean) => {
                    setColorsButtonVisibility(v);
                    saveSettings({ showColorwaysButton: v });
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
                    saveSettings({ useThinMenuButton: v });
                    FluxDispatcher.dispatch({
                        type: "COLORWAYS_UPDATE_BUTTON_HEIGHT" as FluxEvents,
                        isTall: v
                    });
                }}
                note="Replaces the icon on the colorways launcher button with text, making it more compact."
            >
                Use thin Quick Switch button
            </Switch>
            <Forms.FormTitle tag="h5">Selector</Forms.FormTitle>
            <Switch
                value={showLabelsInSelectorGridView}
                onChange={(v: boolean) => {
                    setShowLabelsInSelectorGridView(v);
                    saveSettings({ showLabelsInSelectorGridView: v });
                }}
            >
                Show labels in Grid View
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
                    {plugin.creatorVersion}
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
                    {[...colorways, ...(Data.load("custom_colorways") as OfflineSourceObject[]).map(source => source.colorways).flat(2)].length + 1}
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
