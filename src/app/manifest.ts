import type { MetadataRoute } from 'next'
import { SiteData } from './strapi-data-source';
 
export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const siteData = await SiteData.get();

  return {
    name: siteData.data.attributes.Title,
    short_name: siteData.data.attributes.Title,
    description: siteData.data.attributes.Description ?? undefined,
    start_url: '/',
    display: 'standalone',
    background_color: '#404041',
    theme_color: '#e6c27c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}