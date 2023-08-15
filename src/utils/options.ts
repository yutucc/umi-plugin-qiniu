/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 21:39:55
 * @LastEditors: wuqinfa
 * @Description: 
 */
import type { IApi } from 'umi';

import {
  UmiPluginOptions,
  UmiPluginQiniuOptions,
} from '../interface/options';
import { KEY } from '../interface/const';

// 默认配置
const defaultConfigOptions: UmiPluginQiniuOptions = {
  qiniu: {
    accessKeyId: '',
    accessKeySecret: '',
  },
  options: {
    projectPath: '',
    ignoreHtml: true,// 不上传html
    exclude: /.DS_Store/, // 排除文件
  }
};

/**
 * @description: 插件 qiniu 默认配置
 * @param {IApi} api
 * @return {*}
 */
export const getQiniuOptions = (api: IApi): UmiPluginQiniuOptions['qiniu'] => ({
  ...defaultConfigOptions.qiniu,
  ...(api.userConfig[KEY].qiniu || {})
});


/**
 * @description: 插件选项的默认配置
 * @param {IApi} api
 * @return {*}
 */
export const getPluginOptions = (api: IApi): UmiPluginOptions => ({
  ...defaultConfigOptions.options,
  ...(api.userConfig[KEY].options || {})
});
