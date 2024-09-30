'use client';
import {availableCategoriesAtom, selectedCategoriesAtom, queryToHistoryState, useAtom, historyStateToQuery} from "../_state/blog-post-query";
import RefreshIcon from "@/app/_ui/_assets/_svgs/refresh-arrow.svg";
import { Card } from "./_content/card";
import clsx from "clsx";

export default function TheCategoriesSelector() {
    const [availableCategories] = useAtom(availableCategoriesAtom);
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
        <Card fabric="papyrus" className="pl-2 py-2 relative pr-8" trim="true">
            <p className="heading text-leather/70 mb-4">
                <span className="font-medium tracking-tight">Categories</span>
                <span className="ml-1">
                    ({
                        selectedCategories.length > 0 ? selectedCategories.length : "all"
                    })
                </span>
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-y-2 sm:gap-x-3 flex-wrap">
                {availableCategories.map((cat)=>{
                    return (
                        <button 
                            key={`category-${cat.id}`}
                            className={clsx('transition-all', {'bg-onyx-black text-papyrus px-2 rounded-xl': isSelected(cat.id)})}
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