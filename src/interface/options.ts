/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 21:38:18
 * @LastEditors: wuqinfa
 * @Description: 
 */
export interface UmiPluginOptions {
  ignoreHtml?: boolean; // 不上传html
  projectPath?: string;// 项目文件夹地址
  exclude?: RegExp; // 排除的文件
}

export interface UmiPluginQiniuOptions {
  qiniu: any;
  options: UmiPluginOptions;
}
