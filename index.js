/**
 * Takes a javascript object and performance variable substitutions.
 * This allows config values to reference other config values.
 *
 * @example
 * 
 * var confect = require('confect');
 * var config = {
 *   val1: 'hello',
 *   val2: '{{val1}} world!',
 *   val3: {
 *     val3a: '{{val2}}',
 *     '{{val1}}': 'works in keys too!'
 *   },
 *   val4: '{{val3}}',
 *   val5: '{{val4.val3a}}'
 * };
 * var resolved = {};
 *
 * // returns:
 * // {
 * //   val1: 'hello',
 * //   val2: 'hello world!',
 * //   val3: {
 * //     val3a: 'hello world!',
 * //     hello: 'works in keys too!'
 * //   },
 * //   val4: {
 * //     val3a: 'hello world!',
 * //     hello: 'works in keys too!'
 * //   },
 * //   val5: 'hello world!'
 * // }
 * resolved = confect.resolve(config);
 *
 *
 * @returns {object} returns a javascript object in which all referenced
 * config values have been resolved
 */
function resolve(config) {

  var resolved = configCopy(config);
  var done = false;
  while (!done) {
    var before = JSON.stringify(resolved);
    resolved = configResolve(resolved, resolved, []);
    var after = JSON.stringify(resolved);
    done = before == after;
  }

  return resolved;

  /**
   * Takes a hierachy of keys values and a config value and looks within
   * a config object for references to that config value and performns a
   * value replacement. Doesn't garantee that all recplements will be made.
   * If there are multiple levels of references (a references b references
   * c) this function will need to be run multiple times.
   *
   * @returns {object} returns a javascript object with references replaced.
   */
  function configResolve(config, value, keys) {
    var resolved = configCopy(config);
    var keyChain = '{{'+keys.join('.')+'}}';

    if (typeof value == 'object') {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          resolved = configResolve(resolved, value[key], keys.concat([key]));
        }
      }      
    }

    if (keyChain != '{{}}') {
      return configReplace(resolved, value, keyChain);
    }

    return resolved;
  }

  /**
   * Takes a string that could be used for config value reference 
   * (keyChain: "{{val1.val1b.etc}}") and the value it represents (value)
   * and looks in a config object for references to that keychain and 
   * performs replacements.
   *
   * @returns {object} returns a javascript object with references replaced.
   */
  function configReplace(config, value, keyChain) {
    if (typeof config != 'object') {
      return config;
    }

    var replaced = configCopy(config);
    for (var key in replaced) {
      if (replaced.hasOwnProperty(key)) {

        // if the value is an object, we go deeper
        if (typeof replaced[key] == 'object') {
          replaced[key] = configReplace(replaced[key], value, keyChain);
        }
        // the current value is a scalar (and hence supports replacements)
        else {
          var string = String(replaced[key])
          if (string == keyChain) {
            replaced[key] = value;
          }
          else if (string.indexOf(keyChain) != -1 && typeof value != "object") {
            replaced[key] = string.replace(keyChain, value);
          }
        }

        // if the new value is scalar (and hence can be a key)
        if (typeof value != 'object' && key.indexOf(keyChain) != -1) {
          replaced[key.replace(keyChain, value)] = replaced[key];
          delete(replaced[key]);
        }
      }
    }

    return replaced;
  }

  /**
   * Peforms a javascript object deep copy.
   * @returns {mixed} returns a deep clone of an object, array, or 
   * primitive value.
   */
  function configCopy(config) {
    if (Array.isArray(config)) {
      return config.slice();
    }
    if (typeof config == 'object') {
      var copy = {};
      for (var key in config) {
        if (config.hasOwnProperty(key)) {
          copy[key] = configCopy(config[key]);
        }
      }

      return copy;
    }

    return config;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { resolve: resolve };
}

