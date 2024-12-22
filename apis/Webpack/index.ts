import { Webpack as $Webpack } from "betterdiscord";
import { proxyLazy } from "../../lazy";

export function getByKeysLazy(...props: WithOptions<string, BaseSearchOptions>) {
    return proxyLazy(() => $Webpack.getByKeys(...props))
}
export function getByPrototypeKeysLazy(...props: WithOptions<string, BaseSearchOptions>) {
    return proxyLazy(() => $Webpack.getByPrototypeKeys(...props))
}
export function getByStringsLazy(...props: WithOptions<string, BaseSearchOptions>) {
    return proxyLazy(() => $Webpack.getByStrings(...props))
}
export function getLazy(filter: ModuleFilter, options?: SearchOptions<boolean> | undefined) {
    return proxyLazy(() => $Webpack.getModule(filter, options))
}

export type FilterFn = (mod: any) => boolean;

export const Filters = {
  ...$Webpack.Filters,
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