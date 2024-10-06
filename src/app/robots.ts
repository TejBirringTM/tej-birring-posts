import type { MetadataRoute } from 'next'
import { BlogPosts, SiteData } from './strapi-data-source'
 
export default async function robots(): Promise<MetadataRoute.Robots> {

    const siteData = await SiteData.get();
    const posts = await BlogPosts.getAll();
    const url = (suffix: string) => {
        return new URL(suffix, siteData.data.attributes.BaseURL).href;
    }

  return {
    rules: {
      userAgent: '*',
      allow: [
        "/",
        ...posts.map((post)=>`/${post.attributes.Slug}`)
      ],
    },
    sitemap: url("/sitemap.xml"),
  }
}
