import { PropsWithChildren } from "react";

type TitleProps = {} & React.HTMLAttributes<HTMLHeadingElement>;
export const Title = (props: PropsWithChildren<TitleProps>) => (<h1 {...props}></h1>);

type HeadingL1Props = {} & React.HTMLAttributes<HTMLHeadingElement>;
export const HeadingL1 = (props: PropsWithChildren<HeadingL1Props>) => (<h2 {...props}></h2>);

type HeadingL2Props = {} & React.HTMLAttributes<HTMLHeadingElement>;
export const HeadingL2 = (props: PropsWithChildren<HeadingL2Props>) => (<h3 {...props}></h3>);

type HeadingL3Props = {} & React.HTMLAttributes<HTMLHeadingElement>;
export const HeadingL3 = (props: PropsWithChildren<HeadingL3Props>) => (<h4 {...props}></h4>);

type ParagraphProps = {} & React.HTMLAttributes<HTMLParagraphElement>;
export const Paragraph = (props: PropsWithChildren<ParagraphProps>) => (<p {...props}></p>);