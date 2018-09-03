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
          <!-- <el-button type="primary" @click="roleTable('add')" plain>添加</el-button>
          <el-input class="search_input" v-model="searchRole" placeholder="请输入内容">
            <el-button slot="append" @click="searchRoleTable" icon="el-icon-search"></el-button>
          </el-input> -->
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
          <el-input type="hidden" v-model="scope.row.id"> </el-input>
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
    <el-dialog class="add_role_table" :title="dialogTit" :fullscreen="fullscreen" :visible.sync="dialogFormVisible">
    <el-form class="add_role_form" :model="dialogRole">
      <el-form-item>                 
        <el-input style="width: 40%; margin-right: 25px;" placeholder="请输入角色名称" name="sumRoleName" v-model="dialogRole.sumRoleName">
          <template slot="prepend">角色名称</template>
        </el-input>
        <el-switch
              v-model="dialogRole.sumRoleStatus"
              active-text="启用"
              inactive-text="禁用"
              @change="changeRoleStatus()"
              >
            </el-switch>
        <!-- <el-input v-model="dialogCode.configName" :disabled="disabled" auto-complete="off"></el-input> -->
      </el-form-item>
      <el-form-item >
        <el-input style="width: 40%; margin-right: 25px;" placeholder="请输入第三方应用"  v-model="dialogRole.sumRoleApp" >
          <template slot="prepend" style="width:200px">第三方应用</template>
        </el-input>
      </el-form-item>
      <el-form-item 
        label="角色类别"
        align="center"
        style="width: 25%">
        <template>
          <el-select v-model="dialogRole.sumRoleType" placeholder="请选择">
            <el-option label="工作流" value="0"></el-option>
            <el-option label="菜单" value="1"></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item class="flow_desc" label="角色描述">
           <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="dialogRole.sumRoleDesc">
          </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" v-show="showStatus" class="dialog_footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditRoleTable">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import * as gzbAdmin from '@/api/gzb_admin'
export default {
  components: { },
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
    handleCurrentChange() {},
    handleSizeChange() {},
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
          this.dialogRole.sumRoleStatus = this.dialogRole.sumRoleStatus === 0
          this.dialogRole.sumRoleType = this.dialogRole.sumRoleType.toString()
        }
      })
    },
    getSumRoleList() {
      const _this = this
      const data = {
        page: _this.currentPage,
        pageSize: _this.pageSize
      }
      gzbAdmin.getSumRoleList(data).then(function(response) {
        const res = response.data
        if (res.code === '000000') {
          _this.$set(_this, 'adminTableList', res.data)
          _this.total = res.count
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
          if (isList) {
            row.forEach(item => {
              this.adminTableList.splice(this.adminTableList.findIndex(items => items.sumRoleId === item.sumRoleId), 1)
            })
          } else {
            this.adminTableList.splice(this.adminTableList.findIndex(item => item.sumRoleId === row.sumRoleId), 1)
          }

          if (res.e === '1') {
            this.$message({
              type: 'success',
              message: '删除角色!'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.m ? res.m : '删除失败!'
            })
          }
        }).catch(function(err) {
          this.$message({
            type: 'error',
            message: err.m ? err.m : '删除失败!'
          })
        })
      }).catch(function() {
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
      // this.select_order_number = this.multipleSelection.length
      this.selectIds = []
      if (rows) {
        this.multipleSelection.map((item) => {
          this.selectIds.push(item.sumRoleId)
        })
      }
    },
    roleTable(status) {
      const _this = this
      _this.dialogFormVisible = true
      _this.disabled = false
      _this.dialogRole = {}
      if (status === 'edit') {
        _this.getRoleValue()
        _this.dialogTit = '编辑角色'
        _this.disabled = false
        _this.showStatus = true
        _this.isAddOrEdit = false
      } else if (status === 'add') {
        _this.dialogTit = '添加角色'
        _this.dialogRole = {}
        _this.roleValueList = []
        _this.roleValueList.push(Object.assign({}, _this.baeeRoleVal))
        _this.disabled = false
        _this.showStatus = true
        _this.isAddOrEdit = true
      }
    },
    /**
    * 确认 增加/编辑，码表、 码值
    * */
    addOrEditRoleTable() {
      const _this = this
      const data = {
        sumRoleName: _this.dialogRole.sumRoleName,
        sumRoleDesc: _this.dialogRole.sumRoleDesc,
        sumRoleType: _this.dialogRole.sumRoleType,
        sumRoleApp: _this.dialogRole.sumRoleApp,
        sumRoleStatus: _this.dialogRole.sumRoleStatus ? 0 : 1
      }
      console.log(data)
      gzbAdmin.addOrEditRoleTable(_this.isAddOrEdit, data).then(function(response) {
        const res = response.data
        if (res.e === '000000') {
          _this.$message({
            type: 'success',
            message: res.m ? res.m : '修改角色成功!'
          })
          _this.getSumRoleList()
          _this.dialogFormVisible = false
        } else {
          _this.$message({
            type: 'warning',
            message: res.m ? res.m : '修改角色失败!'
          })
        }
      }).catch(function(err) {
        _this.$message({
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
