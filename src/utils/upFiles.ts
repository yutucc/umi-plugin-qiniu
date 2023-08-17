/*
 * @Author: wuqinfa
 * @Date: 2023-08-17 17:32:05
 * @LastEditors: wuqinfa
 * @Description: 上传构建的产物
 */
import type { IApi } from 'umi';

import {
  QiniuOptions,
  UmiPluginOptions,
} from '../interface/options';

import { upload } from './upload';

export default async (api: IApi, qiniuOptions: QiniuOptions, pluginOptions: UmiPluginOptions, files: string[]) => {
  try {
    // 这样做的目的是为了解决： https://github.com/umijs/father/issues/591
    const ora = await import('ora');

    const promises = files.map((item: string) => {
      const file = item.split('/dist/')[1];
      const key = qiniuOptions.directory ? `${qiniuOptions.directory}/${file}` : file;
      
      const spinner = ora.default(`上传 ${file}: 0%`).start();
      return upload(key, item, qiniuOptions, (percent: string) => {
        const temp = Number(percent) * 100;
        
        if (temp >= 100) {
          spinner.succeed(`${file} 上传成功`);
        } else {
          spinner.text = `上传 ${file}: ${temp}%`;
        }
      });
    });

    Promise.all(promises)
    .then(() => {
      api.logger.info('🎉 全部文件上传成功');
    })
    .catch((err) => {
      throw err;
    });
  } catch (error) {
    throw error;
  }
}