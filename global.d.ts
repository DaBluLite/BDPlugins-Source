/// <reference types="bundlebd" />

import Constants from "./constants";
import { FluxEvents } from "./FluxEvents";
{ FluxEvents }

import type { ComponentType, CSSProperties, FunctionComponent, HtmlHTMLAttributes, HTMLProps, KeyboardEvent, MouseEvent, PropsWithChildren, PropsWithRef, ReactNode, Ref } from "react";

declare global {
    type TextVariant = "heading-sm/normal" | "heading-sm/medium" | "heading-sm/semibold" | "heading-sm/bold" | "heading-md/normal" | "heading-md/medium" | "heading-md/semibold" | "heading-md/bold" | "heading-lg/normal" | "heading-lg/medium" | "heading-lg/semibold" | "heading-lg/bold" | "heading-xl/normal" | "heading-xl/medium" | "heading-xl/bold" | "heading-xxl/normal" | "heading-xxl/medium" | "heading-xxl/bold" | "eyebrow" | "heading-deprecated-14/normal" | "heading-deprecated-14/medium" | "heading-deprecated-14/bold" | "text-xxs/normal" | "text-xxs/medium" | "text-xxs/semibold" | "text-xxs/bold" | "text-xs/normal" | "text-xs/medium" | "text-xs/semibold" | "text-xs/bold" | "text-sm/normal" | "text-sm/medium" | "text-sm/semibold" | "text-sm/bold" | "text-md/normal" | "text-md/medium" | "text-md/semibold" | "text-md/bold" | "text-lg/normal" | "text-lg/medium" | "text-lg/semibold" | "text-lg/bold" | "display-sm" | "display-md" | "display-lg" | "code";
type FormTextTypes = Record<"DEFAULT" | "INPUT_PLACEHOLDER" | "DESCRIPTION" | "LABEL_BOLD" | "LABEL_SELECTED" | "LABEL_DESCRIPTOR" | "ERROR" | "SUCCESS", string>;
type Heading = `h${1 | 2 | 3 | 4 | 5 | 6}`;
type GenericStore = t.FluxStore & Record<string, any>;
type Margins = Record<"marginTop16" | "marginTop8" | "marginBottom8" | "marginTop20" | "marginBottom20", string>;
type ButtonLooks = Record<"FILLED" | "INVERTED" | "OUTLINED" | "LINK" | "BLANK", string>;

type TextProps = PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement> & {
    variant?: TextVariant;
    tag?: "div" | "span" | "p" | "strong" | Heading;
    selectable?: boolean;
    lineClamp?: number;
}>;

type TextComponent = ComponentType<TextProps>;

type CallbackFn = (mod: any, id: string) => void;

type Ref<T> = RefCallback<T> | RefObject<T> | null;

type RenderFunction = (props: ModalProps) => ReactNode;

interface OfflineSourceObject {
    name: string,
    colorways: Colorway[],
    id?: string
}
interface ColorwayObject {
    id: string | null,
    css: string | null,
    sourceType: "online" | "offline" | "temporary" | null,
    source: string | null | undefined;
}

interface SourceObject {
    type: "online" | "offline" | "temporary",
    source: string,
    colorways: Colorway[];
}

type RC<C> = ComponentType<PropsWithChildren<C & Record<string, any>>>;

interface Menu {
    Menu: RC<{
        navId: string;
        onClose(): void;
        className?: string;
        style?: CSSProperties;
        hideScroller?: boolean;
        onSelect?(): void;
    }>;
    MenuSeparator: ComponentType;
    MenuGroup: RC<{
        label?: string;
    }>;
    MenuItem: RC<{
        id: string;
        label: ReactNode;
        action?(e: MouseEvent): void;
        icon?: ComponentType<any>;

        color?: string;
        render?: ComponentType<any>;
        onChildrenScroll?: Function;
        childRowHeight?: number;
        listClassName?: string;
        disabled?: boolean;
    }>;
    MenuCheckboxItem: RC<{
        id: string;
        label: string;
        checked: boolean;
        action?(e: MouseEvent): void;
        disabled?: boolean;
    }>;
    MenuRadioItem: RC<{
        id: string;
        group: string;
        label: string;
        checked: boolean;
        action?(e: MouseEvent): void;
        disabled?: boolean;
    }>;
    MenuControlItem: RC<{
        id: string;
        interactive?: boolean;
    }>;
    MenuSliderControl: RC<{
        minValue: number,
        maxValue: number,
        value: number,
        onChange(value: number): void,
        renderValue?(value: number): string,
    }>;
}

interface StoreObject {
    sources: StoreItem[];
}
interface ModalOptions {
    modalKey?: string;
    onCloseRequest?: (() => void);
    onCloseCallback?: (() => void);
}

interface StoreItem {
    name: string,
    id: string,
    description: string,
    url: string,
    authorGh: string;
}

type FormTitle = ComponentType<HTMLProps<HTMLTitleElement> & PropsWithChildren<{
    /** is h5 */
    tag?: Heading;
    faded?: boolean;
    disabled?: boolean;
    required?: boolean;
    error?: ReactNode;
}>>;

type FormSection = ComponentType<PropsWithChildren<{
    /** is h5 */
    tag?: Heading;
    className?: string;
    titleClassName?: string;
    titleId?: string;
    title?: ReactNode;
    disabled?: boolean;
    htmlFor?: unknown;
}>>;

type FormDivider = ComponentType<{
    className?: string;
    style?: CSSProperties;
}>;


type FormText = ComponentType<PropsWithChildren<{
    disabled?: boolean;
    selectable?: boolean;
    /** defaults to FormText.Types.DEFAULT */
    type?: string;
}> & TextProps> & { Types: FormTextTypes; };

type Tooltip = ComponentType<{
    text: ReactNode;
    children: FunctionComponent<{
        onClick(): void;
        onMouseEnter(): void;
        onMouseLeave(): void;
        onContextMenu(): void;
        onFocus(): void;
        onBlur(): void;
        "aria-label"?: string;
    }>;
    "aria-label"?: string;

    allowOverflow?: boolean;
    forceOpen?: boolean;
    hide?: boolean;
    hideOnClick?: boolean;
    shouldShow?: boolean;
    spacing?: number;

    /** Tooltip.Colors.BLACK */
    color?: string;
    /** TooltipPositions.TOP */
    position?: string;

    tooltipClassName?: string;
    tooltipContentClassName?: string;
}> & {
    Colors: Record<"BLACK" | "BRAND" | "CUSTOM" | "GREEN" | "GREY" | "PRIMARY" | "RED" | "YELLOW", string>;
};

type TooltipPositions = Record<"BOTTOM" | "CENTER" | "LEFT" | "RIGHT" | "TOP" | "WINDOW_CENTER", string>;

type Card = ComponentType<PropsWithChildren<HTMLProps<HTMLDivElement> & {
    editable?: boolean;
    outline?: boolean;
    /** Card.Types.PRIMARY */
    type?: string;
}>> & {
    Types: Record<"BRAND" | "CUSTOM" | "DANGER" | "PRIMARY" | "SUCCESS" | "WARNING", string>;
};

type Button = ComponentType<PropsWithChildren<Omit<HTMLProps<HTMLButtonElement>, "size"> & {
    /** Button.Looks.FILLED */
    look?: string;
    /** Button.Colors.BRAND */
    color?: string;
    /** Button.Sizes.MEDIUM */
    size?: string;
    /** Button.BorderColors.BLACK */
    borderColor?: string;

    wrapperClassName?: string;
    className?: string;
    innerClassName?: string;

    buttonRef?: Ref<HTMLButtonElement>;
    focusProps?: any;
    submitting?: boolean;

    submittingStartedLabel?: string;
    submittingFinishedLabel?: string;
}>> & {
    BorderColors: Record<"BLACK" | "BRAND" | "BRAND_NEW" | "GREEN" | "LINK" | "PRIMARY" | "RED" | "TRANSPARENT" | "WHITE" | "YELLOW", string>;
    Colors: Record<"BRAND" | "RED" | "GREEN" | "YELLOW" | "PRIMARY" | "LINK" | "WHITE" | "BLACK" | "TRANSPARENT" | "BRAND_NEW" | "CUSTOM", string>;
    Hovers: Record<"DEFAULT" | "BRAND" | "RED" | "GREEN" | "YELLOW" | "PRIMARY" | "LINK" | "WHITE" | "BLACK" | "TRANSPARENT", string>;
    Looks: Record<"FILLED" | "INVERTED" | "OUTLINED" | "LINK" | "BLANK", string>;
    Sizes: Record<"NONE" | "TINY" | "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "MIN" | "MAX" | "ICON", string>;

    Link: any;
};

type Switch = ComponentType<PropsWithChildren<{
    value: boolean;
    onChange(value: boolean): void;

    disabled?: boolean;
    hideBorder?: boolean;
    className?: string;
    style?: CSSProperties;

    note?: ReactNode;
    tooltipNote?: ReactNode;
}>>;

type Timestamp = ComponentType<PropsWithChildren<{
    timestamp: Date;
    isEdited?: boolean;

    className?: string;
    id?: string;

    cozyAlt?: boolean;
    compact?: boolean;
    isInline?: boolean;
    isVisibleOnlyOnHover?: boolean;
}>>;

type TextInput = ComponentType<PropsWithChildren<{
    name?: string;
    onChange?(value: string, name?: string): void;
    placeholder?: string;
    editable?: boolean;
    maxLength?: number;
    error?: string;

    inputClassName?: string;
    inputPrefix?: string;
    inputRef?: Ref<HTMLInputElement>;
    prefixElement?: ReactNode;

    focusProps?: any;

    /** TextInput.Sizes.DEFAULT */
    size?: string;
} & Omit<HTMLProps<HTMLInputElement>, "onChange">>> & {
    Sizes: Record<"DEFAULT" | "MINI", string>;
};

type TextArea = ComponentType<PropsWithRef<Omit<HTMLProps<HTMLTextAreaElement>, "onChange"> & {
    onChange(v: string): void;
}>>;

interface SelectOption {
    disabled?: boolean;
    value: any;
    label: string;
    key?: React.Key;
    default?: boolean;
}

type Select = ComponentType<PropsWithChildren<{
    placeholder?: string;
    options: ReadonlyArray<SelectOption>; // TODO

    /**
     * - 0 ~ Filled
     * - 1 ~ Custom
     */
    look?: 0 | 1;
    className?: string;
    popoutClassName?: string;
    popoutPosition?: "top" | "left" | "right" | "bottom" | "center" | "window_center";
    optionClassName?: string;

    autoFocus?: boolean;
    isDisabled?: boolean;
    clearable?: boolean;
    closeOnSelect?: boolean;
    hideIcon?: boolean;

    select(value: any): void;
    isSelected(value: any): boolean;
    serialize(value: any): string;
    clear?(): void;

    maxVisibleItems?: number;
    popoutWidth?: number;

    onClose?(): void;
    onOpen?(): void;

    renderOptionLabel?(option: SelectOption): ReactNode;
    /** discord stupid this gets all options instead of one yeah */
    renderOptionValue?(option: SelectOption[]): ReactNode;

    "aria-label"?: boolean;
    "aria-labelledby"?: boolean;
}>>;

type SearchableSelect = ComponentType<PropsWithChildren<{
    placeholder?: string;
    options: ReadonlyArray<SelectOption>; // TODO
    value?: SelectOption;

    /**
     * - 0 ~ Filled
     * - 1 ~ Custom
     */
    look?: 0 | 1;
    className?: string;
    popoutClassName?: string;
    wrapperClassName?: string;
    popoutPosition?: "top" | "left" | "right" | "bottom" | "center" | "window_center";
    optionClassName?: string;

    autoFocus?: boolean;
    isDisabled?: boolean;
    clearable?: boolean;
    closeOnSelect?: boolean;
    clearOnSelect?: boolean;
    multi?: boolean;

    onChange(value: any): void;
    onSearchChange?(value: string): void;

    onClose?(): void;
    onOpen?(): void;
    onBlur?(): void;

    renderOptionPrefix?(option: SelectOption): ReactNode;
    renderOptionSuffix?(option: SelectOption): ReactNode;

    filter?(option: SelectOption[], query: string): SelectOption[];

    centerCaret?: boolean;
    debounceTime?: number;
    maxVisibleItems?: number;
    popoutWidth?: number;

    "aria-labelledby"?: boolean;
}>>;

type Slider = ComponentType<PropsWithChildren<{
    initialValue: number;
    defaultValue?: number;
    keyboardStep?: number;
    maxValue?: number;
    minValue?: number;
    markers?: number[];
    stickToMarkers?: boolean;

    /** 0 above, 1 below */
    markerPosition?: 0 | 1;
    orientation?: "horizontal" | "vertical";

    getAriaValueText?(currentValue: number): string;
    renderMarker?(marker: number): ReactNode;
    onMarkerRender?(marker: number): ReactNode;
    onValueRender?(value: number): ReactNode;
    onValueChange?(value: number): void;
    asValueChanges?(value: number): void;

    className?: string;
    disabled?: boolean;
    handleSize?: number;
    mini?: boolean;
    hideBubble?: boolean;

    fillStyles?: CSSProperties;
    barStyles?: CSSProperties;
    grabberStyles?: CSSProperties;
    grabberClassName?: string;
    barClassName?: string;

    "aria-hidden"?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
}>>;

// TODO - type maybe idk probably not that useful other than the constants
type Flex = ComponentType<PropsWithChildren<any>> & {
    Align: Record<"START" | "END" | "CENTER" | "STRETCH" | "BASELINE", string>;
    Direction: Record<"VERTICAL" | "HORIZONTAL" | "HORIZONTAL_REVERSE", string>;
    Justify: Record<"START" | "END" | "CENTER" | "BETWEEN" | "AROUND", string>;
    Wrap: Record<"NO_WRAP" | "WRAP" | "WRAP_REVERSE", string>;
};

declare enum PopoutAnimation {
    NONE = "1",
    TRANSLATE = "2",
    SCALE = "3",
    FADE = "4"
}

type Popout = ComponentType<{
    children(
        thing: {
            "aria-controls": string;
            "aria-expanded": boolean;
            onClick(event: MouseEvent<HTMLElement>): void;
            onKeyDown(event: KeyboardEvent<HTMLElement>): void;
            onMouseDown(event: MouseEvent<HTMLElement>): void;
        },
        data: {
            isShown: boolean;
            position: string;
        }
    ): ReactNode;
    shouldShow?: boolean;
    renderPopout(args: {
        closePopout(): void;
        isPositioned: boolean;
        nudge: number;
        position: string;
        setPopoutRef(ref: any): void;
        updatePosition(): void;
    }): ReactNode;

    onRequestOpen?(): void;
    onRequestClose?(): void;

    /** "center" and others */
    align?: string;
    /** Popout.Animation */
    animation?: PopoutAnimation;
    autoInvert?: boolean;
    nudgeAlignIntoViewport?: boolean;
    /** "bottom" and others */
    position?: string;
    positionKey?: string;
    spacing?: number;
}> & {
    Animation: typeof PopoutAnimation;
};

type Dialog = ComponentType<PropsWithChildren<any>>;

type Resolve = (data: { theme: "light" | "dark", saturation: number; }) => {
    hex(): string;
    hsl(): string;
    int(): number;
    spring(): string;
};

type useToken = (color: {
    css: string;
    resolve: Resolve;
}) => ReturnType<Resolve>;

type Paginator = ComponentType<{
    currentPage: number;
    maxVisiblePages: number;
    pageSize: number;
    totalCount: number;

    onPageChange?(page: number): void;
    hideMaxPage?: boolean;
}>;

type MaskedLink = ComponentType<PropsWithChildren<{
    href: string;
    rel?: string;
    target?: string;
    title?: string,
    className?: string;
    tabIndex?: number;
    onClick?(): void;
    trusted?: boolean;
    messageId?: string;
    channelId?: string;
}>>;

type ScrollerThin = ComponentType<PropsWithChildren<{
    className?: string;
    style?: CSSProperties;

    dir?: "ltr";
    orientation?: "horizontal" | "vertical";
    paddingFix?: boolean;
    fade?: boolean;

    onClose?(): void;
    onScroll?(): void;
}>>;

type Clickable = ComponentType<PropsWithChildren<{
    className?: string;

    href?: string;
    ignoreKeyPress?: boolean;

    onClick?(): void;
    onKeyPress?(): void;
}>>;

type Avatar = ComponentType<PropsWithChildren<{
    className?: string;

    src?: string;
    size?: "SIZE_16" | "SIZE_20" | "SIZE_24" | "SIZE_32" | "SIZE_40" | "SIZE_48" | "SIZE_56" | "SIZE_80" | "SIZE_120";

    statusColor?: string;
    statusTooltip?: string;
    statusBackdropColor?: string;

    isMobile?: boolean;
    isTyping?: boolean;
    isSpeaking?: boolean;

    typingIndicatorRef?: unknown;

    "aria-hidden"?: boolean;
    "aria-label"?: string;
}>>;

type FocusLock = ComponentType<PropsWithChildren<{
    containerRef: RefObject<HTMLElement>
}>>;

interface Clipboard {
    copy(text: string): void;
    SUPPORTS_COPY: boolean;
}

interface Colorway {
    [key: string]: any,
    name: string,
    "dc-import": string,
    accent: string,
    primary: string,
    secondary: string,
    tertiary: string,
    original?: boolean,
    author: string,
    authorID: string,
    colors?: string[],
    isGradient?: boolean,
    sourceUrl?: string,
    sourceName?: string,
    linearGradient?: string;
}

interface ColorPickerProps {
    color: number;
    showEyeDropper: boolean;
    suggestedColors: string[];
    label: any;
    onChange(color: number): void;
}

class User {
    constructor(user: object);
    accentColor: number;
    avatar: string;
    banner: string;
    bio: string;
    bot: boolean;
    desktop: boolean;
    discriminator: string;
    email: string | undefined;
    flags: number;
    guildMemberAvatars: Record<string, string>;
    id: string;
    mfaEnabled: boolean;
    mobile: boolean;
    nsfwAllowed: boolean | undefined;
    phone: string | undefined;
    premiumType: number | undefined;
    premiumUsageFlags: number;
    publicFlags: number;
    purchasedFlags: number;
    system: boolean;
    username: string;
    verified: boolean;
  
    get createdAt(): Date;
    get hasPremiumPerks(): boolean;
    get tag(): string;
    get usernameNormalized(): string;
  
    addGuildAvatarHash(guildId: string, avatarHash: string): User;
    getAvatarSource(guildId: string, canAnimate?: boolean): { uri: string; };
    getAvatarURL(guildId?: string, t?: unknown, canAnimate?: boolean): string;
    hasAvatarForGuild(guildId: string): boolean;
    hasDisabledPremium(): boolean;
    hasFlag(flag: number): boolean;
    hasFreePremium(): boolean;
    hasHadSKU(e: unknown): boolean;
    hasPremiumUsageFlag(flag: number): boolean;
    hasPurchasedFlag(flag: number): boolean;
    hasUrgentMessages(): boolean;
    isClaimed(): boolean;
    isLocalBot(): boolean;
    isNonUserBot(): boolean;
    isPhoneVerified(): boolean;
    isStaff(): boolean;
    isSystemUser(): boolean;
    isVerifiedBot(): boolean;
    removeGuildAvatarHash(guildId: string): User;
    toString(): string;
}
  
interface UserJSON {
    avatar: string;
    avatarDecoration: unknown | undefined;
    discriminator: string;
    id: string;
    publicFlags: number;
    username: string;
}

class UserStore {
    filter(filter: () => boolean, sort?: boolean): Record<string, User>;
    findByTag(username: string, discriminator: string): User;
    forEach(action: Function): void;
    getCurrentUser(): User;
    getUser(userId: string): User;
    getUsers(): Record<string, User>;
    initialize(): void;
}

class SelectedChannelStore {
    getChannelId(e?: unknown): string;
    getLastChannelFollowingDestination(): unknown;
    getLastSelectedChannelId(): string;
    getMostRecentSelectedTextChannelId(e: unknown): unknown;
    getVoiceChannelId(): string | undefined;
    initialize(): void;
}

class RelationshipStore {
    getFriendIDs(): string[];
    /** Related to friend nicknames experiment. */
    getNickname(userId: string): string;
    getPendingCount(): number;
    getRelationshipCount(): number;
    /** @returns Enum value from constants.RelationshipTypes */
    getRelationshipType(userId: string): number;
    /** @returns Format: [userId: Enum value from constants.RelationshipTypes] */
    getRelationships(): Record<number, number>;
    isBlocked(userId: string): boolean;
    isFriend(userId: string): boolean;
}

class MessageStore {
    getMessage(channelId: string, messageId: string): Message;
    /** @returns This return object is fucking huge; I'll type it later. */
    getMessages(channelId: string): unknown;
    /** Not full message objects; uses MessageJSON type. */
    getRawMessages(channelId: string): Record<string | number, MessageJSON>;
    hasCurrentUserSentMessage(channelId: string): boolean;
    hasPresent(channelId: string): boolean;
    isLoadingMessages(channelId: string): boolean;
    jumpedMessageId(channelId: string): string | undefined;
    whenReady(e: unknown, callback: Function): void;
    initialize(): void;
}

interface Role {
    color: number;
    colorString: string | undefined;
    hoist: boolean;
    icon: string | undefined;
    id: string;
    managed: boolean;
    mentionable: boolean;
    name: string;
    originalPosition: number;
    permissions: bigint;
    position: number;
    tags: { // I'm sure there are more.
      bot_id: string;
      integration_id: string;
      premium_subscriber: unknown;
    } | undefined;
    unicodeEmoji: string | undefined;
}

class Guild {
    constructor(guild: object);
    afkChannelId: string | undefined;
    afkTimeout: number;
    applicationCommandCounts: {
      0: number;
      1: number;
      2: number;
    };
    application_id: unknown;
    banner: string | undefined;
    defaultMessageNotifications: number;
    description: string | undefined;
    discoverySplash: string | undefined;
    explicitContentFilter: number;
    features: Set<keyof Constants['GuildFeatures']>;
    hubType: unknown;
    icon: string | undefined;
    id: string;
    joinedAt: Date;
    maxMembers: number;
    maxVideoChannelUsers: number;
    mfaLevel: number;
    name: string;
    nsfwLevel: number;
    ownerId: string;
    preferredLocale: string;
    premiumProgressBarEnabled: boolean;
    premiumSubscriberCount: number;
    premiumTier: number;
    publicUpdatesChannelId: string | undefined;
    roles: Record<string, Role>;
    rulesChannelId: string | undefined;
    splash: string | undefined;
    systemChannelFlags: number;
    systemChannelId: string | undefined;
    vanityURLCode: string | undefined;
    verificationLevel: number;
  
    get acronym(): string;
  
    getApplicationId(): unknown;
    getIconSource(size: string | number, canAnimate: boolean): { uri: string; };
    getIconURL(size: string | number, canAnimate: boolean): string;
    getMaxEmojiSlots(): number;
    getRole(roleId: string): Role;
    hasFeature(feature: keyof Constants['GuildFeatures']): boolean;
    hasVerificationGate(): boolean;
    isLurker(): boolean;
    isNew(newerThanDays?: number): boolean;
    isOwner(user: User): boolean;
    isOwnerWithRequiredMfaLevel(user: User): boolean;
    toString(): string; // override that is identical to Guild.name
}  

class GuildStore {
    getGuild(guildId: string): Guild;
    getGuildCount(): number;
    getGuilds(): Record<string, Guild>;
}

class GuildMemberStore {
    getAllGuildsAndMembers(): Record<string, Record<string, GuildMember>>;
    /** @returns Format: [guildId-userId: Timestamp (string)] */
    getCommunicationDisabledUserMap(): Record<string, string>;
    getCommunicationDisabledVersion(): number;
    getKeyedMembers(guildId: string): Record<string, GuildMember>;
    getMember(guildId: string, userId: string): GuildMember;
    getMemberIds(guildId: string): string[];
    getMembers(guildId: string): GuildMember[];
    getNick(guildId: string, userId: string): string;
    getNicknameGuildsMapping(userId: string): Record<string, string[]>;
    getNicknames(userId: string): string[];
    isMember(guildId: string, userId: string): boolean;
    memberOf(userId: string): string[];
    initialize(): void;
}

interface GuildMember {
    avatar: string | undefined;
    banner: string | undefined;
    bio: string;
    colorString: string;
    communicationDisabledUntil: string | undefined;
    fullProfileLoadedTimestamp: number;
    guildId: string;
    hoistRoleId: string;
    iconRoleId: string;
    isPending: boolean | undefined;
    joinedAt: string | undefined;
    nick: string | undefined;
    premiumSince: string | undefined;
    roles: string[];
    userId: string;
}

class ChannelStore {
    getAllThreadsForParent(channelId: string): Channel[];
    getChannel(channelId: string): Channel;
    getDMFromUserId(userId: string): string;
    getDMUserIds(): string[];
    getGuildChannelsVersion(guildId: string): number;
    getInitialOverlayState(): Record<string, Channel>;
    getMutableGuildAndPrivateChannels(): Record<string, Channel>;
    getMutableGuildChannels(): Record<string, Channel>;
    getMutableGuildChannelsByGuild(): Record<string, Record<string, Channel>>;
    getMutablePrivateChannels(): Record<string, Channel>;
    getPrivateChannelsVersion(): number;
    getSortedPrivateChannels(): Channel[];
    hasChannel(channelId: string): boolean;
    initialize(): void;
}

class MessageStore {
    getMessage(channelId: string, messageId: string): Message;
    /** @returns This return object is fucking huge; I'll type it later. */
    getMessages(channelId: string): unknown;
    /** Not full message objects; uses MessageJSON type. */
    getRawMessages(channelId: string): Record<string | number, MessageJSON>;
    hasCurrentUserSentMessage(channelId: string): boolean;
    hasPresent(channelId: string): boolean;
    isLoadingMessages(channelId: string): boolean;
    jumpedMessageId(channelId: string): string | undefined;
    whenReady(e: unknown, callback: Function): void;
    initialize(): void;
}

class Channel {
    constructor(channel: object);
    application_id: number | undefined;
    bitrate: number;
    defaultAutoArchiveDuration: number | undefined;
    flags: number;
    guild_id: string;
    icon: string;
    id: string;
    lastMessageId: string;
    lastPinTimestamp: string | undefined;
    member: unknown;
    memberCount: number | undefined;
    memberIdsPreview: string[] | undefined;
    memberListId: unknown;
    messageCount: number | undefined;
    name: string;
    nicks: Record<string, unknown>;
    nsfw: boolean;
    originChannelId: unknown;
    ownerId: string;
    parent_id: string;
    permissionOverwrites: {
      [role: string]: {
        id: string;
        type: number;
        deny: bigint;
        allow: bigint;
      };
    };
    position: number;
    rateLimitPerUser: number;
    rawRecipients: {
      id: string;
      avatar: string;
      username: string;
      public_flags: number;
      discriminator: string;
    }[];
    recipients: string[];
    rtcRegion: string;
    threadMetadata: {
      locked: boolean;
      archived: boolean;
      invitable: boolean;
      createTimestamp: string | undefined;
      autoArchiveDuration: number;
      archiveTimestamp: string | undefined;
    };
    topic: string;
    type: number;
    userLimit: number;
    videoQualityMode: undefined;
  
    get accessPermissions(): bigint;
    get lastActiveTimestamp(): number;
  
    computeLurkerPermissionsAllowList(): unknown;
    getApplicationId(): unknown;
    getGuildId(): string;
    getRecipientId(): unknown;
    hasFlag(flag: number): boolean;
    isActiveThread(): boolean;
    isArchivedThread(): boolean;
    isCategory(): boolean;
    isDM(): boolean;
    isDirectory(): boolean;
    isForumChannel(): boolean;
    isGroupDM(): boolean;
    isGuildStageVoice(): boolean;
    isGuildVoice(): boolean;
    isListenModeCapable(): boolean;
    isManaged(): boolean;
    isMultiUserDM(): boolean;
    isNSFW(): boolean;
    isOwner(): boolean;
    isPrivate(): boolean;
    isSystemDM(): boolean;
    isThread(): boolean;
    isVocal(): boolean;
}

type GenericFunction = (...args: any[]) => any;

class FluxStore {
    constructor(dispatcher: FluxDispatcher, eventHandlers?: Partial<Record<FluxEvents, (data: any) => void>>);

    addChangeListener(callback: () => void): void;
    addReactChangeListener(callback: () => void): void;
    removeChangeListener(callback: () => void): void;
    removeReactChangeListener(callback: () => void): void;
    emitChange(): void;
    getDispatchToken(): string;
    getName(): string;
    initialize(): void;
    initializeIfNeeded(): void;
    registerActionHandlers: GenericFunction;
    syncWith: GenericFunction;
    waitFor: GenericFunction;
    __getLocalVars(): Record<string, any>;
}

interface Flux {
    Store: typeof FluxStore;
}

class WindowStore extends FluxStore {
    isElementFullScreen(): boolean;
    isFocused(): boolean;
    windowSize(): Record<"width" | "height", number>;
}

type Emoji = CustomEmoji | UnicodeEmoji;
interface CustomEmoji {
    allNamesString: string;
    animated: boolean;
    available: boolean;
    guildId: string;
    id: string;
    managed: boolean;
    name: string;
    originalName?: string;
    require_colons: boolean;
    roles: string[];
    url: string;
}

interface UnicodeEmoji {
    diversityChildren: Record<any, any>;
    emojiObject: {
        names: string[];
        surrogates: string;
        unicodeVersion: number;
    };
    index: number;
    surrogates: string;
    uniqueName: string;
    useSpriteSheet: boolean;
    get allNamesString(): string;
    get animated(): boolean;
    get defaultDiversityChild(): any;
    get hasDiversity(): boolean | undefined;
    get hasDiversityParent(): boolean | undefined;
    get hasMultiDiversity(): boolean | undefined;
    get hasMultiDiversityParent(): boolean | undefined;
    get managed(): boolean;
    get name(): string;
    get names(): string[];
    get optionallyDiverseSequence(): string | undefined;
    get unicodeVersion(): number;
    get url(): string;
}

class EmojiStore extends FluxStore {
    getCustomEmojiById(id?: string | null): CustomEmoji;
    getUsableCustomEmojiById(id?: string | null): CustomEmoji;
    getGuilds(): Record<string, {
        id: string;
        _emojiMap: Record<string, CustomEmoji>;
        _emojis: CustomEmoji[];
        get emojis(): CustomEmoji[];
        get rawEmojis(): CustomEmoji[];
        _usableEmojis: CustomEmoji[];
        get usableEmojis(): CustomEmoji[];
        _emoticons: any[];
        get emoticons(): any[];
    }>;
    getGuildEmoji(guildId?: string | null): CustomEmoji[];
    getNewlyAddedEmoji(guildId?: string | null): CustomEmoji[];
    getTopEmoji(guildId?: string | null): CustomEmoji[];
    getTopEmojisMetadata(guildId?: string | null): {
        emojiIds: string[];
        topEmojisTTL: number;
    };
    hasPendingUsage(): boolean;
    hasUsableEmojiInAnyGuild(): boolean;
    searchWithoutFetchingLatest(data: any): any;
    getSearchResultsOrder(...args: any[]): any;
    getState(): {
        pendingUsages: { key: string, timestamp: number; }[];
    };
    searchWithoutFetchingLatest(data: {
        channel: Channel,
        query: string;
        count?: number;
        intention: number;
        includeExternalGuilds?: boolean;
        matchComparator?(name: string): boolean;
    }): Record<"locked" | "unlocked", Emoji[]>;

    getDisambiguatedEmojiContext(): {
        backfillTopEmojis: Record<any, any>;
        customEmojis: Record<string, CustomEmoji>;
        emojisById: Record<string, CustomEmoji>;
        emojisByName: Record<string, CustomEmoji>;
        emoticonRegex: RegExp | null;
        emoticonsByName: Record<string, any>;
        escapedEmoticonNames: string;
        favoriteNamesAndIds?: any;
        favorites?: any;
        frequentlyUsed?: any;
        groupedCustomEmojis: Record<string, CustomEmoji[]>;
        guildId?: string;
        isFavoriteEmojiWithoutFetchingLatest(e: Emoji): boolean;
        newlyAddedEmoji: Record<string, CustomEmoji[]>;
        topEmojis?: any;
        unicodeAliases: Record<string, string>;
        get favoriteEmojisWithoutFetchingLatest(): Emoji[];
    };
}

interface DraftObject {
    channelId: string;
    timestamp: number;
    draft: string;
}

interface DraftState {
    [userId: string]: {
        [channelId: string]: {
            [key in DraftType]?: Omit<DraftObject, "channelId">;
        } | undefined;
    } | undefined;
}


class DraftStore extends FluxStore {
    getDraft(channelId: string, type: DraftType): string;
    getRecentlyEditedDrafts(type: DraftType): DraftObject[];
    getState(): DraftState;
    getThreadDraftWithParentMessageId?(arg: any): any;
    getThreadSettings(channelId: string): any | null;
}

class GuildStore extends FluxStore {
    getGuild(guildId: string): Guild;
    getGuildCount(): number;
    getGuilds(): Record<string, Guild>;
    getGuildIds(): string[];
    getRole(guildId: string, roleId: string): Role;
    getRoles(guildId: string): Record<string, Role>;
    getAllGuildRoles(): Record<string, Record<string, Role>>;
}

interface FluxDispatcher {
    _actionHandlers: any;
    _subscriptions: any;
    dispatch(event: { [key: string]: unknown; type: FluxEvents; }): Promise<void>;
    isDispatching(): boolean;
    subscribe(event: FluxEvents, callback: (data: any) => void): void;
    unsubscribe(event: FluxEvents, callback: (data: any) => void): void;
    wait(callback: () => void): void;
}

type Parser = Record<
    | "parse"
    | "parseTopic"
    | "parseEmbedTitle"
    | "parseInlineReply"
    | "parseGuildVerificationFormRule"
    | "parseGuildEventDescription"
    | "parseAutoModerationSystemMessage"
    | "parseForumPostGuidelines"
    | "parseForumPostMostRecentMessage",
    (content: string, inline?: boolean, state?: Record<string, any>) => ReactNode[]
> & Record<"defaultRules" | "guildEventRules", Record<string, Record<"react" | "html" | "parse" | "match" | "order", any>>>;

interface Alerts {
    show(alert: {
        title: any;
        body: React.ReactNode;
        className?: string;
        confirmColor?: string;
        cancelText?: string;
        confirmText?: string;
        secondaryConfirmText?: string;
        onCancel?(): void;
        onConfirm?(): void;
        onConfirmSecondary?(): void;
        onCloseCallback?(): void;
    }): void;
    /** This is a noop, it does nothing. */
    close(): void;
}

interface SnowflakeUtils {
    fromTimestamp(timestamp: number): string;
    extractTimestamp(snowflake: string): number;
    age(snowflake: string): number;
    atPreviousMillisecond(snowflake: string): string;
    compare(snowflake1?: string, snowflake2?: string): number;
}

interface RestRequestData {
    url: string;
    query?: Record<string, any>;
    body?: Record<string, any>;
    oldFormErrors?: boolean;
    retries?: number;
}

type RestAPI = Record<"delete" | "get" | "patch" | "post" | "put", (data: RestRequestData) => Promise<any>>;

type Permissions = "CREATE_INSTANT_INVITE"
    | "KICK_MEMBERS"
    | "BAN_MEMBERS"
    | "ADMINISTRATOR"
    | "MANAGE_CHANNELS"
    | "MANAGE_GUILD"
    | "CHANGE_NICKNAME"
    | "MANAGE_NICKNAMES"
    | "MANAGE_ROLES"
    | "MANAGE_WEBHOOKS"
    | "MANAGE_GUILD_EXPRESSIONS"
    | "CREATE_GUILD_EXPRESSIONS"
    | "VIEW_AUDIT_LOG"
    | "VIEW_CHANNEL"
    | "VIEW_GUILD_ANALYTICS"
    | "VIEW_CREATOR_MONETIZATION_ANALYTICS"
    | "MODERATE_MEMBERS"
    | "SEND_MESSAGES"
    | "SEND_TTS_MESSAGES"
    | "MANAGE_MESSAGES"
    | "EMBED_LINKS"
    | "ATTACH_FILES"
    | "READ_MESSAGE_HISTORY"
    | "MENTION_EVERYONE"
    | "USE_EXTERNAL_EMOJIS"
    | "ADD_REACTIONS"
    | "USE_APPLICATION_COMMANDS"
    | "MANAGE_THREADS"
    | "CREATE_PUBLIC_THREADS"
    | "CREATE_PRIVATE_THREADS"
    | "USE_EXTERNAL_STICKERS"
    | "SEND_MESSAGES_IN_THREADS"
    | "SEND_VOICE_MESSAGES"
    | "CONNECT"
    | "SPEAK"
    | "MUTE_MEMBERS"
    | "DEAFEN_MEMBERS"
    | "MOVE_MEMBERS"
    | "USE_VAD"
    | "PRIORITY_SPEAKER"
    | "STREAM"
    | "USE_EMBEDDED_ACTIVITIES"
    | "USE_SOUNDBOARD"
    | "USE_EXTERNAL_SOUNDS"
    | "REQUEST_TO_SPEAK"
    | "MANAGE_EVENTS"
    | "CREATE_EVENTS";

type PermissionsBits = Record<Permissions, bigint>;

interface Locale {
    name: string;
    value: string;
    localizedName: string;
}

interface LocaleInfo {
    code: string;
    enabled: boolean;
    name: string;
    englishName: string;
    postgresLang: string;
}

interface i18n {
    getAvailableLocales(): Locale[];
    getLanguages(): LocaleInfo[];
    getDefaultLocale(): string;
    getLocale(): string;
    getLocaleInfo(): LocaleInfo;
    setLocale(locale: string): void;

    loadPromise: Promise<void>;

    Messages: Record<i18nMessages, any>;
}

interface Clipboard {
    copy(text: string): void;
    SUPPORTS_COPY: boolean;
}

interface NavigationRouter {
    back(): void;
    forward(): void;
    hasNavigated(): boolean;
    getHistory(): {
        action: string;
        length: 50;
        [key: string]: any;
    };
    transitionTo(path: string, ...args: unknown[]): void;
    transitionToGuild(guildId: string, ...args: unknown[]): void;
    replaceWith(...args: unknown[]): void;
    getLastRouteChangeSource(): any;
    getLastRouteChangeSourceLocationStack(): any;
}

interface IconUtils {
    getUserAvatarURL(user: User, canAnimate?: boolean, size?: number, format?: string): string;
    getDefaultAvatarURL(id: string, discriminator?: string): string;
    getUserBannerURL(data: { id: string, banner: string, canAnimate?: boolean, size: number; }): string | undefined;
    getAvatarDecorationURL(dara: { avatarDecoration: string, size: number; canCanimate?: boolean; }): string | undefined;

    getGuildMemberAvatarURL(member: GuildMember, canAnimate?: string): string | null;
    getGuildMemberAvatarURLSimple(data: { guildId: string, userId: string, avatar: string, canAnimate?: boolean; size?: number; }): string;
    getGuildMemberBannerURL(data: { id: string, guildId: string, banner: string, canAnimate?: boolean, size: number; }): string | undefined;

    getGuildIconURL(data: { id: string, icon?: string, size?: number, canAnimate?: boolean; }): string | undefined;
    getGuildBannerURL(guild: Guild, canAnimate?: boolean): string | null;

    getChannelIconURL(data: { id: string; icon?: string; applicationId?: string; size?: number; }): string | undefined;
    getEmojiURL(data: { id: string, animated: boolean, size: number, forcePNG?: boolean; }): string;

    hasAnimatedGuildIcon(guild: Guild): boolean;
    isAnimatedIconHash(hash: string): boolean;

    getGuildSplashURL: any;
    getGuildDiscoverySplashURL: any;
    getGuildHomeHeaderURL: any;
    getResourceChannelIconURL: any;
    getNewMemberActionIconURL: any;
    getGuildTemplateIconURL: any;
    getApplicationIconURL: any;
    getGameAssetURL: any;
    getVideoFilterAssetURL: any;

    getGuildMemberAvatarSource: any;
    getUserAvatarSource: any;
    getGuildSplashSource: any;
    getGuildDiscoverySplashSource: any;
    makeSource: any;
    getGameAssetSource: any;
    getGuildIconSource: any;
    getGuildTemplateIconSource: any;
    getGuildBannerSource: any;
    getGuildHomeHeaderSource: any;
    getChannelIconSource: any;
    getApplicationIconSource: any;
    getAnimatableSourceWithFallback: any;
}

type FocusLock = ComponentType<PropsWithChildren<{
    containerRef: RefObject<HTMLElement>
}>>;

const enum ModalTransitionState {
    ENTERING,
    ENTERED,
    EXITING,
    EXITED,
    HIDDEN,
}

interface ModalProps {
    transitionState: ModalTransitionState;
    onClose(): Promise<void>;
}

type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
}

export {}