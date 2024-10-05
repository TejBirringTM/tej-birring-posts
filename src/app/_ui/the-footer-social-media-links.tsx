import { SiteData } from "../blog-data"
import LinkedIn from "@/app/_ui/_assets/_svgs/pixel-perfect-filled/social/linkedin.svg";

export async function TheFooterSocialMediaLinks() {
    const siteData = await SiteData.get();
    
    return <div className="mb-4 md:mb-0">
        <span className="text-xs text-papyrus">Stay up to date and connect with me on:</span>
        <div className="mb-2 md:mb-0 flex flex-row gap-4">
            {
                siteData.data.attributes.LinkedInProfileURL &&
                <a href={siteData.data.attributes.LinkedInProfileURL} className="border rounded-full border-papyrus fill-papyrus flex items-center justify-center size-6 p-1.5 hover:bg-papyrus hover:fill-onyx-black transition-all">
                    <LinkedIn className="w-fit h-fit" />
                </a>
            }    
        </div>
    </div>
}
