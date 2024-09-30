import { atom, useAtomValue } from "jotai";
import { BlogPosts, StrapiEntitiesQueryParams } from "../blog-data";
import { searchEntryAtom, selectedCategoriesAtom, selectedTagsAtom } from "./blog-post-query";
import merge from "lodash.merge";
import { atomEffect } from "jotai-effect";

type BlogPosts = Exclude<Awaited<ReturnType<typeof BlogPosts["get"]>>["data"], null | undefined>;

export const pageNumberAtom = atom(1);
export const postsAtom = atom<BlogPosts>([]);

export const subscribeToPosts = atomEffect((get, set)=>{
    const pageNumber = get(pageNumberAtom);
    const searchEntry = get(searchEntryAtom);
    const selectedCategories = get(selectedCategoriesAtom);
    const selectedTags = get(selectedTagsAtom);

    const isFiltered = searchEntry.length > 0 || selectedCategories.length > 0 || selectedTags.length > 0;


    if (!isFiltered) {
        BlogPosts.get({
            pagination: {
                page: pageNumber
            },
            populate: "*"
        }).then((posts)=>{
            if (posts.data) {
                set(postsAtom, posts.data);
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
            populate: "*"
        }).then((posts)=>{
            if (posts.data) {
                set(postsAtom, posts.data);
            }
        });
    }
});


export { useAtom, useAtomValue } from "jotai";
