var test = require('tape');
var porkify = require('../src/index');
var utils = require('gulp-util');
var PluginError = utils.PluginError;
var fs = require('fs');
var Vinyl = require('vinyl');

function useMockFile(testFunc) {
  fs.readFile('tests/data/cow-file.js.moock', 'utf8', (err, cowFile) => {

    if (err) {
      console.log('ERROR: ', err);
    }

    var vinylFile = new Vinyl({
      cwd: '/',
      base: '/data',
      path: '/data/mockfile.js',
      contents: new Buffer(cowFile)
    });

    testFunc(vinylFile);
  });
};

useMockFile(vinylFile => {
  test('should ignore an empty file', t => {
    t.plan(1);
    var stream = porkify();

    stream.on('data', newFile => {
      t.ok(newFile.contents, 'Porkified file has content');
    });

    stream.write(vinylFile);
    stream.end();
  });
});


useMockFile(vinylFile => {
  test('replaces variables with pork related things', t => {
    t.plan(2);
    var existingVariableName = 'planetaryDanger';
    var js = String(vinylFile.contents);
    t.ok(js.includes(existingVariableName), 'Original variable exists');

    var stream = porkify();

    stream.on('data', newFile => {
      var newJs = String(newFile.contents);
      t.notOk(newJs.includes(existingVariableName), 'Original variable no longer exists');
    });

    stream.write(vinylFile);
    stream.end();
  });
});