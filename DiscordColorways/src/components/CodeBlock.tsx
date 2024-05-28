import { Parser, Webpack, proxyLazy } from "../../../common";

const CodeContainerClasses = proxyLazy(() => Webpack.getByKeys("markup", "codeContainer"));

/**
 * Renders code in a Discord codeblock
 */
export function CodeBlock(props: { content?: string, lang: string; }) {
    return (
        <div className={CodeContainerClasses.markup}>
            {Parser.defaultRules.codeBlock.react(props, null, {})}
        </div>
    );
}