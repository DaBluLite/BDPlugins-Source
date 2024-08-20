import React from "react";
import ReactDOM from "react-dom";
import { Data, Webpack as Webpack$1 } from "betterdiscord";
import type { ComponentType } from "react";
import Spinner from "./DiscordColorways/src/components/Spinner";

export type FilterFn = (mod: any) => boolean;

export const Filters = {
  ...Webpack$1.Filters,
  byName: (name: any) => {
    return (target: { displayName: any; constructor: { displayName: any } }) =>
      (target?.displayName ?? target?.constructor?.displayName) === name;
  },
  byKeys: (...keys: any[]) => {
    return (target: any) =>
      target instanceof Object && keys.every((key) => key in target);
  },
  byProtos: (...protos: any[]) => {
    return (target: { prototype: any }) =>
      target instanceof Object &&
      target.prototype instanceof Object &&
      protos.every((proto) => proto in target.prototype);
  },
  bySource: (...fragments: any[]) => {
    return (target: {
      render: any;
      type: any;
      toString: () => any;
      prototype: { render: { toString: () => any } };
    }) => {
      while (target instanceof Object && "$$typeof" in target) {
        target = target.render ?? target.type;
      }
      if (target instanceof Function) {
        const source = target.toString();
        const renderSource = target.prototype?.render?.toString();
        return fragments.every((fragment) =>
          typeof fragment === "string"
            ? source.includes(fragment) || renderSource?.includes(fragment)
            : fragment(source) || (renderSource && fragment(renderSource))
        );
      } else {
        return false;
      }
    };
  },
  byCode:
    (...code: string[]): FilterFn =>
    (m) => {
      if (typeof m !== "function") return false;
      const s = Function.prototype.toString.call(m);
      for (const c of code) {
        if (!s.includes(c)) return false;
      }
      return true;
    },
  componentByCode: (...code: string[]): FilterFn => {
    const filter = Filters.byCode(...code);
    return (m) => {
      if (filter(m)) return true;
      if (!m.$$typeof) return false;
      if (m.type && m.type.render) return filter(m.type.render); // memo + forwardRef
      if (m.type) return filter(m.type); // memos
      if (m.render) return filter(m.render); // forwardRefs
      return false;
    };
  },
};

/**
 * Finds the first component that includes all the given code, lazily
 */
export function findComponentByCodeLazy<T extends object = any>(
  ...code: string[]
) {
  return LazyComponent<T>(() => {
    const res = Webpack.getModule(Filters.componentByCode(...code));
    if (!res) handleModuleNotFound("findComponentByCode", ...code);
    return res;
  });
}

const hasThrown = new WeakSet();

const wrapFilter =
  (filter: any) =>
  (
    exports: {
      default: {
        remove: any;
        set: any;
        clear: any;
        get: any;
        sort: any;
        getToken: any;
        getEmail: any;
        showToken: any;
      };
      remove: any;
      set: any;
      clear: any;
      get: any;
      sort: any;
      getToken: any;
      getEmail: any;
      showToken: any;
    },
    module?: any,
    moduleId?: any
  ) => {
    try {
      if (
        exports?.default?.remove &&
        exports?.default?.set &&
        exports?.default?.clear &&
        exports?.default?.get &&
        !exports?.default?.sort
      )
        return false;
      if (
        exports.remove &&
        exports.set &&
        exports.clear &&
        exports.get &&
        !exports.sort
      )
        return false;
      if (
        exports?.default?.getToken ||
        exports?.default?.getEmail ||
        exports?.default?.showToken
      )
        return false;
      if (exports.getToken || exports.getEmail || exports.showToken)
        return false;
      return filter(exports, module, moduleId);
    } catch (err) {
      if (!hasThrown.has(filter))
        console.warn(
          "WebpackModules~getModule",
          "Module filter threw an exception.",
          filter,
          err
        );
      hasThrown.add(filter);
      return false;
    }
  };

const listeners = new Set();

function addListener(listener: unknown) {
  listeners.add(listener);
  return removeListener.bind(null, listener);
}

function removeListener(listener: unknown) {
  return listeners.delete(listener);
}

export const subscriptions = new Map<FilterFn, CallbackFn>();

export const Webpack = {
  ...Webpack$1,
  getLazy: (
    filter: any,
    options: {
      signal?: any;
      defaultExport?: boolean;
      searchExports?: boolean;
    } = {}
  ) => {
    const {
      signal: abortSignal,
      defaultExport = true,
      searchExports = false,
    } = options;
    const fromCache = Webpack.getModule(filter, {
      defaultExport,
      searchExports,
    });
    if (fromCache) return Promise.resolve(fromCache);

    const wrappedFilter = wrapFilter(filter);

    return new Promise((resolve) => {
      const cancel = () => removeListener(listener);
      const listener = function (exports: any | HTMLElement) {
        if (
          !exports ||
          exports === window ||
          exports === document.documentElement ||
          exports[Symbol.toStringTag] === "DOMTokenList"
        )
          return;

        let foundModule = null;
        if (
          typeof exports === "object" &&
          searchExports &&
          !exports.TypedArray
        ) {
          for (const key in exports) {
            foundModule = null;
            const wrappedExport = exports[key];
            if (!wrappedExport) continue;
            if (wrappedFilter(wrappedExport)) foundModule = wrappedExport;
          }
        } else {
          if (exports.Z && wrappedFilter(exports.Z))
            foundModule = defaultExport ? exports.Z : exports;
          if (exports.ZP && wrappedFilter(exports.ZP))
            foundModule = defaultExport ? exports.ZP : exports;
          if (
            exports.__esModule &&
            exports.default &&
            wrappedFilter(exports.default)
          )
            foundModule = defaultExport ? exports.default : exports;
          if (wrappedFilter(exports)) foundModule = exports;
        }

        if (!foundModule) return;
        cancel();
        resolve(foundModule);
      };

      addListener(listener);
      abortSignal?.addEventListener("abort", () => {
        cancel();
        resolve(null);
      });
    });
  }
};

export const ReactDOMInternals =
  (ReactDOM as any)?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ?.Events ?? [];
export const [
  getInstanceFromNode,
  getNodeFromInstance,
  getFiberCurrentPropsFromNode,
  enqueueStateRestore,
  restoreStateIfNeeded,
  batchedUpdates,
] = ReactDOMInternals;

const FCHook = ({
  children: { type, props },
  callback,
}: {
  children: { type: any; props: any };
  callback: any;
}) => {
  const result = type(props);
  return callback(result, props) ?? result;
};

export const hookFunctionComponent = (
  target: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<any>
  >,
  callback: (result: any) => void
) => {
  const props = {
    children: { ...target },
    callback,
  };
  target.props = props;
  target.type = FCHook;
  return target;
};

export const queryTree = (node: any, predicate: any) => {
  const worklist = [node].flat();
  while (worklist.length !== 0) {
    const node = worklist.shift();
    if (React.isValidElement(node)) {
      if (predicate(node)) {
        return node;
      }
      const children = (node?.props as any)?.children;
      if (children) {
        worklist.push(...[children].flat());
      }
    }
  }
  return null;
};

export const getFiber = (node: Element) => getInstanceFromNode(node ?? {});

const queryFiber = (
  fiber: { return: any; child: any },
  predicate: { (node: any): boolean; (arg0: any): any },
  direction = "up",
  depth = 30
) => {
  if (depth < 0) {
    return null;
  }
  if (predicate(fiber)) {
    return fiber;
  }
  if (direction === "up" || direction === "both") {
    let count = 0;
    let parent = fiber.return;
    while (parent && count < depth) {
      if (predicate(parent)) {
        return parent;
      }
      count++;
      parent = parent.return;
    }
  }
  if (direction === "down" || direction === "both") {
    let child = fiber.child;
    while (child) {
      const result: any = queryFiber(child, predicate, "down", depth - 1);
      if (result) {
        return result;
      }
      child = child.sibling;
    }
  }
  return null;
};

export const findOwner = (fiber: any, depth = 50) => {
  return queryFiber(
    fiber,
    (node: { stateNode: any }) => node?.stateNode instanceof React.Component,
    "up",
    depth
  );
};

export const ColorwayCSS = {
  get: () => document.getElementById("activeColorwayCSS")!.textContent || "",
  set: (e: string) => {
      if (!document.getElementById("activeColorwayCSS")) {
          document.head.append(Object.assign(document.createElement("style"), {
              id: "activeColorwayCSS",
              textContent: e
          }));
      } else document.getElementById("activeColorwayCSS")!.textContent = e;
  },
  remove: () => document.getElementById("activeColorwayCSS")!.remove(),
};

/**
 * Some internals for the Discord Desktop app
 */
export var DiscordNative: {
  isRenderer: boolean;
  nativeModules: {
    canBootstrapNewUpdater: boolean;
  };
  process: {
    platform: string;
    arch: string;
    env: {};
  };
  os: {
    appArch: string;
    arch: string;
    release: string;
  };
  app: {
    dock: {};
  };
  clipboard: {};
  ipc: {};
  gpuSettings: {};
  window: {
    USE_OSX_NATIVE_TRAFFIC_LIGHTS: boolean;
  };
  powerMonitor: {};
  spellCheck: {};
  crashReporter: {};
  desktopCapture: {};
  fileManager: {
    openFiles: (options: {}) => {
      [key: string]: any;
    };
    saveWithDialog: (data: any, filename: string) => void;
  };
  clips: {};
  processUtils: {};
  powerSaveBlocker: {};
  http: {};
  accessibility: {};
  features: {};
  settings: {};
  userDataCache: {};
  thumbar: {};
  safeStorage: {};
  globalOverlay: {
    WINDOW_KEY: string;
  };
  hardware: {};
  remoteApp: {
    dock: {};
  };
  remotePowerMonitor: {};
  webAuthn: {};
} = (window as any).DiscordNative;

export function hslToHex(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: any, g: any, b: any;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function colorToHex(color: string) {
  var colorType = "hex";
  if (color.includes("hsl")) {
    colorType = "hsl";
  } else if (color.includes("rgb")) {
    colorType = "rgb";
  }
  color = color
    .replaceAll(",", "")
    .replace(/.+?\(/, "")
    .replace(")", "")
    .replaceAll(/[ \t]+\/[ \t]+/g, " ")
    .replaceAll("%", "")
    .replaceAll("/", "");
  if (colorType === "hsl") {
    color = hslToHex(
      Number(color.split(" ")[0]),
      Number(color.split(" ")[1]),
      Number(color.split(" ")[2])
    );
  }
  if (colorType === "rgb") {
    color = rgbToHex(
      Number(color.split(" ")[0]),
      Number(color.split(" ")[1]),
      Number(color.split(" ")[2])
    );
  }
  return color.replace("#", "");
}

export function makeLazy<T>(factory: () => T, attempts = 5): () => T {
  let tries = 0;
  let cache: T;
  return () => {
    if (!cache && attempts > tries++) {
      cache = factory();
      if (!cache && attempts === tries)
        console.error("Lazy factory failed:", factory);
    }
    return cache;
  };
}

const NoopComponent = () => null;

/**
 * A lazy component. The factory method is called on first render.
 * @param factory Function returning a Component
 * @param attempts How many times to try to get the component before giving up
 * @returns Result of factory function
 */
export function LazyComponent<T extends object = any>(
  factory: () => React.ComponentType<T>,
  attempts = 5
) {
  const get = makeLazy(factory, attempts);
  const LazyComponent = (props: T) => {
    const Component = get() ?? NoopComponent;
    return <Component {...props} />;
  };

  LazyComponent.$$vencordInternal = get;

  return LazyComponent as ComponentType<T>;
}

export function handleModuleNotFound(method: string, ...filter: unknown[]) {
  const err = new Error(`webpack.${method} found no module`);
  console.error(err, "Filter:", filter);
}

const unconfigurable = ["arguments", "caller", "prototype"];

const handler: { [key: string]: any } = {};

const kGET = Symbol.for("vencord.lazy.get");
const kCACHE = Symbol.for("vencord.lazy.cached");

for (const method of [
  "apply",
  "construct",
  "defineProperty",
  "deleteProperty",
  "getOwnPropertyDescriptor",
  "getPrototypeOf",
  "has",
  "isExtensible",
  "ownKeys",
  "preventExtensions",
  "set",
  "setPrototypeOf",
]) {
  handler[method] = (target: any, ...args: any[]) =>
    (Reflect as { [key: string]: any })[method](target[kGET](), ...args);
}

handler.ownKeys = (target: any) => {
  const v = target[kGET]();
  const keys = Reflect.ownKeys(v);
  for (const key of unconfigurable) {
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
};

handler.getOwnPropertyDescriptor = (target: any, p: any) => {
  if (typeof p === "string" && unconfigurable.includes(p))
    return Reflect.getOwnPropertyDescriptor(target, p);

  const descriptor = Reflect.getOwnPropertyDescriptor(target[kGET](), p);

  if (descriptor) Object.defineProperty(target, p, descriptor);
  return descriptor;
};

export function proxyLazy<T>(
  factory: () => T,
  attempts = 5,
  isChild = false
): T {
  let isSameTick = true;
  if (!isChild) setTimeout(() => (isSameTick = false), 0);

  let tries = 0;
  const proxyDummy = Object.assign(function () {}, {
    [kCACHE]: void 0 as T | undefined,
    [kGET]() {
      if (!proxyDummy[kCACHE] && attempts > tries++) {
        proxyDummy[kCACHE] = factory();
        if (!proxyDummy[kCACHE] && attempts === tries)
          console.error("Lazy factory failed:", factory);
      }
      return proxyDummy[kCACHE];
    },
  });

  return new Proxy(proxyDummy, {
    ...handler,
    get(target: any, p, receiver) {
      if (!isChild && isSameTick)
        return proxyLazy(
          () => Reflect.get(target[kGET](), p, receiver),
          attempts,
          true
        );
      const lazyTarget = target[kGET]();
      if (typeof lazyTarget === "object" || typeof lazyTarget === "function") {
        return Reflect.get(lazyTarget, p, receiver);
      }
      throw new Error("proxyLazy called on a primitive value");
    },
  }) as any;
}

export function findExportedComponentLazy<T extends object = any>(
  ...props: string[]
) {
  return LazyComponent<T>(() => {
    const res = Webpack.getModule(Filters.byProps(...props));
    if (!res) handleModuleNotFound("findExportedComponent", ...props);
    return res[props[0]];
  });
}

export const {
  radioBar,
  item: radioBarItem,
  itemFilled: radioBarItemFilled,
  radioPositionLeft,
} = Webpack.getByKeys("radioBar");

/**
 * React hook that returns stateful data for one or more stores
 * You might need a custom comparator (4th argument) if your store data is an object
 *
 * @param stores The stores to listen to
 * @param mapper A function that returns the data you need
 * @param idk some thing, idk just pass null
 * @param isEqual A custom comparator for the data returned by mapper
 *
 * @example const user = useStateFromStores([UserStore], () => UserStore.getCurrentUser(), null, (old, current) => old.id === current.id);
 */
export const {
  useStateFromStores,
}: {
  useStateFromStores: <T>(
    stores: FluxStore[],
    mapper: () => T,
    idk?: any,
    isEqual?: (old: T, newer: T) => boolean
  ) => T;
} = proxyLazy(() => Webpack.getModule(Filters.byProps("useStateFromStores"))) as any;

export let Clipboard: Clipboard;
export let Forms = {} as {
  FormTitle: FormTitle;
  FormSection: FormSection;
  FormDivider: FormDivider;
  FormText: FormText;
};

export let Card: Card;
export let Button: Button;
export let Switch: Switch;
export let Tooltip: Tooltip;
export let TextInput: TextInput;
export let TextArea: TextArea;
export let Text: TextComponent;
export let Select: Select;
export let SearchableSelect: SearchableSelect;
export let Slider: Slider;
export let ButtonLooks: ButtonLooks;
export let Popout: Popout;
export let Dialog: Dialog;
export let TabBar: any;
export let Paginator: Paginator;
export let ScrollerThin: ScrollerThin;
export let Clickable: Clickable;
export let Avatar: Avatar;
export let FocusLock: FocusLock;
export let useToken: useToken;
export const SettingsRouter = Webpack.getByKeys("open", "saveAccountChanges");
export const Menu: Menu = { ...Webpack.getByKeys("MenuItem", "MenuSliderControl") };
export let ColorPicker: React.FunctionComponent<ColorPickerProps> = () => {
  return <Spinner className="colorways-creator-module-warning" />;
};

Webpack.waitForModule(Filters.byKeys("FormItem", "Button")).then((m) => {
  ({
    useToken,
    Card,
    Button,
    FormSwitch: Switch,
    Tooltip,
    TextInput,
    TextArea,
    Text,
    Select,
    SearchableSelect,
    Slider,
    ButtonLooks,
    TabBar,
    Popout,
    Dialog,
    Paginator,
    ScrollerThin,
    Clickable,
    Avatar,
    FocusLock,
  } = m);
  Forms = m;
});
Webpack.waitForModule(Filters.byStrings("showEyeDropper")).then(
  (e) => (ColorPicker = e)
);

export function Flex(
  props: React.PropsWithChildren<
    {
      flexDirection?: React.CSSProperties["flexDirection"];
      style?: React.CSSProperties;
      className?: string;
    } & React.HTMLProps<HTMLDivElement>
  >
) {
  props.style ??= {};
  props.style.display = "flex";
  props.style.gap ??= "1em";
  props.style.flexDirection ||= props.flexDirection;
  delete props.flexDirection;
  return <div {...props}>{props.children}</div>;
}
export let PermissionStore: GenericStore;
export let GuildChannelStore: GenericStore;
export let ReadStateStore: GenericStore;
export let PresenceStore: GenericStore;
export let GuildStore: GuildStore;
export let UserStore: UserStore & FluxStore;
export let UserProfileStore: GenericStore;
export let SelectedChannelStore: SelectedChannelStore & FluxStore;
export let SelectedGuildStore: FluxStore & Record<string, any>;
export let ChannelStore: ChannelStore & FluxStore;
export let GuildMemberStore: GuildMemberStore & FluxStore;
export let RelationshipStore: RelationshipStore &
  FluxStore & {
    getSince(userId: string): string;
  };
export let EmojiStore: EmojiStore;
export let WindowStore: WindowStore;
export let DraftStore: DraftStore;
export let MessageStore: Omit<MessageStore, "getMessages"> & {
  getMessages(chanId: string): any;
};
export const UserProfileActions = proxyLazy(() =>
  Webpack.getByKeys("openUserProfileModal", "closeUserProfileModal")
);
export const UserUtils = proxyLazy(
  () =>
    Webpack.getByKeys("getUser", "fetchCurrentUser") as {
      getUser: (id: string) => Promise<User>;
    }
);

const enum ModalSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  DYNAMIC = "dynamic",
}

export const Modals = proxyLazy(() => Webpack.getByKeys("ModalRoot", "ModalCloseButton")) as {
  ModalRoot: ComponentType<PropsWithChildren<{
      transitionState: ModalTransitionState;
      size?: ModalSize | "small" | "medium" | "large" | "dynamic";
      role?: "alertdialog" | "dialog";
      className?: string;
      fullscreenOnMobile?: boolean;
      "aria-label"?: string;
      "aria-labelledby"?: string;
      onAnimationEnd?(): string;
  }>>;
  ModalHeader: ComponentType<PropsWithChildren<{
      /** Flex.Justify.START */
      justify?: string;
      /** Flex.Direction.HORIZONTAL */
      direction?: string;
      /** Flex.Align.CENTER */
      align?: string;
      /** Flex.Wrap.NO_WRAP */
      wrap?: string;
      separator?: boolean;

      className?: string;
  }>>;
  /** This also accepts Scroller props but good luck with that */
  ModalContent: ComponentType<PropsWithChildren<{
      className?: string;
      scrollerRef?: Ref<HTMLElement>;
      [prop: string]: any;
  }>>;
  ModalFooter: ComponentType<PropsWithChildren<{
      /** Flex.Justify.START */
      justify?: string;
      /** Flex.Direction.HORIZONTAL_REVERSE */
      direction?: string;
      /** Flex.Align.STRETCH */
      align?: string;
      /** Flex.Wrap.NO_WRAP */
      wrap?: string;
      separator?: boolean;

      className?: string;
  }>>;
  ModalCloseButton: ComponentType<{
      focusProps?: any;
      onClick(): void;
      withCircleBackground?: boolean;
      hideOnFullscreen?: boolean;
      className?: string;
  }>;
};

export const ModalRoot = LazyComponent(() => Modals.ModalRoot);
export const ModalHeader = LazyComponent(() => Modals.ModalHeader);
export const ModalContent = LazyComponent(() => Modals.ModalContent);
export const ModalFooter = LazyComponent(() => Modals.ModalFooter);
export const ModalCloseButton = LazyComponent(() => Modals.ModalCloseButton);

export const Toasts = {
  show: Webpack.getByKeys("showToast")["showToast"],
  pop: Webpack.getByKeys("popToast")["popToast"],
  useToastStore: Webpack.getByKeys("useToastStore")["useToastStore"],
  create: Webpack.getByKeys("createToast")["createToast"],
};

export const FluxDispatcher = Webpack.getModule(
  (m: { dispatch: any; subscribe: any }) => m.dispatch && m.subscribe
);

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
      section: "Profile Popout",
    },
  });
}

export function waitForStore(storeName: string, callback: any) {
  Webpack.waitForModule(Filters.byStoreName(storeName)).then((e: any) =>
    callback(e)
  );
}

waitForStore("DraftStore", (s: DraftStore) => (DraftStore = s));
waitForStore("UserStore", (s: UserStore & FluxStore) => (UserStore = s));
waitForStore(
  "SelectedChannelStore",
  (s: SelectedChannelStore & FluxStore) => (SelectedChannelStore = s)
);
waitForStore(
  "SelectedGuildStore",
  (s: FluxStore & Record<string, any>) => (SelectedGuildStore = s)
);
waitForStore("UserProfileStore", (m: any) => (UserProfileStore = m));
waitForStore(
  "ChannelStore",
  (m: ChannelStore & FluxStore) => (ChannelStore = m)
);
waitForStore("GuildStore", (m: GuildStore) => (GuildStore = m));
waitForStore(
  "GuildMemberStore",
  (m: GuildMemberStore & FluxStore) => (GuildMemberStore = m)
);
waitForStore(
  "RelationshipStore",
  (
    m: RelationshipStore & FluxStore & { getSince(userId: string): string }
  ) => (RelationshipStore = m)
);
waitForStore("PermissionStore", (m: any) => (PermissionStore = m));
waitForStore("PresenceStore", (m: any) => (PresenceStore = m));
waitForStore("ReadStateStore", (m: any) => (ReadStateStore = m));
waitForStore("GuildChannelStore", (m: any) => (GuildChannelStore = m));
waitForStore(
  "MessageStore",
  (
    m: Omit<MessageStore, "getMessages"> & {
      getMessages(chanId: string): any;
    }
  ) => (MessageStore = m)
);
waitForStore("WindowStore", (m: WindowStore) => (WindowStore = m));
waitForStore("EmojiStore", (m: EmojiStore) => (EmojiStore = m));
Webpack.waitForModule(Filters.byKeys("SUPPORTS_COPY", "copy")).then(
  (e: Clipboard) => (Clipboard = e)
);

export function SettingsTab({
  title,
  children,
  inModal
}: {
  title: string;
  children: any;
  inModal?: boolean;
}) {
  return (
    <Forms.FormSection>
      {!inModal && <Text
        variant="heading-lg/semibold"
        tag="h2"
        style={{ marginBottom: "16px" }}
      >
        {title}
      </Text>}

      {children}
    </Forms.FormSection>
  );
}

export function chooseFile(mimeTypes: string) {
  return new Promise<File | null>((resolve) => {
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

interface Props
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
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

const ModalAPI = proxyLazy(() => Webpack.getByKeys("openModalLazy"));

/**
 * Wait for the render promise to resolve, then open a modal with it.
 * This is equivalent to render().then(openModal)
 * You should use the Modal components exported by this file
 */
export function openModalLazy(render: () => Promise<RenderFunction>, options?: ModalOptions & { contextKey?: string; }): Promise<string> {
    return ModalAPI.openModalLazy(render, options);
}

/**
 * Open a Modal with the given render function.
 * You should use the Modal components exported by this file
 */
export function openModal(render: RenderFunction, options?: ModalOptions, contextKey?: string): string {
    return ModalAPI.openModal(render, options, contextKey);
}

/**
 * Close a modal by its key
 */
export function closeModal(modalKey: string, contextKey?: string): void {
    return ModalAPI.closeModal(modalKey, contextKey);
}

/**
 * Close all open modals
 */
export function closeAllModals(): void {
    return ModalAPI.closeAllModals();
}

export let Parser: Parser;
Webpack.waitForModule(Filters.byKeys("parseTopic")).then(m => Parser = m);

export function classes(...classes: Array<string | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const enum Theme {
  Dark = 1,
  Light = 2
}

export const UserSettingsActionCreators = proxyLazy(() => Webpack.getByKeys("PreloadedUserSettingsActionCreators"));

export function getTheme(): Theme {
  return UserSettingsActionCreators.PreloadedUserSettingsActionCreators.getCurrentValue()?.appearance?.theme;
}

export function saveSettings(settings: { [key: string]: any }) {
  Data.save("settings", { ...Data.load("settings"), ...settings });
}

export function getSetting(setting: string) {
  return Data.load("settings")[setting];
}

export function getBulkSetting(...settings: string[]) {
  return settings.map(setting => Data.load("settings")[setting]);
}

export function forceUpdate(className: string) {
  const node = document.querySelector(`.${className}`);
  if (!node) return;
  const stateNode = findInTree(getInternalInstance(node), (m: { getPredicateSections: any; }) => m && m.getPredicateSections, {walkable: ["return", "stateNode"]});
  if (stateNode) stateNode.forceUpdate();
}

function getInternalInstance(node) {
  if (node.__reactFiber$) return node.__reactFiber$;
  return node[Object.keys(node).find(k => k.startsWith("__reactInternalInstance") || k.startsWith("__reactFiber"))] || null;
}

function findInTree(tree: { [x: string]: any; hasOwnProperty?: any; } | null, searchFilter: string | number, {walkable = null, ignore = []} = {}) {
  if (typeof searchFilter === "string") {
      if (tree.hasOwnProperty(searchFilter)) return tree[searchFilter];
  }
  else if (searchFilter(tree)) {
      return tree;
  }

  if (typeof tree !== "object" || tree == null) return undefined;

  let tempReturn;
  if (tree instanceof Array) {
      for (const value of tree) {
          tempReturn = findInTree(value, searchFilter, {walkable, ignore});
          if (typeof tempReturn != "undefined") return tempReturn;
      }
  }
  else {
      const toWalk = walkable == null ? Object.keys(tree) : walkable;
      for (const key of toWalk) {
          if (typeof(tree[key]) == "undefined" || ignore.includes(key)) continue;
          tempReturn = findInTree(tree[key], searchFilter, {walkable, ignore});
          if (typeof tempReturn != "undefined") return tempReturn;
      }
  }
  return tempReturn;
}