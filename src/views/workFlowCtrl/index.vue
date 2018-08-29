<template>
  <div class="workFlowCtrl">
    <!-- 顶部添加按钮 -->
    <el-row>
      <el-col :span="24">
        <div class="search_box">
          <el-row>
            <el-col :md='6' :xs="12" :sm="12">
              <el-button type="primary" @click="batchDel" plain>批量删除</el-button>
              <el-button type="primary" @click="addOrEditFlow('add')"  plain>添加</el-button>
            </el-col>
            <el-col :md='8' :xs="10" :sm="10">
              <el-input placeholder="请输入内容" size='medium' v-model="fuzzyQueryName" class="input-with-select">
                <el-button slot="append" @click="getFlowList" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 工作流列表展示 -->
     <el-table
      :data="flowList"
      @selection-change="handleSelectionChange"
      border
      background
      style="width: 100%">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column
        prop="flowName"
        label="工作流名称"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        prop="discrible"
        label="描述"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        prop="count"
        label="审批步数"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        label="是否启用"
        align="center"
        style="width: 25%">
          <template slot-scope="scope">
            {{scope.row.isAvailable === 0 ? '启用' : '禁用'}}
            <!-- <el-switch
              v-model="scope.row.isAvailable"
              active-text="启用"
              inactive-text="禁用"
              @change="changeFlowStatus(scope.row)"
              >
            </el-switch> -->
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        style="width: 25%">
        <template slot-scope="scope">
          <el-button @click="addOrEditFlow('edit', scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="delFlow([], scope.row)" type="danger" size="small">删除</el-button>
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
    <!-- 点击详情展示出提示框 -->
    <el-dialog
      :title="dialogTit"
      :fullscreen="fullscreen"
      width="80%"
      :visible.sync="dialogFormVisible">
      <!-- 增加表单验证  -->
      <el-form class="add_image_form" :model="detailFlowData">
        <el-form-item>
          <el-input name="configName" v-model="detailFlowData.flowName">
            <template slot="prepend">工作流名称</template>
          </el-input>
        </el-form-item>
        <el-form-item class="flow_desc" label="工作流描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="detailFlowData.discrible">
          </el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="addEmptStep" type="primary" size="small">增加</el-button>
        </el-form-item>
        <el-form-item>
          <!-- 步骤 -->
          <el-table
          :data="detailFlowStep"
          :row-class-name="tableRowClassName"
          border
          background
          style="width: 100%">
          <el-table-column
            fixed
            prop="rowIndex"
            label="步骤"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            label="审批角色"
            align="center"
            width="250">
              <template slot-scope="scope">
              <el-select v-model="scope.row.sumRoleid" placeholder="请选择">
                <el-option
                  v-for="item in RoleList"
                  :key="item.sumRoleId"
                  :label="item.sumRoleName"
                  :value="item.sumRoleId">
                </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="通知形式"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.SMS" placeholder="请选择">
                <el-option
                  v-for="item in noticeType"
                  :key="item.codeValue"
                  :label="item.codeName"
                  :value="item.codeValue">
                </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="等待周期"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.duration" placeholder="请选择">
              <el-option
                v-for="item in weatTime"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="第三方程序"
            align="center"
            width="250">
            <template slot-scope="scope">
              <el-select v-model="scope.row.remindId" placeholder="请选择">
              <el-option
                v-for="item in thirdpartyApp"
                :key="item.id"
                :label="item.codeName"
                :value="item.id">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="中止回滚节点"
            align="center"
            width="250">
            <template slot-scope="scope">
              <el-select v-model="scope.row.whereabouts" placeholder="请选择">
              <el-option
                v-for="item in whereGo"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="是否需要审批"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.isAttach" placeholder="请选择">
              <el-option
                v-for="item in isNeedApproval"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="是否添加附件"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.isApproval" placeholder="请选择">
              <el-option
                v-for="item in isNeedUplodFile"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
             <el-button @click="deletStep" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as gzbFlow from '@/api/gzb_flow'
import { http } from '@/utils/request'
export default {
  components: { },
  name: 'workFlowCtrl',
  data() {
    return {
      teamVal: '', // 选择的班组
      teamList: [], // 分组列表【select下拉框中的值】
      fuzzyQueryName: '', // 模糊查询
      flowList: [], // 查询出的工作流 列表
      currentPage: 1,
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: 10,
      total: 0,
      dialogTit: '工作流详情', // 弹窗的标题
      fullscreen: false, // 弹窗的全屏控制
      dialogFormVisible: false, // 弹窗的展示隐藏
      detailFlowData: {}, // 工作流详情
      detailFlowStep: [], // 工作流详情 步骤
      selectIds: [], // 选中行的id
      RoleList: [], // 审批角色
      noticeType: [], // 通知形式
      thirdpartyApp: [], // 第三方程序
      // 空的步骤
      getGzb01TFlow: {
        duration: 10, // 等待周期
        flowId: 0,
        flowOrder: 0,
        flowRoleId: 0,
        isApproval: 0, // 是否添加组件 0 是 1 否
        isAttach: 0, // 是否需要审批
        remindId: '', // SMS 短信， email  email
        sumRoleId: 0, // 班组id
        sumRoleName: '', // 班组名称
        thirdFunctionId: '' // TAX BUREAU 税务局 POSTAL_BANK 邮储银行
      },
      whereabouts: 0,
      weatTime: [
        {
          value: 10,
          label: '10分钟'
        },
        {
          value: 20,
          label: '20分钟'
        },
        {
          value: 30,
          label: '30分钟'
        }
      ],
      // 否定后去向
      whereGo: [
        {
          value: 0,
          label: '通知给创建者'
        },
        {
          value: 1,
          label: '通知给上一级'
        },
        {
          value: 2,
          label: '给上面所有人通知'
        }
      ],
      // 是否需要审批
      isNeedApproval: [
        {
          value: 0,
          label: '是'
        },
        {
          value: 1,
          label: '否'
        }
      ],
      // 是否需要上传附件
      isNeedUplodFile: [
        {
          value: 0,
          label: '是'
        },
        {
          value: 1,
          label: '否'
        }
      ]
    }
  },
  filters: {
    whereabouts(id) {
      // 0 通知给创建者
      // 1 通知给上一级
      // 2 给上面所有人通知
      if (id === 0) {
        return '通知给创建者'
      } else if (id === 1) {
        return '通知给上一级'
      } else if (id === 2) {
        return '给上面所有人通知'
      }
    }
  },
  computed: {

  },
  created() {
    this.getFlowList()
  },
  methods: {
    /**
     * 工作流列表
     */
    getFlowList() {
      const data = {
        pageSize: this.pageSize,
        page: this.currentPage,
        flowName: this.fuzzyQueryName
      }
      gzbFlow.getFlowList(data).then(response => {
        const res = response.data
        if (res.code === '000000') {
          this.flowList = res.data
          this.total = res.count
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取工作流列表失败！',
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
          message: err.m ? err.m : '获取工作流列表失败！',
          type: 'error'
        })
      })
    },
    /**
     * 删除工作流
     */
    delFlow(isBatch, row) {
      let data = {}
      if (row) {
        data = {
          ids: row.id
        }
      } else if (isBatch.length === 0) {
        this.$message({
          message: '请选择要删除的工作流',
          type: 'warning'
        })
        return false
      } else {
        data = {
          ids: isBatch.join()
        }
      }
      this.$confirm('此操作将永久删除该工作流, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        gzbFlow.deleteFlowList(data).then(response => {
          const res = response.data
          if (res.e === '000000') {
            this.$message({
              message: res.m ? res.m : '删除工作流成功！',
              type: 'success'
            })
            if (isBatch.length > 0) {
              isBatch.forEach((id) => {
                this.flowList.splice(this.flowList.findIndex(item => item.id === id), 1)
              })
            } else {
              this.flowList.splice(this.flowList.findIndex(item => item.id === row.id), 1)
            }
            this.total = this.flowList.length
          } else if (res.e === '1000015') {
            this.$message({
              message: res.m ? res.m : '删除工作流失败！',
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
            message: err.m ? err.m : '删除工作流失败！',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      //
    },
    /**
     * 批量删除
     */
    batchDel() {
      this.delFlow(this.selectIds)
    },
    /**
     * 表格多选状态发生变化时候改变
     */
    handleSelectionChange(rows) {
      this.multipleSelection = rows
      // this.select_order_number = this.multipleSelection.length
      this.selectIds = []
      if (rows) {
        this.multipleSelection.map((item) => {
          this.selectIds.push(item.id)
        })
      }
    },
    tableRowClassName(currentData) {
      currentData.row.rowIndex = currentData.rowIndex + 1
    },
    /**
     * 删除步骤
     */
    deletStep(row) {
      console.log(row)
    },
    /**
     * 增加步骤
     */
    addEmptStep() {
      this.detailFlowStep = []
      this.detailFlowStep.push(Object.assign({}, this.getGzb01TFlow))
    },
    /**
     * 点击详情查看班组详情
     */
    addOrEditFlow(addOrEdit, row) {
      // /crm/configCode/queryCode  返回短信，邮件等通知形式
      this.dialogFormVisible = true
      const getGzb01TFlow = [{
        duration: 10, // 等待周期
        flowId: 156,
        flowOrder: 1,
        flowRoleId: 5,
        isApproval: 0, // 是否添加组件 0 是 1 否
        isAttach: 0, // 是否需要审批
        remindId: 'SMS', // SMS 短信， email  email
        sumRoleId: 5, // 班组id
        sumRoleName: '班组组长', // 班组名称
        thirdFunctionId: 'TAX BUREAU', // TAX BUREAU 税务局 POSTAL_BANK 邮储银行
        whereabouts: 0
      }]
      const getFlowDetail = {
        adminId: 0,
        count: 1,
        createTime: '2018-08-21 17:31:26',
        discrible: '添加测试',
        flowName: '添加测试',
        flowStatus: 0,
        flowType: 0,
        id: 156,
        startTime: '2018-08-21 17:31:26'
      }
      if (addOrEdit === 'add') {
        this.detailFlowData = {}
        this.detailFlowStep.push(Object.assign({}, this.getGzb01TFlow))
        const queryList = [
          {}, // 获取班组负责人列表 不需要参数
          {
            configValue: 'NOTICE_TYPE',
            page: 1,
            pageSize: 40
          },
          {
            configValue: 'THIRDPARTY_APP',
            page: 1,
            pageSize: 40
          }]
        gzbFlow.getQueryCode(queryList).then(http.spread((RoleList, noticeType, thirdpartyApp) => {
          this.RoleList = RoleList.data.d
          this.noticeType = noticeType.data.d
          this.thirdpartyApp = thirdpartyApp.data.d
          console.log(this.RoleList)
          console.log(this.noticeType)
          console.log(this.thirdpartyApp)
        }))
      } else if (addOrEdit === 'edit') {
        this.detailFlowData = getFlowDetail
        this.detailFlowStep = getGzb01TFlow
      }
    },
    /**
     * 改变 某工作流启用禁用状态
     */
    changeFlowStatus(row) {
      console.log(row)
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange() {
      this.getFlowList()
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange() {
      this.getFlowList()
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style scoped>
.workFlowCtrl {
  padding: 30px 20px 20px;
}
.search_box {
  height: 60px;
  line-height: 60px;
  padding-left: 30px;
  border-left: 3px solid #409EFF;
  box-shadow: 0px 0px 3px #808080;
  margin-bottom: 20px;
}
.workFlowCtrl >>> .el-form-item__label {
  text-align: center;
  background-color: #f5f7fa;
  color: #909399;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.thumbnail {
  width:80px;
  height: 30px;
}
.add_image_form {
  padding: 50px;
}
.flow_desc >>> .el-form-item__label {
  padding: 0 20px;
  text-align: center;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 20px;
}
</style>
