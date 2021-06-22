
const fs = require('fs')
const path = require('path')

const vueString = require('./vue-string')

module.exports = class Generator {
  constructor(json, {
    output
  } = {}) {

    this.json = json
    this.output = output || '.'

    const required_field = ['name', 'template', 'framwork']

    this.createFile()
  }

  createFile() {
    let { output } = this
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output)
    }
    fs.writeFileSync(
      output + '/Table.vue',
      this.geneVueString()
    )
  }
  
  geneVueString() {
    return vueString(this.json)
  }
}