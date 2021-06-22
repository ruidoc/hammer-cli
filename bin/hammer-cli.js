#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const shell = require('shelljs')
const program = require('commander')
const ora = require('ora')

const Generator = require('../lib/generater')
const log = console.log

function resolve(dir) {
    return path.join(shell.pwd().toString(), dir)
}

program
  .version(`${require('../package').version}`,'-v --version')
    .description(chalk.yellow('welcome to use hammer！'))

program.command('gene <file>')
    .description('create a new project')
    .action(file => { 
        var json = require(resolve(file))
        let res = new Generator(json, {
            output: path.dirname(resolve(file))
        })
        if (res) {
            log(chalk.green('vue 组件创建成功！'))
        }
    })
  
// 解析参数并触发commands
program.parse(process.argv);