<template>
  <div class="adminCtrl">
    <el-row>
      <el-col :span="24">
        <div class="search_box">
           <el-col :md='6' :xs="12" :sm="12">
              <el-button type="primary" plain>批量删除</el-button>
              <el-button type="primary" @click="roleTable('add')" plain>添加</el-button>
            </el-col>
            <el-col :md='8' :xs="10" :sm="10">
              <el-input placeholder="请输入内容" size='medium' v-model="searchRole" class="input-with-select">
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
      style="width: 100%">
      <el-table-column label="角色名称" align="center" style="width: 20%;">
        <template slot-scope="scope">
          <el-input type="hidden" v-model="scope.row.id"> </el-input>
          {{scope.row.sumRoleName}}
        </template>
      </el-table-column>
      <el-table-column  prop="sumRoleDesc" label="角色描述" align="center" style="width: 20%">
      </el-table-column>
      <el-table-column prop="sumRoleType" label="角色类别"  align="center" style="width: 20%">
      </el-table-column>
      <el-table-column prop="sumRoleApp" label="第三方应用"  align="center" style="width: 20%">
      </el-table-column>
      <el-table-column prop="sumRoleStatus" label="角色状态"  align="center" style="width: 20%">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        style="width: 20%">
        <template slot-scope="scope">
          <el-button @click="roleTable('edit')" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteRole(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      adminTableList: [], // ⭐码表列表数据
      count: 0, // 码表总条数
      dialogTit: '', // 弹出框的标题
      showStatus: true, // 弹出框底部按钮是否显示
      dialogFormVisible: false, // 弹出框是否显示
      dialogRole: {}, // 弹出框内容 码表基本信息
      disabled: true, // input 是否可以编辑
      fullscreen: true, // 弹出框是否全屏
      // codeValueList: [], // ⭐码值列表数据
      isAddOrEdit: true, // 用来区分是增加码表还是编辑码值， true是增加码表，false是编辑码值
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
    this.getSumRoleList()
  },
  methods: {
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
          _this.count = res.count
        }
      })
    },
    delFlow(row) {
      console.log(row)
    },
    /**
    * 确认 增加/编辑，码表、 码值
    * */
    addOrEditRoleTable() {
      const _this = this
      const data = {

      }
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
.search_input {
  width: 30%;
  margin-left: 30px;
}
</style>
