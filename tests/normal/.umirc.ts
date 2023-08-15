/*
 * @Author: wuqinfa
 * @Date: 2023-08-15 21:03:12
 * @LastEditors: wuqinfa
 * @Description: 
 */
import { defineConfig } from "umi";

export default defineConfig({
  plugins: [
    // require.resolve('../../dist/cjs/index.js')
    '../../dist/cjs/index.js'
  ],

  qiniu: {},

  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'pnpm',
});
