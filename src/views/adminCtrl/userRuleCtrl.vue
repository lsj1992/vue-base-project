<template>
      <el-form class="peolesCtrl" label-position="top" label-width="80px"> 
        <el-form-item label="班组" >
          <el-select v-model="groupList" @change="groupName" placeholder="请选择">
            <el-option
             v-for="item in items"
             :key="item.id"
             :label="item.groupName"
             :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作流名称" >
          <el-select v-model="flowList" @change="flowRole" placeholder="请选择">
            <el-option
             v-for="item in flows"
             :key="item.id"
             :label="item.flowName"
             :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="角色" >
          <el-select v-model="roleList" @change="flowRoleList" placeholder="请选择">
            <el-option
             v-for="item in roles"
             :key="item.sumRoleId"
             :label="item.sumRoleName"
             :value="item.sumRoleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-transfer
              v-model="groupUserRole"
              :titles="['成员', '已选']"
              :props="{
                key: 'id',
                label: 'userName'
              }"
              :data="groupUserList">
            </el-transfer>
        </el-form-item>
        <div  class="dialog_footer">
          <el-button @click="AddRule" type="primary">确 定</el-button>
        </div>
      </el-form>
      
      <!-- 列表 底部 开始-->
</template>
<script>
import * as gzbRule from '@/api/gzb_rule'
export default {
  components: { },
  name: 'peolesCtrl',
  data() {
    return {
      groupUserList: [],
      groupUserRole: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },
      groupList: '', // 班组列表
      items: [], // 班组数据
      flowList: '', // 工作流列表
      flows: [], // 工作流数据
      roleList: '', // 角色列表
      dialogFormVisible: false,
      roles: [] // 角色数据

    }
  },
  filters: {},
  computed: {

  },
  methods: {
    generateData(eleData) {
      const data = []
      const cities = eleData
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index
        })
      })
      return data
    },
    getGroupList() {
      gzbRule.getGroupList().then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.items = res.d
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login'
              })
            })
          })
        }
      })
    },
    getGroupFlow() {
      const data = {
        id: this.groupList
      }
      gzbRule.getGroupFlow(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.flows = res.d
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        }
      })
    },
    getFlowRole() {
      const data = {
        flowId: this.flowList
      }
      gzbRule.getFlowRole(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.roles = res.d
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        }
      })
    },
    flowRoleList() {
      const data = {
        roleId: this.roleList,
        groupId: this.groupList
      }
      gzbRule.addGroupMember(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          const newArr = []
          // res.d.groupUserList 右侧数据
          res.d.groupUserList.forEach(item => {
            newArr.push(item.id)
          })
          this.groupUserList = res.d.groupUserList.concat(res.d.groupUserRoleList) // 左侧全部的数据
          this.groupUserRole = newArr // 右侧数据 userIdList
          // userId
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        }
      })
    },
    groupName() {
      this.flowList = ''
      this.roleList = ''
      this.groupUserRole = []
      this.groupUserList = []
      this.getGroupFlow()
    },
    flowRole() {
      this.roleList = ''
      this.groupUserRole = []
      this.groupUserList = []
      this.getFlowRole()
    },
    AddRule() {
      const leftArr = []
      this.groupUserList.forEach(item => {
        this.groupUserRole.forEach(self => {
          if (self !== item.id) {
            leftArr.push(item.id)
          }
        })
      })
      const data = {
        roleId: this.roleList,
        groupId: this.groupList,
        userIdList: this.groupUserRole.join(),
        userId: leftArr.join(),
        role: 0
      }
      if (data.groupId === '' || data.groupId === undefined) {
        this.$message({
          type: 'warning',
          message: '班组不能为空！'
        })
        return false
      }
      if (data.flowId === '' || data.flowId === undefined) {
        this.$message({
          type: 'warning',
          message: '工作流名称不能为空！'
        })
        return false
      }
      if (data.userId === '' || data.userId === undefined) {
        this.$message({
          type: 'warning',
          message: '角色不能为空！'
        })
        return false
      }
      // data.groupId
      gzbRule.addMember(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '绑定失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        }
      })
    }
  },
  created() {
    this.getGroupList()
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.peolesCtrl {
  padding: 30px 40px 20px;
}
.peolesCtrl >>> .el-form-item__label {
  text-align: center;
  background-color: #f5f7fa;
  color: #909399;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.dialog_footer {
  text-align: center;
}
.boxGroup {
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
}
.boxSelect {
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
  position: absolute;
  left: 500px;
  top: -317px;
}
</style>
