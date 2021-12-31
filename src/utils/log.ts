import logSymbols from "log-symbols";
import chalk from "chalk";
import ora from "ora";

export function error(text: string) {
  console.log(logSymbols.error, chalk.red(text));
}

export function warn(text: string) {
  console.log(logSymbols.warning, chalk.yellow(text));
}

export function info(text: string) {
  console.log(logSymbols.info, text);
}

let _spinner;
export function spinner(text: string, start = true) {
  if (_spinner) {
    if (start) {
      _spinner.start();
    }
    _spinner.text = text;
    return _spinner;
  }

  _spinner = ora(chalk.cyan(text));
  if (start) {
    _spinner.start();
  }

  return _spinner;
}
