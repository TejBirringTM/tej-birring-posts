import { SiteData } from "../blog-data";
import { Paragraph, Title } from "./_content/typography";
import Pen from "@/app/_ui/_assets/_svgs/pen-circle.svg"
import { TheFooterSocialMediaLinks } from "./the-footer-social-media-links";
import Link from "next/link";

export default async function TheFooter() {
    const siteData = await SiteData.get();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-jet-black px-4 pt-4 pb-2 mt-12">
            <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                    <Link href="/" className="block w-fit">
                        <Title className="text-[1.7rem] mb-2 text-paper fill-paper">
                            <Pen className="inline-block size-8 mr-2.5 -mt-2" />
                            Tej Birring
                        </Title>
                    </Link>
                    
                    { siteData.data.attributes.Description && 
                        <Paragraph className="text-xs leading-none text-ecru max-w-72 mb-4">
                            { siteData.data.attributes.Description }
                        </Paragraph>
                    }
                    
                    <TheFooterSocialMediaLinks />                    
                </div>

                <div className="flex flex-col justify-end">
                    <Paragraph className="text-paper/70 text-xs tracking-wider leading-none">Copyright © {year} Tej Birring</Paragraph>
                </div>
            </div>


            

            
        </footer>
    )
}
