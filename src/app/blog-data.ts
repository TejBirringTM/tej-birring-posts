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
    }).array(),
    meta: z.object({
        pagination: z.object({
            page: z.number().int().positive(),
            pageCount: z.number().int(),
            pageSize: z.number().int().positive(),
            total: z.number().int(),
        })
    }).nullish()
});

const EntityResponse = <T extends ZodRawShape>(attributesSchema: ZodObject<T>) => z.object({
    data: z.object({
        id: z.number().int().positive(),
        attributes: attributesSchema.merge(z.object({
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime(),
            publishedAt: z.string().datetime(),
        }))
    })
});

type BaseStrapiEntitiesQueryParams = {
    populate?: "*",
    status?: "draft" | "published",
    sort?: `${string}:asc` | `${string}:desc` | (`${string}:asc` | `${string}:desc`)[]
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

class StrapiEntity<T extends ZodRawShape> {
    private readonly apiId;
    private readonly attributesSchema;
    private readonly schema;

    constructor(apiId: string, attributesSchema: ZodObject<T>) {
        this.apiId = apiId;
        this.attributesSchema = attributesSchema;
        this.schema = EntityResponse(attributesSchema);
    }

    async get() {
        const url = new URL(`${config.STRAPI_BASE_URL}/api/${this.apiId}`);
        const response = await fetch(url, {
            headers: {
                authorization: `Bearer ${config.STRAPI_API_KEY}`
            }
        });
        const responseBody = await response.json();
        return this.schema.parse(responseBody);
    }
}
class StrapiEntities<T extends ZodRawShape> {
    private readonly pluralApiId
    private readonly attributesSchema
    readonly schema
    readonly singularSchema

    constructor(pluralApiId: string, attributesSchema: ZodObject<T>) {
        this.pluralApiId = pluralApiId;
        this.attributesSchema = attributesSchema;
        this.schema = EntitiesResponse(this.attributesSchema);
        this.singularSchema = EntityResponse(this.attributesSchema);
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
        return this.schema.parse(responseBody);
    }

    async getAll() {
        const getPage = async (pageNumber: number) => await this.get({
            pagination: {
                page: pageNumber,
            },
            status: "published"
        });
        const firstPage = await getPage(1);
        if (!firstPage.meta?.pagination.pageCount) {
            return firstPage.data;
        } else {
            let pageCount = firstPage.meta.pagination.pageCount;
            let pageNumber = 1;
            const results = firstPage.data;
            while (pageNumber !== pageCount) {
                const page = await getPage(pageNumber+1);
                results.push(...page.data);
                pageNumber++;
            }
            return results;
        }
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
    Category: Categories.singularSchema,
    Tags: Tags.schema
}));

export const SiteData = new StrapiEntity("site", z.object({
    Slogan: z.string().nullish(),
    Description: z.string().nullish(),
    LinkedInProfileURL: z.string().nullish()
}));
