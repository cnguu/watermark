import antfu from '@antfu/eslint-config'
import { configs as packageJsonConfigs } from 'eslint-plugin-package-json'

export default antfu(
  {
    type: 'lib',
    stylistic: true,
    typescript: true,
    jsonc: true,
    yaml: true,
    markdown: false,
  },
  {
    ...packageJsonConfigs.recommended,
    name: 'package-json/recommended',
  },
  {
    ...packageJsonConfigs.stylistic,
    name: 'package-json/stylistic',
  },
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
)
