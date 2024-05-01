import { Data } from "betterdiscord";
import { useState } from "react";
import { SettingsTab, Switch } from "../../common";

export default function () {
    const [onDemand, setOnDemand] = useState<boolean>(Data.load("settings").onDemandWays);
    const [onDemandTinted, setOnDemandTinted] = useState<boolean>(Data.load("settings").onDemandWaysTintedText);
    const [onDemandDiscordSat, setOnDemandDiscordSat] = useState<boolean>(Data.load("settings").onDemandWaysDiscordSaturation);
    const [onDemandOsAccent, setOnDemandOsAccent] = useState<boolean>(!getComputedStyle(document.body).getPropertyValue("--os-accent-color") ? false : Data.load("settings").onDemandWaysOsAccentColor);
    return <SettingsTab title="On-Demand">
        <Switch
            value={onDemand}
            onChange={(v: boolean) => {
                setOnDemand(v);
                Data.save("settings", { ...Data.load("settings"), onDemandWays: v });
            }}
            note="Always utilise the latest of what DiscordColorways has to offer. CSS is being directly generated on the device and gets applied in the place of the normal import/CSS given by the colorway."
        >
            Enable Colorways On Demand
        </Switch>
        <Switch
            value={onDemandTinted}
            onChange={(v: boolean) => {
                setOnDemandTinted(v);
                Data.save("settings", { ...Data.load("settings"), onDemandWaysTintedText: v });
            }}
            disabled={!onDemand}
        >
            Use tinted text
        </Switch>
        <Switch
            value={onDemandDiscordSat}
            onChange={(v: boolean) => {
                setOnDemandDiscordSat(v);
                Data.save("settings", { ...Data.load("settings"), onDemandWaysDiscordSaturation: v });
            }}
            disabled={!onDemand}
        >
            Use Discord's saturation
        </Switch>
        <Switch
            hideBorder
            value={onDemandOsAccent}
            onChange={(v: boolean) => {
                setOnDemandOsAccent(v);
                Data.save("settings", { ...Data.load("settings"), onDemandWaysOsAccentColor: v });
            }}
            disabled={!onDemand || !getComputedStyle(document.body).getPropertyValue("--os-accent-color")}
        >
            Use Operating System's Accent Color
        </Switch>
    </SettingsTab>;
}
