import TheSearchBox from "./_ui/the-search-box-client";
import TheCategoriesSelector from "./_ui/the-categories-selector-client";
import TheTagsSelector from "./_ui/the-tags-selector-client";
import TheBlogPosts from "./_ui/the-blog-posts-pagination";

export default function HomePage() {
  
  return (
      <main className="min-h-screen">
        <TheSearchBox />

        <div className="flex flex-col sm:flex-row sm:justify-stretch gap-4 mb-4 px-4">
          <TheCategoriesSelector />
          <TheTagsSelector />
        </div>
        
        <TheBlogPosts />
      </main>
  );
}
