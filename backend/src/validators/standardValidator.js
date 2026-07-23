const { z } = require("zod");

const createStandardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can contain only lowercase letters, numbers and hyphens"
    ),

  summary: z
    .string()
    .trim()
    .min(1, "Summary is required"),

  icon: z.string().optional(),

  status: z
    .enum(["draft", "published"])
    .optional(),

  order: z.number().optional(),
});

const updateStandardSchema =
  createStandardSchema.partial();

const versionSchema = z.object({
  version: z
    .string()
    .trim()
    .min(1, "Version is required"),

  label: z.string().optional(),

  status: z
    .enum([
      "draft",
      "public-consultation",
      "certified",
    ])
    .optional(),

  startDate: z
    .string()
    .nullable()
    .optional(),

  endDate: z
    .string()
    .nullable()
    .optional(),

  publishedDate: z
    .string()
    .nullable()
    .optional(),
});

const updateVersionSchema =
  versionSchema.partial();

const blockSchema = z.object({
  type: z.enum([
    "heading",
    "paragraph",
    "list",
    "table",
    "equation",
  ]),

  data: z.record(
    z.string(),
    z.any()
  ),

  order: z.number().optional(),
});

const sectionSchema = z.object({
  sectionNumber: z
    .string()
    .trim()
    .min(1, "Section number is required"),

  title: z
    .string()
    .trim()
    .min(1, "Section title is required"),

  parentSection: z
    .string()
    .nullable()
    .optional(),

  order: z.number().optional(),

  blocks: z
    .array(blockSchema)
    .optional(),
});

const updateSectionSchema =
  sectionSchema.partial();

module.exports = {
  createStandardSchema,
  updateStandardSchema,

  versionSchema,
  updateVersionSchema,

  sectionSchema,
  updateSectionSchema,
};