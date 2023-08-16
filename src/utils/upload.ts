/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 22:37:02
 * @LastEditors: wuqinfa
 * @Description: 
 */
import qiniu from 'qiniu';

import { QiniuAuth, QiniuOptions, } from '../interface/options';

const getUploadToken = (data: QiniuAuth) => {
  const {
    accessKey,
    secretKey,
    bucket,
  } = data;

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
  });
  const uploadToken = putPolicy.uploadToken(mac);

  return uploadToken;
};

export const upload = (key: string, filePath: string, options: QiniuOptions) => {
  const {
    accessKey,
    secretKey,
    bucket,
  } = options;

  const config = new qiniu.conf.Config();
  const resumeUploader = new qiniu.resume_up.ResumeUploader(config);
  const putExtra = new qiniu.resume_up.PutExtra();
  const uploadToken = getUploadToken({
    accessKey,
    secretKey,
    bucket,
  });

  //分片上传可指定 version 字段，v2 表示分片上传 v2 , 可自定义分片大小，此处设为 6MB
  putExtra.version = 'v2';
  putExtra.partSize = 6 * 1024 * 1024;

  putExtra.progressCallback = (uploadBytes, totalBytes) => {
    console.log('progress:' + uploadBytes + '(' + totalBytes + ')');
  };

  resumeUploader.putFile(uploadToken, key, filePath, putExtra, (respErr: any, respBody: any, respInfo: any) => {
    // console.log('respErr :>> ', respErr);
    console.log('respBody :>> ', respBody);
    // console.log('respInfo :>> ', respInfo);
    if (respErr) {
      throw respErr;
    }

    // if (respInfo.statusCode == 200) {
    //   console.log(respBody);
    // } else {
    //   console.log(respInfo.statusCode);
    //   console.log(respBody);
    // }
  });
};