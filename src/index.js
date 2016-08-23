/**
 * 入口
 * @author jerojiang
 * @date 2016-08-22
 */

import { util as _ } from 'fis3';
import Project from './project';


const CONFIG = {
  // 脚本占位符
  scriptPlaceHolder: '<!--SCRIPT_PLACEHOLDER-->',

  // 样式占位符
  stylePlaceHolder: '<!--STYLE_PLACEHOLDER-->',

  // 资源占位符
  resourcePlaceHolder: '<!--RESOURCEMAP_PLACEHOLDER-->',

  // 开发环境还是生产环境
  env: 'dev', // dev || dist

  ignore: [], // 不打包的模块

  lib: [], // 指定公共库

  // css 打包成一个文件，适合单页面应用
  cssAllInOne: false,
  // css 内嵌到html中
  cssInline: false,
  // 所有同步js打包成一个文件
  jsAllInOne: false

  // 手动干预
  // pkg: {
  //   '/pkg/common.js': 'mod.main**.js',
  //   '/pkg/common.css': ['**.css']
  // }
};

export default (ret, pack, settings) => {
  const files = ret.src;
  const conf = _.assign({}, CONFIG, settings);

  if (files) {
    new Project(ret, conf, pack); // eslint-disable-line
  }
};
