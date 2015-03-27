<<<<<<< HEAD
var path = require('path')
=======
var path = require('path');

>>>>>>> release-2
require('fs').readdirSync(__dirname)
  .filter(function(file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
  .forEach(function(file) {
<<<<<<< HEAD
    exports[file.substr(0,file.length - 3)] = require(path.join(__dirname, file));
=======
    module.exports[file.substr(0,file.length - 3)] = require(path.join(__dirname, file));
>>>>>>> release-2
});
