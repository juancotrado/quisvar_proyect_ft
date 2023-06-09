/** @license React v16.1.0
 * react-art.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory(require('react')))
    : typeof define === 'function' && define.amd
    ? define(['react'], factory)
    : (global.ReactART = factory(global.React));
})(this, function (React) {
  'use strict';

  var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

  var _assign = ReactInternals.assign;

  /**
   * WARNING: DO NOT manually require this module.
   * This is a replacement for `invariant(...)` used by the error code system
   * and will _only_ be required by the corresponding babel pass.
   * It always throws.
   */

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var validateFormat = function validateFormat(format) {};

  {
    validateFormat = function validateFormat(format) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    };
  }

  function invariant(condition, format, a, b, c, d, e, f) {
    validateFormat(format);

    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          'Minified exception occurred; use the non-minified dev environment ' +
            'for the full error message and additional helpful warnings.'
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function () {
            return args[argIndex++];
          })
        );
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }

  var invariant_1$1 = invariant;

  var enableAsyncSubtreeAPI = true;

  // Exports React.Fragment
  var enableReactFragment = false;
  // Exports ReactDOM.createRoot

  var enableUserTimingAPI = true;

  // Mutating mode (React DOM, React ART, React Native):
  var enableMutatingReconciler = true;
  // Experimental noop mode (currently unused):
  var enableNoopReconciler = false;
  // Experimental persistent mode (CS):
  var enablePersistentReconciler = false;

  // Only used in www builds.

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   *
   */

  function makeEmptyFunction(arg) {
    return function () {
      return arg;
    };
  }

  /**
   * This function accepts and discards inputs; it has no side effects. This is
   * primarily useful idiomatically for overridable function endpoints which
   * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
   */
  var emptyFunction = function emptyFunction() {};

  emptyFunction.thatReturns = makeEmptyFunction;
  emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
  emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
  emptyFunction.thatReturnsNull = makeEmptyFunction(null);
  emptyFunction.thatReturnsThis = function () {
    return this;
  };
  emptyFunction.thatReturnsArgument = function (arg) {
    return arg;
  };

  var emptyFunction_1 = emptyFunction;

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = emptyFunction_1;

  {
    var printWarning = function printWarning(format) {
      for (
        var _len = arguments.length,
          args = Array(_len > 1 ? _len - 1 : 0),
          _key = 1;
        _key < _len;
        _key++
      ) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message =
        'Warning: ' +
        format.replace(/%s/g, function () {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error(
          '`warning(condition, format, ...args)` requires a warning ' +
            'message argument'
        );
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (
          var _len2 = arguments.length,
            args = Array(_len2 > 2 ? _len2 - 2 : 0),
            _key2 = 2;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  }

  var warning_1$1 = warning;

  /**
   * `ReactInstanceMap` maintains a mapping from a public facing stateful
   * instance (key) and the internal representation (value). This allows public
   * methods to accept the user facing instance as an argument and map them back
   * to internal methods.
   *
   * Note that this module is currently shared and assumed to be stateless.
   * If this becomes an actual Map, that will break.
   */

  /**
   * This API should be called `delete` but we'd have to make sure to always
   * transform these to strings for IE support. When this transform is fully
   * supported we can rename it.
   */

  function get(key) {
    return key._reactInternalFiber;
  }

  function set(key, value) {
    key._reactInternalFiber = value;
  }

  var ReactInternals$1 =
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

  var ReactCurrentOwner = ReactInternals$1.ReactCurrentOwner;
  var ReactDebugCurrentFrame = ReactInternals$1.ReactDebugCurrentFrame;

  function getComponentName(fiber) {
    var type = fiber.type;

    if (typeof type === 'string') {
      return type;
    }
    if (typeof type === 'function') {
      return type.displayName || type.name;
    }
    return null;
  }

  var IndeterminateComponent = 0; // Before we know whether it is functional or class
  var FunctionalComponent = 1;
  var ClassComponent = 2;
  var HostRoot = 3; // Root of a host tree. Could be nested inside another node.
  var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
  var HostComponent = 5;
  var HostText = 6;
  var CallComponent = 7;
  var CallHandlerPhase = 8;
  var ReturnComponent = 9;
  var Fragment = 10;

  // Don't change these two values:
  var NoEffect = 0; //           0b00000000
  var PerformedWork = 1; //      0b00000001

  // You can change the rest (and add more).
  var Placement = 2; //          0b00000010
  var Update = 4; //             0b00000100
  var PlacementAndUpdate = 6; // 0b00000110
  var Deletion = 8; //           0b00001000
  var ContentReset = 16; //      0b00010000
  var Callback = 32; //          0b00100000
  var Err = 64; //               0b01000000
  var Ref = 128; //              0b10000000

  var MOUNTING = 1;
  var MOUNTED = 2;
  var UNMOUNTED = 3;

  function isFiberMountedImpl(fiber) {
    var node = fiber;
    if (!fiber.alternate) {
      // If there is no alternate, this might be a new tree that isn't inserted
      // yet. If it is, then it will have a pending insertion effect on it.
      if ((node.effectTag & Placement) !== NoEffect) {
        return MOUNTING;
      }
      while (node['return']) {
        node = node['return'];
        if ((node.effectTag & Placement) !== NoEffect) {
          return MOUNTING;
        }
      }
    } else {
      while (node['return']) {
        node = node['return'];
      }
    }
    if (node.tag === HostRoot) {
      // TODO: Check if this was a nested HostRoot when used with
      // renderContainerIntoSubtree.
      return MOUNTED;
    }
    // If we didn't hit the root, that means that we're in an disconnected tree
    // that has been unmounted.
    return UNMOUNTED;
  }

  function isFiberMounted(fiber) {
    return isFiberMountedImpl(fiber) === MOUNTED;
  }

  function isMounted(component) {
    {
      var owner = ReactCurrentOwner.current;
      if (owner !== null && owner.tag === ClassComponent) {
        var ownerFiber = owner;
        var instance = ownerFiber.stateNode;
        warning_1$1(
          instance._warnedAboutRefsInRender,
          '%s is accessing isMounted inside its render() function. ' +
            'render() should be a pure function of props and state. It should ' +
            'never access something that requires stale data from the previous ' +
            'render, such as refs. Move this logic to componentDidMount and ' +
            'componentDidUpdate instead.',
          getComponentName(ownerFiber) || 'A component'
        );
        instance._warnedAboutRefsInRender = true;
      }
    }

    var fiber = get(component);
    if (!fiber) {
      return false;
    }
    return isFiberMountedImpl(fiber) === MOUNTED;
  }

  function assertIsMounted(fiber) {
    !(isFiberMountedImpl(fiber) === MOUNTED)
      ? invariant_1$1(false, 'Unable to find node on an unmounted component.')
      : void 0;
  }

  function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
    if (!alternate) {
      // If there is no alternate, then we only need to check if it is mounted.
      var state = isFiberMountedImpl(fiber);
      !(state !== UNMOUNTED)
        ? invariant_1$1(false, 'Unable to find node on an unmounted component.')
        : void 0;
      if (state === MOUNTING) {
        return null;
      }
      return fiber;
    }
    // If we have two possible branches, we'll walk backwards up to the root
    // to see what path the root points to. On the way we may hit one of the
    // special cases and we'll deal with them.
    var a = fiber;
    var b = alternate;
    while (true) {
      var parentA = a['return'];
      var parentB = parentA ? parentA.alternate : null;
      if (!parentA || !parentB) {
        // We're at the root.
        break;
      }

      // If both copies of the parent fiber point to the same child, we can
      // assume that the child is current. This happens when we bailout on low
      // priority: the bailed out fiber's child reuses the current child.
      if (parentA.child === parentB.child) {
        var child = parentA.child;
        while (child) {
          if (child === a) {
            // We've determined that A is the current branch.
            assertIsMounted(parentA);
            return fiber;
          }
          if (child === b) {
            // We've determined that B is the current branch.
            assertIsMounted(parentA);
            return alternate;
          }
          child = child.sibling;
        }
        // We should never have an alternate for any mounting node. So the only
        // way this could possibly happen is if this was unmounted, if at all.
        invariant_1$1(false, 'Unable to find node on an unmounted component.');
      }

      if (a['return'] !== b['return']) {
        // The return pointer of A and the return pointer of B point to different
        // fibers. We assume that return pointers never criss-cross, so A must
        // belong to the child set of A.return, and B must belong to the child
        // set of B.return.
        a = parentA;
        b = parentB;
      } else {
        // The return pointers point to the same fiber. We'll have to use the
        // default, slow path: scan the child sets of each parent alternate to see
        // which child belongs to which set.
        //
        // Search parent A's child set
        var didFindChild = false;
        var _child = parentA.child;
        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentA;
            b = parentB;
            break;
          }
          if (_child === b) {
            didFindChild = true;
            b = parentA;
            a = parentB;
            break;
          }
          _child = _child.sibling;
        }
        if (!didFindChild) {
          // Search parent B's child set
          _child = parentB.child;
          while (_child) {
            if (_child === a) {
              didFindChild = true;
              a = parentB;
              b = parentA;
              break;
            }
            if (_child === b) {
              didFindChild = true;
              b = parentB;
              a = parentA;
              break;
            }
            _child = _child.sibling;
          }
          !didFindChild
            ? invariant_1$1(
                false,
                'Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.'
              )
            : void 0;
        }
      }

      !(a.alternate === b)
        ? invariant_1$1(
            false,
            "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue."
          )
        : void 0;
    }
    // If the root is not a host container, we're in a disconnected tree. I.e.
    // unmounted.
    !(a.tag === HostRoot)
      ? invariant_1$1(false, 'Unable to find node on an unmounted component.')
      : void 0;
    if (a.stateNode.current === a) {
      // We've determined that A is the current branch.
      return fiber;
    }
    // Otherwise B has to be current branch.
    return alternate;
  }

  function findCurrentHostFiber(parent) {
    var currentParent = findCurrentFiberUsingSlowPath(parent);
    if (!currentParent) {
      return null;
    }

    // Next we'll drill down this component to find the first HostComponent/Text.
    var node = currentParent;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText) {
        return node;
      } else if (node.child) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      if (node === currentParent) {
        return null;
      }
      while (!node.sibling) {
        if (!node['return'] || node['return'] === currentParent) {
          return null;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
    // Flow needs the return null here, but ESLint complains about it.
    // eslint-disable-next-line no-unreachable
    return null;
  }

  function findCurrentHostFiberWithNoPortals(parent) {
    var currentParent = findCurrentFiberUsingSlowPath(parent);
    if (!currentParent) {
      return null;
    }

    // Next we'll drill down this component to find the first HostComponent/Text.
    var node = currentParent;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText) {
        return node;
      } else if (node.child && node.tag !== HostPortal) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      if (node === currentParent) {
        return null;
      }
      while (!node.sibling) {
        if (!node['return'] || node['return'] === currentParent) {
          return null;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
    // Flow needs the return null here, but ESLint complains about it.
    // eslint-disable-next-line no-unreachable
    return null;
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  var emptyObject = {};

  {
    Object.freeze(emptyObject);
  }

  var emptyObject_1 = emptyObject;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    var invariant$2 = invariant_1$1;
    var warning$2 = warning_1$1;
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(
    typeSpecs,
    values,
    location,
    componentName,
    getStack
  ) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            invariant$2(
              typeof typeSpecs[typeSpecName] === 'function',
              '%s: %s type `%s` is invalid; it must be a function, usually from ' +
                'the `prop-types` package, but received `%s`.',
              componentName || 'React class',
              location,
              typeSpecName,
              typeof typeSpecs[typeSpecName]
            );
            error = typeSpecs[typeSpecName](
              values,
              typeSpecName,
              componentName,
              location,
              null,
              ReactPropTypesSecret
            );
          } catch (ex) {
            error = ex;
          }
          warning$2(
            !error || error instanceof Error,
            '%s: type specification of %s `%s` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a %s. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).',
            componentName || 'React class',
            location,
            typeSpecName,
            typeof error
          );
          if (
            error instanceof Error &&
            !(error.message in loggedTypeFailures)
          ) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            warning$2(
              false,
              'Failed %s type: %s%s',
              location,
              error.message,
              stack != null ? stack : ''
            );
          }
        }
      }
    }
  }

  var checkPropTypes_1$1 = checkPropTypes;

  var valueStack = [];

  {
    var fiberStack = [];
  }

  var index = -1;

  function createCursor(defaultValue) {
    return {
      current: defaultValue,
    };
  }

  function pop(cursor, fiber) {
    if (index < 0) {
      {
        warning_1$1(false, 'Unexpected pop.');
      }
      return;
    }

    {
      if (fiber !== fiberStack[index]) {
        warning_1$1(false, 'Unexpected Fiber popped.');
      }
    }

    cursor.current = valueStack[index];

    valueStack[index] = null;

    {
      fiberStack[index] = null;
    }

    index--;
  }

  function push(cursor, value, fiber) {
    index++;

    valueStack[index] = cursor.current;

    {
      fiberStack[index] = fiber;
    }

    cursor.current = value;
  }

  function reset() {
    while (index > -1) {
      valueStack[index] = null;

      {
        fiberStack[index] = null;
      }

      index--;
    }
  }

  var describeComponentFrame = function (name, source, ownerName) {
    return (
      '\n    in ' +
      (name || 'Unknown') +
      (source
        ? ' (at ' +
          source.fileName.replace(/^.*[\\\/]/, '') +
          ':' +
          source.lineNumber +
          ')'
        : ownerName
        ? ' (created by ' + ownerName + ')'
        : '')
    );
  };

  function describeFiber(fiber) {
    switch (fiber.tag) {
      case IndeterminateComponent:
      case FunctionalComponent:
      case ClassComponent:
      case HostComponent:
        var owner = fiber._debugOwner;
        var source = fiber._debugSource;
        var name = getComponentName(fiber);
        var ownerName = null;
        if (owner) {
          ownerName = getComponentName(owner);
        }
        return describeComponentFrame(name, source, ownerName);
      default:
        return '';
    }
  }

  // This function can only be called with a work-in-progress fiber and
  // only during begin or complete phase. Do not call it under any other
  // circumstances.
  function getStackAddendumByWorkInProgressFiber(workInProgress) {
    var info = '';
    var node = workInProgress;
    do {
      info += describeFiber(node);
      // Otherwise this return pointer might point to the wrong tree:
      node = node['return'];
    } while (node);
    return info;
  }

  function getCurrentFiberOwnerName() {
    {
      var fiber = ReactDebugCurrentFiber.current;
      if (fiber === null) {
        return null;
      }
      var owner = fiber._debugOwner;
      if (owner !== null && typeof owner !== 'undefined') {
        return getComponentName(owner);
      }
    }
    return null;
  }

  function getCurrentFiberStackAddendum() {
    {
      var fiber = ReactDebugCurrentFiber.current;
      if (fiber === null) {
        return null;
      }
      // Safe because if current fiber exists, we are reconciling,
      // and it is guaranteed to be the work-in-progress version.
      return getStackAddendumByWorkInProgressFiber(fiber);
    }
    return null;
  }

  function resetCurrentFiber() {
    ReactDebugCurrentFrame.getCurrentStack = null;
    ReactDebugCurrentFiber.current = null;
    ReactDebugCurrentFiber.phase = null;
  }

  function setCurrentFiber(fiber) {
    ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackAddendum;
    ReactDebugCurrentFiber.current = fiber;
    ReactDebugCurrentFiber.phase = null;
  }

  function setCurrentPhase(phase) {
    ReactDebugCurrentFiber.phase = phase;
  }

  var ReactDebugCurrentFiber = {
    current: null,
    phase: null,
    resetCurrentFiber: resetCurrentFiber,
    setCurrentFiber: setCurrentFiber,
    setCurrentPhase: setCurrentPhase,
    getCurrentFiberOwnerName: getCurrentFiberOwnerName,
    getCurrentFiberStackAddendum: getCurrentFiberStackAddendum,
  };

  // Prefix measurements so that it's possible to filter them.
  // Longer prefixes are hard to read in DevTools.
  var reactEmoji = '\u269B';
  var warningEmoji = '\u26D4';
  var supportsUserTiming =
    typeof performance !== 'undefined' &&
    typeof performance.mark === 'function' &&
    typeof performance.clearMarks === 'function' &&
    typeof performance.measure === 'function' &&
    typeof performance.clearMeasures === 'function';

  // Keep track of current fiber so that we know the path to unwind on pause.
  // TODO: this looks the same as nextUnitOfWork in scheduler. Can we unify them?
  var currentFiber = null;
  // If we're in the middle of user code, which fiber and method is it?
  // Reusing `currentFiber` would be confusing for this because user code fiber
  // can change during commit phase too, but we don't need to unwind it (since
  // lifecycles in the commit phase don't resemble a tree).
  var currentPhase = null;
  var currentPhaseFiber = null;
  // Did lifecycle hook schedule an update? This is often a performance problem,
  // so we will keep track of it, and include it in the report.
  // Track commits caused by cascading updates.
  var isCommitting = false;
  var hasScheduledUpdateInCurrentCommit = false;
  var hasScheduledUpdateInCurrentPhase = false;
  var commitCountInCurrentWorkLoop = 0;
  var effectCountInCurrentCommit = 0;
  // During commits, we only show a measurement once per method name
  // to avoid stretch the commit phase with measurement overhead.
  var labelsInCurrentCommit = new Set();

  var formatMarkName = function (markName) {
    return reactEmoji + ' ' + markName;
  };

  var formatLabel = function (label, warning) {
    var prefix = warning ? warningEmoji + ' ' : reactEmoji + ' ';
    var suffix = warning ? ' Warning: ' + warning : '';
    return '' + prefix + label + suffix;
  };

  var beginMark = function (markName) {
    performance.mark(formatMarkName(markName));
  };

  var clearMark = function (markName) {
    performance.clearMarks(formatMarkName(markName));
  };

  var endMark = function (label, markName, warning) {
    var formattedMarkName = formatMarkName(markName);
    var formattedLabel = formatLabel(label, warning);
    try {
      performance.measure(formattedLabel, formattedMarkName);
    } catch (err) {}
    // If previous mark was missing for some reason, this will throw.
    // This could only happen if React crashed in an unexpected place earlier.
    // Don't pile on with more errors.

    // Clear marks immediately to avoid growing buffer.
    performance.clearMarks(formattedMarkName);
    performance.clearMeasures(formattedLabel);
  };

  var getFiberMarkName = function (label, debugID) {
    return label + ' (#' + debugID + ')';
  };

  var getFiberLabel = function (componentName, isMounted, phase) {
    if (phase === null) {
      // These are composite component total time measurements.
      return componentName + ' [' + (isMounted ? 'update' : 'mount') + ']';
    } else {
      // Composite component methods.
      return componentName + '.' + phase;
    }
  };

  var beginFiberMark = function (fiber, phase) {
    var componentName = getComponentName(fiber) || 'Unknown';
    var debugID = fiber._debugID;
    var isMounted = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted, phase);

    if (isCommitting && labelsInCurrentCommit.has(label)) {
      // During the commit phase, we don't show duplicate labels because
      // there is a fixed overhead for every measurement, and we don't
      // want to stretch the commit phase beyond necessary.
      return false;
    }
    labelsInCurrentCommit.add(label);

    var markName = getFiberMarkName(label, debugID);
    beginMark(markName);
    return true;
  };

  var clearFiberMark = function (fiber, phase) {
    var componentName = getComponentName(fiber) || 'Unknown';
    var debugID = fiber._debugID;
    var isMounted = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted, phase);
    var markName = getFiberMarkName(label, debugID);
    clearMark(markName);
  };

  var endFiberMark = function (fiber, phase, warning) {
    var componentName = getComponentName(fiber) || 'Unknown';
    var debugID = fiber._debugID;
    var isMounted = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted, phase);
    var markName = getFiberMarkName(label, debugID);
    endMark(label, markName, warning);
  };

  var shouldIgnoreFiber = function (fiber) {
    // Host components should be skipped in the timeline.
    // We could check typeof fiber.type, but does this work with RN?
    switch (fiber.tag) {
      case HostRoot:
      case HostComponent:
      case HostText:
      case HostPortal:
      case ReturnComponent:
      case Fragment:
        return true;
      default:
        return false;
    }
  };

  var clearPendingPhaseMeasurement = function () {
    if (currentPhase !== null && currentPhaseFiber !== null) {
      clearFiberMark(currentPhaseFiber, currentPhase);
    }
    currentPhaseFiber = null;
    currentPhase = null;
    hasScheduledUpdateInCurrentPhase = false;
  };

  var pauseTimers = function () {
    // Stops all currently active measurements so that they can be resumed
    // if we continue in a later deferred loop from the same unit of work.
    var fiber = currentFiber;
    while (fiber) {
      if (fiber._debugIsCurrentlyTiming) {
        endFiberMark(fiber, null, null);
      }
      fiber = fiber['return'];
    }
  };

  var resumeTimersRecursively = function (fiber) {
    if (fiber['return'] !== null) {
      resumeTimersRecursively(fiber['return']);
    }
    if (fiber._debugIsCurrentlyTiming) {
      beginFiberMark(fiber, null);
    }
  };

  var resumeTimers = function () {
    // Resumes all measurements that were active during the last deferred loop.
    if (currentFiber !== null) {
      resumeTimersRecursively(currentFiber);
    }
  };

  function recordEffect() {
    if (enableUserTimingAPI) {
      effectCountInCurrentCommit++;
    }
  }

  function recordScheduleUpdate() {
    if (enableUserTimingAPI) {
      if (isCommitting) {
        hasScheduledUpdateInCurrentCommit = true;
      }
      if (
        currentPhase !== null &&
        currentPhase !== 'componentWillMount' &&
        currentPhase !== 'componentWillReceiveProps'
      ) {
        hasScheduledUpdateInCurrentPhase = true;
      }
    }
  }

  function startWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      // If we pause, this is the fiber to unwind from.
      currentFiber = fiber;
      if (!beginFiberMark(fiber, null)) {
        return;
      }
      fiber._debugIsCurrentlyTiming = true;
    }
  }

  function cancelWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      // Remember we shouldn't complete measurement for this fiber.
      // Otherwise flamechart will be deep even for small updates.
      fiber._debugIsCurrentlyTiming = false;
      clearFiberMark(fiber, null);
    }
  }

  function stopWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      // If we pause, its parent is the fiber to unwind from.
      currentFiber = fiber['return'];
      if (!fiber._debugIsCurrentlyTiming) {
        return;
      }
      fiber._debugIsCurrentlyTiming = false;
      endFiberMark(fiber, null, null);
    }
  }

  function stopFailedWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      // If we pause, its parent is the fiber to unwind from.
      currentFiber = fiber['return'];
      if (!fiber._debugIsCurrentlyTiming) {
        return;
      }
      fiber._debugIsCurrentlyTiming = false;
      var warning = 'An error was thrown inside this error boundary';
      endFiberMark(fiber, null, warning);
    }
  }

  function startPhaseTimer(fiber, phase) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      clearPendingPhaseMeasurement();
      if (!beginFiberMark(fiber, phase)) {
        return;
      }
      currentPhaseFiber = fiber;
      currentPhase = phase;
    }
  }

  function stopPhaseTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      if (currentPhase !== null && currentPhaseFiber !== null) {
        var warning = hasScheduledUpdateInCurrentPhase
          ? 'Scheduled a cascading update'
          : null;
        endFiberMark(currentPhaseFiber, currentPhase, warning);
      }
      currentPhase = null;
      currentPhaseFiber = null;
    }
  }

  function startWorkLoopTimer(nextUnitOfWork) {
    if (enableUserTimingAPI) {
      currentFiber = nextUnitOfWork;
      if (!supportsUserTiming) {
        return;
      }
      commitCountInCurrentWorkLoop = 0;
      // This is top level call.
      // Any other measurements are performed within.
      beginMark('(React Tree Reconciliation)');
      // Resume any measurements that were in progress during the last loop.
      resumeTimers();
    }
  }

  function stopWorkLoopTimer(interruptedBy) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var warning = null;
      if (interruptedBy !== null) {
        if (interruptedBy.tag === HostRoot) {
          warning = 'A top-level update interrupted the previous render';
        } else {
          var componentName = getComponentName(interruptedBy) || 'Unknown';
          warning =
            'An update to ' +
            componentName +
            ' interrupted the previous render';
        }
      } else if (commitCountInCurrentWorkLoop > 1) {
        warning = 'There were cascading updates';
      }
      commitCountInCurrentWorkLoop = 0;
      // Pause any measurements until the next loop.
      pauseTimers();
      endMark(
        '(React Tree Reconciliation)',
        '(React Tree Reconciliation)',
        warning
      );
    }
  }

  function startCommitTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      isCommitting = true;
      hasScheduledUpdateInCurrentCommit = false;
      labelsInCurrentCommit.clear();
      beginMark('(Committing Changes)');
    }
  }

  function stopCommitTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }

      var warning = null;
      if (hasScheduledUpdateInCurrentCommit) {
        warning = 'Lifecycle hook scheduled a cascading update';
      } else if (commitCountInCurrentWorkLoop > 0) {
        warning = 'Caused by a cascading update in earlier commit';
      }
      hasScheduledUpdateInCurrentCommit = false;
      commitCountInCurrentWorkLoop++;
      isCommitting = false;
      labelsInCurrentCommit.clear();

      endMark('(Committing Changes)', '(Committing Changes)', warning);
    }
  }

  function startCommitHostEffectsTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      effectCountInCurrentCommit = 0;
      beginMark('(Committing Host Effects)');
    }
  }

  function stopCommitHostEffectsTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var count = effectCountInCurrentCommit;
      effectCountInCurrentCommit = 0;
      endMark(
        '(Committing Host Effects: ' + count + ' Total)',
        '(Committing Host Effects)',
        null
      );
    }
  }

  function startCommitLifeCyclesTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      effectCountInCurrentCommit = 0;
      beginMark('(Calling Lifecycle Methods)');
    }
  }

  function stopCommitLifeCyclesTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var count = effectCountInCurrentCommit;
      effectCountInCurrentCommit = 0;
      endMark(
        '(Calling Lifecycle Methods: ' + count + ' Total)',
        '(Calling Lifecycle Methods)',
        null
      );
    }
  }

  {
    var warnedAboutMissingGetChildContext = {};
  }

  // A cursor to the current merged context object on the stack.
  var contextStackCursor = createCursor(emptyObject_1);
  // A cursor to a boolean indicating whether the context has changed.
  var didPerformWorkStackCursor = createCursor(false);
  // Keep track of the previous context object that was on the stack.
  // We use this to get access to the parent context after we have already
  // pushed the next context provider, and now need to merge their contexts.
  var previousContext = emptyObject_1;

  function getUnmaskedContext(workInProgress) {
    var hasOwnContext = isContextProvider(workInProgress);
    if (hasOwnContext) {
      // If the fiber is a context provider itself, when we read its context
      // we have already pushed its own child context on the stack. A context
      // provider should not "see" its own child context. Therefore we read the
      // previous (parent) context instead for a context provider.
      return previousContext;
    }
    return contextStackCursor.current;
  }

  function cacheContext(workInProgress, unmaskedContext, maskedContext) {
    var instance = workInProgress.stateNode;
    instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
    instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
  }

  function getMaskedContext(workInProgress, unmaskedContext) {
    var type = workInProgress.type;
    var contextTypes = type.contextTypes;
    if (!contextTypes) {
      return emptyObject_1;
    }

    // Avoid recreating masked context unless unmasked context has changed.
    // Failing to do this will result in unnecessary calls to componentWillReceiveProps.
    // This may trigger infinite loops if componentWillReceiveProps calls setState.
    var instance = workInProgress.stateNode;
    if (
      instance &&
      instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext
    ) {
      return instance.__reactInternalMemoizedMaskedChildContext;
    }

    var context = {};
    for (var key in contextTypes) {
      context[key] = unmaskedContext[key];
    }

    {
      var name = getComponentName(workInProgress) || 'Unknown';
      checkPropTypes_1$1(
        contextTypes,
        context,
        'context',
        name,
        ReactDebugCurrentFiber.getCurrentFiberStackAddendum
      );
    }

    // Cache unmasked context so we can avoid recreating masked context unless necessary.
    // Context is created before the class component is instantiated so check for instance.
    if (instance) {
      cacheContext(workInProgress, unmaskedContext, context);
    }

    return context;
  }

  function hasContextChanged() {
    return didPerformWorkStackCursor.current;
  }

  function isContextConsumer(fiber) {
    return fiber.tag === ClassComponent && fiber.type.contextTypes != null;
  }

  function isContextProvider(fiber) {
    return fiber.tag === ClassComponent && fiber.type.childContextTypes != null;
  }

  function popContextProvider(fiber) {
    if (!isContextProvider(fiber)) {
      return;
    }

    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }

  function popTopLevelContextObject(fiber) {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }

  function pushTopLevelContextObject(fiber, context, didChange) {
    !(contextStackCursor.cursor == null)
      ? invariant_1$1(
          false,
          'Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.'
        )
      : void 0;

    push(contextStackCursor, context, fiber);
    push(didPerformWorkStackCursor, didChange, fiber);
  }

  function processChildContext(fiber, parentContext) {
    var instance = fiber.stateNode;
    var childContextTypes = fiber.type.childContextTypes;

    // TODO (bvaughn) Replace this behavior with an invariant() in the future.
    // It has only been added in Fiber to match the (unintentional) behavior in Stack.
    if (typeof instance.getChildContext !== 'function') {
      {
        var componentName = getComponentName(fiber) || 'Unknown';

        if (!warnedAboutMissingGetChildContext[componentName]) {
          warnedAboutMissingGetChildContext[componentName] = true;
          warning_1$1(
            false,
            '%s.childContextTypes is specified but there is no getChildContext() method ' +
              'on the instance. You can either define getChildContext() on %s or remove ' +
              'childContextTypes from it.',
            componentName,
            componentName
          );
        }
      }
      return parentContext;
    }

    var childContext = void 0;
    {
      ReactDebugCurrentFiber.setCurrentPhase('getChildContext');
    }
    startPhaseTimer(fiber, 'getChildContext');
    childContext = instance.getChildContext();
    stopPhaseTimer();
    {
      ReactDebugCurrentFiber.setCurrentPhase(null);
    }
    for (var contextKey in childContext) {
      !(contextKey in childContextTypes)
        ? invariant_1$1(
            false,
            '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
            getComponentName(fiber) || 'Unknown',
            contextKey
          )
        : void 0;
    }
    {
      var name = getComponentName(fiber) || 'Unknown';
      checkPropTypes_1$1(
        childContextTypes,
        childContext,
        'child context',
        name,
        // In practice, there is one case in which we won't get a stack. It's when
        // somebody calls unstable_renderSubtreeIntoContainer() and we process
        // context from the parent component instance. The stack will be missing
        // because it's outside of the reconciliation, and so the pointer has not
        // been set. This is rare and doesn't matter. We'll also remove that API.
        ReactDebugCurrentFiber.getCurrentFiberStackAddendum
      );
    }

    return _assign({}, parentContext, childContext);
  }

  function pushContextProvider(workInProgress) {
    if (!isContextProvider(workInProgress)) {
      return false;
    }

    var instance = workInProgress.stateNode;
    // We push the context as early as possible to ensure stack integrity.
    // If the instance does not exist yet, we will push null at first,
    // and replace it on the stack later when invalidating the context.
    var memoizedMergedChildContext =
      (instance && instance.__reactInternalMemoizedMergedChildContext) ||
      emptyObject_1;

    // Remember the parent context so we can merge with it later.
    // Inherit the parent's did-perform-work value to avoid inadvertently blocking updates.
    previousContext = contextStackCursor.current;
    push(contextStackCursor, memoizedMergedChildContext, workInProgress);
    push(
      didPerformWorkStackCursor,
      didPerformWorkStackCursor.current,
      workInProgress
    );

    return true;
  }

  function invalidateContextProvider(workInProgress, didChange) {
    var instance = workInProgress.stateNode;
    !instance
      ? invariant_1$1(
          false,
          'Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.'
        )
      : void 0;

    if (didChange) {
      // Merge parent and own context.
      // Skip this if we're not updating due to sCU.
      // This avoids unnecessarily recomputing memoized values.
      var mergedContext = processChildContext(workInProgress, previousContext);
      instance.__reactInternalMemoizedMergedChildContext = mergedContext;

      // Replace the old (or empty) context with the new one.
      // It is important to unwind the context in the reverse order.
      pop(didPerformWorkStackCursor, workInProgress);
      pop(contextStackCursor, workInProgress);
      // Now push the new context and mark that it has changed.
      push(contextStackCursor, mergedContext, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    } else {
      pop(didPerformWorkStackCursor, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    }
  }

  function resetContext() {
    previousContext = emptyObject_1;
    contextStackCursor.current = emptyObject_1;
    didPerformWorkStackCursor.current = false;
  }

  function findCurrentUnmaskedContext(fiber) {
    // Currently this is only used with renderSubtreeIntoContainer; not sure if it
    // makes sense elsewhere
    !(isFiberMounted(fiber) && fiber.tag === ClassComponent)
      ? invariant_1$1(
          false,
          'Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.'
        )
      : void 0;

    var node = fiber;
    while (node.tag !== HostRoot) {
      if (isContextProvider(node)) {
        return node.stateNode.__reactInternalMemoizedMergedChildContext;
      }
      var parent = node['return'];
      !parent
        ? invariant_1$1(
            false,
            'Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      node = parent;
    }
    return node.stateNode.context;
  }

  var NoWork = 0; // TODO: Use an opaque type once ESLint et al support the syntax

  var Sync = 1;
  var Never = 2147483647; // Max int32: Math.pow(2, 31) - 1

  var UNIT_SIZE = 10;
  var MAGIC_NUMBER_OFFSET = 2;

  // 1 unit of expiration time represents 10ms.
  function msToExpirationTime(ms) {
    // Always add an offset so that we don't clash with the magic number for NoWork.
    return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
  }

  function ceiling(num, precision) {
    return (((num / precision) | 0) + 1) * precision;
  }

  function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
    return ceiling(
      currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE
    );
  }

  var NoContext = 0;
  var AsyncUpdates = 1;

  {
    var hasBadMapPolyfill = false;
    try {
      var nonExtensibleObject = Object.preventExtensions({});
      /* eslint-disable no-new */
      new Map([[nonExtensibleObject, null]]);
      new Set([nonExtensibleObject]);
      /* eslint-enable no-new */
    } catch (e) {
      // TODO: Consider warning about bad polyfills
      hasBadMapPolyfill = true;
    }
  }

  // A Fiber is work on a Component that needs to be done or was done. There can
  // be more than one per component.

  {
    var debugCounter = 1;
  }

  function FiberNode(tag, key, internalContextTag) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.type = null;
    this.stateNode = null;

    // Fiber
    this['return'] = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    this.pendingProps = null;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;

    this.internalContextTag = internalContextTag;

    // Effects
    this.effectTag = NoEffect;
    this.nextEffect = null;

    this.firstEffect = null;
    this.lastEffect = null;

    this.expirationTime = NoWork;

    this.alternate = null;

    {
      this._debugID = debugCounter++;
      this._debugSource = null;
      this._debugOwner = null;
      this._debugIsCurrentlyTiming = false;
      if (
        !hasBadMapPolyfill &&
        typeof Object.preventExtensions === 'function'
      ) {
        Object.preventExtensions(this);
      }
    }
  }

  // This is a constructor function, rather than a POJO constructor, still
  // please ensure we do the following:
  // 1) Nobody should add any instance methods on this. Instance methods can be
  //    more difficult to predict when they get optimized and they are almost
  //    never inlined properly in static compilers.
  // 2) Nobody should rely on `instanceof Fiber` for type testing. We should
  //    always know when it is a fiber.
  // 3) We might want to experiment with using numeric keys since they are easier
  //    to optimize in a non-JIT environment.
  // 4) We can easily go from a constructor to a createFiber object literal if that
  //    is faster.
  // 5) It should be easy to port this to a C struct and keep a C implementation
  //    compatible.
  var createFiber = function (tag, key, internalContextTag) {
    // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, key, internalContextTag);
  };

  function shouldConstruct(Component) {
    return !!(Component.prototype && Component.prototype.isReactComponent);
  }

  // This is used to create an alternate fiber to do work on.
  function createWorkInProgress(current, pendingProps, expirationTime) {
    var workInProgress = current.alternate;
    if (workInProgress === null) {
      // We use a double buffering pooling technique because we know that we'll
      // only ever need at most two versions of a tree. We pool the "other" unused
      // node that we're free to reuse. This is lazily created to avoid allocating
      // extra objects for things that are never updated. It also allow us to
      // reclaim the extra memory if needed.
      workInProgress = createFiber(
        current.tag,
        current.key,
        current.internalContextTag
      );
      workInProgress.type = current.type;
      workInProgress.stateNode = current.stateNode;

      {
        // DEV-only fields
        workInProgress._debugID = current._debugID;
        workInProgress._debugSource = current._debugSource;
        workInProgress._debugOwner = current._debugOwner;
      }

      workInProgress.alternate = current;
      current.alternate = workInProgress;
    } else {
      // We already have an alternate.
      // Reset the effect tag.
      workInProgress.effectTag = NoEffect;

      // The effect list is no longer valid.
      workInProgress.nextEffect = null;
      workInProgress.firstEffect = null;
      workInProgress.lastEffect = null;
    }

    workInProgress.expirationTime = expirationTime;
    workInProgress.pendingProps = pendingProps;

    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;

    // These will be overridden during the parent's reconciliation
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    workInProgress.ref = current.ref;

    return workInProgress;
  }

  function createHostRootFiber() {
    var fiber = createFiber(HostRoot, null, NoContext);
    return fiber;
  }

  function createFiberFromElement(element, internalContextTag, expirationTime) {
    var owner = null;
    {
      owner = element._owner;
    }

    var fiber = void 0;
    var type = element.type,
      key = element.key;

    if (typeof type === 'function') {
      fiber = shouldConstruct(type)
        ? createFiber(ClassComponent, key, internalContextTag)
        : createFiber(IndeterminateComponent, key, internalContextTag);
      fiber.type = type;
      fiber.pendingProps = element.props;
    } else if (typeof type === 'string') {
      fiber = createFiber(HostComponent, key, internalContextTag);
      fiber.type = type;
      fiber.pendingProps = element.props;
    } else if (
      typeof type === 'object' &&
      type !== null &&
      typeof type.tag === 'number'
    ) {
      // Currently assumed to be a continuation and therefore is a fiber already.
      // TODO: The yield system is currently broken for updates in some cases.
      // The reified yield stores a fiber, but we don't know which fiber that is;
      // the current or a workInProgress? When the continuation gets rendered here
      // we don't know if we can reuse that fiber or if we need to clone it.
      // There is probably a clever way to restructure this.
      fiber = type;
      fiber.pendingProps = element.props;
    } else {
      var info = '';
      {
        if (
          type === undefined ||
          (typeof type === 'object' &&
            type !== null &&
            Object.keys(type).length === 0)
        ) {
          info +=
            ' You likely forgot to export your component from the file ' +
            "it's defined in.";
        }
        var ownerName = owner ? getComponentName(owner) : null;
        if (ownerName) {
          info += '\n\nCheck the render method of `' + ownerName + '`.';
        }
      }
      invariant_1$1(
        false,
        'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s',
        type == null ? type : typeof type,
        info
      );
    }

    {
      fiber._debugSource = element._source;
      fiber._debugOwner = element._owner;
    }

    fiber.expirationTime = expirationTime;

    return fiber;
  }

  function createFiberFromFragment(
    elements,
    internalContextTag,
    expirationTime,
    key
  ) {
    var fiber = createFiber(Fragment, key, internalContextTag);
    fiber.pendingProps = elements;
    fiber.expirationTime = expirationTime;
    return fiber;
  }

  function createFiberFromText(content, internalContextTag, expirationTime) {
    var fiber = createFiber(HostText, null, internalContextTag);
    fiber.pendingProps = content;
    fiber.expirationTime = expirationTime;
    return fiber;
  }

  function createFiberFromHostInstanceForDeletion() {
    var fiber = createFiber(HostComponent, null, NoContext);
    fiber.type = 'DELETED';
    return fiber;
  }

  function createFiberFromCall(call, internalContextTag, expirationTime) {
    var fiber = createFiber(CallComponent, call.key, internalContextTag);
    fiber.type = call.handler;
    fiber.pendingProps = call;
    fiber.expirationTime = expirationTime;
    return fiber;
  }

  function createFiberFromReturn(
    returnNode,
    internalContextTag,
    expirationTime
  ) {
    var fiber = createFiber(ReturnComponent, null, internalContextTag);
    fiber.expirationTime = expirationTime;
    return fiber;
  }

  function createFiberFromPortal(portal, internalContextTag, expirationTime) {
    var fiber = createFiber(HostPortal, portal.key, internalContextTag);
    fiber.pendingProps = portal.children || [];
    fiber.expirationTime = expirationTime;
    fiber.stateNode = {
      containerInfo: portal.containerInfo,
      pendingChildren: null, // Used by persistent updates
      implementation: portal.implementation,
    };
    return fiber;
  }

  function createFiberRoot(containerInfo, hydrate) {
    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    var uninitializedFiber = createHostRootFiber();
    var root = {
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,
      remainingExpirationTime: NoWork,
      isReadyForCommit: false,
      finishedWork: null,
      context: null,
      pendingContext: null,
      hydrate: hydrate,
      nextScheduledRoot: null,
    };
    uninitializedFiber.stateNode = root;
    return root;
  }

  var onCommitFiberRoot = null;
  var onCommitFiberUnmount = null;
  var hasLoggedError = false;

  function catchErrors(fn) {
    return function (arg) {
      try {
        return fn(arg);
      } catch (err) {
        if (true && !hasLoggedError) {
          hasLoggedError = true;
          warning_1$1(false, 'React DevTools encountered an error: %s', err);
        }
      }
    };
  }

  function injectInternals(internals) {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
      // No DevTools
      return false;
    }
    var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook.isDisabled) {
      // This isn't a real property on the hook, but it can be set to opt out
      // of DevTools integration and associated warnings and logs.
      // https://github.com/facebook/react/issues/3877
      return true;
    }
    if (!hook.supportsFiber) {
      {
        warning_1$1(
          false,
          'The installed version of React DevTools is too old and will not work ' +
            'with the current version of React. Please update React DevTools. ' +
            'https://fb.me/react-devtools'
        );
      }
      // DevTools exists, even though it doesn't support Fiber.
      return true;
    }
    try {
      var rendererID = hook.inject(internals);
      // We have successfully injected, so now it is safe to set up hooks.
      onCommitFiberRoot = catchErrors(function (root) {
        return hook.onCommitFiberRoot(rendererID, root);
      });
      onCommitFiberUnmount = catchErrors(function (fiber) {
        return hook.onCommitFiberUnmount(rendererID, fiber);
      });
    } catch (err) {
      // Catch all errors because it is unsafe to throw during initialization.
      {
        warning_1$1(false, 'React DevTools encountered an error: %s.', err);
      }
    }
    // DevTools exists
    return true;
  }

  function onCommitRoot(root) {
    if (typeof onCommitFiberRoot === 'function') {
      onCommitFiberRoot(root);
    }
  }

  function onCommitUnmount(fiber) {
    if (typeof onCommitFiberUnmount === 'function') {
      onCommitFiberUnmount(fiber);
    }
  }

  var ReactErrorUtils = {
    // Used by Fiber to simulate a try-catch.
    _caughtError: null,
    _hasCaughtError: false,

    // Used by event system to capture/rethrow the first error.
    _rethrowError: null,
    _hasRethrowError: false,

    injection: {
      injectErrorUtils: function (injectedErrorUtils) {
        !(typeof injectedErrorUtils.invokeGuardedCallback === 'function')
          ? invariant_1$1(
              false,
              'Injected invokeGuardedCallback() must be a function.'
            )
          : void 0;
        invokeGuardedCallback$1 = injectedErrorUtils.invokeGuardedCallback;
      },
    },

    /**
     * Call a function while guarding against errors that happens within it.
     * Returns an error if it throws, otherwise null.
     *
     * In production, this is implemented using a try-catch. The reason we don't
     * use a try-catch directly is so that we can swap out a different
     * implementation in DEV mode.
     *
     * @param {String} name of the guard to use for logging or debugging
     * @param {Function} func The function to invoke
     * @param {*} context The context to use when calling the function
     * @param {...*} args Arguments for function
     */
    invokeGuardedCallback: function (name, func, context, a, b, c, d, e, f) {
      invokeGuardedCallback$1.apply(ReactErrorUtils, arguments);
    },

    /**
     * Same as invokeGuardedCallback, but instead of returning an error, it stores
     * it in a global so it can be rethrown by `rethrowCaughtError` later.
     * TODO: See if _caughtError and _rethrowError can be unified.
     *
     * @param {String} name of the guard to use for logging or debugging
     * @param {Function} func The function to invoke
     * @param {*} context The context to use when calling the function
     * @param {...*} args Arguments for function
     */
    invokeGuardedCallbackAndCatchFirstError: function (
      name,
      func,
      context,
      a,
      b,
      c,
      d,
      e,
      f
    ) {
      ReactErrorUtils.invokeGuardedCallback.apply(this, arguments);
      if (ReactErrorUtils.hasCaughtError()) {
        var error = ReactErrorUtils.clearCaughtError();
        if (!ReactErrorUtils._hasRethrowError) {
          ReactErrorUtils._hasRethrowError = true;
          ReactErrorUtils._rethrowError = error;
        }
      }
    },

    /**
     * During execution of guarded functions we will capture the first error which
     * we will rethrow to be handled by the top level error handler.
     */
    rethrowCaughtError: function () {
      return rethrowCaughtError.apply(ReactErrorUtils, arguments);
    },

    hasCaughtError: function () {
      return ReactErrorUtils._hasCaughtError;
    },

    clearCaughtError: function () {
      if (ReactErrorUtils._hasCaughtError) {
        var error = ReactErrorUtils._caughtError;
        ReactErrorUtils._caughtError = null;
        ReactErrorUtils._hasCaughtError = false;
        return error;
      } else {
        invariant_1$1(
          false,
          'clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.'
        );
      }
    },
  };

  var invokeGuardedCallback$1 = function (
    name,
    func,
    context,
    a,
    b,
    c,
    d,
    e,
    f
  ) {
    ReactErrorUtils._hasCaughtError = false;
    ReactErrorUtils._caughtError = null;
    var funcArgs = Array.prototype.slice.call(arguments, 3);
    try {
      func.apply(context, funcArgs);
    } catch (error) {
      ReactErrorUtils._caughtError = error;
      ReactErrorUtils._hasCaughtError = true;
    }
  };

  {
    // In DEV mode, we swap out invokeGuardedCallback for a special version
    // that plays more nicely with the browser's DevTools. The idea is to preserve
    // "Pause on exceptions" behavior. Because React wraps all user-provided
    // functions in invokeGuardedCallback, and the production version of
    // invokeGuardedCallback uses a try-catch, all user exceptions are treated
    // like caught exceptions, and the DevTools won't pause unless the developer
    // takes the extra step of enabling pause on caught exceptions. This is
    // untintuitive, though, because even though React has caught the error, from
    // the developer's perspective, the error is uncaught.
    //
    // To preserve the expected "Pause on exceptions" behavior, we don't use a
    // try-catch in DEV. Instead, we synchronously dispatch a fake event to a fake
    // DOM node, and call the user-provided callback from inside an event handler
    // for that fake event. If the callback throws, the error is "captured" using
    // a global event handler. But because the error happens in a different
    // event loop context, it does not interrupt the normal program flow.
    // Effectively, this gives us try-catch behavior without actually using
    // try-catch. Neat!

    // Check that the browser supports the APIs we need to implement our special
    // DEV version of invokeGuardedCallback
    if (
      typeof window !== 'undefined' &&
      typeof window.dispatchEvent === 'function' &&
      typeof document !== 'undefined' &&
      typeof document.createEvent === 'function'
    ) {
      var fakeNode = document.createElement('react');

      var invokeGuardedCallbackDev = function (
        name,
        func,
        context,
        a,
        b,
        c,
        d,
        e,
        f
      ) {
        // Keeps track of whether the user-provided callback threw an error. We
        // set this to true at the beginning, then set it to false right after
        // calling the function. If the function errors, `didError` will never be
        // set to false. This strategy works even if the browser is flaky and
        // fails to call our global error handler, because it doesn't rely on
        // the error event at all.
        var didError = true;

        // Create an event handler for our fake event. We will synchronously
        // dispatch our fake event using `dispatchEvent`. Inside the handler, we
        // call the user-provided callback.
        var funcArgs = Array.prototype.slice.call(arguments, 3);
        function callCallback() {
          // We immediately remove the callback from event listeners so that
          // nested `invokeGuardedCallback` calls do not clash. Otherwise, a
          // nested call would trigger the fake event handlers of any call higher
          // in the stack.
          fakeNode.removeEventListener(evtType, callCallback, false);
          func.apply(context, funcArgs);
          didError = false;
        }

        // Create a global error event handler. We use this to capture the value
        // that was thrown. It's possible that this error handler will fire more
        // than once; for example, if non-React code also calls `dispatchEvent`
        // and a handler for that event throws. We should be resilient to most of
        // those cases. Even if our error event handler fires more than once, the
        // last error event is always used. If the callback actually does error,
        // we know that the last error event is the correct one, because it's not
        // possible for anything else to have happened in between our callback
        // erroring and the code that follows the `dispatchEvent` call below. If
        // the callback doesn't error, but the error event was fired, we know to
        // ignore it because `didError` will be false, as described above.
        var error = void 0;
        // Use this to track whether the error event is ever called.
        var didSetError = false;
        var isCrossOriginError = false;

        function onError(event) {
          error = event.error;
          didSetError = true;
          if (error === null && event.colno === 0 && event.lineno === 0) {
            isCrossOriginError = true;
          }
        }

        // Create a fake event type.
        var evtType = 'react-' + (name ? name : 'invokeguardedcallback');

        // Attach our event handlers
        window.addEventListener('error', onError);
        fakeNode.addEventListener(evtType, callCallback, false);

        // Synchronously dispatch our fake event. If the user-provided function
        // errors, it will trigger our global error handler.
        var evt = document.createEvent('Event');
        evt.initEvent(evtType, false, false);
        fakeNode.dispatchEvent(evt);

        if (didError) {
          if (!didSetError) {
            // The callback errored, but the error event never fired.
            error = new Error(
              'An error was thrown inside one of your components, but React ' +
                "doesn't know what it was. This is likely due to browser " +
                'flakiness. React does its best to preserve the "Pause on ' +
                'exceptions" behavior of the DevTools, which requires some ' +
                "DEV-mode only tricks. It's possible that these don't work in " +
                'your browser. Try triggering the error in production mode, ' +
                'or switching to a modern browser. If you suspect that this is ' +
                'actually an issue with React, please file an issue.'
            );
          } else if (isCrossOriginError) {
            error = new Error(
              "A cross-origin error was thrown. React doesn't have access to " +
                'the actual error object in development. ' +
                'See https://fb.me/react-crossorigin-error for more information.'
            );
          }
          ReactErrorUtils._hasCaughtError = true;
          ReactErrorUtils._caughtError = error;
        } else {
          ReactErrorUtils._hasCaughtError = false;
          ReactErrorUtils._caughtError = null;
        }

        // Remove our event listeners
        window.removeEventListener('error', onError);
      };

      invokeGuardedCallback$1 = invokeGuardedCallbackDev;
    }
  }

  var rethrowCaughtError = function () {
    if (ReactErrorUtils._hasRethrowError) {
      var error = ReactErrorUtils._rethrowError;
      ReactErrorUtils._rethrowError = null;
      ReactErrorUtils._hasRethrowError = false;
      throw error;
    }
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * @typechecks
   *
   */

  /*eslint-disable no-self-compare */

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      // Added the nonzero y check to make Flow happy, but it is redundant
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }

  /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */
  function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
      return true;
    }

    if (
      typeof objA !== 'object' ||
      objA === null ||
      typeof objB !== 'object' ||
      objB === null
    ) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
      if (
        !hasOwnProperty.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])
      ) {
        return false;
      }
    }

    return true;
  }

  var shallowEqual_1$1 = shallowEqual;

  {
    var didWarnUpdateInsideUpdate = false;
  }

  // Callbacks are not validated until invocation

  // Singly linked-list of updates. When an update is scheduled, it is added to
  // the queue of the current fiber and the work-in-progress fiber. The two queues
  // are separate but they share a persistent structure.
  //
  // During reconciliation, updates are removed from the work-in-progress fiber,
  // but they remain on the current fiber. That ensures that if a work-in-progress
  // is aborted, the aborted updates are recovered by cloning from current.
  //
  // The work-in-progress queue is always a subset of the current queue.
  //
  // When the tree is committed, the work-in-progress becomes the current.

  function createUpdateQueue(baseState) {
    var queue = {
      baseState: baseState,
      expirationTime: NoWork,
      first: null,
      last: null,
      callbackList: null,
      hasForceUpdate: false,
      isInitialized: false,
    };
    {
      queue.isProcessing = false;
    }
    return queue;
  }

  function insertUpdateIntoQueue(queue, update) {
    // Append the update to the end of the list.
    if (queue.last === null) {
      // Queue is empty
      queue.first = queue.last = update;
    } else {
      queue.last.next = update;
      queue.last = update;
    }
    if (
      queue.expirationTime === NoWork ||
      queue.expirationTime > update.expirationTime
    ) {
      queue.expirationTime = update.expirationTime;
    }
  }

  function insertUpdateIntoFiber(fiber, update) {
    // We'll have at least one and at most two distinct update queues.
    var alternateFiber = fiber.alternate;
    var queue1 = fiber.updateQueue;
    if (queue1 === null) {
      // TODO: We don't know what the base state will be until we begin work.
      // It depends on which fiber is the next current. Initialize with an empty
      // base state, then set to the memoizedState when rendering. Not super
      // happy with this approach.
      queue1 = fiber.updateQueue = createUpdateQueue(null);
    }

    var queue2 = void 0;
    if (alternateFiber !== null) {
      queue2 = alternateFiber.updateQueue;
      if (queue2 === null) {
        queue2 = alternateFiber.updateQueue = createUpdateQueue(null);
      }
    } else {
      queue2 = null;
    }
    queue2 = queue2 !== queue1 ? queue2 : null;

    // Warn if an update is scheduled from inside an updater function.
    {
      if (
        (queue1.isProcessing || (queue2 !== null && queue2.isProcessing)) &&
        !didWarnUpdateInsideUpdate
      ) {
        warning_1$1(
          false,
          'An update (setState, replaceState, or forceUpdate) was scheduled ' +
            'from inside an update function. Update functions should be pure, ' +
            'with zero side-effects. Consider using componentDidUpdate or a ' +
            'callback.'
        );
        didWarnUpdateInsideUpdate = true;
      }
    }

    // If there's only one queue, add the update to that queue and exit.
    if (queue2 === null) {
      insertUpdateIntoQueue(queue1, update);
      return;
    }

    // If either queue is empty, we need to add to both queues.
    if (queue1.last === null || queue2.last === null) {
      insertUpdateIntoQueue(queue1, update);
      insertUpdateIntoQueue(queue2, update);
      return;
    }

    // If both lists are not empty, the last update is the same for both lists
    // because of structural sharing. So, we should only append to one of
    // the lists.
    insertUpdateIntoQueue(queue1, update);
    // But we still need to update the `last` pointer of queue2.
    queue2.last = update;
  }

  function getUpdateExpirationTime(fiber) {
    if (fiber.tag !== ClassComponent && fiber.tag !== HostRoot) {
      return NoWork;
    }
    var updateQueue = fiber.updateQueue;
    if (updateQueue === null) {
      return NoWork;
    }
    return updateQueue.expirationTime;
  }

  function getStateFromUpdate(update, instance, prevState, props) {
    var partialState = update.partialState;
    if (typeof partialState === 'function') {
      var updateFn = partialState;
      return updateFn.call(instance, prevState, props);
    } else {
      return partialState;
    }
  }

  function processUpdateQueue(
    current,
    workInProgress,
    queue,
    instance,
    props,
    renderExpirationTime
  ) {
    if (current !== null && current.updateQueue === queue) {
      // We need to create a work-in-progress queue, by cloning the current queue.
      var currentQueue = queue;
      queue = workInProgress.updateQueue = {
        baseState: currentQueue.baseState,
        expirationTime: currentQueue.expirationTime,
        first: currentQueue.first,
        last: currentQueue.last,
        isInitialized: currentQueue.isInitialized,
        // These fields are no longer valid because they were already committed.
        // Reset them.
        callbackList: null,
        hasForceUpdate: false,
      };
    }

    {
      // Set this flag so we can warn if setState is called inside the update
      // function of another setState.
      queue.isProcessing = true;
    }

    // Reset the remaining expiration time. If we skip over any updates, we'll
    // increase this accordingly.
    queue.expirationTime = NoWork;

    // TODO: We don't know what the base state will be until we begin work.
    // It depends on which fiber is the next current. Initialize with an empty
    // base state, then set to the memoizedState when rendering. Not super
    // happy with this approach.
    var state = void 0;
    if (queue.isInitialized) {
      state = queue.baseState;
    } else {
      state = queue.baseState = workInProgress.memoizedState;
      queue.isInitialized = true;
    }
    var dontMutatePrevState = true;
    var update = queue.first;
    var didSkip = false;
    while (update !== null) {
      var updateExpirationTime = update.expirationTime;
      if (updateExpirationTime > renderExpirationTime) {
        // This update does not have sufficient priority. Skip it.
        var remainingExpirationTime = queue.expirationTime;
        if (
          remainingExpirationTime === NoWork ||
          remainingExpirationTime > updateExpirationTime
        ) {
          // Update the remaining expiration time.
          queue.expirationTime = updateExpirationTime;
        }
        if (!didSkip) {
          didSkip = true;
          queue.baseState = state;
        }
        // Continue to the next update.
        update = update.next;
        continue;
      }

      // This update does have sufficient priority.

      // If no previous updates were skipped, drop this update from the queue by
      // advancing the head of the list.
      if (!didSkip) {
        queue.first = update.next;
        if (queue.first === null) {
          queue.last = null;
        }
      }

      // Process the update
      var _partialState = void 0;
      if (update.isReplace) {
        state = getStateFromUpdate(update, instance, state, props);
        dontMutatePrevState = true;
      } else {
        _partialState = getStateFromUpdate(update, instance, state, props);
        if (_partialState) {
          if (dontMutatePrevState) {
            // $FlowFixMe: Idk how to type this properly.
            state = _assign({}, state, _partialState);
          } else {
            state = _assign(state, _partialState);
          }
          dontMutatePrevState = false;
        }
      }
      if (update.isForced) {
        queue.hasForceUpdate = true;
      }
      if (update.callback !== null) {
        // Append to list of callbacks.
        var _callbackList = queue.callbackList;
        if (_callbackList === null) {
          _callbackList = queue.callbackList = [];
        }
        _callbackList.push(update);
      }
      update = update.next;
    }

    if (queue.callbackList !== null) {
      workInProgress.effectTag |= Callback;
    } else if (queue.first === null && !queue.hasForceUpdate) {
      // The queue is empty. We can reset it.
      workInProgress.updateQueue = null;
    }

    if (!didSkip) {
      didSkip = true;
      queue.baseState = state;
    }

    {
      // No longer processing.
      queue.isProcessing = false;
    }

    return state;
  }

  function commitCallbacks(queue, context) {
    var callbackList = queue.callbackList;
    if (callbackList === null) {
      return;
    }
    // Set the list to null to make sure they don't get called more than once.
    queue.callbackList = null;
    for (var i = 0; i < callbackList.length; i++) {
      var update = callbackList[i];
      var _callback = update.callback;
      // This update might be processed again. Clear the callback so it's only
      // called once.
      update.callback = null;
      !(typeof _callback === 'function')
        ? invariant_1$1(
            false,
            'Invalid argument passed as callback. Expected a function. Instead received: %s',
            _callback
          )
        : void 0;
      _callback.call(context);
    }
  }

  var fakeInternalInstance = {};
  var isArray = Array.isArray;

  {
    var didWarnAboutStateAssignmentForComponent = {};

    var warnOnInvalidCallback = function (callback, callerName) {
      warning_1$1(
        callback === null || typeof callback === 'function',
        '%s(...): Expected the last optional `callback` argument to be a ' +
          'function. Instead received: %s.',
        callerName,
        callback
      );
    };

    // This is so gross but it's at least non-critical and can be removed if
    // it causes problems. This is meant to give a nicer error message for
    // ReactDOM15.unstable_renderSubtreeIntoContainer(reactDOM16Component,
    // ...)) which otherwise throws a "_processChildContext is not a function"
    // exception.
    Object.defineProperty(fakeInternalInstance, '_processChildContext', {
      enumerable: false,
      value: function () {
        invariant_1$1(
          false,
          "_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal)."
        );
      },
    });
    Object.freeze(fakeInternalInstance);
  }

  var ReactFiberClassComponent = function (
    scheduleWork,
    computeExpirationForFiber,
    memoizeProps,
    memoizeState
  ) {
    // Class component state updater
    var updater = {
      isMounted: isMounted,
      enqueueSetState: function (instance, partialState, callback) {
        var fiber = get(instance);
        callback = callback === undefined ? null : callback;
        {
          warnOnInvalidCallback(callback, 'setState');
        }
        var expirationTime = computeExpirationForFiber(fiber);
        var update = {
          expirationTime: expirationTime,
          partialState: partialState,
          callback: callback,
          isReplace: false,
          isForced: false,
          nextCallback: null,
          next: null,
        };
        insertUpdateIntoFiber(fiber, update);
        scheduleWork(fiber, expirationTime);
      },
      enqueueReplaceState: function (instance, state, callback) {
        var fiber = get(instance);
        callback = callback === undefined ? null : callback;
        {
          warnOnInvalidCallback(callback, 'replaceState');
        }
        var expirationTime = computeExpirationForFiber(fiber);
        var update = {
          expirationTime: expirationTime,
          partialState: state,
          callback: callback,
          isReplace: true,
          isForced: false,
          nextCallback: null,
          next: null,
        };
        insertUpdateIntoFiber(fiber, update);
        scheduleWork(fiber, expirationTime);
      },
      enqueueForceUpdate: function (instance, callback) {
        var fiber = get(instance);
        callback = callback === undefined ? null : callback;
        {
          warnOnInvalidCallback(callback, 'forceUpdate');
        }
        var expirationTime = computeExpirationForFiber(fiber);
        var update = {
          expirationTime: expirationTime,
          partialState: null,
          callback: callback,
          isReplace: false,
          isForced: true,
          nextCallback: null,
          next: null,
        };
        insertUpdateIntoFiber(fiber, update);
        scheduleWork(fiber, expirationTime);
      },
    };

    function checkShouldComponentUpdate(
      workInProgress,
      oldProps,
      newProps,
      oldState,
      newState,
      newContext
    ) {
      if (
        oldProps === null ||
        (workInProgress.updateQueue !== null &&
          workInProgress.updateQueue.hasForceUpdate)
      ) {
        // If the workInProgress already has an Update effect, return true
        return true;
      }

      var instance = workInProgress.stateNode;
      var type = workInProgress.type;
      if (typeof instance.shouldComponentUpdate === 'function') {
        startPhaseTimer(workInProgress, 'shouldComponentUpdate');
        var shouldUpdate = instance.shouldComponentUpdate(
          newProps,
          newState,
          newContext
        );
        stopPhaseTimer();

        {
          warning_1$1(
            shouldUpdate !== undefined,
            '%s.shouldComponentUpdate(): Returned undefined instead of a ' +
              'boolean value. Make sure to return true or false.',
            getComponentName(workInProgress) || 'Unknown'
          );
        }

        return shouldUpdate;
      }

      if (type.prototype && type.prototype.isPureReactComponent) {
        return (
          !shallowEqual_1$1(oldProps, newProps) ||
          !shallowEqual_1$1(oldState, newState)
        );
      }

      return true;
    }

    function checkClassInstance(workInProgress) {
      var instance = workInProgress.stateNode;
      var type = workInProgress.type;
      {
        var name = getComponentName(workInProgress);
        var renderPresent = instance.render;

        if (!renderPresent) {
          if (type.prototype && typeof type.prototype.render === 'function') {
            warning_1$1(
              false,
              '%s(...): No `render` method found on the returned component ' +
                'instance: did you accidentally return an object from the constructor?',
              name
            );
          } else {
            warning_1$1(
              false,
              '%s(...): No `render` method found on the returned component ' +
                'instance: you may have forgotten to define `render`.',
              name
            );
          }
        }

        var noGetInitialStateOnES6 =
          !instance.getInitialState ||
          instance.getInitialState.isReactClassApproved ||
          instance.state;
        warning_1$1(
          noGetInitialStateOnES6,
          'getInitialState was defined on %s, a plain JavaScript class. ' +
            'This is only supported for classes created using React.createClass. ' +
            'Did you mean to define a state property instead?',
          name
        );
        var noGetDefaultPropsOnES6 =
          !instance.getDefaultProps ||
          instance.getDefaultProps.isReactClassApproved;
        warning_1$1(
          noGetDefaultPropsOnES6,
          'getDefaultProps was defined on %s, a plain JavaScript class. ' +
            'This is only supported for classes created using React.createClass. ' +
            'Use a static property to define defaultProps instead.',
          name
        );
        var noInstancePropTypes = !instance.propTypes;
        warning_1$1(
          noInstancePropTypes,
          'propTypes was defined as an instance property on %s. Use a static ' +
            'property to define propTypes instead.',
          name
        );
        var noInstanceContextTypes = !instance.contextTypes;
        warning_1$1(
          noInstanceContextTypes,
          'contextTypes was defined as an instance property on %s. Use a static ' +
            'property to define contextTypes instead.',
          name
        );
        var noComponentShouldUpdate =
          typeof instance.componentShouldUpdate !== 'function';
        warning_1$1(
          noComponentShouldUpdate,
          '%s has a method called ' +
            'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
            'The name is phrased as a question because the function is ' +
            'expected to return a value.',
          name
        );
        if (
          type.prototype &&
          type.prototype.isPureReactComponent &&
          typeof instance.shouldComponentUpdate !== 'undefined'
        ) {
          warning_1$1(
            false,
            '%s has a method called shouldComponentUpdate(). ' +
              'shouldComponentUpdate should not be used when extending React.PureComponent. ' +
              'Please extend React.Component if shouldComponentUpdate is used.',
            getComponentName(workInProgress) || 'A pure component'
          );
        }
        var noComponentDidUnmount =
          typeof instance.componentDidUnmount !== 'function';
        warning_1$1(
          noComponentDidUnmount,
          '%s has a method called ' +
            'componentDidUnmount(). But there is no such lifecycle method. ' +
            'Did you mean componentWillUnmount()?',
          name
        );
        var noComponentDidReceiveProps =
          typeof instance.componentDidReceiveProps !== 'function';
        warning_1$1(
          noComponentDidReceiveProps,
          '%s has a method called ' +
            'componentDidReceiveProps(). But there is no such lifecycle method. ' +
            'If you meant to update the state in response to changing props, ' +
            'use componentWillReceiveProps(). If you meant to fetch data or ' +
            'run side-effects or mutations after React has updated the UI, use componentDidUpdate().',
          name
        );
        var noComponentWillRecieveProps =
          typeof instance.componentWillRecieveProps !== 'function';
        warning_1$1(
          noComponentWillRecieveProps,
          '%s has a method called ' +
            'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
          name
        );
        var hasMutatedProps = instance.props !== workInProgress.pendingProps;
        warning_1$1(
          instance.props === undefined || !hasMutatedProps,
          '%s(...): When calling super() in `%s`, make sure to pass ' +
            "up the same props that your component's constructor was passed.",
          name,
          name
        );
        var noInstanceDefaultProps = !instance.defaultProps;
        warning_1$1(
          noInstanceDefaultProps,
          'Setting defaultProps as an instance property on %s is not supported and will be ignored.' +
            ' Instead, define defaultProps as a static property on %s.',
          name,
          name
        );
      }

      var state = instance.state;
      if (state && (typeof state !== 'object' || isArray(state))) {
        invariant_1$1(
          false,
          '%s.state: must be set to an object or null',
          getComponentName(workInProgress)
        );
      }
      if (typeof instance.getChildContext === 'function') {
        !(typeof workInProgress.type.childContextTypes === 'object')
          ? invariant_1$1(
              false,
              '%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().',
              getComponentName(workInProgress)
            )
          : void 0;
      }
    }

    function resetInputPointers(workInProgress, instance) {
      instance.props = workInProgress.memoizedProps;
      instance.state = workInProgress.memoizedState;
    }

    function adoptClassInstance(workInProgress, instance) {
      instance.updater = updater;
      workInProgress.stateNode = instance;
      // The instance needs access to the fiber so that it can schedule updates
      set(instance, workInProgress);
      {
        instance._reactInternalInstance = fakeInternalInstance;
      }
    }

    function constructClassInstance(workInProgress, props) {
      var ctor = workInProgress.type;
      var unmaskedContext = getUnmaskedContext(workInProgress);
      var needsContext = isContextConsumer(workInProgress);
      var context = needsContext
        ? getMaskedContext(workInProgress, unmaskedContext)
        : emptyObject_1;
      var instance = new ctor(props, context);
      adoptClassInstance(workInProgress, instance);

      // Cache unmasked context so we can avoid recreating masked context unless necessary.
      // ReactFiberContext usually updates this cache but can't for newly-created instances.
      if (needsContext) {
        cacheContext(workInProgress, unmaskedContext, context);
      }

      return instance;
    }

    function callComponentWillMount(workInProgress, instance) {
      startPhaseTimer(workInProgress, 'componentWillMount');
      var oldState = instance.state;
      instance.componentWillMount();

      stopPhaseTimer();

      if (oldState !== instance.state) {
        {
          warning_1$1(
            false,
            '%s.componentWillMount(): Assigning directly to this.state is ' +
              "deprecated (except inside a component's " +
              'constructor). Use setState instead.',
            getComponentName(workInProgress)
          );
        }
        updater.enqueueReplaceState(instance, instance.state, null);
      }
    }

    function callComponentWillReceiveProps(
      workInProgress,
      instance,
      newProps,
      newContext
    ) {
      startPhaseTimer(workInProgress, 'componentWillReceiveProps');
      var oldState = instance.state;
      instance.componentWillReceiveProps(newProps, newContext);
      stopPhaseTimer();

      if (instance.state !== oldState) {
        {
          var componentName = getComponentName(workInProgress) || 'Component';
          if (!didWarnAboutStateAssignmentForComponent[componentName]) {
            warning_1$1(
              false,
              '%s.componentWillReceiveProps(): Assigning directly to ' +
                "this.state is deprecated (except inside a component's " +
                'constructor). Use setState instead.',
              componentName
            );
            didWarnAboutStateAssignmentForComponent[componentName] = true;
          }
        }
        updater.enqueueReplaceState(instance, instance.state, null);
      }
    }

    // Invokes the mount life-cycles on a previously never rendered instance.
    function mountClassInstance(workInProgress, renderExpirationTime) {
      var current = workInProgress.alternate;

      {
        checkClassInstance(workInProgress);
      }

      var instance = workInProgress.stateNode;
      var state = instance.state || null;

      var props = workInProgress.pendingProps;
      !props
        ? invariant_1$1(
            false,
            'There must be pending props for an initial mount. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;

      var unmaskedContext = getUnmaskedContext(workInProgress);

      instance.props = props;
      instance.state = workInProgress.memoizedState = state;
      instance.refs = emptyObject_1;
      instance.context = getMaskedContext(workInProgress, unmaskedContext);

      if (
        enableAsyncSubtreeAPI &&
        workInProgress.type != null &&
        workInProgress.type.prototype != null &&
        workInProgress.type.prototype.unstable_isAsyncReactComponent === true
      ) {
        workInProgress.internalContextTag |= AsyncUpdates;
      }

      if (typeof instance.componentWillMount === 'function') {
        callComponentWillMount(workInProgress, instance);
        // If we had additional state updates during this life-cycle, let's
        // process them now.
        var updateQueue = workInProgress.updateQueue;
        if (updateQueue !== null) {
          instance.state = processUpdateQueue(
            current,
            workInProgress,
            updateQueue,
            instance,
            props,
            renderExpirationTime
          );
        }
      }
      if (typeof instance.componentDidMount === 'function') {
        workInProgress.effectTag |= Update;
      }
    }

    // Called on a preexisting class instance. Returns false if a resumed render
    // could be reused.
    // function resumeMountClassInstance(
    //   workInProgress: Fiber,
    //   priorityLevel: PriorityLevel,
    // ): boolean {
    //   const instance = workInProgress.stateNode;
    //   resetInputPointers(workInProgress, instance);

    //   let newState = workInProgress.memoizedState;
    //   let newProps = workInProgress.pendingProps;
    //   if (!newProps) {
    //     // If there isn't any new props, then we'll reuse the memoized props.
    //     // This could be from already completed work.
    //     newProps = workInProgress.memoizedProps;
    //     invariant(
    //       newProps != null,
    //       'There should always be pending or memoized props. This error is ' +
    //         'likely caused by a bug in React. Please file an issue.',
    //     );
    //   }
    //   const newUnmaskedContext = getUnmaskedContext(workInProgress);
    //   const newContext = getMaskedContext(workInProgress, newUnmaskedContext);

    //   const oldContext = instance.context;
    //   const oldProps = workInProgress.memoizedProps;

    //   if (
    //     typeof instance.componentWillReceiveProps === 'function' &&
    //     (oldProps !== newProps || oldContext !== newContext)
    //   ) {
    //     callComponentWillReceiveProps(
    //       workInProgress,
    //       instance,
    //       newProps,
    //       newContext,
    //     );
    //   }

    //   // Process the update queue before calling shouldComponentUpdate
    //   const updateQueue = workInProgress.updateQueue;
    //   if (updateQueue !== null) {
    //     newState = processUpdateQueue(
    //       workInProgress,
    //       updateQueue,
    //       instance,
    //       newState,
    //       newProps,
    //       priorityLevel,
    //     );
    //   }

    //   // TODO: Should we deal with a setState that happened after the last
    //   // componentWillMount and before this componentWillMount? Probably
    //   // unsupported anyway.

    //   if (
    //     !checkShouldComponentUpdate(
    //       workInProgress,
    //       workInProgress.memoizedProps,
    //       newProps,
    //       workInProgress.memoizedState,
    //       newState,
    //       newContext,
    //     )
    //   ) {
    //     // Update the existing instance's state, props, and context pointers even
    //     // though we're bailing out.
    //     instance.props = newProps;
    //     instance.state = newState;
    //     instance.context = newContext;
    //     return false;
    //   }

    //   // Update the input pointers now so that they are correct when we call
    //   // componentWillMount
    //   instance.props = newProps;
    //   instance.state = newState;
    //   instance.context = newContext;

    //   if (typeof instance.componentWillMount === 'function') {
    //     callComponentWillMount(workInProgress, instance);
    //     // componentWillMount may have called setState. Process the update queue.
    //     const newUpdateQueue = workInProgress.updateQueue;
    //     if (newUpdateQueue !== null) {
    //       newState = processUpdateQueue(
    //         workInProgress,
    //         newUpdateQueue,
    //         instance,
    //         newState,
    //         newProps,
    //         priorityLevel,
    //       );
    //     }
    //   }

    //   if (typeof instance.componentDidMount === 'function') {
    //     workInProgress.effectTag |= Update;
    //   }

    //   instance.state = newState;

    //   return true;
    // }

    // Invokes the update life-cycles and returns false if it shouldn't rerender.
    function updateClassInstance(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      var instance = workInProgress.stateNode;
      resetInputPointers(workInProgress, instance);

      var oldProps = workInProgress.memoizedProps;
      var newProps = workInProgress.pendingProps;
      if (!newProps) {
        // If there aren't any new props, then we'll reuse the memoized props.
        // This could be from already completed work.
        newProps = oldProps;
        !(newProps != null)
          ? invariant_1$1(
              false,
              'There should always be pending or memoized props. This error is likely caused by a bug in React. Please file an issue.'
            )
          : void 0;
      }
      var oldContext = instance.context;
      var newUnmaskedContext = getUnmaskedContext(workInProgress);
      var newContext = getMaskedContext(workInProgress, newUnmaskedContext);

      // Note: During these life-cycles, instance.props/instance.state are what
      // ever the previously attempted to render - not the "current". However,
      // during componentDidUpdate we pass the "current" props.

      if (
        typeof instance.componentWillReceiveProps === 'function' &&
        (oldProps !== newProps || oldContext !== newContext)
      ) {
        callComponentWillReceiveProps(
          workInProgress,
          instance,
          newProps,
          newContext
        );
      }

      // Compute the next state using the memoized state and the update queue.
      var oldState = workInProgress.memoizedState;
      // TODO: Previous state can be null.
      var newState = void 0;
      if (workInProgress.updateQueue !== null) {
        newState = processUpdateQueue(
          current,
          workInProgress,
          workInProgress.updateQueue,
          instance,
          newProps,
          renderExpirationTime
        );
      } else {
        newState = oldState;
      }

      if (
        oldProps === newProps &&
        oldState === newState &&
        !hasContextChanged() &&
        !(
          workInProgress.updateQueue !== null &&
          workInProgress.updateQueue.hasForceUpdate
        )
      ) {
        // If an update was already in progress, we should schedule an Update
        // effect even though we're bailing out, so that cWU/cDU are called.
        if (typeof instance.componentDidUpdate === 'function') {
          if (
            oldProps !== current.memoizedProps ||
            oldState !== current.memoizedState
          ) {
            workInProgress.effectTag |= Update;
          }
        }
        return false;
      }

      var shouldUpdate = checkShouldComponentUpdate(
        workInProgress,
        oldProps,
        newProps,
        oldState,
        newState,
        newContext
      );

      if (shouldUpdate) {
        if (typeof instance.componentWillUpdate === 'function') {
          startPhaseTimer(workInProgress, 'componentWillUpdate');
          instance.componentWillUpdate(newProps, newState, newContext);
          stopPhaseTimer();
        }
        if (typeof instance.componentDidUpdate === 'function') {
          workInProgress.effectTag |= Update;
        }
      } else {
        // If an update was already in progress, we should schedule an Update
        // effect even though we're bailing out, so that cWU/cDU are called.
        if (typeof instance.componentDidUpdate === 'function') {
          if (
            oldProps !== current.memoizedProps ||
            oldState !== current.memoizedState
          ) {
            workInProgress.effectTag |= Update;
          }
        }

        // If shouldComponentUpdate returned false, we should still update the
        // memoized props/state to indicate that this work can be reused.
        memoizeProps(workInProgress, newProps);
        memoizeState(workInProgress, newState);
      }

      // Update the existing instance's state, props, and context pointers even
      // if shouldComponentUpdate returns false.
      instance.props = newProps;
      instance.state = newState;
      instance.context = newContext;

      return shouldUpdate;
    }

    return {
      adoptClassInstance: adoptClassInstance,
      constructClassInstance: constructClassInstance,
      mountClassInstance: mountClassInstance,
      // resumeMountClassInstance,
      updateClassInstance: updateClassInstance,
    };
  };

  // The Symbol used to tag the special React types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var REACT_PORTAL_TYPE =
    (typeof Symbol === 'function' &&
      Symbol['for'] &&
      Symbol['for']('react.portal')) ||
    0xeaca;

  var getCurrentFiberStackAddendum$1 =
    ReactDebugCurrentFiber.getCurrentFiberStackAddendum;

  {
    var didWarnAboutMaps = false;
    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */
    var ownerHasKeyUseWarning = {};
    var ownerHasFunctionTypeWarning = {};

    var warnForMissingKey = function (child) {
      if (child === null || typeof child !== 'object') {
        return;
      }
      if (!child._store || child._store.validated || child.key != null) {
        return;
      }
      !(typeof child._store === 'object')
        ? invariant_1$1(
            false,
            'React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      child._store.validated = true;

      var currentComponentErrorInfo =
        'Each child in an array or iterator should have a unique ' +
        '"key" prop. See https://fb.me/react-warning-keys for ' +
        'more information.' +
        (getCurrentFiberStackAddendum$1() || '');
      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }
      ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

      warning_1$1(
        false,
        'Each child in an array or iterator should have a unique ' +
          '"key" prop. See https://fb.me/react-warning-keys for ' +
          'more information.%s',
        getCurrentFiberStackAddendum$1()
      );
    };
  }

  var isArray$1 = Array.isArray;

  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var REACT_ELEMENT_TYPE;
  var REACT_CALL_TYPE;
  var REACT_RETURN_TYPE;
  var REACT_FRAGMENT_TYPE;
  if (typeof Symbol === 'function' && Symbol['for']) {
    REACT_ELEMENT_TYPE = Symbol['for']('react.element');
    REACT_CALL_TYPE = Symbol['for']('react.call');
    REACT_RETURN_TYPE = Symbol['for']('react.return');
    REACT_FRAGMENT_TYPE = Symbol['for']('react.fragment');
  } else {
    REACT_ELEMENT_TYPE = 0xeac7;
    REACT_CALL_TYPE = 0xeac8;
    REACT_RETURN_TYPE = 0xeac9;
    REACT_FRAGMENT_TYPE = 0xeacb;
  }

  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable === 'undefined') {
      return null;
    }
    var iteratorFn =
      (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
      maybeIterable[FAUX_ITERATOR_SYMBOL];
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
    return null;
  }

  function coerceRef(current, element) {
    var mixedRef = element.ref;
    if (mixedRef !== null && typeof mixedRef !== 'function') {
      if (element._owner) {
        var owner = element._owner;
        var inst = void 0;
        if (owner) {
          var ownerFiber = owner;
          !(ownerFiber.tag === ClassComponent)
            ? invariant_1$1(
                false,
                'Stateless function components cannot have refs.'
              )
            : void 0;
          inst = ownerFiber.stateNode;
        }
        !inst
          ? invariant_1$1(
              false,
              'Missing owner for string ref %s. This error is likely caused by a bug in React. Please file an issue.',
              mixedRef
            )
          : void 0;
        var stringRef = '' + mixedRef;
        // Check if previous string ref matches new string ref
        if (
          current !== null &&
          current.ref !== null &&
          current.ref._stringRef === stringRef
        ) {
          return current.ref;
        }
        var ref = function (value) {
          var refs = inst.refs === emptyObject_1 ? (inst.refs = {}) : inst.refs;
          if (value === null) {
            delete refs[stringRef];
          } else {
            refs[stringRef] = value;
          }
        };
        ref._stringRef = stringRef;
        return ref;
      } else {
        !(typeof mixedRef === 'string')
          ? invariant_1$1(false, 'Expected ref to be a function or a string.')
          : void 0;
        !element._owner
          ? invariant_1$1(
              false,
              'Element ref was specified as a string (%s) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).',
              mixedRef
            )
          : void 0;
      }
    }
    return mixedRef;
  }

  function throwOnInvalidObjectType(returnFiber, newChild) {
    if (returnFiber.type !== 'textarea') {
      var addendum = '';
      {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead.' +
          (getCurrentFiberStackAddendum$1() || '');
      }
      invariant_1$1(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        Object.prototype.toString.call(newChild) === '[object Object]'
          ? 'object with keys {' + Object.keys(newChild).join(', ') + '}'
          : newChild,
        addendum
      );
    }
  }

  function warnOnFunctionType() {
    var currentComponentErrorInfo =
      'Functions are not valid as a React child. This may happen if ' +
      'you return a Component instead of <Component /> from render. ' +
      'Or maybe you meant to call this function rather than return it.' +
      (getCurrentFiberStackAddendum$1() || '');

    if (ownerHasFunctionTypeWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasFunctionTypeWarning[currentComponentErrorInfo] = true;

    warning_1$1(
      false,
      'Functions are not valid as a React child. This may happen if ' +
        'you return a Component instead of <Component /> from render. ' +
        'Or maybe you meant to call this function rather than return it.%s',
      getCurrentFiberStackAddendum$1() || ''
    );
  }

  // This wrapper function exists because I expect to clone the code in each path
  // to be able to optimize each path individually by branching early. This needs
  // a compiler or we can do it manually. Helpers that don't need this branching
  // live outside of this function.
  function ChildReconciler(shouldClone, shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
      if (!shouldTrackSideEffects) {
        // Noop.
        return;
      }
      if (!shouldClone) {
        // When we're reconciling in place we have a work in progress copy. We
        // actually want the current copy. If there is no current copy, then we
        // don't need to track deletion side-effects.
        if (childToDelete.alternate === null) {
          return;
        }
        childToDelete = childToDelete.alternate;
      }
      // Deletions are added in reversed order so we add it to the front.
      // At this point, the return fiber's effect list is empty except for
      // deletions, so we can just append the deletion to the list. The remaining
      // effects aren't added until the complete phase. Once we implement
      // resuming, this may not be true.
      var last = returnFiber.lastEffect;
      if (last !== null) {
        last.nextEffect = childToDelete;
        returnFiber.lastEffect = childToDelete;
      } else {
        returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
      }
      childToDelete.nextEffect = null;
      childToDelete.effectTag = Deletion;
    }

    function deleteRemainingChildren(returnFiber, currentFirstChild) {
      if (!shouldTrackSideEffects) {
        // Noop.
        return null;
      }

      // TODO: For the shouldClone case, this could be micro-optimized a bit by
      // assuming that after the first child we've already added everything.
      var childToDelete = currentFirstChild;
      while (childToDelete !== null) {
        deleteChild(returnFiber, childToDelete);
        childToDelete = childToDelete.sibling;
      }
      return null;
    }

    function mapRemainingChildren(returnFiber, currentFirstChild) {
      // Add the remaining children to a temporary map so that we can find them by
      // keys quickly. Implicit (null) keys get added to this set with their index
      var existingChildren = new Map();

      var existingChild = currentFirstChild;
      while (existingChild !== null) {
        if (existingChild.key !== null) {
          existingChildren.set(existingChild.key, existingChild);
        } else {
          existingChildren.set(existingChild.index, existingChild);
        }
        existingChild = existingChild.sibling;
      }
      return existingChildren;
    }

    function useFiber(fiber, pendingProps, expirationTime) {
      // We currently set sibling to null and index to 0 here because it is easy
      // to forget to do before returning it. E.g. for the single child case.
      if (shouldClone) {
        var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
        clone.index = 0;
        clone.sibling = null;
        return clone;
      } else {
        // We override the expiration time even if it is earlier, because if
        // we're reconciling at a later time that means that this was
        // down-prioritized.
        fiber.expirationTime = expirationTime;
        fiber.effectTag = NoEffect;
        fiber.index = 0;
        fiber.sibling = null;
        fiber.pendingProps = pendingProps;
        return fiber;
      }
    }

    function placeChild(newFiber, lastPlacedIndex, newIndex) {
      newFiber.index = newIndex;
      if (!shouldTrackSideEffects) {
        // Noop.
        return lastPlacedIndex;
      }
      var current = newFiber.alternate;
      if (current !== null) {
        var oldIndex = current.index;
        if (oldIndex < lastPlacedIndex) {
          // This is a move.
          newFiber.effectTag = Placement;
          return lastPlacedIndex;
        } else {
          // This item can stay in place.
          return oldIndex;
        }
      } else {
        // This is an insertion.
        newFiber.effectTag = Placement;
        return lastPlacedIndex;
      }
    }

    function placeSingleChild(newFiber) {
      // This is simpler for the single child case. We only need to do a
      // placement for inserting new children.
      if (shouldTrackSideEffects && newFiber.alternate === null) {
        newFiber.effectTag = Placement;
      }
      return newFiber;
    }

    function updateTextNode(returnFiber, current, textContent, expirationTime) {
      if (current === null || current.tag !== HostText) {
        // Insert
        var created = createFiberFromText(
          textContent,
          returnFiber.internalContextTag,
          expirationTime
        );
        created['return'] = returnFiber;
        return created;
      } else {
        // Update
        var existing = useFiber(current, textContent, expirationTime);
        existing['return'] = returnFiber;
        return existing;
      }
    }

    function updateElement(returnFiber, current, element, expirationTime) {
      if (current !== null && current.type === element.type) {
        // Move based on index
        var existing = useFiber(current, element.props, expirationTime);
        existing.ref = coerceRef(current, element);
        existing['return'] = returnFiber;
        {
          existing._debugSource = element._source;
          existing._debugOwner = element._owner;
        }
        return existing;
      } else {
        // Insert
        var created = createFiberFromElement(
          element,
          returnFiber.internalContextTag,
          expirationTime
        );
        created.ref = coerceRef(current, element);
        created['return'] = returnFiber;
        return created;
      }
    }

    function updateCall(returnFiber, current, call, expirationTime) {
      // TODO: Should this also compare handler to determine whether to reuse?
      if (current === null || current.tag !== CallComponent) {
        // Insert
        var created = createFiberFromCall(
          call,
          returnFiber.internalContextTag,
          expirationTime
        );
        created['return'] = returnFiber;
        return created;
      } else {
        // Move based on index
        var existing = useFiber(current, call, expirationTime);
        existing['return'] = returnFiber;
        return existing;
      }
    }

    function updateReturn(returnFiber, current, returnNode, expirationTime) {
      if (current === null || current.tag !== ReturnComponent) {
        // Insert
        var created = createFiberFromReturn(
          returnNode,
          returnFiber.internalContextTag,
          expirationTime
        );
        created.type = returnNode.value;
        created['return'] = returnFiber;
        return created;
      } else {
        // Move based on index
        var existing = useFiber(current, null, expirationTime);
        existing.type = returnNode.value;
        existing['return'] = returnFiber;
        return existing;
      }
    }

    function updatePortal(returnFiber, current, portal, expirationTime) {
      if (
        current === null ||
        current.tag !== HostPortal ||
        current.stateNode.containerInfo !== portal.containerInfo ||
        current.stateNode.implementation !== portal.implementation
      ) {
        // Insert
        var created = createFiberFromPortal(
          portal,
          returnFiber.internalContextTag,
          expirationTime
        );
        created['return'] = returnFiber;
        return created;
      } else {
        // Update
        var existing = useFiber(current, portal.children || [], expirationTime);
        existing['return'] = returnFiber;
        return existing;
      }
    }

    function updateFragment(
      returnFiber,
      current,
      fragment,
      expirationTime,
      key
    ) {
      if (current === null || current.tag !== Fragment) {
        // Insert
        var created = createFiberFromFragment(
          fragment,
          returnFiber.internalContextTag,
          expirationTime,
          key
        );
        created['return'] = returnFiber;
        return created;
      } else {
        // Update
        var existing = useFiber(current, fragment, expirationTime);
        existing['return'] = returnFiber;
        return existing;
      }
    }

    function createChild(returnFiber, newChild, expirationTime) {
      if (typeof newChild === 'string' || typeof newChild === 'number') {
        // Text nodes don't have keys. If the previous node is implicitly keyed
        // we can continue to replace it without aborting even if it is not a text
        // node.
        var created = createFiberFromText(
          '' + newChild,
          returnFiber.internalContextTag,
          expirationTime
        );
        created['return'] = returnFiber;
        return created;
      }

      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              var _created = createFiberFromFragment(
                newChild.props.children,
                returnFiber.internalContextTag,
                expirationTime,
                newChild.key
              );
              _created['return'] = returnFiber;
              return _created;
            } else {
              var _created2 = createFiberFromElement(
                newChild,
                returnFiber.internalContextTag,
                expirationTime
              );
              _created2.ref = coerceRef(null, newChild);
              _created2['return'] = returnFiber;
              return _created2;
            }
          }

          case REACT_CALL_TYPE: {
            var _created3 = createFiberFromCall(
              newChild,
              returnFiber.internalContextTag,
              expirationTime
            );
            _created3['return'] = returnFiber;
            return _created3;
          }

          case REACT_RETURN_TYPE: {
            var _created4 = createFiberFromReturn(
              newChild,
              returnFiber.internalContextTag,
              expirationTime
            );
            _created4.type = newChild.value;
            _created4['return'] = returnFiber;
            return _created4;
          }

          case REACT_PORTAL_TYPE: {
            var _created5 = createFiberFromPortal(
              newChild,
              returnFiber.internalContextTag,
              expirationTime
            );
            _created5['return'] = returnFiber;
            return _created5;
          }
        }

        if (isArray$1(newChild) || getIteratorFn(newChild)) {
          var _created6 = createFiberFromFragment(
            newChild,
            returnFiber.internalContextTag,
            expirationTime,
            null
          );
          _created6['return'] = returnFiber;
          return _created6;
        }

        throwOnInvalidObjectType(returnFiber, newChild);
      }

      {
        if (typeof newChild === 'function') {
          warnOnFunctionType();
        }
      }

      return null;
    }

    function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
      // Update the fiber if the keys match, otherwise return null.

      var key = oldFiber !== null ? oldFiber.key : null;

      if (typeof newChild === 'string' || typeof newChild === 'number') {
        // Text nodes don't have keys. If the previous node is implicitly keyed
        // we can continue to replace it without aborting even if it is not a text
        // node.
        if (key !== null) {
          return null;
        }
        return updateTextNode(
          returnFiber,
          oldFiber,
          '' + newChild,
          expirationTime
        );
      }

      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            if (newChild.key === key) {
              if (newChild.type === REACT_FRAGMENT_TYPE) {
                return updateFragment(
                  returnFiber,
                  oldFiber,
                  newChild.props.children,
                  expirationTime,
                  key
                );
              }
              return updateElement(
                returnFiber,
                oldFiber,
                newChild,
                expirationTime
              );
            } else {
              return null;
            }
          }

          case REACT_CALL_TYPE: {
            if (newChild.key === key) {
              return updateCall(
                returnFiber,
                oldFiber,
                newChild,
                expirationTime
              );
            } else {
              return null;
            }
          }

          case REACT_RETURN_TYPE: {
            // Returns don't have keys. If the previous node is implicitly keyed
            // we can continue to replace it without aborting even if it is not a
            // yield.
            if (key === null) {
              return updateReturn(
                returnFiber,
                oldFiber,
                newChild,
                expirationTime
              );
            } else {
              return null;
            }
          }

          case REACT_PORTAL_TYPE: {
            if (newChild.key === key) {
              return updatePortal(
                returnFiber,
                oldFiber,
                newChild,
                expirationTime
              );
            } else {
              return null;
            }
          }
        }

        if (isArray$1(newChild) || getIteratorFn(newChild)) {
          if (key !== null) {
            return null;
          }

          return updateFragment(
            returnFiber,
            oldFiber,
            newChild,
            expirationTime,
            null
          );
        }

        throwOnInvalidObjectType(returnFiber, newChild);
      }

      {
        if (typeof newChild === 'function') {
          warnOnFunctionType();
        }
      }

      return null;
    }

    function updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChild,
      expirationTime
    ) {
      if (typeof newChild === 'string' || typeof newChild === 'number') {
        // Text nodes don't have keys, so we neither have to check the old nor
        // new node for the key. If both are text nodes, they match.
        var matchedFiber = existingChildren.get(newIdx) || null;
        return updateTextNode(
          returnFiber,
          matchedFiber,
          '' + newChild,
          expirationTime
        );
      }

      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            var _matchedFiber =
              existingChildren.get(
                newChild.key === null ? newIdx : newChild.key
              ) || null;
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              return updateFragment(
                returnFiber,
                _matchedFiber,
                newChild.props.children,
                expirationTime,
                newChild.key
              );
            }
            return updateElement(
              returnFiber,
              _matchedFiber,
              newChild,
              expirationTime
            );
          }

          case REACT_CALL_TYPE: {
            var _matchedFiber2 =
              existingChildren.get(
                newChild.key === null ? newIdx : newChild.key
              ) || null;
            return updateCall(
              returnFiber,
              _matchedFiber2,
              newChild,
              expirationTime
            );
          }

          case REACT_RETURN_TYPE: {
            // Returns don't have keys, so we neither have to check the old nor
            // new node for the key. If both are returns, they match.
            var _matchedFiber3 = existingChildren.get(newIdx) || null;
            return updateReturn(
              returnFiber,
              _matchedFiber3,
              newChild,
              expirationTime
            );
          }

          case REACT_PORTAL_TYPE: {
            var _matchedFiber4 =
              existingChildren.get(
                newChild.key === null ? newIdx : newChild.key
              ) || null;
            return updatePortal(
              returnFiber,
              _matchedFiber4,
              newChild,
              expirationTime
            );
          }
        }

        if (isArray$1(newChild) || getIteratorFn(newChild)) {
          var _matchedFiber5 = existingChildren.get(newIdx) || null;
          return updateFragment(
            returnFiber,
            _matchedFiber5,
            newChild,
            expirationTime,
            null
          );
        }

        throwOnInvalidObjectType(returnFiber, newChild);
      }

      {
        if (typeof newChild === 'function') {
          warnOnFunctionType();
        }
      }

      return null;
    }

    /**
     * Warns if there is a duplicate or missing key
     */
    function warnOnInvalidKey(child, knownKeys) {
      {
        if (typeof child !== 'object' || child === null) {
          return knownKeys;
        }
        switch (child.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_CALL_TYPE:
          case REACT_PORTAL_TYPE:
            warnForMissingKey(child);
            var key = child.key;
            if (typeof key !== 'string') {
              break;
            }
            if (knownKeys === null) {
              knownKeys = new Set();
              knownKeys.add(key);
              break;
            }
            if (!knownKeys.has(key)) {
              knownKeys.add(key);
              break;
            }
            warning_1$1(
              false,
              'Encountered two children with the same key, `%s`. ' +
                'Keys should be unique so that components maintain their identity ' +
                'across updates. Non-unique keys may cause children to be ' +
                'duplicated and/or omitted — the behavior is unsupported and ' +
                'could change in a future version.%s',
              key,
              getCurrentFiberStackAddendum$1()
            );
            break;
          default:
            break;
        }
      }
      return knownKeys;
    }

    function reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChildren,
      expirationTime
    ) {
      // This algorithm can't optimize by searching from boths ends since we
      // don't have backpointers on fibers. I'm trying to see how far we can get
      // with that model. If it ends up not being worth the tradeoffs, we can
      // add it later.

      // Even with a two ended optimization, we'd want to optimize for the case
      // where there are few changes and brute force the comparison instead of
      // going for the Map. It'd like to explore hitting that path first in
      // forward-only mode and only go for the Map once we notice that we need
      // lots of look ahead. This doesn't handle reversal as well as two ended
      // search but that's unusual. Besides, for the two ended optimization to
      // work on Iterables, we'd need to copy the whole set.

      // In this first iteration, we'll just live with hitting the bad case
      // (adding everything to a Map) in for every insert/move.

      // If you change this code, also update reconcileChildrenIterator() which
      // uses the same algorithm.

      {
        // First, validate keys.
        var knownKeys = null;
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];
          knownKeys = warnOnInvalidKey(child, knownKeys);
        }
      }

      var resultingFirstChild = null;
      var previousNewFiber = null;

      var oldFiber = currentFirstChild;
      var lastPlacedIndex = 0;
      var newIdx = 0;
      var nextOldFiber = null;
      for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
        if (oldFiber.index > newIdx) {
          nextOldFiber = oldFiber;
          oldFiber = null;
        } else {
          nextOldFiber = oldFiber.sibling;
        }
        var newFiber = updateSlot(
          returnFiber,
          oldFiber,
          newChildren[newIdx],
          expirationTime
        );
        if (newFiber === null) {
          // TODO: This breaks on empty slots like null children. That's
          // unfortunate because it triggers the slow path all the time. We need
          // a better way to communicate whether this was a miss or null,
          // boolean, undefined, etc.
          if (oldFiber === null) {
            oldFiber = nextOldFiber;
          }
          break;
        }
        if (shouldTrackSideEffects) {
          if (oldFiber && newFiber.alternate === null) {
            // We matched the slot, but we didn't reuse the existing fiber, so we
            // need to delete the existing child.
            deleteChild(returnFiber, oldFiber);
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          // TODO: Defer siblings if we're not at the right index for this slot.
          // I.e. if we had null values before, then we want to defer this
          // for each null value. However, we also don't want to call updateSlot
          // with the previous one.
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }

      if (newIdx === newChildren.length) {
        // We've reached the end of the new children. We can delete the rest.
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
      }

      if (oldFiber === null) {
        // If we don't have any more existing children we can choose a fast path
        // since the rest will all be insertions.
        for (; newIdx < newChildren.length; newIdx++) {
          var _newFiber = createChild(
            returnFiber,
            newChildren[newIdx],
            expirationTime
          );
          if (!_newFiber) {
            continue;
          }
          lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            // TODO: Move out of the loop. This only happens for the first run.
            resultingFirstChild = _newFiber;
          } else {
            previousNewFiber.sibling = _newFiber;
          }
          previousNewFiber = _newFiber;
        }
        return resultingFirstChild;
      }

      // Add all children to a key map for quick lookups.
      var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

      // Keep scanning and use the map to restore deleted items as moves.
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber2 = updateFromMap(
          existingChildren,
          returnFiber,
          newIdx,
          newChildren[newIdx],
          expirationTime
        );
        if (_newFiber2) {
          if (shouldTrackSideEffects) {
            if (_newFiber2.alternate !== null) {
              // The new fiber is a work in progress, but if there exists a
              // current, that means that we reused the fiber. We need to delete
              // it from the child list so that we don't add it to the deletion
              // list.
              existingChildren['delete'](
                _newFiber2.key === null ? newIdx : _newFiber2.key
              );
            }
          }
          lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = _newFiber2;
          } else {
            previousNewFiber.sibling = _newFiber2;
          }
          previousNewFiber = _newFiber2;
        }
      }

      if (shouldTrackSideEffects) {
        // Any existing children that weren't consumed above were deleted. We need
        // to add them to the deletion list.
        existingChildren.forEach(function (child) {
          return deleteChild(returnFiber, child);
        });
      }

      return resultingFirstChild;
    }

    function reconcileChildrenIterator(
      returnFiber,
      currentFirstChild,
      newChildrenIterable,
      expirationTime
    ) {
      // This is the same implementation as reconcileChildrenArray(),
      // but using the iterator instead.

      var iteratorFn = getIteratorFn(newChildrenIterable);
      !(typeof iteratorFn === 'function')
        ? invariant_1$1(
            false,
            'An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;

      {
        // Warn about using Maps as children
        if (typeof newChildrenIterable.entries === 'function') {
          var possibleMap = newChildrenIterable;
          if (possibleMap.entries === iteratorFn) {
            warning_1$1(
              didWarnAboutMaps,
              'Using Maps as children is unsupported and will likely yield ' +
                'unexpected results. Convert it to a sequence/iterable of keyed ' +
                'ReactElements instead.%s',
              getCurrentFiberStackAddendum$1()
            );
            didWarnAboutMaps = true;
          }
        }

        // First, validate keys.
        // We'll get a different iterator later for the main pass.
        var _newChildren = iteratorFn.call(newChildrenIterable);
        if (_newChildren) {
          var knownKeys = null;
          var _step = _newChildren.next();
          for (; !_step.done; _step = _newChildren.next()) {
            var child = _step.value;
            knownKeys = warnOnInvalidKey(child, knownKeys);
          }
        }
      }

      var newChildren = iteratorFn.call(newChildrenIterable);
      !(newChildren != null)
        ? invariant_1$1(false, 'An iterable object provided no iterator.')
        : void 0;

      var resultingFirstChild = null;
      var previousNewFiber = null;

      var oldFiber = currentFirstChild;
      var lastPlacedIndex = 0;
      var newIdx = 0;
      var nextOldFiber = null;

      var step = newChildren.next();
      for (
        ;
        oldFiber !== null && !step.done;
        newIdx++, step = newChildren.next()
      ) {
        if (oldFiber.index > newIdx) {
          nextOldFiber = oldFiber;
          oldFiber = null;
        } else {
          nextOldFiber = oldFiber.sibling;
        }
        var newFiber = updateSlot(
          returnFiber,
          oldFiber,
          step.value,
          expirationTime
        );
        if (newFiber === null) {
          // TODO: This breaks on empty slots like null children. That's
          // unfortunate because it triggers the slow path all the time. We need
          // a better way to communicate whether this was a miss or null,
          // boolean, undefined, etc.
          if (!oldFiber) {
            oldFiber = nextOldFiber;
          }
          break;
        }
        if (shouldTrackSideEffects) {
          if (oldFiber && newFiber.alternate === null) {
            // We matched the slot, but we didn't reuse the existing fiber, so we
            // need to delete the existing child.
            deleteChild(returnFiber, oldFiber);
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          // TODO: Defer siblings if we're not at the right index for this slot.
          // I.e. if we had null values before, then we want to defer this
          // for each null value. However, we also don't want to call updateSlot
          // with the previous one.
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }

      if (step.done) {
        // We've reached the end of the new children. We can delete the rest.
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
      }

      if (oldFiber === null) {
        // If we don't have any more existing children we can choose a fast path
        // since the rest will all be insertions.
        for (; !step.done; newIdx++, step = newChildren.next()) {
          var _newFiber3 = createChild(returnFiber, step.value, expirationTime);
          if (_newFiber3 === null) {
            continue;
          }
          lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            // TODO: Move out of the loop. This only happens for the first run.
            resultingFirstChild = _newFiber3;
          } else {
            previousNewFiber.sibling = _newFiber3;
          }
          previousNewFiber = _newFiber3;
        }
        return resultingFirstChild;
      }

      // Add all children to a key map for quick lookups.
      var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

      // Keep scanning and use the map to restore deleted items as moves.
      for (; !step.done; newIdx++, step = newChildren.next()) {
        var _newFiber4 = updateFromMap(
          existingChildren,
          returnFiber,
          newIdx,
          step.value,
          expirationTime
        );
        if (_newFiber4 !== null) {
          if (shouldTrackSideEffects) {
            if (_newFiber4.alternate !== null) {
              // The new fiber is a work in progress, but if there exists a
              // current, that means that we reused the fiber. We need to delete
              // it from the child list so that we don't add it to the deletion
              // list.
              existingChildren['delete'](
                _newFiber4.key === null ? newIdx : _newFiber4.key
              );
            }
          }
          lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = _newFiber4;
          } else {
            previousNewFiber.sibling = _newFiber4;
          }
          previousNewFiber = _newFiber4;
        }
      }

      if (shouldTrackSideEffects) {
        // Any existing children that weren't consumed above were deleted. We need
        // to add them to the deletion list.
        existingChildren.forEach(function (child) {
          return deleteChild(returnFiber, child);
        });
      }

      return resultingFirstChild;
    }

    function reconcileSingleTextNode(
      returnFiber,
      currentFirstChild,
      textContent,
      expirationTime
    ) {
      // There's no need to check for keys on text nodes since we don't have a
      // way to define them.
      if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
        // We already have an existing node so let's just update it and delete
        // the rest.
        deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
        var existing = useFiber(currentFirstChild, textContent, expirationTime);
        existing['return'] = returnFiber;
        return existing;
      }
      // The existing first child is not a text node so we need to create one
      // and delete the existing ones.
      deleteRemainingChildren(returnFiber, currentFirstChild);
      var created = createFiberFromText(
        textContent,
        returnFiber.internalContextTag,
        expirationTime
      );
      created['return'] = returnFiber;
      return created;
    }

    function reconcileSingleElement(
      returnFiber,
      currentFirstChild,
      element,
      expirationTime
    ) {
      var key = element.key;
      var child = currentFirstChild;
      while (child !== null) {
        // TODO: If key === null and child.key === null, then this only applies to
        // the first item in the list.
        if (child.key === key) {
          if (
            child.tag === Fragment
              ? element.type === REACT_FRAGMENT_TYPE
              : child.type === element.type
          ) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(
              child,
              element.type === REACT_FRAGMENT_TYPE
                ? element.props.children
                : element.props,
              expirationTime
            );
            existing.ref = coerceRef(child, element);
            existing['return'] = returnFiber;
            {
              existing._debugSource = element._source;
              existing._debugOwner = element._owner;
            }
            return existing;
          } else {
            deleteRemainingChildren(returnFiber, child);
            break;
          }
        } else {
          deleteChild(returnFiber, child);
        }
        child = child.sibling;
      }

      if (element.type === REACT_FRAGMENT_TYPE) {
        var created = createFiberFromFragment(
          element.props.children,
          returnFiber.internalContextTag,
          expirationTime,
          element.key
        );
        created['return'] = returnFiber;
        return created;
      } else {
        var _created7 = createFiberFromElement(
          element,
          returnFiber.internalContextTag,
          expirationTime
        );
        _created7.ref = coerceRef(currentFirstChild, element);
        _created7['return'] = returnFiber;
        return _created7;
      }
    }

    function reconcileSingleCall(
      returnFiber,
      currentFirstChild,
      call,
      expirationTime
    ) {
      var key = call.key;
      var child = currentFirstChild;
      while (child !== null) {
        // TODO: If key === null and child.key === null, then this only applies to
        // the first item in the list.
        if (child.key === key) {
          if (child.tag === CallComponent) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(child, call, expirationTime);
            existing['return'] = returnFiber;
            return existing;
          } else {
            deleteRemainingChildren(returnFiber, child);
            break;
          }
        } else {
          deleteChild(returnFiber, child);
        }
        child = child.sibling;
      }

      var created = createFiberFromCall(
        call,
        returnFiber.internalContextTag,
        expirationTime
      );
      created['return'] = returnFiber;
      return created;
    }

    function reconcileSingleReturn(
      returnFiber,
      currentFirstChild,
      returnNode,
      expirationTime
    ) {
      // There's no need to check for keys on yields since they're stateless.
      var child = currentFirstChild;
      if (child !== null) {
        if (child.tag === ReturnComponent) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, null, expirationTime);
          existing.type = returnNode.value;
          existing['return'] = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
        }
      }

      var created = createFiberFromReturn(
        returnNode,
        returnFiber.internalContextTag,
        expirationTime
      );
      created.type = returnNode.value;
      created['return'] = returnFiber;
      return created;
    }

    function reconcileSinglePortal(
      returnFiber,
      currentFirstChild,
      portal,
      expirationTime
    ) {
      var key = portal.key;
      var child = currentFirstChild;
      while (child !== null) {
        // TODO: If key === null and child.key === null, then this only applies to
        // the first item in the list.
        if (child.key === key) {
          if (
            child.tag === HostPortal &&
            child.stateNode.containerInfo === portal.containerInfo &&
            child.stateNode.implementation === portal.implementation
          ) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(
              child,
              portal.children || [],
              expirationTime
            );
            existing['return'] = returnFiber;
            return existing;
          } else {
            deleteRemainingChildren(returnFiber, child);
            break;
          }
        } else {
          deleteChild(returnFiber, child);
        }
        child = child.sibling;
      }

      var created = createFiberFromPortal(
        portal,
        returnFiber.internalContextTag,
        expirationTime
      );
      created['return'] = returnFiber;
      return created;
    }

    // This API will tag the children with the side-effect of the reconciliation
    // itself. They will be added to the side-effect list as we pass through the
    // children and the parent.
    function reconcileChildFibers(
      returnFiber,
      currentFirstChild,
      newChild,
      expirationTime
    ) {
      // This function is not recursive.
      // If the top level item is an array, we treat it as a set of children,
      // not as a fragment. Nested arrays on the other hand will be treated as
      // fragment nodes. Recursion happens at the normal flow.

      // Handle top level unkeyed fragments as if they were arrays.
      // This leads to an ambiguity between <>{[...]}</> and <>...</>.
      // We treat the ambiguous cases above the same.
      if (
        enableReactFragment &&
        typeof newChild === 'object' &&
        newChild !== null &&
        newChild.type === REACT_FRAGMENT_TYPE &&
        newChild.key === null
      ) {
        newChild = newChild.props.children;
      }

      // Handle object types
      var isObject = typeof newChild === 'object' && newChild !== null;

      if (isObject) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return placeSingleChild(
              reconcileSingleElement(
                returnFiber,
                currentFirstChild,
                newChild,
                expirationTime
              )
            );

          case REACT_CALL_TYPE:
            return placeSingleChild(
              reconcileSingleCall(
                returnFiber,
                currentFirstChild,
                newChild,
                expirationTime
              )
            );
          case REACT_RETURN_TYPE:
            return placeSingleChild(
              reconcileSingleReturn(
                returnFiber,
                currentFirstChild,
                newChild,
                expirationTime
              )
            );
          case REACT_PORTAL_TYPE:
            return placeSingleChild(
              reconcileSinglePortal(
                returnFiber,
                currentFirstChild,
                newChild,
                expirationTime
              )
            );
        }
      }

      if (typeof newChild === 'string' || typeof newChild === 'number') {
        return placeSingleChild(
          reconcileSingleTextNode(
            returnFiber,
            currentFirstChild,
            '' + newChild,
            expirationTime
          )
        );
      }

      if (isArray$1(newChild)) {
        return reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild,
          expirationTime
        );
      }

      if (getIteratorFn(newChild)) {
        return reconcileChildrenIterator(
          returnFiber,
          currentFirstChild,
          newChild,
          expirationTime
        );
      }

      if (isObject) {
        throwOnInvalidObjectType(returnFiber, newChild);
      }

      {
        if (typeof newChild === 'function') {
          warnOnFunctionType();
        }
      }
      if (typeof newChild === 'undefined') {
        // If the new child is undefined, and the return fiber is a composite
        // component, throw an error. If Fiber return types are disabled,
        // we already threw above.
        switch (returnFiber.tag) {
          case ClassComponent: {
            {
              var instance = returnFiber.stateNode;
              if (instance.render._isMockFunction) {
                // We allow auto-mocks to proceed as if they're returning null.
                break;
              }
            }
          }
          // Intentionally fall through to the next case, which handles both
          // functions and classes
          // eslint-disable-next-lined no-fallthrough
          case FunctionalComponent: {
            var Component = returnFiber.type;
            invariant_1$1(
              false,
              '%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.',
              Component.displayName || Component.name || 'Component'
            );
          }
        }
      }

      // Remaining cases are all treated as empty.
      return deleteRemainingChildren(returnFiber, currentFirstChild);
    }

    return reconcileChildFibers;
  }

  var reconcileChildFibers = ChildReconciler(true, true);

  var reconcileChildFibersInPlace = ChildReconciler(false, true);

  var mountChildFibersInPlace = ChildReconciler(false, false);

  function cloneChildFibers(current, workInProgress) {
    !(current === null || workInProgress.child === current.child)
      ? invariant_1$1(false, 'Resuming work not yet implemented.')
      : void 0;

    if (workInProgress.child === null) {
      return;
    }

    var currentChild = workInProgress.child;
    var newChild = createWorkInProgress(
      currentChild,
      currentChild.pendingProps,
      currentChild.expirationTime
    );
    workInProgress.child = newChild;

    newChild['return'] = workInProgress;
    while (currentChild.sibling !== null) {
      currentChild = currentChild.sibling;
      newChild = newChild.sibling = createWorkInProgress(
        currentChild,
        currentChild.pendingProps,
        currentChild.expirationTime
      );
      newChild['return'] = workInProgress;
    }
    newChild.sibling = null;
  }

  {
    var warnedAboutStatelessRefs = {};
  }

  var ReactFiberBeginWork = function (
    config,
    hostContext,
    hydrationContext,
    scheduleWork,
    computeExpirationForFiber
  ) {
    var shouldSetTextContent = config.shouldSetTextContent,
      useSyncScheduling = config.useSyncScheduling,
      shouldDeprioritizeSubtree = config.shouldDeprioritizeSubtree;
    var pushHostContext = hostContext.pushHostContext,
      pushHostContainer = hostContext.pushHostContainer;
    var enterHydrationState = hydrationContext.enterHydrationState,
      resetHydrationState = hydrationContext.resetHydrationState,
      tryToClaimNextHydratableInstance =
        hydrationContext.tryToClaimNextHydratableInstance;

    var _ReactFiberClassCompo = ReactFiberClassComponent(
        scheduleWork,
        computeExpirationForFiber,
        memoizeProps,
        memoizeState
      ),
      adoptClassInstance = _ReactFiberClassCompo.adoptClassInstance,
      constructClassInstance = _ReactFiberClassCompo.constructClassInstance,
      mountClassInstance = _ReactFiberClassCompo.mountClassInstance,
      updateClassInstance = _ReactFiberClassCompo.updateClassInstance;

    // TODO: Remove this and use reconcileChildrenAtExpirationTime directly.

    function reconcileChildren(current, workInProgress, nextChildren) {
      reconcileChildrenAtExpirationTime(
        current,
        workInProgress,
        nextChildren,
        workInProgress.expirationTime
      );
    }

    function reconcileChildrenAtExpirationTime(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime
    ) {
      if (current === null) {
        // If this is a fresh new component that hasn't been rendered yet, we
        // won't update its child set by applying minimal side-effects. Instead,
        // we will add them all to the child before it gets rendered. That means
        // we can optimize this reconciliation pass by not tracking side-effects.
        workInProgress.child = mountChildFibersInPlace(
          workInProgress,
          workInProgress.child,
          nextChildren,
          renderExpirationTime
        );
      } else if (current.child === workInProgress.child) {
        // If the current child is the same as the work in progress, it means that
        // we haven't yet started any work on these children. Therefore, we use
        // the clone algorithm to create a copy of all the current children.

        // If we had any progressed work already, that is invalid at this point so
        // let's throw it out.
        workInProgress.child = reconcileChildFibers(
          workInProgress,
          workInProgress.child,
          nextChildren,
          renderExpirationTime
        );
      } else {
        // If, on the other hand, it is already using a clone, that means we've
        // already begun some work on this tree and we can continue where we left
        // off by reconciling against the existing children.
        workInProgress.child = reconcileChildFibersInPlace(
          workInProgress,
          workInProgress.child,
          nextChildren,
          renderExpirationTime
        );
      }
    }

    function updateFragment(current, workInProgress) {
      var nextChildren = workInProgress.pendingProps;
      if (hasContextChanged()) {
        // Normally we can bail out on props equality but if context has changed
        // we don't do the bailout and we have to reuse existing props instead.
        if (nextChildren === null) {
          nextChildren = workInProgress.memoizedProps;
        }
      } else if (
        nextChildren === null ||
        workInProgress.memoizedProps === nextChildren
      ) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }
      reconcileChildren(current, workInProgress, nextChildren);
      memoizeProps(workInProgress, nextChildren);
      return workInProgress.child;
    }

    function markRef(current, workInProgress) {
      var ref = workInProgress.ref;
      if (ref !== null && (!current || current.ref !== ref)) {
        // Schedule a Ref effect
        workInProgress.effectTag |= Ref;
      }
    }

    function updateFunctionalComponent(current, workInProgress) {
      var fn = workInProgress.type;
      var nextProps = workInProgress.pendingProps;

      var memoizedProps = workInProgress.memoizedProps;
      if (hasContextChanged()) {
        // Normally we can bail out on props equality but if context has changed
        // we don't do the bailout and we have to reuse existing props instead.
        if (nextProps === null) {
          nextProps = memoizedProps;
        }
      } else {
        if (nextProps === null || memoizedProps === nextProps) {
          return bailoutOnAlreadyFinishedWork(current, workInProgress);
        }
        // TODO: consider bringing fn.shouldComponentUpdate() back.
        // It used to be here.
      }

      var unmaskedContext = getUnmaskedContext(workInProgress);
      var context = getMaskedContext(workInProgress, unmaskedContext);

      var nextChildren;

      {
        ReactCurrentOwner.current = workInProgress;
        ReactDebugCurrentFiber.setCurrentPhase('render');
        nextChildren = fn(nextProps, context);
        ReactDebugCurrentFiber.setCurrentPhase(null);
      }
      // React DevTools reads this flag.
      workInProgress.effectTag |= PerformedWork;
      reconcileChildren(current, workInProgress, nextChildren);
      memoizeProps(workInProgress, nextProps);
      return workInProgress.child;
    }

    function updateClassComponent(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      // Push context providers early to prevent context stack mismatches.
      // During mounting we don't know the child context yet as the instance doesn't exist.
      // We will invalidate the child context in finishClassComponent() right after rendering.
      var hasContext = pushContextProvider(workInProgress);

      var shouldUpdate = void 0;
      if (current === null) {
        if (!workInProgress.stateNode) {
          // In the initial pass we might need to construct the instance.
          constructClassInstance(workInProgress, workInProgress.pendingProps);
          mountClassInstance(workInProgress, renderExpirationTime);
          shouldUpdate = true;
        } else {
          invariant_1$1(false, 'Resuming work not yet implemented.');
          // In a resume, we'll already have an instance we can reuse.
          // shouldUpdate = resumeMountClassInstance(workInProgress, renderExpirationTime);
        }
      } else {
        shouldUpdate = updateClassInstance(
          current,
          workInProgress,
          renderExpirationTime
        );
      }
      return finishClassComponent(
        current,
        workInProgress,
        shouldUpdate,
        hasContext
      );
    }

    function finishClassComponent(
      current,
      workInProgress,
      shouldUpdate,
      hasContext
    ) {
      // Refs should update even if shouldComponentUpdate returns false
      markRef(current, workInProgress);

      if (!shouldUpdate) {
        // Context providers should defer to sCU for rendering
        if (hasContext) {
          invalidateContextProvider(workInProgress, false);
        }

        return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }

      var instance = workInProgress.stateNode;

      // Rerender
      ReactCurrentOwner.current = workInProgress;
      var nextChildren = void 0;
      {
        ReactDebugCurrentFiber.setCurrentPhase('render');
        nextChildren = instance.render();
        ReactDebugCurrentFiber.setCurrentPhase(null);
      }
      // React DevTools reads this flag.
      workInProgress.effectTag |= PerformedWork;
      reconcileChildren(current, workInProgress, nextChildren);
      // Memoize props and state using the values we just used to render.
      // TODO: Restructure so we never read values from the instance.
      memoizeState(workInProgress, instance.state);
      memoizeProps(workInProgress, instance.props);

      // The context might have changed so we need to recalculate it.
      if (hasContext) {
        invalidateContextProvider(workInProgress, true);
      }

      return workInProgress.child;
    }

    function pushHostRootContext(workInProgress) {
      var root = workInProgress.stateNode;
      if (root.pendingContext) {
        pushTopLevelContextObject(
          workInProgress,
          root.pendingContext,
          root.pendingContext !== root.context
        );
      } else if (root.context) {
        // Should always be set
        pushTopLevelContextObject(workInProgress, root.context, false);
      }
      pushHostContainer(workInProgress, root.containerInfo);
    }

    function updateHostRoot(current, workInProgress, renderExpirationTime) {
      pushHostRootContext(workInProgress);
      var updateQueue = workInProgress.updateQueue;
      if (updateQueue !== null) {
        var prevState = workInProgress.memoizedState;
        var state = processUpdateQueue(
          current,
          workInProgress,
          updateQueue,
          null,
          null,
          renderExpirationTime
        );
        if (prevState === state) {
          // If the state is the same as before, that's a bailout because we had
          // no work that expires at this time.
          resetHydrationState();
          return bailoutOnAlreadyFinishedWork(current, workInProgress);
        }
        var element = state.element;
        var root = workInProgress.stateNode;
        if (
          (current === null || current.child === null) &&
          root.hydrate &&
          enterHydrationState(workInProgress)
        ) {
          // If we don't have any current children this might be the first pass.
          // We always try to hydrate. If this isn't a hydration pass there won't
          // be any children to hydrate which is effectively the same thing as
          // not hydrating.

          // This is a bit of a hack. We track the host root as a placement to
          // know that we're currently in a mounting state. That way isMounted
          // works as expected. We must reset this before committing.
          // TODO: Delete this when we delete isMounted and findDOMNode.
          workInProgress.effectTag |= Placement;

          // Ensure that children mount into this root without tracking
          // side-effects. This ensures that we don't store Placement effects on
          // nodes that will be hydrated.
          workInProgress.child = mountChildFibersInPlace(
            workInProgress,
            workInProgress.child,
            element,
            renderExpirationTime
          );
        } else {
          // Otherwise reset hydration state in case we aborted and resumed another
          // root.
          resetHydrationState();
          reconcileChildren(current, workInProgress, element);
        }
        memoizeState(workInProgress, state);
        return workInProgress.child;
      }
      resetHydrationState();
      // If there is no update queue, that's a bailout because the root has no props.
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    function updateHostComponent(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      pushHostContext(workInProgress);

      if (current === null) {
        tryToClaimNextHydratableInstance(workInProgress);
      }

      var type = workInProgress.type;
      var memoizedProps = workInProgress.memoizedProps;
      var nextProps = workInProgress.pendingProps;
      if (nextProps === null) {
        nextProps = memoizedProps;
        !(nextProps !== null)
          ? invariant_1$1(
              false,
              'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.'
            )
          : void 0;
      }
      var prevProps = current !== null ? current.memoizedProps : null;

      if (hasContextChanged()) {
        // Normally we can bail out on props equality but if context has changed
        // we don't do the bailout and we have to reuse existing props instead.
      } else if (nextProps === null || memoizedProps === nextProps) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }

      var nextChildren = nextProps.children;
      var isDirectTextChild = shouldSetTextContent(type, nextProps);

      if (isDirectTextChild) {
        // We special case a direct text child of a host node. This is a common
        // case. We won't handle it as a reified child. We will instead handle
        // this in the host environment that also have access to this prop. That
        // avoids allocating another HostText fiber and traversing it.
        nextChildren = null;
      } else if (prevProps && shouldSetTextContent(type, prevProps)) {
        // If we're switching from a direct text child to a normal child, or to
        // empty, we need to schedule the text content to be reset.
        workInProgress.effectTag |= ContentReset;
      }

      markRef(current, workInProgress);

      // Check the host config to see if the children are offscreen/hidden.
      if (
        renderExpirationTime !== Never &&
        !useSyncScheduling &&
        shouldDeprioritizeSubtree(type, nextProps)
      ) {
        // Down-prioritize the children.
        workInProgress.expirationTime = Never;
        // Bailout and come back to this fiber later.
        return null;
      }

      reconcileChildren(current, workInProgress, nextChildren);
      memoizeProps(workInProgress, nextProps);
      return workInProgress.child;
    }

    function updateHostText(current, workInProgress) {
      if (current === null) {
        tryToClaimNextHydratableInstance(workInProgress);
      }
      var nextProps = workInProgress.pendingProps;
      if (nextProps === null) {
        nextProps = workInProgress.memoizedProps;
      }
      memoizeProps(workInProgress, nextProps);
      // Nothing to do here. This is terminal. We'll do the completion step
      // immediately after.
      return null;
    }

    function mountIndeterminateComponent(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      !(current === null)
        ? invariant_1$1(
            false,
            'An indeterminate component should never have mounted. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      var fn = workInProgress.type;
      var props = workInProgress.pendingProps;
      var unmaskedContext = getUnmaskedContext(workInProgress);
      var context = getMaskedContext(workInProgress, unmaskedContext);

      var value;

      {
        if (fn.prototype && typeof fn.prototype.render === 'function') {
          var componentName = getComponentName(workInProgress);
          warning_1$1(
            false,
            "The <%s /> component appears to have a render method, but doesn't extend React.Component. " +
              'This is likely to cause errors. Change %s to extend React.Component instead.',
            componentName,
            componentName
          );
        }
        ReactCurrentOwner.current = workInProgress;
        value = fn(props, context);
      }
      // React DevTools reads this flag.
      workInProgress.effectTag |= PerformedWork;

      if (
        typeof value === 'object' &&
        value !== null &&
        typeof value.render === 'function'
      ) {
        // Proceed under the assumption that this is a class instance
        workInProgress.tag = ClassComponent;

        // Push context providers early to prevent context stack mismatches.
        // During mounting we don't know the child context yet as the instance doesn't exist.
        // We will invalidate the child context in finishClassComponent() right after rendering.
        var hasContext = pushContextProvider(workInProgress);
        adoptClassInstance(workInProgress, value);
        mountClassInstance(workInProgress, renderExpirationTime);
        return finishClassComponent(current, workInProgress, true, hasContext);
      } else {
        // Proceed under the assumption that this is a functional component
        workInProgress.tag = FunctionalComponent;
        {
          var Component = workInProgress.type;

          if (Component) {
            warning_1$1(
              !Component.childContextTypes,
              '%s(...): childContextTypes cannot be defined on a functional component.',
              Component.displayName || Component.name || 'Component'
            );
          }
          if (workInProgress.ref !== null) {
            var info = '';
            var ownerName = ReactDebugCurrentFiber.getCurrentFiberOwnerName();
            if (ownerName) {
              info += '\n\nCheck the render method of `' + ownerName + '`.';
            }

            var warningKey = ownerName || workInProgress._debugID || '';
            var debugSource = workInProgress._debugSource;
            if (debugSource) {
              warningKey = debugSource.fileName + ':' + debugSource.lineNumber;
            }
            if (!warnedAboutStatelessRefs[warningKey]) {
              warnedAboutStatelessRefs[warningKey] = true;
              warning_1$1(
                false,
                'Stateless function components cannot be given refs. ' +
                  'Attempts to access this ref will fail.%s%s',
                info,
                ReactDebugCurrentFiber.getCurrentFiberStackAddendum()
              );
            }
          }
        }
        reconcileChildren(current, workInProgress, value);
        memoizeProps(workInProgress, props);
        return workInProgress.child;
      }
    }

    function updateCallComponent(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      var nextCall = workInProgress.pendingProps;
      if (hasContextChanged()) {
        // Normally we can bail out on props equality but if context has changed
        // we don't do the bailout and we have to reuse existing props instead.
        if (nextCall === null) {
          nextCall = current && current.memoizedProps;
          !(nextCall !== null)
            ? invariant_1$1(
                false,
                'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.'
              )
            : void 0;
        }
      } else if (
        nextCall === null ||
        workInProgress.memoizedProps === nextCall
      ) {
        nextCall = workInProgress.memoizedProps;
        // TODO: When bailing out, we might need to return the stateNode instead
        // of the child. To check it for work.
        // return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }

      var nextChildren = nextCall.children;

      // The following is a fork of reconcileChildrenAtExpirationTime but using
      // stateNode to store the child.
      if (current === null) {
        workInProgress.stateNode = mountChildFibersInPlace(
          workInProgress,
          workInProgress.stateNode,
          nextChildren,
          renderExpirationTime
        );
      } else if (current.child === workInProgress.child) {
        workInProgress.stateNode = reconcileChildFibers(
          workInProgress,
          workInProgress.stateNode,
          nextChildren,
          renderExpirationTime
        );
      } else {
        workInProgress.stateNode = reconcileChildFibersInPlace(
          workInProgress,
          workInProgress.stateNode,
          nextChildren,
          renderExpirationTime
        );
      }

      memoizeProps(workInProgress, nextCall);
      // This doesn't take arbitrary time so we could synchronously just begin
      // eagerly do the work of workInProgress.child as an optimization.
      return workInProgress.stateNode;
    }

    function updatePortalComponent(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
      var nextChildren = workInProgress.pendingProps;
      if (hasContextChanged()) {
        // Normally we can bail out on props equality but if context has changed
        // we don't do the bailout and we have to reuse existing props instead.
        if (nextChildren === null) {
          nextChildren = current && current.memoizedProps;
          !(nextChildren != null)
            ? invariant_1$1(
                false,
                'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.'
              )
            : void 0;
        }
      } else if (
        nextChildren === null ||
        workInProgress.memoizedProps === nextChildren
      ) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }

      if (current === null) {
        // Portals are special because we don't append the children during mount
        // but at commit. Therefore we need to track insertions which the normal
        // flow doesn't do during mount. This doesn't happen at the root because
        // the root always starts with a "current" with a null child.
        // TODO: Consider unifying this with how the root works.
        workInProgress.child = reconcileChildFibersInPlace(
          workInProgress,
          workInProgress.child,
          nextChildren,
          renderExpirationTime
        );
        memoizeProps(workInProgress, nextChildren);
      } else {
        reconcileChildren(current, workInProgress, nextChildren);
        memoizeProps(workInProgress, nextChildren);
      }
      return workInProgress.child;
    }

    /*
  function reuseChildrenEffects(returnFiber : Fiber, firstChild : Fiber) {
    let child = firstChild;
    do {
      // Ensure that the first and last effect of the parent corresponds
      // to the children's first and last effect.
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffect = child.firstEffect;
      }
      if (child.lastEffect) {
        if (returnFiber.lastEffect) {
          returnFiber.lastEffect.nextEffect = child.firstEffect;
        }
        returnFiber.lastEffect = child.lastEffect;
      }
    } while (child = child.sibling);
  }
  */

    function bailoutOnAlreadyFinishedWork(current, workInProgress) {
      cancelWorkTimer(workInProgress);

      // TODO: We should ideally be able to bail out early if the children have no
      // more work to do. However, since we don't have a separation of this
      // Fiber's priority and its children yet - we don't know without doing lots
      // of the same work we do anyway. Once we have that separation we can just
      // bail out here if the children has no more work at this priority level.
      // if (workInProgress.priorityOfChildren <= priorityLevel) {
      //   // If there are side-effects in these children that have not yet been
      //   // committed we need to ensure that they get properly transferred up.
      //   if (current && current.child !== workInProgress.child) {
      //     reuseChildrenEffects(workInProgress, child);
      //   }
      //   return null;
      // }

      cloneChildFibers(current, workInProgress);
      return workInProgress.child;
    }

    function bailoutOnLowPriority(current, workInProgress) {
      cancelWorkTimer(workInProgress);

      // TODO: Handle HostComponent tags here as well and call pushHostContext()?
      // See PR 8590 discussion for context
      switch (workInProgress.tag) {
        case HostRoot:
          pushHostRootContext(workInProgress);
          break;
        case ClassComponent:
          pushContextProvider(workInProgress);
          break;
        case HostPortal:
          pushHostContainer(
            workInProgress,
            workInProgress.stateNode.containerInfo
          );
          break;
      }
      // TODO: What if this is currently in progress?
      // How can that happen? How is this not being cloned?
      return null;
    }

    // TODO: Delete memoizeProps/State and move to reconcile/bailout instead
    function memoizeProps(workInProgress, nextProps) {
      workInProgress.memoizedProps = nextProps;
    }

    function memoizeState(workInProgress, nextState) {
      workInProgress.memoizedState = nextState;
      // Don't reset the updateQueue, in case there are pending updates. Resetting
      // is handled by processUpdateQueue.
    }

    function beginWork(current, workInProgress, renderExpirationTime) {
      if (
        workInProgress.expirationTime === NoWork ||
        workInProgress.expirationTime > renderExpirationTime
      ) {
        return bailoutOnLowPriority(current, workInProgress);
      }

      switch (workInProgress.tag) {
        case IndeterminateComponent:
          return mountIndeterminateComponent(
            current,
            workInProgress,
            renderExpirationTime
          );
        case FunctionalComponent:
          return updateFunctionalComponent(current, workInProgress);
        case ClassComponent:
          return updateClassComponent(
            current,
            workInProgress,
            renderExpirationTime
          );
        case HostRoot:
          return updateHostRoot(current, workInProgress, renderExpirationTime);
        case HostComponent:
          return updateHostComponent(
            current,
            workInProgress,
            renderExpirationTime
          );
        case HostText:
          return updateHostText(current, workInProgress);
        case CallHandlerPhase:
          // This is a restart. Reset the tag to the initial phase.
          workInProgress.tag = CallComponent;
        // Intentionally fall through since this is now the same.
        case CallComponent:
          return updateCallComponent(
            current,
            workInProgress,
            renderExpirationTime
          );
        case ReturnComponent:
          // A return component is just a placeholder, we can just run through the
          // next one immediately.
          return null;
        case HostPortal:
          return updatePortalComponent(
            current,
            workInProgress,
            renderExpirationTime
          );
        case Fragment:
          return updateFragment(current, workInProgress);
        default:
          invariant_1$1(
            false,
            'Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.'
          );
      }
    }

    function beginFailedWork(current, workInProgress, renderExpirationTime) {
      // Push context providers here to avoid a push/pop context mismatch.
      switch (workInProgress.tag) {
        case ClassComponent:
          pushContextProvider(workInProgress);
          break;
        case HostRoot:
          pushHostRootContext(workInProgress);
          break;
        default:
          invariant_1$1(
            false,
            'Invalid type of work. This error is likely caused by a bug in React. Please file an issue.'
          );
      }

      // Add an error effect so we can handle the error during the commit phase
      workInProgress.effectTag |= Err;

      // This is a weird case where we do "resume" work — work that failed on
      // our first attempt. Because we no longer have a notion of "progressed
      // deletions," reset the child to the current child to make sure we delete
      // it again. TODO: Find a better way to handle this, perhaps during a more
      // general overhaul of error handling.
      if (current === null) {
        workInProgress.child = null;
      } else if (workInProgress.child !== current.child) {
        workInProgress.child = current.child;
      }

      if (
        workInProgress.expirationTime === NoWork ||
        workInProgress.expirationTime > renderExpirationTime
      ) {
        return bailoutOnLowPriority(current, workInProgress);
      }

      // If we don't bail out, we're going be recomputing our children so we need
      // to drop our effect list.
      workInProgress.firstEffect = null;
      workInProgress.lastEffect = null;

      // Unmount the current children as if the component rendered null
      var nextChildren = null;
      reconcileChildrenAtExpirationTime(
        current,
        workInProgress,
        nextChildren,
        renderExpirationTime
      );

      if (workInProgress.tag === ClassComponent) {
        var instance = workInProgress.stateNode;
        workInProgress.memoizedProps = instance.props;
        workInProgress.memoizedState = instance.state;
      }

      return workInProgress.child;
    }

    return {
      beginWork: beginWork,
      beginFailedWork: beginFailedWork,
    };
  };

  var ReactFiberCompleteWork = function (
    config,
    hostContext,
    hydrationContext
  ) {
    var createInstance = config.createInstance,
      createTextInstance = config.createTextInstance,
      appendInitialChild = config.appendInitialChild,
      finalizeInitialChildren = config.finalizeInitialChildren,
      prepareUpdate = config.prepareUpdate,
      mutation = config.mutation,
      persistence = config.persistence;
    var getRootHostContainer = hostContext.getRootHostContainer,
      popHostContext = hostContext.popHostContext,
      getHostContext = hostContext.getHostContext,
      popHostContainer = hostContext.popHostContainer;
    var prepareToHydrateHostInstance =
        hydrationContext.prepareToHydrateHostInstance,
      prepareToHydrateHostTextInstance =
        hydrationContext.prepareToHydrateHostTextInstance,
      popHydrationState = hydrationContext.popHydrationState;

    function markUpdate(workInProgress) {
      // Tag the fiber with an update effect. This turns a Placement into
      // an UpdateAndPlacement.
      workInProgress.effectTag |= Update;
    }

    function markRef(workInProgress) {
      workInProgress.effectTag |= Ref;
    }

    function appendAllReturns(returns, workInProgress) {
      var node = workInProgress.stateNode;
      if (node) {
        node['return'] = workInProgress;
      }
      while (node !== null) {
        if (
          node.tag === HostComponent ||
          node.tag === HostText ||
          node.tag === HostPortal
        ) {
          invariant_1$1(false, 'A call cannot have host component children.');
        } else if (node.tag === ReturnComponent) {
          returns.push(node.type);
        } else if (node.child !== null) {
          node.child['return'] = node;
          node = node.child;
          continue;
        }
        while (node.sibling === null) {
          if (node['return'] === null || node['return'] === workInProgress) {
            return;
          }
          node = node['return'];
        }
        node.sibling['return'] = node['return'];
        node = node.sibling;
      }
    }

    function moveCallToHandlerPhase(
      current,
      workInProgress,
      renderExpirationTime
    ) {
      var call = workInProgress.memoizedProps;
      !call
        ? invariant_1$1(
            false,
            'Should be resolved by now. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;

      // First step of the call has completed. Now we need to do the second.
      // TODO: It would be nice to have a multi stage call represented by a
      // single component, or at least tail call optimize nested ones. Currently
      // that requires additional fields that we don't want to add to the fiber.
      // So this requires nested handlers.
      // Note: This doesn't mutate the alternate node. I don't think it needs to
      // since this stage is reset for every pass.
      workInProgress.tag = CallHandlerPhase;

      // Build up the returns.
      // TODO: Compare this to a generator or opaque helpers like Children.
      var returns = [];
      appendAllReturns(returns, workInProgress);
      var fn = call.handler;
      var props = call.props;
      var nextChildren = fn(props, returns);

      var currentFirstChild = current !== null ? current.child : null;
      workInProgress.child = reconcileChildFibers(
        workInProgress,
        currentFirstChild,
        nextChildren,
        renderExpirationTime
      );
      return workInProgress.child;
    }

    function appendAllChildren(parent, workInProgress) {
      // We only have the top Fiber that was created but we need recurse down its
      // children to find all the terminal nodes.
      var node = workInProgress.child;
      while (node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) {
          appendInitialChild(parent, node.stateNode);
        } else if (node.tag === HostPortal) {
          // If we have a portal child, then we don't want to traverse
          // down its children. Instead, we'll get insertions from each child in
          // the portal directly.
        } else if (node.child !== null) {
          node.child['return'] = node;
          node = node.child;
          continue;
        }
        if (node === workInProgress) {
          return;
        }
        while (node.sibling === null) {
          if (node['return'] === null || node['return'] === workInProgress) {
            return;
          }
          node = node['return'];
        }
        node.sibling['return'] = node['return'];
        node = node.sibling;
      }
    }

    var updateHostContainer = void 0;
    var updateHostComponent = void 0;
    var updateHostText = void 0;
    if (mutation) {
      if (enableMutatingReconciler) {
        // Mutation mode
        updateHostContainer = function (workInProgress) {
          // Noop
        };
        updateHostComponent = function (
          current,
          workInProgress,
          updatePayload,
          type,
          oldProps,
          newProps,
          rootContainerInstance
        ) {
          // TODO: Type this specific to this type of component.
          workInProgress.updateQueue = updatePayload;
          // If the update payload indicates that there is a change or if there
          // is a new ref we mark this as an update. All the work is done in commitWork.
          if (updatePayload) {
            markUpdate(workInProgress);
          }
        };
        updateHostText = function (current, workInProgress, oldText, newText) {
          // If the text differs, mark it as an update. All the work in done in commitWork.
          if (oldText !== newText) {
            markUpdate(workInProgress);
          }
        };
      } else {
        invariant_1$1(false, 'Mutating reconciler is disabled.');
      }
    } else if (persistence) {
      if (enablePersistentReconciler) {
        // Persistent host tree mode
        var cloneInstance = persistence.cloneInstance,
          createContainerChildSet = persistence.createContainerChildSet,
          appendChildToContainerChildSet =
            persistence.appendChildToContainerChildSet,
          finalizeContainerChildren = persistence.finalizeContainerChildren;

        // An unfortunate fork of appendAllChildren because we have two different parent types.

        var appendAllChildrenToContainer = function (
          containerChildSet,
          workInProgress
        ) {
          // We only have the top Fiber that was created but we need recurse down its
          // children to find all the terminal nodes.
          var node = workInProgress.child;
          while (node !== null) {
            if (node.tag === HostComponent || node.tag === HostText) {
              appendChildToContainerChildSet(containerChildSet, node.stateNode);
            } else if (node.tag === HostPortal) {
              // If we have a portal child, then we don't want to traverse
              // down its children. Instead, we'll get insertions from each child in
              // the portal directly.
            } else if (node.child !== null) {
              node.child['return'] = node;
              node = node.child;
              continue;
            }
            if (node === workInProgress) {
              return;
            }
            while (node.sibling === null) {
              if (
                node['return'] === null ||
                node['return'] === workInProgress
              ) {
                return;
              }
              node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
          }
        };
        updateHostContainer = function (workInProgress) {
          var portalOrRoot = workInProgress.stateNode;
          var childrenUnchanged = workInProgress.firstEffect === null;
          if (childrenUnchanged) {
            // No changes, just reuse the existing instance.
          } else {
            var container = portalOrRoot.containerInfo;
            var newChildSet = createContainerChildSet(container);
            if (finalizeContainerChildren(container, newChildSet)) {
              markUpdate(workInProgress);
            }
            portalOrRoot.pendingChildren = newChildSet;
            // If children might have changed, we have to add them all to the set.
            appendAllChildrenToContainer(newChildSet, workInProgress);
            // Schedule an update on the container to swap out the container.
            markUpdate(workInProgress);
          }
        };
        updateHostComponent = function (
          current,
          workInProgress,
          updatePayload,
          type,
          oldProps,
          newProps,
          rootContainerInstance
        ) {
          // If there are no effects associated with this node, then none of our children had any updates.
          // This guarantees that we can reuse all of them.
          var childrenUnchanged = workInProgress.firstEffect === null;
          var currentInstance = current.stateNode;
          if (childrenUnchanged && updatePayload === null) {
            // No changes, just reuse the existing instance.
            // Note that this might release a previous clone.
            workInProgress.stateNode = currentInstance;
          } else {
            var recyclableInstance = workInProgress.stateNode;
            var newInstance = cloneInstance(
              currentInstance,
              updatePayload,
              type,
              oldProps,
              newProps,
              workInProgress,
              childrenUnchanged,
              recyclableInstance
            );
            if (
              finalizeInitialChildren(
                newInstance,
                type,
                newProps,
                rootContainerInstance
              )
            ) {
              markUpdate(workInProgress);
            }
            workInProgress.stateNode = newInstance;
            if (childrenUnchanged) {
              // If there are no other effects in this tree, we need to flag this node as having one.
              // Even though we're not going to use it for anything.
              // Otherwise parents won't know that there are new children to propagate upwards.
              markUpdate(workInProgress);
            } else {
              // If children might have changed, we have to add them all to the set.
              appendAllChildren(newInstance, workInProgress);
            }
          }
        };
        updateHostText = function (current, workInProgress, oldText, newText) {
          if (oldText !== newText) {
            // If the text content differs, we'll create a new text instance for it.
            var rootContainerInstance = getRootHostContainer();
            var currentHostContext = getHostContext();
            workInProgress.stateNode = createTextInstance(
              newText,
              rootContainerInstance,
              currentHostContext,
              workInProgress
            );
            // We'll have to mark it as having an effect, even though we won't use the effect for anything.
            // This lets the parents know that at least one of their children has changed.
            markUpdate(workInProgress);
          }
        };
      } else {
        invariant_1$1(false, 'Persistent reconciler is disabled.');
      }
    } else {
      if (enableNoopReconciler) {
        // No host operations
        updateHostContainer = function (workInProgress) {
          // Noop
        };
        updateHostComponent = function (
          current,
          workInProgress,
          updatePayload,
          type,
          oldProps,
          newProps,
          rootContainerInstance
        ) {
          // Noop
        };
        updateHostText = function (current, workInProgress, oldText, newText) {
          // Noop
        };
      } else {
        invariant_1$1(false, 'Noop reconciler is disabled.');
      }
    }

    function completeWork(current, workInProgress, renderExpirationTime) {
      // Get the latest props.
      var newProps = workInProgress.pendingProps;
      if (newProps === null) {
        newProps = workInProgress.memoizedProps;
      } else if (
        workInProgress.expirationTime !== Never ||
        renderExpirationTime === Never
      ) {
        // Reset the pending props, unless this was a down-prioritization.
        workInProgress.pendingProps = null;
      }

      switch (workInProgress.tag) {
        case FunctionalComponent:
          return null;
        case ClassComponent: {
          // We are leaving this subtree, so pop context if any.
          popContextProvider(workInProgress);
          return null;
        }
        case HostRoot: {
          popHostContainer(workInProgress);
          popTopLevelContextObject(workInProgress);
          var fiberRoot = workInProgress.stateNode;
          if (fiberRoot.pendingContext) {
            fiberRoot.context = fiberRoot.pendingContext;
            fiberRoot.pendingContext = null;
          }

          if (current === null || current.child === null) {
            // If we hydrated, pop so that we can delete any remaining children
            // that weren't hydrated.
            popHydrationState(workInProgress);
            // This resets the hacky state to fix isMounted before committing.
            // TODO: Delete this when we delete isMounted and findDOMNode.
            workInProgress.effectTag &= ~Placement;
          }
          updateHostContainer(workInProgress);
          return null;
        }
        case HostComponent: {
          popHostContext(workInProgress);
          var rootContainerInstance = getRootHostContainer();
          var type = workInProgress.type;
          if (current !== null && workInProgress.stateNode != null) {
            // If we have an alternate, that means this is an update and we need to
            // schedule a side-effect to do the updates.
            var oldProps = current.memoizedProps;
            // If we get updated because one of our children updated, we don't
            // have newProps so we'll have to reuse them.
            // TODO: Split the update API as separate for the props vs. children.
            // Even better would be if children weren't special cased at all tho.
            var instance = workInProgress.stateNode;
            var currentHostContext = getHostContext();
            var updatePayload = prepareUpdate(
              instance,
              type,
              oldProps,
              newProps,
              rootContainerInstance,
              currentHostContext
            );

            updateHostComponent(
              current,
              workInProgress,
              updatePayload,
              type,
              oldProps,
              newProps,
              rootContainerInstance
            );

            if (current.ref !== workInProgress.ref) {
              markRef(workInProgress);
            }
          } else {
            if (!newProps) {
              !(workInProgress.stateNode !== null)
                ? invariant_1$1(
                    false,
                    'We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.'
                  )
                : void 0;
              // This can happen when we abort work.
              return null;
            }

            var _currentHostContext = getHostContext();
            // TODO: Move createInstance to beginWork and keep it on a context
            // "stack" as the parent. Then append children as we go in beginWork
            // or completeWork depending on we want to add then top->down or
            // bottom->up. Top->down is faster in IE11.
            var wasHydrated = popHydrationState(workInProgress);
            if (wasHydrated) {
              // TODO: Move this and createInstance step into the beginPhase
              // to consolidate.
              if (
                prepareToHydrateHostInstance(
                  workInProgress,
                  rootContainerInstance,
                  _currentHostContext
                )
              ) {
                // If changes to the hydrated node needs to be applied at the
                // commit-phase we mark this as such.
                markUpdate(workInProgress);
              }
            } else {
              var _instance = createInstance(
                type,
                newProps,
                rootContainerInstance,
                _currentHostContext,
                workInProgress
              );

              appendAllChildren(_instance, workInProgress);

              // Certain renderers require commit-time effects for initial mount.
              // (eg DOM renderer supports auto-focus for certain elements).
              // Make sure such renderers get scheduled for later work.
              if (
                finalizeInitialChildren(
                  _instance,
                  type,
                  newProps,
                  rootContainerInstance
                )
              ) {
                markUpdate(workInProgress);
              }
              workInProgress.stateNode = _instance;
            }

            if (workInProgress.ref !== null) {
              // If there is a ref on a host node we need to schedule a callback
              markRef(workInProgress);
            }
          }
          return null;
        }
        case HostText: {
          var newText = newProps;
          if (current && workInProgress.stateNode != null) {
            var oldText = current.memoizedProps;
            // If we have an alternate, that means this is an update and we need
            // to schedule a side-effect to do the updates.
            updateHostText(current, workInProgress, oldText, newText);
          } else {
            if (typeof newText !== 'string') {
              !(workInProgress.stateNode !== null)
                ? invariant_1$1(
                    false,
                    'We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.'
                  )
                : void 0;
              // This can happen when we abort work.
              return null;
            }
            var _rootContainerInstance = getRootHostContainer();
            var _currentHostContext2 = getHostContext();
            var _wasHydrated = popHydrationState(workInProgress);
            if (_wasHydrated) {
              if (prepareToHydrateHostTextInstance(workInProgress)) {
                markUpdate(workInProgress);
              }
            } else {
              workInProgress.stateNode = createTextInstance(
                newText,
                _rootContainerInstance,
                _currentHostContext2,
                workInProgress
              );
            }
          }
          return null;
        }
        case CallComponent:
          return moveCallToHandlerPhase(
            current,
            workInProgress,
            renderExpirationTime
          );
        case CallHandlerPhase:
          // Reset the tag to now be a first phase call.
          workInProgress.tag = CallComponent;
          return null;
        case ReturnComponent:
          // Does nothing.
          return null;
        case Fragment:
          return null;
        case HostPortal:
          popHostContainer(workInProgress);
          updateHostContainer(workInProgress);
          return null;
        // Error cases
        case IndeterminateComponent:
          invariant_1$1(
            false,
            'An indeterminate component should have become determinate before completing. This error is likely caused by a bug in React. Please file an issue.'
          );
        // eslint-disable-next-line no-fallthrough
        default:
          invariant_1$1(
            false,
            'Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.'
          );
      }
    }

    return {
      completeWork: completeWork,
    };
  };

  var invokeGuardedCallback$2 = ReactErrorUtils.invokeGuardedCallback;
  var hasCaughtError$1 = ReactErrorUtils.hasCaughtError;
  var clearCaughtError$1 = ReactErrorUtils.clearCaughtError;

  var ReactFiberCommitWork = function (config, captureError) {
    var getPublicInstance = config.getPublicInstance,
      mutation = config.mutation,
      persistence = config.persistence;

    var callComponentWillUnmountWithTimer = function (current, instance) {
      startPhaseTimer(current, 'componentWillUnmount');
      instance.props = current.memoizedProps;
      instance.state = current.memoizedState;
      instance.componentWillUnmount();
      stopPhaseTimer();
    };

    // Capture errors so they don't interrupt unmounting.
    function safelyCallComponentWillUnmount(current, instance) {
      {
        invokeGuardedCallback$2(
          null,
          callComponentWillUnmountWithTimer,
          null,
          current,
          instance
        );
        if (hasCaughtError$1()) {
          var unmountError = clearCaughtError$1();
          captureError(current, unmountError);
        }
      }
    }

    function safelyDetachRef(current) {
      var ref = current.ref;
      if (ref !== null) {
        {
          invokeGuardedCallback$2(null, ref, null, null);
          if (hasCaughtError$1()) {
            var refError = clearCaughtError$1();
            captureError(current, refError);
          }
        }
      }
    }

    function commitLifeCycles(current, finishedWork) {
      switch (finishedWork.tag) {
        case ClassComponent: {
          var instance = finishedWork.stateNode;
          if (finishedWork.effectTag & Update) {
            if (current === null) {
              startPhaseTimer(finishedWork, 'componentDidMount');
              instance.props = finishedWork.memoizedProps;
              instance.state = finishedWork.memoizedState;
              instance.componentDidMount();
              stopPhaseTimer();
            } else {
              var prevProps = current.memoizedProps;
              var prevState = current.memoizedState;
              startPhaseTimer(finishedWork, 'componentDidUpdate');
              instance.props = finishedWork.memoizedProps;
              instance.state = finishedWork.memoizedState;
              instance.componentDidUpdate(prevProps, prevState);
              stopPhaseTimer();
            }
          }
          var updateQueue = finishedWork.updateQueue;
          if (updateQueue !== null) {
            commitCallbacks(updateQueue, instance);
          }
          return;
        }
        case HostRoot: {
          var _updateQueue = finishedWork.updateQueue;
          if (_updateQueue !== null) {
            var _instance =
              finishedWork.child !== null ? finishedWork.child.stateNode : null;
            commitCallbacks(_updateQueue, _instance);
          }
          return;
        }
        case HostComponent: {
          var _instance2 = finishedWork.stateNode;

          // Renderers may schedule work to be done after host components are mounted
          // (eg DOM renderer may schedule auto-focus for inputs and form controls).
          // These effects should only be committed when components are first mounted,
          // aka when there is no current/alternate.
          if (current === null && finishedWork.effectTag & Update) {
            var type = finishedWork.type;
            var props = finishedWork.memoizedProps;
            commitMount(_instance2, type, props, finishedWork);
          }

          return;
        }
        case HostText: {
          // We have no life-cycles associated with text.
          return;
        }
        case HostPortal: {
          // We have no life-cycles associated with portals.
          return;
        }
        default: {
          invariant_1$1(
            false,
            'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.'
          );
        }
      }
    }

    function commitAttachRef(finishedWork) {
      var ref = finishedWork.ref;
      if (ref !== null) {
        var instance = finishedWork.stateNode;
        switch (finishedWork.tag) {
          case HostComponent:
            ref(getPublicInstance(instance));
            break;
          default:
            ref(instance);
        }
      }
    }

    function commitDetachRef(current) {
      var currentRef = current.ref;
      if (currentRef !== null) {
        currentRef(null);
      }
    }

    // User-originating errors (lifecycles and refs) should not interrupt
    // deletion, so don't let them throw. Host-originating errors should
    // interrupt deletion, so it's okay
    function commitUnmount(current) {
      if (typeof onCommitUnmount === 'function') {
        onCommitUnmount(current);
      }

      switch (current.tag) {
        case ClassComponent: {
          safelyDetachRef(current);
          var instance = current.stateNode;
          if (typeof instance.componentWillUnmount === 'function') {
            safelyCallComponentWillUnmount(current, instance);
          }
          return;
        }
        case HostComponent: {
          safelyDetachRef(current);
          return;
        }
        case CallComponent: {
          commitNestedUnmounts(current.stateNode);
          return;
        }
        case HostPortal: {
          // TODO: this is recursive.
          // We are also not using this parent because
          // the portal will get pushed immediately.
          if (enableMutatingReconciler && mutation) {
            unmountHostComponents(current);
          } else if (enablePersistentReconciler && persistence) {
            emptyPortalContainer(current);
          }
          return;
        }
      }
    }

    function commitNestedUnmounts(root) {
      // While we're inside a removed host node we don't want to call
      // removeChild on the inner nodes because they're removed by the top
      // call anyway. We also want to call componentWillUnmount on all
      // composites before this host node is removed from the tree. Therefore
      var node = root;
      while (true) {
        commitUnmount(node);
        // Visit children because they may contain more composite or host nodes.
        // Skip portals because commitUnmount() currently visits them recursively.
        if (
          node.child !== null &&
          // If we use mutation we drill down into portals using commitUnmount above.
          // If we don't use mutation we drill down into portals here instead.
          (!mutation || node.tag !== HostPortal)
        ) {
          node.child['return'] = node;
          node = node.child;
          continue;
        }
        if (node === root) {
          return;
        }
        while (node.sibling === null) {
          if (node['return'] === null || node['return'] === root) {
            return;
          }
          node = node['return'];
        }
        node.sibling['return'] = node['return'];
        node = node.sibling;
      }
    }

    function detachFiber(current) {
      // Cut off the return pointers to disconnect it from the tree. Ideally, we
      // should clear the child pointer of the parent alternate to let this
      // get GC:ed but we don't know which for sure which parent is the current
      // one so we'll settle for GC:ing the subtree of this child. This child
      // itself will be GC:ed when the parent updates the next time.
      current['return'] = null;
      current.child = null;
      if (current.alternate) {
        current.alternate.child = null;
        current.alternate['return'] = null;
      }
    }

    if (!mutation) {
      var commitContainer = void 0;
      if (persistence) {
        var replaceContainerChildren = persistence.replaceContainerChildren,
          createContainerChildSet = persistence.createContainerChildSet;

        var emptyPortalContainer = function (current) {
          var portal = current.stateNode;
          var containerInfo = portal.containerInfo;

          var emptyChildSet = createContainerChildSet(containerInfo);
          replaceContainerChildren(containerInfo, emptyChildSet);
        };
        commitContainer = function (finishedWork) {
          switch (finishedWork.tag) {
            case ClassComponent: {
              return;
            }
            case HostComponent: {
              return;
            }
            case HostText: {
              return;
            }
            case HostRoot:
            case HostPortal: {
              var portalOrRoot = finishedWork.stateNode;
              var containerInfo = portalOrRoot.containerInfo,
                _pendingChildren = portalOrRoot.pendingChildren;

              replaceContainerChildren(containerInfo, _pendingChildren);
              return;
            }
            default: {
              invariant_1$1(
                false,
                'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.'
              );
            }
          }
        };
      } else {
        commitContainer = function (finishedWork) {
          // Noop
        };
      }
      if (enablePersistentReconciler || enableNoopReconciler) {
        return {
          commitResetTextContent: function (finishedWork) {},
          commitPlacement: function (finishedWork) {},
          commitDeletion: function (current) {
            // Detach refs and call componentWillUnmount() on the whole subtree.
            commitNestedUnmounts(current);
            detachFiber(current);
          },
          commitWork: function (current, finishedWork) {
            commitContainer(finishedWork);
          },

          commitLifeCycles: commitLifeCycles,
          commitAttachRef: commitAttachRef,
          commitDetachRef: commitDetachRef,
        };
      } else if (persistence) {
        invariant_1$1(false, 'Persistent reconciler is disabled.');
      } else {
        invariant_1$1(false, 'Noop reconciler is disabled.');
      }
    }
    var commitMount = mutation.commitMount,
      commitUpdate = mutation.commitUpdate,
      resetTextContent = mutation.resetTextContent,
      commitTextUpdate = mutation.commitTextUpdate,
      appendChild = mutation.appendChild,
      appendChildToContainer = mutation.appendChildToContainer,
      insertBefore = mutation.insertBefore,
      insertInContainerBefore = mutation.insertInContainerBefore,
      removeChild = mutation.removeChild,
      removeChildFromContainer = mutation.removeChildFromContainer;

    function getHostParentFiber(fiber) {
      var parent = fiber['return'];
      while (parent !== null) {
        if (isHostParent(parent)) {
          return parent;
        }
        parent = parent['return'];
      }
      invariant_1$1(
        false,
        'Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.'
      );
    }

    function isHostParent(fiber) {
      return (
        fiber.tag === HostComponent ||
        fiber.tag === HostRoot ||
        fiber.tag === HostPortal
      );
    }

    function getHostSibling(fiber) {
      // We're going to search forward into the tree until we find a sibling host
      // node. Unfortunately, if multiple insertions are done in a row we have to
      // search past them. This leads to exponential search for the next sibling.
      var node = fiber;
      siblings: while (true) {
        // If we didn't find anything, let's try the next sibling.
        while (node.sibling === null) {
          if (node['return'] === null || isHostParent(node['return'])) {
            // If we pop out of the root or hit the parent the fiber we are the
            // last sibling.
            return null;
          }
          node = node['return'];
        }
        node.sibling['return'] = node['return'];
        node = node.sibling;
        while (node.tag !== HostComponent && node.tag !== HostText) {
          // If it is not host node and, we might have a host node inside it.
          // Try to search down until we find one.
          if (node.effectTag & Placement) {
            // If we don't have a child, try the siblings instead.
            continue siblings;
          }
          // If we don't have a child, try the siblings instead.
          // We also skip portals because they are not part of this host tree.
          if (node.child === null || node.tag === HostPortal) {
            continue siblings;
          } else {
            node.child['return'] = node;
            node = node.child;
          }
        }
        // Check if this host node is stable or about to be placed.
        if (!(node.effectTag & Placement)) {
          // Found it!
          return node.stateNode;
        }
      }
    }

    function commitPlacement(finishedWork) {
      // Recursively insert all host nodes into the parent.
      var parentFiber = getHostParentFiber(finishedWork);
      var parent = void 0;
      var isContainer = void 0;
      switch (parentFiber.tag) {
        case HostComponent:
          parent = parentFiber.stateNode;
          isContainer = false;
          break;
        case HostRoot:
          parent = parentFiber.stateNode.containerInfo;
          isContainer = true;
          break;
        case HostPortal:
          parent = parentFiber.stateNode.containerInfo;
          isContainer = true;
          break;
        default:
          invariant_1$1(
            false,
            'Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.'
          );
      }
      if (parentFiber.effectTag & ContentReset) {
        // Reset the text content of the parent before doing any insertions
        resetTextContent(parent);
        // Clear ContentReset from the effect tag
        parentFiber.effectTag &= ~ContentReset;
      }

      var before = getHostSibling(finishedWork);
      // We only have the top Fiber that was inserted but we need recurse down its
      // children to find all the terminal nodes.
      var node = finishedWork;
      while (true) {
        if (node.tag === HostComponent || node.tag === HostText) {
          if (before) {
            if (isContainer) {
              insertInContainerBefore(parent, node.stateNode, before);
            } else {
              insertBefore(parent, node.stateNode, before);
            }
          } else {
            if (isContainer) {
              appendChildToContainer(parent, node.stateNode);
            } else {
              appendChild(parent, node.stateNode);
            }
          }
        } else if (node.tag === HostPortal) {
          // If the insertion itself is a portal, then we don't want to traverse
          // down its children. Instead, we'll get insertions from each child in
          // the portal directly.
        } else if (node.child !== null) {
          node.child['return'] = node;
          node = node.child;
          continue;
        }
        if (node === finishedWork) {
          return;
        }
        while (node.sibling === null) {
          if (node['return'] === null || node['return'] === finishedWork) {
            return;
          }
          node = node['return'];
        }
        node.sibling['return'] = node['return'];
        node = node.sibling;
      }
    }

    function unmountHostComponents(current) {
      // We only have the top Fiber that was inserted but we need recurse down its
      var node = current;

      // Each iteration, currentParent is populated with node's host parent if not
      // currentParentIsValid.
      var currentParentIsValid = false;
      var currentParent = void 0;
      var currentParentIsContainer = void 0;

      while (true) {
        if (!currentParentIsValid) {
          var parent = node['return'];
          findParent: while (true) {
            !(parent !== null)
              ? invariant_1$1(
                  false,
                  'Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.'
                )
              : void 0;
            switch (parent.tag) {
              case HostComponent:
                currentParent = parent.stateNode;
                currentParentIsContainer = false;
                break findParent;
              case HostRoot:
                currentParent = parent.stateNode.containerInfo;
                currentParentIsContainer = true;
                break findParent;
              case HostPortal:
                currentParent = parent.stateNode.containerInfo;
                currentParentIsContainer = true;
                break findParent;
            }
            parent = parent['return'];
          }
          currentParentIsValid = true;
        }

        if (node.tag === HostComponent || node.tag === HostText) {
          commitNestedUnmounts(node);
          // After all the children have unmounted, it is now safe to remove the
          // node from the tree.
          if (currentParentIsContainer) {
            removeChildFromContainer(currentParent, node.stateNode);
          } else {
            removeChild(currentParent, node.stateNode);
          }
          // Don't visit children because we already visited them.
        } else if (node.tag === HostPortal) {
          // When we go into a portal, it becomes the parent to remove from.
          // We will reassign it back when we pop the portal on the way up.
          currentParent = node.stateNode.containerInfo;
          // Visit children because portals might contain host components.
          if (node.child !== null) {
            node.child['return'] = node;
            node = node.child;
            continue;
          }
        } else {
          commitUnmount(node);
          // Visit children because we may find more host components below.
          if (node.child !== null) {
            node.child['return'] = node;
            node = node.child;
            continue;
          }
        }
        if (node === current) {
          return;
        }
        while (node.sibling === null) {
          if (node['return'] === null || node['return'] === current) {
            return;
          }
          node = node['return'];
          if (node.tag === HostPortal) {
            // When we go out of the portal, we need to restore the parent.
            // Since we don't keep a stack of them, we will search for it.
            currentParentIsValid = false;
          }
        }
        node.sibling['return'] = node['return'];
        node = node.sibling;
      }
    }

    function commitDeletion(current) {
      // Recursively delete all host nodes from the parent.
      // Detach refs and call componentWillUnmount() on the whole subtree.
      unmountHostComponents(current);
      detachFiber(current);
    }

    function commitWork(current, finishedWork) {
      switch (finishedWork.tag) {
        case ClassComponent: {
          return;
        }
        case HostComponent: {
          var instance = finishedWork.stateNode;
          if (instance != null) {
            // Commit the work prepared earlier.
            var newProps = finishedWork.memoizedProps;
            // For hydration we reuse the update path but we treat the oldProps
            // as the newProps. The updatePayload will contain the real change in
            // this case.
            var oldProps = current !== null ? current.memoizedProps : newProps;
            var type = finishedWork.type;
            // TODO: Type the updateQueue to be specific to host components.
            var updatePayload = finishedWork.updateQueue;
            finishedWork.updateQueue = null;
            if (updatePayload !== null) {
              commitUpdate(
                instance,
                updatePayload,
                type,
                oldProps,
                newProps,
                finishedWork
              );
            }
          }
          return;
        }
        case HostText: {
          !(finishedWork.stateNode !== null)
            ? invariant_1$1(
                false,
                'This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.'
              )
            : void 0;
          var textInstance = finishedWork.stateNode;
          var newText = finishedWork.memoizedProps;
          // For hydration we reuse the update path but we treat the oldProps
          // as the newProps. The updatePayload will contain the real change in
          // this case.
          var oldText = current !== null ? current.memoizedProps : newText;
          commitTextUpdate(textInstance, oldText, newText);
          return;
        }
        case HostRoot: {
          return;
        }
        default: {
          invariant_1$1(
            false,
            'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.'
          );
        }
      }
    }

    function commitResetTextContent(current) {
      resetTextContent(current.stateNode);
    }

    if (enableMutatingReconciler) {
      return {
        commitResetTextContent: commitResetTextContent,
        commitPlacement: commitPlacement,
        commitDeletion: commitDeletion,
        commitWork: commitWork,
        commitLifeCycles: commitLifeCycles,
        commitAttachRef: commitAttachRef,
        commitDetachRef: commitDetachRef,
      };
    } else {
      invariant_1$1(false, 'Mutating reconciler is disabled.');
    }
  };

  var NO_CONTEXT = {};

  var ReactFiberHostContext = function (config) {
    var getChildHostContext = config.getChildHostContext,
      getRootHostContext = config.getRootHostContext;

    var contextStackCursor = createCursor(NO_CONTEXT);
    var contextFiberStackCursor = createCursor(NO_CONTEXT);
    var rootInstanceStackCursor = createCursor(NO_CONTEXT);

    function requiredContext(c) {
      !(c !== NO_CONTEXT)
        ? invariant_1$1(
            false,
            'Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      return c;
    }

    function getRootHostContainer() {
      var rootInstance = requiredContext(rootInstanceStackCursor.current);
      return rootInstance;
    }

    function pushHostContainer(fiber, nextRootInstance) {
      // Push current root instance onto the stack;
      // This allows us to reset root when portals are popped.
      push(rootInstanceStackCursor, nextRootInstance, fiber);

      var nextRootContext = getRootHostContext(nextRootInstance);

      // Track the context and the Fiber that provided it.
      // This enables us to pop only Fibers that provide unique contexts.
      push(contextFiberStackCursor, fiber, fiber);
      push(contextStackCursor, nextRootContext, fiber);
    }

    function popHostContainer(fiber) {
      pop(contextStackCursor, fiber);
      pop(contextFiberStackCursor, fiber);
      pop(rootInstanceStackCursor, fiber);
    }

    function getHostContext() {
      var context = requiredContext(contextStackCursor.current);
      return context;
    }

    function pushHostContext(fiber) {
      var rootInstance = requiredContext(rootInstanceStackCursor.current);
      var context = requiredContext(contextStackCursor.current);
      var nextContext = getChildHostContext(context, fiber.type, rootInstance);

      // Don't push this Fiber's context unless it's unique.
      if (context === nextContext) {
        return;
      }

      // Track the context and the Fiber that provided it.
      // This enables us to pop only Fibers that provide unique contexts.
      push(contextFiberStackCursor, fiber, fiber);
      push(contextStackCursor, nextContext, fiber);
    }

    function popHostContext(fiber) {
      // Do not pop unless this Fiber provided the current context.
      // pushHostContext() only pushes Fibers that provide unique contexts.
      if (contextFiberStackCursor.current !== fiber) {
        return;
      }

      pop(contextStackCursor, fiber);
      pop(contextFiberStackCursor, fiber);
    }

    function resetHostContainer() {
      contextStackCursor.current = NO_CONTEXT;
      rootInstanceStackCursor.current = NO_CONTEXT;
    }

    return {
      getHostContext: getHostContext,
      getRootHostContainer: getRootHostContainer,
      popHostContainer: popHostContainer,
      popHostContext: popHostContext,
      pushHostContainer: pushHostContainer,
      pushHostContext: pushHostContext,
      resetHostContainer: resetHostContainer,
    };
  };

  var ReactFiberHydrationContext = function (config) {
    var shouldSetTextContent = config.shouldSetTextContent,
      hydration = config.hydration;

    // If this doesn't have hydration mode.

    if (!hydration) {
      return {
        enterHydrationState: function () {
          return false;
        },
        resetHydrationState: function () {},
        tryToClaimNextHydratableInstance: function () {},
        prepareToHydrateHostInstance: function () {
          invariant_1$1(
            false,
            'Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.'
          );
        },
        prepareToHydrateHostTextInstance: function () {
          invariant_1$1(
            false,
            'Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.'
          );
        },
        popHydrationState: function (fiber) {
          return false;
        },
      };
    }

    var canHydrateInstance = hydration.canHydrateInstance,
      canHydrateTextInstance = hydration.canHydrateTextInstance,
      getNextHydratableSibling = hydration.getNextHydratableSibling,
      getFirstHydratableChild = hydration.getFirstHydratableChild,
      hydrateInstance = hydration.hydrateInstance,
      hydrateTextInstance = hydration.hydrateTextInstance,
      didNotMatchHydratedContainerTextInstance =
        hydration.didNotMatchHydratedContainerTextInstance,
      didNotMatchHydratedTextInstance =
        hydration.didNotMatchHydratedTextInstance,
      didNotHydrateContainerInstance = hydration.didNotHydrateContainerInstance,
      didNotHydrateInstance = hydration.didNotHydrateInstance,
      didNotFindHydratableContainerInstance =
        hydration.didNotFindHydratableContainerInstance,
      didNotFindHydratableContainerTextInstance =
        hydration.didNotFindHydratableContainerTextInstance,
      didNotFindHydratableInstance = hydration.didNotFindHydratableInstance,
      didNotFindHydratableTextInstance =
        hydration.didNotFindHydratableTextInstance;

    // The deepest Fiber on the stack involved in a hydration context.
    // This may have been an insertion or a hydration.

    var hydrationParentFiber = null;
    var nextHydratableInstance = null;
    var isHydrating = false;

    function enterHydrationState(fiber) {
      var parentInstance = fiber.stateNode.containerInfo;
      nextHydratableInstance = getFirstHydratableChild(parentInstance);
      hydrationParentFiber = fiber;
      isHydrating = true;
      return true;
    }

    function deleteHydratableInstance(returnFiber, instance) {
      {
        switch (returnFiber.tag) {
          case HostRoot:
            didNotHydrateContainerInstance(
              returnFiber.stateNode.containerInfo,
              instance
            );
            break;
          case HostComponent:
            didNotHydrateInstance(
              returnFiber.type,
              returnFiber.memoizedProps,
              returnFiber.stateNode,
              instance
            );
            break;
        }
      }

      var childToDelete = createFiberFromHostInstanceForDeletion();
      childToDelete.stateNode = instance;
      childToDelete['return'] = returnFiber;
      childToDelete.effectTag = Deletion;

      // This might seem like it belongs on progressedFirstDeletion. However,
      // these children are not part of the reconciliation list of children.
      // Even if we abort and rereconcile the children, that will try to hydrate
      // again and the nodes are still in the host tree so these will be
      // recreated.
      if (returnFiber.lastEffect !== null) {
        returnFiber.lastEffect.nextEffect = childToDelete;
        returnFiber.lastEffect = childToDelete;
      } else {
        returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
      }
    }

    function insertNonHydratedInstance(returnFiber, fiber) {
      fiber.effectTag |= Placement;
      {
        switch (returnFiber.tag) {
          case HostRoot: {
            var parentContainer = returnFiber.stateNode.containerInfo;
            switch (fiber.tag) {
              case HostComponent:
                var type = fiber.type;
                var props = fiber.pendingProps;
                didNotFindHydratableContainerInstance(
                  parentContainer,
                  type,
                  props
                );
                break;
              case HostText:
                var text = fiber.pendingProps;
                didNotFindHydratableContainerTextInstance(
                  parentContainer,
                  text
                );
                break;
            }
            break;
          }
          case HostComponent: {
            var parentType = returnFiber.type;
            var parentProps = returnFiber.memoizedProps;
            var parentInstance = returnFiber.stateNode;
            switch (fiber.tag) {
              case HostComponent:
                var _type = fiber.type;
                var _props = fiber.pendingProps;
                didNotFindHydratableInstance(
                  parentType,
                  parentProps,
                  parentInstance,
                  _type,
                  _props
                );
                break;
              case HostText:
                var _text = fiber.pendingProps;
                didNotFindHydratableTextInstance(
                  parentType,
                  parentProps,
                  parentInstance,
                  _text
                );
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }

    function canHydrate(fiber, nextInstance) {
      switch (fiber.tag) {
        case HostComponent: {
          var type = fiber.type;
          var props = fiber.pendingProps;
          return canHydrateInstance(nextInstance, type, props);
        }
        case HostText: {
          var text = fiber.pendingProps;
          return canHydrateTextInstance(nextInstance, text);
        }
        default:
          return false;
      }
    }

    function tryToClaimNextHydratableInstance(fiber) {
      if (!isHydrating) {
        return;
      }
      var nextInstance = nextHydratableInstance;
      if (!nextInstance) {
        // Nothing to hydrate. Make it an insertion.
        insertNonHydratedInstance(hydrationParentFiber, fiber);
        isHydrating = false;
        hydrationParentFiber = fiber;
        return;
      }
      if (!canHydrate(fiber, nextInstance)) {
        // If we can't hydrate this instance let's try the next one.
        // We use this as a heuristic. It's based on intuition and not data so it
        // might be flawed or unnecessary.
        nextInstance = getNextHydratableSibling(nextInstance);
        if (!nextInstance || !canHydrate(fiber, nextInstance)) {
          // Nothing to hydrate. Make it an insertion.
          insertNonHydratedInstance(hydrationParentFiber, fiber);
          isHydrating = false;
          hydrationParentFiber = fiber;
          return;
        }
        // We matched the next one, we'll now assume that the first one was
        // superfluous and we'll delete it. Since we can't eagerly delete it
        // we'll have to schedule a deletion. To do that, this node needs a dummy
        // fiber associated with it.
        deleteHydratableInstance(hydrationParentFiber, nextHydratableInstance);
      }
      fiber.stateNode = nextInstance;
      hydrationParentFiber = fiber;
      nextHydratableInstance = getFirstHydratableChild(nextInstance);
    }

    function prepareToHydrateHostInstance(
      fiber,
      rootContainerInstance,
      hostContext
    ) {
      var instance = fiber.stateNode;
      var updatePayload = hydrateInstance(
        instance,
        fiber.type,
        fiber.memoizedProps,
        rootContainerInstance,
        hostContext,
        fiber
      );
      // TODO: Type this specific to this type of component.
      fiber.updateQueue = updatePayload;
      // If the update payload indicates that there is a change or if there
      // is a new ref we mark this as an update.
      if (updatePayload !== null) {
        return true;
      }
      return false;
    }

    function prepareToHydrateHostTextInstance(fiber) {
      var textInstance = fiber.stateNode;
      var textContent = fiber.memoizedProps;
      var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);
      {
        if (shouldUpdate) {
          // We assume that prepareToHydrateHostTextInstance is called in a context where the
          // hydration parent is the parent host component of this host text.
          var returnFiber = hydrationParentFiber;
          if (returnFiber !== null) {
            switch (returnFiber.tag) {
              case HostRoot: {
                var parentContainer = returnFiber.stateNode.containerInfo;
                didNotMatchHydratedContainerTextInstance(
                  parentContainer,
                  textInstance,
                  textContent
                );
                break;
              }
              case HostComponent: {
                var parentType = returnFiber.type;
                var parentProps = returnFiber.memoizedProps;
                var parentInstance = returnFiber.stateNode;
                didNotMatchHydratedTextInstance(
                  parentType,
                  parentProps,
                  parentInstance,
                  textInstance,
                  textContent
                );
                break;
              }
            }
          }
        }
      }
      return shouldUpdate;
    }

    function popToNextHostParent(fiber) {
      var parent = fiber['return'];
      while (
        parent !== null &&
        parent.tag !== HostComponent &&
        parent.tag !== HostRoot
      ) {
        parent = parent['return'];
      }
      hydrationParentFiber = parent;
    }

    function popHydrationState(fiber) {
      if (fiber !== hydrationParentFiber) {
        // We're deeper than the current hydration context, inside an inserted
        // tree.
        return false;
      }
      if (!isHydrating) {
        // If we're not currently hydrating but we're in a hydration context, then
        // we were an insertion and now need to pop up reenter hydration of our
        // siblings.
        popToNextHostParent(fiber);
        isHydrating = true;
        return false;
      }

      var type = fiber.type;

      // If we have any remaining hydratable nodes, we need to delete them now.
      // We only do this deeper than head and body since they tend to have random
      // other nodes in them. We also ignore components with pure text content in
      // side of them.
      // TODO: Better heuristic.
      if (
        fiber.tag !== HostComponent ||
        (type !== 'head' &&
          type !== 'body' &&
          !shouldSetTextContent(type, fiber.memoizedProps))
      ) {
        var nextInstance = nextHydratableInstance;
        while (nextInstance) {
          deleteHydratableInstance(fiber, nextInstance);
          nextInstance = getNextHydratableSibling(nextInstance);
        }
      }

      popToNextHostParent(fiber);
      nextHydratableInstance = hydrationParentFiber
        ? getNextHydratableSibling(fiber.stateNode)
        : null;
      return true;
    }

    function resetHydrationState() {
      hydrationParentFiber = null;
      nextHydratableInstance = null;
      isHydrating = false;
    }

    return {
      enterHydrationState: enterHydrationState,
      resetHydrationState: resetHydrationState,
      tryToClaimNextHydratableInstance: tryToClaimNextHydratableInstance,
      prepareToHydrateHostInstance: prepareToHydrateHostInstance,
      prepareToHydrateHostTextInstance: prepareToHydrateHostTextInstance,
      popHydrationState: popHydrationState,
    };
  };

  // This lets us hook into Fiber to debug what it's doing.
  // See https://github.com/facebook/react/pull/8033.
  // This is not part of the public API, not even for React DevTools.
  // You may only inject a debugTool if you work on React Fiber itself.
  var ReactFiberInstrumentation = {
    debugTool: null,
  };

  var ReactFiberInstrumentation_1 = ReactFiberInstrumentation;

  var defaultShowDialog = function (capturedError) {
    return true;
  };

  var showDialog = defaultShowDialog;

  function logCapturedError(capturedError) {
    var logError = showDialog(capturedError);

    // Allow injected showDialog() to prevent default console.error logging.
    // This enables renderers like ReactNative to better manage redbox behavior.
    if (logError === false) {
      return;
    }

    {
      var componentName = capturedError.componentName,
        componentStack = capturedError.componentStack,
        errorBoundaryName = capturedError.errorBoundaryName,
        errorBoundaryFound = capturedError.errorBoundaryFound,
        willRetry = capturedError.willRetry;

      var componentNameMessage = componentName
        ? 'The above error occurred in the <' + componentName + '> component:'
        : 'The above error occurred in one of your React components:';

      var errorBoundaryMessage = void 0;
      // errorBoundaryFound check is sufficient; errorBoundaryName check is to satisfy Flow.
      if (errorBoundaryFound && errorBoundaryName) {
        if (willRetry) {
          errorBoundaryMessage =
            'React will try to recreate this component tree from scratch ' +
            ('using the error boundary you provided, ' +
              errorBoundaryName +
              '.');
        } else {
          errorBoundaryMessage =
            'This error was initially handled by the error boundary ' +
            errorBoundaryName +
            '.\n' +
            'Recreating the tree from scratch failed so React will unmount the tree.';
        }
      } else {
        errorBoundaryMessage =
          'Consider adding an error boundary to your tree to customize error handling behavior.\n' +
          'Visit https://fb.me/react-error-boundaries to learn more about error boundaries.';
      }
      var combinedMessage =
        '' +
        componentNameMessage +
        componentStack +
        '\n\n' +
        ('' + errorBoundaryMessage);

      // In development, we provide our own message with just the component stack.
      // We don't include the original error message and JS stack because the browser
      // has already printed it. Even if the application swallows the error, it is still
      // displayed by the browser thanks to the DEV-only fake event trick in ReactErrorUtils.
      console.error(combinedMessage);
    }
  }

  var invokeGuardedCallback = ReactErrorUtils.invokeGuardedCallback;
  var hasCaughtError = ReactErrorUtils.hasCaughtError;
  var clearCaughtError = ReactErrorUtils.clearCaughtError;

  {
    var didWarnAboutStateTransition = false;
    var didWarnSetStateChildContext = false;
    var didWarnStateUpdateForUnmountedComponent = {};

    var warnAboutUpdateOnUnmounted = function (fiber) {
      var componentName = getComponentName(fiber) || 'ReactClass';
      if (didWarnStateUpdateForUnmountedComponent[componentName]) {
        return;
      }
      warning_1$1(
        false,
        'Can only update a mounted or mounting ' +
          'component. This usually means you called setState, replaceState, ' +
          'or forceUpdate on an unmounted component. This is a no-op.\n\nPlease ' +
          'check the code for the %s component.',
        componentName
      );
      didWarnStateUpdateForUnmountedComponent[componentName] = true;
    };

    var warnAboutInvalidUpdates = function (instance) {
      switch (ReactDebugCurrentFiber.phase) {
        case 'getChildContext':
          if (didWarnSetStateChildContext) {
            return;
          }
          warning_1$1(
            false,
            'setState(...): Cannot call setState() inside getChildContext()'
          );
          didWarnSetStateChildContext = true;
          break;
        case 'render':
          if (didWarnAboutStateTransition) {
            return;
          }
          warning_1$1(
            false,
            'Cannot update during an existing state transition (such as within ' +
              "`render` or another component's constructor). Render methods should " +
              'be a pure function of props and state; constructor side-effects are ' +
              'an anti-pattern, but can be moved to `componentWillMount`.'
          );
          didWarnAboutStateTransition = true;
          break;
      }
    };
  }

  var ReactFiberScheduler = function (config) {
    var hostContext = ReactFiberHostContext(config);
    var hydrationContext = ReactFiberHydrationContext(config);
    var popHostContainer = hostContext.popHostContainer,
      popHostContext = hostContext.popHostContext,
      resetHostContainer = hostContext.resetHostContainer;

    var _ReactFiberBeginWork = ReactFiberBeginWork(
        config,
        hostContext,
        hydrationContext,
        scheduleWork,
        computeExpirationForFiber
      ),
      beginWork = _ReactFiberBeginWork.beginWork,
      beginFailedWork = _ReactFiberBeginWork.beginFailedWork;

    var _ReactFiberCompleteWo = ReactFiberCompleteWork(
        config,
        hostContext,
        hydrationContext
      ),
      completeWork = _ReactFiberCompleteWo.completeWork;

    var _ReactFiberCommitWork = ReactFiberCommitWork(config, captureError),
      commitResetTextContent = _ReactFiberCommitWork.commitResetTextContent,
      commitPlacement = _ReactFiberCommitWork.commitPlacement,
      commitDeletion = _ReactFiberCommitWork.commitDeletion,
      commitWork = _ReactFiberCommitWork.commitWork,
      commitLifeCycles = _ReactFiberCommitWork.commitLifeCycles,
      commitAttachRef = _ReactFiberCommitWork.commitAttachRef,
      commitDetachRef = _ReactFiberCommitWork.commitDetachRef;

    var now = config.now,
      scheduleDeferredCallback = config.scheduleDeferredCallback,
      useSyncScheduling = config.useSyncScheduling,
      prepareForCommit = config.prepareForCommit,
      resetAfterCommit = config.resetAfterCommit;

    // Represents the current time in ms.

    var startTime = now();
    var mostRecentCurrentTime = msToExpirationTime(0);

    // Represents the expiration time that incoming updates should use. (If this
    // is NoWork, use the default strategy: async updates in async mode, sync
    // updates in sync mode.)
    var expirationContext = NoWork;

    var isWorking = false;

    // The next work in progress fiber that we're currently working on.
    var nextUnitOfWork = null;
    var nextRoot = null;
    // The time at which we're currently rendering work.
    var nextRenderExpirationTime = NoWork;

    // The next fiber with an effect that we're currently committing.
    var nextEffect = null;

    // Keep track of which fibers have captured an error that need to be handled.
    // Work is removed from this collection after componentDidCatch is called.
    var capturedErrors = null;
    // Keep track of which fibers have failed during the current batch of work.
    // This is a different set than capturedErrors, because it is not reset until
    // the end of the batch. This is needed to propagate errors correctly if a
    // subtree fails more than once.
    var failedBoundaries = null;
    // Error boundaries that captured an error during the current commit.
    var commitPhaseBoundaries = null;
    var firstUncaughtError = null;
    var didFatal = false;

    var isCommitting = false;
    var isUnmounting = false;

    // Used for performance tracking.
    var interruptedBy = null;

    function resetContextStack() {
      // Reset the stack
      reset();
      // Reset the cursors
      resetContext();
      resetHostContainer();
    }

    function commitAllHostEffects() {
      while (nextEffect !== null) {
        {
          ReactDebugCurrentFiber.setCurrentFiber(nextEffect);
        }
        recordEffect();

        var effectTag = nextEffect.effectTag;
        if (effectTag & ContentReset) {
          commitResetTextContent(nextEffect);
        }

        if (effectTag & Ref) {
          var current = nextEffect.alternate;
          if (current !== null) {
            commitDetachRef(current);
          }
        }

        // The following switch statement is only concerned about placement,
        // updates, and deletions. To avoid needing to add a case for every
        // possible bitmap value, we remove the secondary effects from the
        // effect tag and switch on that value.
        var primaryEffectTag =
          effectTag & ~(Callback | Err | ContentReset | Ref | PerformedWork);
        switch (primaryEffectTag) {
          case Placement: {
            commitPlacement(nextEffect);
            // Clear the "placement" from effect tag so that we know that this is inserted, before
            // any life-cycles like componentDidMount gets called.
            // TODO: findDOMNode doesn't rely on this any more but isMounted
            // does and isMounted is deprecated anyway so we should be able
            // to kill this.
            nextEffect.effectTag &= ~Placement;
            break;
          }
          case PlacementAndUpdate: {
            // Placement
            commitPlacement(nextEffect);
            // Clear the "placement" from effect tag so that we know that this is inserted, before
            // any life-cycles like componentDidMount gets called.
            nextEffect.effectTag &= ~Placement;

            // Update
            var _current = nextEffect.alternate;
            commitWork(_current, nextEffect);
            break;
          }
          case Update: {
            var _current2 = nextEffect.alternate;
            commitWork(_current2, nextEffect);
            break;
          }
          case Deletion: {
            isUnmounting = true;
            commitDeletion(nextEffect);
            isUnmounting = false;
            break;
          }
        }
        nextEffect = nextEffect.nextEffect;
      }

      {
        ReactDebugCurrentFiber.resetCurrentFiber();
      }
    }

    function commitAllLifeCycles() {
      while (nextEffect !== null) {
        var effectTag = nextEffect.effectTag;

        if (effectTag & (Update | Callback)) {
          recordEffect();
          var current = nextEffect.alternate;
          commitLifeCycles(current, nextEffect);
        }

        if (effectTag & Ref) {
          recordEffect();
          commitAttachRef(nextEffect);
        }

        if (effectTag & Err) {
          recordEffect();
          commitErrorHandling(nextEffect);
        }

        var next = nextEffect.nextEffect;
        // Ensure that we clean these up so that we don't accidentally keep them.
        // I'm not actually sure this matters because we can't reset firstEffect
        // and lastEffect since they're on every node, not just the effectful
        // ones. So we have to clean everything as we reuse nodes anyway.
        nextEffect.nextEffect = null;
        // Ensure that we reset the effectTag here so that we can rely on effect
        // tags to reason about the current life-cycle.
        nextEffect = next;
      }
    }

    function commitRoot(finishedWork) {
      // We keep track of this so that captureError can collect any boundaries
      // that capture an error during the commit phase. The reason these aren't
      // local to this function is because errors that occur during cWU are
      // captured elsewhere, to prevent the unmount from being interrupted.
      isWorking = true;
      isCommitting = true;
      startCommitTimer();

      var root = finishedWork.stateNode;
      !(root.current !== finishedWork)
        ? invariant_1$1(
            false,
            'Cannot commit the same tree as before. This is probably a bug related to the return field. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      root.isReadyForCommit = false;

      // Reset this to null before calling lifecycles
      ReactCurrentOwner.current = null;

      var firstEffect = void 0;
      if (finishedWork.effectTag > PerformedWork) {
        // A fiber's effect list consists only of its children, not itself. So if
        // the root has an effect, we need to add it to the end of the list. The
        // resulting list is the set that would belong to the root's parent, if
        // it had one; that is, all the effects in the tree including the root.
        if (finishedWork.lastEffect !== null) {
          finishedWork.lastEffect.nextEffect = finishedWork;
          firstEffect = finishedWork.firstEffect;
        } else {
          firstEffect = finishedWork;
        }
      } else {
        // There is no effect on the root.
        firstEffect = finishedWork.firstEffect;
      }

      prepareForCommit();

      // Commit all the side-effects within a tree. We'll do this in two passes.
      // The first pass performs all the host insertions, updates, deletions and
      // ref unmounts.
      nextEffect = firstEffect;
      startCommitHostEffectsTimer();
      while (nextEffect !== null) {
        var didError = false;
        var _error = void 0;
        {
          invokeGuardedCallback(null, commitAllHostEffects, null);
          if (hasCaughtError()) {
            didError = true;
            _error = clearCaughtError();
          }
        }
        if (didError) {
          !(nextEffect !== null)
            ? invariant_1$1(
                false,
                'Should have next effect. This error is likely caused by a bug in React. Please file an issue.'
              )
            : void 0;
          captureError(nextEffect, _error);
          // Clean-up
          if (nextEffect !== null) {
            nextEffect = nextEffect.nextEffect;
          }
        }
      }
      stopCommitHostEffectsTimer();

      resetAfterCommit();

      // The work-in-progress tree is now the current tree. This must come after
      // the first pass of the commit phase, so that the previous tree is still
      // current during componentWillUnmount, but before the second pass, so that
      // the finished work is current during componentDidMount/Update.
      root.current = finishedWork;

      // In the second pass we'll perform all life-cycles and ref callbacks.
      // Life-cycles happen as a separate pass so that all placements, updates,
      // and deletions in the entire tree have already been invoked.
      // This pass also triggers any renderer-specific initial effects.
      nextEffect = firstEffect;
      startCommitLifeCyclesTimer();
      while (nextEffect !== null) {
        var _didError = false;
        var _error2 = void 0;
        {
          invokeGuardedCallback(null, commitAllLifeCycles, null);
          if (hasCaughtError()) {
            _didError = true;
            _error2 = clearCaughtError();
          }
        }
        if (_didError) {
          !(nextEffect !== null)
            ? invariant_1$1(
                false,
                'Should have next effect. This error is likely caused by a bug in React. Please file an issue.'
              )
            : void 0;
          captureError(nextEffect, _error2);
          if (nextEffect !== null) {
            nextEffect = nextEffect.nextEffect;
          }
        }
      }

      isCommitting = false;
      isWorking = false;
      stopCommitLifeCyclesTimer();
      stopCommitTimer();
      if (typeof onCommitRoot === 'function') {
        onCommitRoot(finishedWork.stateNode);
      }
      if (true && ReactFiberInstrumentation_1.debugTool) {
        ReactFiberInstrumentation_1.debugTool.onCommitWork(finishedWork);
      }

      // If we caught any errors during this commit, schedule their boundaries
      // to update.
      if (commitPhaseBoundaries) {
        commitPhaseBoundaries.forEach(scheduleErrorRecovery);
        commitPhaseBoundaries = null;
      }

      if (firstUncaughtError !== null) {
        var _error3 = firstUncaughtError;
        firstUncaughtError = null;
        onUncaughtError(_error3);
      }

      var remainingTime = root.current.expirationTime;

      if (remainingTime === NoWork) {
        capturedErrors = null;
        failedBoundaries = null;
      }

      return remainingTime;
    }

    function resetExpirationTime(workInProgress, renderTime) {
      if (renderTime !== Never && workInProgress.expirationTime === Never) {
        // The children of this component are hidden. Don't bubble their
        // expiration times.
        return;
      }

      // Check for pending updates.
      var newExpirationTime = getUpdateExpirationTime(workInProgress);

      // TODO: Calls need to visit stateNode

      // Bubble up the earliest expiration time.
      var child = workInProgress.child;
      while (child !== null) {
        if (
          child.expirationTime !== NoWork &&
          (newExpirationTime === NoWork ||
            newExpirationTime > child.expirationTime)
        ) {
          newExpirationTime = child.expirationTime;
        }
        child = child.sibling;
      }
      workInProgress.expirationTime = newExpirationTime;
    }

    function completeUnitOfWork(workInProgress) {
      while (true) {
        // The current, flushed, state of this fiber is the alternate.
        // Ideally nothing should rely on this, but relying on it here
        // means that we don't need an additional field on the work in
        // progress.
        var current = workInProgress.alternate;
        {
          ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
        }
        var next = completeWork(
          current,
          workInProgress,
          nextRenderExpirationTime
        );
        {
          ReactDebugCurrentFiber.resetCurrentFiber();
        }

        var returnFiber = workInProgress['return'];
        var siblingFiber = workInProgress.sibling;

        resetExpirationTime(workInProgress, nextRenderExpirationTime);

        if (next !== null) {
          stopWorkTimer(workInProgress);
          if (true && ReactFiberInstrumentation_1.debugTool) {
            ReactFiberInstrumentation_1.debugTool.onCompleteWork(
              workInProgress
            );
          }
          // If completing this work spawned new work, do that next. We'll come
          // back here again.
          return next;
        }

        if (returnFiber !== null) {
          // Append all the effects of the subtree and this fiber onto the effect
          // list of the parent. The completion order of the children affects the
          // side-effect order.
          if (returnFiber.firstEffect === null) {
            returnFiber.firstEffect = workInProgress.firstEffect;
          }
          if (workInProgress.lastEffect !== null) {
            if (returnFiber.lastEffect !== null) {
              returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
            }
            returnFiber.lastEffect = workInProgress.lastEffect;
          }

          // If this fiber had side-effects, we append it AFTER the children's
          // side-effects. We can perform certain side-effects earlier if
          // needed, by doing multiple passes over the effect list. We don't want
          // to schedule our own side-effect on our own list because if end up
          // reusing children we'll schedule this effect onto itself since we're
          // at the end.
          var effectTag = workInProgress.effectTag;
          // Skip both NoWork and PerformedWork tags when creating the effect list.
          // PerformedWork effect is read by React DevTools but shouldn't be committed.
          if (effectTag > PerformedWork) {
            if (returnFiber.lastEffect !== null) {
              returnFiber.lastEffect.nextEffect = workInProgress;
            } else {
              returnFiber.firstEffect = workInProgress;
            }
            returnFiber.lastEffect = workInProgress;
          }
        }

        stopWorkTimer(workInProgress);
        if (true && ReactFiberInstrumentation_1.debugTool) {
          ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
        }

        if (siblingFiber !== null) {
          // If there is more work to do in this returnFiber, do that next.
          return siblingFiber;
        } else if (returnFiber !== null) {
          // If there's no more work in this returnFiber. Complete the returnFiber.
          workInProgress = returnFiber;
          continue;
        } else {
          // We've reached the root.
          var root = workInProgress.stateNode;
          root.isReadyForCommit = true;
          return null;
        }
      }

      // Without this explicit null return Flow complains of invalid return type
      // TODO Remove the above while(true) loop
      // eslint-disable-next-line no-unreachable
      return null;
    }

    function performUnitOfWork(workInProgress) {
      // The current, flushed, state of this fiber is the alternate.
      // Ideally nothing should rely on this, but relying on it here
      // means that we don't need an additional field on the work in
      // progress.
      var current = workInProgress.alternate;

      // See if beginning this work spawns more work.
      startWorkTimer(workInProgress);
      {
        ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
      }
      var next = beginWork(current, workInProgress, nextRenderExpirationTime);
      {
        ReactDebugCurrentFiber.resetCurrentFiber();
      }
      if (true && ReactFiberInstrumentation_1.debugTool) {
        ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
      }

      if (next === null) {
        // If this doesn't spawn new work, complete the current work.
        next = completeUnitOfWork(workInProgress);
      }

      ReactCurrentOwner.current = null;

      return next;
    }

    function performFailedUnitOfWork(workInProgress) {
      // The current, flushed, state of this fiber is the alternate.
      // Ideally nothing should rely on this, but relying on it here
      // means that we don't need an additional field on the work in
      // progress.
      var current = workInProgress.alternate;

      // See if beginning this work spawns more work.
      startWorkTimer(workInProgress);
      {
        ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
      }
      var next = beginFailedWork(
        current,
        workInProgress,
        nextRenderExpirationTime
      );
      {
        ReactDebugCurrentFiber.resetCurrentFiber();
      }
      if (true && ReactFiberInstrumentation_1.debugTool) {
        ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
      }

      if (next === null) {
        // If this doesn't spawn new work, complete the current work.
        next = completeUnitOfWork(workInProgress);
      }

      ReactCurrentOwner.current = null;

      return next;
    }

    function workLoop(expirationTime) {
      if (capturedErrors !== null) {
        // If there are unhandled errors, switch to the slow work loop.
        // TODO: How to avoid this check in the fast path? Maybe the renderer
        // could keep track of which roots have unhandled errors and call a
        // forked version of renderRoot.
        slowWorkLoopThatChecksForFailedWork(expirationTime);
        return;
      }
      if (
        nextRenderExpirationTime === NoWork ||
        nextRenderExpirationTime > expirationTime
      ) {
        return;
      }

      if (nextRenderExpirationTime <= mostRecentCurrentTime) {
        // Flush all expired work.
        while (nextUnitOfWork !== null) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        }
      } else {
        // Flush asynchronous work until the deadline runs out of time.
        while (nextUnitOfWork !== null && !shouldYield()) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        }
      }
    }

    function slowWorkLoopThatChecksForFailedWork(expirationTime) {
      if (
        nextRenderExpirationTime === NoWork ||
        nextRenderExpirationTime > expirationTime
      ) {
        return;
      }

      if (nextRenderExpirationTime <= mostRecentCurrentTime) {
        // Flush all expired work.
        while (nextUnitOfWork !== null) {
          if (hasCapturedError(nextUnitOfWork)) {
            // Use a forked version of performUnitOfWork
            nextUnitOfWork = performFailedUnitOfWork(nextUnitOfWork);
          } else {
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          }
        }
      } else {
        // Flush asynchronous work until the deadline runs out of time.
        while (nextUnitOfWork !== null && !shouldYield()) {
          if (hasCapturedError(nextUnitOfWork)) {
            // Use a forked version of performUnitOfWork
            nextUnitOfWork = performFailedUnitOfWork(nextUnitOfWork);
          } else {
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          }
        }
      }
    }

    function renderRootCatchBlock(root, failedWork, boundary, expirationTime) {
      // We're going to restart the error boundary that captured the error.
      // Conceptually, we're unwinding the stack. We need to unwind the
      // context stack, too.
      unwindContexts(failedWork, boundary);

      // Restart the error boundary using a forked version of
      // performUnitOfWork that deletes the boundary's children. The entire
      // failed subree will be unmounted. During the commit phase, a special
      // lifecycle method is called on the error boundary, which triggers
      // a re-render.
      nextUnitOfWork = performFailedUnitOfWork(boundary);

      // Continue working.
      workLoop(expirationTime);
    }

    function renderRoot(root, expirationTime) {
      !!isWorking
        ? invariant_1$1(
            false,
            'renderRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      isWorking = true;

      // We're about to mutate the work-in-progress tree. If the root was pending
      // commit, it no longer is: we'll need to complete it again.
      root.isReadyForCommit = false;

      // Check if we're starting from a fresh stack, or if we're resuming from
      // previously yielded work.
      if (
        root !== nextRoot ||
        expirationTime !== nextRenderExpirationTime ||
        nextUnitOfWork === null
      ) {
        // Reset the stack and start working from the root.
        resetContextStack();
        nextRoot = root;
        nextRenderExpirationTime = expirationTime;
        nextUnitOfWork = createWorkInProgress(
          nextRoot.current,
          null,
          expirationTime
        );
      }

      startWorkLoopTimer(nextUnitOfWork);

      var didError = false;
      var error = null;
      {
        invokeGuardedCallback(null, workLoop, null, expirationTime);
        if (hasCaughtError()) {
          didError = true;
          error = clearCaughtError();
        }
      }

      // An error was thrown during the render phase.
      while (didError) {
        if (didFatal) {
          // This was a fatal error. Don't attempt to recover from it.
          firstUncaughtError = error;
          break;
        }

        var failedWork = nextUnitOfWork;
        if (failedWork === null) {
          // An error was thrown but there's no current unit of work. This can
          // happen during the commit phase if there's a bug in the renderer.
          didFatal = true;
          continue;
        }

        // "Capture" the error by finding the nearest boundary. If there is no
        // error boundary, we use the root.
        var boundary = captureError(failedWork, error);
        !(boundary !== null)
          ? invariant_1$1(
              false,
              'Should have found an error boundary. This error is likely caused by a bug in React. Please file an issue.'
            )
          : void 0;

        if (didFatal) {
          // The error we just captured was a fatal error. This happens
          // when the error propagates to the root more than once.
          continue;
        }

        didError = false;
        error = null;
        {
          invokeGuardedCallback(
            null,
            renderRootCatchBlock,
            null,
            root,
            failedWork,
            boundary,
            expirationTime
          );
          if (hasCaughtError()) {
            didError = true;
            error = clearCaughtError();
            continue;
          }
        }
        // We're finished working. Exit the error loop.
        break;
      }

      var uncaughtError = firstUncaughtError;

      // We're done performing work. Time to clean up.
      stopWorkLoopTimer(interruptedBy);
      interruptedBy = null;
      isWorking = false;
      didFatal = false;
      firstUncaughtError = null;

      if (uncaughtError !== null) {
        onUncaughtError(uncaughtError);
      }

      return root.isReadyForCommit ? root.current.alternate : null;
    }

    // Returns the boundary that captured the error, or null if the error is ignored
    function captureError(failedWork, error) {
      // It is no longer valid because we exited the user code.
      ReactCurrentOwner.current = null;
      {
        ReactDebugCurrentFiber.resetCurrentFiber();
      }

      // Search for the nearest error boundary.
      var boundary = null;

      // Passed to logCapturedError()
      var errorBoundaryFound = false;
      var willRetry = false;
      var errorBoundaryName = null;

      // Host containers are a special case. If the failed work itself is a host
      // container, then it acts as its own boundary. In all other cases, we
      // ignore the work itself and only search through the parents.
      if (failedWork.tag === HostRoot) {
        boundary = failedWork;

        if (isFailedBoundary(failedWork)) {
          // If this root already failed, there must have been an error when
          // attempting to unmount it. This is a worst-case scenario and
          // should only be possible if there's a bug in the renderer.
          didFatal = true;
        }
      } else {
        var node = failedWork['return'];
        while (node !== null && boundary === null) {
          if (node.tag === ClassComponent) {
            var instance = node.stateNode;
            if (typeof instance.componentDidCatch === 'function') {
              errorBoundaryFound = true;
              errorBoundaryName = getComponentName(node);

              // Found an error boundary!
              boundary = node;
              willRetry = true;
            }
          } else if (node.tag === HostRoot) {
            // Treat the root like a no-op error boundary
            boundary = node;
          }

          if (isFailedBoundary(node)) {
            // This boundary is already in a failed state.

            // If we're currently unmounting, that means this error was
            // thrown while unmounting a failed subtree. We should ignore
            // the error.
            if (isUnmounting) {
              return null;
            }

            // If we're in the commit phase, we should check to see if
            // this boundary already captured an error during this commit.
            // This case exists because multiple errors can be thrown during
            // a single commit without interruption.
            if (
              commitPhaseBoundaries !== null &&
              (commitPhaseBoundaries.has(node) ||
                (node.alternate !== null &&
                  commitPhaseBoundaries.has(node.alternate)))
            ) {
              // If so, we should ignore this error.
              return null;
            }

            // The error should propagate to the next boundary -— we keep looking.
            boundary = null;
            willRetry = false;
          }

          node = node['return'];
        }
      }

      if (boundary !== null) {
        // Add to the collection of failed boundaries. This lets us know that
        // subsequent errors in this subtree should propagate to the next boundary.
        if (failedBoundaries === null) {
          failedBoundaries = new Set();
        }
        failedBoundaries.add(boundary);

        // This method is unsafe outside of the begin and complete phases.
        // We might be in the commit phase when an error is captured.
        // The risk is that the return path from this Fiber may not be accurate.
        // That risk is acceptable given the benefit of providing users more context.
        var _componentStack = getStackAddendumByWorkInProgressFiber(failedWork);
        var _componentName = getComponentName(failedWork);

        // Add to the collection of captured errors. This is stored as a global
        // map of errors and their component stack location keyed by the boundaries
        // that capture them. We mostly use this Map as a Set; it's a Map only to
        // avoid adding a field to Fiber to store the error.
        if (capturedErrors === null) {
          capturedErrors = new Map();
        }

        var capturedError = {
          componentName: _componentName,
          componentStack: _componentStack,
          error: error,
          errorBoundary: errorBoundaryFound ? boundary.stateNode : null,
          errorBoundaryFound: errorBoundaryFound,
          errorBoundaryName: errorBoundaryName,
          willRetry: willRetry,
        };

        capturedErrors.set(boundary, capturedError);

        try {
          logCapturedError(capturedError);
        } catch (e) {
          // Prevent cycle if logCapturedError() throws.
          // A cycle may still occur if logCapturedError renders a component that throws.
          console.error(e);
        }

        // If we're in the commit phase, defer scheduling an update on the
        // boundary until after the commit is complete
        if (isCommitting) {
          if (commitPhaseBoundaries === null) {
            commitPhaseBoundaries = new Set();
          }
          commitPhaseBoundaries.add(boundary);
        } else {
          // Otherwise, schedule an update now.
          // TODO: Is this actually necessary during the render phase? Is it
          // possible to unwind and continue rendering at the same priority,
          // without corrupting internal state?
          scheduleErrorRecovery(boundary);
        }
        return boundary;
      } else if (firstUncaughtError === null) {
        // If no boundary is found, we'll need to throw the error
        firstUncaughtError = error;
      }
      return null;
    }

    function hasCapturedError(fiber) {
      // TODO: capturedErrors should store the boundary instance, to avoid needing
      // to check the alternate.
      return (
        capturedErrors !== null &&
        (capturedErrors.has(fiber) ||
          (fiber.alternate !== null && capturedErrors.has(fiber.alternate)))
      );
    }

    function isFailedBoundary(fiber) {
      // TODO: failedBoundaries should store the boundary instance, to avoid
      // needing to check the alternate.
      return (
        failedBoundaries !== null &&
        (failedBoundaries.has(fiber) ||
          (fiber.alternate !== null && failedBoundaries.has(fiber.alternate)))
      );
    }

    function commitErrorHandling(effectfulFiber) {
      var capturedError = void 0;
      if (capturedErrors !== null) {
        capturedError = capturedErrors.get(effectfulFiber);
        capturedErrors['delete'](effectfulFiber);
        if (capturedError == null) {
          if (effectfulFiber.alternate !== null) {
            effectfulFiber = effectfulFiber.alternate;
            capturedError = capturedErrors.get(effectfulFiber);
            capturedErrors['delete'](effectfulFiber);
          }
        }
      }

      !(capturedError != null)
        ? invariant_1$1(
            false,
            'No error for given unit of work. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;

      switch (effectfulFiber.tag) {
        case ClassComponent:
          var instance = effectfulFiber.stateNode;

          var info = {
            componentStack: capturedError.componentStack,
          };

          // Allow the boundary to handle the error, usually by scheduling
          // an update to itself
          instance.componentDidCatch(capturedError.error, info);
          return;
        case HostRoot:
          if (firstUncaughtError === null) {
            firstUncaughtError = capturedError.error;
          }
          return;
        default:
          invariant_1$1(
            false,
            'Invalid type of work. This error is likely caused by a bug in React. Please file an issue.'
          );
      }
    }

    function unwindContexts(from, to) {
      var node = from;
      while (node !== null) {
        switch (node.tag) {
          case ClassComponent:
            popContextProvider(node);
            break;
          case HostComponent:
            popHostContext(node);
            break;
          case HostRoot:
            popHostContainer(node);
            break;
          case HostPortal:
            popHostContainer(node);
            break;
        }
        if (node === to || node.alternate === to) {
          stopFailedWorkTimer(node);
          break;
        } else {
          stopWorkTimer(node);
        }
        node = node['return'];
      }
    }

    function computeAsyncExpiration() {
      // Given the current clock time, returns an expiration time. We use rounding
      // to batch like updates together.
      // Should complete within ~1000ms. 1200ms max.
      var currentTime = recalculateCurrentTime();
      var expirationMs = 1000;
      var bucketSizeMs = 200;
      return computeExpirationBucket(currentTime, expirationMs, bucketSizeMs);
    }

    function computeExpirationForFiber(fiber) {
      var expirationTime = void 0;
      if (expirationContext !== NoWork) {
        // An explicit expiration context was set;
        expirationTime = expirationContext;
      } else if (isWorking) {
        if (isCommitting) {
          // Updates that occur during the commit phase should have sync priority
          // by default.
          expirationTime = Sync;
        } else {
          // Updates during the render phase should expire at the same time as
          // the work that is being rendered.
          expirationTime = nextRenderExpirationTime;
        }
      } else {
        // No explicit expiration context was set, and we're not currently
        // performing work. Calculate a new expiration time.
        if (useSyncScheduling && !(fiber.internalContextTag & AsyncUpdates)) {
          // This is a sync update
          expirationTime = Sync;
        } else {
          // This is an async update
          expirationTime = computeAsyncExpiration();
        }
      }
      return expirationTime;
    }

    function scheduleWork(fiber, expirationTime) {
      return scheduleWorkImpl(fiber, expirationTime, false);
    }

    function scheduleWorkImpl(fiber, expirationTime, isErrorRecovery) {
      recordScheduleUpdate();

      {
        if (!isErrorRecovery && fiber.tag === ClassComponent) {
          var instance = fiber.stateNode;
          warnAboutInvalidUpdates(instance);
        }
      }

      var node = fiber;
      while (node !== null) {
        // Walk the parent path to the root and update each node's
        // expiration time.
        if (
          node.expirationTime === NoWork ||
          node.expirationTime > expirationTime
        ) {
          node.expirationTime = expirationTime;
        }
        if (node.alternate !== null) {
          if (
            node.alternate.expirationTime === NoWork ||
            node.alternate.expirationTime > expirationTime
          ) {
            node.alternate.expirationTime = expirationTime;
          }
        }
        if (node['return'] === null) {
          if (node.tag === HostRoot) {
            var root = node.stateNode;
            if (
              !isWorking &&
              root === nextRoot &&
              expirationTime <= nextRenderExpirationTime
            ) {
              // Restart the root from the top.
              if (nextUnitOfWork !== null) {
                // This is an interruption. (Used for performance tracking.)
                interruptedBy = fiber;
              }
              nextRoot = null;
              nextUnitOfWork = null;
              nextRenderExpirationTime = NoWork;
            }
            requestWork(root, expirationTime);
          } else {
            {
              if (!isErrorRecovery && fiber.tag === ClassComponent) {
                warnAboutUpdateOnUnmounted(fiber);
              }
            }
            return;
          }
        }
        node = node['return'];
      }
    }

    function scheduleErrorRecovery(fiber) {
      scheduleWorkImpl(fiber, Sync, true);
    }

    function recalculateCurrentTime() {
      // Subtract initial time so it fits inside 32bits
      var ms = now() - startTime;
      mostRecentCurrentTime = msToExpirationTime(ms);
      return mostRecentCurrentTime;
    }

    function deferredUpdates(fn) {
      var previousExpirationContext = expirationContext;
      expirationContext = computeAsyncExpiration();
      try {
        return fn();
      } finally {
        expirationContext = previousExpirationContext;
      }
    }

    function syncUpdates(fn) {
      var previousExpirationContext = expirationContext;
      expirationContext = Sync;
      try {
        return fn();
      } finally {
        expirationContext = previousExpirationContext;
      }
    }

    // TODO: Everything below this is written as if it has been lifted to the
    // renderers. I'll do this in a follow-up.

    // Linked-list of roots
    var firstScheduledRoot = null;
    var lastScheduledRoot = null;

    var isCallbackScheduled = false;
    var isRendering = false;
    var nextFlushedRoot = null;
    var nextFlushedExpirationTime = NoWork;
    var deadlineDidExpire = false;
    var hasUnhandledError = false;
    var unhandledError = null;
    var deadline = null;

    var isBatchingUpdates = false;
    var isUnbatchingUpdates = false;

    // Use these to prevent an infinite loop of nested updates
    var NESTED_UPDATE_LIMIT = 1000;
    var nestedUpdateCount = 0;

    var timeHeuristicForUnitOfWork = 1;

    // requestWork is called by the scheduler whenever a root receives an update.
    // It's up to the renderer to call renderRoot at some point in the future.
    function requestWork(root, expirationTime) {
      if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
        invariant_1$1(
          false,
          'Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.'
        );
      }

      // Add the root to the schedule.
      // Check if this root is already part of the schedule.
      if (root.nextScheduledRoot === null) {
        // This root is not already scheduled. Add it.
        root.remainingExpirationTime = expirationTime;
        if (lastScheduledRoot === null) {
          firstScheduledRoot = lastScheduledRoot = root;
          root.nextScheduledRoot = root;
        } else {
          lastScheduledRoot.nextScheduledRoot = root;
          lastScheduledRoot = root;
          lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
        }
      } else {
        // This root is already scheduled, but its priority may have increased.
        var remainingExpirationTime = root.remainingExpirationTime;
        if (
          remainingExpirationTime === NoWork ||
          expirationTime < remainingExpirationTime
        ) {
          // Update the priority.
          root.remainingExpirationTime = expirationTime;
        }
      }

      if (isRendering) {
        // Prevent reentrancy. Remaining work will be scheduled at the end of
        // the currently rendering batch.
        return;
      }

      if (isBatchingUpdates) {
        // Flush work at the end of the batch.
        if (isUnbatchingUpdates) {
          // ...unless we're inside unbatchedUpdates, in which case we should
          // flush it now.
          performWorkOnRoot(root, Sync);
        }
        return;
      }

      // TODO: Get rid of Sync and use current time?
      if (expirationTime === Sync) {
        performWork(Sync, null);
      } else if (!isCallbackScheduled) {
        isCallbackScheduled = true;
        scheduleDeferredCallback(performAsyncWork);
      }
    }

    function findHighestPriorityRoot() {
      var highestPriorityWork = NoWork;
      var highestPriorityRoot = null;

      if (lastScheduledRoot !== null) {
        var previousScheduledRoot = lastScheduledRoot;
        var root = firstScheduledRoot;
        while (root !== null) {
          var remainingExpirationTime = root.remainingExpirationTime;
          if (remainingExpirationTime === NoWork) {
            // This root no longer has work. Remove it from the scheduler.

            // TODO: This check is redudant, but Flow is confused by the branch
            // below where we set lastScheduledRoot to null, even though we break
            // from the loop right after.
            !(previousScheduledRoot !== null && lastScheduledRoot !== null)
              ? invariant_1$1(
                  false,
                  'Should have a previous and last root. This error is likely caused by a bug in React. Please file an issue.'
                )
              : void 0;
            if (root === root.nextScheduledRoot) {
              // This is the only root in the list.
              root.nextScheduledRoot = null;
              firstScheduledRoot = lastScheduledRoot = null;
              break;
            } else if (root === firstScheduledRoot) {
              // This is the first root in the list.
              var next = root.nextScheduledRoot;
              firstScheduledRoot = next;
              lastScheduledRoot.nextScheduledRoot = next;
              root.nextScheduledRoot = null;
            } else if (root === lastScheduledRoot) {
              // This is the last root in the list.
              lastScheduledRoot = previousScheduledRoot;
              lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
              root.nextScheduledRoot = null;
              break;
            } else {
              previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot;
              root.nextScheduledRoot = null;
            }
            root = previousScheduledRoot.nextScheduledRoot;
          } else {
            if (
              highestPriorityWork === NoWork ||
              remainingExpirationTime < highestPriorityWork
            ) {
              // Update the priority, if it's higher
              highestPriorityWork = remainingExpirationTime;
              highestPriorityRoot = root;
            }
            if (root === lastScheduledRoot) {
              break;
            }
            previousScheduledRoot = root;
            root = root.nextScheduledRoot;
          }
        }
      }

      // If the next root is the same as the previous root, this is a nested
      // update. To prevent an infinite loop, increment the nested update count.
      var previousFlushedRoot = nextFlushedRoot;
      if (
        previousFlushedRoot !== null &&
        previousFlushedRoot === highestPriorityRoot
      ) {
        nestedUpdateCount++;
      } else {
        // Reset whenever we switch roots.
        nestedUpdateCount = 0;
      }
      nextFlushedRoot = highestPriorityRoot;
      nextFlushedExpirationTime = highestPriorityWork;
    }

    function performAsyncWork(dl) {
      performWork(NoWork, dl);
    }

    function performWork(minExpirationTime, dl) {
      deadline = dl;

      // Keep working on roots until there's no more work, or until the we reach
      // the deadlne.
      findHighestPriorityRoot();
      while (
        nextFlushedRoot !== null &&
        nextFlushedExpirationTime !== NoWork &&
        (minExpirationTime === NoWork ||
          nextFlushedExpirationTime <= minExpirationTime) &&
        !deadlineDidExpire
      ) {
        performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
        // Find the next highest priority work.
        findHighestPriorityRoot();
      }

      // We're done flushing work. Either we ran out of time in this callback,
      // or there's no more work left with sufficient priority.

      // If we're inside a callback, set this to false since we just completed it.
      if (deadline !== null) {
        isCallbackScheduled = false;
      }
      // If there's work left over, schedule a new callback.
      if (nextFlushedRoot !== null && !isCallbackScheduled) {
        isCallbackScheduled = true;
        scheduleDeferredCallback(performAsyncWork);
      }

      // Clean-up.
      deadline = null;
      deadlineDidExpire = false;
      nestedUpdateCount = 0;

      if (hasUnhandledError) {
        var _error4 = unhandledError;
        unhandledError = null;
        hasUnhandledError = false;
        throw _error4;
      }
    }

    function performWorkOnRoot(root, expirationTime) {
      !!isRendering
        ? invariant_1$1(
            false,
            'performWorkOnRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;

      isRendering = true;

      // Check if this is async work or sync/expired work.
      // TODO: Pass current time as argument to renderRoot, commitRoot
      if (expirationTime <= recalculateCurrentTime()) {
        // Flush sync work.
        var finishedWork = root.finishedWork;
        if (finishedWork !== null) {
          // This root is already complete. We can commit it.
          root.finishedWork = null;
          root.remainingExpirationTime = commitRoot(finishedWork);
        } else {
          root.finishedWork = null;
          finishedWork = renderRoot(root, expirationTime);
          if (finishedWork !== null) {
            // We've completed the root. Commit it.
            root.remainingExpirationTime = commitRoot(finishedWork);
          }
        }
      } else {
        // Flush async work.
        var _finishedWork = root.finishedWork;
        if (_finishedWork !== null) {
          // This root is already complete. We can commit it.
          root.finishedWork = null;
          root.remainingExpirationTime = commitRoot(_finishedWork);
        } else {
          root.finishedWork = null;
          _finishedWork = renderRoot(root, expirationTime);
          if (_finishedWork !== null) {
            // We've completed the root. Check the deadline one more time
            // before committing.
            if (!shouldYield()) {
              // Still time left. Commit the root.
              root.remainingExpirationTime = commitRoot(_finishedWork);
            } else {
              // There's no time left. Mark this root as complete. We'll come
              // back and commit it later.
              root.finishedWork = _finishedWork;
            }
          }
        }
      }

      isRendering = false;
    }

    // When working on async work, the reconciler asks the renderer if it should
    // yield execution. For DOM, we implement this with requestIdleCallback.
    function shouldYield() {
      if (deadline === null) {
        return false;
      }
      if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
        return false;
      }
      deadlineDidExpire = true;
      return true;
    }

    // TODO: Not happy about this hook. Conceptually, renderRoot should return a
    // tuple of (isReadyForCommit, didError, error)
    function onUncaughtError(error) {
      !(nextFlushedRoot !== null)
        ? invariant_1$1(
            false,
            'Should be working on a root. This error is likely caused by a bug in React. Please file an issue.'
          )
        : void 0;
      // Unschedule this root so we don't work on it again until there's
      // another update.
      nextFlushedRoot.remainingExpirationTime = NoWork;
      if (!hasUnhandledError) {
        hasUnhandledError = true;
        unhandledError = error;
      }
    }

    // TODO: Batching should be implemented at the renderer level, not inside
    // the reconciler.
    function batchedUpdates(fn, a) {
      var previousIsBatchingUpdates = isBatchingUpdates;
      isBatchingUpdates = true;
      try {
        return fn(a);
      } finally {
        isBatchingUpdates = previousIsBatchingUpdates;
        if (!isBatchingUpdates && !isRendering) {
          performWork(Sync, null);
        }
      }
    }

    // TODO: Batching should be implemented at the renderer level, not inside
    // the reconciler.
    function unbatchedUpdates(fn) {
      if (isBatchingUpdates && !isUnbatchingUpdates) {
        isUnbatchingUpdates = true;
        try {
          return fn();
        } finally {
          isUnbatchingUpdates = false;
        }
      }
      return fn();
    }

    // TODO: Batching should be implemented at the renderer level, not within
    // the reconciler.
    function flushSync(fn) {
      var previousIsBatchingUpdates = isBatchingUpdates;
      isBatchingUpdates = true;
      try {
        return syncUpdates(fn);
      } finally {
        isBatchingUpdates = previousIsBatchingUpdates;
        !!isRendering
          ? invariant_1$1(
              false,
              'flushSync was called from inside a lifecycle method. It cannot be called when React is already rendering.'
            )
          : void 0;
        performWork(Sync, null);
      }
    }

    return {
      computeAsyncExpiration: computeAsyncExpiration,
      computeExpirationForFiber: computeExpirationForFiber,
      scheduleWork: scheduleWork,
      batchedUpdates: batchedUpdates,
      unbatchedUpdates: unbatchedUpdates,
      flushSync: flushSync,
      deferredUpdates: deferredUpdates,
    };
  };

  {
    var didWarnAboutNestedUpdates = false;
  }

  // 0 is PROD, 1 is DEV.
  // Might add PROFILE later.

  function getContextForSubtree(parentComponent) {
    if (!parentComponent) {
      return emptyObject_1;
    }

    var fiber = get(parentComponent);
    var parentContext = findCurrentUnmaskedContext(fiber);
    return isContextProvider(fiber)
      ? processChildContext(fiber, parentContext)
      : parentContext;
  }

  var ReactFiberReconciler$1 = function (config) {
    var getPublicInstance = config.getPublicInstance;

    var _ReactFiberScheduler = ReactFiberScheduler(config),
      computeAsyncExpiration = _ReactFiberScheduler.computeAsyncExpiration,
      computeExpirationForFiber =
        _ReactFiberScheduler.computeExpirationForFiber,
      scheduleWork = _ReactFiberScheduler.scheduleWork,
      batchedUpdates = _ReactFiberScheduler.batchedUpdates,
      unbatchedUpdates = _ReactFiberScheduler.unbatchedUpdates,
      flushSync = _ReactFiberScheduler.flushSync,
      deferredUpdates = _ReactFiberScheduler.deferredUpdates;

    function scheduleTopLevelUpdate(current, element, callback) {
      {
        if (
          ReactDebugCurrentFiber.phase === 'render' &&
          ReactDebugCurrentFiber.current !== null &&
          !didWarnAboutNestedUpdates
        ) {
          didWarnAboutNestedUpdates = true;
          warning_1$1(
            false,
            'Render methods should be a pure function of props and state; ' +
              'triggering nested component updates from render is not allowed. ' +
              'If necessary, trigger nested updates in componentDidUpdate.\n\n' +
              'Check the render method of %s.',
            getComponentName(ReactDebugCurrentFiber.current) || 'Unknown'
          );
        }
      }

      callback = callback === undefined ? null : callback;
      {
        warning_1$1(
          callback === null || typeof callback === 'function',
          'render(...): Expected the last optional `callback` argument to be a ' +
            'function. Instead received: %s.',
          callback
        );
      }

      var expirationTime = void 0;
      // Check if the top-level element is an async wrapper component. If so,
      // treat updates to the root as async. This is a bit weird but lets us
      // avoid a separate `renderAsync` API.
      if (
        enableAsyncSubtreeAPI &&
        element != null &&
        element.type != null &&
        element.type.prototype != null &&
        element.type.prototype.unstable_isAsyncReactComponent === true
      ) {
        expirationTime = computeAsyncExpiration();
      } else {
        expirationTime = computeExpirationForFiber(current);
      }

      var update = {
        expirationTime: expirationTime,
        partialState: { element: element },
        callback: callback,
        isReplace: false,
        isForced: false,
        nextCallback: null,
        next: null,
      };
      insertUpdateIntoFiber(current, update);
      scheduleWork(current, expirationTime);
    }

    function findHostInstance(fiber) {
      var hostFiber = findCurrentHostFiber(fiber);
      if (hostFiber === null) {
        return null;
      }
      return hostFiber.stateNode;
    }

    return {
      createContainer: function (containerInfo, hydrate) {
        return createFiberRoot(containerInfo, hydrate);
      },
      updateContainer: function (
        element,
        container,
        parentComponent,
        callback
      ) {
        // TODO: If this is a nested container, this won't be the root.
        var current = container.current;

        {
          if (ReactFiberInstrumentation_1.debugTool) {
            if (current.alternate === null) {
              ReactFiberInstrumentation_1.debugTool.onMountContainer(container);
            } else if (element === null) {
              ReactFiberInstrumentation_1.debugTool.onUnmountContainer(
                container
              );
            } else {
              ReactFiberInstrumentation_1.debugTool.onUpdateContainer(
                container
              );
            }
          }
        }

        var context = getContextForSubtree(parentComponent);
        if (container.context === null) {
          container.context = context;
        } else {
          container.pendingContext = context;
        }

        scheduleTopLevelUpdate(current, element, callback);
      },

      batchedUpdates: batchedUpdates,

      unbatchedUpdates: unbatchedUpdates,

      deferredUpdates: deferredUpdates,

      flushSync: flushSync,

      getPublicRootInstance: function (container) {
        var containerFiber = container.current;
        if (!containerFiber.child) {
          return null;
        }
        switch (containerFiber.child.tag) {
          case HostComponent:
            return getPublicInstance(containerFiber.child.stateNode);
          default:
            return containerFiber.child.stateNode;
        }
      },

      findHostInstance: findHostInstance,

      findHostInstanceWithNoPortals: function (fiber) {
        var hostFiber = findCurrentHostFiberWithNoPortals(fiber);
        if (hostFiber === null) {
          return null;
        }
        return hostFiber.stateNode;
      },
      injectIntoDevTools: function (devToolsConfig) {
        var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;

        return injectInternals(
          _assign({}, devToolsConfig, {
            findHostInstanceByFiber: function (fiber) {
              return findHostInstance(fiber);
            },
            findFiberByHostInstance: function (instance) {
              if (!findFiberByHostInstance) {
                // Might not be implemented by the renderer.
                return null;
              }
              return findFiberByHostInstance(instance);
            },
          })
        );
      },
    };
  };

  var ReactFiberReconciler$2 = Object.freeze({
    default: ReactFiberReconciler$1,
  });

  var ReactFiberReconciler$3 =
    (ReactFiberReconciler$2 && ReactFiberReconciler$1) ||
    ReactFiberReconciler$2;

  // TODO: bundle Flow types with the package.

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var reactReconciler = ReactFiberReconciler$3['default']
    ? ReactFiberReconciler$3['default']
    : ReactFiberReconciler$3;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  var canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );

  /**
   * Simple, lightweight module assisting with the detection and context of
   * Worker. Helps avoid circular dependencies and allows code to reason about
   * whether or not they are in a Worker, even if they never include the main
   * `ReactWorker` dependency.
   */
  var ExecutionEnvironment = {
    canUseDOM: canUseDOM,

    canUseWorkers: typeof Worker !== 'undefined',

    canUseEventListeners:
      canUseDOM && !!(window.addEventListener || window.attachEvent),

    canUseViewport: canUseDOM && !!window.screen,

    isInWorker: !canUseDOM, // For now, this is true - might change in the future.
  };

  var ExecutionEnvironment_1 = ExecutionEnvironment;

  // a requestAnimationFrame, storing the time for the start of the frame, then
  // scheduling a postMessage which gets scheduled after paint. Within the
  // postMessage handler do as much work as possible until time + frame rate.
  // By separating the idle call into a separate event tick we ensure that
  // layout, paint and other browser work is counted against the available time.
  // The frame rate is dynamically adjusted.

  {
    if (
      ExecutionEnvironment_1.canUseDOM &&
      typeof requestAnimationFrame !== 'function'
    ) {
      warning_1$1(
        false,
        'React depends on requestAnimationFrame. Make sure that you load a ' +
          'polyfill in older browsers. http://fb.me/react-polyfills'
      );
    }
  }

  var hasNativePerformanceNow =
    typeof performance === 'object' && typeof performance.now === 'function';

  var now = void 0;
  if (hasNativePerformanceNow) {
    now = function () {
      return performance.now();
    };
  } else {
    now = function () {
      return Date.now();
    };
  }

  // TODO: There's no way to cancel, because Fiber doesn't atm.
  var rIC = void 0;

  if (!ExecutionEnvironment_1.canUseDOM) {
    rIC = function (frameCallback) {
      setTimeout(function () {
        frameCallback({
          timeRemaining: function () {
            return Infinity;
          },
        });
      });
      return 0;
    };
  } else if (typeof requestIdleCallback !== 'function') {
    // Polyfill requestIdleCallback.

    var scheduledRICCallback = null;

    var isIdleScheduled = false;
    var isAnimationFrameScheduled = false;

    var frameDeadline = 0;
    // We start out assuming that we run at 30fps but then the heuristic tracking
    // will adjust this value to a faster fps if we get more frequent animation
    // frames.
    var previousFrameTime = 33;
    var activeFrameTime = 33;

    var frameDeadlineObject;
    if (hasNativePerformanceNow) {
      frameDeadlineObject = {
        timeRemaining: function () {
          // We assume that if we have a performance timer that the rAF callback
          // gets a performance timer value. Not sure if this is always true.
          return frameDeadline - performance.now();
        },
      };
    } else {
      frameDeadlineObject = {
        timeRemaining: function () {
          // Fallback to Date.now()
          return frameDeadline - Date.now();
        },
      };
    }

    // We use the postMessage trick to defer idle work until after the repaint.
    var messageKey =
      '__reactIdleCallback$' + Math.random().toString(36).slice(2);
    var idleTick = function (event) {
      if (event.source !== window || event.data !== messageKey) {
        return;
      }
      isIdleScheduled = false;
      var callback = scheduledRICCallback;
      scheduledRICCallback = null;
      if (callback !== null) {
        callback(frameDeadlineObject);
      }
    };
    // Assumes that we have addEventListener in this environment. Might need
    // something better for old IE.
    window.addEventListener('message', idleTick, false);

    var animationTick = function (rafTime) {
      isAnimationFrameScheduled = false;
      var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
      if (
        nextFrameTime < activeFrameTime &&
        previousFrameTime < activeFrameTime
      ) {
        if (nextFrameTime < 8) {
          // Defensive coding. We don't support higher frame rates than 120hz.
          // If we get lower than that, it is probably a bug.
          nextFrameTime = 8;
        }
        // If one frame goes long, then the next one can be short to catch up.
        // If two frames are short in a row, then that's an indication that we
        // actually have a higher frame rate than what we're currently optimizing.
        // We adjust our heuristic dynamically accordingly. For example, if we're
        // running on 120hz display or 90hz VR display.
        // Take the max of the two in case one of them was an anomaly due to
        // missed frame deadlines.
        activeFrameTime =
          nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
      } else {
        previousFrameTime = nextFrameTime;
      }
      frameDeadline = rafTime + activeFrameTime;
      if (!isIdleScheduled) {
        isIdleScheduled = true;
        window.postMessage(messageKey, '*');
      }
    };

    rIC = function (callback) {
      // This assumes that we only schedule one callback at a time because that's
      // how Fiber uses it.
      scheduledRICCallback = callback;
      if (!isAnimationFrameScheduled) {
        // If rAF didn't already schedule one, we need to schedule a frame.
        // TODO: If this rAF doesn't materialize because the browser throttles, we
        // might want to still have setTimeout trigger rIC as a backup to ensure
        // that we keep performing work.
        isAnimationFrameScheduled = true;
        requestAnimationFrame(animationTick);
      }
      return 0;
    };
  } else {
    rIC = requestIdleCallback;
  }

  var commonjsGlobal =
    typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
      ? self
      : {};

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var current = createCommonjsModule(function (module, exports) {
    function warning() {
      throw new Error(
        'You must require a mode before requiring anything else.'
      );
    }

    exports.Surface = warning;
    exports.Path = warning;
    exports.Shape = warning;
    exports.Group = warning;
    exports.ClippingRectangle = warning;
    exports.Text = warning;

    exports.setCurrent = function (mode) {
      for (var key in mode) {
        exports[key] = mode[key];
      }
    };
  });

  var _class = function (mixins) {
    var proto = {};
    for (var i = 0, l = arguments.length; i < l; i++) {
      var mixin = arguments[i];
      if (typeof mixin == 'function') mixin = mixin.prototype;
      for (var key in mixin) proto[key] = mixin[key];
    }
    if (!proto.initialize) proto.initialize = function () {};
    proto.constructor = function (a, b, c, d, e, f, g, h) {
      return new proto.initialize(a, b, c, d, e, f, g, h);
    };
    proto.constructor.prototype = proto.initialize.prototype = proto;
    return proto.constructor;
  };

  var container = _class({
    grab: function () {
      for (var i = 0; i < arguments.length; i++) arguments[i].inject(this);
      return this;
    },

    empty: function () {
      var node;
      while ((node = this.firstChild)) node.eject();
      return this;
    },
  });

  function elementFrom(node) {
    if (node.toElement) return node.toElement();
    if (node.getDOMNode) return node.getDOMNode();
    if (node.getNode) return node.getNode();
    return node;
  }

  var native_1 = _class({
    // conventions

    toElement: function () {
      return this.element;
    },

    getDOMNode: function () {
      return this.toElement();
    },

    getNode: function () {
      return this.toElement();
    },

    // placement

    inject: function (container) {
      (container.containerElement || elementFrom(container)).appendChild(
        this.element
      );
      return this;
    },

    injectBefore: function (sibling) {
      var element = elementFrom(sibling);
      element.parentNode.insertBefore(this.element, element);
      return this;
    },

    eject: function () {
      var element = this.element,
        parent = element.parentNode;
      if (parent) parent.removeChild(element); // TODO: VML Nodes are dead after being ejected
      return this;
    },

    // events

    subscribe: function (type, fn, bind) {
      if (typeof type != 'string') {
        // listen type / fn with object
        var subscriptions = [];
        for (var t in type) subscriptions.push(this.subscribe(t, type[t]));
        return function () {
          // unsubscribe
          for (var i = 0, l = subscriptions.length; i < l; i++)
            subscriptions[i]();
          return this;
        };
      } else {
        // listen to one
        if (!bind) bind = this;
        var bound;
        if (typeof fn === 'function') {
          bound = fn.bind
            ? fn.bind(bind)
            : function () {
                return fn.apply(bind, arguments);
              };
        } else {
          bound = fn;
        }
        var element = this.element;
        if (element.addEventListener) {
          element.addEventListener(type, bound, false);
          return function () {
            // unsubscribe
            element.removeEventListener(type, bound, false);
            return this;
          };
        } else {
          element.attachEvent('on' + type, bound);
          return function () {
            // unsubscribe
            element.detachEvent('on' + type, bound);
            return this;
          };
        }
      }
    },
  });

  var fps = 1000 / 60;
  var invalids = [];
  var renderTimer;
  var renderInvalids = function () {
    clearTimeout(renderTimer);
    renderTimer = null;
    var canvases = invalids;
    invalids = [];
    for (var i = 0, l = canvases.length; i < l; i++) {
      var c = canvases[i];
      c._valid = true;
      c.render();
    }
  };

  var resolution =
    (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

  var previousHit = null;
  var previousHitSurface = null;

  var CanvasSurface = _class(native_1, container, {
    initialize: function (width, height, existingElement) {
      var element = (this.element =
        existingElement || document.createElement('canvas'));
      var context = (this.context = element.getContext('2d'));
      this._valid = true;
      if (width != null && height != null) this.resize(width, height);

      element.addEventListener('mousemove', this, false);
      element.addEventListener('mouseout', this, false);
      element.addEventListener('mouseover', this, false);
      element.addEventListener('mouseup', this, false);
      element.addEventListener('mousedown', this, false);
      element.addEventListener('click', this, false);
    },

    handleEvent: function (event) {
      if (event.clientX == null) return;
      var element = this.element,
        rect = element.getBoundingClientRect(),
        x = event.clientX - rect.left - element.clientLeft,
        y = event.clientY - rect.top - element.clientTop,
        hit = this.hitTest(x, y);

      if (hit !== previousHit) {
        if (previousHit) {
          previousHit.dispatch({
            type: 'mouseout',
            target: previousHit,
            relatedTarget: hit,
            sourceEvent: event,
          });
        }
        if (hit) {
          hit.dispatch({
            type: 'mouseover',
            target: hit,
            relatedTarget: previousHit,
            sourceEvent: event,
          });
        }
        previousHit = hit;
        previousHitSurface = this;
        this.refreshCursor();
      }

      if (hit) hit.dispatch(event);
    },

    refreshCursor: function () {
      if (previousHitSurface !== this) return;
      var hit = previousHit,
        hitCursor = '',
        hitTooltip = '';
      while (hit) {
        if (!hitCursor && hit._cursor) {
          hitCursor = hit._cursor;
          if (hitTooltip) break;
        }
        if (!hitTooltip && hit._tooltip) {
          hitTooltip = hit._tooltip;
          if (hitCursor) break;
        }
        hit = hit.parentNode;
      }
      // TODO: No way to set cursor/title on the surface
      this.element.style.cursor = hitCursor;
      this.element.title = hitTooltip;
    },

    resize: function (width, height) {
      var element = this.element;
      element.setAttribute('width', width * resolution);
      element.setAttribute('height', height * resolution);
      element.style.width = width + 'px';
      element.style.height = height + 'px';
      this.width = width;
      this.height = height;
      return this;
    },

    invalidate: function (left, top, width, height) {
      if (this._valid) {
        this._valid = false;
        invalids.push(this);
        if (!renderTimer) {
          if (window.mozRequestAnimationFrame) {
            renderTimer = true;
            window.mozRequestAnimationFrame(renderInvalids);
          } else {
            renderTimer = setTimeout(renderInvalids, fps);
          }
        }
      }
      return this;
    },

    hitTest: function (x, y) {
      if (x < 0 || y < 0 || x > this.width || y > this.height) return null;
      var node = this.lastChild;
      while (node) {
        var hit = node.hitTest(x, y);
        if (hit) return hit;
        node = node.previousSibling;
      }
      return null;
    },

    render: function () {
      var node = this.firstChild,
        context = this.context;
      context.setTransform(resolution, 0, 0, resolution, 0, 0);
      context.clearRect(0, 0, this.width, this.height);
      while (node) {
        node.renderTo(context, resolution, 0, 0, resolution, 0, 0);
        node = node.nextSibling;
      }
      this.refreshCursor();
    },
  });

  CanvasSurface.tagName = 'canvas';

  var surface = CanvasSurface;

  var path$2 = _class({
    initialize: function (path) {
      this.reset().push(path);
    },

    /* parser */

    push: function () {
      var p = Array.prototype.join
        .call(arguments, ' ')
        .match(/[a-df-z]|[\-+]?(?:[\d\.]e[\-+]?|[^\s\-+,a-z])+/gi);
      if (!p) return this;

      var last,
        cmd = p[0],
        i = 1;
      while (cmd) {
        switch (cmd) {
          case 'm':
            this.move(p[i++], p[i++]);
            break;
          case 'l':
            this.line(p[i++], p[i++]);
            break;
          case 'c':
            this.curve(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]);
            break;
          case 's':
            this.curve(p[i++], p[i++], null, null, p[i++], p[i++]);
            break;
          case 'q':
            this.curve(p[i++], p[i++], p[i++], p[i++]);
            break;
          case 't':
            this.curve(p[i++], p[i++]);
            break;
          case 'a':
            this.arc(
              p[i + 5],
              p[i + 6],
              p[i],
              p[i + 1],
              p[i + 3],
              !+p[i + 4],
              p[i + 2]
            );
            i += 7;
            break;
          case 'h':
            this.line(p[i++], 0);
            break;
          case 'v':
            this.line(0, p[i++]);
            break;

          case 'M':
            this.moveTo(p[i++], p[i++]);
            break;
          case 'L':
            this.lineTo(p[i++], p[i++]);
            break;
          case 'C':
            this.curveTo(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]);
            break;
          case 'S':
            this.curveTo(p[i++], p[i++], null, null, p[i++], p[i++]);
            break;
          case 'Q':
            this.curveTo(p[i++], p[i++], p[i++], p[i++]);
            break;
          case 'T':
            this.curveTo(p[i++], p[i++]);
            break;
          case 'A':
            this.arcTo(
              p[i + 5],
              p[i + 6],
              p[i],
              p[i + 1],
              p[i + 3],
              !+p[i + 4],
              p[i + 2]
            );
            i += 7;
            break;
          case 'H':
            this.lineTo(p[i++], this.penY);
            break;
          case 'V':
            this.lineTo(this.penX, p[i++]);
            break;

          case 'Z':
          case 'z':
            this.close();
            break;
          default:
            cmd = last;
            i--;
            continue;
        }

        last = cmd;
        if (last == 'm') last = 'l';
        else if (last == 'M') last = 'L';
        cmd = p[i++];
      }
      return this;
    },

    /* utility methods */

    reset: function () {
      this.penX = this.penY = 0;
      this.penDownX = this.penDownY = null;
      this._pivotX = this._pivotY = 0;
      this.onReset();
      return this;
    },

    move: function (x, y) {
      this.onMove(
        this.penX,
        this.penY,
        (this._pivotX = this.penX += +x),
        (this._pivotY = this.penY += +y)
      );
      return this;
    },
    moveTo: function (x, y) {
      this.onMove(
        this.penX,
        this.penY,
        (this._pivotX = this.penX = +x),
        (this._pivotY = this.penY = +y)
      );
      return this;
    },

    line: function (x, y) {
      return this.lineTo(this.penX + +x, this.penY + +y);
    },
    lineTo: function (x, y) {
      if (this.penDownX == null) {
        this.penDownX = this.penX;
        this.penDownY = this.penY;
      }
      this.onLine(
        this.penX,
        this.penY,
        (this._pivotX = this.penX = +x),
        (this._pivotY = this.penY = +y)
      );
      return this;
    },

    curve: function (c1x, c1y, c2x, c2y, ex, ey) {
      var x = this.penX,
        y = this.penY;
      return this.curveTo(
        x + +c1x,
        y + +c1y,
        c2x == null ? null : x + +c2x,
        c2y == null ? null : y + +c2y,
        ex == null ? null : x + +ex,
        ey == null ? null : y + +ey
      );
    },
    curveTo: function (c1x, c1y, c2x, c2y, ex, ey) {
      var x = this.penX,
        y = this.penY;
      if (c2x == null) {
        c2x = +c1x;
        c2y = +c1y;
        c1x = x * 2 - (this._pivotX || 0);
        c1y = y * 2 - (this._pivotY || 0);
      }
      if (ex == null) {
        this._pivotX = +c1x;
        this._pivotY = +c1y;
        ex = +c2x;
        ey = +c2y;
        c2x = (ex + +c1x * 2) / 3;
        c2y = (ey + +c1y * 2) / 3;
        c1x = (x + +c1x * 2) / 3;
        c1y = (y + +c1y * 2) / 3;
      } else {
        this._pivotX = +c2x;
        this._pivotY = +c2y;
      }
      if (this.penDownX == null) {
        this.penDownX = x;
        this.penDownY = y;
      }
      this.onBezierCurve(
        x,
        y,
        +c1x,
        +c1y,
        +c2x,
        +c2y,
        (this.penX = +ex),
        (this.penY = +ey)
      );
      return this;
    },

    arc: function (x, y, rx, ry, outer, counterClockwise, rotation) {
      return this.arcTo(
        this.penX + +x,
        this.penY + +y,
        rx,
        ry,
        outer,
        counterClockwise,
        rotation
      );
    },
    arcTo: function (x, y, rx, ry, outer, counterClockwise, rotation) {
      ry = Math.abs(+ry || +rx || +y - this.penY);
      rx = Math.abs(+rx || +x - this.penX);

      if (!rx || !ry || (x == this.penX && y == this.penY))
        return this.lineTo(x, y);

      var tX = this.penX,
        tY = this.penY,
        clockwise = !+counterClockwise,
        large = !!+outer;

      var rad = rotation ? (rotation * Math.PI) / 180 : 0,
        cos = Math.cos(rad),
        sin = Math.sin(rad);
      x -= tX;
      y -= tY;

      // Ellipse Center
      var cx = (cos * x) / 2 + (sin * y) / 2,
        cy = (-sin * x) / 2 + (cos * y) / 2,
        rxry = rx * rx * ry * ry,
        rycx = ry * ry * cx * cx,
        rxcy = rx * rx * cy * cy,
        a = rxry - rxcy - rycx;

      if (a < 0) {
        a = Math.sqrt(1 - a / rxry);
        rx *= a;
        ry *= a;
        cx = x / 2;
        cy = y / 2;
      } else {
        a = Math.sqrt(a / (rxcy + rycx));
        if (large == clockwise) a = -a;
        var cxd = (-a * cy * rx) / ry,
          cyd = (a * cx * ry) / rx;
        cx = cos * cxd - sin * cyd + x / 2;
        cy = sin * cxd + cos * cyd + y / 2;
      }

      // Rotation + Scale Transform
      var xx = cos / rx,
        yx = sin / rx,
        xy = -sin / ry,
        yy = cos / ry;

      // Start and End Angle
      var sa = Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy),
        ea = Math.atan2(
          xy * (x - cx) + yy * (y - cy),
          xx * (x - cx) + yx * (y - cy)
        );

      cx += tX;
      cy += tY;
      x += tX;
      y += tY;

      // Circular Arc
      if (this.penDownX == null) {
        this.penDownX = this.penX;
        this.penDownY = this.penY;
      }
      this.onArc(
        tX,
        tY,
        (this._pivotX = this.penX = x),
        (this._pivotY = this.penY = y),
        cx,
        cy,
        rx,
        ry,
        sa,
        ea,
        !clockwise,
        rotation
      );
      return this;
    },

    counterArc: function (x, y, rx, ry, outer) {
      return this.arc(x, y, rx, ry, outer, true);
    },
    counterArcTo: function (x, y, rx, ry, outer) {
      return this.arcTo(x, y, rx, ry, outer, true);
    },

    close: function () {
      if (this.penDownX != null) {
        this.onClose(
          this.penX,
          this.penY,
          (this.penX = this.penDownX),
          (this.penY = this.penDownY)
        );
        this.penDownX = null;
      }
      return this;
    },

    /* overridable handlers */

    onReset: function () {},

    onMove: function (sx, sy, ex, ey) {},

    onLine: function (sx, sy, ex, ey) {
      this.onBezierCurve(sx, sy, sx, sy, ex, ey, ex, ey);
    },

    onBezierCurve: function (sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
      var gx = ex - sx,
        gy = ey - sy,
        g = gx * gx + gy * gy,
        v1,
        v2,
        cx,
        cy,
        u;

      cx = c1x - sx;
      cy = c1y - sy;
      u = cx * gx + cy * gy;

      if (u > g) {
        cx -= gx;
        cy -= gy;
      } else if (u > 0 && g != 0) {
        cx -= (u / g) * gx;
        cy -= (u / g) * gy;
      }

      v1 = cx * cx + cy * cy;

      cx = c2x - sx;
      cy = c2y - sy;
      u = cx * gx + cy * gy;

      if (u > g) {
        cx -= gx;
        cy -= gy;
      } else if (u > 0 && g != 0) {
        cx -= (u / g) * gx;
        cy -= (u / g) * gy;
      }

      v2 = cx * cx + cy * cy;

      if (v1 < 0.01 && v2 < 0.01) {
        this.onLine(sx, sy, ex, ey);
        return;
      }

      // Avoid infinite recursion
      if (isNaN(v1) || isNaN(v2)) {
        throw new Error('Bad input');
      }

      // Split curve
      var s1x = (c1x + c2x) * 0.5,
        s1y = (c1y + c2y) * 0.5,
        l1x = (c1x + sx) * 0.5,
        l1y = (c1y + sy) * 0.5,
        l2x = (l1x + s1x) * 0.5,
        l2y = (l1y + s1y) * 0.5,
        r2x = (ex + c2x) * 0.5,
        r2y = (ey + c2y) * 0.5,
        r1x = (r2x + s1x) * 0.5,
        r1y = (r2y + s1y) * 0.5,
        l2r1x = (l2x + r1x) * 0.5,
        l2r1y = (l2y + r1y) * 0.5;

      // TODO: Manual stack if necessary. Currently recursive without tail optimization.
      this.onBezierCurve(sx, sy, l1x, l1y, l2x, l2y, l2r1x, l2r1y);
      this.onBezierCurve(l2r1x, l2r1y, r1x, r1y, r2x, r2y, ex, ey);
    },

    onArc: function (sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) {
      // Inverse Rotation + Scale Transform
      var rad = rotation ? (rotation * Math.PI) / 180 : 0,
        cos = Math.cos(rad),
        sin = Math.sin(rad),
        xx = cos * rx,
        yx = -sin * ry,
        xy = sin * rx,
        yy = cos * ry;

      // Bezier Curve Approximation
      var arc = ea - sa;
      if (arc < 0 && !ccw) arc += Math.PI * 2;
      else if (arc > 0 && ccw) arc -= Math.PI * 2;

      var n = Math.ceil(Math.abs(arc / (Math.PI / 2))),
        step = arc / n,
        k = (4 / 3) * Math.tan(step / 4);

      var x = Math.cos(sa),
        y = Math.sin(sa);

      for (var i = 0; i < n; i++) {
        var cp1x = x - k * y,
          cp1y = y + k * x;

        sa += step;
        x = Math.cos(sa);
        y = Math.sin(sa);

        var cp2x = x + k * y,
          cp2y = y - k * x;

        this.onBezierCurve(
          sx,
          sy,
          cx + xx * cp1x + yx * cp1y,
          cy + xy * cp1x + yy * cp1y,
          cx + xx * cp2x + yx * cp2y,
          cy + xy * cp2x + yy * cp2y,
          (sx = cx + xx * x + yx * y),
          (sy = cy + xy * x + yy * y)
        );
      }
    },

    onClose: function (sx, sy, ex, ey) {
      this.onLine(sx, sy, ex, ey);
    },
  });

  var CanvasPath = _class(path$2, {
    initialize: function (path) {
      this.reset();
      if (path instanceof CanvasPath) {
        this.path = path.path.slice(0);
      } else if (path) {
        if (path.applyToPath) path.applyToPath(this);
        else this.push(path);
      }
    },

    onReset: function () {
      this.path = [];
    },

    onMove: function (sx, sy, x, y) {
      this.path.push(function (context) {
        context.moveTo(x, y);
      });
    },

    onLine: function (sx, sy, x, y) {
      this.path.push(function (context) {
        context.lineTo(x, y);
      });
    },

    onBezierCurve: function (sx, sy, p1x, p1y, p2x, p2y, x, y) {
      this.path.push(function (context) {
        context.bezierCurveTo(p1x, p1y, p2x, p2y, x, y);
      });
    },

    _arcToBezier: path$2.prototype.onArc,

    onArc: function (sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) {
      if (rx != ry || rotation)
        return this._arcToBezier(
          sx,
          sy,
          ex,
          ey,
          cx,
          cy,
          rx,
          ry,
          sa,
          ea,
          ccw,
          rotation
        );
      this.path.push(function (context) {
        context.arc(cx, cy, rx, sa, ea, ccw);
      });
    },

    onClose: function () {
      this.path.push(function (context) {
        context.closePath();
      });
    },

    toCommands: function () {
      return this.path.slice(0);
    },
  });

  var path = CanvasPath;

  var colors = {
    maroon: '#800000',
    red: '#ff0000',
    orange: '#ffA500',
    yellow: '#ffff00',
    olive: '#808000',
    purple: '#800080',
    fuchsia: '#ff00ff',
    white: '#ffffff',
    lime: '#00ff00',
    green: '#008000',
    navy: '#000080',
    blue: '#0000ff',
    aqua: '#00ffff',
    teal: '#008080',
    black: '#000000',
    silver: '#c0c0c0',
    gray: '#808080',
  };

  var map = function (array, fn) {
    var results = [];
    for (var i = 0, l = array.length; i < l; i++) results[i] = fn(array[i], i);
    return results;
  };

  var Color = function (color, type) {
    if (color.isColor) {
      this.red = color.red;
      this.green = color.green;
      this.blue = color.blue;
      this.alpha = color.alpha;
    } else {
      var namedColor = colors[color];
      if (namedColor) {
        color = namedColor;
        type = 'hex';
      }

      switch (typeof color) {
        case 'string':
          if (!type)
            type = (type = color.match(/^rgb|^hsb|^hsl/)) ? type[0] : 'hex';
          break;
        case 'object':
          type = type || 'rgb';
          color = color.toString();
          break;
        case 'number':
          type = 'hex';
          color = color.toString(16);
          break;
      }

      color = Color['parse' + type.toUpperCase()](color);
      this.red = color[0];
      this.green = color[1];
      this.blue = color[2];
      this.alpha = color[3];
    }

    this.isColor = true;
  };

  var limit = function (number, min, max) {
    return Math.min(max, Math.max(min, number));
  };

  var listMatch =
    /([-.\d]+\%?)\s*,\s*([-.\d]+\%?)\s*,\s*([-.\d]+\%?)\s*,?\s*([-.\d]*\%?)/;
  var hexMatch =
    /^#?([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{0,2})$/i;

  Color.parseRGB = function (color) {
    return map(color.match(listMatch).slice(1), function (bit, i) {
      if (bit) bit = parseFloat(bit) * (bit[bit.length - 1] == '%' ? 2.55 : 1);
      return i < 3
        ? Math.round((bit %= 256) < 0 ? bit + 256 : bit)
        : limit(bit === '' ? 1 : Number(bit), 0, 1);
    });
  };

  Color.parseHEX = function (color) {
    if (color.length == 1) color = color + color + color;
    return map(color.match(hexMatch).slice(1), function (bit, i) {
      if (i == 3) return bit ? parseInt(bit, 16) / 255 : 1;
      return parseInt(bit.length == 1 ? bit + bit : bit, 16);
    });
  };

  Color.parseHSB = function (color) {
    var hsb = map(color.match(listMatch).slice(1), function (bit, i) {
      if (bit) bit = parseFloat(bit);
      if (i === 0) return Math.round((bit %= 360) < 0 ? bit + 360 : bit);
      else if (i < 3) return limit(Math.round(bit), 0, 100);
      else return limit(bit === '' ? 1 : Number(bit), 0, 1);
    });

    var a = hsb[3];
    var br = Math.round((hsb[2] / 100) * 255);
    if (hsb[1] == 0) return [br, br, br, a];

    var hue = hsb[0];
    var f = hue % 60;
    var p = Math.round(((hsb[2] * (100 - hsb[1])) / 10000) * 255);
    var q = Math.round(((hsb[2] * (6000 - hsb[1] * f)) / 600000) * 255);
    var t = Math.round(((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000) * 255);

    switch (Math.floor(hue / 60)) {
      case 0:
        return [br, t, p, a];
      case 1:
        return [q, br, p, a];
      case 2:
        return [p, br, t, a];
      case 3:
        return [p, q, br, a];
      case 4:
        return [t, p, br, a];
      default:
        return [br, p, q, a];
    }
  };

  Color.parseHSL = function (color) {
    var hsb = map(color.match(listMatch).slice(1), function (bit, i) {
      if (bit) bit = parseFloat(bit);
      if (i === 0) return Math.round((bit %= 360) < 0 ? bit + 360 : bit);
      else if (i < 3) return limit(Math.round(bit), 0, 100);
      else return limit(bit === '' ? 1 : Number(bit), 0, 1);
    });

    var h = hsb[0] / 60;
    var s = hsb[1] / 100;
    var l = hsb[2] / 100;
    var a = hsb[3];

    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h % 2) - 1));
    var m = l - c / 2;

    var p = Math.round((c + m) * 255);
    var q = Math.round((x + m) * 255);
    var t = Math.round(m * 255);

    switch (Math.floor(h)) {
      case 0:
        return [p, q, t, a];
      case 1:
        return [q, p, t, a];
      case 2:
        return [t, p, q, a];
      case 3:
        return [t, q, p, a];
      case 4:
        return [q, t, p, a];
      default:
        return [p, t, q, a];
    }
  };

  var toString = function (type, array) {
    if (array[3] != 1) type += 'a';
    else array.pop();
    return type + '(' + array.join(', ') + ')';
  };

  Color.prototype = {
    toHSB: function (array) {
      var red = this.red,
        green = this.green,
        blue = this.blue,
        alpha = this.alpha;

      var max = Math.max(red, green, blue),
        min = Math.min(red, green, blue),
        delta = max - min;
      var hue = 0,
        saturation = delta != 0 ? delta / max : 0,
        brightness = max / 255;
      if (saturation) {
        var rr = (max - red) / delta,
          gr = (max - green) / delta,
          br = (max - blue) / delta;
        hue = red == max ? br - gr : green == max ? 2 + rr - br : 4 + gr - rr;
        if ((hue /= 6) < 0) hue++;
      }

      var hsb = [
        Math.round(hue * 360),
        Math.round(saturation * 100),
        Math.round(brightness * 100),
        alpha,
      ];

      return array ? hsb : toString('hsb', hsb);
    },

    toHSL: function (array) {
      var red = this.red,
        green = this.green,
        blue = this.blue,
        alpha = this.alpha;

      var max = Math.max(red, green, blue),
        min = Math.min(red, green, blue),
        delta = max - min;
      var hue = 0,
        saturation = delta != 0 ? delta / (255 - Math.abs(max + min - 255)) : 0,
        lightness = (max + min) / 512;
      if (saturation) {
        var rr = (max - red) / delta,
          gr = (max - green) / delta,
          br = (max - blue) / delta;
        hue = red == max ? br - gr : green == max ? 2 + rr - br : 4 + gr - rr;
        if ((hue /= 6) < 0) hue++;
      }

      var hsl = [
        Math.round(hue * 360),
        Math.round(saturation * 100),
        Math.round(lightness * 100),
        alpha,
      ];

      return array ? hsl : toString('hsl', hsl);
    },

    toHEX: function (array) {
      var a = this.alpha;
      var alpha =
        (a = Math.round(a * 255).toString(16)).length == 1 ? a + a : a;

      var hex = map([this.red, this.green, this.blue], function (bit) {
        bit = bit.toString(16);
        return bit.length == 1 ? '0' + bit : bit;
      });

      return array
        ? hex.concat(alpha)
        : '#' + hex.join('') + (alpha == 'ff' ? '' : alpha);
    },

    toRGB: function (array) {
      var rgb = [this.red, this.green, this.blue, this.alpha];
      return array ? rgb : toString('rgb', rgb);
    },
  };

  Color.prototype.toString = Color.prototype.toRGB;

  Color.hex = function (hex) {
    return new Color(hex, 'hex');
  };

  if (commonjsGlobal.hex == null) commonjsGlobal.hex = Color.hex;

  Color.hsb = function (h, s, b, a) {
    return new Color([h || 0, s || 0, b || 0, a == null ? 1 : a], 'hsb');
  };

  if (commonjsGlobal.hsb == null) commonjsGlobal.hsb = Color.hsb;

  Color.hsl = function (h, s, l, a) {
    return new Color([h || 0, s || 0, l || 0, a == null ? 1 : a], 'hsl');
  };

  if (commonjsGlobal.hsl == null) commonjsGlobal.hsl = Color.hsl;

  Color.rgb = function (r, g, b, a) {
    return new Color([r || 0, g || 0, b || 0, a == null ? 1 : a], 'rgb');
  };

  if (commonjsGlobal.rgb == null) commonjsGlobal.rgb = Color.rgb;

  Color.detach = function (color) {
    color = new Color(color);
    return [
      Color.rgb(color.red, color.green, color.blue).toString(),
      color.alpha,
    ];
  };

  var color = Color;

  function Transform(xx, yx, xy, yy, x, y) {
    if (xx && typeof xx == 'object') {
      yx = xx.yx;
      yy = xx.yy;
      y = xx.y;
      xy = xx.xy;
      x = xx.x;
      xx = xx.xx;
    }
    this.xx = xx == null ? 1 : xx;
    this.yx = yx || 0;
    this.xy = xy || 0;
    this.yy = yy == null ? 1 : yy;
    this.x = (x == null ? this.x : x) || 0;
    this.y = (y == null ? this.y : y) || 0;
    this._transform();
    return this;
  }

  var transform = _class({
    initialize: Transform,

    _transform: function () {},

    xx: 1,
    yx: 0,
    x: 0,
    xy: 0,
    yy: 1,
    y: 0,

    transform: function (xx, yx, xy, yy, x, y) {
      var m = this;
      if (xx && typeof xx == 'object') {
        yx = xx.yx;
        yy = xx.yy;
        y = xx.y;
        xy = xx.xy;
        x = xx.x;
        xx = xx.xx;
      }
      if (!x) x = 0;
      if (!y) y = 0;
      return this.transformTo(
        m.xx * xx + m.xy * yx,
        m.yx * xx + m.yy * yx,
        m.xx * xy + m.xy * yy,
        m.yx * xy + m.yy * yy,
        m.xx * x + m.xy * y + m.x,
        m.yx * x + m.yy * y + m.y
      );
    },

    transformTo: Transform,

    translate: function (x, y) {
      return this.transform(1, 0, 0, 1, x, y);
    },

    move: function (x, y) {
      this.x += x || 0;
      this.y += y || 0;
      this._transform();
      return this;
    },

    scale: function (x, y) {
      if (y == null) y = x;
      return this.transform(x, 0, 0, y, 0, 0);
    },

    rotate: function (deg, x, y) {
      if (x == null || y == null) {
        x = (this.left || 0) + (this.width || 0) / 2;
        y = (this.top || 0) + (this.height || 0) / 2;
      }

      var rad = (deg * Math.PI) / 180,
        sin = Math.sin(rad),
        cos = Math.cos(rad);

      this.transform(1, 0, 0, 1, x, y);
      var m = this;

      return this.transformTo(
        cos * m.xx - sin * m.yx,
        sin * m.xx + cos * m.yx,
        cos * m.xy - sin * m.yy,
        sin * m.xy + cos * m.yy,
        m.x,
        m.y
      ).transform(1, 0, 0, 1, -x, -y);
    },

    moveTo: function (x, y) {
      var m = this;
      return this.transformTo(m.xx, m.yx, m.xy, m.yy, x, y);
    },

    rotateTo: function (deg, x, y) {
      var m = this;
      var flip = m.yx / m.xx > m.yy / m.xy ? -1 : 1;
      if (m.xx < 0 ? m.xy >= 0 : m.xy < 0) flip = -flip;
      return this.rotate(
        deg - (Math.atan2(flip * m.yx, flip * m.xx) * 180) / Math.PI,
        x,
        y
      );
    },

    scaleTo: function (x, y) {
      // Normalize
      var m = this;

      var h = Math.sqrt(m.xx * m.xx + m.yx * m.yx);
      m.xx /= h;
      m.yx /= h;

      h = Math.sqrt(m.yy * m.yy + m.xy * m.xy);
      m.yy /= h;
      m.xy /= h;

      return this.scale(x, y);
    },

    resizeTo: function (width, height) {
      var w = this.width,
        h = this.height;
      if (!w || !h) return this;
      return this.scaleTo(width / w, height / h);
    },

    /*
	inverse: function(){
		var a = this.xx, b = this.yx,
			c = this.xy, d = this.yy,
			e = this.x, f = this.y;
		if (a * d - b * c == 0) return null;
		return new Transform(
			d/(a * d-b * c), b/(b * c-a * d),
			c/(b * c-a * d), a/(a * d-b * c),
			(d * e-c * f)/(b * c-a * d), (b * e-a * f)/(a * d-b * c)
		);
	},
	*/

    inversePoint: function (x, y) {
      var a = this.xx,
        b = this.yx,
        c = this.xy,
        d = this.yy,
        e = this.x,
        f = this.y;
      var det = b * c - a * d;
      if (det == 0) return null;
      return {
        x: (d * (e - x) + c * (y - f)) / det,
        y: (a * (f - y) + b * (x - e)) / det,
      };
    },

    point: function (x, y) {
      var m = this;
      return {
        x: m.xx * x + m.xy * y + m.x,
        y: m.yx * x + m.yy * y + m.y,
      };
    },
  });

  var dummy = _class({
    // placement

    _resetPlacement: function () {
      var container = this.parentNode;
      if (container) {
        var previous = this.previousSibling,
          next = this.nextSibling;
        if (previous) {
          previous.nextSibling = next;
        } else {
          container.firstChild = next;
        }
        if (next) {
          next.previousSibling = previous;
        } else {
          container.lastChild = this.previousSibling;
        }
      }
      this.previousSibling = null;
      this.nextSibling = null;
      this.parentNode = null;
      return this;
    },

    inject: function (container) {
      this._resetPlacement();
      var last = container.lastChild;
      if (last) {
        last.nextSibling = this;
        this.previousSibling = last;
      } else {
        container.firstChild = this;
      }
      container.lastChild = this;
      this.parentNode = container;
      this._place();
      return this;
    },

    injectBefore: function (sibling) {
      this._resetPlacement();
      var container = sibling.parentNode;
      if (!container) return this;
      var previous = sibling.previousSibling;
      if (previous) {
        previous.nextSibling = this;
        this.previousSibling = previous;
      } else {
        container.firstChild = this;
      }
      sibling.previousSibling = this;
      this.nextSibling = sibling;
      this.parentNode = container;
      this._place();
      return this;
    },

    eject: function () {
      this._resetPlacement();
      this._place();
      return this;
    },

    _place: function () {},

    // events

    dispatch: function (event) {
      var events = this._events,
        listeners = events && events[event.type];
      if (listeners) {
        listeners = listeners.slice(0);
        for (var i = 0, l = listeners.length; i < l; i++) {
          var fn = listeners[i],
            result;
          if (typeof fn == 'function') result = fn.call(this, event);
          else result = fn.handleEvent(event);
          if (result === false) event.preventDefault();
        }
      }
      if (this.parentNode && this.parentNode.dispatch) {
        this.parentNode.dispatch(event);
      }
    },

    subscribe: function (type, fn, bind) {
      if (typeof type != 'string') {
        // listen type / fn with object
        var subscriptions = [];
        for (var t in type) subscriptions.push(this.subscribe(t, type[t]));
        return function () {
          // unsubscribe
          for (var i = 0, l = subscriptions.length; i < l; i++)
            subscriptions[i]();
          return this;
        };
      } else {
        // listen to one
        var bound = typeof fn === 'function' ? fn.bind(bind || this) : fn,
          events = this._events || (this._events = {}),
          listeners = events[type] || (events[type] = []);
        listeners.push(bound);
        return function () {
          // unsubscribe
          for (var i = 0, l = listeners.length; i < l; i++) {
            if (listeners[i] === bound) {
              listeners.splice(i, 1);
              break;
            }
          }
        };
      }
    },
  });

  var CanvasNode = _class(transform, dummy, {
    invalidate: function () {
      if (this.parentNode) this.parentNode.invalidate();
      if (this._layer) this._layerCache = null;
      return this;
    },

    _place: function () {
      this.invalidate();
    },

    _transform: function () {
      this.invalidate();
    },

    blend: function (opacity) {
      if (opacity >= 1 && this._layer) this._layer = null;
      this._opacity = opacity;
      if (this.parentNode) this.parentNode.invalidate();
      return this;
    },

    // visibility

    hide: function () {
      this._invisible = true;
      if (this.parentNode) this.parentNode.invalidate();
      return this;
    },

    show: function () {
      this._invisible = false;
      if (this.parentNode) this.parentNode.invalidate();
      return this;
    },

    // interaction

    indicate: function (cursor, tooltip) {
      this._cursor = cursor;
      this._tooltip = tooltip;
      return this.invalidate();
    },

    hitTest: function (x, y) {
      if (this._invisible) return null;
      var point = this.inversePoint(x, y);
      if (!point) return null;
      return this.localHitTest(point.x, point.y);
    },

    // rendering

    renderTo: function (context, xx, yx, xy, yy, x, y) {
      var opacity = this._opacity;
      if (opacity == null || opacity >= 1) {
        return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
      }

      // Render to a compositing layer and cache it

      var layer = this._layer,
        canvas,
        isDirty = true,
        w = context.canvas.width,
        h = context.canvas.height;
      if (layer) {
        layer.setTransform(1, 0, 0, 1, 0, 0);
        canvas = layer.canvas;
        if (canvas.width < w || canvas.height < h) {
          canvas.width = w;
          canvas.height = h;
        } else {
          var c = this._layerCache;
          if (
            c &&
            c.xx === xx &&
            c.yx === yx &&
            c.xy === xy &&
            c.yy === yy &&
            c.x === x &&
            c.y === y
          ) {
            isDirty = false;
          } else {
            layer.clearRect(0, 0, w, h);
          }
        }
      } else {
        canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        this._layer = layer = canvas.getContext('2d');
      }

      if (isDirty) {
        this.renderLayerTo(layer, xx, yx, xy, yy, x, y);
        this._layerCache = {
          xx: xx,
          yx: yx,
          xy: xy,
          yy: yy,
          x: x,
          y: y,
        };
      }

      context.globalAlpha = opacity;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.drawImage(canvas, 0, 0, w, h, 0, 0, w, h);
      context.globalAlpha = 1;
    },
  });

  var node = CanvasNode;

  var genericCanvas =
    typeof document !== 'undefined' && document.createElement('canvas');
  var genericContext =
    genericCanvas && genericCanvas.getContext && genericCanvas.getContext('2d');

  function recolorImage(img, color1, color2) {
    // TODO: Fix this experimental implementation
    color1 = color.detach(color1);
    color2 = color.detach(color2);
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.fillStyle = color2[0];
    context.fillRect(0, 0, img.width, img.height);
    context.globalCompositeOperation = 'lighter';
    context.drawImage(img, 0, 0);
    return canvas;
  }

  var Base = _class(node, {
    initialize: function () {
      this._fill = null;
      this._pendingFill = null;
      this._fillTransform = null;
      this._stroke = null;
      this._strokeCap = null;
      this._strokeDash = null;
      this._strokeJoin = null;
      this._strokeWidth = null;
    },

    /* styles */

    _addColors: function (gradient, stops) {
      // Enumerate stops, assumes offsets are enumerated in order
      // TODO: Sort. Chrome doesn't always enumerate in expected order but requires stops to be specified in order.
      if ('length' in stops)
        for (var i = 0, l = stops.length - 1; i <= l; i++)
          gradient.addColorStop(i / l, new color(stops[i]).toString());
      else
        for (var offset in stops)
          gradient.addColorStop(offset, new color(stops[offset]).toString());
      return gradient;
    },

    fill: function (color$$1) {
      if (arguments.length > 1) return this.fillLinear(arguments);
      if (this._pendingFill) this._pendingFill();
      this._fill = color$$1 ? new color(color$$1).toString() : null;
      return this.invalidate();
    },

    fillRadial: function (
      stops,
      focusX,
      focusY,
      radiusX,
      radiusY,
      centerX,
      centerY
    ) {
      if (focusX == null) focusX = (this.left || 0) + (this.width || 0) * 0.5;
      if (focusY == null) focusY = (this.top || 0) + (this.height || 0) * 0.5;
      if (radiusY == null) radiusY = radiusX || this.height * 0.5 || 0;
      if (radiusX == null) radiusX = (this.width || 0) * 0.5;
      if (centerX == null) centerX = focusX;
      if (centerY == null) centerY = focusY;

      centerX += centerX - focusX;
      centerY += centerY - focusY;

      if (radiusX === 0 || radiusX === '0') return this.fillLinear(stops);
      var ys = radiusY / radiusX;

      if (this._pendingFill) this._pendingFill();

      var gradient = genericContext.createRadialGradient(
        focusX,
        focusY / ys,
        0,
        centerX,
        centerY / ys,
        radiusX * 2
      );

      // Double fill radius to simulate repeating gradient
      if ('length' in stops)
        for (var i = 0, l = stops.length - 1; i <= l; i++) {
          gradient.addColorStop(i / l / 2, new color(stops[i]).toString());
          gradient.addColorStop(1 - i / l / 2, new color(stops[i]).toString());
        }
      else
        for (var offset in stops) {
          gradient.addColorStop(
            offset / 2,
            new color(stops[offset]).toString()
          );
          gradient.addColorStop(
            1 - offset / 2,
            new color(stops[offset]).toString()
          );
        }

      this._fill = gradient;
      this._fillTransform = new transform(1, 0, 0, ys);
      return this.invalidate();
    },

    fillLinear: function (stops, x1, y1, x2, y2) {
      if (arguments.length < 5) {
        var angle = ((x1 == null ? 270 : x1) * Math.PI) / 180;

        var x = Math.cos(angle),
          y = -Math.sin(angle),
          l = (Math.abs(x) + Math.abs(y)) / 2,
          w = this.width || 1,
          h = this.height || 1;

        x *= l;
        y *= l;

        x1 = 0.5 - x;
        x2 = 0.5 + x;
        y1 = 0.5 - y;
        y2 = 0.5 + y;
        this._fillTransform = new transform(w, 0, 0, h);
      } else {
        this._fillTransform = null;
      }
      if (this._pendingFill) this._pendingFill();
      var gradient = genericContext.createLinearGradient(x1, y1, x2, y2);
      this._addColors(gradient, stops);
      this._fill = gradient;
      return this.invalidate();
    },

    fillImage: function (url, width, height, left, top, color1, color2) {
      if (this._pendingFill) this._pendingFill();
      var img = url;
      if (!(img instanceof Image)) {
        img = new Image();
        img.src = url;
      }
      if (img.width && img.height) {
        return this._fillImage(
          img,
          width,
          height,
          left || 0,
          top || 0,
          color1,
          color2
        );
      }

      // Not yet loaded
      this._fill = null;
      var self = this,
        callback = function () {
          cancel();
          self._fillImage(
            img,
            width,
            height,
            left || 0,
            top || 0,
            color1,
            color2
          );
        },
        cancel = function () {
          img.removeEventListener('load', callback, false);
          self._pendingFill = null;
        };
      this._pendingFill = cancel;
      img.addEventListener('load', callback, false);
      return this;
    },

    _fillImage: function (img, width, height, left, top, color1, color2) {
      var w = width ? width / img.width : 1,
        h = height ? height / img.height : 1;
      if (color1 != null) img = recolorImage(img, color1, color2);
      this._fill = genericContext.createPattern(img, 'repeat');
      this._fillTransform = new transform(w, 0, 0, h, left || 0, top || 0);
      return this.invalidate();
    },

    stroke: function (color$$1, width, cap, join, dash) {
      this._stroke = color$$1 ? new color(color$$1).toString() : null;
      this._strokeWidth = width != null ? width : 1;
      this._strokeCap = cap != null ? cap : 'round';
      this._strokeJoin = join != null ? join : 'round';
      this._strokeDash = dash;
      return this.invalidate();
    },

    // Rendering

    element_renderTo: node.prototype.renderTo,

    renderTo: function (context, xx, yx, xy, yy, x, y) {
      var opacity = this._opacity;
      if (opacity == null || opacity >= 1) {
        return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
      }
      if (this._fill && this._stroke) {
        return this.element_renderTo(context, xx, yx, xy, yy, x, y);
      }
      context.globalAlpha = opacity;
      var r = this.renderLayerTo(context, xx, yx, xy, yy, x, y);
      context.globalAlpha = 1;
      return r;
    },

    renderLayerTo: function (context, xx, yx, xy, yy, x, y) {
      context.setTransform(xx, yx, xy, yy, x, y);
      this.renderShapeTo(context);
    },
  });

  Base._genericContext = genericContext;

  var base = Base;

  var shape = _class(base, {
    base_initialize: base.prototype.initialize,

    initialize: function (path$$1, width, height) {
      this.base_initialize();
      this.width = width;
      this.height = height;
      if (path$$1 != null) this.draw(path$$1);
    },

    draw: function (path$$1, width, height) {
      if (!(path$$1 instanceof path)) path$$1 = new path(path$$1);
      this.path = path$$1;
      this._commands = path$$1.toCommands();
      if (width != null) this.width = width;
      if (height != null) this.height = height;
      return this.invalidate();
    },

    localHitTest: function (x, y) {
      if (!this._fill) return null;
      if (this.width == null || this.height == null) {
        var context = base._genericContext,
          commands = this._commands;
        if (!commands) return null;
        context.beginPath();
        for (var i = 0, l = commands.length; i < l; i++) commands[i](context);
        return context.isPointInPath(x, y) ? this : null;
      }
      if (x > 0 && y > 0 && x < this.width && y < this.height) {
        return this;
      }
      return null;
    },

    renderShapeTo: function (context) {
      if (
        this._invisible ||
        !this._commands ||
        (!this._fill && !this._stroke)
      ) {
        return null;
      }
      context.transform(this.xx, this.yx, this.xy, this.yy, this.x, this.y);
      var commands = this._commands,
        fill = this._fill,
        stroke = this._stroke,
        dash = this._strokeDash;

      context.beginPath();

      if (dash) {
        if (context.setLineDash) {
          context.setLineDash(dash);
        } else {
          // TODO: Remove when FF supports setLineDash.
          context.mozDash = dash;
        }
        // TODO: Create fallback to other browsers.
      } else {
        if (context.setLineDash) {
          context.setLineDash([]);
        } else {
          context.mozDash = null;
        }
      }

      for (var i = 0, l = commands.length; i < l; i++) commands[i](context);

      if (fill) {
        var m = this._fillTransform;
        if (m) {
          context.save(); // TODO: Optimize away this by restoring the transform before stroking
          context.transform(m.xx, m.yx, m.xy, m.yy, m.x, m.y);
          context.fillStyle = fill;
          context.fill();
          context.restore();
        } else {
          context.fillStyle = fill;
          context.fill();
        }
      }
      if (stroke) {
        context.strokeStyle = stroke;
        context.lineWidth = this._strokeWidth;
        context.lineCap = this._strokeCap;
        context.lineJoin = this._strokeJoin;
        context.stroke();
      }
    },
  });

  var group = _class(node, container, {
    initialize: function (width, height) {
      this.width = width;
      this.height = height;
    },

    localHitTest: function (x, y) {
      var node$$2 = this.lastChild;
      while (node$$2) {
        var hit = node$$2.hitTest(x, y);
        if (hit) return hit;
        node$$2 = node$$2.previousSibling;
      }
      return null;
    },

    renderLayerTo: function (context, xx, yx, xy, yy, x, y) {
      if (this._invisible) return;

      x = xx * this.x + xy * this.y + x;
      y = yx * this.x + yy * this.y + y;

      var t = xx;
      xx = t * this.xx + xy * this.yx;
      xy = t * this.xy + xy * this.yy;
      t = yx;
      yx = t * this.xx + yy * this.yx;
      yy = t * this.xy + yy * this.yy;

      var node$$2 = this.firstChild;
      while (node$$2) {
        node$$2.renderTo(context, xx, yx, xy, yy, x, y);
        node$$2 = node$$2.nextSibling;
      }
    },
  });

  var clippingrectangle = _class(node, container, {
    initialize: function (width, height) {
      this.width = width;
      this.height = height;
    },

    localHitTest: function (x, y) {
      var node$$2 = this.lastChild;
      while (node$$2) {
        var hit = node$$2.hitTest(x, y);
        if (hit) return hit;
        node$$2 = node$$2.previousSibling;
      }
      return null;
    },

    renderLayerTo: function (context, xx, yx, xy, yy, x, y) {
      context.setTransform(xx, yx, xy, yy, x, y);
      context.save();
      // Need beginPath to fix Firefox bug. See 3354054.
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      context.clip();

      var node$$2 = this.firstChild;
      while (node$$2) {
        node$$2.renderTo(context, xx, yx, xy, yy, x, y);
        node$$2 = node$$2.nextSibling;
      }
      context.restore();
    },
  });

  var fontAnchors = { middle: 'center' };

  var text = _class(base, {
    base_initialize: base.prototype.initialize,

    initialize: function (text, font, alignment, path) {
      this.base_initialize();
      this.draw.apply(this, arguments);
    },

    draw: function (text, font, alignment, path) {
      var em;
      if (typeof font == 'string') {
        em = Number(/(\d+)/.exec(font)[0]);
      } else if (font) {
        em = parseFloat(font.fontSize || font['font-size'] || '12');
        font =
          (font.fontStyle || font['font-style'] || '') +
          ' ' +
          (font.fontVariant || font['font-variant'] || '') +
          ' ' +
          (font.fontWeight || font['font-weight'] || '') +
          ' ' +
          em +
          'px ' +
          (font.fontFamily || font['font-family'] || 'Arial');
      } else {
        font = this._font;
      }

      var lines = text && text.split(/\r?\n/);
      this._font = font;
      this._fontSize = em;
      this._text = lines;
      this._alignment = fontAnchors[alignment] || alignment || 'left';

      var context = base._genericContext;

      context.font = this._font;
      context.textAlign = this._alignment;
      context.textBaseline = 'middle';

      lines = this._text;
      var l = lines.length,
        width = 0;
      for (var i = 0; i < l; i++) {
        var w = context.measureText(lines[i]).width;
        if (w > width) width = w;
      }
      this.width = width;
      this.height = l ? l * 1.1 * em : 0;
      return this.invalidate();
    },

    // Interaction

    localHitTest: function (x, y) {
      if (!this._fill) return null;
      if (x > 0 && y > 0 && x < this.width && y < this.height) {
        return this;
      }
      return null;
    },

    // Rendering

    renderShapeTo: function (context) {
      if (this._invisible || !this._text || (!this._fill && !this._stroke)) {
        return null;
      }
      context.transform(this.xx, this.yx, this.xy, this.yy, this.x, this.y);
      var fill = this._fill,
        stroke = this._stroke,
        text = this._text,
        dash = this._strokeDash;

      context.font = this._font;
      context.textAlign = this._alignment;
      context.textBaseline = 'middle';

      var em = this._fontSize,
        y = em / 2,
        lineHeight = 1.1 * em,
        lines = text,
        l = lines.length;

      if (fill) {
        context.fillStyle = fill;
        for (var i = 0; i < l; i++)
          context.fillText(lines[i], 0, y + i * lineHeight);
      }
      if (stroke) {
        if (dash) {
          if (context.setLineDash) {
            context.setLineDash(dash);
          } else {
            // TODO: Remove when FF supports setLineDash.
            context.mozDash = dash;
          }
          // TODO: Create fallback to other browsers.
        } else {
          if (context.setLineDash) {
            context.setLineDash([]);
          } else {
            context.mozDash = null;
          }
        }

        context.strokeStyle = stroke;
        context.lineWidth = this._strokeWidth;
        context.lineCap = this._strokeCap;
        context.lineJoin = this._strokeJoin;
        for (i = 0; i < l; i++)
          context.strokeText(lines[i], 0, y + i * lineHeight);
      }
    },
  });

  var VMLCSS =
    'behavior:url(#default#VML);display:inline-block;position:absolute;left:0px;top:0px;';

  var styleSheet;
  var styledTags = {};
  var styleTag = function (tag) {
    if (styleSheet) styledTags[tag] = styleSheet.addRule('av\\:' + tag, VMLCSS);
  };

  var init = function (document) {
    var namespaces;
    try {
      // IE9 workaround: sometimes it throws here
      namespaces = document.namespaces;
    } catch (e) {}
    if (!namespaces) return false;

    namespaces.add('av', 'urn:schemas-microsoft-com:vml');
    namespaces.add('ao', 'urn:schemas-microsoft-com:office:office');

    styleSheet = document.createStyleSheet();
    styleSheet.addRule(
      'vml',
      'display:inline-block;position:relative;overflow:hidden;'
    );
    /*	styleTag('skew');
	styleTag('fill');
	styleTag('stroke');
	styleTag('path');
	styleTag('textpath');
	styleTag('group');*/

    styleTag('vml');

    return true;
  };

  var createElement = function (tag) {
    if (!(tag in styledTags)) styleTag(tag);
    return document.createElement('av:' + tag);
  };

  var dom = {
    init: init,
    createElement: createElement,
  };

  var precision = 100;

  var VMLSurface = _class(native_1, container, {
    initialize: function VMLSurface(width, height, existingElement) {
      this.element = existingElement || document.createElement('vml');
      this.containerElement = dom.createElement('group');
      this.element.appendChild(this.containerElement);
      if (width != null && height != null) this.resize(width, height);
    },

    resize: function (width, height) {
      this.width = width;
      this.height = height;

      var style = this.element.style;
      style.pixelWidth = width;
      style.pixelHeight = height;

      style = this.containerElement.style;
      style.width = width;
      style.height = height;

      var halfPixel = 0.5 * precision;

      this.containerElement.coordorigin = halfPixel + ',' + halfPixel;
      this.containerElement.coordsize =
        width * precision + ',' + height * precision;

      return this;
    },
  });

  VMLSurface.tagName = 'av:vml';

  var surface$2 = VMLSurface;

  var precision$1 = 100;

  var round = Math.round;

  var VMLPath = _class(path$2, {
    initialize: function (path) {
      this.reset();
      if (path instanceof VMLPath) {
        this.path = [Array.prototype.join.call(path.path, ' ')];
      } else if (path) {
        if (path.applyToPath) path.applyToPath(this);
        else this.push(path);
      }
    },

    onReset: function () {
      this.path = [];
    },

    onMove: function (sx, sy, x, y) {
      this.path.push('m', round(x * precision$1), round(y * precision$1));
    },

    onLine: function (sx, sy, x, y) {
      this.path.push('l', round(x * precision$1), round(y * precision$1));
    },

    onBezierCurve: function (sx, sy, p1x, p1y, p2x, p2y, x, y) {
      this.path.push(
        'c',
        round(p1x * precision$1),
        round(p1y * precision$1),
        round(p2x * precision$1),
        round(p2y * precision$1),
        round(x * precision$1),
        round(y * precision$1)
      );
    },

    _arcToBezier: path$2.prototype.onArc,

    onArc: function (sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) {
      if (rx != ry || rotation)
        return this._arcToBezier(
          sx,
          sy,
          ex,
          ey,
          cx,
          cy,
          rx,
          ry,
          sa,
          ea,
          ccw,
          rotation
        );
      cx *= precision$1;
      cy *= precision$1;
      rx *= precision$1;
      this.path.push(
        ccw ? 'at' : 'wa',
        round(cx - rx),
        round(cy - rx),
        round(cx + rx),
        round(cy + rx),
        round(sx * precision$1),
        round(sy * precision$1),
        round(ex * precision$1),
        round(ey * precision$1)
      );
    },

    onClose: function () {
      this.path.push('x');
    },

    toVML: function () {
      return this.path.join(' ');
    },
  });

  VMLPath.prototype.toString = VMLPath.prototype.toVML;

  var path$4 = VMLPath;

  var shadow = _class(dummy, native_1, {
    dummy_inject: dummy.prototype.inject,
    dummy_injectBefore: dummy.prototype.injectBefore,
    dummy_eject: dummy.prototype.eject,
    native_inject: native_1.prototype.inject,
    native_injectBefore: native_1.prototype.injectBefore,
    native_eject: native_1.prototype.eject,

    inject: function (container) {
      this.dummy_inject(container);
      this.native_inject(container);
      return this;
    },

    injectBefore: function (sibling) {
      this.dummy_injectBefore(sibling);
      this.native_injectBefore(sibling);
      return this;
    },

    eject: function () {
      this.dummy_eject();
      this.native_eject();
      return this;
    },
  });

  var node$2 = _class(shadow, transform, {
    initialize: function (tag) {
      //this.uid = uniqueID();
      var element = (this.element = dom.createElement(tag));
      //element.setAttribute('id', 'e' + this.uid);
    },

    _place: function () {
      if (this.parentNode) {
        this._transform();
      }
    },

    // visibility

    hide: function () {
      this.element.style.display = 'none';
      return this;
    },

    show: function () {
      this.element.style.display = '';
      return this;
    },

    // interaction

    indicate: function (cursor, tooltip) {
      if (cursor) this.element.style.cursor = cursor;
      if (tooltip) this.element.title = tooltip;
      return this;
    },
  });

  var precision$3 = 100;

  var defaultBox = { left: 0, top: 0, width: 500, height: 500 };

  var base$2 = _class(node$2, {
    element_initialize: node$2.prototype.initialize,

    initialize: function (tag) {
      this.element_initialize(tag);
      var element = this.element;

      var skew = (this.skewElement = dom.createElement('skew'));
      skew.on = true;
      element.appendChild(skew);

      var fill = (this.fillElement = dom.createElement('fill'));
      fill.on = false;
      element.appendChild(fill);

      var stroke = (this.strokeElement = dom.createElement('stroke'));
      stroke.on = false;
      element.appendChild(stroke);
    },

    /* transform */

    _transform: function () {
      var container = this.parentNode;

      // Active Transformation Matrix
      var m = container
        ? new transform(container._activeTransform).transform(this)
        : this;

      // Box in shape user space

      var box = this._boxCoords || this._size || defaultBox;

      var originX = box.left || 0,
        originY = box.top || 0,
        width = box.width || 1,
        height = box.height || 1;

      // Flipped
      var flip = m.yx / m.xx > m.yy / m.xy;
      if (m.xx < 0 ? m.xy >= 0 : m.xy < 0) flip = !flip;
      flip = flip ? -1 : 1;

      m = new transform().scale(flip, 1).transform(m);

      // Rotation is approximated based on the transform
      var rotation = (Math.atan2(-m.xy, m.yy) * 180) / Math.PI;

      // Reverse the rotation, leaving the final transform in box space
      var rad = (rotation * Math.PI) / 180,
        sin = Math.sin(rad),
        cos = Math.cos(rad);

      var transform$$2 = new transform(
        m.xx * cos - m.xy * sin,
        (m.yx * cos - m.yy * sin) * flip,
        (m.xy * cos + m.xx * sin) * flip,
        m.yy * cos + m.yx * sin
      );

      var rotationTransform = new transform().rotate(rotation, 0, 0);

      var shapeToBox = new transform()
        .rotate(-rotation, 0, 0)
        .transform(m)
        .moveTo(0, 0);

      // Scale box after reversing rotation
      width *= Math.abs(shapeToBox.xx);
      height *= Math.abs(shapeToBox.yy);

      // Place box
      var left = m.x,
        top = m.y;

      // Compensate for offset by center origin rotation
      var vx = -width / 2,
        vy = -height / 2;
      var point = rotationTransform.point(vx, vy);
      left -= point.x - vx;
      top -= point.y - vy;

      // Adjust box position based on offset
      var rsm = new transform(m).moveTo(0, 0);
      point = rsm.point(originX, originY);
      left += point.x;
      top += point.y;

      if (flip < 0) left = -left - width;

      // Place transformation origin
      var point0 = rsm.point(-originX, -originY);
      var point1 = rotationTransform.point(width, height);
      var point2 = rotationTransform.point(width, 0);
      var point3 = rotationTransform.point(0, height);

      var minX = Math.min(0, point1.x, point2.x, point3.x),
        maxX = Math.max(0, point1.x, point2.x, point3.x),
        minY = Math.min(0, point1.y, point2.y, point3.y),
        maxY = Math.max(0, point1.y, point2.y, point3.y);

      var transformOriginX = ((point0.x - point1.x / 2) / (maxX - minX)) * flip,
        transformOriginY = (point0.y - point1.y / 2) / (maxY - minY);

      // Adjust the origin
      point = shapeToBox.point(originX, originY);
      originX = point.x;
      originY = point.y;

      // Scale stroke
      var strokeWidth = this._strokeWidth;
      if (strokeWidth) {
        // Scale is the hypothenus between the two vectors
        // TODO: Use area calculation instead
        var vx = m.xx + m.xy,
          vy = m.yy + m.yx;
        strokeWidth *= Math.sqrt(vx * vx + vy * vy) / Math.sqrt(2);
      }

      // convert to multiplied precision space
      originX *= precision$3;
      originY *= precision$3;
      left *= precision$3;
      top *= precision$3;
      width *= precision$3;
      height *= precision$3;

      // Set box
      var element = this.element;
      element.coordorigin = originX + ',' + originY;
      element.coordsize = width + ',' + height;
      element.style.left = left + 'px';
      element.style.top = top + 'px';
      element.style.width = width;
      element.style.height = height;
      element.style.rotation = rotation.toFixed(8);
      element.style.flip = flip < 0 ? 'x' : '';

      // Set transform
      var skew = this.skewElement;
      skew.matrix = [
        transform$$2.xx.toFixed(4),
        transform$$2.xy.toFixed(4),
        transform$$2.yx.toFixed(4),
        transform$$2.yy.toFixed(4),
        0,
        0,
      ];
      skew.origin = transformOriginX + ',' + transformOriginY;

      // Set stroke
      this.strokeElement.weight = strokeWidth + 'px';
    },

    /* styles */

    _createGradient: function (style, stops) {
      var fill = this.fillElement;

      // Temporarily eject the fill from the DOM
      this.element.removeChild(fill);

      fill.type = style;
      fill.method = 'none';
      fill.rotate = true;

      var colors = [],
        color1,
        color2;

      var addColor = function (offset, color$$2) {
        color$$2 = color.detach(color$$2);
        if (color1 == null) color1 = color2 = color$$2;
        else color2 = color$$2;
        colors.push(offset + ' ' + color$$2[0]);
      };

      // Enumerate stops, assumes offsets are enumerated in order
      if ('length' in stops)
        for (var i = 0, l = stops.length - 1; i <= l; i++)
          addColor(i / l, stops[i]);
      else for (var offset in stops) addColor(offset, stops[offset]);

      fill.color = color1[0];
      fill.color2 = color2[0];

      //if (fill.colors) fill.colors.value = colors; else
      fill.colors = colors;

      // Opacity order gets flipped when color stops are specified
      fill.opacity = color2[1];
      fill['ao:opacity2'] = color1[1];

      fill.on = true;
      this.element.appendChild(fill);
      return fill;
    },

    _setColor: function (type, color$$2) {
      var element = type == 'fill' ? this.fillElement : this.strokeElement;
      if (color$$2 == null) {
        element.on = false;
      } else {
        color$$2 = color.detach(color$$2);
        element.color = color$$2[0];
        element.opacity = color$$2[1];
        element.on = true;
      }
    },

    fill: function (color$$2) {
      if (arguments.length > 1) {
        this.fillLinear(arguments);
      } else {
        this._boxCoords = defaultBox;
        var fill = this.fillElement;
        fill.type = 'solid';
        fill.color2 = '';
        fill['ao:opacity2'] = '';
        if (fill.colors) fill.colors.value = '';
        this._setColor('fill', color$$2);
      }
      return this;
    },

    fillRadial: function (
      stops,
      focusX,
      focusY,
      radiusX,
      radiusY,
      centerX,
      centerY
    ) {
      var fill = this._createGradient('gradientradial', stops);
      if (focusX == null) focusX = this.left + this.width * 0.5;
      if (focusY == null) focusY = this.top + this.height * 0.5;
      if (radiusY == null) radiusY = radiusX || this.height * 0.5;
      if (radiusX == null) radiusX = this.width * 0.5;
      if (centerX == null) centerX = focusX;
      if (centerY == null) centerY = focusY;

      centerX += centerX - focusX;
      centerY += centerY - focusY;

      var box = (this._boxCoords = {
        left: centerX - radiusX * 2,
        top: centerY - radiusY * 2,
        width: radiusX * 4,
        height: radiusY * 4,
      });
      focusX -= box.left;
      focusY -= box.top;
      focusX /= box.width;
      focusY /= box.height;

      fill.focussize = '0 0';
      fill.focusposition = focusX + ',' + focusY;
      fill.focus = '50%';

      this._transform();

      return this;
    },

    fillLinear: function (stops, x1, y1, x2, y2) {
      var fill = this._createGradient('gradient', stops);
      fill.focus = '100%';
      if (arguments.length == 5) {
        var w = Math.abs(x2 - x1),
          h = Math.abs(y2 - y1);
        this._boxCoords = {
          left: Math.min(x1, x2),
          top: Math.min(y1, y2),
          width: w < 1 ? h : w,
          height: h < 1 ? w : h,
        };
        fill.angle =
          (360 + (Math.atan2((x2 - x1) / h, (y2 - y1) / w) * 180) / Math.PI) %
          360;
      } else {
        this._boxCoords = null;
        fill.angle = x1 == null ? 0 : (90 + x1) % 360;
      }
      this._transform();
      return this;
    },

    fillImage: function (url, width, height, left, top, color1, color2) {
      var fill = this.fillElement;
      if (color1 != null) {
        color1 = color.detach(color1);
        if (color2 != null) color2 = color.detach(color2);
        fill.type = 'pattern';
        fill.color = color1[0];
        fill.color2 = color2 == null ? color1[0] : color2[0];
        fill.opacity = color2 == null ? 0 : color2[1];
        fill['ao:opacity2'] = color1[1];
      } else {
        fill.type = 'tile';
        fill.color = '';
        fill.color2 = '';
        fill.opacity = 1;
        fill['ao:opacity2'] = 1;
      }
      if (fill.colors) fill.colors.value = '';
      fill.rotate = true;
      fill.src = url;

      fill.size = '1,1';
      fill.position = '0,0';
      fill.origin = '0,0';
      fill.aspect = 'ignore'; // ignore, atleast, atmost
      fill.on = true;

      if (!left) left = 0;
      if (!top) top = 0;
      this._boxCoords = width
        ? { left: left + 0.5, top: top + 0.5, width: width, height: height }
        : null;
      this._transform();
      return this;
    },

    /* stroke */

    stroke: function (color$$2, width, cap, join) {
      var stroke = this.strokeElement;
      this._strokeWidth = width != null ? width : 1;
      stroke.weight = width != null ? width + 'px' : 1;
      stroke.endcap = cap != null ? (cap == 'butt' ? 'flat' : cap) : 'round';
      stroke.joinstyle = join != null ? join : 'round';

      this._setColor('stroke', color$$2);
      return this;
    },
  });

  var precision$2 = 100;

  var shape$2 = _class(base$2, {
    base_initialize: base$2.prototype.initialize,

    initialize: function (path, width, height) {
      this.base_initialize('shape');

      var p = (this.pathElement = dom.createElement('path'));
      p.gradientshapeok = true;
      this.element.appendChild(p);

      this.width = width;
      this.height = height;

      if (path != null) this.draw(path);
    },

    // SVG to VML

    draw: function (path, width, height) {
      if (!(path instanceof path$4)) path = new path$4(path);
      this._vml = path.toVML();
      //this._size = path.measure();

      if (width != null) this.width = width;
      if (height != null) this.height = height;

      if (!this._boxCoords) this._transform();
      this._redraw(this._prefix, this._suffix);

      return this;
    },

    // radial gradient workaround

    _redraw: function (prefix, suffix) {
      var vml = this._vml || '';

      this._prefix = prefix;
      this._suffix = suffix;
      if (prefix) {
        vml = [
          prefix,
          vml,
          suffix,
          // Don't stroke the path with the extra ellipse, redraw the stroked path separately
          'ns e',
          vml,
          'nf',
        ].join(' ');
      }

      this.element.path = vml + 'e';
    },

    fillRadial: function (
      stops,
      focusX,
      focusY,
      radiusX,
      radiusY,
      centerX,
      centerY
    ) {
      var fill = this._createGradient('gradientradial', stops);
      if (focusX == null) focusX = (this.left || 0) + (this.width || 0) * 0.5;
      if (focusY == null) focusY = (this.top || 0) + (this.height || 0) * 0.5;
      if (radiusY == null) radiusY = radiusX || this.height * 0.5 || 0;
      if (radiusX == null) radiusX = (this.width || 0) * 0.5;
      if (centerX == null) centerX = focusX;
      if (centerY == null) centerY = focusY;

      centerX += centerX - focusX;
      centerY += centerY - focusY;

      var cx = Math.round(centerX * precision$2),
        cy = Math.round(centerY * precision$2),
        rx = Math.round(radiusX * 2 * precision$2),
        ry = Math.round(radiusY * 2 * precision$2),
        arc = ['wa', cx - rx, cy - ry, cx + rx, cy + ry].join(' ');

      this._redraw(
        // Resolve rendering bug
        ['m', cx, cy - ry, 'l', cx, cy - ry].join(' '),
        // Draw an ellipse around the path to force an elliptical gradient on any shape
        [
          'm',
          cx,
          cy - ry,
          arc,
          cx,
          cy - ry,
          cx,
          cy + ry,
          arc,
          cx,
          cy + ry,
          cx,
          cy - ry,
          arc,
          cx,
          cy - ry,
          cx,
          cy + ry,
          arc,
          cx,
          cy + ry,
          cx,
          cy - ry,
        ].join(' ')
      );

      this._boxCoords = {
        left: focusX - 2,
        top: focusY - 2,
        width: 4,
        height: 4,
      };

      fill.focusposition = '0.5,0.5';
      fill.focussize = '0 0';
      fill.focus = '50%';

      this._transform();

      return this;
    },
  });

  var group$2 = _class(node$2, container, {
    element_initialize: node$2.prototype.initialize,

    initialize: function (width, height) {
      this.element_initialize('group');
      this.width = width;
      this.height = height;
    },

    _transform: function () {
      var element = this.element;
      element.coordorigin = '0,0';
      element.coordsize = '1000,1000';
      element.style.left = 0;
      element.style.top = 0;
      element.style.width = 1000;
      element.style.height = 1000;
      element.style.rotation = 0;

      var container$$2 = this.parentNode;
      this._activeTransform = container$$2
        ? new transform(container$$2._activeTransform).transform(this)
        : this;
      var node = this.firstChild;
      while (node) {
        node._transform();
        node = node.nextSibling;
      }
    },
  });

  var clippingrectangle$2 = _class(node$2, container, {
    element_initialize: node$2.prototype.initialize,

    initialize: function (width, height) {
      this.element_initialize('clippingrectangle');
      this.width = width;
      this.height = height;
    },

    _transform: function () {
      var element = this.element;
      element.clip = true;
      element.coordorigin = -this.x + ',' + -1 * this.y;
      element.coordsize = this.width + ',' + this.height;
      // IE8 doesn't like clipBottom.  Don't ask me why.
      // element.style.clipBottom = this.height + this.y;
      element.style.clipLeft = this.x;
      element.style.clipRight = this.width + this.x;
      element.style.clipTop = this.y;
      element.style.left = -this.x;
      element.style.top = -this.y;
      element.style.width = this.width + this.x;
      element.style.height = this.height + this.y;
      element.style.rotation = 0;

      var container$$2 = this.parentNode;
      this._activeTransform = container$$2
        ? new transform(container$$2._activeTransform).transform(this)
        : this;
      var node = this.firstChild;
      while (node) {
        node._transform();
        node = node.nextSibling;
      }
    },
  });

  var fontAnchors$1 = { start: 'left', middle: 'center', end: 'right' };

  var text$2 = _class(base$2, {
    base_initialize: base$2.prototype.initialize,

    initialize: function (text, font, alignment, path) {
      this.base_initialize('shape');

      var p = (this.pathElement = dom.createElement('path'));
      p.textpathok = true;
      this.element.appendChild(p);

      p = this.textPathElement = dom.createElement('textpath');
      p.on = true;
      p.style['v-text-align'] = 'left';
      this.element.appendChild(p);

      this.draw.apply(this, arguments);
    },

    draw: function (text, font, alignment, path) {
      var element = this.element,
        textPath = this.textPathElement,
        style = textPath.style;

      textPath.string = text;

      if (font) {
        if (typeof font == 'string') {
          style.font = font;
        } else {
          for (var key in font) {
            var ckey = key.camelCase ? key.camelCase() : key;
            if (ckey == 'fontFamily') style[ckey] = "'" + font[key] + "'";
            // NOT UNIVERSALLY SUPPORTED OPTIONS
            // else if (ckey == 'kerning') style['v-text-kern'] = !!font[key];
            // else if (ckey == 'rotateGlyphs') style['v-rotate-letters'] = !!font[key];
            // else if (ckey == 'letterSpacing') style['v-text-spacing'] = Number(font[key]) + '';
            else style[ckey] = font[key];
          }
        }
      }

      if (alignment)
        style['v-text-align'] = fontAnchors$1[alignment] || alignment;

      if (path) {
        this.currentPath = path = new path$4(path);
        this.element.path = path.toVML();
      } else if (!this.currentPath) {
        var i = -1,
          offsetRows = '\n';
        while ((i = text.indexOf('\n', i + 1)) > -1) offsetRows += '\n';
        textPath.string = offsetRows + textPath.string;
        this.element.path = 'm0,0l1,0';
      }

      // Measuring the bounding box is currently necessary for gradients etc.

      // Clone element because the element is dead once it has been in the DOM
      element = element.cloneNode(true);
      style = element.style;

      // Reset coordinates while measuring
      element.coordorigin = '0,0';
      element.coordsize = '10000,10000';
      style.left = '0px';
      style.top = '0px';
      style.width = '10000px';
      style.height = '10000px';
      style.rotation = 0;
      element.removeChild(element.firstChild); // Remove skew

      // Inject the clone into the document

      var canvas = new surface$2(1, 1),
        group = new group$2(), // Wrapping it in a group seems to alleviate some client rect weirdness
        body = element.ownerDocument.body;

      canvas.inject(body);
      group.element.appendChild(element);
      group.inject(canvas);

      var ebb = element.getBoundingClientRect(),
        cbb = canvas.toElement().getBoundingClientRect();

      canvas.eject();

      this.left = ebb.left - cbb.left;
      this.top = ebb.top - cbb.top;
      this.width = ebb.right - ebb.left;
      this.height = ebb.bottom - ebb.top;
      this.right = ebb.right - cbb.left;
      this.bottom = ebb.bottom - cbb.top;

      this._transform();

      //this._size = { left: this.left, top: this.top, width: this.width, height: this.height};
      return this;
    },
  });

  var fastNoSideEffects = createCommonjsModule(function (module, exports) {
    var hasCanvas = function () {
      var canvas = document.createElement('canvas');
      return canvas && !!canvas.getContext;
    };

    if (hasCanvas()) {
      exports.Surface = surface;
      exports.Path = path;
      exports.Shape = shape;
      exports.Group = group;
      exports.ClippingRectangle = clippingrectangle;
      exports.Text = text;
    } else {
      exports.Surface = surface$2;
      exports.Path = path$4;
      exports.Shape = shape$2;
      exports.Group = group$2;
      exports.ClippingRectangle = clippingrectangle$2;
      exports.Text = text$2;

      var DOM$$1 = dom;
      if (typeof document !== 'undefined') DOM$$1.init(document);
    }
  });

  var _extends =
    _assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    }
    return call && (typeof call === 'object' || typeof call === 'function')
      ? call
      : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError(
        'Super expression must either be null or a function, not ' +
          typeof superClass
      );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
    if (superClass)
      Object.setPrototypeOf
        ? Object.setPrototypeOf(subClass, superClass)
        : (subClass.__proto__ = superClass);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  current.setCurrent(
    // Change to 'art/modes/dom' for easier debugging via SVG
    fastNoSideEffects
  );

  var pooledTransform = new transform();

  var EVENT_TYPES = {
    onClick: 'click',
    onMouseMove: 'mousemove',
    onMouseOver: 'mouseover',
    onMouseOut: 'mouseout',
    onMouseUp: 'mouseup',
    onMouseDown: 'mousedown',
  };

  var TYPES = {
    CLIPPING_RECTANGLE: 'ClippingRectangle',
    GROUP: 'Group',
    SHAPE: 'Shape',
    TEXT: 'Text',
  };

  var UPDATE_SIGNAL = {};

  /** Helper Methods */

  function addEventListeners(instance, type, listener) {
    // We need to explicitly unregister before unmount.
    // For this reason we need to track subscriptions.
    if (!instance._listeners) {
      instance._listeners = {};
      instance._subscriptions = {};
    }

    instance._listeners[type] = listener;

    if (listener) {
      if (!instance._subscriptions[type]) {
        instance._subscriptions[type] = instance.subscribe(
          type,
          createEventHandler(instance),
          instance
        );
      }
    } else {
      if (instance._subscriptions[type]) {
        instance._subscriptions[type]();
        delete instance._subscriptions[type];
      }
    }
  }

  function childrenAsString(children) {
    if (!children) {
      return '';
    } else if (typeof children === 'string') {
      return children;
    } else if (children.length) {
      return children.join('');
    } else {
      return '';
    }
  }

  function createEventHandler(instance) {
    return function handleEvent(event) {
      var listener = instance._listeners[event.type];

      if (!listener) {
        // Noop
      } else if (typeof listener === 'function') {
        listener.call(instance, event);
      } else if (listener.handleEvent) {
        listener.handleEvent(event);
      }
    };
  }

  function destroyEventListeners(instance) {
    if (instance._subscriptions) {
      for (var type in instance._subscriptions) {
        instance._subscriptions[type]();
      }
    }

    instance._subscriptions = null;
    instance._listeners = null;
  }

  function getScaleX(props) {
    if (props.scaleX != null) {
      return props.scaleX;
    } else if (props.scale != null) {
      return props.scale;
    } else {
      return 1;
    }
  }

  function getScaleY(props) {
    if (props.scaleY != null) {
      return props.scaleY;
    } else if (props.scale != null) {
      return props.scale;
    } else {
      return 1;
    }
  }

  function isSameFont(oldFont, newFont) {
    if (oldFont === newFont) {
      return true;
    } else if (typeof newFont === 'string' || typeof oldFont === 'string') {
      return false;
    } else {
      return (
        newFont.fontSize === oldFont.fontSize &&
        newFont.fontStyle === oldFont.fontStyle &&
        newFont.fontVariant === oldFont.fontVariant &&
        newFont.fontWeight === oldFont.fontWeight &&
        newFont.fontFamily === oldFont.fontFamily
      );
    }
  }

  /** Render Methods */

  function applyClippingRectangleProps(instance, props) {
    var prevProps =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    applyNodeProps(instance, props, prevProps);

    instance.width = props.width;
    instance.height = props.height;
  }

  function applyGroupProps(instance, props) {
    var prevProps =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    applyNodeProps(instance, props, prevProps);

    instance.width = props.width;
    instance.height = props.height;
  }

  function applyNodeProps(instance, props) {
    var prevProps =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var scaleX = getScaleX(props);
    var scaleY = getScaleY(props);

    pooledTransform
      .transformTo(1, 0, 0, 1, 0, 0)
      .move(props.x || 0, props.y || 0)
      .rotate(props.rotation || 0, props.originX, props.originY)
      .scale(scaleX, scaleY, props.originX, props.originY);

    if (props.transform != null) {
      pooledTransform.transform(props.transform);
    }

    if (
      instance.xx !== pooledTransform.xx ||
      instance.yx !== pooledTransform.yx ||
      instance.xy !== pooledTransform.xy ||
      instance.yy !== pooledTransform.yy ||
      instance.x !== pooledTransform.x ||
      instance.y !== pooledTransform.y
    ) {
      instance.transformTo(pooledTransform);
    }

    if (props.cursor !== prevProps.cursor || props.title !== prevProps.title) {
      instance.indicate(props.cursor, props.title);
    }

    if (instance.blend && props.opacity !== prevProps.opacity) {
      instance.blend(props.opacity == null ? 1 : props.opacity);
    }

    if (props.visible !== prevProps.visible) {
      if (props.visible == null || props.visible) {
        instance.show();
      } else {
        instance.hide();
      }
    }

    for (var type in EVENT_TYPES) {
      addEventListeners(instance, EVENT_TYPES[type], props[type]);
    }
  }

  function applyRenderableNodeProps(instance, props) {
    var prevProps =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    applyNodeProps(instance, props, prevProps);

    if (prevProps.fill !== props.fill) {
      if (props.fill && props.fill.applyFill) {
        props.fill.applyFill(instance);
      } else {
        instance.fill(props.fill);
      }
    }
    if (
      prevProps.stroke !== props.stroke ||
      prevProps.strokeWidth !== props.strokeWidth ||
      prevProps.strokeCap !== props.strokeCap ||
      prevProps.strokeJoin !== props.strokeJoin ||
      // TODO: Consider deep check of stokeDash; may benefit VML in IE.
      prevProps.strokeDash !== props.strokeDash
    ) {
      instance.stroke(
        props.stroke,
        props.strokeWidth,
        props.strokeCap,
        props.strokeJoin,
        props.strokeDash
      );
    }
  }

  function applyShapeProps(instance, props) {
    var prevProps =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    applyRenderableNodeProps(instance, props, prevProps);

    var path = props.d || childrenAsString(props.children);

    var prevDelta = instance._prevDelta;
    var prevPath = instance._prevPath;

    if (
      path !== prevPath ||
      path.delta !== prevDelta ||
      prevProps.height !== props.height ||
      prevProps.width !== props.width
    ) {
      instance.draw(path, props.width, props.height);

      instance._prevDelta = path.delta;
      instance._prevPath = path;
    }
  }

  function applyTextProps(instance, props) {
    var prevProps =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    applyRenderableNodeProps(instance, props, prevProps);

    var string = props.children;

    if (
      instance._currentString !== string ||
      !isSameFont(props.font, prevProps.font) ||
      props.alignment !== prevProps.alignment ||
      props.path !== prevProps.path
    ) {
      instance.draw(string, props.font, props.alignment, props.path);

      instance._currentString = string;
    }
  }

  /** Declarative fill-type objects; API design not finalized */

  var slice = Array.prototype.slice;

  var LinearGradient = (function () {
    function LinearGradient(stops, x1, y1, x2, y2) {
      _classCallCheck(this, LinearGradient);

      this._args = slice.call(arguments);
    }

    LinearGradient.prototype.applyFill = function applyFill(node) {
      node.fillLinear.apply(node, this._args);
    };

    return LinearGradient;
  })();

  var RadialGradient = (function () {
    function RadialGradient(stops, fx, fy, rx, ry, cx, cy) {
      _classCallCheck(this, RadialGradient);

      this._args = slice.call(arguments);
    }

    RadialGradient.prototype.applyFill = function applyFill(node) {
      node.fillRadial.apply(node, this._args);
    };

    return RadialGradient;
  })();

  var Pattern = (function () {
    function Pattern(url, width, height, left, top) {
      _classCallCheck(this, Pattern);

      this._args = slice.call(arguments);
    }

    Pattern.prototype.applyFill = function applyFill(node) {
      node.fillImage.apply(node, this._args);
    };

    return Pattern;
  })();

  /** React Components */

  var Surface = (function (_React$Component) {
    _inherits(Surface, _React$Component);

    function Surface() {
      _classCallCheck(this, Surface);

      return _possibleConstructorReturn(
        this,
        _React$Component.apply(this, arguments)
      );
    }

    Surface.prototype.componentDidMount = function componentDidMount() {
      var _props = this.props,
        height = _props.height,
        width = _props.width;

      this._surface = current.Surface(+width, +height, this._tagRef);

      this._mountNode = ARTRenderer.createContainer(this._surface);
      ARTRenderer.updateContainer(this.props.children, this._mountNode, this);
    };

    Surface.prototype.componentDidUpdate = function componentDidUpdate(
      prevProps,
      prevState
    ) {
      var props = this.props;

      if (
        props.height !== prevProps.height ||
        props.width !== prevProps.width
      ) {
        this._surface.resize(+props.width, +props.height);
      }

      ARTRenderer.updateContainer(this.props.children, this._mountNode, this);

      if (this._surface.render) {
        this._surface.render();
      }
    };

    Surface.prototype.componentWillUnmount = function componentWillUnmount() {
      ARTRenderer.updateContainer(null, this._mountNode, this);
    };

    Surface.prototype.render = function render() {
      var _this2 = this;

      // This is going to be a placeholder because we don't know what it will
      // actually resolve to because ART may render canvas, vml or svg tags here.
      // We only allow a subset of properties since others might conflict with
      // ART's properties.
      var props = this.props;

      // TODO: ART's Canvas Mode overrides surface title and cursor
      var Tag = current.Surface.tagName;

      return React.createElement(Tag, {
        ref: function (ref) {
          return (_this2._tagRef = ref);
        },
        accessKey: props.accessKey,
        className: props.className,
        draggable: props.draggable,
        role: props.role,
        style: props.style,
        tabIndex: props.tabIndex,
        title: props.title,
      });
    };

    return Surface;
  })(React.Component);

  var Text = (function (_React$Component2) {
    _inherits(Text, _React$Component2);

    function Text(props) {
      _classCallCheck(this, Text);

      // We allow reading these props. Ideally we could expose the Text node as
      // ref directly.
      var _this3 = _possibleConstructorReturn(
        this,
        _React$Component2.call(this, props)
      );

      ['height', 'width', 'x', 'y'].forEach(function (key) {
        Object.defineProperty(_this3, key, {
          get: function () {
            return this._text ? this._text[key] : undefined;
          },
        });
      });
      return _this3;
    }

    Text.prototype.render = function render() {
      var _this4 = this;

      // This means you can't have children that render into strings...
      var T = TYPES.TEXT;
      return React.createElement(
        T,
        _extends({}, this.props, {
          ref: function (t) {
            return (_this4._text = t);
          },
        }),
        childrenAsString(this.props.children)
      );
    };

    return Text;
  })(React.Component);

  /** ART Renderer */

  var ARTRenderer = reactReconciler({
    appendInitialChild: function (parentInstance, child) {
      if (typeof child === 'string') {
        // Noop for string children of Text (eg <Text>{'foo'}{'bar'}</Text>)
        invariant_1$1(false, 'Text children should already be flattened.');
        return;
      }

      child.inject(parentInstance);
    },
    createInstance: function (type, props, internalInstanceHandle) {
      var instance = void 0;

      switch (type) {
        case TYPES.CLIPPING_RECTANGLE:
          instance = current.ClippingRectangle();
          instance._applyProps = applyClippingRectangleProps;
          break;
        case TYPES.GROUP:
          instance = current.Group();
          instance._applyProps = applyGroupProps;
          break;
        case TYPES.SHAPE:
          instance = current.Shape();
          instance._applyProps = applyShapeProps;
          break;
        case TYPES.TEXT:
          instance = current.Text(
            props.children,
            props.font,
            props.alignment,
            props.path
          );
          instance._applyProps = applyTextProps;
          break;
      }

      !instance
        ? invariant_1$1(false, 'ReactART does not support the type "%s"', type)
        : void 0;

      instance._applyProps(instance, props);

      return instance;
    },
    createTextInstance: function (
      text,
      rootContainerInstance,
      internalInstanceHandle
    ) {
      return text;
    },
    finalizeInitialChildren: function (domElement, type, props) {
      return false;
    },
    getPublicInstance: function (instance) {
      return instance;
    },
    prepareForCommit: function () {
      // Noop
    },
    prepareUpdate: function (domElement, type, oldProps, newProps) {
      return UPDATE_SIGNAL;
    },
    resetAfterCommit: function () {
      // Noop
    },
    resetTextContent: function (domElement) {
      // Noop
    },
    shouldDeprioritizeSubtree: function (type, props) {
      return false;
    },
    getRootHostContext: function () {
      return emptyObject_1;
    },
    getChildHostContext: function () {
      return emptyObject_1;
    },

    scheduleDeferredCallback: rIC,

    shouldSetTextContent: function (type, props) {
      return (
        typeof props.children === 'string' || typeof props.children === 'number'
      );
    },

    now: now,

    useSyncScheduling: true,

    mutation: {
      appendChild: function (parentInstance, child) {
        if (child.parentNode === parentInstance) {
          child.eject();
        }
        child.inject(parentInstance);
      },
      appendChildToContainer: function (parentInstance, child) {
        if (child.parentNode === parentInstance) {
          child.eject();
        }
        child.inject(parentInstance);
      },
      insertBefore: function (parentInstance, child, beforeChild) {
        !(child !== beforeChild)
          ? invariant_1$1(false, 'ReactART: Can not insert node before itself')
          : void 0;
        child.injectBefore(beforeChild);
      },
      insertInContainerBefore: function (parentInstance, child, beforeChild) {
        !(child !== beforeChild)
          ? invariant_1$1(false, 'ReactART: Can not insert node before itself')
          : void 0;
        child.injectBefore(beforeChild);
      },
      removeChild: function (parentInstance, child) {
        destroyEventListeners(child);
        child.eject();
      },
      removeChildFromContainer: function (parentInstance, child) {
        destroyEventListeners(child);
        child.eject();
      },
      commitTextUpdate: function (textInstance, oldText, newText) {
        // Noop
      },
      commitMount: function (instance, type, newProps) {
        // Noop
      },
      commitUpdate: function (
        instance,
        updatePayload,
        type,
        oldProps,
        newProps
      ) {
        instance._applyProps(instance, newProps, oldProps);
      },
    },
  });

  /** API */

  var ClippingRectangle = TYPES.CLIPPING_RECTANGLE;
  var Group = TYPES.GROUP;
  var Shape = TYPES.SHAPE;
  var Path = current.Path;

  var ReactART = Object.freeze({
    ClippingRectangle: ClippingRectangle,
    Group: Group,
    Shape: Shape,
    Path: Path,
    LinearGradient: LinearGradient,
    Pattern: Pattern,
    RadialGradient: RadialGradient,
    Surface: Surface,
    Text: Text,
    Transform: transform,
  });

  var reactArt = ReactART;

  return reactArt;
});
