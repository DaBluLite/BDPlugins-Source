import { ModalContent, TabBar } from "../../../common";
import OnDemandPage from "./SettingsTabs/OnDemandPage";
import Store from "./SettingsTabs/Store";
import SettingsPage from "./SettingsTabs/SettingsPage";
import SourceManager from "./SettingsTabs/SourceManager";
import { useState } from "react";
import Selector from "./Selector";

export enum SettingsTab {
    Selector,
    Settings,
    Sources,
    OnDemand,
    Store
}


export default function({ tab = SettingsTab.Settings }: { tab?: SettingsTab }) {
    const [currentTab, setCurrentTab] = useState(tab);
    return <>
    <TabBar
                type="top"
                look="brand"
                className="dc-settings-tab-bar"
                selectedItem={currentTab}
                onItemSelect={setCurrentTab}
            >
                <TabBar.Item
                    className="dc-settings-tab-bar-item"
                    id={SettingsTab.Selector}
                >
                    Colorways
                </TabBar.Item>
                <TabBar.Item
                    className="dc-settings-tab-bar-item"
                    id={SettingsTab.Settings}
                >
                    Settings
                </TabBar.Item>
                <TabBar.Item
                    className="dc-settings-tab-bar-item"
                    id={SettingsTab.Sources}
                >
                    Sources
                </TabBar.Item>
                <TabBar.Item
                    className="dc-settings-tab-bar-item"
                    id={SettingsTab.OnDemand}
                >
                    On-Demand
                </TabBar.Item>
                <TabBar.Item
                    className="dc-settings-tab-bar-item"
                    id={SettingsTab.Store}
                >
                    Store
                </TabBar.Item>
            </TabBar>
            {currentTab === SettingsTab.Selector && <Selector modalProps={{ transitionState: 1, onClose: () => new Promise(() => {}) }} isSettings={true} inModal={true}/>}
            {currentTab === SettingsTab.Settings && <SettingsPage inModal={true}/>}
            {currentTab === SettingsTab.Sources && <SourceManager inModal={true}/>}
            {currentTab === SettingsTab.OnDemand && <OnDemandPage inModal={true}/>}
            {currentTab === SettingsTab.Store && <Store inModal={true}/>}
    </>
}