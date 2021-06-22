
var getData = json => {
  let actions = json.tableAction
    || ['edit', 'delete']
  let start = `
      loading: false,
      commiting: false,`
  let param_str = (json.filter || []).map(row => {
    let string = `
        ${row.field}: null,`
    if (['select'].includes(row.type)) {
      start += `
      ${row.field}_opts: [],`
    }
    return string
  }).join('').slice(9)
  if (param_str) {
    start += `
      params: {
        ${param_str}
      },`
  }
  if (json.form) {
    let string = `
      form: {`
    string += json.form.map(row => {
      return `
        ${row.field}: null,`
    }).join('')
    string += `
      },`
    start += string
  }
  if (json.template == 'table') {
    var list_str = ``
    var table_colum = (json.tableColums || []).map(colum => {
      let col = `
        {
          title: '${colum.label}',
          dataIndex: '${colum.field}',
          key: '${colum.field}',`
        if (colum.custom) {
          col += `
          scopedSlots: { customRender: '${colum.field}' }`
        }
        col += `
        },`
      list_str += `
          ${colum.field}: '默认',`
      return col
    }).join('')
    var table_action = actions.length != 0 ? `
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },` : ''
    start += `
      tableFields: [
        ${table_colum.slice(9) + table_action}
      ],
      tableLists: [
        {${list_str}
        }
      ],`
    // model 显示框字段
    if ((json.action && json.action.includes('add-modal'))
      || (json.tableAction && json.tableAction.includes('edit-modal'))
    ) {
      start += `
      modal_visible: false,`
    }
  }
  return start.slice(7)
}

var parseSlots = json => {
  let actions = json.tableAction
    || ['edit', 'delete']
  let slot_str = (json.tableColums || []).filter(col=> col.custom).map(colum => {
    if (colum.custom == 'tag') {
      return `
      <span slot="${colum.field}" slot-scope="text,record">
        <a-tag>{{record.${colum.field}}}</a-tag>
      </span>`
    } else {
      return `
      <span slot="${colum.field}" slot-scope="text,record">
        {{record.${colum.field}}}
      </span>`
    }
  }).join('')
  let action_str = actions.map(act => {
    if (act == 'edit') {
      return `
        <a-divider type="vertical" />
        <a @click="toEdit(record)">编辑</a>`
    } else
    if (act == 'edit-modal') {
      return `
        <a-divider type="vertical" />
        <a @click="toEditModal(record)">编辑</a>`
    } else
    if (act == 'look') {
      return `
        <a-divider type="vertical" />
        <a @click="toLook(record)">查看</a>`
    } else 
    if (act == 'delete') {
      return `
        <a-divider type="vertical" />
        <lz-popconfirm :confirm="toDelete(record)">
          <a class="error-color">删除</a>
        </lz-popconfirm>`
    } else {
      return `
        <a-divider type="vertical" />
        <a @click="to${act[0].toUpperCase()+parseFuncName(act.slice(1),'-')}(record)">其他</a>`
    }
  }).join('').slice(38)
  action_str = `
      <span slot="action" slot-scope="_,record">${action_str}
      </span>`
  return slot_str + action_str;
}

var getMethod = json=> {
  let start = `
    init() {
      this.getTableLists()
    },
    async getTableLists() {
      this.loading = true
      let res = await new Promise(resolve=> setTimeout(resolve, 1000))
      this.loading = false
    },`
  let actions = json.tableAction || ['edit', 'delete']
  // 生成筛选项方法
  var param_str = (json.filter || []).map(row => {
    if (!row.event) {
      return ''
    }
    let new_str = parseFuncName(row.field)
    let string = `
    ${new_str}Change(e) {
      this.params.${row.field} = e
    },`
    return string
  }).join('')
  // commit 方法
  if (json.form) {
    param_str += `
    toCommit(e) {
      console.log(this.form)
    },`
  }
  var action_str = actions.map(act => {
    let string = `
    to${act[0].toUpperCase()}${parseFuncName(act.slice(1),'-')}(record) {
      ${act == 'delete' ? `return async ()=> {

      }` : ''}
    },`
    return string
  }).join('')
  return start.slice(5)  + param_str + action_str
}

const filter_dom = json => {
  return `<div class="handle-bar">
      <a-space>
      ${(json.filter || []).map(row => {
        switch (row.type) {
          case 'search':
            return `
        <a-input v-model="params.${row.field}" placeholder="${row.prompt||'请搜索'}" ${row.event ? `@pressEnter="${parseFuncName(row.field)}Change"` : ''} />`
          case 'select':
            return `
        <ha-select v-model="params.${row.field}" placeholder="${row.prompt||'请选择'}" :options="${row.field}_opts" ${row.option ? `option-field="${row.option}"` : '' } ${row.event ? `@change="${parseFuncName(row.field)}Change"` : ''}/>`
        default:
          return ''
      }
      }).join('').slice(7)}
        <a-button type="primary" @click="getTableLists" :loading="loading">搜索</a-button>
      </a-space>${json.filter && json.action ? `
      <a-space>
        ${json.action.map(act => `
        <a-button type="primary" @click="${parseFuncName(act,'-')}Act">操作</a-button>`).join('').slice(9)}
      </a-space>` : ''}
    </div>`
}

const gene_form_item = row => {
  switch (row.type) {
    case 'input':
      return `<a-input v-model="form.${row.field}" placeholder="请输入"/>`
    case 'select':
      return `<ha-select v-model="form.${row.field}" :options="${row.field}_opts" ${row.option ? `option-field="${row.option}"` : ''} ${row.event ? `@change="${parseFuncName(row.field)}Change"` : ''}/>`
    default:
      return ''
  }
}

const modal_dom = json => {
  return `<a-modal v-model="modal_visible" title="编辑操作" :footer="null">
      <a-form
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 20 }"
      >
        ${(json.form || []).map(row => {
          return `
        <a-form-item label="${row.label}">
          ${gene_form_item(row)}
        </a-form-item>`
        }).join('').slice(9)}
        <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
          <a-space>
            <a-button @click="toCommit" type="primary">提交</a-button>
            <a-button key="back" @click="modal_visible=false">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>`
}

const template = json => {
  let string = `<template>
  <section class="${json.name}">`
  if (json.filter && json.filter.length > 0) {
    string += `
    ${filter_dom(json)}`
  }
  string += `
    <a-table :columns="tableFields" :data-source="tableLists" :loading="loading" bordered :pagination="false">${parseSlots(json)}
    </a-table>`;
  if ((json.action && json.action.includes('add-modal'))
    || (json.tableAction && json.tableAction.includes('edit-modal'))
  ) {
    string += `
    ${modal_dom(json)}`
  }
  string += `
  </section>
</template>

`
  return string
}

const script = json=> `<script>
export default {
  name: "${json.name}",
  data() {
    return {
      ${getData(json)}
    }
  },
  methods: {
    ${getMethod(json)}
  },
  created() {
    this.init()
  }
}
</script>

`

var style = json=> `<style lang="less">
.${json.name} {
  .handle-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
`

function parseFuncName(name, sign='_') {
  let pos = name.indexOf(sign)
  let new_str = name
  if (pos >= 0) {
    new_str = name.slice(0, pos)
      + name[pos + 1].toUpperCase()
      + name.slice(pos + 2)
  }
  return new_str
}

module.exports = json => {
  return `${template(json)}${script(json)}${style(json)}`
}
