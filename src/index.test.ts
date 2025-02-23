import lint from '@commitlint/lint'
import load from '@commitlint/load'
import type { UserConfig } from '@commitlint/types'

import plugin from './index'

const CONFIG: UserConfig = {
  rules: {
    'tense/subject-tense': [2, 'always']
  },
  plugins: [plugin]
}

describe('when using default config', () => {
  it('lint errors for adds against default config', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint('test: adds stuff and or things', opts.rules, opts)
    })
    expect(result.valid).toBe(false)
  })

  it('lint succeeds for present-imperative against default config', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint('test: add stuff and or things', opts.rules, opts)
    })
    expect(result.valid).toBe(true)
  })

  it('lint succeeds for past-tense after first word', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint('test: add stuff and added things', opts.rules, opts)
    })
    expect(result.valid).toBe(true)
  })
})

describe('when using custom allowed tenses', () => {
  it('lint fails for present-imperative against past tense', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint(
        'test: add stuff and or things',
        {
          'tense/subject-tense': [
            2,
            'always',
            { allowedTenses: ['past-tense'] }
          ]
        },
        opts
      )
    })
    expect(result.valid).toBe(false)
  })

  it('lint succeeds for past-tense against past-tense', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint(
        'test: added stuff and or things',
        {
          'tense/subject-tense': [
            2,
            'always',
            { allowedTenses: ['past-tense'] }
          ]
        },
        opts
      )
    })
    expect(result.valid).toBe(true)
  })
})

describe('when firstOnly set to false', () => {
  it('lint fails for past-tense after first word', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint(
        'test: add stuff and added things',
        { 'tense/subject-tense': [2, 'always', { firstOnly: false }] },
        opts
      )
    })
    expect(result.valid).toBe(false)
  })
})

describe('when using a custom wordlist', () => {
  it('lint succeeds for allowlist word', async () => {
    const result = await load(CONFIG).then(async (opts) => {
      return await lint(
        'test: customword stuff and added things',
        { 'tense/subject-tense': [2, 'always', { allowlist: ['customword'] }] },
        opts
      )
    })
    expect(result.valid).toBe(true)
  })
})
