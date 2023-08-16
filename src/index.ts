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
import { filterFile, readBuildFilesSync, zip, } from './utils';

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
    console.log('initValue :>> ', initValue);
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
    
    // console.log('qiniuOptions :>> ', qiniuOptions);
    // console.log('pluginOptions :>> ', pluginOptions);
    api.logger.info('🤗 构建完成，即将开始把产物上传到七牛云', api.paths.absOutputPath);

    const files = readBuildFilesSync(api.paths.absOutputPath, api);
    console.log('files :>> ', files);

    if (files.length === 0) {
      api.logger.warn('😔 没有需要上传到七牛云的文件');
    } else {
      api.logger.info(`😁 待上传七牛云的文件总数：${files.length}`);
    }

    const res = await zip(api.paths.absOutputPath, './', 'code-cpp');
    console.log('res :>> ', res);

    // try {
    //   // 这样做的目的是为了解决： https://github.com/umijs/father/issues/591
    //   const ora = await import('ora');

    //   // const res: number = await uploadFiles(files, oss, options, api);
    //   // api.logger.info(`🎉  全部文件上传成功，共耗时：${(res / 1000).toFixed(2)}s`);

    //   const spinner = ora.default('上传').start()
    //   await upload(`test/${new Date().getTime()}.mp4`, '/Users/nicholas/Desktop/test-res/f474dbbb-0df4-4c5c-9718-6ffd601c5254.mp4', qiniuOptions, (percent: string) => {
    //     spinner.text = `进度：${Number(percent) * 100}%`;
    //   });

    //   spinner.succeed('上传成功');
    // } catch (error) {
    //   api.logger.error('😞 上传七牛云失败，请检查错误信息！');
    //   api.logger.error(error);
    // }
  });
};
