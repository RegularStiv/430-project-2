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

/***/ "./client/notFound.jsx":
/*!*****************************!*\
  !*** ./client/notFound.jsx ***!
  \*****************************/
/***/ (() => {

eval("//redirect the user ro the default place\nconst goBack = () => {\n  window.location.replace('/');\n};\n\n//render the go back button\nconst ReturnButton = props => {\n  return /*#__PURE__*/React.createElement(\"button\", {\n    id: \"returnButton\"\n  }, \"Go Back\");\n};\n\n//rencer everything onto the screen\nconst init = async () => {\n  ReactDOM.render( /*#__PURE__*/React.createElement(ReturnButton, null), document.getElementById('buttons'));\n  document.getElementById('returnButton').onclick = goBack;\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://logins/./client/notFound.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/notFound.jsx"]();
/******/ 	
/******/ })()
;