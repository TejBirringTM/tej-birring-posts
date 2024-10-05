import { SiteData } from "../strapi-data-source";
import { Title } from "./_content/typography";
import Pen from "@/app/_ui/_assets/_svgs/pen-circle.svg"

export default async function TheHeader() {
    const siteData = await SiteData.get();
    return (
        <header className="flex flex-row items-center justify-center sm:justify-between">
            <a className="py-6 px-3" href="/">
                <Title className="text-ecru fill-ecru text-center sm:text-left">
                    <Pen className="hidden sm:inline-block size-14 mr-4 -mt-4" />
                    Tej Birring
                </Title>
                { siteData.data.attributes.Slogan &&
                    <p className="relative sm:block text-paper font-medium sm:ml-[4.7rem] -mt-0.5 -z-10 text-center sm:text-left">
                        { siteData.data.attributes.Slogan }    
                    </p>
                }
            </a>
          
        </header>
    )
}
