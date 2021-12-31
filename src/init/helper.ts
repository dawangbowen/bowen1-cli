import {
  VUE_PRESET_FILE,
  TSL_CLI_CONFIG_FILE,
  CACHE_DIR,
  CWD,
} from "../config/constant";
import { LIKE_LAST, REMOTE_URL } from "../config/inquirer";
import { readFileToJson, getInquirer, smartOutputFile } from "../utils";
import { TslConfig } from "../types/dev";
import { TslCli, Template } from "../types/init";
import shell from "shelljs";
import { join } from "path";
import { copySync } from "fs-extra";

export function genVuePreset(params) {
  let preset = readFileToJson(VUE_PRESET_FILE);
  preset.vueVersion = params.version;

  if (!params.vuex) {
    delete preset.plugins["@vue/cli-plugin-vuex"];
  }
  if (!params.ts) {
    delete preset.plugins["@vue/cli-plugin-typescript"];
  }
  if (!params.pwa) {
    delete preset.plugins["@vue/cli-plugin-pwa"];
  }

  return preset;
}

export function genTslConfig(params) {
  let config: TslConfig = {
    type: params.type,
  };
  if (params.micro) {
    config.micro = {
      enable: true,
      devServer: {
        port: 9900,
        host: "0.0.0.0",
      },
      register: [
        {
          name: params.name,
          entry: "//localhost:9002",
          container: "#main",
          activeRule: `/${params.name}`,
        },
      ],
      prefix: params.name,
    };
  } else {
    config.micro = {
      enable: false,
    };
  }
  return config;
}

/**
 * 获取模板仓库信息
 */
export async function getRemoteLibrary(): Promise<TslCli> {
  const config = readFileToJson(TSL_CLI_CONFIG_FILE);
  const { template, branch } = config;
  if (template) {
    const ans = await getInquirer(LIKE_LAST);
    if (ans.likeLast) {
      return { template, branch };
    }
  }

  // 本地模板不存在，手动输入
  const answers = await getInquirer(REMOTE_URL);
  // 写入缓存
  const writeJson = JSON.stringify(
    Object.assign(config, {
      template: answers.template,
      branch: answers.branch,
    }),
    null,
    2
  );
  smartOutputFile(TSL_CLI_CONFIG_FILE, writeJson);

  return { template: answers.template, branch: answers.branch };
}

/**
 * 获取项目模板文件名称
 */
export function getTemplateDirName(url: string): string {
  let arr = url.split("/");
  return arr[arr.length - 1].split(".")[0];
}

/**
 * 克隆到本地仓库
 */
export async function cloneToLocal(config: TslCli): Promise<boolean> {
  const { template, branch } = config;
  let command = `cd ${CACHE_DIR} && git clone ${
    branch ? "-b " + branch + " " : ""
  }${template}`;
  const currentDir = CWD.replace(/^(\w:).*/, "$1");
  const cacheDir = CACHE_DIR.replace(/^(\w:).*/, "$1");
  if (currentDir !== cacheDir && /^(\w:).*/.test(cacheDir)) {
    command = `${cacheDir} && ${command}`;
  }
  shell.exec(command);
  return true;
}

/**
 * 获取项目模板配置信息
 */
export async function getTemplateConfig(url: string): Promise<Template> {
  const tplDirName = getTemplateDirName(url);
  const json = await readFileToJson(
    join(CACHE_DIR, tplDirName, "template.config.json")
  );
  return json;
}

/**
 * 获取模板列表
 */
export async function getTemplate(
  template: unknown,
  type: string
): Promise<string> {
  const choices = [];
  Object.keys(template).map((key) => {
    if (
      Array.isArray(template[key].types) &&
      template[key].types.includes(type)
    )
      choices.push(key);
  });
  const CHOISE = [
    {
      name: "template",
      type: "list",
      choices: choices,
      message: "请选择模板",
    },
  ];
  const answers = await getInquirer(CHOISE);
  return answers.template;
}

/**
 * 生成项目
 */
export async function generatorProject(
  name: string,
  template: unknown,
  project: string,
  url: string
): Promise<void> {
  // 生成项目
  const tmpDirName = getTemplateDirName(url);
  const projectDir = join(CWD, name);
  const tplDir = join(CACHE_DIR, tmpDirName, template[project].dir);
  copySync(tplDir, projectDir);
}
