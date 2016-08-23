/**
 * 管理页面的所有资源
 * @author jero
 * @date 2016-08-19
 */

/* global fis */

export default class Page {
  syncDeps = []; // 页面的同步依赖
  asyncDeps = []; // 页面的异步依赖

  /**
   * Page
   * @param file fis.file 对象
   * @param project project 实例
   */
  constructor(file, project) {
    this.file = file;
    this.fileId = file.id;
    this.retMap = project.retMap;
    this.config = project.config;
    this.project = project;

    this.checkCss();
    this.sourcePlaceholder();
    this.analyzePageDeps();
  }

  /**
   * 干掉 css 的外链，统一自动添加
   */
  checkCss() {
    const file = this.file;
    let content = file.getContent();

    content = content.replace(/<link.*\shref=("|').+\.(css|sass|less|scss)("|')\/?>/g, '');

    file.setContent(content);
  }

  /**
   * 检查页面是否有资源的 placeholder ，没有默认则插到各自底部
   * 保证 script 在 resource 之前，两者都在 loader 之后
   */
  sourcePlaceholder() {
    const { stylePlaceHolder, scriptPlaceHolder, resourcePlaceHolder } = this.config;
    const file = this.file;
    const loaderReg = /(<script.*\sdata-loader(?:>|\s.*>)[\s\S]*?<\/script>)/;
    let content = file.getContent();

    if (content.indexOf(stylePlaceHolder) === -1) {
      content = content.replace('</head>', `${stylePlaceHolder}\n</head>`);
    }

    if (content.indexOf(scriptPlaceHolder) === -1) {
      if (loaderReg.test(content)) {
        content = content.replace(loaderReg, `$1\n${scriptPlaceHolder}`);
      } else {
        fis.log.warn(`packager-elegant: data-loader script not font [${file.subpath}]`);
        content = content.replace('</body>', `${scriptPlaceHolder}\n</body>`); // 只能放 body 前面了
      }
    }

    // 保证在 scriptPlaceHolder 之前
    if (content.indexOf(resourcePlaceHolder) === -1) {
      content = content.replace(scriptPlaceHolder, `${resourcePlaceHolder}\n${scriptPlaceHolder}`);
    }

    file.setContent(content);
  }

  /**
   * 分析页面的同步和异步依赖
   *  每个依赖就是一个包
   *  allInOne 当然另说
   *
   *  @todo js 文件的异步依赖 ，智能计算包的依赖次数？
   */
  analyzePageDeps() {
    const project = this.project;
    const {
      requires, // 同步依赖
      asyncs // 异步依赖
    } = this.file;

    this.getDeps(requires.slice(0), 'sync');
    this.getDeps(asyncs.slice(0), 'async');

    const {
      syncDeps,
      asyncDeps
    } = this;

    requires.forEach((modId) => {
      syncDeps.push(modId);
      project.addJsModule(modId, 'sync');
    });

    asyncs.forEach((modId) => {
      asyncDeps.push(modId);
      project.addJsModule(modId, 'async');
    });
  }

  // 获取指定模块的所有依赖
  getDeps(deps, type) {
    const project = this.project;
    const { ids } = this.retMap;
    let pending = deps;
    const { syncDeps, asyncDeps } = this;

    while (pending.length) {
      const current = pending.shift();
      const { requires, asyncs } = ids[current];

      // 同步
      requires.forEach((modId) => {
        pending.push(modId);

        if (type === 'sync') {
          if (syncDeps.indexOf(modId) === -1) {
            syncDeps.push(modId);
          }
          project.addJsModule(modId, 'sync', ids[modId]);
        } else if (asyncDeps.indexOf(modId) === -1) {
          // 如果 type 就是 async ，那么不管是 requires 还是 asyncs ，都是异步的
          asyncDeps.push(modId);
          project.addJsModule(modId, 'async', ids[modId]);
        }
      });

      // 异步
      asyncs.forEach((modId) => {
        pending.push(modId);

        if (asyncDeps.indexOf(modId) === -1) {
          asyncDeps.push(modId);
        }

        project.addJsModule(modId, 'async', ids[modId]);
      });
    }
  }
}
