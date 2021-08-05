import { n } from './util'

class ReactString {
  constructor(json) {
    this.json = json
    this.generate()
  }

  code_row = [
    `import React, { useState, useEffect } from 'react';`,
    `import { useLocalStore, observer } from 'mobx-react';`,
  ]

  property = {
    name: 'Table.jsx',
    code: [3, 5, 6],
    fun: () => {
      var a = '12'
      console.log(12)
    }
  }

  test(k, v) {
    if (typeof v == 'function') {
      return v.toLocaleString()
    }
    return v
  }

  appBody() {
    var indent = 1
    return [
      `var a = 1;`,
      `var b = 3;`
    ].map(row =>
      `\t` + row
    ).join(``)
  }

  generate() {
    this.code_row.push(
      `\nconst IndexPage = observer(props => {\n${this.appBody()}\n})`,
      `\nexport default IndexPage`
    );
    // this.code_row.push(
    //   `const config = ` + JSON.stringify(this.property, this.test, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, '\'')
    // )
  }

  getCode() {
    return {
      name: 'Table.jsx',
      code: this.code_row.join(`\n`)
    }
  }

}

module.exports = ReactString