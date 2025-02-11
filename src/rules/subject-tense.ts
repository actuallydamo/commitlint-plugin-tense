import { Rule } from '@commitlint/types'
import message from '@commitlint/message'
import { ensureTense, Tense, TenseOptions } from '../library/ensure-tense'

const negated = (when?: string): boolean => when === 'never'

interface RuleOptions {
  allowedTenses?: Tense[]
  firstOnly?: boolean
  allowlist?: string[]
}

export const subjectTense: Rule<RuleOptions> = (
  parsed,
  when = 'always',
  userOptions
) => {
  const { subject } = parsed
  const options: TenseOptions = {
    allowedTenses: ['present-imperative'],
    firstOnly: true,
    allowlist: [],
    ...userOptions
  }

  if (typeof subject !== 'string' || subject.match(/^[a-z]/i) == null) {
    return [true]
  }

  const { matches, offending } = ensureTense(subject.toLowerCase(), options)

  const offenders = offending
    .map(({ lemma, tense }) => `${lemma}${tense === '' ? '' : ` - ${tense}`}`)
    .join(',')

  const list = options.allowedTenses.join(', ')

  return [
    negated(when) ? !matches : matches,
    message([
      'tense of subject must',
      negated(when) ? 'not' : null,
      `be ${list}. Words in other tenses: ${offenders}`
    ])
  ]
}
