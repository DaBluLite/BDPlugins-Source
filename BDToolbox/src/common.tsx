import { Webpack } from "betterdiscord";
import type * as t from "../../global";
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
export let GuildStore: t.FluxStore & Record<string, any>;
export let SelectedGuildStore: t.FluxStore & Record<string, any>;
export const SettingsRouter = Webpack.getByKeys("open", "init");
export const Menu = {
    Menu: Webpack.getByKeys("Menu").Menu,
    MenuItem: Webpack.getByKeys("Menu").MenuItem,
    MenuGroup: Webpack.getByKeys("Menu").MenuGroup,
    MenuCheckboxItem: Webpack.getByKeys("Menu").MenuCheckboxItem
}

Webpack.waitForModule(Filters.byKeys("FormItem", "Button")).then(m => {
    ({ useToken, Card, Button, FormSwitch: Switch, Tooltip, TextInput, TextArea, Text, Select, SearchableSelect, Slider, ButtonLooks, TabBar, Popout, Dialog, Paginator, ScrollerThin, Clickable, Avatar, FocusLock } = m);
    Forms = m;
})

Webpack.waitForModule(Filters.byStoreName("GuildStore")).then((e: any) => GuildStore = e)
Webpack.waitForModule(Filters.byStoreName("SelectedGuildStore")).then((e: any) => SelectedGuildStore = e)

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
export const Modals = {
    openModal: Webpack.getByKeys("openModal", "ModalHeader").openModal,
    ModalRoot: Webpack.getByKeys("ModalRoot").ModalRoot,
    ModalHeader: Webpack.getByKeys("ModalRoot").ModalHeader,
    ModalContent: Webpack.getByKeys("ModalRoot").ModalContent,
    ModalFooter: Webpack.getByKeys("ModalRoot").ModalFooter
};

export const Toasts = {
    show: Webpack.getByKeys("showToast")["showToast"],
    pop: Webpack.getByKeys("popToast")["popToast"],
    useToastStore: Webpack.getByKeys("useToastStore")["useToastStore"],
    create: Webpack.getByKeys("createToast")["createToast"]
};

export const FluxDispatcher = Webpack.getModule((m: { dispatch: any; subscribe: any; }) => m.dispatch && m.subscribe);

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