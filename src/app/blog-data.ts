import config from "@/config";
import {z, ZodObject, ZodRawShape} from "zod";
import qs from "qs";

const EntitiesResponse = <T extends ZodRawShape>(attributesSchema: ZodObject<T>) => z.object({
    data: z.object({
        id: z.number().int().positive(),
        attributes: attributesSchema.merge(z.object({
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            publishedAt: z.string().datetime(),
        }))
    }).array().nullish(),
    meta: z.object({
        pagination: z.object({
            page: z.number().int().positive(),
            pageCount: z.number().int(),
            pageSize: z.number().int().positive(),
            total: z.number().int(),
        })
    }).nullish()
});

type BaseStrapiEntitiesQueryParams = {
    populate?: "*",
    status?: "draft" | "published",
};

// type StrapiEntitiesQueryFilterOperator = 
// "$eq" |
// "$eqi" |
// "$ne" |
// "$nei" |
// "$lt" |
// "$lte" |
// "$gt" |
// "$gte" |
// "$in" |
// "$notIn" |
// "$contains" |
// "$notContains" |
// "$containsi" |
// "$notContainsi" |
// "$null" |
// "$notNull" |
// "$between" |
// "$startsWith" |
// "$startsWithi" |
// "$endsWith" |
// "$endsWithi" |
// "$or" |
// "$and" |
// "$not";

export type StrapiEntitiesQueryParams = BaseStrapiEntitiesQueryParams & ({
    filters?: {
        [field: string]: any
    }
} | {
    pagination?: {
        page: number,
        pageSize?: number,
        withCount?: boolean
    }
});

class StrapiEntities<T extends ZodRawShape> {
    private readonly pluralApiId
    private readonly attributesSchema
    constructor(pluralApiId: string, attributesSchema: ZodObject<T>) {
        this.pluralApiId = pluralApiId;
        this.attributesSchema = attributesSchema;
    }

    async get(queryParams?: StrapiEntitiesQueryParams) {
        // create URL and apply search string if specified
        const url = new URL(`${config.STRAPI_BASE_URL}/api/${this.pluralApiId}`);
        if (queryParams) {
            const queryString = qs.stringify(queryParams);
            url.search = queryString;
        }

        const response = await fetch(url, {
            headers: {
                authorization: `Bearer ${config.STRAPI_API_KEY}`
            }
        });
        const responseBody = await response.json();
        return EntitiesResponse(this.attributesSchema).parse(responseBody);
    }

    async getAll() {
        const firstPage = await this.get({pagination: {page: 1}});
        if (!firstPage.meta || !firstPage.data) { return []; }
        const pageCount = firstPage.meta.pagination.pageCount;
        let currentPage = 1;
        const results = firstPage.data;
        while (currentPage !== pageCount) {
            const page = (await this.get({
                pagination: {
                    page: currentPage + 1
                }
            }));
            const _results = page.data;
            if (_results) {
                results.push(..._results);
            }
            currentPage++;
        }
        return results;
    }
}

export const Categories = new StrapiEntities("categories", z.object({
    Title: z.string(),
    Description: z.string().nullable(),
    Slug: z.string(),    
}));

export const Tags = new StrapiEntities("tags", z.object({
    Title: z.string(),
    Description: z.string().nullable(),
    Slug: z.string(),    
}));

export const BlogPostTypes = new StrapiEntities("blog-post-types", z.object({
    Title: z.string(),
    Type: z.string(),
    Slug: z.string(),
    PluralSlug: z.string(),    
}));

export const BlogPosts = new StrapiEntities("blog-posts", z.object({
    Title: z.string(),
    Slug: z.string(),
    Content: z.any(),
    Excerpt: z.string().nullable(),
}));

