import yargs from 'yargs'

/**
 *
 * @param {string[]} argv
 * @param {{shouldExitOnError?: boolean}} options
 */
export async function app(argv, {shouldExitOnError = true} = {}) {
  const commandLineOptions = getCommandLineOptions(argv)

  const args = await commandLineOptions.exitProcess(shouldExitOnError).strict().help().parse()

  switch (args._[0]) {
    case undefined:
      await (await import(`./commands/play-command.js`)).default(args)
      break
    default:
      commandLineOptions.showHelp()
      break
  }
}

/**
 * @param {readonly string[]} argv
 */
function getCommandLineOptions(argv) {
  return yargs(argv).command('$0', 'play snake', (yargs) =>
    yargs
      .option('width', {
        alias: 'w',
        describe: 'width of board',
        type: 'number',
        default: 40,
      })
      .option('height', {
        alias: 'h',
        describe: 'some-option description',
        type: 'number',
        default: 20,
      })
      .option('tick', {
        alias: 't',
        describe: 'time of tick in ms',
        type: 'number',
        default: 500,
      })
      .option('num-ticks-to-lengthen', {
        alias: 'l',
        describe: 'number of ticks till snake is lengthened',
        type: 'number',
        default: 10,
      }),
  )
}
