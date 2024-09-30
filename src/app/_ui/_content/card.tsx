import React from "react";
import { FabricComponent } from "../theme";
import clsx from "clsx";

type CardProps = {
    trim?: "true"
} & FabricComponent & React.HTMLAttributes<HTMLDivElement>;

export function Card(props: CardProps) {
    return (
        <div {...props} className={clsx(props.className, "card", props.fabric, {'trim': props.trim})}>
        </div>
    )
}

type CardContentProps = {} & React.HTMLAttributes<HTMLDivElement>;
export function CardContent(props: CardContentProps) {
    return (
        <div {...props}  className="px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
        </div>
    )
}