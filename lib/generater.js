const fs = require('fs')
const path = require('path')

const vueString = require('./vue-string')
const ReactString = require('./react-string')
class Generator {

  constructor(json, {
    output
  } = {}) {

    this.json = json
    this.output = output || '.'

    this.checkJson()
  }

  checkJson() {
    let required_field = ['name', 'template', 'framwork']
    for (let key of required_field) {
      if (!this.json[key]) {
        console.error(`error: property ${key} is required`)
        process.exit()
      }
    }
    let { framwork } = this.json
    if (!['vue', 'react'].includes(framwork)) {
      console.error('error: no support framwork ' + framwork)
      process.exit(1)
    }
    this.createFile()
  }

  createFile() {
    let { output } = this
    let generated_data = this.getGeneratedData()
    if (!generated_data) {
      console.error('framwork error')
      process.exit(1)
    }
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output)
    }
    fs.writeFileSync(
      output + `/${generated_data.name}`,
      generated_data.code
    )
  }

  getGeneratedData() {
    let { framwork } = this.json
    switch (framwork) {
      case 'vue':
        return vueString(this.json)
      case 'react':
        return new ReactString(this.json).getCode()
      default:
        return null
    }
  }

}

module.exports = Generator