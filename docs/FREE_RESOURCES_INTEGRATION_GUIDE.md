# Free Dataset Resources Integration Guide

This document provides a comprehensive guide to accessing and integrating free datasets and practice materials for OIR, PPDT, and psychological tests (TAT, WAT, SRT) into the SSB NextGen Pro platform.

## Overview

The platform now integrates free datasets from multiple open-source repositories and dedicated defense preparation platforms:

| Test Type      | Source                      | Items | Access Method                  |
| -------------- | --------------------------- | ----- | ------------------------------ |
| TAT Images     | SSB Arena (GitHub)          | 336   | Web scraping / Direct download |
| TAT Images     | Centurion Defence Academy   | 50    | Manual collection              |
| PPDT Images    | SSB Arena (GitHub)          | 336   | Web scraping / Direct download |
| PPDT Images    | Centurion Defence Academy   | 50    | Manual collection              |
| WAT Words      | SSBCrack eBook              | 100+  | Direct download                |
| WAT Words      | Defence Academy             | 60    | Manual collection              |
| SRT Situations | SSBCrack eBook              | 100+  | Direct download                |
| SRT Situations | Defence Academy             | 60    | Manual collection              |
| OIR Verbal     | SSBCrack eBook + Mock Tests | 120   | Direct download                |
| OIR Non-Verbal | SSBCrack eBook + Mock Tests | 130   | Direct download                |
| Dynamic Tests  | PsychoDrill (GitHub)        | 200+  | API integration                |
| Dynamic Tests  | ssbpsychtest.in             | 500+  | Web scraping                   |

## Quick Start

### 1. Download SSB Arena Stimuli (TAT/PPDT Images)

```bash
# Navigate to the project root
cd extensions

# Run the download tool
npx ts-node src/tools/downloadSSBArenaStimuli.ts --limit 100
```

This will download images to `assets/tat/` and `assets/ppdt/` directories and generate manifest files.

### 2. Access Free Resources Dataset

```typescript
import {
  buildFreeResourcesDataset,
  filterResourcesByCategory,
  generateResourceSummary,
} from "./src/lib/datasets/freeResourcesIntegration";

// Get complete dataset
const dataset = buildFreeResourcesDataset();
console.log(`Total resources: ${dataset.resources.length}`);

// Filter by category
const tatResources = filterResourcesByCategory("tat_images");
console.log(`TAT resources: ${tatResources.length}`);

// Generate summary report
console.log(generateResourceSummary());
```

### 3. Use Updated Dataset Stubs

All dataset stubs have been updated with expanded content:

```typescript
// TAT Dataset (386 images)
import { buildTATDatasetStub } from "./src/lib/datasets/tat";
const tatItems = buildTATDatasetStub();

// PPDT Dataset (386 images)
import { buildPPDTDatasetStub } from "./src/lib/datasets/ppdt";
const ppdtItems = buildPPDTDatasetStub();

// SRT Dataset (160 situations)
import { buildSRTDatasetStub } from "./src/lib/datasets/srt";
const srtItems = buildSRTDatasetStub();

// OIR Dataset (250+ questions)
import { buildOIRQuestionBankStub } from "./src/lib/datasets/oir";
const oirBank = buildOIRQuestionBankStub();
```

## Detailed Source Information

### SSB Arena (ssbarena.github.io)

**Description:** Over 30 completely free sets of original PPDT and TAT pictures equipped with a practice timer.

**Content:**

- 28 TAT sets × 12 images = 336 TAT images
- 28 PPDT sets × 12 images = 336 PPDT images
- Each set includes a blank slide for story writing practice

**Access:**

- Images hosted on GitHub: `https://github.com/ssbarena/ssbarena.github.io`
- Use the provided `downloadSSBArenaStimuli.ts` tool for bulk download
- Respect rate limits and terms of use

**Attribution Required:** Yes - "Source: SSB Arena (ssbarena.github.io)"

### Centurion Defence Academy

**Description:** Curated sets of 50 original PPDT/TAT and TAT pictures for free practice.

**Content:**

- 50 TAT pictures
- 50 PPDT hazy pictures

**Access:**

- Website: `https://centuriondefence.com`
- Manual collection required
- Check website for exact URLs and terms of use

**Attribution Required:** Yes - "Source: Centurion Defence Academy"

### SSBCrack

**Description:** Free downloadable eBooks containing solved questions for WAT, SRT, and OIR.

**Content:**

- 100+ solved WAT words with model responses
- 100+ solved SRT questions with ideal responses
- 150+ solved OIR questions (verbal + non-verbal)

**Access:**

- Website: `https://ssbcrack.com`
- Download eBooks and parse content
- Include proper attribution

**Attribution Required:** Yes - "Source: SSBCrack"

### PsychoDrill (GitHub)

**Description:** Open-source GitHub project providing free test assessments with pre-loaded model answers.

**Content:**

- TAT, WAT, SRT stimuli with model answers
- Timer functionality included
- API access for programmatic integration

**Access:**

- GitHub: `https://github.com/psychodrill`
- Check repository for API documentation
- May provide programmatic access to stimuli

**Attribution Required:** Yes - Check repository license

### ssbpsychtest.in

**Description:** 100% free, timer-based testing interface with dynamic question banks.

**Content:**

- Dynamic pool of 500+ stimuli
- New pictures and words every session
- Timer-based practice interface

**Access:**

- Website: `https://ssbpsychtest.in`
- Dynamic content generation
- Consider API integration if available

**Attribution Required:** No

## File Structure

```
src/lib/datasets/
├── freeResourcesIntegration.ts    # Main integration module
├── tat.ts                         # TAT dataset (386 images)
├── ppdt.ts                        # PPDT dataset (386 images)
├── wat.ts                         # WAT word bank
├── srt.ts                         # SRT situations (160 items)
├── oir.ts                         # OIR question bank (250+ questions)
└── defencePrepResources.ts        # General defence prep resources

src/tools/
├── downloadSSBArenaStimuli.ts     # Tool to download TAT/PPDT images
└── buildStimulusManifests.ts      # Tool to build asset manifests

assets/
├── tat/                           # TAT image files
└── ppdt/                          # PPDT image files
```

## Attribution Guidelines

When using these free resources, proper attribution is required:

### For TAT/PPDT Images from SSB Arena:

```
TAT/PPDT images sourced from SSB Arena (https://ssbarena.github.io).
Used under open-source terms with attribution.
```

### For Content from SSBCrack:

```
Practice questions sourced from SSBCrack free eBooks (https://ssbcrack.com).
Used with attribution for educational purposes.
```

### For Centurion Defence Academy Content:

```
Practice materials sourced from Centurion Defence Academy (https://centuriondefence.com).
Used with attribution for educational purposes.
```

## API Reference

### Free Resources Module

```typescript
// Get all free resources
buildFreeResourcesDataset(): FreeResourceDataset

// Filter by category
filterResourcesByCategory(category: ResourceCategory): FreeResource[]

// Filter by provider
filterResourcesByProvider(provider: ResourceProvider): FreeResource[]

// Get resources with model answers
getResourcesWithModelAnswers(): FreeResource[]

// Get resources with timer
getResourcesWithTimer(): FreeResource[]

// Get statistics
getTotalItemCount(): number
getItemCountByCategory(category: ResourceCategory): number

// Generate attribution text
generateAttribution(resource: FreeResource): string

// Generate summary report
generateResourceSummary(): string
```

### Types

```typescript
type ResourceProvider =
  | "ssbarena"
  | "ssbcrack"
  | "centurion_defence"
  | "psychodrill"
  | "ssbpsychtest"
  | "upsc_official"
  | "careerairforce";

type ResourceCategory =
  | "tat_images"
  | "ppdt_images"
  | "wat_words"
  | "srt_situations"
  | "oir_verbal"
  | "oir_nonverbal";

type AccessMethod =
  | "direct_download"
  | "api"
  | "web_scraping"
  | "manual_collection";

interface FreeResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  provider: ResourceProvider;
  url: string;
  accessMethod: AccessMethod;
  itemCount: number;
  hasTimer: boolean;
  hasModelAnswers: boolean;
  license?: string;
  attributionRequired: boolean;
  lastVerified?: string;
  notes?: string;
}
```

## Next Steps

1. **Download Images:** Run the SSB Arena download tool to populate the `assets/` directory
2. **Verify Content:** Review downloaded content for quality and completeness
3. **Add Missing URLs:** Update placeholder URLs for SSBCrack and Centurion resources
4. **Implement API Integration:** Consider integrating with PsychoDrill API if available
5. **Add Attribution UI:** Display proper attribution in the application UI
6. **Regular Updates:** Periodically verify resource availability and update as needed

## Support

For questions or issues regarding free resource integration:

- Check the `src/lib/datasets/freeResourcesIntegration.ts` file for detailed documentation
- Review individual dataset files for specific implementation details
- Refer to source websites for terms of use and attribution requirements
