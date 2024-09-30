"use client"

import { useAtom, useAtomValue } from "jotai";
import { postsAtom, subscribeToPosts } from "../_state/blog-posts";

export default function TheBlogPostsPagination() {
    const posts = useAtomValue(postsAtom);
    useAtom(subscribeToPosts);

    return (
        <div>
            { posts.map((post)=>(
                <div key={`post-${post.id}`}>
                    {post.attributes.Title}
                </div>
            ))}
        </div>
    ); 
}