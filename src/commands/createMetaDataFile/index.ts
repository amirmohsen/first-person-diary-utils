import { readdir } from 'fs/promises';
import { join } from 'path';
import { checkbox, input } from '@inquirer/prompts';
import { remove, writeJson } from 'fs-extra/esm';

export interface CreateMetaDataFileArguments {}

export interface NumberedMediaFiles {
  [fileNo: string]: string[];
}

export interface MetaData {
  timelines: {
    [timelineId: string]: string[];
  };
}

const currentDir = process.cwd();

const regex = /([0-9]{4})-[0-9]{2}\.mp4/;

const createMetaDataFile = async (argv: CreateMetaDataFileArguments) => {
  const mediaDir = join(currentDir, 'media');
  const metadataFile = join(currentDir, 'meta.json');

  const mediaFiles = (await readdir(mediaDir)).sort();

  const numberedMediaFiles = mediaFiles.reduce((acc, mediaFile) => {
    const matches = regex.exec(mediaFile);

    if (matches) {
      const [, fileNo, chapterNo] = matches;

      if (!acc[fileNo]) {
        acc[fileNo] = [];
      }

      acc[fileNo].push(mediaFile);
    }

    return acc;
  }, {} as NumberedMediaFiles);

  const metadata: MetaData = {
    timelines: {},
  };

  while (Object.keys(numberedMediaFiles).length) {
    const timelineId = await input({ message: 'Timeline id?' });

    if (!timelineId) {
      break;
    }

    const fileIds = await checkbox({
      message: 'Rrelevant media files?',
      choices: Object.keys(numberedMediaFiles).map((fileNo) => ({
        value: fileNo,
      })),
    });

    if (!fileIds.length) {
      break;
    }

    const timelineFiles: string[] = [];

    for (const fileId of fileIds) {
      timelineFiles.push(...numberedMediaFiles[fileId]);
      Reflect.deleteProperty(numberedMediaFiles, fileId);
    }

    metadata.timelines[timelineId] = timelineFiles;
  }

  await remove(metadataFile);

  await writeJson(metadataFile, metadata, {
    spaces: 2,
  });
};

export default createMetaDataFile;
