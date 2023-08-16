/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 21:38:18
 * @LastEditors: wuqinfa
 * @Description: 
 */

// 七牛云参数的配置有点乱，文档里也没有找到明确的定义，自己按需再封装一层
export interface QiniuAuth {
  accessKey: string;
  secretKey: string;
  bucket: string // 七牛 空间名称
}
export interface QiniuOptions extends QiniuAuth {
  domain: string // 资源域名
  directory?: string // 指定目录
}

export interface UmiPluginOptions {
  ignoreHtml?: boolean; // 不上传html
  projectPath?: string;// 项目文件夹地址
  exclude?: RegExp; // 排除的文件
}

export interface UmiPluginQiniuOptions {
  qiniu: QiniuOptions;
  options: UmiPluginOptions;
}
