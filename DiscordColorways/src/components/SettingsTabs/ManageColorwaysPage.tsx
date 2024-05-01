import { Data } from "betterdiscord";
import { Button, Card, Flex, Forms, SettingsTab, Text } from "../../common";
import { type Colorway } from "../../../../global";
import { defaultColorwaySource } from "../../constants";
import { generateCss } from "../../css";
import { DiscordNative, colorToHex } from "../../../../common";

export default function () {
    return <SettingsTab title="Manage Colorways">
        <Forms.FormSection title="Import/Export">
            <Card className="dc-warning-card">
                <Flex flexDirection="column">
                    <strong>Warning</strong>
                    <span>Importing a colorways file will overwrite your current custom colorways.</span>
                </Flex>
            </Card>
            <Text variant="text-md/normal" style={{ marginBottom: "8px" }}>
                You can import and export your custom colorways as a JSON file.
                This allows you to easily transfer them to another device/installation.
            </Text>
            <Flex>
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={async () => {
                        const data = await DiscordNative.fileManager.openFiles({
                            filters: [
                                { name: "Discord Colorways List", extensions: ["json"] },
                                { name: "all", extensions: ["*"] }
                            ]
                        });
                        const file = data.file;
                        if (file) {
                            try {
                                Data.save("custom_colorways", JSON.parse(new TextDecoder().decode(file.data)));
                            } catch (err) {
                                throw new Error(`(DiscordColorways) ${err}`);
                            }
                        }
                    }}>
                    Import Colorways
                </Button>
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={() => DiscordNative.fileManager.saveWithDialog(JSON.stringify(Data.load("custom_colorways") as string), "colorways.json")}>
                    Export Colorways
                </Button>
            </Flex>
        </Forms.FormSection>
        <Forms.FormDivider style={{ marginTop: "8px", marginBottom: "8px" }} />
        <Forms.FormSection title="Transfer 3rd Party Colorways to local index (3rd-Party > Custom):">
            <Flex>
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={async () => {
                        const responses: Response[] = await Promise.all(
                            Data.load("settings").colorwayLists.map((url: string) =>
                                fetch(url)
                            )
                        );
                        const data = await Promise.all(
                            responses.map((res: Response) =>
                                res.json().then(dt => { return { colorways: dt.colorways, url: res.url }; }).catch(() => { return { colorways: [], url: res.url }; })
                            ));
                        const thirdPartyColorwaysArr: Colorway[] = data.flatMap(json => json.url !== defaultColorwaySource ? json.colorways : []);
                        Data.save("custom_colorways", [...Data.load("custom_colorways"), ...thirdPartyColorwaysArr.map(({ name: nameOld, ...rest }) => ({ name: (nameOld + " (Custom)"), ...rest }))]);
                    }}>
                    As-Is
                </Button>
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={async () => {
                        const responses: Response[] = await Promise.all(
                            Data.load("settings").colorwayLists.map((url: string) =>
                                fetch(url)
                            )
                        );
                        const data = await Promise.all(
                            responses.map((res: Response) =>
                                res.json().then(dt => { return { colorways: dt.colorways, url: res.url }; }).catch(() => { return { colorways: [], url: res.url }; })
                            ));
                        const thirdPartyColorwaysArr: Colorway[] = data.flatMap(json => json.url !== defaultColorwaySource ? json.colorways : []);
                        Data.save("custom_colorways", [...Data.load("custom_colorways"), ...thirdPartyColorwaysArr.map(({ name: nameOld, "dc-import": oldImport, ...rest }) => ({ name: (nameOld + " (Custom)"), "dc-import": generateCss(colorToHex(rest.primary) || "313338", colorToHex(rest.secondary) || "2b2d31", colorToHex(rest.tertiary) || "1e1f22", colorToHex(rest.accent) || "5865f2", true, true), ...rest }))]);
                    }}>
                    With Updated CSS
                </Button>
            </Flex>
        </Forms.FormSection>
    </SettingsTab>;
}
