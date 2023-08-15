/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 22:22:26
 * @LastEditors: wuqinfa
 * @Description: 
 */
import type { IApi } from 'umi';

import fs from 'fs';

import { getPluginOptions } from './options';

/**
 * @description: 判断文件是否需要忽略
 * @param {string} filePath
 * @param {IApi} api
 * @return {*}
 */
export const filterFile = (filePath: string, api: IApi): boolean => {
  let { exclude, ignoreHtml } = getPluginOptions(api);
  // @ts-ignore
  let reg: RegExp[] = [exclude];

  if (ignoreHtml) {
    reg.push(/\/*.html/);
  }
  
  return reg.some((item: RegExp) => item.test(filePath));
}

/**
 * @description: 读取构建完成之后的文件夹
 * @param {string} path
 * @param {IApi} api
 * @return {*}
 */
export const readBuildFilesSync = (path: string, api: IApi): string[] => {
  let uploadFiles: string[] = [];

  if (!path) {
    api.logger.error('😞 构建输出路径不能为空！');
    return [];
  }
  if (!fs.existsSync(path)) {
    api.logger.error(`😞 没有找到构建输出地址，请检查构建文件输出地址是否正确: ${path} `);
    return [];
  }

  fs.readdirSync(path).forEach((name: string) => {
    let filePath = `${path}/${name}`;
    if (fs.statSync(filePath).isDirectory()) {
      uploadFiles = uploadFiles.concat(readBuildFilesSync(filePath, api));
    } else if (!filterFile(filePath, api)) {
      uploadFiles.push(filePath);
    }
  })
  return uploadFiles;
}