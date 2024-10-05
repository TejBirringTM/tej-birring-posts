'use client';

import {availableTagsAtom, selectedTagsAtom, queryToHistoryState, useAtom, historyStateToQuery} from "../_state/blog-post-query";
import RefreshIcon from "@/app/_ui/_assets/_svgs/refresh-arrow.svg";
import { Card } from "./_content/card";
import clsx from "clsx";
import { useAtomValue } from "jotai";

type TheTagsSelectorProps = React.HTMLAttributes<HTMLDivElement>;

export default function TheTagsSelector(props: TheTagsSelectorProps) {
    const availableTags = useAtomValue(availableTagsAtom);
    const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
    useAtom(queryToHistoryState);
    historyStateToQuery();

    function onTagButtonClicked(tagId: number) {
        if (!selectedTags.find((tag)=>tag.id === tagId)) {
            const tag = availableTags.find((tag)=>tag.id === tagId);
            if (tag) {
                setSelectedTags([...selectedTags, tag]);
            }
        } 
        else {
            setSelectedTags(selectedTags.filter((tag)=>tag.id !== tagId));
        }
    }

    function onResetButtonClicked() {
        setSelectedTags([]);
    }

    function isSelected(tagId: number) {
        return selectedTags.find((tag)=>tag.id === tagId)
    }

    return (
        <Card fabric="papyrus" className={clsx(props.className, "pl-2 py-2 relative pr-8 w-full")} trim="true">
            <p className="heading text-leather/70 mb-4">
                <span className="font-medium tracking-tight">Tags</span>
                <span className="ml-1">
                    ({
                        selectedTags.length > 0 ? selectedTags.length : "all"
                    })
                </span>
            </p>

            <div className="flex flex-row items-start gap-y-2 gap-x-3 flex-wrap">
                {availableTags.map((tag)=>{
                    return (
                        <button 
                            key={tag.attributes.Slug}
                            className={clsx('transition-all text-left leading-none p-1 underline', {'bg-onyx-black text-papyrus px-2 rounded-xl no-underline': isSelected(tag.id)})}
                            onClick={()=>onTagButtonClicked(tag.id)}
                        >
                                {tag.attributes.Title}
                        </button>
                    )
                })}
            </div>

            {
                (selectedTags.length > 0) && 
                <button onClick={()=>onResetButtonClicked()} className="absolute bottom-0 right-0 group">
                    <RefreshIcon className={clsx('size-7 p-1 m-1 rounded-full border-2 border-onyx-black fill-onyx-black group-hover:bg-onyx-black group-hover:fill-papyrus transition-all')} />
                </button>
            }  
        </Card>
    )
}