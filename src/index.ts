/*
 * @Author: wuqinfa
 * @Date: 2023-08-11 20:15:34
 * @LastEditors: wuqinfa
 * @Description: 
 */
import type { IApi } from 'umi';

import { KEY, } from './interface/const';
import { getQiniuOptions, getPluginOptions } from './utils/options';
import { upload } from './utils/upload';
import upZip from './utils/upZip';
import { filterFile, readBuildFilesSync, zip, decide, } from './utils';

export default (api: IApi) => {
  // See https://umijs.org/docs/guides/plugins
  api.describe({
    key: KEY,
    config: {
      schema(joi: any) {
        return joi.object();
      },
    },
    enableBy: api.EnableBy.config
  });

  api.modifyConfig((initValue: any) => {
    // console.log('initValue :>> ', initValue);
    const { publicPath } = initValue || {};
    if (api.userConfig[KEY].oss && (publicPath === '/' || publicPath === '')) {
        api.logger.warn(`❗️  请检查是否正确配置publicPath,未正确配置将导致HTML文件无法使用阿里云OSS文件`);
        api.logger.warn(`❗️  配置示例：https://umi-test.oss-cn-hangzhou.aliyuncs.com/umi-test/`);
    }
    return initValue;
  });

  api.onBuildComplete(async ({ err }: any) => {
    if (err) {
      api.logger.error('😞 构建失败！');
      return;
    }

    const qiniuOptions = getQiniuOptions(api);
    const pluginOptions = getPluginOptions(api);
    
    console.log('qiniuOptions :>> ', qiniuOptions);
    console.log('pluginOptions :>> ', pluginOptions);
    api.logger.info('🤗 构建完成，即将开始把产物上传到七牛云');

    const files = readBuildFilesSync(api.paths.absOutputPath, api);
    console.log('files :>> ', files);

    if (files.length === 0) {
      api.logger.warn('😔 没有需要上传到七牛云的文件');
    } else {
      api.logger.info(`😁 待上传七牛云的文件总数：${files.length}`);
    }

    try {
      // 这样做的目的是为了解决： https://github.com/umijs/father/issues/591
      // const ora = await import('ora');

      if (decide(pluginOptions.archive, 'trigger')) {
        upZip(api, qiniuOptions, pluginOptions);
        return;
      }

      const promises =files.map((item: string) => {
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
      api.logger.error('😞 上传七牛云失败，请检查错误信息！');
      api.logger.error(error);
    }
  });
};
