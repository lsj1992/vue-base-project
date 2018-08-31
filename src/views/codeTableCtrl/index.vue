<template>
  <div class="codeTableCtrl">
    <!-- 顶部台南佳和搜索框 -->
    <el-row>
      <el-col :span="24">
        <div class="search_box">
          <el-button type="primary" @click="codeTable('add')" plain>添加</el-button>
          <el-input class="search_input" 
            v-model="searchCon"
            placeholder="请输入内容">
            <el-button slot="append" @click="searchCodeTable" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <!-- 码表列表 -->
    <el-table
      :data="codeTableList"
      border
      style="width: 100%">
      <el-table-column
        label="码表名称"
        align="center"
        style="width: 20%;">
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
          <el-button @click="codeTable('look', scope.row)" type="primary" size="small">查看</el-button>
          <el-button @click="codeTable('edit', scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteConfim('codeTable', scope.row)" type="primary" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 码表分页 -->
    <el-pagination
      class="pagination_box"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框用来 查看 编辑 码表 -->
    <el-dialog class="add_code_table" :title="dialogTit" :fullscreen="fullscreen" :visible.sync="dialogFormVisible">
      <!-- 增加表单验证  -->
      <el-form class="add_code_form" ref="codeTableRefs"  :rules="validateCodeTable" :model="dialogCode">
        <el-form-item prop="configName">
          <el-input placeholder="请输入码表名称" name="configName" v-model.trim="dialogCode.configName" :disabled="disabled">
            <template slot="prepend">码表名称</template>
          </el-input>
          <el-input type="hidden" v-model="dialogCode.id"></el-input>
        </el-form-item>
        <el-form-item prop="configValue">
          <el-input placeholder="请输入码表值" name="configValue" @keyup.up="replaceChanese" v-model.trim="dialogCode.configValue" :disabled="disabled">
            <template slot="prepend" style="width:200px">码表值</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="configDescription">
          <el-input placeholder="请输入码表描述" name="configDescription" v-model.trim="dialogCode.configDescription" :disabled="disabled">
            <template slot="prepend">码表描述</template>
          </el-input>
        </el-form-item>
        <!-- 码值列表 开始-->
        <el-form-item>
          <el-button type="primary" @click="addCodeValue" plain :disabled="disabled">增加</el-button>
        </el-form-item>
        <el-form-item class="code_value_table">
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
                <el-input placeholder="请输入码值" 
                  v-model="scope.row.codeValue" 
                  :disabled="disabled">
                </el-input>
                <el-input type="hidden" style="display: none;" v-model="scope.row.id"> </el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="码值名称"
              align="center"
              style="width: 20%;">
              <template slot-scope="scope">
                <el-input placeholder="请输入码值名称" v-model="scope.row.codeName" :disabled="disabled">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="configDescription"
              label="码值描述"
              align="center"
              style="width: 25%">
              <template slot-scope="scope">
                <el-input placeholder="请输入码值描述" prop="codeDescription" v-model="scope.row.codeDescription" :disabled="disabled">
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
              label="码值序号"
              align="center"
              style="width: 25%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.codeOrder" :disabled="disabled" type="number" min="1" placeholder="请输入码值序号"></el-input>
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
        <!-- 后台没有分页 -->
         <!-- <el-pagination
          class="pagination_box"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dialogCurrentPage"
          :page-sizes="dialogPageSizes"
          :page-size="dialogPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dialogTotal">
        </el-pagination> -->
      </el-form>
      <!-- 列表 底部 开始-->
      <div slot="footer" v-show="showStatus" class="dialog_footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCodeTable">确 定</el-button>
      </div>
      <!-- 列表 底部 结束-->
    </el-dialog>
  </div>
</template>
<script>
import * as gzbCode from '@/api/gzb_code_table'
export default {
  components: { },
  name: 'codeTableCtrl',
  data() {
    const validateConfigName = (rule, value, callback) => {
      if ((/\d/.test(value))) {
        callback(new Error('码表名称不能有数子'))
      } else if (!value || value.trim().length <= 0) {
        callback(new Error('码表名称不能为空!'))
      } else {
        callback()
      }
    }
    const validateConfigValue = (rule, value, callback) => {
      console.log(value)
      if (!value || value.trim().length <= 0) {
        callback(new Error('码表值不能为空!'))
      } else {
        callback()
      }
    }
    const validateConfigDescription = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('码表描述不能为空'))
      } else {
        callback()
      }
    }
    const validateCodeValue = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('码值名称不能为空'))
      } else {
        callback()
      }
    }
    const validateCcodeDescription = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('码值名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      searchCon: '', // 搜索框内容
      codeTableList: [], // ⭐码表列表数据
      dialogTit: '', // 弹出框的标题
      showStatus: true, // 弹出框底部按钮是否显示
      dialogFormVisible: false, // 弹出框是否显示
      dialogCode: {}, // 弹出框内容 码表基本信息
      disabled: true, // input 是否可以编辑
      fullscreen: true, // 弹出框是否全屏
      codeValueList: [], // ⭐码值列表数据
      isAddOrEdit: true, // 用来区分是增加码表还是编辑码值， true是增加码表，false是编辑码值
      // ⭐⭐码值数据格式，用来增加码值时候用
      baseCodeVal: {
        codeDescription: '',
        codeName: '',
        codeOrder: 1,
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
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: 10, // 每页显示数据
      loading: false, // 加载状态
      // 弹窗的分页
      dialogCurrentPage: 1,
      dialogTotal: 0, // 总共多少页
      dialogPage: 1,
      dialogPageSize: 10,
      dialogPageSizes: [10, 20, 30, 40, 50],
      // 添加码表页面表单验证
      validateCodeTable: {
        configName: [{ required: true, trigger: 'blur', validator: validateConfigName }],
        configValue: [{ required: true, trigger: 'blur', validator: validateConfigValue }],
        configDescription: [{ required: true, trigger: 'blur', validator: validateConfigDescription }],
        codeValue: [{ required: true, trigger: 'blur', validator: validateCodeValue }],
        codeDescription: [{ required: true, trigger: 'blur', validator: validateCcodeDescription }]
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }] }
      }
    }
  },
  filters: {},
  computed: {

  },
  created() {
    this.getConfigCodeList()
  },
  methods: {
    /**
     * 替换中文
     */
    replaceChanese() {
      this.dialogCode.configValue.replace(/[\/u0391\-\/uFFE5]/gi, '')
    },
    /**
     * 搜索功能
     */
    searchCodeTable() {
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
      this.codeValueList.push(Object.assign({}, this.baseCodeVal))
    },
    /**
     * 获取码表列表
     *  ⭐⭐⭐⭐⭐⭐⭐注意这里的返回码，code 是0，
     */
    getConfigCodeList() {
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize,
        configName: this.searchCon
      }
      gzbCode.getConfigCodeList(data).then((response) => {
        const res = response.data
        if (res.code === 0) {
          this.codeTableList = res.data
          this.total = res.count
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取码表失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.m ? err.m : '获取码表失败！',
          type: 'error'
        })
      })
    },
    /**
     * 删除码表
     */
    deleteCodeTable(row) {
      const data = {
        id: row.id
      }
      gzbCode.delCodeTable(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.total--
          this.codeTableList.splice(this.codeTableList.findIndex(item => item.id === row.id), 1)
          if (res.e === '1') {
            this.$message({
              type: 'success',
              message: res.m ? res.m : '删除码表成功!'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.m ? res.m : '删除码表失败!'
          })
        }
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err.m ? err.m : '删除码表失败!'
        })
      })
    },
    /**
     * 删除码值
     */
    deleteCodeValue(row) {
      if (row.isNewAdd) {
        this.codeValueList.splice(row.rowIndex, 1)
      } else {
        const data = {
          id: row.id
        }
        gzbCode.delCodeValue(data).then((response) => {
          const res = response.data
          if (res.e === '000000') {
            // 这里要删除码值
            this.codeValueList.splice(this.codeValueList.findIndex(item => item.id === row.id), 1)
            this.$message({
              type: 'success',
              message: res.m ? res.m : '删除码值成功!'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.m ? res.m : '删除码值失败!'
            })
          }
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.m ? err.m : '删除码值失败!'
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
      let isDelCodeTable = true
      if (status === 'codeTable') {
        confimTit = '确定要删除该码表吗？'
        confimCon = row.configName
        isDelCodeTable = true
      } else if (status === 'codeValue') {
        if (_this.codeValueList.length === 1) {
          _this.$message({
            type: 'warning',
            message: '至少保留一个码值!'
          })
          return false
        } else {
          confimTit = '确定要删除该码值吗？'
        }
        // isNewAdd
        confimCon = row.codeName
        isDelCodeTable = false
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
    getCodeValue(row) {
      const data = {
        configId: row.id,
        page: this.dialogCurrentPage,
        pageSize: this.dialogPageSize
      }
      gzbCode.getCodeValueList(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.dialogCode = res.d.gzb01TConfig
          res.d.gzb01TConfigCodeList.forEach(item => {
            item.codeStatus = item.codeStatus.toString()
          })
          this.codeValueList = res.d.gzb01TConfigCodeList
        }
      })
    },
    /**
     *  添加，查看，编辑码表
     **/
    codeTable(status, row) {
      this.dialogFormVisible = true
      this.disabled = false
      this.dialogCode = {}
      if (status === 'look') {
        this.getCodeValue(row)
        this.dialogTit = '查看码表'
        this.showStatus = false
        this.disabled = true
      } else if (status === 'edit') {
        this.getCodeValue(row)
        this.dialogTit = '编辑码表'
        this.disabled = false
        this.showStatus = true
        this.isAddOrEdit = false
      } else if (status === 'add') {
        this.dialogTit = '添加码表'
        this.dialogCode = {}
        this.codeValueList = []
        this.codeValueList.push(Object.assign({}, this.baseCodeVal))
        this.disabled = false
        this.showStatus = true
        this.isAddOrEdit = true
      }
    },
    /**
    * 确认 增加/编辑，码表、 码值
    * */
    addOrEditCodeTable() {
      // const _this = this
      // 表单验证
      this.$refs.codeTableRefs.validate(valid => {
        if (valid) {
          const data = {
            id: this.dialogCode.id,
            configName: this.dialogCode.configName,
            configValue: this.dialogCode.configValue,
            configDescription: this.dialogCode.configDescription,
            configCodeListStr: JSON.stringify(this.codeValueList)
          }
          const msg = this.isAddOrEdit ? '添加码表成功' : '修改码表成功'
          const errorMsg = this.isAddOrEdit ? '添加码表失败' : '修改码表失败'
          gzbCode.addOrEditCodeTable(this.isAddOrEdit, data).then(response => {
            const res = response.data
            if (res.e === '000000') {
              this.$message({
                type: 'success',
                message: res.m ? res.m : msg
              })
              this.getConfigCodeList()
              this.dialogFormVisible = false
            } else {
              this.$message({
                type: 'warning',
                message: res.m ? res.m : errorMsg
              })
            }
          }).catch((err) => {
            this.$message({
              type: 'warning',
              message: err.m ? err.m : errorMsg
            })
          })
          // ===========
          // gzbCode.addOrEditCodeTable(this.isAddOrEdit, data).then((response) {
          //   const res = response.data
          //   if (res.e === '000000') {
          //     this.$message({
          //       type: 'success',
          //       message: res.m ? res.m : '修改码值成功!'
          //     })
          //     this.getConfigCodeList()
          //     this.dialogFormVisible = false
          //   } else {
          //     this.$message({
          //       type: 'warning',
          //       message: res.m ? res.m : '修改码值失败!'
          //     })
          //   }
          // }).catch((err) => {
          //   this.$message({
          //     type: 'warning',
          //     message: err.m ? err.m : '修改码值失败!'
          //   })
          // })
        } else {
          return false
        }
      })
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getConfigCodeList()
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getConfigCodeList()
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
  position: relative;
  padding: 30px 20px 20px;
  /* height: calc(100vh - 84px); */
  overflow: auto;
}
/* .pagination_box {
  position: fixed;
  left: 0;
  bottom: -0px;
  height: 50px;
  margin: 10px 0;
} */
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
.el-dialog__body {
  height: auto;
}
.dialog_footer {
  text-align: center;
}
.codeTableCtrl >>> .el-form-item__content {
  height: 50px;
}
.codeTableCtrl >>> .code_value_table .el-form-item__content {
  height: auto;
}

</style>
