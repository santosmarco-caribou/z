import chalk from 'chalk'

export type ZHintHelpers = {}

const ZHintHelpers = {}

export const generateZHint = (generator: (helpers: ZHintHelpers) => string): string => {
  const hint = generator(ZHintHelpers)

  const colorized = colorizeZHint(hint)

  return colorized
}

export const colorizeZHint = (hint: string): string => {
  return (
    hint
      // `:` and `?:` in objects
      .replaceAll(/(.)(\??:) /g, `$1${chalk.magenta('$2')} `)
      // `|` in unions and `$` in intersections
      .replaceAll(/ (\||&) /g, ` ${chalk.magenta('$1')} `)
      // `instanceof` keyword
      .replaceAll(/(instanceof)/g, chalk.magenta('$1'))
      // string literals
      .replaceAll(/'(\w*)'/g, chalk.yellow("'$1'"))
      // types
      .replaceAll(
        /(null|undefined|string|number|boolean|true|false|symbol|any|never|unknown|void|bigint|Date|Record|Readonly|Map|Set)/g,
        chalk.cyan('$1')
      )
      // format
      .replaceAll(/(\(\$[^)]*\))/g, chalk.italic.gray('$1'))
  )
}
