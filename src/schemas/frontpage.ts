import * as z from "zod";


export const SectionSchema = z.enum([
    "artikkel",
]);
export type Section = z.infer<typeof SectionSchema>;


export const TypeSchema = z.enum([
    "basis",
    "fokus",
    "premium",
]);
export type Type = z.infer<typeof TypeSchema>;

export const BannerAdCompanySchema = z.object({
    "name": z.string(),
    "logo": z.string(),
});
export type BannerAdCompany = z.infer<typeof BannerAdCompanySchema>;

export const CompanyPartnerCompanySchema = z.object({
    "logo": z.string(),
    "title": z.string(),
});
export type CompanyPartnerCompany = z.infer<typeof CompanyPartnerCompanySchema>;

export const BylineClassSchema = z.object({
    "imageUrl": z.string(),
    "name": z.string(),
});
export type BylineClass = z.infer<typeof BylineClassSchema>;

export const UpcomingEventSchema = z.object({
    "startDate": z.coerce.date(),
    "startDateFormatted": z.string(),
    "timeFormatted": z.string(),
    "arrangedBy": z.string(),
    "name": z.string(),
    "description": z.string(),
    "link": z.string(),
    "photo": z.string(),
    "digital": z.boolean(),
    "location": z.string(),
    "isPremium": z.boolean(),
});
export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;

export const HighestRatedCommentUserSchema = z.object({
    "name": z.string(),
    "picture_url": z.string(),
});
export type HighestRatedCommentUser = z.infer<typeof HighestRatedCommentUserSchema>;

export const ReactionsSchema = z.object({
    "reactions": z.array(z.number()),
    "comments_count": z.number(),
    "reactions_count": z.number(),
});
export type Reactions = z.infer<typeof ReactionsSchema>;

export const JobAdsSanityCompanySchema = z.object({
    "name": z.string(),
    "logo": z.string(),
    "logoBackgroundLight": z.null(),
    "logoBackgroundDark": z.null(),
    "logoReal": z.string(),
    "logoRealDark": z.string(),
});
export type JobAdsSanityCompany = z.infer<typeof JobAdsSanityCompanySchema>;

export const JobCompanySchema = z.object({
    "imageUrl": z.string(),
    "logoReal": z.string(),
    "logoRealDark": z.union([z.null(), z.string()]),
    "logoWithoutSize": z.string(),
    "name": z.string(),
    "description": z.string(),
    "logoBackgroundLight": z.null(),
    "logoBackgroundDark": z.union([z.null(), z.string()]),
});
export type JobCompany = z.infer<typeof JobCompanySchema>;

export const ListingSchema = z.object({
    "listings": z.array(z.any()),
    "premiumIds": z.array(z.string()),
});
export type Listing = z.infer<typeof ListingSchema>;

export const NewestCommentUserSchema = z.object({
    "htid": z.union([z.null(), z.string()]),
    "name": z.string(),
    "title": z.null().optional(),
    "username": z.string().optional(),
    "picture_url": z.union([z.null(), z.string()]),
    "bio": z.union([z.null(), z.string()]).optional(),
    "location": z.union([z.null(), z.string()]).optional(),
    "website_url": z.union([z.null(), z.string()]).optional(),
    "created_at": z.number().optional(),
    "last_commented_at": z.number().optional(),
    "comments_count": z.number().optional(),
    "badge_ids": z.array(z.number()).optional(),
});
export type NewestCommentUser = z.infer<typeof NewestCommentUserSchema>;

export const AdSchema = z.object({
    "title": z.string(),
    "hideFrom": z.string(),
    "uniqueValue": z.string(),
    "banner": z.string(),
    "companyId": z.string(),
});
export type Ad = z.infer<typeof AdSchema>;

export const PartnerAdsSanityCompanySchema = z.object({
    "logo": z.string(),
    "title": z.string(),
    "_id": z.string(),
});
export type PartnerAdsSanityCompany = z.infer<typeof PartnerAdsSanityCompanySchema>;

export const PartnerSchema = z.object({
    "name": z.string(),
    "title": z.string().optional(),
    "link": z.string(),
    "logo": z.string(),
    "type": z.string(),
});
export type Partner = z.infer<typeof PartnerSchema>;

export const BannerAdSchema = z.object({
    "title": z.string(),
    "hideFrom": z.string(),
    "adlink": z.string(),
    "adFormat": z.string().optional(),
    "banner": z.string(),
    "company": BannerAdCompanySchema.optional(),
});
export type BannerAd = z.infer<typeof BannerAdSchema>;

export const CompanyPartnerSchema = z.object({
    "title": z.string(),
    "banner": z.string(),
    "company": CompanyPartnerCompanySchema,
    "slug": z.string(),
    "darkLogo": z.string(),
    "lightLogo": z.string(),
    "tooltip": z.string(),
});
export type CompanyPartner = z.infer<typeof CompanyPartnerSchema>;

export const ContentSchema = z.object({
    "id": z.string(),
    "published_url": z.string(),
    "title": z.string(),
    "published": z.coerce.date(),
    "section": z.string(),
    "image": z.string(),
    "company": BylineClassSchema,
});
export type Content = z.infer<typeof ContentSchema>;

export const EventsSchema = z.object({
    "upcomingEvents": z.array(UpcomingEventSchema),
});
export type Events = z.infer<typeof EventsSchema>;

export const HighestRatedCommentSchema = z.object({
    "page_identifier": z.number(),
    "created_at": z.coerce.date(),
    "upvotes": z.number(),
    "downvotes": z.number(),
    "rating": z.number(),
    "user": HighestRatedCommentUserSchema,
    "bodySnippet": z.string(),
});
export type HighestRatedComment = z.infer<typeof HighestRatedCommentSchema>;

export const JobAdsSanitySchema = z.object({
    "applicationTitle": z.string(),
    "title": z.string(),
    "hideFrom": z.string(),
    "adlink": z.string(),
    "banner": z.string(),
    "company": JobAdsSanityCompanySchema,
});
export type JobAdsSanity = z.infer<typeof JobAdsSanitySchema>;

export const JobSchema = z.object({
    "id": z.string(),
    "published_url": z.string(),
    "applicationTitle": z.string(),
    "title": z.string(),
    "hideFrom": z.string(),
    "published": z.string(),
    "type": TypeSchema,
    "company": JobCompanySchema,
});
export type Job = z.infer<typeof JobSchema>;

export const NewestCommentSchema = z.object({
    "url": z.string(),
    "page_identifier": z.string(),
    "created_at": z.coerce.date(),
    "upvotes": z.number(),
    "downvotes": z.number(),
    "user": NewestCommentUserSchema,
    "bodySnippet": z.string(),
    "articleTitle": z.string(),
});
export type NewestComment = z.infer<typeof NewestCommentSchema>;

export const PartnerAdsSanitySchema = z.object({
    "company": PartnerAdsSanityCompanySchema,
    "slug": z.string(),
    "ads": z.array(AdSchema),
});
export type PartnerAdsSanity = z.infer<typeof PartnerAdsSanitySchema>;

export const ArticleSchema = z.object({
    "id": z.string(),
    "title": z.string(),
    "published": z.coerce.date(),
    "section": SectionSchema,
    "image": z.string(),
    "published_url": z.string(),
    "tags": z.string(),
    "subtitle": z.string(),
    "oldId": z.string(),
    "frontCropUrl": z.string(),
    "byline": BylineClassSchema,
    "reactions": ReactionsSchema,
    "highestRatedComment": HighestRatedCommentSchema.optional(),
});
export type Article = z.infer<typeof ArticleSchema>;

export const FrontpageElementSchema = z.object({
    "title": z.string(),
    "description": z.string(),
    "tags1": z.string(),
    "style": z.string(),
    "layout": z.string(),
    "antall": z.string(),
    "lenke": z.string(),
    "articles": z.array(ArticleSchema),
});
export type FrontpageElement = z.infer<typeof FrontpageElementSchema>;

export const FrontpageSchema = z.object({
    "latestArticles": z.array(ArticleSchema),
    "frontpage": z.array(FrontpageElementSchema),
    "listing": ListingSchema,
    "content": z.array(ContentSchema),
    "events": EventsSchema,
    "partners": z.array(PartnerSchema),
    "newestComments": z.array(NewestCommentSchema),
    "companyPartners": z.array(CompanyPartnerSchema),
    "contentTiles": z.array(BannerAdSchema),
    "jobs": z.array(JobSchema),
    "jobAdsSanity": z.array(JobAdsSanitySchema),
    "partnerAdsSanity": z.array(PartnerAdsSanitySchema),
    "bannerAds": z.array(BannerAdSchema),
});
export type Frontpage = z.infer<typeof FrontpageSchema>;
