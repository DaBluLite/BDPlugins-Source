import { Forms, Modals, TextInput, Text, ScrollerThin, Switch, Button, UserStore, ColorPicker, Flex } from "../common";
import { useState, useEffect } from "react";
import { fallbackColorways, knownThemeVars } from "../constants";
import { generateCss, getPreset, gradientPresetIds, pureGradientBase } from "../css";
import type { Colorway, ModalProps } from "../../../global";
import { getHex, hexToString } from "../utils";
import ConflictingColorsModal from "./ConflictingColorsModal";
import ThemePreviewCategory from "./ThemePreview";
import { Data } from "betterdiscord";
import { colorToHex } from "../../../common";
import InputColorwayIdModal from "./InputColorwayIdModal";
import ColorwayCreatorSettingsModal from "./ColorwayCreatorSettingsModal";
export default function ({
    modalProps,
    loadUIProps,
    colorwayID
}: {
    modalProps: any;
    loadUIProps?: () => Promise<void>;
    colorwayID?: string;
}) {
    const [accentColor, setAccentColor] = useState<string>("5865f2");
    const [primaryColor, setPrimaryColor] = useState<string>("313338");
    const [secondaryColor, setSecondaryColor] = useState<string>("2b2d31");
    const [tertiaryColor, setTertiaryColor] = useState<string>("1e1f22");
    const [colorwayName, setColorwayName] = useState<string>("");
    const [tintedText, setTintedText] = useState<boolean>(true);
    const [discordSaturation, setDiscordSaturation] = useState<boolean>(true);
    const [preset, setPreset] = useState<string>("default");
    const [presetColorArray, setPresetColorArray] = useState<string[]>(["accent", "primary", "secondary", "tertiary"]);
    const [nameError, setNameError] = useState<string>();
    const [colorwayNames, setColorwayNames] = useState<string[]>(["Auto", ...Data.load("custom_colorways").map((color: Colorway) => color.name)]);

    const colorProps: { [key: string]: { get: string, set: React.Dispatch<React.SetStateAction<string>>, name: string } } = {
        accent: {
            get: accentColor,
            set: setAccentColor,
            name: "Accent"
        },
        primary: {
            get: primaryColor,
            set: setPrimaryColor,
            name: "Primary"
        },
        secondary: {
            get: secondaryColor,
            set: setSecondaryColor,
            name: "Secondary"
        },
        tertiary: {
            get: tertiaryColor,
            set: setTertiaryColor,
            name: "Tertiary"
        }
    };

    useEffect(() => {
        const parsedID = colorwayID?.split("colorway:")[1];
        if (parsedID) {
            if (!parsedID) {
                throw new Error("Please enter a Colorway ID");
            } else if (!hexToString(parsedID).includes(",")) {
                throw new Error("Invalid Colorway ID");
            } else {
                const setColor = [
                    setAccentColor,
                    setPrimaryColor,
                    setSecondaryColor,
                    setTertiaryColor
                ];
                hexToString(parsedID).split(/,#/).forEach((color: string, i: number) => setColor[i](colorToHex(color)));
            }
        }
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
            setColorwayNames([...colorwayNames, ...(colorways || fallbackColorways).map((color: Colorway) => color.name)]);
        })()
    });
    const colorPickerProps = {
        suggestedColors: [
            "#313338",
            "#2b2d31",
            "#1e1f22",
            "#5865f2",
        ],
        showEyeDropper: true
    };

    return (
        <Modals.ModalRoot {...modalProps} className="colorwayCreator-modal">
            <Modals.ModalHeader>
                <Text variant="heading-lg/semibold" tag="h1">
                    Create Colorway
                </Text>
            </Modals.ModalHeader>
            <Modals.ModalContent className="colorwayCreator-menuWrapper">
                <Forms.FormTitle style={{ marginBottom: 0 }}>
                    Name:
                </Forms.FormTitle>
                <TextInput
                    placeholder="Give your Colorway a name"
                    value={colorwayName}
                    onChange={setColorwayName}
                    error={nameError}
                />
                <div className="colorwaysCreator-settingCat">
                    <Forms.FormTitle style={{ marginBottom: "0" }}>
                        Colors:
                    </Forms.FormTitle>
                    <div className="colorwayCreator-colorPreviews">
                        {presetColorArray.map(presetColor => {
                            return <ColorPicker
                                label={<Text className="colorwaysPicker-colorLabel">{colorProps[presetColor].name}</Text>}
                                color={parseInt(colorProps[presetColor].get, 16)}
                                onChange={(color: number) => {
                                    let hexColor = color.toString(16);
                                    while (hexColor.length < 6) {
                                        hexColor = "0" + hexColor;
                                    }
                                    colorProps[presetColor].set(hexColor);
                                }}
                                {...colorPickerProps}
                            />;
                        })}
                    </div>
                </div>
                <div
                    className="colorwaysCreator-setting"
                    onClick={() => Modals.openModal((props: ModalProps) => <ColorwayCreatorSettingsModal
                        modalProps={props}
                        hasDiscordSaturation={discordSaturation}
                        hasTintedText={tintedText}
                        presetId={preset}
                        onSettings={({ presetId, tintedText, discordSaturation }) => {
                            setPreset(presetId);
                            setPresetColorArray(getPreset()[presetId].colors);
                            setDiscordSaturation(discordSaturation);
                            setTintedText(tintedText);
                        }} />)}>
                    <Forms.FormTitle style={{ marginBottom: 0 }}>Settings & Presets</Forms.FormTitle>
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="img" style={{ rotate: "-90deg" }}>
                        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 10L12 15 17 10" aria-hidden="true" />
                    </svg>
                </div>
                <ThemePreviewCategory
                    accent={"#" + accentColor}
                    primary={"#" + primaryColor}
                    secondary={"#" + secondaryColor}
                    tertiary={"#" + tertiaryColor}
                    previewCSS={gradientPresetIds.includes(getPreset()[preset].id) ? pureGradientBase + `.colorwaysPreview-modal,.colorwaysPreview-wrapper {--gradient-theme-bg: linear-gradient(${(getPreset(
                        primaryColor,
                        secondaryColor,
                        tertiaryColor,
                        accentColor
                    )[preset].preset(discordSaturation) as { full: string, base: string }).base})}` : ""}
                />
            </Modals.ModalContent>
            <Modals.ModalFooter>
                <Button
                    style={{ marginLeft: 8 }}
                    color={Button.Colors.BRAND}
                    size={Button.Sizes.MEDIUM}
                    look={Button.Looks.FILLED}
                    onClick={e => {
                        setNameError("");
                        if(colorwayNames.includes(colorwayName)) {
                            return setNameError("Error: A colorway with that name already exists");
                        }
                        var customColorwayCSS: string = "";
                        if (preset === "default") {
                            customColorwayCSS = generateCss(
                                primaryColor,
                                secondaryColor,
                                tertiaryColor,
                                accentColor,
                                tintedText,
                                discordSaturation
                            );
                        } else {
                            (gradientPresetIds.includes(getPreset()[preset].id)) ?
                                customColorwayCSS = (getPreset(
                                    primaryColor,
                                    secondaryColor,
                                    tertiaryColor,
                                    accentColor
                                )[preset].preset(discordSaturation) as { full: string, base: string }).full : customColorwayCSS = getPreset(
                                    primaryColor,
                                    secondaryColor,
                                    tertiaryColor,
                                    accentColor
                                )[preset].preset(discordSaturation) as string;
                        }
                        const customColorway: Colorway = {
                            name: (colorwayName || "Colorway") + (preset === "default" ? "" : ": Made for " + getPreset()[preset].name),
                            "dc-import": customColorwayCSS,
                            accent: "#" + accentColor,
                            primary: "#" + primaryColor,
                            secondary: "#" + secondaryColor,
                            tertiary: "#" + tertiaryColor,
                            colors: presetColorArray,
                            author: UserStore.getCurrentUser().username,
                            authorID: UserStore.getCurrentUser().id,
                            isGradient: gradientPresetIds.includes(getPreset()[preset].id),
                            linearGradient: gradientPresetIds.includes(getPreset()[preset].id) ? (getPreset(
                                primaryColor,
                                secondaryColor,
                                tertiaryColor,
                                accentColor
                            )[preset].preset(discordSaturation) as { full: string, base: string }).base : ""
                        };
                        const customColorwaysArray: Colorway[] = [customColorway];
                        Data.load("custom_colorways").forEach(
                            (color: Colorway) => {
                                if (color.name !== customColorway.name) {
                                    customColorwaysArray.push(color);
                                }
                            }
                        );
                        Data.save("custom_colorways", customColorwaysArray);
                        modalProps.onClose();
                        loadUIProps!();
                    }}
                >Finish</Button>
                <Button
                    style={{ marginLeft: 8 }}
                    color={Button.Colors.PRIMARY}
                    size={Button.Sizes.MEDIUM}
                    look={Button.Looks.OUTLINED}
                    onClick={() => {
                        function setAllColors({ accent, primary, secondary, tertiary }: { accent: string, primary: string, secondary: string, tertiary: string; }) {
                            setAccentColor(accent.split("#")[1]);
                            setPrimaryColor(primary.split("#")[1]);
                            setSecondaryColor(secondary.split("#")[1]);
                            setTertiaryColor(tertiary.split("#")[1]);
                        }
                        var copiedThemes = ["Discord"];
                        Object.values(knownThemeVars).map((theme: { variable: string; variableType?: string; }, i: number) => {
                            if (getComputedStyle(document.body).getPropertyValue(theme.variable)) {
                                copiedThemes.push(Object.keys(knownThemeVars)[i]);
                            }
                        });
                        if (copiedThemes.length > 1) {
                            Modals.openModal((props: any) => <ConflictingColorsModal modalProps={props} onFinished={setAllColors} />);
                        } else {
                            setPrimaryColor(
                                getHex(
                                    getComputedStyle(
                                        document.body
                                    ).getPropertyValue("--background-primary")
                                ).split("#")[1]
                            );
                            setSecondaryColor(
                                getHex(
                                    getComputedStyle(
                                        document.body
                                    ).getPropertyValue("--background-secondary")
                                ).split("#")[1]
                            );
                            setTertiaryColor(
                                getHex(
                                    getComputedStyle(
                                        document.body
                                    ).getPropertyValue("--background-tertiary")
                                ).split("#")[1]
                            );
                            setAccentColor(
                                getHex(
                                    getComputedStyle(
                                        document.body
                                    ).getPropertyValue("--brand-experiment")
                                ).split("#")[1]
                            );
                        }
                    }}
                >
                    Copy Current Colors
                </Button>
                <Button
                    style={{ marginLeft: 8 }}
                    color={Button.Colors.PRIMARY}
                    size={Button.Sizes.MEDIUM}
                    look={Button.Looks.OUTLINED}
                    onClick={() => Modals.openModal((props: any) => <InputColorwayIdModal modalProps={props} onColorwayId={colorwayID => {
                        const setColor = [
                            setAccentColor,
                            setPrimaryColor,
                            setSecondaryColor,
                            setTertiaryColor
                        ];
                        hexToString(colorwayID).split(/,#/).forEach((color: string, i: number) => setColor[i](colorToHex(color)));
                    }}/>)}
                >
                    Enter Colorway ID
                </Button>
                <Button
                    style={{ marginLeft: 8 }}
                    color={Button.Colors.PRIMARY}
                    size={Button.Sizes.MEDIUM}
                    look={Button.Looks.OUTLINED}
                    onClick={() => {
                        modalProps.onClose();
                    }}
                >
                    Cancel
                </Button>
            </Modals.ModalFooter>
        </Modals.ModalRoot>
    );
}
