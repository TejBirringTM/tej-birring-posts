"use client"

import { useAtom, useAtomValue } from "jotai";
import { pageCountAtom, pageNumberAtom, postsAtom, subscribeToPosts } from "../_state/blog-posts";
import { HeadingL3, HeadingL4 } from "./_content/typography";
import Spinner from "./_content/spinner";
import dayjs from "dayjs";
import CalendarCreatedIcon from "@/app/_ui/_assets/_svgs/calendar-created.svg"
import CalendarUpdatedIcon from "@/app/_ui/_assets/_svgs/calendar-updated.svg"
import clsx from "clsx";
import Link from "next/link";
import pluralize from "pluralize";

function TheBlogPosts() {
    const posts = useAtomValue(postsAtom);
    const pageCount = useAtomValue(pageCountAtom);
    const [pageNumber, setPageNumber] = useAtom(pageNumberAtom);
    useAtom(subscribeToPosts);

    if (posts && posts.length > 0) {
        return (
            <div>
                <p className="text-paper text-xl font-bold mb-2">
                    {pluralize("post", posts.length, true)} {pageCount > 1 && <span className="text-xs font-normal">(page {pageNumber} of {pageCount})</span>}
                </p>
                <div className="flex flex-col gap-4">
                { posts.map((post)=>(
                    <Link  
                        key={`post-${post.attributes.Slug}`} 
                        className="card paper p-2 group hover:scale-[101%] opacity-90 hover:opacity-100 active:scale-[98%] active:opacity-50 transition-all border-b-8 hover:border-ecru cursor-pointer flex flex-col"
                        href={`/${post.attributes.Slug}`}
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between order-2">
                            <HeadingL4 className="text-iron mb-1 font-medium">{post.attributes.Category.data.attributes.Title}</HeadingL4>
                            <div className="flex flex-row gap-2">
                                <div className="text-iron fill-iron flex gap-1 items-start">
                                    <CalendarCreatedIcon className="size-4" />
                                    <div>
                                        <span className="text-xs font-normal uppercase leading-none block heading sm:mb-0.5">Published</span>
                                        <span className="text-xs leading-none block">{dayjs(post.attributes.publishedAt).format('ddd D MMM YYYY')}</span>
                                    </div>
                                </div>
                                {
                                    !dayjs(post.attributes.publishedAt).isSame(post.attributes.updatedAt, "day") &&
                                    <div className="text-iron fill-iron flex gap-1 items-start">
                                        <CalendarUpdatedIcon className="size-4" />
                                        <div>
                                            <span className="text-iron text-xs font-normal leading-none uppercase block heading sm:mb-0.5">Updated</span>
                                            <span className="text-iron mb-1 text-xs leading-none block">{dayjs(post.attributes.updatedAt).format('ddd D MMM YYYY')}</span>
                                        </div>
                                    </div>
                                }
                                
                            </div>
                            
                            
                        </div>
                        
                        <HeadingL3 className="text-jet-black mt-1 mb-1 order-1 sm:order-2 underline">{post.attributes.Title}</HeadingL3>
                        
                        {post.attributes.Tags.data.length > 0 && (
                            <div className="flex gap-1 mt-2 mb-2 order-3">
                                { post.attributes.Tags.data.map((tag)=>(
                                    <div key={`tag-${tag.attributes.Slug}`} className="text-xs text-paper bg-iron/80 rounded-full inline-block px-2 py-0.5 font-medium">
                                        {tag.attributes.Title}
                                    </div>
                                ))}
                            </div>
                        )}
                        

                        { post.attributes.Excerpt && 
                         <p className="max-w-prose max-h-[0vh] overflow-hidden group-hover:max-h-[100vh] transition-all duration-1000 order-4 group-hover:mt-2 opacity-0 group-hover:opacity-100"> 
                            {post.attributes.Excerpt}
                         </p>
                        }

                        
                    </Link>
                ))}
                </div>
                {
                    (pageCount > 1) && <div className="flex flex-row gap-2 mt-4">
                        {
                            Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumberOption)=>(
                                <button key={`page-no-${pageNumberOption}`} className={clsx("border border-paper rounded-full size-6 flex flex-col items-center justify-center text-xs font-semibold leading-none hover:bg-paper hover:text-iron transition-all", {"text-iron bg-paper cursor-default": pageNumberOption === pageNumber}, {"text-paper": pageNumberOption !== pageNumber})} onClick={()=>setPageNumber(pageNumberOption)}>
                                    <span className="-mb-0.5">{pageNumberOption}</span>
                                </button>
                            ))
                        }
                    </div>
                }
            </div>
        ); 
    } else if (posts && posts.length === 0) {
        return (
            <p className="text-paper text-xl font-bold">No posts found.</p>
        )
    } else {
        return (
            <div className="flex flex-row items-center gap-2">
                <Spinner fabric="paper" />
                <span className="text-paper text-xl font-semibold">Loading posts...</span>
            </div>
        )
    }
}

export default function TheBlogPostsPagination() {
    return (
        // TODO: Implement suspense boundary
        <div className="m-4">
            <TheBlogPosts />
        </div>
    )
}