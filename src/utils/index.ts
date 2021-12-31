import inquirer from "inquirer";
import logSymbols from "log-symbols";
import chalk from "chalk";
import execa from "execa";
import shell from "shelljs";
import fse, {
  existsSync,
  readFileSync,
  outputFileSync,
  removeSync,
} from "fs-extra";
import { join } from "path";
import { ROOT } from "../config/constant";

export async function getInquirer(inquirerList) {
  let answers;
  try {
    answers = await inquirer.prompt(inquirerList);
  } catch (error) {
    if (error.isTtyError) {
      console.log(
        logSymbols.error,
        chalk.red("Prompt couldn't be rendered in the current environment .")
      );
    } else {
      console.log(logSymbols.error, chalk.red(error));
    }
    answers = {};
  }

  return answers;
}

// 写入文件
export function smartOutputFile(filePath: string, content: string) {
  if (existsSync(filePath)) {
    const previousContent = readFileSync(filePath, "utf-8");
    if (previousContent === content) {
      return;
    }
  }
  outputFileSync(filePath, content);
}

export function readFileToJson(filePath: string) {
  let json;
  try {
    let file = fse.readFileSync(filePath);
    json = JSON.parse(file.toString());
  } catch (e) {
    json = {};
  }

  return json;
}

export function execCommand(cmd: string, dirPath: string, isAsync?: boolean) {
  const method = isAsync ? "command" : "commandSync";
  return execa[method](cmd, {
    preferLocal: true,
    cwd: dirPath,
    localDir: dirPath,
    execPath: dirPath,
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr,
  });
}

/**
 * url校验
 * @param {String} url
 * @returns {Boolean}
 */
export function isUrl(url: string): boolean {
  const reg =
    /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/;
  return reg.test(url);
}

/**
 * 检查指定的目录是否存在
 * @param targetPath
 */
export function isExist(targetPath: string): boolean {
  return fse.pathExistsSync(targetPath);
}

/**
 * 同步删除文件(递归删除)
 */
export function removeFolderSync(dir) {
  removeSync(dir);
}

let installedYarn: boolean;
/**
 * 检查本地是否安装yarn
 */
export function hasYarn() {
  if (installedYarn === undefined) {
    try {
      execa.sync("yarn", ["--version"], { stdio: "ignore" });
      installedYarn = true;
    } catch (e) {
      installedYarn = false;
    }
  }
  return installedYarn;
}

let installedGit: boolean;
/**
 * 检查本地是否安装git
 */
export function hasGit() {
  if (installedGit === undefined) {
    try {
      execa.sync("git", ["--version"], { stdio: "ignore" });
      installedGit = true;
    } catch (e) {
      installedGit = false;
    }
  }
  return installedGit;
}

/**
 * 安装依赖
 * @param dirPath 执行命令的文件路径
 */
export function installDepends(dirPath: string) {
  if (!existsSync(join(dirPath, ".git"))) {
    shell.exec(`cd ${dirPath} && git init`);
  }

  if (!existsSync(join(dirPath, "node_modules"))) {
    if (hasYarn()) {
      execCommand("yarn install", dirPath);
      // execa.commandSync("yarn install", option);
    } else {
      // execa.commandSync("npm install", option);
      execCommand("npm install", dirPath);
    }
  }
}

/**
 * 检测指定的依赖包是否已经安装
 * @param packageName
 */
export function existDepends(packageName: string, dir: string = ROOT) {
  try {
    require(join(dir, "node_modules", packageName));
    return true;
    //return isExist(join(dir, "node_modules", packageName));
  } catch (e) {
    return false;
  }
}
