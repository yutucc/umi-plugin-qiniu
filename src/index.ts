/*
 * @Author: wuqinfa
 * @Date: 2023-08-11 20:15:34
 * @LastEditors: wuqinfa
 * @Description: 
 */
import type { IApi } from 'umi';

import { KEY, } from './interface/const';

export default (api: IApi) => {
  // See https://umijs.org/docs/guides/plugins
  api.describe({
    key: KEY,
    config: {
      schema(joi) {
        return joi.string();
      },
    },
    enableBy: api.EnableBy.config
  });

  api.onBuildComplete(async ({ err }) => {

  });

  api.modifyConfig((initValue) => {
    const { publicPath } = initValue || {};
    if (api.userConfig[KEY].oss && (publicPath === '/' || publicPath === '')) {
        api.logger.warn(`❗️  请检查是否正确配置publicPath,未正确配置将导致HTML文件无法使用阿里云OSS文件`);
        api.logger.warn(`❗️  配置示例：https://umi-test.oss-cn-hangzhou.aliyuncs.com/umi-test/`);
    }
    return initValue;
  });
};
