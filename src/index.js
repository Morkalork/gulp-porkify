var through = require('through2');
var extend = require('extend');
var path = require('path');
var utils = require('gulp-util');
var PluginError = utils.PluginError;
var File = utils.File;
var random = require('random-js')();

const moduleName = 'gulp-porkify';

const porks = ['pork', 'bacon', 'ham', 'roast', 'piggy', 'pig', 'piglet', 'hog',
  'porcelain', 'chop', 'spam', 'spareribs', 'porker', 'oink', 'swine', 'piggy',
  'pürk', 'lunch'];

const defaultOptions = {};

function replaceVariables(text) {
  var regex = /(\bvar\b|\blet\b)\s([a-zA-Z_$][0-9a-zA-Z_$]*)[^\s|;]/gi;
  var matches = text.match(regex);

  if (!matches || matches.length === 0) {
    return text;
  }

  var porkIndex = originalPorkIndex = random.integer(0, porks.length - 1);

  for (var i = 0; i < matches.length; i++) {
    var match = matches[i].split(' ')[1]; // match is 'var someVar' and we don't need the first match :)
    var particularPork = porks[porkIndex];

    var replaceRegexp = new RegExp('[\\s|\\t]+?' + match + '\\s', 'gi');
    text = text.replace(replaceRegexp, ' ' + particularPork);

    porkIndex++;
    if (porkIndex >= porks.length) {
      porkIndex = 0;
    }

    if (porkIndex === originalPorkIndex) {
      // We're all out of pork
      break;
    }
  }

  return text;
}

module.exports = function (userOptions) {
  var options;
  extend(options, defaultOptions, userOptions);

  function porkify(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    var text = String(file.contents);

    if (!text) {
      return callback(null, file);
    }

    var newText = replaceVariables(text);
    file.contents = new Buffer(newText);

    callback(null, file);
  }

  return through.obj(porkify);
};