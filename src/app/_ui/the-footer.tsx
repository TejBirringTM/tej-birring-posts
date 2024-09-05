import { Paragraph, Title } from "./_content/typography";
import Pen from "@/app/_ui/_assets/_svgs/pen-circle.svg"

export default function TheFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-jet-black p-4">
            <Title className="text-[1.7rem] mb-2 text-paper fill-paper">
                <Pen className="inline-block size-8 mr-2 -mt-2" />
                Tej Birring
            </Title>
            <Paragraph className="text-xs leading-none text-ecru max-w-72 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae suscipit diam. Ut scelerisque finibus nisi, sit amet cursus erat feugiat interdum. Quisque a nibh lectus. Nullam urna velit, rhoncus sit amet nisi at, elementum cursus nibh. 
            </Paragraph>
            <Paragraph className="text-paper text-xs tracking-wider leading-none">Copyright © {year} Tej Birring</Paragraph>
        </footer>
    )
}
