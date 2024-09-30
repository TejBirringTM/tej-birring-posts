import { atom, useAtom } from 'jotai';
import { BlogPosts, Categories, Tags } from '../blog-data';
import { atomEffect } from 'jotai-effect'
import qs from "qs";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export const searchEntryAtom = atom("");

export const availableCategoriesAtom = atom(async () => await Categories.getAll());
export const availableTagsAtom = atom(async () => await Tags.getAll());

export const selectedCategoriesAtom = atom<Awaited<ReturnType<typeof Categories.getAll>>>([]);
export const selectedTagsAtom = atom<Awaited<ReturnType<typeof Tags.getAll>>>([]);

// push (client-side) state to URL query
export const queryToHistoryState = atomEffect((get, set)=>{
    const searchEntry = get(searchEntryAtom);
    const selectedCategories = get(selectedCategoriesAtom);
    const selectedTags = get(selectedTagsAtom);

    const queryString = qs.stringify({
        search: searchEntry,
        categories: selectedCategories.map((cat)=>cat.attributes.Slug),
        tags: selectedTags.map((tag)=>tag.attributes.Slug)
    });
    
    const url = new URL(window.location.href);
    url.search = queryString;
    window.history.pushState(undefined, '', url);
});

// push URL query to (client-side) state
export function historyStateToQuery() {
    const searchParams = useSearchParams();
    const [searchEntry, setSearchEntry] = useAtom(searchEntryAtom);
    const [availableCategories] = useAtom(availableCategoriesAtom);
    const [selectedCategories, setSelectedCategories] = useAtom(selectedCategoriesAtom);
    const [availableTags] = useAtom(availableTagsAtom);
    const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);

    useEffect(()=>{
        const queryString = searchParams.toString();
        const query = qs.parse(queryString);
        
        if (typeof query.search === "string") {
            setSearchEntry(query.search);
        }

        if (query.categories) {
            const selectedCategories = availableCategories.filter((cat)=>(query.categories as string[]).includes(cat.attributes.Slug));
            setSelectedCategories(selectedCategories);
        }

        if (query.tags) {availableTags
            const selectedTags = availableTags.filter((tag)=>(query.tags as string[]).includes(tag.attributes.Slug));
            setSelectedTags(selectedTags);
        }

    }, [searchParams])
}

export { useAtom } from "jotai";
