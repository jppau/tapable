/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2021-09-13 17:55:36
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-07-16 17:58:53
 * @FilePath: /tapable-master/lib/SyncHook.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Hook = require("./Hook");
// 编译生成最终生成的执行函数的方法类
const HookCodeFactory = require("./HookCodeFactory");

// 不同类型hook中差异化content方法实现
class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncHookCodeFactory();

const TAP_ASYNC = () => {
	throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE = () => {
	throw new Error("tapPromise is not supported on a SyncHook");
};

// hook.compile在hook.call调用时被调用，接受的参数options结构如下
// options = {
// 所有tap对象组成的数组[{type, fn, name: 'xxx'},...,{type, fn, name: 'xxx'}]
// 	taps: this.taps,  
// 拦截器
// 	interceptors: this.interceptors,   
// 在new hook时传入的参数，是一个数组类型
// 	args: this._args,
// hook的类型
// 	type: type 
// }
const COMPILE = function(options) {
	// 第一个参数this为我们通过new Hook()创建的hook实例对象
	// 初始化 给this._x赋值taps数组内的回调函数组成的数组
	factory.setup(this, options);
	// 创建最终生成的执行函数
	return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE;
	return hook;
}

SyncHook.prototype = null;

module.exports = SyncHook;
