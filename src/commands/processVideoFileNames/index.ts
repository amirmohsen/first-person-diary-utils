import { resolve, join } from 'path';
import { ensureDir, move } from 'fs-extra/esm';
import { readdir } from 'fs/promises';

export interface ProcessVideoFileNamesArguments {
  src: string;
  media: string;
  proxy: string;
}

const currentDir = process.cwd();

const regex = /G(?:L|X)([0-9]{2})([0-9]{4})\.(LRV|MP4)/;

const processVideoFileNames = async (argv: ProcessVideoFileNamesArguments) => {
  const { src, media, proxy } = argv;

  const srcDir = resolve(currentDir, src);
  const mediaDir = resolve(currentDir, media);
  const proxyDir = resolve(currentDir, proxy);

  const [srcFiles] = await Promise.all([
    readdir(srcDir),
    ensureDir(mediaDir),
    ensureDir(proxyDir),
  ]);

  const srcMovePromises: Promise<void>[] = [];

  for (const srcFile of srcFiles) {
    const matches = regex.exec(srcFile);

    if (matches) {
      const [, chapterNo, fileNo, extension] = matches;
      const newFileName = `${fileNo}-${chapterNo}.mp4`;

      const srcFilePath = join(srcDir, srcFile);
      const destFilePath = join(
        extension === 'MP4' ? mediaDir : proxyDir,
        newFileName,
      );

      srcMovePromises.push(move(srcFilePath, destFilePath));
    }
  }

  await Promise.all(srcMovePromises);
};

export default processVideoFileNames;
