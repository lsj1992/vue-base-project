<template>
  <div class="adminCtrl">
    <el-row>
      <el-col :span="24">
        <div class="search_box">
           <el-col :md='6' :xs="12" :sm="12">
              <el-button type="primary" @click="batchDel" plain>批量删除</el-button>
              <el-button type="primary" @click="roleTable('add')" plain>添加</el-button>
            </el-col>
            <el-col :md='8' :xs="10" :sm="10">
              <el-input placeholder="请输入内容" size='medium' v-model="searchRole" class="search_input">
                <el-button slot="append" icon="el-icon-search" @click="searchRoleTable"></el-button>
              </el-input>
            </el-col>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="adminTableList"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column label="角色名称" align="center" style="width: 20%;">
        <template slot-scope="scope">
          {{scope.row.sumRoleName}}
        </template>
      </el-table-column>
      <el-table-column prop="sumRoleDesc" label="角色描述" align="center" style="width: 20%">
      </el-table-column>
      <el-table-column label="角色类别"  align="center" style="width: 20%">
        <template slot-scope="scope">
          {{scope.row.sumRoleType === 0 ? '工作流' : '菜单'}}
        </template>
      </el-table-column>
      <el-table-column prop="sumRoleApp" label="第三方应用"  align="center" style="width: 20%">
      </el-table-column>
      <el-table-column  label="角色状态"  align="center" style="width: 20%">
        <template slot-scope="scope">
          {{scope.row.sumRoleStatus === 0 ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        style="width: 20%">
        <template slot-scope="scope">
          <el-button @click="getRoleValue(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteRoleTable(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新的弹窗   title="添加角色"-->
    <el-dialog
      width="50%"
      :title="dialogTit"
      :visible.sync="dialogFormVisible"
      append-to-body>
      <addRule ref="addRule" :ruleData="dialogRole"></addRule>
      <div slot="footer" class="dialog_footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditRoleTable">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as gzbAdmin from '@/api/gzb_admin'
import addRule from '@/components/addRule'
export default {
  components: {
    addRule
  },
  name: 'adminCtrl',
  data() {
    return {
      searchRole: '', // 搜索框内容
      adminTableList: [], // ⭐角色列表数据
      count: 0, // 角色总条数
      dialogTit: '', // 弹出框的标题
      showStatus: true, // 弹出框底部按钮是否显示
      dialogFormVisible: false, // 弹出框是否显示
      dialogRole: {}, // 弹出框内容 角色基本信息
      disabled: true, // input 是否可以编辑
      fullscreen: true, // 弹出框是否全屏
      isAddOrEdit: true, // 用来区分是增加角色还是编辑角色， true是增加角色，false是编辑角色
      selectIds: [], // 选中行的id
      currentPage: 1, // 当前第几页
      total: 0, // 总共多少页
      page: 1, // 页码
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: 10,
      loading: false,
      sumRoleStatus: true
    }
  },
  filters: {},
  computed: {

  },
  created() {
    this.getSumRoleList()
  },
  methods: {
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getSumRoleList()
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSumRoleList()
    },
    searchRoleTable() {
      if (this.searchRole === '') {
        this.$message({
          type: 'warning',
          message: '搜索条件不能为空！'
        })
        return false
      }
      this.getSumRoleList()
    },
    /**
     * 把每一行得索引加到row属性上，方便后面做删除操作
     */
    tableRowClassName(currentData) {
      currentData.row.rowIndex = currentData.rowIndex
    },
    getRoleValue(row) {
      const data = {
        id: row.sumRoleId
      }
      this.dialogFormVisible = true
      gzbAdmin.getRoleValueList(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.dialogRole = res.d
          console.log(this.dialogRole)
          this.dialogRole.sumRoleStatus = this.dialogRole.sumRoleStatus === 0
        }
      })
    },
    // unknown() {
    //   const data = {
    //   }
    //   gzbAdmin.unknown(data).then((response) => {
    //     const res = response.data
    //     console.log(res)
    //   })
    // },
    getSumRoleList() {
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize,
        sumRoleName: this.searchRole
      }
      gzbAdmin.getSumRoleList(data).then((response) => {
        const res = response.data
        if (res.code === '000000') {
          this.$set(this, 'adminTableList', res.data)
          this.total = res.count
        }
      })
    },
    deleteRoleTable(row) {
      const data = {
      }
      let isList = true
      if (Array.isArray(row)) {
        data.ids = row.join()
        isList = true
      } else {
        data.id = row.sumRoleId
        isList = false
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        gzbAdmin.deleteRoleTable(isList, data).then((response) => {
          const res = response.data
          if (res.e === '000000') {
            this.$message({
              type: 'success',
              message: '删除角色!'
            })
            if (isList) {
              row.forEach(item => {
                this.adminTableList.splice(this.adminTableList.findIndex(items => items.sumRoleId === item.sumRoleId), 1)
              })
            } else {
              this.adminTableList.splice(this.adminTableList.findIndex(item => item.sumRoleId === row.sumRoleId), 1)
            }
            this.total = this.adminTableList.length
          } else {
            this.$message({
              type: 'warning',
              message: res.m ? res.m : '删除失败!'
            })
          }
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.m ? err.m : '删除失败!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    batchDel() {
      this.deleteRoleTable(this.selectIds)
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
      this.selectIds = []
      if (rows) {
        this.multipleSelection.map((item) => {
          this.selectIds.push(item.sumRoleId)
        })
      }
    },
    roleTable(status) {
      this.dialogFormVisible = true
      this.disabled = false
      this.dialogRole = {}
      if (status === 'edit') {
        this.getRoleValue()
        this.dialogTit = '编辑角色'
        this.disabled = false
        this.showStatus = true
        this.isAddOrEdit = false
      } else if (status === 'add') {
        this.dialogTit = '添加角色'
        this.dialogRole = {}
        this.roleValueList = []
        this.roleValueList.push(Object.assign({}, this.baeeRoleVal))
        this.disabled = false
        this.showStatus = true
        this.isAddOrEdit = true
      }
    },
    /**
    * 确认 增加/编辑，码表、 码值
    * */
    addOrEditRoleTable() {
      this.dialogRole = this.$refs.addRule.newRuleData
      const data = {
        sumRoleName: this.dialogRole.sumRoleName,
        sumRoleDesc: this.dialogRole.sumRoleDesc,
        sumRoleType: this.dialogRole.sumRoleType,
        sumRoleApp: this.dialogRole.sumRoleApp,
        sumRoleStatus: this.dialogRole.sumRoleStatus ? 0 : 1
      }
      if (!this.$refs.addRule.intercept()) {
        return false
      }
      gzbAdmin.addOrEditRoleTable(this.isAddOrEdit, data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.$message({
            type: 'success',
            message: res.m ? res.m : '修改角色成功!'
          })
          this.getSumRoleList()
          this.dialogFormVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: res.m ? res.m : '修改角色失败!'
          })
        }
      }).catch((err) => {
        this.$message({
          type: 'warning',
          message: err.m ? err.m : '修改角色失败!'
        })
      })
    },
    changeRoleStatus() {
    // this.sumRoleStatus = !this.dialogRole.sumRoleStatus
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.adminCtrl {
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
.add_role_form {
  padding: 0 50px 0 20px;
}
.adminCtrl >>> .el-input-group__prepend {
  width: 100px;
  text-align: center;
}
.dialog_footer {
  text-align: center;
}
</style>
