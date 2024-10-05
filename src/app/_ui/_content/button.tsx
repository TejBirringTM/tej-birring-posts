"use client";

import { PropsWithChildren } from "react";
import { FabricComponent, Size } from "../theme";
import clsx from "clsx";

type CardProps = {
    size?: Size,
} & FabricComponent & React.HTMLAttributes<HTMLButtonElement>;

export default function Button(props: PropsWithChildren<CardProps>) {
    return (
        <button {...props} className={clsx("button", props.className, props.fabric, props.size ?? 'md')}>
            {props.children}
        </button>
    )
}
