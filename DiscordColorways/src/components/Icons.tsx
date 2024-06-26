import type { SVGProps } from "react";
import { classes } from "../../../common";

interface BaseIconProps extends IconProps {
    viewBox: string;
}

interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
    height?: string | number;
    width?: string | number;
}

function Icon({ height = 24, width = 24, className, children, viewBox, ...svgProps }: PropsWithChildren<BaseIconProps>) {
    return (
        <svg
            className={classes(className, "dc-icon")}
            role="img"
            width={width}
            height={height}
            viewBox={viewBox}
            {...svgProps}
        >
            {children}
        </svg>
    );
}

export function PalleteIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-pallete-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M 12,0 C 5.3733333,0 0,5.3733333 0,12 c 0,6.626667 5.3733333,12 12,12 1.106667,0 2,-0.893333 2,-2 0,-0.52 -0.2,-0.986667 -0.52,-1.346667 -0.306667,-0.346666 -0.506667,-0.813333 -0.506667,-1.32 0,-1.106666 0.893334,-2 2,-2 h 2.36 C 21.013333,17.333333 24,14.346667 24,10.666667 24,4.7733333 18.626667,0 12,0 Z M 4.6666667,12 c -1.1066667,0 -2,-0.893333 -2,-2 0,-1.1066667 0.8933333,-2 2,-2 1.1066666,0 2,0.8933333 2,2 0,1.106667 -0.8933334,2 -2,2 z M 8.666667,6.6666667 c -1.106667,0 -2.0000003,-0.8933334 -2.0000003,-2 0,-1.1066667 0.8933333,-2 2.0000003,-2 1.106666,0 2,0.8933333 2,2 0,1.1066666 -0.893334,2 -2,2 z m 6.666666,0 c -1.106666,0 -2,-0.8933334 -2,-2 0,-1.1066667 0.893334,-2 2,-2 1.106667,0 2,0.8933333 2,2 0,1.1066666 -0.893333,2 -2,2 z m 4,5.3333333 c -1.106666,0 -2,-0.893333 -2,-2 0,-1.1066667 0.893334,-2 2,-2 1.106667,0 2,0.8933333 2,2 0,1.106667 -0.893333,2 -2,2 z"
            />
        </Icon>
    );
}

export function CloseIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-close-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
            />
        </Icon>
    );
}

export function DownloadIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-download-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1ZM3 20a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z"
            />
        </Icon>
    );
}

export function ImportIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-import-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M.9 3a.9.9 0 0 1 .892.778l.008.123v16.201a.9.9 0 0 1-1.792.121L0 20.102V3.899A.9.9 0 0 1 .9 3Zm14.954 2.26.1-.112a1.2 1.2 0 0 1 1.584-.1l.113.1 5.998 5.998a1.2 1.2 0 0 1 .1 1.584l-.1.112-5.997 6.006a1.2 1.2 0 0 1-1.799-1.584l.1-.113 3.947-3.954H4.8a1.2 1.2 0 0 1-1.191-1.06l-.008-.14a1.2 1.2 0 0 1 1.06-1.192l.14-.008h15.103l-3.95-3.952a1.2 1.2 0 0 1-.1-1.585l.1-.112z"
            />
        </Icon>
    );
}

export function IDIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-id-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M15.3 14.48c-.46.45-1.08.67-1.86.67h-1.39V9.2h1.39c.78 0 1.4.22 1.86.67.46.45.68 1.22.68 2.31 0 1.1-.22 1.86-.68 2.31Z"
            />
            <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm1 15h2.04V7.34H6V17Zm4-9.66V17h3.44c1.46 0 2.6-.42 3.38-1.25.8-.83 1.2-2.02 1.2-3.58s-.4-2.75-1.2-3.58c-.79-.83-1.92-1.25-3.38-1.25H10Z"
                clip-rule="evenodd"
            />
        </Icon>
    );
}

export function CodeIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-code-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M9.6 7.8 4 12l5.6 4.2a1 1 0 0 1 .4.8v1.98c0 .21-.24.33-.4.2l-8.1-6.4a1 1 0 0 1 0-1.56l8.1-6.4c.16-.13.4-.01.4.2V7a1 1 0 0 1-.4.8ZM14.4 7.8 20 12l-5.6 4.2a1 1 0 0 0-.4.8v1.98c0 .21.24.33.4.2l8.1-6.4a1 1 0 0 0 0-1.56l-8.1-6.4a.25.25 0 0 0-.4.2V7a1 1 0 0 0 .4.8Z"
            />
        </Icon>
    );
}

export function MoreIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-more-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                clip-rule="evenodd"
            />
        </Icon>
    );
}

export function PlusIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-plus-icon")}
            viewBox="0 0 18 18"
        >
            <polygon
                fill-rule="nonzero"
                fill="currentColor"
                points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"
            />
        </Icon>
    );
}

/**
 * Discord's copy icon, as seen in the user popout right of the username when clicking
 * your own username in the bottom left user panel
 */
export function CopyIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-copy-icon")}
            viewBox="0 0 24 24"
        >
            <g fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z" />
                <path d="M15 5H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
            </g>
        </Icon>
    );
}

export function DeleteIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "dc-delete-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"
            />
            <path
                fill="currentColor"
                d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"
            />
        </Icon>
    );
}