import {HeadingL1, HeadingL2, HeadingL3, Paragraph} from "@/app/_ui/_content/typography"
import TheSearchBox from "./_ui/the-search-box-client";
import TheCategoriesSelector from "./_ui/the-categories-selector-client";
import TheTagsSelector from "./_ui/the-tags-selector-client";
import TheBlogPosts from "./_ui/the-blog-posts-pagination";

export default async function Home() {
  
  return (
      <main className="min-h-screen">
        <TheSearchBox />
        <TheCategoriesSelector />
        <TheTagsSelector />
        
        <TheBlogPosts />

        <HeadingL2>asd</HeadingL2>
        <HeadingL3>asd</HeadingL3>
        <Paragraph>asd asdas asdas</Paragraph>
      </main>
  );
}
