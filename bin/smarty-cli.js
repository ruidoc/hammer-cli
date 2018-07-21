#!/usr/bin/env node

const clone = require('git-clone')
const program = require('commander')
const shell = require('shelljs');
const chalk = require('chalk')
const ora = require('ora')

const log = console.log

program
    .version('0.1.0','-v --version')
    .description(chalk.yellow('欢迎使用 smarty 脚手架工具！'))

program
    .command('init <project>')
    .description(chalk.blue('初始化一个smarty模板'))
    .action((project)=> {
        let pwd = shell.pwd()
        console.log('\n')
        let spinner = ora(`下载模板到：${pwd}/${project}/\n`)
        spinner.start()
        clone(`https://github.com/ruidoc/smarty`, `${pwd}/${project}`, null, ()=> {
            spinner.stop()
            shell.rm('-rf', `${pwd}/${project}/.git`)
            log(chalk.green(`下载完成！\n`))
            log('To get started:\n')
            log(chalk.yellow(`  $ cd ${project}`))
            log(chalk.yellow(`  $ npm install`))
            log(chalk.yellow(`  $ npm run dev\n`))
        })
    })

program.parse(process.argv)
