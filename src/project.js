/**
 * 管控整个项目的资源
 * @author jero
 * @date 2016-08-19
 */

/* global fis */

import Page from './page';


export default class Project {
  pages = {};
  pkg = {
    async: {},
    sync: {}
  }; // 整个项目将要打的包
  jsModule = {}; // 整个项目的 js 模块

  /**
   * @class Project
   * @param retMap  fis 中的 ret
   * @param config  插件配置
   */
  constructor(retMap, config) {
    this.files = retMap.src;
    this.retMap = retMap;
    this.config = config;

    this.filterFile();
    // this.setPkg();
    console.log(this.jsModule, this.pages, this);
  }

  /**
   * 过滤出 html 文件，以 html 文件的依赖做为分包根据
   */
  filterFile() {
    const { pages, files } = this;

    Object.keys(files).forEach((subpath) => {
      const file = files[subpath];

      if (file.isHtmlLike && !pages[file.id]) {
        pages[file.id] = file.elegantPage = new Page(file, this);
      }
    });
  }

  setPkg() {

  }

  addPkg(type, id, file) {
    const pkg = this.pkg[type] && this.pkg[type][id];

    if (id && file && !pkg) {
      this.pkg[type][id] = file;
    }
  }

  addJsModule(id, type, file) {
    const { ids } = this.retMap;
    const mod = this.jsModule[id];

    file = file || ids[id];
    // 如果一个模块即被异步依赖，又被同步依赖，算同步依赖
    if (id && file && (!mod || (mod && mod.type === 'async'))) {
      this.jsModule[id] = {
        type,
        file
      };
    }
  }
}
