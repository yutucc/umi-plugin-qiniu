/*
 * @Author: wuqinfa
 * @Date: 2023-08-17 17:31:57
 * @LastEditors: wuqinfa
 * @Description: 将产物压缩成一个压缩包后，上传压缩包
 */
import type { IApi } from 'umi';

import {
  QiniuOptions,
  UmiPluginOptions,
} from '../interface/options';

import { zip, } from './index';
import { upload } from './upload';

export default async (api: IApi, qiniuOptions: QiniuOptions, pluginOptions: UmiPluginOptions) => {
  // 这样做的目的是为了解决： https://github.com/umijs/father/issues/591
  const ora = await import('ora');

  const {
    // @ts-ignore
    fileName,
    // @ts-ignore
    output,
  } = pluginOptions.archive;

  const res = await zip(api.paths.absOutputPath, output, fileName);
  const key = qiniuOptions.directory ? `${qiniuOptions.directory}/${fileName}.zip` : `${fileName}.zip`;

  const spinner = ora.default(`上传 ${fileName}: 0%`).start();

  await upload(key, res as string, qiniuOptions, (percent: string) => {
    const temp = Number(percent) * 100;
    
    spinner.text = `上传 ${fileName}.zip: ${temp}%`;
  });

  spinner.succeed(`${fileName}.zip 上传成功`);
}