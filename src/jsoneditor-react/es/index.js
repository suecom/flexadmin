import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist';
import 'jsoneditor/dist/jsoneditor.css';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      // eslint-disable-next-line
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      // eslint-disable-next-line
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  // eslint-disable-next-line
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  // eslint-disable-next-line
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

/**
 * @typedef {{
 * tree: string,
 * view: string,
 * form: string,
 * code: string,
 * text: string,
 * allValues: Array<string>
 * }} TJsonEditorModes
 */

var modes = {
  tree: 'tree',
  view: 'view',
  form: 'form',
  code: 'code',
  text: 'text'
};
var values = Object.values(modes);
modes.allValues = values;
/**
 * @type {object}
 * @property {object} [value]
 * @property {string} [mode='tree'] - Set the editor mode.
 * @property {string} [name=undefined] - Initial field name for the root node
 * @property {object} [schema] - Validate the JSON object against a JSON schema.
 * @property {object} [schemaRefs] - Schemas that are referenced using
 * the $ref property
 * @property {Function} [onChange] - Set a callback function
 * triggered when the contents of the JSONEditor change.
 * Called without parameters. Will only be triggered on changes made by the user.
 * Return new json.
 * @property {Function} [onError] - Set a callback function triggered when an error occurs.
 * Invoked with the error as first argument.
 * The callback is only invoked for errors triggered by a users action,
 * like switching from code mode to tree mode or clicking
 * the Format button whilst the editor doesn't contain valid JSON.
 * @property {Function} [onModeChange] - Set a callback function
 * triggered right after the mode is changed by the user.
 * @property {object} [ace] - Provide a version of the Ace editor.
 * Only applicable when mode is code
 * @property {object} [ajv] - Provide a instance of ajv,
 * the library used for JSON schema validation.
 * @property {string} [theme] - Set the Ace editor theme,
 * uses included 'ace/theme/jsoneditor' by default.
 * @property {boolean} [history=false] - Enables history,
 * adds a button Undo and Redo to the menu of the JSONEditor. Only applicable when
 * mode is 'tree' or 'form'
 * @property {boolean} [navigationBar=true] - Adds navigation bar to the menu
 * the navigation bar visualize the current position on the
 * tree structure as well as allows breadcrumbs navigation.
 * @property {boolean} [statusBar=true] - Adds status bar to the buttom of the editor
 * the status bar shows the cursor position and a count of the selected characters.
 * Only applicable when mode is 'code' or 'text'.
 * @property {boolean} [search=true] - Enables a search box in
 * the upper right corner of the JSONEditor.
 * @property {Array<string>} [allowedModes] - Create a box in the editor menu where
 * the user can switch between the specified modes.
 * @property {(string|PropTypes.elementType)} [tag='div'] - Html element, or react element to render
 * @property {object} [htmlElementProps] - html element custom props
 * @property {Function} [innerRef] - callback to get html element reference
 */

var Editor =
/*#__PURE__*/
function (_Component) {
  _inherits(Editor, _Component);

  function Editor(props) {
    var _this;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this, props));
    _this.htmlElementRef = null;
    _this.jsonEditor = null;
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.setRef = _this.setRef.bind(_assertThisInitialized(_this));
    _this.collapseAll = _this.collapseAll.bind(_assertThisInitialized(_this));
    _this.expandAll = _this.expandAll.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Editor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // eslint-disable-next-line
      var _this$props = this.props,
          allowedModes = _this$props.allowedModes,
          // eslint-disable-next-line
          innerRef = _this$props.innerRef,
          // eslint-disable-next-line
          htmlElementProps = _this$props.htmlElementProps,
          // eslint-disable-next-line
          tag = _this$props.tag,
          // eslint-disable-next-line
          onChange = _this$props.onChange,
          rest = _objectWithoutProperties(_this$props, ["allowedModes", "innerRef", "htmlElementProps", "tag", "onChange"]);

      this.createEditor(_objectSpread2({}, rest, {
        modes: allowedModes
      }));
    } // eslint-disable-next-line react/sort-comp

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref) {
      var allowedModes = _ref.allowedModes,
          schema = _ref.schema,
          name = _ref.name,
          theme = _ref.theme,
          schemaRefs = _ref.schemaRefs,
          // eslint-disable-next-line
          innerRef = _ref.innerRef,
          // eslint-disable-next-line
          htmlElementProps = _ref.htmlElementProps,
          // eslint-disable-next-line
          tag = _ref.tag,
          // eslint-disable-next-line
          onChange = _ref.onChange,
          rest = _objectWithoutProperties(_ref, ["allowedModes", "schema", "name", "theme", "schemaRefs", "innerRef", "htmlElementProps", "tag", "onChange"]);

      if (this.jsonEditor) {
        if (theme !== this.props.theme) {
          this.createEditor(_objectSpread2({}, rest, {
            theme: theme,
            modes: allowedModes
          }));
        } else {
          if (schema !== this.props.schema || schemaRefs !== this.props.schemaRefs) {
            this.jsonEditor.setSchema(schema, schemaRefs);
          }

          if (name !== this.jsonEditor.getName()) {
            this.jsonEditor.setName(name);
          }
        }
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(_ref2) {
      var htmlElementProps = _ref2.htmlElementProps;
      return htmlElementProps !== this.props.htmlElementProps;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.jsonEditor) {
        this.jsonEditor.destroy();
        this.jsonEditor = null;
      }
    }
  }, {
    key: "setRef",
    value: function setRef(element) {
      this.htmlElementRef = element;

      if (this.props.innerRef) {
        this.props.innerRef(element);
      }
    }
  }, {
    key: "createEditor",
    value: function createEditor(_ref3) {
      var value = _ref3.value,
          rest = _objectWithoutProperties(_ref3, ["value"]);

      if (this.jsonEditor) {
        this.jsonEditor.destroy();
      }

      this.jsonEditor = new JSONEditor(this.htmlElementRef, _objectSpread2({
        onChange: this.handleChange
      }, rest));
      this.jsonEditor.set(value);
    }
  }, {
    key: "handleChange",
    value: function handleChange() {
      if (this.props.onChange) {
        try {
          var text = this.jsonEditor.getText();

          if (text === '') {
            this.props.onChange(null);
          }

          var currentJson = this.jsonEditor.get();

          if (this.props.value !== currentJson) {
            this.props.onChange(currentJson);
          }
        } catch (err) {
          this.err = err;
        }
      }
    }
  }, {
    key: "collapseAll",
    value: function collapseAll() {
      if (this.jsonEditor) {
        this.jsonEditor.collapseAll();
      }
    }
  }, {
    key: "expandAll",
    value: function expandAll() {
      if (this.jsonEditor) {
        this.jsonEditor.expandAll();
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this.jsonEditor) {
        this.jsonEditor.focus();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          htmlElementProps = _this$props2.htmlElementProps,
          tag = _this$props2.tag;
      return React.createElement(tag, _objectSpread2({}, htmlElementProps, {
        ref: this.setRef
      }));
    }
  }]);

  return Editor;
}(Component);
Editor.propTypes = {
  //  jsoneditor props
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  mode: PropTypes.oneOf(values),
  name: PropTypes.string,
  schema: PropTypes.object,
  schemaRefs: PropTypes.object,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  onModeChange: PropTypes.func,
  onEditable: PropTypes.func,
  ace: PropTypes.object,
  ajv: PropTypes.object,
  theme: PropTypes.string,
  history: PropTypes.bool,
  navigationBar: PropTypes.bool,
  statusBar: PropTypes.bool,
  search: PropTypes.bool,
  allowedModes: PropTypes.arrayOf(PropTypes.oneOf(values)),
  //  custom props
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  htmlElementProps: PropTypes.object,
  innerRef: PropTypes.func
};
Editor.defaultProps = {
  tag: 'div',
  mode: modes.tree,
  history: false,
  search: true,
  navigationBar: true,
  statusBar: true
};
/**
 * @type TJsonEditorModes
 */

Editor.modes = modes;

export { Editor as JsonEditor };
//# sourceMappingURL=index.js.map
