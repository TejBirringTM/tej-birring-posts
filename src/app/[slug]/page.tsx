import { BlogPosts } from "@/app/strapi-data-source";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { Title } from "../_ui/_content/typography";
import { Card, CardContent } from "../_ui/_content/card";
import CalendarCreatedIcon from "@/app/_ui/_assets/_svgs/calendar-created.svg"
import CalendarUpdatedIcon from "@/app/_ui/_assets/_svgs/calendar-updated.svg"
import dayjs from "dayjs";
import AngleLeftIcon from "@/app/_ui/_assets/_svgs/angle-small-left.svg";
import { notFound } from 'next/navigation'
import Link from "next/link";

type BlogPostParams = {
    params: {
        slug: string
    }
}

export default async function BlogPostPage(params: BlogPostParams) {
    const blogPostSlug = params.params.slug;
    const blogPost = (await BlogPosts.get({
            filters: {
                Slug: {
                    $eq: blogPostSlug
                }
            },
            populate: "*"
        })).data[0] ?? undefined;
    
    if (!blogPost) {
        return notFound();
    }

    return (
        <main className="min-h-screen">

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
                <CardContent>
                    <div className="mb-2">
                        <Title className="text-paper text-center sm:text-left">{blogPost.attributes.Title}</Title>
                        <p className="text-paper text-lg text-center sm:text-left">in <a className="font-bold underline cursor-pointer hover:rounded-full hover:px-2 hover:py-05 hover:bg-paper hover:text-iron transition-all" href={`/?search=&categories%5B0%5D=${blogPost.attributes.Category.data.attributes.Slug}`}>{blogPost.attributes.Category.data.attributes.Title}</a></p>
                    </div>

                    <div className="flex flex-col items-center sm:flex-row sm:items-start">
                        {blogPost.attributes.Tags.data.length > 0 && (
                            <div className="flex gap-1 order-3">
                                { blogPost.attributes.Tags.data.map((tag)=>(
                                    <a key={tag.attributes.Slug} className="text-xs text-paper border-paper hover:bg-paper hover:text-iron border rounded-full inline-block px-2 py-0.5 cursor-pointer transition-all" href={`http://localhost:3000/?search=&tags%5B0%5D=${tag.attributes.Slug}`}>
                                        {tag.attributes.Title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-row justify-stretch gap-4 sm:mx-4">
                <Card fabric="paper" className="grow xl:max-w-fit">
                    <CardContent className="text-jet-black content overflow-hidden [&_a]:text-iron-trim">
                        <BlocksRenderer content={blogPost.attributes.Content} />
                    </CardContent>
                </Card>

                {/* Nav Panel */}
                <Card fabric="paper" className="hidden xl:block grow bg-opacity-10">
                    <CardContent className="text-jet-black p-2 overflow-hidden [&_a]:text-iron-trim">
                        <h5>Adverts</h5>
                    </CardContent>
                </Card>

                {/* Ads Panel */}
                {/* <Card fabric="paper" className="hidden xl:block grow">
                    <CardContent className="text-jet-black p-2 overflow-hidden [&_a]:text-iron-trim">
                        <h5>asd</h5>
                    </CardContent>
                </Card> */}
            </div>
            
        </main>
    )
}