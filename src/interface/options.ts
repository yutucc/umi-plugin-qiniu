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
  directory?: string // 上传到七牛云的目录
}

interface Archive {
  trigger: boolean; // true: 触发  false：不触发
  fileName: string; // 输出的文件名
  output?: string; // 输出的路径
}

export interface UmiPluginOptions {
  outputPath?: string; // umi 构建产物的输出目录名字
  archive?: Archive; // 将构建产出的目录压缩打包后上传整个压缩包
  excludeHtml?: boolean; // 不上传html
  exclude?: RegExp; // 排除的文件
}

export interface UmiPluginQiniuOptions {
  qiniu: QiniuOptions;
  options: UmiPluginOptions;
}
