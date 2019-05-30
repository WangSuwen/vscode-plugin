// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-plugin" is now active!');
	// 获取用户  自定义配置
	let config = vscode.workspace.getConfiguration('vscodePluginDemo');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let snippets1 = vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World!');
	});
	let snippets2 = vscode.commands.registerCommand('extension.niHao', function () {
		const panel = vscode.window.createWebviewPanel(
			'testWebview', // viewType
			"新Tab", // 视图标题
			vscode.ViewColumn.One, // 显示在编辑器的哪个部位
			{
				enableScripts: true, // 启用JS，默认禁用
				retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
			}
		);
		panel.webview.html = `
			<html>
				<body>
					<img src="${getExtensionFileVscodeResource(context, config.imgPath)}"/>
				</body>
			</html>
		`;
	});
	// 定时任务
	let ti = imgChangeInterval(config, context);
	vscode.workspace.onDidChangeConfiguration(() => {
		config = vscode.workspace.getConfiguration('vscodePluginDemo');
		clearInterval(ti);
		ti = imgChangeInterval(config, context);
	});
	context.subscriptions.push(snippets1, snippets2);
}

/**
 * 图片变换 interval
 */
function imgChangeInterval (config, context) {
	return setInterval(() => {
		const panel = vscode.window.createWebviewPanel(
			'testWebview', // viewType
			"新Tab", // 视图标题
			vscode.ViewColumn.One, // 显示在编辑器的哪个部位
			{
				enableScripts: true, // 启用JS，默认禁用
				retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
			}
		);
		panel.webview.html = `
			<html>
				<body>
					<img src="${getExtensionFileVscodeResource(context, config.imgPath)}"/>
				</body>
			</html>
		`;
	}, config.intervalTime * 1000);
}

/**
 * 将 相对路径转换为 磁盘绝对路径
 * @param {*} context vscode 上下文
 * @param {*} imgPath 
 */
function getExtensionFileVscodeResource (context, imgPath) {
	let img;
	if (!imgPath) {
		imgPath = path.join(__dirname, './imgs/custom.jpg');
	}
	try {
		img = fs.readFileSync(imgPath);
	} catch (e) {
		console.error('读文件时报错了：', e);
	}
	try {
		fs.writeFileSync(path.join(context.extensionPath, './imgs/custom.jpg'), img);
		imgPath = path.join(context.extensionPath, './imgs/custom.jpg');
	} catch (e) {
		console.error('写文件时报错了：', e);
	}
	const diskPath = vscode.Uri.file(imgPath); // 处理绝对地址
	const dp = diskPath.with({ scheme: 'vscode-resource' }).toString();
    return dp;
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
