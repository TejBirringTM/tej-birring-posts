import TheSearchBox from "./_ui/the-search-box-client";
import TheCategoriesSelector from "./_ui/the-categories-selector-client";
import TheTagsSelector from "./_ui/the-tags-selector-client";
import TheBlogPosts from "./_ui/the-blog-posts-pagination";
import { Metadata, ResolvingMetadata } from "next";
import { Categories, SiteData, Tags } from "./strapi-data-source";
import { WithContext, WebSite, CategoryCode, DefinedTerm } from 'schema-dts'
import JsonLinkingData from "./_ui/_content/json-linking-data";
import { Suspense } from "react";

type BlogPostArgs = {
    params: {
        slug: string
    }
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siteData = await SiteData.get();

  return {
    title: siteData.data.attributes.Title,
    description: siteData.data.attributes.Description,
    applicationName: siteData.data.attributes.Title,
    
    authors: siteData.data.attributes.Author ? {
      name: `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}`,
      url: siteData.data.attributes.Author.LinkedInProfileURL ?? undefined
    } : undefined,
    generator: undefined,
    
    publisher: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : siteData.data.attributes.Title,
    creator: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : siteData.data.attributes.Title,

    robots: {index: true, follow: true},

    openGraph: {
      siteName: siteData.data.attributes.Title,
      determiner: siteData.data.attributes.TitleDeterminer === "(empty)" ? "" : siteData.data.attributes.TitleDeterminer,
      description: siteData.data.attributes.Description ?? undefined,
      emails: siteData.data.attributes.Author?.EmailAddress ?? undefined,
      phoneNumbers: siteData.data.attributes.Author?.PhoneNumber ?? undefined,
      locale: "en",
      url: new URL("/", siteData.data.attributes.BaseURL).href,

      type: "profile", // alternatively, use "website" and comment out the below lines
      firstName: siteData.data.attributes.Author?.FirstName,
      lastName: siteData.data.attributes.Author?.LastName,
      gender: siteData.data.attributes.Author?.Gender
    },

    // twitter: {
    //   title: siteData.data.attributes.Title,
    //   description: siteData.data.attributes.Description ?? undefined,
    //   creator: siteData.data.attributes.Author ?  `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : undefined,
    // },
  }
}

export default async function HomePage() {
  const siteData = await SiteData.get();
  const categories = await Categories.getAll();
  const tags = await Tags.getAll();

  const year = new Date().getFullYear();
  const urlString = (route: string) => new URL(route, siteData.data.attributes.BaseURL).href;

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    
    copyrightHolder: siteData.data.attributes.CopyrightOwner,
    copyrightNotice: `Copyright © ${year} ${ siteData.data.attributes.CopyrightOwner }`,
    copyrightYear: year,
    
    name: siteData.data.attributes.Title,
    description: siteData.data.attributes.Description ?? undefined,
    
    inLanguage: {
      "@type": "Language",
      name: "English"
    },

    author: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : undefined,
    publisher: siteData.data.attributes.Author ? `${siteData.data.attributes.Author.FirstName} ${siteData.data.attributes.Author.LastName}` : siteData.data.attributes.Title,

    url: urlString("/"),
    
    isFamilyFriendly: true,
    isAccessibleForFree: true,

    keywords: tags.map((tag)=>({
        "@type": "DefinedTerm",
        name: tag.attributes.Title,
        description: tag.attributes.Description ?? undefined,
        termCode: tag.attributes.Slug,
        url: urlString(`/?search=&tags%5B0%5D=${tag.attributes.Slug}`),
    } satisfies DefinedTerm)),

    about: {
      "@type": "CategoryCodeSet",
      name: "Subject Categories",
      hasCategoryCode: categories.map((cat)=>({
        "@type": "CategoryCode",
        name: cat.attributes.Title,
        description: cat.attributes.Description ?? undefined,
        url: urlString(`/?search=&categories%5B0%5D=${cat.attributes.Slug}`),
        termCode: cat.attributes.Slug,
      } satisfies CategoryCode)),
    }
  }

  return (
      <main className="min-h-screen">
        <JsonLinkingData jsonLd={jsonLd} />

        <Suspense>
          <TheSearchBox />

          <div className="flex flex-col sm:flex-row sm:justify-stretch gap-4 mb-4 px-4">
            <TheCategoriesSelector />
            <TheTagsSelector />
          </div>
          
          <TheBlogPosts />
        </Suspense>
      </main>
  );
}
