import parse from '@commitlint/parse'
import { subjectTense } from './subject-tense'

const messages = {
  empty: 'test:\n',
  noVerbs: 'test: cool things',
  numeric: 'test: 1.0.0',
  pastParticiple: 'test: done cool things',
  pastTense: 'test: did cool things',
  presentImperative: 'test: do cool things',
  presentParticiple: 'test: doing cool things',
  presentThirdPerson: 'test: does cool things'
}

const parsed = {
  empty: parse(messages.empty),
  noVerbs: parse(messages.noVerbs),
  numeric: parse(messages.numeric),
  pastParticiple: parse(messages.pastParticiple),
  pastTense: parse(messages.pastTense),
  presentImperative: parse(messages.presentImperative),
  presentParticiple: parse(messages.presentParticiple),
  presentThirdPerson: parse(messages.presentThirdPerson)
}

test('with empty subject should succeed and no match', async () => {
  const [matches] = await subjectTense(await parsed.empty)
  expect(matches).toBe(true)
})

test('with empty subject should succeed and never match', async () => {
  const [matches] = await subjectTense(await parsed.empty, 'never')
  expect(matches).toBe(true)
})

test('with empty subject should succeed and always match', async () => {
  const [matches] = await subjectTense(await parsed.empty, 'always')
  expect(matches).toBe(true)
})

test('with no verbs subject should succeed', async () => {
  const [matches] = await subjectTense(await parsed.noVerbs, 'always')
  expect(matches).toBe(true)
})

test('with numeric subject should succeed', async () => {
  const [matches] = await subjectTense(await parsed.numeric, 'always')
  expect(matches).toBe(true)
})

test('true for past-tense against past-tense', async () => {
  const [matches] = await subjectTense(await parsed.pastTense, 'always', {
    allowedTenses: ['past-tense']
  })
  expect(matches).toBe(true)
})

test('true for present-imperative against present-imperative', async () => {
  const [matches] = await subjectTense(
    await parsed.presentImperative,
    'always',
    {
      allowedTenses: ['present-imperative']
    }
  )
  expect(matches).toBe(true)
})

test('false for never present-imperative against present-imperative', async () => {
  const [matches] = await subjectTense(
    await parsed.presentImperative,
    'never',
    {
      allowedTenses: ['present-imperative']
    }
  )
  expect(matches).toBe(false)
})

test('true for present-participle against present-participle', async () => {
  const [matches] = await subjectTense(
    await parsed.presentParticiple,
    'always',
    {
      allowedTenses: ['present-participle']
    }
  )
  expect(matches).toBe(true)
})

test('true for present-third-person against present-third-person', async () => {
  const [matches] = await subjectTense(
    await parsed.presentThirdPerson,
    'always',
    {
      allowedTenses: ['present-third-person']
    }
  )
  expect(matches).toBe(true)
})

test('false for past-tense against present-third-person', async () => {
  const [matches, message] = await subjectTense(
    await parsed.pastTense,
    'always',
    {
      allowedTenses: ['present-third-person']
    }
  )
  expect(matches).toBe(false)
  expect(message).toBe(
    'tense of subject must be present-third-person. Words in other tenses: did - past-tense'
  )
})

test('false for past-participle against present-third-person', async () => {
  const [matches, message] = await subjectTense(
    await parsed.pastParticiple,
    'always',
    {
      allowedTenses: ['present-third-person']
    }
  )
  expect(matches).toBe(false)
  expect(message).toBe(
    'tense of subject must be present-third-person. Words in other tenses: done - past-participle'
  )
})

test('false for present-imperative against past-tense', async () => {
  const [matches, message] = await subjectTense(
    await parsed.presentImperative,
    'always',
    {
      allowedTenses: ['past-tense']
    }
  )
  expect(matches).toBe(false)
  expect(message).toBe(
    'tense of subject must be past-tense. Words in other tenses: do - present-imperative'
  )
})

test('false for present-participle against present-third-person', async () => {
  const [matches, message] = await subjectTense(
    await parsed.presentParticiple,
    'always',
    {
      allowedTenses: ['present-third-person']
    }
  )
  expect(matches).toBe(false)
  expect(message).toBe(
    'tense of subject must be present-third-person. Words in other tenses: doing - present-participle'
  )
})

test('false for present-third-person against past-tense', async () => {
  const [matches, message] = await subjectTense(
    await parsed.presentThirdPerson,
    'always',
    {
      allowedTenses: ['past-tense']
    }
  )
  expect(matches).toBe(false)
  expect(message).toBe(
    'tense of subject must be past-tense. Words in other tenses: does - present-third-person'
  )
})
