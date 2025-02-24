import {
  Lexer,
  TagType,
  type TaggedSentence,
  type TaggedWord,
  Tagger
} from 'fast-tag-pos'
import { allowlist as defaultAllowlist } from './allowlist'
export type Tense =
  | 'past-participle'
  | 'past-tense'
  | 'present-imperative'
  | 'present-participle'
  | 'present-third-person'

const lexer = new Lexer()
const tagger = new Tagger()

const tenses: { [key: string]: TagType } = {
  'past-participle': TagType.VBN,
  'past-tense': TagType.VBD,
  'present-imperative': TagType.VBP,
  'present-participle': TagType.VBG,
  'present-third-person': TagType.VBZ
}

function getLemmata(input: string): string[] {
  try {
    return lexer.lex(input)
  } catch (err) {
    return []
  }
}

function getTags(lemmata: string[]): TaggedSentence {
  try {
    return tagger.tag(lemmata)
  } catch (err) {
    return []
  }
}

export interface TenseOptions {
  allowedTenses: Tense[]
  firstOnly: boolean
  allowlist: string[]
}

export const ensureTense = (
  input: string,
  options: TenseOptions
): { matches: boolean; offending: Array<{ lemma: string; tense: string }> } => {
  const tags = options.allowedTenses.map((tense) => tenses[tense])
  const allowlist = getAllowList(options.allowlist, options.allowedTenses)
  const lemmata = getLemmata(input.toLowerCase().replace("don't", "do not"))
  const tagged = getTags(lemmata)
  const verbs = getVerbs(tagged, options.firstOnly, allowlist)

  const offending = verbs
    .filter(([, tag]) => !tags.includes(tag))
    .filter(([lemma]) => !allowlist.includes(lemma))
    .map(([lemma, tag]) => {
      const tense = getTenseFromTag(tag)
      return { lemma, tense }
    })

  return {
    matches: offending.length === 0,
    offending
  }
}

function getAllowList(
  userAllowlist: string[],
  allowedTenses: Tense[]
): string[] {
  if (allowedTenses.includes('present-imperative')) {
    return [...userAllowlist, ...defaultAllowlist]
  }
  return userAllowlist
}

function getTenseFromTag(tag: TagType): string {
  const tense = Object.keys(tenses).find((key) => tenses[key] === tag)
  return tense !== undefined ? tense : ''
}

function getVerbs(
  tags: TaggedSentence,
  firstOnly: boolean,
  allowlist: string[]
): TaggedWord[] {
  if (firstOnly === true) {
    const verb = tags.find(
      ([lemma, tag]) => tag[0] === 'V' || allowlist.includes(lemma)
    )
    return verb !== undefined ? [verb] : []
  }
  return tags.filter(([, tag]) => tag[0] === 'V')
}
