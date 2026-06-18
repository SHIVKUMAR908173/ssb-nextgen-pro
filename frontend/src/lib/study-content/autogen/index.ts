import { TopicContent } from '../types'

import { NDA_CALC_AUTOGEN } from './nda/nda-calc'
import { NDA_VECTORS_AUTOGEN } from './nda/nda-vectors'
import { NDA_ALGEBRA_AUTOGEN } from './nda/nda-algebra'
import { NDA_GAT_PHYSICS_AUTOGEN } from './nda/nda-gat-physics'
import { NDA_GAT_POLITY_AUTOGEN } from './nda/nda-gat-polity'
import { NDA_GAT_ENGLISH_AUTOGEN } from './nda/nda-gat-english'
import { CDS_ENG_GRAMMAR_AUTOGEN } from './cds/cds-eng-grammar'
import { CDS_GK_HISTORY_AUTOGEN } from './cds/cds-gk-history'
import { CDS_GK_MATH_AUTOGEN } from './cds/cds-gk-math'
import { AFCAT_SPEED_AUTOGEN } from './afcat/afcat-speed'
import { AFCAT_SPATIAL_AUTOGEN } from './afcat/afcat-spatial'
import { AFCAT_IAF_AUTOGEN } from './afcat/afcat-iaf'
import { SSB_OIR_AUTOGEN } from './ssb/ssb-oir'
import { SSB_TAT_AUTOGEN } from './ssb/ssb-tat'
import { SSB_SRT_AUTOGEN } from './ssb/ssb-srt'
import { SSB_GPE_AUTOGEN } from './ssb/ssb-gpe'
import { SSB_PI_AUTOGEN } from './ssb/ssb-pi'

export const AUTOGEN_REGISTRY: Record<string, TopicContent[]> = {
  'nda-calc': NDA_CALC_AUTOGEN,
  'nda-vectors': NDA_VECTORS_AUTOGEN,
  'nda-algebra': NDA_ALGEBRA_AUTOGEN,
  'nda-gat-physics': NDA_GAT_PHYSICS_AUTOGEN,
  'nda-gat-polity': NDA_GAT_POLITY_AUTOGEN,
  'nda-gat-english': NDA_GAT_ENGLISH_AUTOGEN,
  'cds-eng-grammar': CDS_ENG_GRAMMAR_AUTOGEN,
  'cds-gk-history': CDS_GK_HISTORY_AUTOGEN,
  'cds-gk-math': CDS_GK_MATH_AUTOGEN,
  'afcat-speed': AFCAT_SPEED_AUTOGEN,
  'afcat-spatial': AFCAT_SPATIAL_AUTOGEN,
  'afcat-iaf': AFCAT_IAF_AUTOGEN,
  'ssb-oir': SSB_OIR_AUTOGEN,
  'ssb-tat': SSB_TAT_AUTOGEN,
  'ssb-srt': SSB_SRT_AUTOGEN,
  'ssb-gpe': SSB_GPE_AUTOGEN,
  'ssb-pi': SSB_PI_AUTOGEN,
}
