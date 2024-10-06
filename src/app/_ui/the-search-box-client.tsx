'use client';

import { Card } from "./_content/card";
import { HeadingL3 } from "./_content/typography";
import MagnifyingGlass from "./_assets/_svgs/magnifying-glass.svg"
import { ChangeEvent, useEffect, useRef } from "react";
import {useSyncBrowserHistoryStateToSearchQuery, syncBrowserSearchQueryToHistoryState, searchEntryAtom, useAtom} from "../_state/blog-post-query";
import debounce from "lodash.debounce";
import RefreshIcon from "@/app/_ui/_assets/_svgs/refresh-arrow.svg";
import clsx from "clsx";

export default function TheSearchBox() {    
    // state
    const [searchEntry, setSearchEntry] = useAtom(searchEntryAtom);
    useAtom(syncBrowserSearchQueryToHistoryState);
    useSyncBrowserHistoryStateToSearchQuery();

    // focus on text input element on click
    const inputEl = useRef<HTMLInputElement>(null);
    function onCardClick() {
        inputEl.current?.focus();
    }

    // make sure text input value reflects search entry
    useEffect(()=>{
        if (searchEntry.length >= 0 && inputEl.current) {
            inputEl.current.value = searchEntry;
        }
    }, [searchEntry]);

    // update search entry on commit ('change')
    const onCommitSearchEntry = debounce((event: ChangeEvent<HTMLInputElement>)=>{
        setSearchEntry(event.target.value);
    }, 1000);
    
    function onResetButtonClicked() {
        setSearchEntry("");
    }

    return (
        <Card fabric="papyrus" onClick={onCardClick} trim="true" style={{cursor: 'text'}} className="relative mx-4 mb-4">
            <HeadingL3 className="text-2xl tracking-tight pl-2.5 py-1 text-leather/70 w-fit">
                Search
                <MagnifyingGlass className="size-8 ml-1.5 inline-block fill-leather/70" />
            </HeadingL3>

            <input type="text" ref={inputEl} onChange={onCommitSearchEntry} className="block bg-transparent outline-none w-full leading-none text-jet-black/95 caret-jet-black/50 tracking-tighter pl-2.5 -mb-1.5 text-[1.5rem]" />            
            
            {
                (searchEntry.length > 0) && 
                <button onClick={()=>onResetButtonClicked()} className="absolute bottom-0 right-0 group">
                    <RefreshIcon className={clsx('size-7 p-1 m-1 rounded-full border-2 border-onyx-black fill-onyx-black group-hover:bg-onyx-black group-hover:fill-papyrus transition-all')} />
                </button>    
            }
        </Card>
    );
}
