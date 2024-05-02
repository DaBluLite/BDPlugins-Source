import type { ModalProps } from "../../../global";
import { Button, Forms, Modals, TextInput } from "../../../common";
import { useState } from "react";
import { hexToString } from "../utils";

export default function({ modalProps, onColorwayId }: { modalProps: ModalProps, onColorwayId: (colorwayID: string) => void }) {
    const [colorwayID, setColorwayID] = useState<string>("")
    return <Modals.ModalRoot {...modalProps} className="colorwaysCreator-noMinHeight">
    <Modals.ModalContent className="colorwaysCreator-noHeader colorwaysCreator-noMinHeight">
        <Forms.FormTitle>Colorway ID:</Forms.FormTitle>
        <TextInput placeholder="Enter Colorway ID" onInput={e => setColorwayID(e.currentTarget.value)} />
    </Modals.ModalContent>
    <Modals.ModalFooter>
        <Button
            style={{ marginLeft: 8 }}
            color={Button.Colors.BRAND}
            size={Button.Sizes.MEDIUM}
            look={Button.Looks.FILLED}
            onClick={() => {
                if (!colorwayID) {
                    throw new Error("Please enter a Colorway ID");
                } else if (!hexToString(colorwayID).includes(",")) {
                    throw new Error("Invalid Colorway ID");
                } else {
                    onColorwayId(colorwayID)
                    modalProps.onClose();
                }
            }}
        >
            Finish
        </Button>
        <Button
            style={{ marginLeft: 8 }}
            color={Button.Colors.PRIMARY}
            size={Button.Sizes.MEDIUM}
            look={Button.Looks.OUTLINED}
            onClick={() => modalProps.onClose()}
        >
            Cancel
        </Button>
    </Modals.ModalFooter>
</Modals.ModalRoot>
}