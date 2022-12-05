/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/app.jsx":
/*!************************!*\
  !*** ./client/app.jsx ***!
  \************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const socket = io();\nlet id = undefined;\nconst helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\nlet response = undefined;\nlet data = undefined;\nconst handleEditBox = e => {\n  e.preventDefault();\n  const editBox = document.getElementById('editBox');\n  const lang = document.querySelector('#langs');\n  if (editBox.value) {\n    const data = {\n      msg: editBox.value,\n      lang: lang.value,\n      id: id\n    };\n    socket.emit('chat message', data);\n    editBox.value = '';\n  }\n};\nconst changePass = async e => {\n  e.preventDefault();\n  const pass = document.querySelector('#pass').value;\n  const pass2 = document.querySelector('#pass2').value;\n  const _csrf = data.csrfToken;\n  helper.sendPost('/changePass', {\n    pass,\n    pass2,\n    _csrf\n  });\n  document.querySelector(\"#content\").textContent = \"Password Changed\";\n};\nconst displayMessage = msg => {\n  const messageDiv = document.createElement('div');\n  messageDiv.innerText = msg;\n  document.getElementById('messages').appendChild(messageDiv);\n};\nconst setupRoom = async idImport => {\n  //console.log(id);\n  id = idImport;\n  socket.on(id, displayMessage);\n  console.log('setuproom');\n  console.log(data);\n  ReactDOM.render( /*#__PURE__*/React.createElement(DisconnectWindow, {\n    csrf: data.csrfToken\n  }), document.getElementById('buttons'));\n};\nconst disconnectFromLobby = e => {\n  e.preventDefault();\n  socket.emit('matchmaking', {\n    command: 'remove',\n    id: id\n  });\n  document.getElementById('messages').innerHTML = '';\n  console.log('disconnect');\n  console.log(data);\n  ReactDOM.render( /*#__PURE__*/React.createElement(ReconnectWindow, {\n    csrf: data.csrfToken\n  }), document.getElementById('buttons'));\n};\nconst connectToNewLobby = e => {\n  e.preventDefault();\n  socket.emit('matchmaking', {\n    command: 'reconnect',\n    id: id\n  });\n};\nconst ChangePassWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: \"changePass\",\n    name: \"changePass\",\n    onSubmit: changePass,\n    action: \"/changePass\",\n    method: \"POST\",\n    className: \"changePassForm\"\n  }, /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass\"\n  }, \"New Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"pass\",\n    type: \"text\",\n    name: \"pass\",\n    placeholder: \"password\"\n  }), /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"pass2\"\n  }, \"New Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"pass2\",\n    type: \"text\",\n    name: \"pass2\",\n    placeholder: \"retype password\"\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"formSubmit\",\n    type: \"submit\",\n    value: \"change password\"\n  }));\n};\nconst AdWindow = props => {\n  return /*#__PURE__*/React.createElement(\"img\", {\n    src: \"\"\n  });\n};\nconst ChatWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: \"chatForm\",\n    name: \"chatForm\",\n    onSubmit: handleEditBox,\n    method: \"POST\",\n    className: \"chatForm\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"username\"\n  }, \"Message: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"editBox\",\n    type: \"text\"\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\"\n  }), /*#__PURE__*/React.createElement(\"select\", {\n    id: \"langs\"\n  }, /*#__PURE__*/React.createElement(\"option\", {\n    value: \"en\"\n  }, \"English\"), /*#__PURE__*/React.createElement(\"option\", {\n    value: \"ru\"\n  }, \"Russian\"), /*#__PURE__*/React.createElement(\"option\", {\n    value: \"es\"\n  }, \"Spanish\"), /*#__PURE__*/React.createElement(\"option\", {\n    value: \"fr\"\n  }, \"French\"), /*#__PURE__*/React.createElement(\"option\", {\n    value: \"de\"\n  }, \"German\")));\n};\nconst DisconnectWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: \"disconnectForm\",\n    name: \"disconnectForm\",\n    onSubmit: disconnectFromLobby,\n    method: \"POST\",\n    className: \"disconnectClass\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"formSubmit\",\n    type: \"submit\",\n    value: \"Disconnect\"\n  }));\n};\nconst ReconnectWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: \"reconnectForm\",\n    name: \"reconnectForm\",\n    onSubmit: connectToNewLobby,\n    method: \"POST\",\n    className: \"reconnectClass\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"formSubmit\",\n    type: \"submit\",\n    value: \"Find New Conversation\"\n  }));\n};\nconst init = async () => {\n  response = await fetch('/getToken');\n  data = await response.json();\n  console.log('init');\n  console.log(data);\n  socket.on('chat message', displayMessage);\n  socket.on('matchmaking', setupRoom);\n  const changePass = document.getElementById('changePass');\n  changePass.addEventListener('click', e => {\n    e.preventDefault();\n    ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, {\n      csrf: data.csrfToken\n    }), document.getElementById('content'));\n    return false;\n  });\n  ReactDOM.render( /*#__PURE__*/React.createElement(ChatWindow, {\n    csrf: data.csrfToken\n  }), document.getElementById('content'));\n  ReactDOM.render( /*#__PURE__*/React.createElement(DisconnectWindow, {\n    csrf: data.csrfToken\n  }), document.getElementById('buttons'));\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://logins/./client/app.jsx?");

/***/ }),

/***/ "./client/helper.js":
/*!**************************!*\
  !*** ./client/helper.js ***!
  \**************************/
/***/ ((module) => {

eval("const handleError = message => {\n  document.getElementById('errorMessage').textContent = message;\n};\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nmodule.exports = {\n  handleError,\n  sendPost\n};\n\n//# sourceURL=webpack://logins/./client/helper.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/app.jsx");
/******/ 	
/******/ })()
;