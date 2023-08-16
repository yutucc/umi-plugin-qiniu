/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 22:37:02
 * @LastEditors: wuqinfa
 * @Description: 
 */
import qiniu from 'qiniu';

import { QiniuAuth } from '../interface/options';

const getUploadToken = (data: QiniuAuth) => {
  const {
    accessKey,
    secretKey,
    bucket,
  } = data;
  const options = {
    scope: bucket,
  };

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  return uploadToken;
};

export const upload = (key: string, filePath: string) => {
  const config = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  const uploadToken = getUploadToken({
    accessKey: '',
    secretKey: '',
    bucket: '',
  });

  formUploader.putFile(uploadToken, key, filePath, putExtra, (respErr: any, respBody: any, respInfo: any) => {
    if (respErr) {
      throw respErr;
    }

    if (respInfo.statusCode == 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
};