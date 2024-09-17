#!/usr/bin/env node
(async () => {
  const chalk = await import('chalk');
  console.log(chalk.default.green('Hello World!'));
})();
// import chalk from 'chalk'; // 使用 ES Module 导入
// import shell from 'shelljs'; // 0.8.5
let shell = require('shelljs'); // 0.8.5

const { exec, echo, exit, cd, which } = shell;

const name = process.argv[2] || 'Auto-commit';

cd('../');

if (!which('git')) {
  echo(chalk.bold.red('请检查本机git命令'));
  exit(1);
}

if (exec('git pull').code !== 0) {
  echo(chalk.bold.red('Error: Git pull failed'));
  exit(1);
}
if (exec('git add .').code !== 0) {
  echo(chalk.bold.red('Error: Git add failed'));
  exit(1);
}

if (exec('git status').code !== 0) {
  echo(chalk.bold.red('Error: Git status failed'));
  exit(1);
}
if (exec(`git commit -am "${name}"`).code !== 0) {
  echo(chalk.bold.red('Error: Git commit failed'));
  exit(1);
}
if (exec('git push').code !== 0) {
  echo(chalk.bold.red('Error: Git push failed'));
  exit(1);
}
echo(chalk.bold.blue(`git success ${name}`));
