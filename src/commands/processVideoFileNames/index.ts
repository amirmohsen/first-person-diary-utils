import { resolve, join } from 'path';
import { ensureDir, move, remove } from 'fs-extra/esm';
import { readdir } from 'fs/promises';

export interface ProcessVideoFileNamesArguments {
  src: string;
  media: string;
  proxy: string;
}

const currentDir = process.cwd();

const regex = /G(?:L|X)([0-9]{2})([0-9]{4})\.(LRV|MP4|THM)/;

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

  const fileOpPromises: Promise<void>[] = [];

  for (const srcFile of srcFiles) {
    const matches = regex.exec(srcFile);

    if (matches) {
      const [, chapterNo, fileNo, extension] = matches;
      const srcFilePath = join(srcDir, srcFile);

      if (extension === 'THM') {
        fileOpPromises.push(remove(srcFilePath));
        continue;
      }

      const newFileName = `${fileNo}-${chapterNo}.mp4`;

      const destFilePath = join(
        extension === 'MP4' ? mediaDir : proxyDir,
        newFileName,
      );

      fileOpPromises.push(move(srcFilePath, destFilePath));
    }
  }

  await Promise.all(fileOpPromises);
};

export default processVideoFileNames;
