var baseModule1 = require('./base_module1');
var baseModule2 = require('./base_module2');
var page1Module1 = require('./page1_module1');
var page1Module2 = require('./page1_module2');

console.log(baseModule1, baseModule2);
console.log(page1Module1, page1Module2);


require(['./page1_module_async1']);
