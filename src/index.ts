/*
 * @Author: wuqinfa
 * @Date: 2023-08-11 20:15:34
 * @LastEditors: wuqinfa
 * @Description: 
 */
import type { IApi } from 'umi';

import { KEY, } from './interface/const';
import { getQiniuOptions, getPluginOptions } from './utils/options';
import upZip from './utils/upZip';
import upFiles from './utils/upFiles';
import { readBuildFilesSync, } from './utils';

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

  // api.modifyConfig((initValue: any) => {
  //   // console.log('initValue :>> ', initValue);
  //   const { publicPath } = initValue || {};
  //   if (api.userConfig[KEY].oss && (publicPath === '/' || publicPath === '')) {
  //       api.logger.warn(`❗️  请检查是否正确配置publicPath,未正确配置将导致HTML文件无法使用阿里云OSS文件`);
  //       api.logger.warn(`❗️  配置示例：https://umi-test.oss-cn-hangzhou.aliyuncs.com/umi-test/`);
  //   }
  //   return initValue;
  // });

  // api.onCheckConfig(({ config, userConfig }) => {
  //   console.log('config :>> ', config);
  //   console.log('userConfig :>> ', userConfig);
  //   return true;
  // });

  api.onBuildComplete(async ({ err }: any) => {
    if (err) {
      api.logger.error('😞 构建失败！');
      return;
    }

    const qiniuOptions = getQiniuOptions(api);
    const pluginOptions = getPluginOptions(api);
    
    api.logger.info('🤗 构建完成，即将开始把产物上传到七牛云');

    const files = readBuildFilesSync(api.paths.absOutputPath, api);

    if (files.length === 0) {
      api.logger.warn('😔 没有需要上传到七牛云的文件');
      return;
    }

    try {
      if (pluginOptions.archive && pluginOptions.archive.trigger) {
        upZip(api, qiniuOptions, pluginOptions);
        return;
      }

      upFiles(api, qiniuOptions, pluginOptions, files);
    } catch (error) {
      api.logger.error('😞 上传七牛云失败，请检查错误信息！');
      api.logger.error(error);
    }
  });
};
