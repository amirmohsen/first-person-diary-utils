import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import processVideoFileNames from './commands/processVideoFileNames/index.js';

process.on('unhandledRejection', (reason) => {
  throw reason;
});

yargs(hideBin(process.argv))
  .command(
    'process-video-filenames',
    'order chapter files and rename low res files',
    (yargs: Argv) => {
      return yargs
        .option('src', {
          alias: 's',
          description: 'input directory for src files',
          type: 'string',
          default: process.cwd(),
        })
        .option('media', {
          alias: 'm',
          description: 'output directory for media files',
          type: 'string',
          default: 'media',
        })
        .option('proxy', {
          alias: 'p',
          description: 'output directory for proxy files',
          type: 'string',
          default: 'proxy',
        });
    },
    processVideoFileNames,
  )
  .completion()
  .demandCommand(1)
  .strict()
  .parse();
