<template>
  <div class="codeTableCtrl">
    <el-row>
      <el-col :span="24">
        <div class="search_box">
          <el-button type="primary" @click="codeTable('add')" plain>添加</el-button>
          <el-input class="search_input" v-model="searchCon" placeholder="请输入内容">
            <el-button slot="append" @click="searchCodeTable" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="codeTableList"
      border
      style="width: 100%">
      <el-table-column label="码表名称" align="center" style="width: 20%;">
        <template slot-scope="scope">
          <el-input type="hidden" v-model="scope.row.id"> </el-input>
          {{scope.row.configName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="configValue"
        label="码表值"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        prop="configDescription"
        label="码表描述"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        style="width: 35%">
        <template slot-scope="scope">
          <el-button @click="codeTable('look')" type="primary" size="small">查看</el-button>
          <el-button @click="codeTable('edit')" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteConfim('codeTable', scope.row)" type="primary" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 对话框用来 查看 编辑 码表 -->
  <el-dialog class="add_code_table" :title="dialogTit" :fullscreen="fullscreen" :visible.sync="dialogFormVisible">
    <el-form class="add_code_form" :model="dialogCode">
      <el-form-item>                 
        <el-input placeholder="请输入码表名称"  v-model="dialogCode.configName" :disabled="disabled">
          <template slot="prepend">码表名称</template>
        </el-input>
        <el-input type="hidden" v-model="dialogCode.id"></el-input>
        <!-- <el-input v-model="dialogCode.configName" :disabled="disabled" auto-complete="off"></el-input> -->
      </el-form-item>
      <el-form-item >
        <el-input placeholder="请输入码表值"  v-model="dialogCode.configName" :disabled="disabled">
          <template slot="prepend" style="width:200px">码表值</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入码表描述"  v-model="dialogCode.configName" :disabled="disabled">
          <template slot="prepend">码表描述</template>
        </el-input>
      </el-form-item>
      <!-- 码值列表 开始-->
       <el-form-item>
        <el-button type="primary" @click="addCodeValue" plain :disabled="disabled">增加</el-button>
      </el-form-item>
      <el-form-item>
         <el-table
          :data="codeValueList"
          :row-class-name="tableRowClassName"
          border
          style="width: 100%">
          <el-table-column
            label="码值"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              <el-input placeholder="请输入码值"  v-model="scope.row.codeValue" :disabled="disabled">
              </el-input>
              <el-input type="hidden" style="display: none;" v-model="scope.row.id"> </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="码值名称"
            align="center"
            style="width: 20%;">
            <template slot-scope="scope">
              <el-input placeholder="请输入码值名称"  v-model="scope.row.codeName" :disabled="disabled">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="configDescription"
            label="码值描述"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              <el-input placeholder="请输入码值描述"  v-model="scope.row.codeDescription" :disabled="disabled">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="码值状态"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.codeStatus" :disabled="disabled" placeholder="请选择">
                <el-option label="可见" value="0"></el-option>
                <el-option label="不可见" value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            style="width: 35%">
            <template slot-scope="scope">
              <el-button @click="deleteConfim('codeValue', scope.row)" type="primary" :disabled="disabled" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 码值列表 开始-->
    </el-form>
    <!-- 列表 底部 开始-->
    <div slot="footer" v-show="showStatus" class="dialog_footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditCodeTable">确 定</el-button>
    </div>
    <!-- 列表 底部 开始-->
  </el-dialog>
  </div>
</template>
<script>
import {
  getConfigCodeList,
  getCodeValueList,
  delCodeTable,
  delCodeValue,
  addOrEditCodeTable
} from '@/api/gzb_code_table'
export default {
  components: { },
  name: 'codeTableCtrl',
  data() {
    return {
      searchCon: '', // 搜索框内容
      codeTableList: [], // ⭐码表列表数据
      count: 0, // 码表总条数
      dialogTit: '', // 弹出框的标题
      showStatus: true, // 弹出框底部按钮是否显示
      dialogFormVisible: false, // 弹出框是否显示
      dialogCode: {}, // 弹出框内容 码表基本信息
      disabled: true, // input 是否可以编辑
      fullscreen: true, // 弹出框是否全屏
      codeValueList: [], // ⭐码值列表数据
      isAddOrEdit: true, // 用来区分是增加码表还是编辑码值， true是增加码表，false是编辑码值
      // ⭐⭐码值数据格式，用来增加码值时候用
      baeeCodeVal: {
        codeDescription: '',
        codeName: '',
        codeOrder: '',
        codeStatus: '',
        codeValue: '',
        configId: '',
        configValue: '',
        id: '',
        isNewAdd: true // 用来区分是自己添加得码值还是从后台返回得码值，在删除码值得时候有用
      },
      /**
       * ⭐⭐⭐分页数据
       * */
      currentPage: 1, // 当前第几页
      total: 0, // 总共多少页
      page: 1, // 页码
      pageSize: 10, // 每页显示数据
      loading: false // 加载状态
    }
  },
  filters: {},
  computed: {

  },
  created() {
    this.getConfigCodeList()
  },
  methods: {
    searchCodeTable() {
      if (this.searchCon === '') {
        this.$message({
          type: 'warning',
          message: '搜索条件不能为空！'
        })
        return false
      }
      this.getConfigCodeList()
    },
    /**
     * 把每一行得索引加到row属性上，方便后面做删除操作
     */
    tableRowClassName(currentData) {
      currentData.row.rowIndex = currentData.rowIndex
    },
    /**
     * 新增码值
     */
    addCodeValue() {
      this.codeValueList.push(Object.assign({}, this.baeeCodeVal))
    },
    /**
     * 获取码表列表
     */
    getConfigCodeList() {
      const _this = this
      getConfigCodeList().then(function(response) {
        const res = response.data
        if (res.code === 0) {
          _this.$set(_this, 'codeTableList', res.data)
          _this.count = res.count
        }
      })
    },
    /**
     * 删除码表
     */
    deleteCodeTable(row) {
      const _this = this
      delCodeTable().then(function(response) {
        const res = response.data
        _this.codeTableList.splice(_this.codeTableList.findIndex(item => item.id === row.id), 1)
        if (res.e === '1') {
          _this.$message({
            type: 'success',
            message: '删除码值!'
          })
        } else {
          _this.$message({
            type: 'warning',
            message: res.m ? res.m : '删除失败!'
          })
        }
      }).catch(function(err) {
        _this.$message({
          type: 'error',
          message: err.m ? err.m : '删除失败!'
        })
      })
    },
    /**
     * 删除码值
     */
    deleteCodeValue(row) {
      const _this = this
      if (row.isNewAdd) {
        _this.codeValueList.splice(row.rowIndex, 1)
      } else {
        delCodeValue().then(function(response) {
          const res = response.data
          if (res.e === '1') {
            // 这里要删除码值
            _this.codeValueList.splice(_this.codeValueList.findIndex(item => item.id === row.id), 1)
            _this.$message({
              type: 'success',
              message: '删除码值!'
            })
          } else {
            _this.$message({
              type: 'warning',
              message: res.m ? res.m : '删除失败!'
            })
          }
        }).catch(function(err) {
          _this.$message({
            type: 'error',
            message: err.m ? err.m : '删除失败!'
          })
        })
      }
    },
    /**
     * 弹出  确认 删除码表，码值 的 提示框
     * status === codeTable 代表要删除得是码表
     * status === codeValue 代表要删除得是码值
     */
    deleteConfim(status, row) {
      const _this = this
      let confimTit = '确定要删除该码表吗？'
      let confimCon = '永久将删除哦，您确定吗？'
      let isDelRoleTable = true
      const isDelCodeTable = true
      console.log(isDelRoleTable, isDelCodeTable)
      if (status === 'codeTable') {
        confimTit = '确定要删除该码表吗？'
        confimCon = row.configName
        isDelRoleTable = true
      }
      _this.$confirm(confimCon, confimTit, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (isDelCodeTable) {
          _this.deleteCodeTable(row)
        } else {
          _this.deleteCodeValue(row)
        }
      })
    },
    /**
     * 获取码值列表
     */
    getCodeValue() {
      const _this = this
      getCodeValueList().then(function(response) {
        const res = response.data
        _this.dialogCode = res.d.gzb01TConfig
        _this.codeValueList = res.d.gzb01TConfigCodeList
      })
    },
    /**
     *  添加，查看，编辑码表
     **/
    codeTable(status) {
      const _this = this
      _this.dialogFormVisible = true
      _this.disabled = false
      _this.dialogCode = {}
      if (status === 'look') {
        _this.getCodeValue()
        _this.dialogTit = '查看码表'
        _this.showStatus = false
        _this.disabled = true
      } else if (status === 'edit') {
        _this.getCodeValue()
        _this.dialogTit = '编辑码表'
        _this.disabled = false
        _this.showStatus = true
        _this.isAddOrEdit = false
      } else if (status === 'add') {
        _this.dialogTit = '添加码表'
        _this.dialogCode = {}
        _this.codeValueList = []
        _this.codeValueList.push(Object.assign({}, _this.baeeCodeVal))
        _this.disabled = false
        _this.showStatus = true
        _this.isAddOrEdit = true
      }
    },
    /**
    * 确认 增加/编辑，码表、 码值
    * */
    addOrEditCodeTable() {
      const _this = this
      const data = {

      }
      addOrEditCodeTable(_this.isAddOrEdit, data).then(function(response) {
        const res = response.data
        if (res.e === '000000') {
          _this.$message({
            type: 'success',
            message: res.m ? res.m : '修改码值成功!'
          })
          _this.getConfigCodeList()
          _this.dialogFormVisible = false
        } else {
          _this.$message({
            type: 'warning',
            message: res.m ? res.m : '修改码值失败!'
          })
        }
      }).catch(function(err) {
        _this.$message({
          type: 'warning',
          message: err.m ? err.m : '修改码值失败!'
        })
      })
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>
<style scoped>
.codeTableCtrl {
  padding: 0 20px;
  padding-top: 30px;
}
.search_box {
  height: 60px;
  line-height: 60px;
  padding-left: 30px;
  border-left: 3px solid #409EFF;
  box-shadow: 0px 0px 3px #808080;
  margin-bottom: 20px;
}
.search_input {
  width: 30%;
  margin-left: 30px;
}
.add_code_form {
  padding: 0 50px 0 20px;
}
.codeTableCtrl >>> .el-input-group__prepend {
  width: 100px;
  text-align: center;
}
.dialog_footer {
  text-align: center;
}
</style>
