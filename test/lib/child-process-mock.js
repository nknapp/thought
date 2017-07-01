const cp = require('child_process')
const _ = {
  isPlainObject: require('lodash.isplainobject')
}

/**
 * This module provides functions for mocks of the child_process package
 */
module.exports = {
  mockSpawn,
  mockExecFile,
  clearMocks
}

const originalSpawn = cp.spawn
const originalExecFile = cp.execFile

/**
 * Restore the original execFile function
 */
function clearMocks () {
  cp.spawn = originalSpawn
  cp.execFile = originalExecFile
}

/**
 * Create a mock for child_process.execFile
 *
 * @param {function(cmd, args, options)} predicate a function can return true,
 *   if the given command should be mocked
 * @param {function(cmd, args, options)} mockFn a function that simulates the child-process
 *   execution. The "this"-context for the function execution is the ChildProces-object
 *   that is returned by the mocked spawn function.
 */
function mockSpawn (predicate, mockFn) {
  cp.spawn = function (command, args, options) {
    if (options == null && _.isPlainObject(args)) {
      options = args
      args = null
    }
    if (predicate(command, args, options)) {
      const child = new cp.ChildProcess()
      mockFn.call(child, command, args, options)
      return child
    } else {
      return originalSpawn.apply(cp, Array.prototype.slice.call(arguments))
    }
  }
}

/**
 * Create a mock for child_process.execFile
 *
 * @param {function(cmd, args, options)} predicate a function can return true,
 *   if the given command should be mocked
 * @param {function(cmd, args, options, callback)} mockFn a function that simulates the child-process
 *   execution. The "this"-context for the function execution is the ChildProcess-object
 *   that is returned by the mocked execFile function.
 */
function mockExecFile (predicate, mockFn) {
  cp.execFile = function (command, args, options, callback) {
    if (callback == null && typeof options === 'function') {
      callback = options
      options = null
    }
    if (options == null && _.isPlainObject(args)) {
      options = args
      args = null
    }
    if (predicate(command, args, options)) {
      const child = new cp.ChildProcess()
      mockFn.call(child, command, args, options, callback)
      return child
    } else {
      return originalExecFile.apply(cp, Array.prototype.slice.call(arguments))
    }
  }
}
