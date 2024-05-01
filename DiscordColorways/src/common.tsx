import { Webpack } from "betterdiscord";
import type * as t from "../../global";
import { proxyLazy, waitForStore } from "./utils";
import Spinner from "./components/Spinner";
import { Filters } from "../../common";

export let Clipboard: t.Clipboard;
export let Forms = {} as {
    FormTitle: t.FormTitle,
    FormSection: t.FormSection,
    FormDivider: t.FormDivider,
    FormText: t.FormText,
};

export let Card: t.Card;
export let Button: t.Button;
export let Switch: t.Switch;
export let Tooltip: t.Tooltip;
export let TextInput: t.TextInput;
export let TextArea: t.TextArea;
export let Text: t.Text;
export let Select: t.Select;
export let SearchableSelect: t.SearchableSelect;
export let Slider: t.Slider;
export let ButtonLooks: t.ButtonLooks;
export let Popout: t.Popout;
export let Dialog: t.Dialog;
export let TabBar: any;
export let Paginator: t.Paginator;
export let ScrollerThin: t.ScrollerThin;
export let Clickable: t.Clickable;
export let Avatar: t.Avatar;
export let FocusLock: t.FocusLock;
export let useToken: t.useToken;
export const SettingsRouter = Webpack.getByKeys("open", "saveAccountChanges");
export const Menu = {
    Menu: Webpack.getByKeys("Menu").Menu,
    MenuItem: Webpack.getByKeys("Menu").MenuItem
}
export let ColorPicker: React.FunctionComponent<t.ColorPickerProps> = () => {
    return <Spinner className="colorways-creator-module-warning" />;
};

Webpack.waitForModule(Filters.byKeys("FormItem", "Button")).then(m => {
    ({ useToken, Card, Button, FormSwitch: Switch, Tooltip, TextInput, TextArea, Text, Select, SearchableSelect, Slider, ButtonLooks, TabBar, Popout, Dialog, Paginator, ScrollerThin, Clickable, Avatar, FocusLock } = m);
    Forms = m;
})
Webpack.waitForModule(Filters.byStrings("showEyeDropper")).then(e => ColorPicker = e);

export function Flex(props: React.PropsWithChildren<{
    flexDirection?: React.CSSProperties["flexDirection"];
    style?: React.CSSProperties;
    className?: string;
} & React.HTMLProps<HTMLDivElement>>) {
    props.style ??= {};
    props.style.display = "flex";
    props.style.gap ??= "1em";
    props.style.flexDirection ||= props.flexDirection;
    delete props.flexDirection;
    return (
        <div {...props}>
            {props.children}
        </div>
    );
}
export let PermissionStore: t.GenericStore;
export let GuildChannelStore: t.GenericStore;
export let ReadStateStore: t.GenericStore;
export let PresenceStore: t.GenericStore;
export let GuildStore: t.GuildStore;
export let UserStore: t.UserStore & t.FluxStore;
export let UserProfileStore: t.GenericStore;
export let SelectedChannelStore: t.SelectedChannelStore & t.FluxStore;
export let SelectedGuildStore: t.FluxStore & Record<string, any>;
export let ChannelStore: t.ChannelStore & t.FluxStore;
export let GuildMemberStore: t.GuildMemberStore & t.FluxStore;
export let RelationshipStore: t.RelationshipStore & t.FluxStore & {
    getSince(userId: string): string;
};
export let EmojiStore: t.EmojiStore;
export let WindowStore: t.WindowStore;
export let DraftStore: t.DraftStore;
export let MessageStore: Omit<t.MessageStore, "getMessages"> & {
    getMessages(chanId: string): any;
};
export const UserProfileActions = proxyLazy(() => Webpack.getByKeys("openUserProfileModal", "closeUserProfileModal"));
export const UserUtils = proxyLazy(() => Webpack.getByKeys("getUser", "fetchCurrentUser") as { getUser: (id: string) => Promise<t.User>; });
export const Modals = {
    openModal: Webpack.getByKeys("openModal", "ModalHeader").openModal,
    ModalRoot: Webpack.getByKeys("ModalRoot").ModalRoot as React.ComponentType<React.PropsWithChildren<{
        transitionState: t.ModalTransitionState;
        size?: t.ModalSize;
        role?: "alertdialog" | "dialog";
        className?: string;
        fullscreenOnMobile?: boolean;
        "aria-label"?: string;
        "aria-labelledby"?: string;
        onAnimationEnd?(): string;
    }>>,
    ModalHeader: Webpack.getByKeys("ModalRoot").ModalHeader as React.ComponentType<React.PropsWithChildren<{
        justify?: string;
        direction?: string;
        align?: string;
        wrap?: string;
        separator?: boolean;
        className?: string;
    }>>,
    ModalContent: Webpack.getByKeys("ModalRoot").ModalContent as React.ComponentType<React.PropsWithChildren<{
        className?: string;
        scrollerRef?: React.Ref<HTMLElement>;
        [prop: string]: any;
    }>>,
    ModalFooter: Webpack.getByKeys("ModalRoot").ModalFooter as React.ComponentType<React.PropsWithChildren<{
        justify?: string;
        direction?: string;
        align?: string;
        wrap?: string;
        separator?: boolean;
        className?: string;
    }>>
};

export const Toasts = {
    show: Webpack.getByKeys("showToast")["showToast"],
    pop: Webpack.getByKeys("popToast")["popToast"],
    useToastStore: Webpack.getByKeys("useToastStore")["useToastStore"],
    create: Webpack.getByKeys("createToast")["createToast"]
};

export const FluxDispatcher = Webpack.getModule((m: { dispatch: any; subscribe: any; }) => m.dispatch && m.subscribe);

export async function openUserProfile(id: string) {
    const user = await UserUtils.getUser(id);
    if (!user) throw new Error("No such user: " + id);

    const guildId = SelectedGuildStore.getGuildId();
    UserProfileActions.openUserProfileModal({
        userId: id,
        guildId,
        channelId: SelectedChannelStore.getChannelId(),
        analyticsLocation: {
            page: guildId ? "Guild Channel" : "DM Channel",
            section: "Profile Popout"
        }
    });
}

waitForStore("DraftStore", (s: t.DraftStore) => DraftStore = s);
waitForStore("UserStore", (s: t.UserStore & t.FluxStore) => UserStore = s);
waitForStore("SelectedChannelStore", (s: t.SelectedChannelStore & t.FluxStore) => SelectedChannelStore = s);
waitForStore("SelectedGuildStore", (s: t.FluxStore & Record<string, any>) => SelectedGuildStore = s);
waitForStore("UserProfileStore", (m: any) => UserProfileStore = m);
waitForStore("ChannelStore", (m: t.ChannelStore & t.FluxStore) => ChannelStore = m);
waitForStore("GuildStore", (m: t.GuildStore) => GuildStore = m);
waitForStore("GuildMemberStore", (m: t.GuildMemberStore & t.FluxStore) => GuildMemberStore = m);
waitForStore("RelationshipStore", (m: t.RelationshipStore & t.FluxStore & { getSince(userId: string): string; }) => RelationshipStore = m);
waitForStore("PermissionStore", (m: any) => PermissionStore = m);
waitForStore("PresenceStore", (m: any) => PresenceStore = m);
waitForStore("ReadStateStore", (m: any) => ReadStateStore = m);
waitForStore("GuildChannelStore", (m: any) => GuildChannelStore = m);
waitForStore("MessageStore", (m: Omit<t.MessageStore, "getMessages"> & { getMessages(chanId: string): any; }) => MessageStore = m);
waitForStore("WindowStore", (m: t.WindowStore) => WindowStore = m);
waitForStore("EmojiStore", (m: t.EmojiStore) => EmojiStore = m);
Webpack.waitForModule(Filters.byKeys("SUPPORTS_COPY", "copy")).then((e: t.Clipboard) => Clipboard = e);

export function SettingsTab({ title, children }: { title: string, children: any }) {
    return (
        <Forms.FormSection>
            <Text
                variant="heading-lg/semibold"
                tag="h2"
                style={{ marginBottom: "16px" }}
            >
                {title}
            </Text>

            {children}
        </Forms.FormSection>
    );
}

export function chooseFile(mimeTypes: string) {
    return new Promise<File | null>(resolve => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";
        input.accept = mimeTypes;
        input.onchange = async () => {
            resolve(input.files?.[0] ?? null);
        };

        document.body.appendChild(input);
        input.click();
        setImmediate(() => document.body.removeChild(input));
    });
}

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    disabled?: boolean;
}

export function Link(props: React.PropsWithChildren<Props>) {
    if (props.disabled) {
        props.style ??= {};
        props.style.pointerEvents = "none";
        props["aria-disabled"] = true;
    }
    return (
        <a role="link" target="_blank" {...props}>
            {props.children}
        </a>
    );
}