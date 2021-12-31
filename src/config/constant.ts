import { join, dirname } from "path";
import fse from "fs-extra";

function findRootDir(dir: string): string {
  if (dir === "/" || /^\w:(\\|\/)?$/.test(dir)) {
    return CWD;
  }

  if (fse.existsSync(join(dir, "tsl.config.json"))) {
    return dir;
  } else if (fse.existsSync(join(dir, "tsl.config.js"))) {
    return dir;
  }

  return findRootDir(dirname(dir));
}

export const CWD = process.cwd();
export const ROOT = findRootDir(CWD);
// cli相对路径
export const TSL_DIR = join(__dirname, "..", "..");
export const CACHE_DIR = join(TSL_DIR, "cache");

// config文件路径
export const TSL_CONFIG_FILE = "tsl.config.json";
export const DYN_VUE_PRESET_FILE = join(CACHE_DIR, "preset-vue.json");
export const VUE_PRESET_FILE = join(TSL_DIR, "preset-vue.json");
export const TSL_CLI_CONFIG_FILE = join(CACHE_DIR, "tsl-cli-config.json");
