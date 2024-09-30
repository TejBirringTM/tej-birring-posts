// import {createConfig, configVar, String, fromEnv} from "@parkour-ops/application-configuration"

// export default createConfig({
//     STRAPI_BASE_URL: configVar("Strapi Base URL", "REQUIRED", String.url())(fromEnv("STRAPI_BASE_URL")),
//     STRAPI_API_KEY: configVar("Strapi API Key", "REQUIRED", String)(fromEnv("STRAPI_API_KEY")),
// });

export default {
    STRAPI_BASE_URL: process.env.STRAPI_BASE_URL,
    STRAPI_API_KEY: process.env.STRAPI_API_KEY
} as const;

