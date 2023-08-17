/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 22:37:02
 * @LastEditors: wuqinfa
 * @Description: 简单封装一下七牛云 nodejs sdk
 * https://developer.qiniu.com/kodo/1289/nodejs#server-upload
 */
import qiniu from 'qiniu';

import { QiniuAuth, QiniuOptions, } from '../interface/options';

const getUploadToken = (data: QiniuAuth, key: string) => {
  const {
    accessKey,
    secretKey,
    bucket,
  } = data;

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: `${bucket}:${key}`, // 加上文件 key，表示上传时可以覆盖同名文件，详细规则见： https://developer.qiniu.com/kodo/1206/put-policy
  });
  const uploadToken = putPolicy.uploadToken(mac);

  return uploadToken;
};

const formatDomain = (domain: string) => {
  const last = domain.slice(-1);

  return last === '/' ? domain : `${domain}/`;
}

export const upload = (key: string, filePath: string, options: QiniuOptions, onProgress: Function) => {
  const {
    accessKey,
    secretKey,
    bucket,
    domain,
  } = options;

  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config();
    const resumeUploader = new qiniu.resume_up.ResumeUploader(config);
    const putExtra = new qiniu.resume_up.PutExtra();
    const uploadToken = getUploadToken({
      accessKey,
      secretKey,
      bucket,
    }, key);

    //分片上传可指定 version 字段，v2 表示分片上传 v2 , 可自定义分片大小，此处设为 6MB
    putExtra.version = 'v2';
    putExtra.partSize = 6 * 1024 * 1024;

    // PS：只有采用 resume_up(文件分片上传) 这种方式才能获取到进度
    putExtra.progressCallback = (uploadBytes, totalBytes) => {
      const percent = (uploadBytes / totalBytes);
      
      onProgress(percent.toFixed(4));
    };

    resumeUploader.putFile(uploadToken, key, filePath, putExtra, (respErr: any, respBody: any, respInfo: any) => {
      if (respErr) {
        reject(respErr);
      }

      if (respInfo.statusCode == 200 && respBody.key) {
        resolve(`${formatDomain(domain)}${respBody.key}`);
      } else {
        reject(respInfo);
      }
    });
  });
};