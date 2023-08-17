# umi-plugin-qiniu

> 基于 Umi 4.0 开发

一款自动上传[Umi](https://github.com/umijs/umi)项目打包构建完成后的文件到[七牛云](https://www.qiniu.com/)的插件。


## 安装

```bash
npm i umi-plugin-qiniu --save-dev

or

yarn add umi-plugin-qiniu -D

or

pnpm add umi-plugin-qiniu -D
```

## 使用

在 `.umirc.ts` 中配置

```js
import { defineConfig } from "umi";

export default defineConfig({
  plugins: [
    ['umi-plugin-qiniu'],
  ],

  qiniu: {
    qiniu: {
      accessKey: '七牛的 accessKey',
      secretKey: '七牛的 secretKey',
      bucket: '七牛的存储空间名字',
      domain: 'xxx',
      directory: 'xxx',
    },
    options: {
      archive: {
        trigger: true,
        fileName: 'xxx',
        output: './',
      },
    },
  },
});
```

## 配置项
### qiniu 必填
配置七牛云相关的配置

|  属性   |  说明  | 类型  | 默认值  | 必填  |
|  :----:  | :----:  | :----:  | :----:  | :----:  |
| accessKey  | 七牛的 accessKey | string | - | 必填 |
| secretKey  | 七牛的 secretKey | string | - | 必填 |
| bucket  | 七牛的存储空间名字 | string | - | 必填 |
| domain  | 上传后资源的访问域名 | string | - | 必填 |
| directory  | 上传到七牛云的目录 | string | - | 非必填 |


### options 非必填
此插件相关的配置

|  属性   |  说明  | 类型  | 默认值  | 必填  |
|  :----:  | :----:  | :----:  | :----:  | :----:  |
| outputPath  | umi 构建产物的输出目录名字 | string | `dist` | 非必填 |
| archive  | 是否需要将构建产出的目录压缩打包后上传整个压缩包 | Archive | - | 非必填 |
| excludeHtml  | 不上传html | boolean | `false` | 非必填 |
| exclude  | 排除的文件 | RegExp | `/.DS_Store/` | 非必填 |

```typescript
interface Archive {
  trigger: boolean; // true: 触发  false：不触发
  fileName: string; // 输出的文件名
  output?: string; // 输出的路径
}
```

## TODO
1. ✅ 将 umi 构建产物目录中内容上传到七牛云
2. ✅ 将 umi 构建产物目录压缩成 `.zip` 包后上传到七牛云
3. 如有需要欢迎提 issue ...

## LICENSE
MIT
