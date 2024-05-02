import { FluxDispatcher, Modals, Text, Tooltip } from "../../../common";
import { useState } from "react";
import { Data } from "betterdiscord";
import Selector from "./Selector";
import { PalleteIcon } from "./Icons";
import type { FluxEvents } from "../../../FluxEvents";
import { getAutoPresets } from "../css";

export default function() {
    const [activeColorway, setActiveColorway] = useState<string>("None");
    const [visibility, setVisibility] = useState<boolean>(Data.load("settings").showInGuildBar);
    const [isThin, setIsThin] = useState<boolean>(Data.load("settings").isButtonThin);

    FluxDispatcher.subscribe("COLORWAYS_UPDATE_BUTTON_HEIGHT" as FluxEvents, ({ isTall }: {isTall: boolean }) => {
        setIsThin(isTall);
    });

    FluxDispatcher.subscribe("COLORWAYS_UPDATE_BUTTON_VISIBILITY" as FluxEvents, ({ isVisible }: {isVisible: boolean }) => {
        setVisibility(isVisible);
    });

    return <Tooltip text={
        <>
            {!isThin ? <>
                <span>Colorways</span>
                <Text variant="text-xs/normal" style={{ color: "var(--text-muted)", fontWeight: 500 }}>{"Active Colorway: " + activeColorway}</Text>
            </> : <span>{"Active Colorway: " + activeColorway}</span>}
            {Data.load("settings").activeColorwayID === "Auto" ? <Text variant="text-xs/normal" style={{ color: "var(--text-muted)", fontWeight: 500 }}>{"Auto Preset: " + getAutoPresets()[Data.load("settings").activeAutoPreset].name}</Text> : <></>}
        </>
    } position="right" tooltipContentClassName="colorwaysBtn-tooltipContent"
    >
        {({ onMouseEnter, onMouseLeave, onClick }) => visibility ? <div className="ColorwaySelectorBtnContainer">
            <div
                className={"ColorwaySelectorBtn" + (isThin ? " ColorwaySelectorBtn_thin" : "")}
                onMouseEnter={() => {
                    onMouseEnter();
                    setActiveColorway(Data.load("settings").activeColorwayID || "None");
                }}
                onMouseLeave={onMouseLeave}
                onClick={() => {
                    onClick();
                    Modals.openModal((props: any) => <Selector modalProps={props} />);
                }}
            >{isThin ? <Text variant="text-xs/normal" style={{ color: "var(--header-primary)", fontWeight: 700, fontSize: 9 }}>Colorways</Text> : <PalleteIcon />}</div>
        </div> : <></>}
    </Tooltip>
}
