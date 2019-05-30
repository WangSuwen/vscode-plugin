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
let interval_time = 5000; // 定时任务时间间隔
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
		const panel = vscode.window.createWebviewPanel(
			'testWebview', // viewType
			"(づ￣3￣)づ╭❤～亲，保重身体哦", // 视图标题
			vscode.ViewColumn.One, // 显示在编辑器的哪个部位
			{
				enableScripts: true, // 启用JS，默认禁用
				retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
			}
		);
		readAndWriteUserCostumImgs(context, config.imgsPath);
		const html = fs.readFileSync(path.join(__dirname, './views/index.html'))
			.toString()
			.replace(/\{\{customTips01\}\}/, config.customTips01 || '亲，您已经工作很久了，起来活动一下吧')
			.replace(/\{\{imgPath\}\}/, getRandomImg(context, config.imgsPath));
		panel.webview.html = html;
	});
	// 定时任务
	let ti = imgChangeInterval(config, context);
	// 监听 用户配置项的变动
	vscode.workspace.onDidChangeConfiguration(() => {
		config = vscode.workspace.getConfiguration('forYourHealth');
		interval_time = Number(config.intervalTime) <= 5 ? 5 * 1000 : config.intervalTime * 1000;
		clearInterval(ti);
		ti = imgChangeInterval(config, context);
	});
	context.subscriptions.push(snippets1, snippets2);
}

/**
 * 将用户配置的图片列表写入到本地
 * @param {*} context 
 * @param {Array} userImgs 
 */
function readAndWriteUserCostumImgs (context, userImgs) {
	if (userImgs.length) {
		let img;
		for (let i = 0; i < userImgs.length; i++) {
			try {
				img = fs.readFileSync(userImgs[i]);
			} catch (e) {
				console.error('读文件时报错了：', e);
			}
			try {
				fs.writeFileSync(path.join(context.extensionPath, `./imgs/custom_${i + 1}.jpg`), img);
			} catch (e) {
				console.error('写文件时报错了：', e);
			}
		}
	}
}

/**
 * 获取指定范围的随机整数
 * @param {*} lowerValue 最小
 * @param {*} upperValue 最大
 */
function randomFrom (lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}
/**
 * 随机获取一张图片
 * @param {*} context 
 * @param {Array} userImgs 
 */
function getRandomImg (context, userImgs) {
	let diskPath;
	if (!userImgs.length) {
		diskPath = vscode.Uri.file(path.join(context.extensionPath, './imgs/custom.jpg'));
	} else {
		const len = userImgs.length;
		
		const ind = randomFrom(1, len);
		if (ind > len) {
			diskPath = vscode.Uri.file(path.join(context.extensionPath, `./imgs/custom_${1}.jpg`));
		} else {
			diskPath = vscode.Uri.file(path.join(context.extensionPath, `./imgs/custom_${Math.abs(ind)}.jpg`));
		}
	}
	const dp = diskPath.with({ scheme: 'vscode-resource' }).toString();
	return dp;
}

/**
 * 图片变换 的定时任务
 */
function imgChangeInterval (config, context) {
	return setInterval(() => {
		const panel = vscode.window.createWebviewPanel(
			'testWebview', // viewType
			"(づ￣3￣)づ╭❤～亲，保重身体", // 视图标题
			vscode.ViewColumn.One, // 显示在编辑器的哪个部位
			{
				enableScripts: true, // 启用JS，默认禁用
				retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
			}
		);
		readAndWriteUserCostumImgs(context, config.imgsPath);
		const html = fs.readFileSync(path.join(__dirname, './views/index.html'))
			.toString()
			.replace(/\{\{customTips01\}\}/, config.customTips01 || '亲，您已经工作很久了，起来活动一下吧')
			.replace(/\{\{imgPath\}\}/, getRandomImg(context, config.imgsPath));
		panel.webview.html = html;
	}, interval_time);
}

/**
 * 将 相对路径转换为 磁盘绝对路径
 * @param {*} context vscode 上下文
 * @param {*} imgPath 
 */
function getExtensionFileVscodeResource (context, imgPath) {
	let img;
	if (!imgPath) {
		imgPath = path.join(context.extensionPath, './imgs/custom.jpg');
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
