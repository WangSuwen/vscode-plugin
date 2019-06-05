// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Utils = require('./utils');

let interval_time = 5000; // 定时任务时间间隔

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "vscode-plugin" is now active!');
	/**
	 * 获取用户  自定义配置
	 * config: {
	 * 		imgsPath: 用户配置的图片地址们；
	 * 		intervalTime: 定时任务 时长
	 * 		yourName: 用户自定义姓名
	 * 		customTips01: 用户自定义问候语
	 * }
	 * TODO: 注释：配置项的前缀 forYourHealth 必须与package.json 中 contributes.configuration.properties 中的各配置项相对应。
	 */
	let config = vscode.workspace.getConfiguration('forYourHealth');
	interval_time = Number(config.intervalTime) <= 5 ? 5 * 1000 : config.intervalTime * 1000;
	let snippets1 = vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World!');
	});
	// 手动输入指令
	let snippets2 = vscode.commands.registerCommand('extension.niHao', function () {
		Utils.initPanel(config, context);
	});
	// 定时任务
	let ti = Utils.imgChangeInterval(config, context, interval_time);
	// 监听 用户配置项的变动
	vscode.workspace.onDidChangeConfiguration(() => {
		config = vscode.workspace.getConfiguration('forYourHealth');
		interval_time = Number(config.intervalTime) <= 5 ? 5 * 1000 : config.intervalTime * 1000;
		clearInterval(ti);
		ti = Utils.imgChangeInterval(config, context, interval_time);
	});
	context.subscriptions.push(snippets1, snippets2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
};
