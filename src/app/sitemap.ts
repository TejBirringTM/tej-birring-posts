import type { MetadataRoute } from 'next'
import { BlogPosts, SiteData } from './strapi-data-source';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (suffix: string) => {
    return new URL(suffix, siteData.data.attributes.BaseURL).href;
  }
  
  const siteData = await SiteData.get();
  const posts = await BlogPosts.getAll();

  return [
    {
      url: url("/"),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.1
    },
    ...posts.map((post)=>({
        url: url(`/post/${post.attributes.Slug}`),
        lastModified: post.attributes.updatedAt,
        changeFrequency: 'weekly',
        priority: 1.0
    }) satisfies MetadataRoute.Sitemap[0])
  ]
}