/**
 * Free Dataset Resources Integration Module
 * 
 * This module provides types, configurations, and utilities for integrating
 * free datasets and practice materials from open-source repositories and
 * dedicated defense preparation platforms.
 * 
 * Sources documented:
 * - PPDT and TAT Image Datasets: ssbarena.github.io (30+ free sets with timer)
 * - WAT and SRT Text Datasets: SSBCrack free eBooks (100+ solved items)
 * - OIR Test Datasets: Free mock test PDFs (50 verbal + 50 non-verbal questions)
 * - Dynamic Tools: PsychoDrill (GitHub), ssbpsychtest.in (timer-based interface)
 */

import { z } from "zod";

// ============================================================================
// Type Definitions
// ============================================================================

export type ResourceProvider = 
  | "ssbarena" 
  | "ssbcrack" 
  | "centurion_defence" 
  | "psychodrill" 
  | "ssbpsychtest"
  | "upsc_official"
  | "careerairforce";

export type ResourceCategory = 
  | "tat_images" 
  | "ppdt_images" 
  | "wat_words" 
  | "srt_situations" 
  | "oir_verbal" 
  | "oir_nonverbal";

export type AccessMethod = "direct_download" | "api" | "web_scraping" | "manual_collection";

export interface FreeResource {
  /** Unique identifier for this resource */
  id: string;
  
  /** Human-readable title */
  title: string;
  
  /** Detailed description of the resource */
  description: string;
  
  /** Category of content */
  category: ResourceCategory;
  
  /** Source provider name */
  provider: ResourceProvider;
  
  /** URL to access the resource */
  url: string;
  
  /** How to access this resource */
  accessMethod: AccessMethod;
  
  /** Number of items/questions/images available */
  itemCount: number;
  
  /** Whether the resource includes timer functionality */
  hasTimer: boolean;
  
  /** Whether model answers are provided */
  hasModelAnswers: boolean;
  
  /** License type (if known) */
  license?: string;
  
  /** Attribution requirements */
  attributionRequired: boolean;
  
  /** Last verified date */
  lastVerified?: string;
  
  /** Notes about usage or limitations */
  notes?: string;
}

export interface FreeResourceDataset {
  datasetId: "free_defence_prep_resources";
  version: string;
  generatedAtIso: string;
  resources: FreeResource[];
}

// ============================================================================
// Schema Validation
// ============================================================================

const ResourceProviderSchema: z.ZodType<ResourceProvider> = z.union([
  z.literal("ssbarena"),
  z.literal("ssbcrack"),
  z.literal("centurion_defence"),
  z.literal("psychodrill"),
  z.literal("ssbpsychtest"),
  z.literal("upsc_official"),
  z.literal("careerairforce")
]);

const ResourceCategorySchema: z.ZodType<ResourceCategory> = z.union([
  z.literal("tat_images"),
  z.literal("ppdt_images"),
  z.literal("wat_words"),
  z.literal("srt_situations"),
  z.literal("oir_verbal"),
  z.literal("oir_nonverbal")
]);

const AccessMethodSchema: z.ZodType<AccessMethod> = z.union([
  z.literal("direct_download"),
  z.literal("api"),
  z.literal("web_scraping"),
  z.literal("manual_collection")
]);

const FreeResourceSchema: z.ZodType<FreeResource> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: ResourceCategorySchema,
  provider: ResourceProviderSchema,
  url: z.string().url(),
  accessMethod: AccessMethodSchema,
  itemCount: z.number().int().positive(),
  hasTimer: z.boolean(),
  hasModelAnswers: z.boolean(),
  license: z.string().optional(),
  attributionRequired: z.boolean(),
  lastVerified: z.string().datetime().optional(),
  notes: z.string().optional()
});

export const FreeResourceDatasetSchema: z.ZodType<FreeResourceDataset> = z.object({
  datasetId: z.literal("free_defence_prep_resources"),
  version: z.string(),
  generatedAtIso: z.string().datetime(),
  resources: z.array(FreeResourceSchema).min(1)
});

// ============================================================================
// Resource Database
// ============================================================================

/**
 * Curated list of free defence preparation resources.
 * Each entry includes metadata for integration and attribution tracking.
 */
export const FREE_RESOURCES: FreeResource[] = [
  // ========================================================================
  // TAT Image Datasets
  // ========================================================================
  {
    id: "ssbarena-tat-sets",
    title: "SSB Arena TAT Image Sets",
    description: "Over 30 completely free sets of original TAT pictures equipped with a practice timer. Each set contains 11 pictures plus a blank slide for story writing practice.",
    category: "tat_images",
    provider: "ssbarena",
    url: "https://ssbarena.github.io",
    accessMethod: "web_scraping",
    itemCount: 336, // 28 sets × 12 images
    hasTimer: true,
    hasModelAnswers: false,
    license: "Open Source",
    attributionRequired: true,
    notes: "Images hosted on GitHub. Use downloadSSBArenaStimuli.ts tool for bulk download. Respect rate limits."
  },
  {
    id: "centurion-tat-50",
    title: "Centurion Defence Academy TAT Pictures",
    description: "Curated set of 50 original TAT pictures for free practice, provided by Centurion Defence Academy.",
    category: "tat_images",
    provider: "centurion_defence",
    url: "https://centuriondefence.com",
    accessMethod: "manual_collection",
    itemCount: 50,
    hasTimer: false,
    hasModelAnswers: false,
    attributionRequired: true,
    notes: "Manual collection required. Check website for exact URL and terms of use."
  },

  // ========================================================================
  // PPDT Image Datasets
  // ========================================================================
  {
    id: "ssbarena-ppdt-sets",
    title: "SSB Arena PPDT Image Sets",
    description: "Over 30 completely free sets of original PPDT (Picture Perception and Description Test) hazy pictures with practice timer.",
    category: "ppdt_images",
    provider: "ssbarena",
    url: "https://ssbarena.github.io",
    accessMethod: "web_scraping",
    itemCount: 336, // 28 sets × 12 images
    hasTimer: true,
    hasModelAnswers: false,
    license: "Open Source",
    attributionRequired: true,
    notes: "Images hosted on GitHub. Use downloadSSBArenaStimuli.ts tool for bulk download."
  },
  {
    id: "centurion-ppdt-50",
    title: "Centurion Defence Academy PPDT Pictures",
    description: "Curated set of 50 original PPDT hazy pictures for free practice.",
    category: "ppdt_images",
    provider: "centurion_defence",
    url: "https://centuriondefence.com",
    accessMethod: "manual_collection",
    itemCount: 50,
    hasTimer: false,
    hasModelAnswers: false,
    attributionRequired: true,
    notes: "Manual collection required. Check website for exact URL and terms of use."
  },

  // ========================================================================
  // WAT Word Datasets
  // ========================================================================
  {
    id: "ssbcrack-wat-ebook",
    title: "SSBCrack WAT eBook",
    description: "Free downloadable eBook containing over 100 solved WAT (Word Association Test) words with model responses and explanations.",
    category: "wat_words",
    provider: "ssbcrack",
    url: "https://ssbcrack.com",
    accessMethod: "direct_download",
    itemCount: 100,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Download eBook and parse content. Include proper attribution to SSBCrack."
  },
  {
    id: "defence-academy-wat-60",
    title: "Defence Academy WAT Practice Set",
    description: "Complete practice set of exactly 60 WAT words published by defence academies for free practice.",
    category: "wat_words",
    provider: "centurion_defence",
    url: "https://centuriondefence.com",
    accessMethod: "manual_collection",
    itemCount: 60,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Verify exact source and obtain permission for redistribution."
  },

  // ========================================================================
  // SRT Situation Datasets
  // ========================================================================
  {
    id: "ssbcrack-srt-ebook",
    title: "SSBCrack SRT eBook",
    description: "Free downloadable eBook containing over 100 solved SRT (Situation Reaction Test) questions with ideal responses.",
    category: "srt_situations",
    provider: "ssbcrack",
    url: "https://ssbcrack.com",
    accessMethod: "direct_download",
    itemCount: 100,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Download eBook and parse content. Include proper attribution to SSBCrack."
  },
  {
    id: "defence-academy-srt-60",
    title: "Defence Academy SRT Practice Set",
    description: "Complete practice set of exactly 60 SRT scenarios published by defence academies for free practice.",
    category: "srt_situations",
    provider: "centurion_defence",
    url: "https://centuriondefence.com",
    accessMethod: "manual_collection",
    itemCount: 60,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Verify exact source and obtain permission for redistribution."
  },

  // ========================================================================
  // OIR Verbal Reasoning Datasets
  // ========================================================================
  {
    id: "free-oir-mock-verbal",
    title: "Free OIR Mock Test - Verbal Section",
    description: "Free OIR mock test PDF containing 50 verbal reasoning questions covering alphabet series, coding-decoding, blood relations, and direction sense.",
    category: "oir_verbal",
    provider: "ssbcrack",
    url: "https://ssbcrack.com",
    accessMethod: "direct_download",
    itemCount: 50,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Download PDF and parse questions. Verify answer keys."
  },
  {
    id: "ssbcrack-oir-ebook",
    title: "SSBCrack OIR Solved Questions eBook",
    description: "Free eBook with over 150 solved OIR questions covering both verbal and non-verbal reasoning types.",
    category: "oir_verbal",
    provider: "ssbcrack",
    url: "https://ssbcrack.com",
    accessMethod: "direct_download",
    itemCount: 150,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Comprehensive resource covering all OIR question types."
  },

  // ========================================================================
  // OIR Non-Verbal Reasoning Datasets
  // ========================================================================
  {
    id: "free-oir-mock-nonverbal",
    title: "Free OIR Mock Test - Non-Verbal Section",
    description: "Free OIR mock test PDF containing 50 non-verbal reasoning questions covering figure analogy, mirror image, water image, paper folding, and embedded figures.",
    category: "oir_nonverbal",
    provider: "ssbcrack",
    url: "https://ssbcrack.com",
    accessMethod: "direct_download",
    itemCount: 50,
    hasTimer: false,
    hasModelAnswers: true,
    attributionRequired: true,
    notes: "Download PDF and parse questions. Images may need separate handling."
  },

  // ========================================================================
  // Dynamic/Open-Source Tools
  // ========================================================================
  {
    id: "psychodrill-github",
    title: "PsychoDrill Open Source Project",
    description: "Open-source GitHub project providing free test assessments with pre-loaded model answers for psychological tests (TAT, WAT, SRT).",
    category: "tat_images",
    provider: "psychodrill",
    url: "https://github.com/psychodrill",
    accessMethod: "api",
    itemCount: 200, // Estimated across all test types
    hasTimer: true,
    hasModelAnswers: true,
    license: "Open Source (check repo)",
    attributionRequired: true,
    notes: "Check GitHub repository for API documentation and integration guidelines. May provide programmatic access to stimuli and model answers."
  },
  {
    id: "ssbpsychtest-dynamic",
    title: "SSB Psych Test Dynamic Interface",
    description: "100% free, timer-based testing interface with dynamic question banks that provide new pictures and words every practice session.",
    category: "tat_images",
    provider: "ssbpsychtest",
    url: "https://ssbpsychtest.in",
    accessMethod: "web_scraping",
    itemCount: 500, // Estimated dynamic pool
    hasTimer: true,
    hasModelAnswers: false,
    attributionRequired: false,
    notes: "Dynamic content generation. Each session provides randomized stimuli. Consider API integration if available."
  }
];

// ============================================================================
// Dataset Builder Functions
// ============================================================================

/**
 * Builds the complete free resources dataset with validation.
 */
export function buildFreeResourcesDataset(): FreeResourceDataset {
  const nowIso = new Date().toISOString();
  
  const dataset: FreeResourceDataset = {
    datasetId: "free_defence_prep_resources",
    version: "1.0.0",
    generatedAtIso: nowIso,
    resources: FREE_RESOURCES
  };
  
  const check = FreeResourceDatasetSchema.safeParse(dataset);
  if (!check.success) {
    throw new Error(
      `Free resources dataset validation failed: ${JSON.stringify(check.error.flatten())}`
    );
  }
  
  return dataset;
}

/**
 * Filters resources by category.
 */
export function filterResourcesByCategory(
  category: ResourceCategory
): FreeResource[] {
  return FREE_RESOURCES.filter(r => r.category === category);
}

/**
 * Filters resources by provider.
 */
export function filterResourcesByProvider(
  provider: ResourceProvider
): FreeResource[] {
  return FREE_RESOURCES.filter(r => r.provider === provider);
}

/**
 * Gets resources that include model answers.
 */
export function getResourcesWithModelAnswers(): FreeResource[] {
  return FREE_RESOURCES.filter(r => r.hasModelAnswers);
}

/**
 * Gets resources that include timer functionality.
 */
export function getResourcesWithTimer(): FreeResource[] {
  return FREE_RESOURCES.filter(r => r.hasTimer);
}

/**
 * Gets total item count across all resources.
 */
export function getTotalItemCount(): number {
  return FREE_RESOURCES.reduce((sum, r) => sum + r.itemCount, 0);
}

/**
 * Gets item count by category.
 */
export function getItemCountByCategory(category: ResourceCategory): number {
  return FREE_RESOURCES
    .filter(r => r.category === category)
    .reduce((sum, r) => sum + r.itemCount, 0);
}

// ============================================================================
// Integration Utilities
// ============================================================================

/**
 * Generates attribution text for a resource.
 */
export function generateAttribution(resource: FreeResource): string {
  const year = new Date().getFullYear();
  if (resource.attributionRequired) {
    return `Source: ${resource.title} from ${resource.provider} (${resource.url}). Accessed ${year}.`;
  }
  return "";
}

/**
 * Generates a summary report of available free resources.
 */
export function generateResourceSummary(): string {
  const categories: ResourceCategory[] = [
    "tat_images", "ppdt_images", "wat_words", 
    "srt_situations", "oir_verbal", "oir_nonverbal"
  ];
  
  let summary = "=== Free Defence Preparation Resources Summary ===\n\n";
  summary += `Total Resources: ${FREE_RESOURCES.length}\n`;
  summary += `Total Items: ${getTotalItemCount()}\n\n`;
  
  for (const category of categories) {
    const resources = filterResourcesByCategory(category);
    const count = getItemCountByCategory(category);
    summary += `${category}: ${resources.length} resources, ${count} items\n`;
    for (const r of resources) {
      summary += `  - ${r.title} (${r.itemCount} items) [${r.provider}]\n`;
    }
  }
  
  return summary;
}

// ============================================================================
// Export for CLI/Tool Usage
// ============================================================================

if (typeof require !== "undefined" && require.main === module) {
  // CLI usage
  console.log(generateResourceSummary());
  console.log("\n=== Dataset JSON ===\n");
  console.log(JSON.stringify(buildFreeResourcesDataset(), null, 2));
}