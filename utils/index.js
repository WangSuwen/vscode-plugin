const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

const Utils = {
    /**
     * 图片变换 的定时任务
     */
    imgChangeInterval (config, context, interval_time) {
        return setInterval(() => {
            const panel = vscode.window.createWebviewPanel(
                'testWebview', // viewType
                config.tabTitle || '(づ￣3￣)づ╭❤～亲，保重身体哦', // 视图标题
                vscode.ViewColumn.One, // 显示在编辑器的哪个部位
                {
                    enableScripts: true, // 启用JS，默认禁用
                    retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
                }
            );
            this.readAndWriteUserCostumImgs(context, config.imgsPath);
            const html = this.readHtml(context, config);
            panel.webview.html = html;
        }, interval_time);
    },
    /**
     * 随机获取一张图片
     * @param {*} context 
     * @param {Array} userImgs 
     */
    getRandomImg (context, userImgs) {
        let diskPath;
        if (!userImgs.length) {
            diskPath = vscode.Uri.file(path.join(context.extensionPath, './imgs/custom.jpg'));
        } else {
            const len = userImgs.length;
            
            const ind = this.randomFrom(1, len);
            if (ind > len) {
                diskPath = vscode.Uri.file(path.join(context.extensionPath, `./imgs/custom_${1}.jpg`));
            } else {
                diskPath = vscode.Uri.file(path.join(context.extensionPath, `./imgs/custom_${Math.abs(ind)}.jpg`));
            }
        }
        const dp = diskPath.with({ scheme: 'vscode-resource' }).toString();
        return dp;
    },
    /**
     * 获取指定范围的随机整数
     * @param {*} lowerValue 最小
     * @param {*} upperValue 最大
     */
    randomFrom (lowerValue, upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    },
    /**
     * 将用户配置的图片列表写入到本地
     * @param {*} context 
     * @param {Array} userImgs 
     */
    readAndWriteUserCostumImgs (context, userImgs) {
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
    },
    /**
     * 读取 html文件
     * @param {*} context 
     * @param {*} config 
     */
    readHtml (context, config) {
        return fs.readFileSync(path.join(context.extensionPath, './views/index.html'))
                .toString()
                .replace(/\{\{customHiTipsStyle01\}\}/, `style="${this.formatStyle(config.customHiTipsStyle01)}"`)
                .replace(/\{\{customImgStyle01\}\}/, `style="${this.formatStyle(config.customImgStyle01)}"`)
                .replace(/\{\{customTips01\}\}/, config.customTips01 || '亲，您已经工作很久了，起来活动一下吧')
                .replace(/\{\{imgPath\}\}/, this.getRandomImg(context, config.imgsPath));
    },
    /**
     * 格式化 用户自定义的样式表
     * @param {*} customStyle 
     */
    formatStyle (customStyle) {
        let styl = '';
        for (let k in customStyle) {
            if (customStyle.hasOwnProperty(k)) {
                styl += `${k}: ${customStyle[k]};`
            }
        }
        return styl;
    }
};

module.exports = Utils;