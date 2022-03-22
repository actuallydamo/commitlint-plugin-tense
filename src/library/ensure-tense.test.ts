import { ensureTense, TenseOptions } from './ensure-tense'
import { Lexer, Tagger } from 'fast-tag-pos'

const defaultOptions: TenseOptions = {
  allowedTenses: ['present-imperative'],
  firstOnly: true,
  allowlist: []
}

const subjects = {
  pastParticiple: 'done cool things',
  pastTense: 'did cool things',
  presentImperative: 'do cool things',
  presentParticiple: 'doing cool things',
  presentThirdPerson: 'does cool things'
}

test('true for past-tense against past-tense', () => {
  const { matches } = ensureTense(subjects.pastTense, {
    ...defaultOptions,
    allowedTenses: ['past-tense']
  })
  expect(matches).toBe(true)
})

test('true for past-participle against past-participle', () => {
  const { matches } = ensureTense(subjects.pastParticiple, {
    ...defaultOptions,
    allowedTenses: ['past-participle']
  })
  expect(matches).toBe(true)
})

test('true for present-imperative against present-imperative', () => {
  const { matches } = ensureTense(subjects.presentImperative, {
    ...defaultOptions,
    allowedTenses: ['present-imperative']
  })
  expect(matches).toBe(true)
})

test('true for present-participle against present-participle', () => {
  const { matches } = ensureTense(subjects.presentParticiple, {
    ...defaultOptions,
    allowedTenses: ['present-participle']
  })
  expect(matches).toBe(true)
})

test('true for present-third-person against present-third-person', () => {
  const { matches } = ensureTense(subjects.presentThirdPerson, {
    ...defaultOptions,
    allowedTenses: ['present-third-person']
  })
  expect(matches).toBe(true)
})

test('false for past-tense against present-third-person', () => {
  const { matches, offending } = ensureTense(subjects.pastTense, {
    ...defaultOptions,
    allowedTenses: ['present-third-person']
  })
  expect(matches).toBe(false)
  expect(offending).toEqual([
    {
      lemma: 'did',
      tense: 'past-tense'
    }
  ])
})

test('false for present-imperative against past-tense', () => {
  const { matches, offending } = ensureTense(subjects.presentImperative, {
    ...defaultOptions,
    allowedTenses: ['past-tense']
  })
  expect(matches).toBe(false)
  expect(offending).toEqual([
    {
      lemma: 'do',
      tense: 'present-imperative'
    }
  ])
})

test('false for present-participle against present-third-person', () => {
  const { matches, offending } = ensureTense(subjects.presentParticiple, {
    ...defaultOptions,
    allowedTenses: ['present-third-person']
  })
  expect(matches).toBe(false)
  expect(offending).toEqual([
    {
      lemma: 'doing',
      tense: 'present-participle'
    }
  ])
})

test('false for present-third-person against past-tense', () => {
  const { matches, offending } = ensureTense(subjects.presentThirdPerson, {
    ...defaultOptions,
    allowedTenses: ['past-tense']
  })
  expect(matches).toBe(false)
  expect(offending).toEqual([
    {
      lemma: 'does',
      tense: 'present-third-person'
    }
  ])
})

test('true for default allowed word against default allowlist when present-imperative', () => {
  const { matches } = ensureTense('decouple cool things', {
    ...defaultOptions,
    allowedTenses: ['present-imperative']
  })
  expect(matches).toBe(true)
})

test('false for default allowed word against default allowlist when past-tense', () => {
  const { matches } = ensureTense('decouple and add cool things', {
    ...defaultOptions,
    allowedTenses: ['past-tense']
  })
  expect(matches).toBe(false)
})

test('true for allowed word against custom allowlist', () => {
  const { matches } = ensureTense('customword cool things', {
    ...defaultOptions,
    allowlist: ['customword']
  })
  expect(matches).toBe(true)
})

test('true for incorrect tense not in first word', () => {
  const { matches } = ensureTense('do cool things adds it now', {
    ...defaultOptions
  })
  expect(matches).toBe(true)
})

test('false for incorrect tense in any word', () => {
  const { matches } = ensureTense('add cool things adds it now', {
    ...defaultOptions,
    firstOnly: false
  })
  expect(matches).toBe(false)
})

test('true for multiple tenses matching', () => {
  const { matches } = ensureTense('did cool things done it now', {
    ...defaultOptions,
    firstOnly: false,
    allowedTenses: ['past-participle', 'past-tense']
  })
  expect(matches).toBe(true)
})

test('false for multiple tenses not matching', () => {
  const { matches } = ensureTense('did cool things done it now', {
    ...defaultOptions,
    firstOnly: false,
    allowedTenses: ['past-participle', 'present-imperative']
  })
  expect(matches).toBe(false)
})

describe('when Tagger throw an error', () => {
  beforeAll(() => {
    jest.spyOn(Tagger.prototype, 'tag').mockImplementation(() => {
      throw new Error('Test error')
    })
  })

  it('should succeed', () => {
    const { matches } = ensureTense(subjects.pastTense, {
      ...defaultOptions,
      firstOnly: false
    })
    expect(matches).toBe(true)
  })
})

describe('when Lexer throw an error', () => {
  beforeAll(() => {
    jest.spyOn(Lexer.prototype, 'lex').mockImplementation(() => {
      throw new Error('Test error')
    })
  })

  it('should succeed', () => {
    const { matches } = ensureTense(subjects.pastTense, {
      ...defaultOptions,
      firstOnly: false
    })
    expect(matches).toBe(true)
  })
})
