#!/usr/bin/env node

const clone = require('git-clone')
const program = require('commander')
const shell = require('shelljs');
const log = require('tracer').colorConsole()
const ora = require('ora')

program
    .version('1.0.0')
    .option('-i, init [name]', '初始化smarty项目')

program.parse(process.argv)