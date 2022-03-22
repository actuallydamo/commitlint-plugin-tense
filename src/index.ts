import { Plugin } from '@commitlint/types'
import { subjectTense } from './rules/subject-tense'

const plugin: Plugin = {
  rules: {
    'tense/subject-tense': subjectTense
  }
}

export = plugin
