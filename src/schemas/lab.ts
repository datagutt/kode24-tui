import * as z from "zod";

export const TeAliasSchema = z.enum(["kode24", ""]);
export type TeAlias = z.infer<typeof TeAliasSchema>;

export const SectionSchema = z.enum(["artikkel", ""]);
export type Section = z.infer<typeof SectionSchema>;

export const TypeSchema = z.enum(["article", ""]);
export type Type = z.infer<typeof TypeSchema>;

export const TitleStyleJsonSchema = z.object({
  text_size: z.union([z.number(), z.null()]),
});
export type TitleStyleJson = z.infer<typeof TitleStyleJsonSchema>;

export const UploadedImagesJsonSchema = z.object({
  imageId: z.number(),
  timestamp: z.number(),
});
export type UploadedImagesJson = z.infer<typeof UploadedImagesJsonSchema>;

export const DesktopFieldsSchema = z.object({
  subtitle_style_json: TitleStyleJsonSchema.optional(),
  title_style_json: TitleStyleJsonSchema.optional(),
});
export type DesktopFields = z.infer<typeof DesktopFieldsSchema>;

export const HeightFieldsSchema = z.object({
  x: z.string(),
  viewports_json: z.array(z.any()),
  metadata_key: z.string(),
  cropw: z.string(),
  croph: z.string(),
  y: z.string(),
  heightw: z.string(),
  heighth: z.string(),
  heightx: z.string(),
  heighty: z.string(),
});
export type HeightFields = z.infer<typeof HeightFieldsSchema>;

export const MaintermSchema = z.object({});
export type Mainterm = z.infer<typeof MaintermSchema>;

export const PanoFieldsSchema = z.object({
  viewports_json: z.array(z.any()),
  y: z.string(),
  x: z.string(),
  metadata_key: z.string(),
  cropw: z.string(),
  croph: z.string(),
  panow: z.string(),
  panoh: z.string(),
  panox: z.string(),
  panoy: z.string(),
});
export type PanoFields = z.infer<typeof PanoFieldsSchema>;

export const PageMetadataSchema = z.object({
  width: MaintermSchema,
});
export type PageMetadata = z.infer<typeof PageMetadataSchema>;

export const PrimaryTagsSchema = z.object({
  section: SectionSchema,
});
export type PrimaryTags = z.infer<typeof PrimaryTagsSchema>;

export const FullBylineSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
});
export type FullByline = z.infer<typeof FullBylineSchema>;

export const ImageSchema = z.object({
  url: z.string(),
  jpg: z.string(),
  webp: z.string(),
  url_size: z.string(),
  default: z.string(),
  id: z.number(),
});
export type Image = z.infer<typeof ImageSchema>;

export const HidesubtitleSchema = z.object({
  desktop: z.boolean(),
});
export type Hidesubtitle = z.infer<typeof HidesubtitleSchema>;

export const WidthSchema = z.object({
  desktop: z.number().optional(),
});
export type Width = z.infer<typeof WidthSchema>;

export const DesktopSchema = z.object({
  fields: DesktopFieldsSchema,
});
export type Desktop = z.infer<typeof DesktopSchema>;

export const HeightSchema = z.object({
  id: z.number(),
  instance_of: z.number(),
  type: z.string(),
  status: z.string(),
  fields: HeightFieldsSchema,
  mainterm: MaintermSchema,
  term: MaintermSchema,
  tags: z.array(z.any()),
  maintermParameters: MaintermSchema,
});
export type Height = z.infer<typeof HeightSchema>;

export const PanoSchema = z.object({
  id: z.number(),
  instance_of: z.number(),
  type: z.string(),
  status: z.string(),
  fields: PanoFieldsSchema,
  mainterm: MaintermSchema,
  term: MaintermSchema,
  tags: z.array(z.any()),
  maintermParameters: MaintermSchema,
});
export type Pano = z.infer<typeof PanoSchema>;

// Viewport-aware field: can be a direct value, a per-viewport object, or null
const viewportBoolean = z.union([
  z.boolean(),
  z.object({ desktop: z.boolean(), mobile: z.boolean().optional() }),
  z.null(),
]);

const viewportString = z.union([
  z.object({ desktop: z.union([z.string(), z.null()]), mobile: z.string().optional() }),
  z.null(),
]);

export const ResultMetadataSchema = z.object({
  hidesubtitle: HidesubtitleSchema,
  width: WidthSchema,
  background_color: viewportString.optional(),
  showKicker: viewportBoolean.optional(),
  floatingKicker: viewportBoolean.optional(),
  sub_hideSubtitle: z.boolean().optional(),
});
export type ResultMetadata = z.infer<typeof ResultMetadataSchema>;

export const ViewportsJsonSchema = z.object({
  desktop: DesktopSchema.optional(),
  mobile: DesktopSchema.optional(),
});
export type ViewportsJson = z.infer<typeof ViewportsJsonSchema>;

export const FrontCropSchema = z.object({
  pano: PanoSchema,
  height: HeightSchema,
});
export type FrontCrop = z.infer<typeof FrontCropSchema>;

export const ResultSchema = z.object({
  images: z.array(ImageSchema),
  width: z.union([z.number(), z.null()]),
  metadata: ResultMetadataSchema,
  isAutomatic: z.boolean(),
  siteDomain: z.string(),
  parent: z.number(),
  guid: z.string(),
  type: TypeSchema,
  tags: z.array(z.string()),
  feedId: z.string(),
  byline: z.string(),
  bylineImage: z.string(),
  paywall: z.boolean(),
  published: z.preprocess((val) => (val === "" ? new Date(0) : val), z.coerce.date()),
  url: z.string(),
  site_alias: TeAliasSchema,
  site_id: z.string(),
  description: z.string(),
  descriptionHTML: z.string(),
  teaserDescription: z.string(),
  someDescription: z.string(),
  title: z.string(),
  teaserTitle: z.string(),
  titleHTML: z.string(),
  seolanguage: z.string(),
  seoTitle: z.string(),
  someTitle: z.string(),
  kicker: z.string(),
  teaserKicker: z.string(),
  showcomments: z.string(),
  section: SectionSchema,
  teaserSubtitle: z.string(),
  id: z.number(),
  section_tag: SectionSchema,
  full_bylines: z.array(FullBylineSchema),
  kickerHTML: z.string().optional(),
});
export type Result = z.infer<typeof ResultSchema>;

export const PageFieldsSchema = z.object({
  viewports_json: ViewportsJsonSchema,
  subtitle: z.string().optional(),
  subtitle_style_json: TitleStyleJsonSchema.optional(),
  stats_word_count: z.string().optional(),
  stats_read_time: z.string().optional(),
  stats_lix: z.string().optional(),
  stats_char_count: z.string().optional(),
  showonfp: z.string().optional(),
  readTime: z.string().optional(),
  publishhidden: z.string(),
  published_urls_json: z.array(z.union([z.null(), z.string()])).optional(),
  published_url: z.string(),
  page_template_alias: TeAliasSchema,
  lockUser: z.string(),
  lockTime: z.string(),
  lockSessionId: z.string(),
  last_published_by: z.string(),
  has_published: z.string(),
  default_prototype: z.string().optional(),
  created_by_name: z.string().optional(),
  created_by: z.string(),
  created: z.string(),
  bodytext: z.string().optional(),
  allowRichTextTeasers: z.string().optional(),
  visibility_status: z.string(),
  used_image_ids_json: z.array(z.number()).optional(),
  uploaded_images_json: z.array(UploadedImagesJsonSchema).optional(),
  title: z.string().optional(),
  title_style_json: TitleStyleJsonSchema.optional(),
  teaserTitle: z.string().optional(),
  published: z.string(),
  tags: z.string().optional(),
  site_id: z.string().optional(),
  sectionpath: z.string().optional(),
  name: z.string().optional(),
  modified: z.string().optional(),
  menutag: z.string().optional(),
  layoutid: z.string().optional(),
  hostpath: z.string().optional(),
  favourite: z.string().optional(),
  exclude: z.string().optional(),
  defaultsection: z.string().optional(),
  date_created: z.string().optional(),
  csspath: z.string().optional(),
  automaticfromrownumber: z.string().optional(),
  visual_profile: z.string().optional(),
  automatic: z.string().optional(),
  amount: z.string().optional(),
  automatic_site_id: z.string().optional(),
  someimage: z.string().optional(),
  somedescription: z.string().optional(),
  sometitle: z.string().optional(),
  seotitle: z.string().optional(),
  seodescription: z.string().optional(),
  isInternalPaywall: z.string().optional(),
});
export type PageFields = z.infer<typeof PageFieldsSchema>;

export const PageSchema = z.object({
  id: z.number(),
  type: z.string(),
  status: z.string(),
  fields: PageFieldsSchema,
  mainterm: MaintermSchema,
  term: MaintermSchema,
  tags: z.array(z.string()),
  primaryTags: PrimaryTagsSchema.optional(),
  maintermParameters: MaintermSchema,
  site_id: z.string(),
  frontCrop: FrontCropSchema.optional(),
  isNodeCollectionMember: z.null(),
  nodeCollection: z.null(),
  nodeCollectionParents: z.null(),
  nodeCollectionDataUrl: z.null(),
  tmpId: z.null(),
  instance_of: z.null(),
  parent: z.null(),
  metadata: PageMetadataSchema,
  width: z.number(),
});
export type Page = z.infer<typeof PageSchema>;

export const LabSchema = z.object({
  page: PageSchema,
  result: z.array(ResultSchema).optional(),
});
export type Lab = z.infer<typeof LabSchema>;

// Search result from docs.kode24.no/api/search — different shape from lab Result
export const SearchResultSchema = z.object({
  published_url: z.string(),
  image: z.string().optional(),
  title: z.string(),
  published: z.coerce.date(),
  full_bylines: z.array(FullBylineSchema),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;

export const SearchResultsSchema = z.array(SearchResultSchema);
export type SearchResults = z.infer<typeof SearchResultsSchema>;

// Tag articles response schema
export const TagArticlesResponseSchema = z.object({
  result: z.array(ResultSchema).optional(),
});
export type TagArticlesResponse = z.infer<typeof TagArticlesResponseSchema>;
