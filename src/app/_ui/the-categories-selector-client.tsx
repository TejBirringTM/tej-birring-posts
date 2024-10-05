'use client';

import {availableCategoriesAtom, selectedCategoriesAtom, queryToHistoryState, useAtom, historyStateToQuery} from "../_state/blog-post-query";
import RefreshIcon from "@/app/_ui/_assets/_svgs/refresh-arrow.svg";
import { Card } from "./_content/card";
import clsx from "clsx";
import { useAtomValue } from "jotai";

type TheCategoriesSelectorProps = React.HTMLAttributes<HTMLDivElement>;

export default function TheCategoriesSelector(props: TheCategoriesSelectorProps) {
    const availableCategories = useAtomValue(availableCategoriesAtom);
    const [selectedCategories, setSelectedCategories] = useAtom(selectedCategoriesAtom);
    useAtom(queryToHistoryState);
    historyStateToQuery();

    function onCategoryButtonClicked(categoryId: number) {
        if (!selectedCategories.find((cat)=>cat.id === categoryId)) {
            const category = availableCategories.find((cat)=>cat.id === categoryId);
            if (category) {
                setSelectedCategories([...selectedCategories, category]);
            }
        } 
        else {
            setSelectedCategories(selectedCategories.filter((cat)=>cat.id !== categoryId));
        }
    }

    function onResetButtonClicked() {
        setSelectedCategories([]);
    }

    function isSelected(categoryId: number) {
        return selectedCategories.find((cat)=>cat.id === categoryId)
    }

    return (
        <Card fabric="papyrus" className={clsx(props.className, "pl-2 py-2 relative pr-8 w-full")} trim="true">
            <p className="heading text-leather/70 mb-4">
                <span className="font-medium tracking-tight">Categories</span>
                <span className="ml-1">
                    ({
                        selectedCategories.length > 0 ? selectedCategories.length : "all"
                    })
                </span>
            </p>

            <div className="flex flex-row items-start gap-y-2 gap-x-3 flex-wrap">
                {availableCategories.map((cat)=>{
                    return (
                        <button 
                            key={`category-${cat.attributes.Slug}`}
                            className={clsx('transition-all text-left leading-none p-1 underline', {'bg-onyx-black text-papyrus px-2 rounded-xl no-underline': isSelected(cat.id)})}
                            onClick={()=>onCategoryButtonClicked(cat.id)}
                        >
                                {cat.attributes.Title}
                            </button>
                    )
                })}

            </div>

            {
                (selectedCategories.length > 0) && 
                <button onClick={()=>onResetButtonClicked()} className="absolute bottom-0 right-0 group">
                    <RefreshIcon className={clsx('size-7 p-1 m-1 rounded-full border-2 border-onyx-black fill-onyx-black group-hover:bg-onyx-black group-hover:fill-papyrus transition-all')} />
                </button>
            }
            
        </Card>
    )
}