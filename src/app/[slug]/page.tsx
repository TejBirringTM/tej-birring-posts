import { BlogPosts, SiteData } from "@/app/strapi-data-source";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { Title } from "../_ui/_content/typography";
import { Card, CardContent } from "../_ui/_content/card";
import CalendarCreatedIcon from "@/app/_ui/_assets/_svgs/calendar-created.svg"
import CalendarUpdatedIcon from "@/app/_ui/_assets/_svgs/calendar-updated.svg"
import dayjs from "dayjs";
import AngleLeftIcon from "@/app/_ui/_assets/_svgs/angle-small-left.svg";
import { notFound, redirect } from 'next/navigation'
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import JsonLinkingData from "../_ui/_content/json-linking-data";
import { WithContext, Article, CategoryCode, DefinedTerm } from 'schema-dts'
import config from "@/config";

type BlogPostArgs = {
    params: {
        slug: string
    }
}
  
export async function generateMetadata(
    { params }: BlogPostArgs,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    const siteData = await SiteData.get();
    const blogPost = await getBlogPostFromSlug(params.slug);
    if (!blogPost) {
        return {
            title: `Post Not Found — ${siteData.data.attributes.Title}`
        };
    }
    return {
      title: `${blogPost.attributes.Title} — ${siteData.data.attributes.Title}`,
      description: siteData.data.attributes.Description,
      applicationName: siteData.data.attributes.Title,
      publisher: siteData.data.attributes.Title,
      
      authors: siteData.data.attributes.Author ? {
        name: `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}`,
        url: siteData.data.attributes.Author.LinkedInProfileURL ?? undefined
      } : undefined,
      generator: undefined,
      
      creator: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : siteData.data.attributes.Title,
  
      robots: {index: true, follow: true},
  
      openGraph: {
        title: blogPost.attributes.Title,
        description: blogPost.attributes.Excerpt ?? siteData.data.attributes.Description ?? undefined,
        url: new URL(`/${params.slug}`, siteData.data.attributes.BaseURL).href,

        siteName: siteData.data.attributes.Title,
        determiner: siteData.data.attributes.TitleDeterminer === "(empty)" ? "" : siteData.data.attributes.TitleDeterminer,
        emails: siteData.data.attributes.Author?.EmailAddress ?? undefined,
        phoneNumbers: siteData.data.attributes.Author?.PhoneNumber ?? undefined,
        locale: "en",

        type: "article",
        authors: siteData.data.attributes.Author ?  `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : undefined,
        publishedTime: blogPost.attributes.publishedAt,
        modifiedTime: blogPost.attributes.updatedAt,
        section: blogPost.attributes.Category.data.attributes.Title,
        tags: blogPost.attributes.Tags.data.map((tag)=>tag.attributes.Title)
      },
  
      // twitter: {
      //   title: siteData.data.attributes.Title,
      //   description: siteData.data.attributes.Description ?? undefined,
      //   creator: siteData.data.attributes.Author ?  `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : undefined,
      // },
    }
  }

async function getBlogPostFromSlug(slug: string) {
    const blogPostSlug = slug;

    const blogPost = (await BlogPosts.get({
        filters: {
            Slug: {
                $eq: blogPostSlug
            }
        },
        populate: "*"
    }));    
    
    if (!blogPost) {
        return undefined;
    } else {
        return blogPost.data[0]
    }        
} 

export default async function BlogPostPage({params}: BlogPostArgs) {
    if (params.slug === "admin") {
        return redirect(`${config.STRAPI_BASE_URL}/admin`);
    }

    const siteData = await SiteData.get();
    const blogPost = await getBlogPostFromSlug(params.slug);
    if (!blogPost) {
        return notFound();
    }

    const year = new Date().getFullYear();
    const urlString = (route: string) => new URL(route, siteData.data.attributes.BaseURL).href;

    const jsonLd: WithContext<Article> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        
        copyrightHolder: siteData.data.attributes.CopyrightOwner,
        copyrightNotice: `Copyright © ${year} ${ siteData.data.attributes.CopyrightOwner }`,
        copyrightYear: year,
        
        
        name: blogPost.attributes.Title,
        description: blogPost.attributes.Excerpt ?? undefined,
        dateModified: blogPost.attributes.updatedAt,
        datePublished: blogPost.attributes.publishedAt,

        inLanguage: {
          "@type": "Language",
          name: "English"
        },
    
        author: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : undefined,
        publisher: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : siteData.data.attributes.Title,
    
        url: urlString(`/${blogPost.attributes.Slug}`),
        
        isFamilyFriendly: true,
        isAccessibleForFree: true,
    
        
        keywords: blogPost.attributes.Tags.data.map((tag)=>({
            "@type": "DefinedTerm",
            name: tag.attributes.Title,
            description: tag.attributes.Description ?? undefined,
            termCode: tag.attributes.Slug,
            url: urlString(`/?search=&tags%5B0%5D=${tag.attributes.Slug}`),
        } satisfies DefinedTerm)),
    
        about: {
            "@type": "CategoryCode",
            name: blogPost.attributes.Category.data.attributes.Title,
            description: blogPost.attributes.Category.data.attributes.Description ?? undefined,
            url: urlString(`/?search=&categories%5B0%5D=${blogPost.attributes.Category.data.attributes.Slug}`),
            termCode: blogPost.attributes.Category.data.attributes.Slug,
          } satisfies CategoryCode
      }

    return (
        <main className="min-h-screen">
            <JsonLinkingData jsonLd={jsonLd} />

            <div className="flex flex-row justify-between mb-4 mx-2 sm:mx-4">
                <Link className="rounded-full flex flex-row justify-center items-center hover:bg-bright-white hover:fill-iron fill-bright-white border-bright-white border size-8 opacity-80 cursor-pointer hover:opacity-100 transition-opacity" href="/">
                    <AngleLeftIcon className="size-3 block" />
                </Link>

                <div className="flex flex-row gap-2 text-paper/80 fill-paper/70">
                    <div className="flex gap-1 items-start">
                        <CalendarCreatedIcon className="size-4" />
                        <div>
                            <span className="text-xs font-normal uppercase leading-none block heading sm:mb-0.5">Published</span>
                            <span className="text-xs leading-none block">{dayjs(blogPost.attributes.publishedAt).format('ddd D MMM YYYY')}</span>
                        </div>
                    </div>
                    {
                        !dayjs(blogPost.attributes.publishedAt).isSame(blogPost.attributes.updatedAt, "day") &&
                        <div className="flex gap-1 items-start">
                            <CalendarUpdatedIcon className="size-4" />
                            <div>
                                <span className="text-xs font-normal leading-none uppercase block heading sm:mb-0.5">Updated</span>
                                <span className="mb-1 text-xs leading-none block">{dayjs(blogPost.attributes.updatedAt).format('ddd D MMM YYYY')}</span>
                            </div>
                        </div>
                    }
                                    
            </div>

            </div>

            <Card fabric="iron" className="sm:mx-4 mb-4" trim="true">
                <CardContent className="lg:px-14 xl:px-24 xl:py-8">
                    <div className="mb-2">
                        <Title className="text-paper text-center sm:text-left">{blogPost.attributes.Title}</Title>
                        <p className="text-paper text-lg text-center sm:text-left">in <a className="font-bold underline cursor-pointer hover:rounded-full hover:px-2 hover:py-05 hover:bg-paper hover:text-iron transition-all" href={`/?search=&categories%5B0%5D=${blogPost.attributes.Category.data.attributes.Slug}`}>{blogPost.attributes.Category.data.attributes.Title}</a></p>
                    </div>

                    <div className="flex flex-col items-center sm:flex-row sm:items-start">
                        {blogPost.attributes.Tags.data.length > 0 && (
                            <div className="flex gap-1 order-3">
                                { blogPost.attributes.Tags.data.map((tag)=>(
                                    <Link key={tag.attributes.Slug} className="text-xs text-paper border-paper hover:bg-paper hover:text-iron border rounded-full inline-block px-2 py-0.5 cursor-pointer transition-all" href={`/?search=&tags%5B0%5D=${tag.attributes.Slug}`}>
                                        {tag.attributes.Title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-row justify-stretch gap-4 sm:mx-4">
                <Card fabric="paper" className="grow xl:max-w-fit lg:px-14 lg:py-4">
                    <CardContent className="text-jet-black content overflow-hidden [&_a]:text-iron-trim">
                        <BlocksRenderer content={blogPost.attributes.Content} />
                    </CardContent>
                </Card>

                {/* Navigation Panel */}
                {/* <Card fabric="papyrus" className="hidden xl:block grow">
                    <CardContent className="text-leather p-2 overflow-hidden [&_a]:text-iron-trim">
                        <h6>Menu</h6>
                    </CardContent>
                </Card> */}
            </div>
            
        </main>
    )
}