import { program } from "commander";

program
  .name("init")
  .command("init <name>")
  .description("创建一个初始化项目 or 初始化项目规范")
  .action(require("./init").default);

program.parse(process.argv);
