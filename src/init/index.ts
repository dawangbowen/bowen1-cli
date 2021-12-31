import {
  getInquirer,
  smartOutputFile,
  execCommand,
  isExist,
  removeFolderSync,
  installDepends,
  existDepends,
} from "../utils";
import { CHOICE_PROJECT, EMPTY_PROJECT } from "../config/inquirer";
import {
  DYN_VUE_PRESET_FILE,
  CWD,
  TSL_CONFIG_FILE,
  CACHE_DIR,
} from "../config/constant";
import {
  genVuePreset,
  genTslConfig,
  getRemoteLibrary,
  getTemplateDirName,
  cloneToLocal,
  getTemplateConfig,
  getTemplate,
  generatorProject,
} from "./helper";
import { join } from "path";
import { error, spinner, info } from "../utils/log";
async function initProject(cmd: string): Promise<void> {
  // 环境检测，是否有安装必要的工具。
  // 创建问答式
  const answers = await getInquirer(CHOICE_PROJECT);
  console.log("answers", answers);
  if (answers.type === "project" && answers.from === "empty-project") {
    await createEmpty(cmd, answers);
  } else {
    await getTemplateProject(
      cmd,
      answers.type,
      answers.micro,
      answers.isRemote
    );
  }
}

async function createEmpty(name: string, answers): Promise<void> {
  const vueConfig = await getInquirer(EMPTY_PROJECT),
    params = {
      ...vueConfig,
      answers,
      name,
    };
  console.log("vueConfig", vueConfig);

  // 生成preset
  smartOutputFile(
    DYN_VUE_PRESET_FILE,
    JSON.stringify(genVuePreset(params), null, 2)
  );
  // 创建项目
  execCommand(`vue create -p ${DYN_VUE_PRESET_FILE} ${name}`, CWD);
  // 新建文件
  smartOutputFile(
    join(CWD, name, TSL_CONFIG_FILE),
    JSON.stringify(genTslConfig(params), null, 2)
  );
}

/**
 * 下载远程模板
 */
async function getTemplateProject(
  name: string,
  type: "project" | "studio" | "uc" | "library",
  micro: boolean,
  isRemote: boolean
) {
  // 检测是否配置了远程仓库地址,如果没有配置template，用户输入
  const config = await getRemoteLibrary();

  const tplDirName = getTemplateDirName(config.template);
  const sp = spinner("Initializing project .");
  // 需要远程获取项目 或者 不需要远程获取项目但文件不存在时，从远程仓库获取
  if (isRemote || !isExist(join(CACHE_DIR, tplDirName))) {
    // 如果有缓存，先删除缓存
    removeFolderSync(join(CACHE_DIR, tplDirName));
    // 克隆远程仓库到本地
    sp.text = "update template .";
    await cloneToLocal(config);
  }
  sp.succeed("template updated .");

  const { template } = await getTemplateConfig(config.template);
  const project = await getTemplate(template, type);
  const exists = isExist(join(CWD, project));
  if (exists) {
    error(`${project} directory already exists .`);
    process.exit(1);
  }
  sp.text = "generate project .";
  await generatorProject(name, template, project, config.template);
  sp.text = "install depends .";
  let initPath = join(CWD, name);
  installDepends(initPath);
  smartOutputFile(
    join(CWD, name, TSL_CONFIG_FILE),
    JSON.stringify(genTslConfig({ micro, type, name }), null, 2)
  );

  // 执行统一插件【只有业务项】
  if (type === "project") {
    if (existDepends("vue-cli-plugin-tsl", join(CWD, name))) {
      execCommand(`vue invoke tsl`, join(CWD, name), true);
    } else {
      execCommand(`vue add tsl`, join(CWD, name), true);
    }
  }

  sp.succeed("finished .");
}

export default initProject;
