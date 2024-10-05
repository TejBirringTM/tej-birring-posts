import clsx from "clsx";
import { FabricComponent } from "../theme";

type SpinnerProps = {
} & FabricComponent & React.HTMLAttributes<HTMLDivElement>;

export default function Spinner(props: SpinnerProps) {
    return <div className={clsx(props.className, "spinner", props.fabric)}></div>
}
