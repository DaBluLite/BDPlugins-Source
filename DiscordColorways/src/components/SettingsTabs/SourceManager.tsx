import { Logger } from "zlibrary";
import { ModalRoot, ModalHeader, ModalContent, Forms, Text, TextInput, ModalFooter, Button, SettingsTab, Flex, openModal, ScrollerThin, closeModal, DiscordNative, chooseFile, Webpack, saveSettings, getSetting, Clipboard } from "../../../../common";
import { defaultColorwaySource } from "../../constants";
import { PlusIcon, CopyIcon, DownloadIcon, ImportIcon, DeleteIcon } from "../Icons";
import { useState } from "react";
import Spinner from "../Spinner";
import { Data } from "betterdiscord";

export function StoreNameModal({ modalProps, originalName, onFinish, conflicting }: { modalProps: ModalProps, originalName: string, onFinish: (newName: string) => Promise<void>, conflicting: boolean; }) {
    const [error, setError] = useState<string>("");
    const [newStoreName, setNewStoreName] = useState<string>(originalName);
    return <ModalRoot {...modalProps}>
        <ModalHeader separator={false}>
            <Text variant="heading-lg/semibold" tag="h1">{conflicting ? "Duplicate Store Name" : "Give this store a name"}</Text>
        </ModalHeader>
        <ModalContent>
            {conflicting ? <Text>A store with the same name already exists. Please give a different name to the imported store:</Text> : <></>}
            <Forms.FormTitle>Name:</Forms.FormTitle>
            <TextInput error={error} value={newStoreName} onChange={e => setNewStoreName(e)} style={{ marginBottom: "16px" }} />
        </ModalContent>
        <ModalFooter>
            <Button
                style={{ marginLeft: 8 }}
                color={Button.Colors.BRAND}
                size={Button.Sizes.MEDIUM}
                look={Button.Looks.FILLED}
                onClick={async () => {
                    setError("");
                    if ((Data.load("custom_colorways") as OfflineSourceObject[]).map(store => store.name).includes(newStoreName)) {
                        return setError("Error: Store name already exists");
                    }
                    onFinish(newStoreName);
                    modalProps.onClose();
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
        </ModalFooter>
    </ModalRoot>;
}

function AddOnlineStoreModal({ modalProps, onFinish }: { modalProps: ModalProps, onFinish: (name: string, url: string) => void; }) {
    const [colorwaySourceName, setColorwaySourceName] = useState<string>("");
    const [colorwaySourceURL, setColorwaySourceURL] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");
    const [URLError, setURLError] = useState<string>("");
    const [nameReadOnly, setNameReadOnly] = useState<boolean>(false);
    return <ModalRoot {...modalProps}>
        <ModalHeader separator={false}>
            <Text variant="heading-lg/semibold" tag="h1">
                Add a source:
            </Text>
        </ModalHeader>
        <ModalContent>
            <Forms.FormTitle>Name:</Forms.FormTitle>
            <TextInput
                placeholder="Enter a valid Name..."
                onChange={setColorwaySourceName}
                value={colorwaySourceName}
                error={nameError}
                readOnly={nameReadOnly}
                disabled={nameReadOnly}
            />
            <Forms.FormTitle style={{ marginTop: "8px" }}>URL:</Forms.FormTitle>
            <TextInput
                placeholder="Enter a valid URL..."
                onChange={value => {
                    setColorwaySourceURL(value);
                    if (value === defaultColorwaySource) {
                        setNameReadOnly(true);
                        setColorwaySourceName("Project Colorway");
                    }
                }}
                value={colorwaySourceURL}
                error={URLError}
                style={{ marginBottom: "16px" }}
            />
        </ModalContent>
        <ModalFooter>
            <Button
                style={{ marginLeft: 8 }}
                color={Button.Colors.BRAND}
                size={Button.Sizes.MEDIUM}
                look={Button.Looks.FILLED}
                onClick={async () => {
                    const sourcesArr: { name: string, url: string; }[] = getSetting("colorwayLists");
                    if (!colorwaySourceName) {
                        setNameError("Error: Please enter a valid name");
                    }
                    else if (!colorwaySourceURL) {
                        setURLError("Error: Please enter a valid URL");
                    }
                    else if (sourcesArr.map(s => s.name).includes(colorwaySourceName)) {
                        setNameError("Error: An online source with that name already exists");
                    }
                    else if (sourcesArr.map(s => s.url).includes(colorwaySourceURL)) {
                        setURLError("Error: An online source with that url already exists");
                    } else {
                        onFinish(colorwaySourceName, colorwaySourceURL);
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
        </ModalFooter>
    </ModalRoot>;
}

export default function ({ inModal }: { inModal?: boolean }) {
    const [colorwaySourceFiles, setColorwaySourceFiles] = useState<{ name: string, url: string; }[]>(getSetting("colorwayLists"));
    const [customColorwayStores, setCustomColorwayStores] = useState<{ name: string, colorways: Colorway[]; }[]>(Data.load("custom_colorways"));

    const { item: radioBarItem, itemFilled: radioBarItemFilled } = Webpack.getByKeys("radioBar");

    return <SettingsTab title="Sources" inModal={inModal}>
        <Flex style={{ gap: "0", marginBottom: "8px", alignItems: "center" }}>
            <Forms.FormTitle tag="h5" style={{ marginBottom: 0, flexGrow: 1 }}>Online</Forms.FormTitle>
            <Button
                className="colorwaysSettings-colorwaySourceAction"
                innerClassName="colorwaysSettings-iconButtonInner"
                style={{ flexShrink: "0" }}
                size={Button.Sizes.SMALL}
                color={Button.Colors.TRANSPARENT}
                onClick={() => {
                    openModal(props => <AddOnlineStoreModal modalProps={props} onFinish={async (name, url) => {
                        saveSettings({ colorwayLists: [...getSetting("colorwayLists"), { name: name, url: url }] });
                        setColorwaySourceFiles([...getSetting("colorwayLists"), { name: name, url: url }]);
                    }} />);
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
                Add...
            </Button>
        </Flex>
        <ScrollerThin orientation="vertical" style={{ maxHeight: "50%" }} className="colorwaysSettings-sourceScroller">
            {!colorwaySourceFiles.length && <div className={`${radioBarItem} ${radioBarItemFilled} colorwaysSettings-colorwaySource`} style={{ flexDirection: "column", padding: "16px", alignItems: "start" }} onClick={() => {
                saveSettings({ colorwayLists: [{ name: "Project Colorway", url: defaultColorwaySource }] });
                setColorwaySourceFiles([{ name: "Project Colorway", url: defaultColorwaySource }]);
            }}>
                <PlusIcon width={24} height={24} />
                <Text className="colorwaysSettings-colorwaySourceLabel">
                    Add Project Colorway Source
                </Text>
            </div>}
            {colorwaySourceFiles.map((colorwaySourceFile: { name: string, url: string; }, i: number) => <div className={`${radioBarItem} ${radioBarItemFilled} colorwaysSettings-colorwaySource`} style={{ flexDirection: "column", padding: "16px", alignItems: "start" }}>
                <div className="hoverRoll">
                    <Text className="colorwaysSettings-colorwaySourceLabel hoverRoll_normal">
                        {colorwaySourceFile.name} {colorwaySourceFile.url === defaultColorwaySource && <div className="colorways-badge">Built-In</div>}
                    </Text>
                    <Text className="colorwaysSettings-colorwaySourceLabel hoverRoll_hovered">
                        {colorwaySourceFile.url}
                    </Text>
                </div>
                <Flex style={{ marginLeft: "auto", gap: "8px" }}>
                    <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.SMALL}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        onClick={() => { Clipboard.copy(colorwaySourceFile.url); }}
                    >
                        <CopyIcon width={14} height={14} /> Copy URL
                    </Button>
                    {colorwaySourceFile.url !== defaultColorwaySource
                        && <>
                            <Button
                                innerClassName="colorwaysSettings-iconButtonInner"
                                size={Button.Sizes.SMALL}
                                color={Button.Colors.PRIMARY}
                                look={Button.Looks.OUTLINED}
                                onClick={async () => {
                                    openModal(props => <StoreNameModal conflicting={false} modalProps={props} originalName={colorwaySourceFile.name || ""} onFinish={async e => {
                                        const modal = openModal(propss => <ModalRoot {...propss} className="colorwaysLoadingModal"><Spinner style={{ color: "#ffffff" }} /></ModalRoot>);
                                        const res = await fetch(colorwaySourceFile.url);
                                        const data = await res.json();
                                        Data.save("custom_colorways", [...Data.load("custom_colorways"), { name: e, colorways: data.colorways || [] }]);
                                        setCustomColorwayStores(Data.load("custom_colorways") as OfflineSourceObject[]);
                                        closeModal(modal);
                                    }} />);
                                }}
                            >
                                <DownloadIcon width={14} height={14} /> Download...
                            </Button>
                            <Button
                                innerClassName="colorwaysSettings-iconButtonInner"
                                size={Button.Sizes.SMALL}
                                color={Button.Colors.RED}
                                look={Button.Looks.OUTLINED}
                                onClick={async () => {
                                    saveSettings({ colorwayLists: (getSetting("colorwayLists") as { name: string, url: string; }[]).filter((src, ii) => ii !== i) });
                                    setColorwaySourceFiles((getSetting("colorwayLists") as { name: string, url: string; }[]).filter((src, ii) => ii !== i));
                                }}
                            >
                                <DeleteIcon width={14} height={14} /> Remove
                            </Button>
                        </>}
                </Flex>
            </div>
            )}
        </ScrollerThin>
        <Flex style={{ gap: "0", marginBottom: "8px", alignItems: "center" }}>
            <Forms.FormTitle tag="h5" style={{ marginBottom: 0, flexGrow: 1 }}>Offline</Forms.FormTitle>
            <Button
                className="colorwaysSettings-colorwaySourceAction"
                innerClassName="colorwaysSettings-iconButtonInner"
                style={{ flexShrink: "0", marginLeft: "8px" }}
                size={Button.Sizes.SMALL}
                color={Button.Colors.TRANSPARENT}
                onClick={async () => {
                    const [file] = await DiscordNative.fileManager.openFiles({
                        filters: [
                            { name: "DiscordColorways Offline Store", extensions: ["json"] },
                            { name: "all", extensions: ["*"] }
                        ]
                    });
                    if (file) {
                        try {
                            if ((Data.load("custom_colorways") as OfflineSourceObject[]).map(store => store.name).includes(JSON.parse(new TextDecoder().decode(file.data)).name)) {
                                openModal(props => <StoreNameModal conflicting modalProps={props} originalName={JSON.parse(new TextDecoder().decode(file.data)).name} onFinish={async e => {
                                    await Data.save("custom_colorways", [...Data.load("custom_colorways"), { name: e, colorways: JSON.parse(new TextDecoder().decode(file.data)).colorways }]);
                                    setCustomColorwayStores(Data.load("custom_colorways") as OfflineSourceObject[]);
                                }} />);
                            } else {
                                await Data.save("custom_colorways", [...Data.load("custom_colorways"), JSON.parse(new TextDecoder().decode(file.data))]);
                                setCustomColorwayStores(Data.load("custom_colorways") as OfflineSourceObject[]);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }}
            >
                <ImportIcon width={14} height={14} />
                Import...
            </Button>
            <Button
                className="colorwaysSettings-colorwaySourceAction"
                innerClassName="colorwaysSettings-iconButtonInner"
                style={{ flexShrink: "0", marginLeft: "8px" }}
                size={Button.Sizes.SMALL}
                color={Button.Colors.TRANSPARENT}
                onClick={() => {
                    openModal(props => <StoreNameModal conflicting={false} modalProps={props} originalName="" onFinish={async e => {
                        Data.save("custom_colorways", [...Data.load("custom_colorways"), { name: e, colorways: [] }]);
                        setCustomColorwayStores(Data.load("custom_colorways") as OfflineSourceObject[]);
                        props.onClose();
                    }} />);
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
                New...
            </Button>
        </Flex>
        <ScrollerThin orientation="vertical" style={{ maxHeight: "50%" }} className="colorwaysSettings-sourceScroller">
            {getComputedStyle(document.body).getPropertyValue("--os-accent-color") ? <div className={`${radioBarItem} ${radioBarItemFilled} colorwaysSettings-colorwaySource`} style={{ flexDirection: "column", padding: "16px", alignItems: "start" }}>
                <Flex style={{ gap: 0, alignItems: "center", width: "100%", height: "30px" }}>
                    <Text className="colorwaysSettings-colorwaySourceLabel">OS Accent Color{" "}
                        <div className="colorways-badge">Built-In</div>
                    </Text>
                </Flex>
            </div> : <></>}
            {customColorwayStores.map(({ name: customColorwaySourceName, colorways: offlineStoreColorways }) => <div className={`${radioBarItem} ${radioBarItemFilled} colorwaysSettings-colorwaySource`} style={{ flexDirection: "column", padding: "16px", alignItems: "start" }}>
                <Text className="colorwaysSettings-colorwaySourceLabel">
                    {customColorwaySourceName}
                </Text>
                <Flex style={{ marginLeft: "auto", gap: "8px" }}>
                    <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.SMALL}
                        color={Button.Colors.PRIMARY}
                        look={Button.Looks.OUTLINED}
                        onClick={async () => {
                            DiscordNative.fileManager.saveWithDialog(JSON.stringify({ "name": customColorwaySourceName, "colorways": [...offlineStoreColorways] }), `${customColorwaySourceName.replaceAll(" ", "-").toLowerCase()}.colorways.json`);
                        }}
                    >
                        <DownloadIcon width={14} height={14} /> Export as...
                    </Button>
                    <Button
                        innerClassName="colorwaysSettings-iconButtonInner"
                        size={Button.Sizes.SMALL}
                        color={Button.Colors.RED}
                        look={Button.Looks.OUTLINED}
                        onClick={async () => {
                            var sourcesArr: { name: string, colorways: Colorway[]; }[] = [];
                            const customColorwaySources = await Data.load("custom_colorways");
                            customColorwaySources.map((source: { name: string, colorways: Colorway[]; }) => {
                                if (source.name !== customColorwaySourceName) {
                                    sourcesArr.push(source);
                                }
                            });
                            Data.save("custom_colorways", sourcesArr);
                            setCustomColorwayStores(sourcesArr);
                        }}
                    >
                        <DeleteIcon width={20} height={20} /> Remove
                    </Button>
                </Flex>
            </div>
            )}
        </ScrollerThin>
    </SettingsTab>;
}
