/**
 * 单测
 * @author jero
 * @date 2016-08-19
 */

import path from 'path';
// import fs from 'fs';
import fis, { util as _ } from 'fis3';
import { expect } from 'chai';

import self from '../src/index';

const release = fis.require('command-release/lib/release');
const deploy = fis.require('command-release/lib/deploy');


function toRelease(opts, cb) {
  opts = opts || {};

  release(opts, (error, info) => {
    deploy(info, cb);
  });
}

describe('primary', () => {
  before(() => {
    const root = path.join(__dirname, 'primary/src');
    const dev = path.join(__dirname, 'primary/dev');

    _.del(dev);
    fis.project.setProjectRoot(root);
    fis.hook('commonjs');
    fis
      .match('::package', {
        packager: self
      })
      .match('**.js', {
        isMod: true
      })
      .match('**nowrap**.js', {
        isMod: false
      })
      .match('*', {
        deploy: fis.plugin('local-deliver', {
          to: dev
        })
      });
  });


  it('test', (done) => {
    fis.on('release:end', () => {
      // console.log('2', ret);
      expect(2).to.eq(2);
    });

    toRelease({
      unique: true
    }, () => {
      done();
      fis.log.info('[primary] release complete');
    });
  });
});
