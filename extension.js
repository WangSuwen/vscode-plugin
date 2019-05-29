// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-plugin" is now active!');
	const config = vscode.workspace.getConfiguration('vscodePluginDemo');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let snippets1 = vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World!');
	});
	let snippets2 = vscode.commands.registerCommand('extension.niHao', function () {
		const panel = vscode.window.createWebviewPanel(
			'testWebview', // viewType
			"WebView演示", // 视图标题
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
					<img src="${getExtensionFileVscodeResource(context, '/Users/wxq/learning/vscode-plugin/imgs/12.jpg')}"/>
				</body>
			</html>
		`;
	});

	context.subscriptions.push(snippets1, snippets2);
}
/**
 * 将 相对路径转换为 磁盘绝对路径
 * @param {*} context vscode 上下文
 * @param {*} relativePath 
 */
function getExtensionFileVscodeResource (context, relativePath) {
	console.log('---', relativePath);
	// const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath)); // 处理相对地址
	const diskPath = vscode.Uri.file(relativePath); // 处理绝对地址
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
