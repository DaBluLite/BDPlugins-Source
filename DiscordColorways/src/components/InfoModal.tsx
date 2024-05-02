import { Button, Clipboard, Forms, Text, Toasts, Modals, openUserProfile, Flex } from "../common";

import { ColorwayCSS, colorToHex } from "../../../common";
import { generateCss, pureGradientBase } from "../css";
import type { Colorway } from "../../../global";
import ThemePreviewCategory from "./ThemePreview";
import { Data } from "betterdiscord";
import { useState } from "react";
import { stringToHex } from "../utils";

export default function ({
    modalProps,
    colorwayProps,
    discrimProps = false,
    loadUIProps
}: {
    modalProps: any;
    colorwayProps: Colorway;
    discrimProps?: boolean;
    loadUIProps: () => Promise<void>;
}) {
    const colors: string[] = colorwayProps.colors || [
        "accent",
        "primary",
        "secondary",
        "tertiary",
    ];
    const [collapsedCSS, setCollapsedCSS] = useState(true);
    return <Modals.ModalRoot {...modalProps} className="colorwayCreator-modal">
        <Modals.ModalHeader>
            <Text variant="heading-lg/semibold" tag="h1">
                Colorway Details: {colorwayProps.name}
            </Text>
        </Modals.ModalHeader>
        <Modals.ModalContent>
            <div className="colorwayInfo-wrapper">
                <div className="colorwayInfo-colorSwatches">
                    {colors.map(color => {
                        return (
                            <div
                                className="colorwayInfo-colorSwatch"
                                style={{
                                    backgroundColor: colorwayProps[color],
                                }}
                                onClick={() => {
                                    Clipboard.copy(colorwayProps[color]);
                                    Toasts.show({
                                        message:
                                            "Copied color successfully",
                                        type: 1,
                                        id: "copy-colorway-color-notify",
                                    });
                                }}
                            ></div>
                        );
                    })}
                </div>
                <div className="colorwayInfo-row colorwayInfo-author">
                    <Flex style={{ gap: "10px", width: "100%", alignItems: "center" }}>
                        <Forms.FormTitle style={{ marginBottom: 0, width: "100%" }}>Properties:</Forms.FormTitle>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.OUTLINED}
                            style={{ flex: "0 0 auto", maxWidth: "236px" }}
                            onClick={() => {
                                openUserProfile(colorwayProps.authorID);
                            }}
                        >
                            Author: {colorwayProps.author}
                        </Button>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.OUTLINED}
                            style={{ flex: "0 0 auto" }}
                            onClick={() => {
                                const colorwayIDArray = `${colorwayProps.accent},${colorwayProps.primary},${colorwayProps.secondary},${colorwayProps.tertiary}`;
                                const colorwayID = stringToHex(colorwayIDArray);
                                Clipboard.copy(colorwayID);
                                Toasts.show({
                                    message: "Copied Colorway ID Successfully",
                                    type: 1,
                                    id: "copy-colorway-id-notify",
                                });
                            }}
                        >
                            Copy Colorway ID
                        </Button>
                        {discrimProps && <Button
                            style={{ flex: "0 0 auto" }}
                            color={Button.Colors.RED}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.FILLED}
                            onClick={async () => {
                                const customColorwaysArray: Colorway[] = [];
                                Data.load("custom_colorways").map((color: Colorway, i: number) => {
                                    if (Data.load("custom_colorways").length > 0) {
                                        if (color.name !== colorwayProps.name) {
                                            customColorwaysArray.push(color);
                                        }
                                        if (++i === Data.load("custom_colorways").length) {
                                            Data.save("custom_colorways", customColorwaysArray);
                                        }
                                        if (Data.load("settings").activeColorwayID === colorwayProps.name) {
                                            Data.save("settings", { ...Data.load("settings"), activeColorway: null, activeColorwayID: null });
                                            ColorwayCSS.set("");
                                        }
                                        modalProps.onClose();
                                        loadUIProps();
                                    }
                                });
                            }}
                        >
                            Delete
                        </Button>}
                    </Flex>
                </div>
                <div className={"colorwayInfo-row colorwayInfo-css" + (collapsedCSS ? " colorwaysCreator-settingCat-collapsed" : "")}>
                    <Flex style={{ gap: "10px", width: "100%", alignItems: "center" }}>
                        <Forms.FormTitle style={{ marginBottom: 0, width: "100%" }}>CSS:</Forms.FormTitle>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.OUTLINED}
                            onClick={() => setCollapsedCSS(!collapsedCSS)}
                        >
                            {collapsedCSS ? "Show" : "Hide"}
                        </Button>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.OUTLINED}
                            onClick={() => {
                                Clipboard.copy(colorwayProps["dc-import"]);
                                Toasts.show({
                                    message: "Copied CSS to Clipboard",
                                    type: 1,
                                    id: "copy-colorway-css-notify",
                                });
                            }}
                        >
                            Copy
                        </Button>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.OUTLINED}
                            style={{ flex: "0 0 auto" }}
                            onClick={() => {
                                const customColorways = Data.load("custom_colorways");
                                const customColorwaysArray: Colorway[] = [];
                                customColorways.map((color: Colorway, i: number) => {
                                    if (customColorways.length > 0) {
                                        if (color.name !== (colorwayProps.name + " (Custom)") && color.name !== colorwayProps.name) {
                                            customColorwaysArray.push(color);
                                        }
                                        if (++i === customColorways.length) {
                                            const newColorway = {
                                                ...colorwayProps,
                                                name: `${colorwayProps.name} (Custom)`,
                                                "dc-import": generateCss(colorToHex(color.primary) || "313338", colorToHex(color.secondary) || "2b2d31", colorToHex(color.tertiary) || "1e1f22", colorToHex(color.accent) || "5865f2", true, true)
                                            };
                                            customColorwaysArray.push(newColorway);
                                            Data.save("custom_colorways", customColorwaysArray);
                                        }
                                        modalProps.onClose();
                                        loadUIProps();
                                    }
                                });
                            }}
                        >
                            Update
                        </Button>
                    </Flex>
                    <Text
                        variant="code"
                        selectable={true}
                        className="colorwayInfo-cssCodeblock"
                    >
                        {colorwayProps["dc-import"]}
                    </Text>
                </div>
                <ThemePreviewCategory
                    accent={colorwayProps.accent}
                    primary={colorwayProps.primary}
                    secondary={colorwayProps.secondary}
                    tertiary={colorwayProps.tertiary}
                    previewCSS={colorwayProps.isGradient ? pureGradientBase + `.colorwaysPreview-modal,.colorwaysPreview-wrapper {--gradient-theme-bg: linear-gradient(${colorwayProps.linearGradient})}` : ""}
                />
                <div style={{ width: "100%", height: "20px" }} />
            </div>
        </Modals.ModalContent>
    </Modals.ModalRoot>;
}
