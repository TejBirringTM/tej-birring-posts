import { atom } from "jotai";
import { BlogPosts } from "../strapi-data-source";
import { searchEntryAtom, selectedCategoriesAtom, selectedTagsAtom } from "./blog-post-query";
import merge from "lodash.merge";
import { atomEffect } from "jotai-effect";

type BlogPosts = Awaited<ReturnType<typeof BlogPosts["get"]>>["data"];

// *** Note: We are using Strapi API for sorting, not the below function which is currently redundant ***
// function sortPosts(posts: BlogPosts) {
//     // sort alphabetically, by title
//     posts = posts.sort((a, b)=>a.attributes.Title.localeCompare(b.attributes.Title));
//     // sort chronologically, by date updated
//     posts = posts.sort((a, b)=>dayjs(a.attributes.updatedAt).diff(b.attributes.updatedAt));
//     // return sorted
//     return posts;
// }

export const pageNumberAtom = atom(1);
export const pageCountAtom = atom(1);

export const postsAtom = atom<BlogPosts|undefined>();

export const subscribeToPosts = atomEffect((get, set)=>{
    const pageNumber = get(pageNumberAtom);
    const searchEntry = get(searchEntryAtom);
    const selectedCategories = get(selectedCategoriesAtom);
    const selectedTags = get(selectedTagsAtom);

    const isFiltered = searchEntry.length > 0 || selectedCategories.length > 0 || selectedTags.length > 0;
    
    if (!isFiltered) {
        BlogPosts.get({
            pagination: {
                page: pageNumber,
                pageSize: 25
            },
            populate: "*",
            sort: [
                "Title:asc",
                "updatedAt:asc"
            ]
        }).then((posts)=>{
            if (posts.data) {
                set(postsAtom, posts.data);
            }
            if(posts.meta?.pagination) {
                set(pageNumberAtom, posts.meta.pagination.page);
                set(pageCountAtom, posts.meta.pagination.pageCount);
            }            
        });
    } else {
        let filters = {};
        if (searchEntry) {
            merge(filters, {
                $or: [
                    {
                        Title: {
                            $containsi: searchEntry
                        }
                    },
                    {
                        Content: {
                            $containsi: searchEntry
                        }
                    }
                ]
            });
        }
        if (selectedCategories) {
            merge(filters, {
                Category: {
                    id: {
                        $in: selectedCategories.map((cat)=>cat.id)
                    }
                }
            });
        }
        if (selectedTags) {
            merge(filters, {
                Tags: {
                    id: {
                        $in: selectedTags.map((tag)=>tag.id)
                    }
                }
            });
        }
        BlogPosts.get({
            filters,
            populate: "*",
            sort: [
                "Title:asc",
                "updatedAt:asc"
            ]
        }).then((posts)=>{
            if (posts.data) {
                set(postsAtom, posts.data);
            }
            if(posts.meta?.pagination) {
                set(pageNumberAtom, posts.meta.pagination.page);
                set(pageCountAtom, posts.meta.pagination.pageCount);
            }
        });
    }
});


export { useAtom, useAtomValue } from "jotai";
