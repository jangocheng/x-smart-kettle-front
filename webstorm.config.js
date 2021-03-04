/**
 * 用于idea代码跳转的webpack配置
 * @作用: 用于项目中使用（ctrl+mouse1）或者（ctrl+b）跳转到变量或者组件声明处
 *
 * @设置方法：
 *      1.在src目录上右键->Mark Directory As -> Resource Root
 *      2.点击File | Settings | Languages & Frameworks | JavaScript | Webpack
 *      3.在文件选择框中选择到该文件
 *      4.设置完毕
 *
 */

const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir)
};
module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  }
};
