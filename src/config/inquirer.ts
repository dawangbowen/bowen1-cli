import { isUrl } from "../utils";

export const CHOICE = [
  {
    name: "创建空白项目",
    value: "empty-project",
  },
  {
    name: "应用现有模板",
    value: "template-project",
  },
];
export const CHOICE_PROJECT = [
  {
    name: "type",
    type: "list",
    choices: [
      {
        name: "vue项目",
        value: "project",
      },
      {
        name: "库项目",
        value: "library",
      },
      {
        name: "编辑器组件",
        value: "studio",
      },
      {
        name: "UI组件",
        value: "uc",
      },
    ],
    message: "请选择创建的项目类型",
  },
  {
    when: (answers) => answers.type === "project",
    name: "from",
    type: "list",
    choices: CHOICE,
    message: "请选择",
  },
  {
    when: (answers) => answers.type === "project",
    name: "micro",
    type: "confirm",
    message: "是否属于微应用",
    default: false,
  },
  {
    when: (answers) => answers.type === "project" && answers.micro,
    name: "microMain",
    type: "input",
    message: "主应用服务",
    default: "tsl-micro-dev-server",
  },
  {
    when: (answers) => answers.from === "template-project",
    name: "isRemote",
    type: "confirm",
    message: "是否获取远程模板",
    default: true,
  },
];

export const EMPTY_PROJECT = [
  {
    name: "version",
    type: "list",
    choices: [
      {
        name: "vue2",
        value: "2",
      },
      {
        name: "vue3",
        value: "3",
      },
    ],
    message: "请选择vue版本",
  },
  {
    name: "vuex",
    type: "confirm",
    message: "是否使用vuex",
  },
  {
    name: "ts",
    type: "confirm",
    message: "是否使用typeScript",
  },
  {
    name: "pwa",
    type: "confirm",
    message: "是否支持pwa",
  },
];

export const REMOTE_URL = [
  {
    name: "template",
    type: "input",
    message: "请输入远程地址",
    validate: (url: string): unknown => {
      if (isUrl(url)) return true;
      return "请输入url";
    },
  },
  {
    name: "branch",
    type: "input",
    message: "请输入分支",
    default: "master",
  },
];

export const LIKE_LAST = [
  {
    name: "likeLast",
    type: "confirm",
    message: "请确认是否与上次获取模板的地址以及模板分支保持一致",
    default: true,
  },
];
