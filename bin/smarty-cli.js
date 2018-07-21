#!/usr/bin/env node

const clone = require('git-clone')
const program = require('commander')
const shell = require('shelljs');
const log = require('tracer').colorConsole()
const ora = require('ora')

program
    .version('0.1.0')
    .command('init <project>')
    .description('初始化一个smarty模板')
    .action((project)=> {
        if(!project) {
            log.error('正确命令：smarty init <project>')
        } else {
            let pwd = shell.pwd()
            log.info(`下载模板到：${pwd}/${project}/ ...`)
            clone(`https://github.com/ruidoc/smarty`, `${pwd}/${project}`, null, ()=> {
                shell.rm('-rf', `${pwd}/${project}/.git`)
                log.info('初始化完成!')
            })
        }
    })
program.parse(process.argv)
