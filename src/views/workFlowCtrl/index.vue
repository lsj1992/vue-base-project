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
            {{scope.row.flowStatus === 0 ? '启用' : '禁用'}}
            <!-- <el-switch
              v-model="scope.row.flowStatus"
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
          <el-input name="configName" style="width: 40%; margin-right: 25px;" v-model="detailFlowData.flowName">
            <template slot="prepend">工作流名称</template>
          </el-input>
           <el-switch
              v-model="detailFlowData.flowStatus"
              active-text="启用"
              inactive-text="禁用"
              @change="changeFlowStatus"
              >
            </el-switch>
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
              <el-select v-model="scope.row.flowRoleId" placeholder="请选择">
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
              <el-select v-model="scope.row.remindId" placeholder="请选择">
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
              <el-select v-model="scope.row.thirdFunctionId" placeholder="请选择">
              <el-option
                v-for="item in thirdpartyApp"
                :key="item.codeValue"
                :label="item.codeName"
                :value="item.codeValue">
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
             <el-button @click="deletStep(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>
      </el-form>
      <!-- 列表 底部 开始-->
      <div slot="footer" class="dialog_footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCodeTable">确 定</el-button>
      </div>
      <!-- 列表 底部 结束-->
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
        flowRoleId: '0',
        isApproval: 0, // 是否添加组件 0 是 1 否
        isAttach: 0, // 是否需要审批
        remindId: '', // SMS 短信， email  email
        sumRoleId: '', // 班组id
        sumRoleName: '', // 班组名称
        thirdFunctionId: '', // TAX BUREAU 税务局 POSTAL_BANK 邮储银行
        isSelfAdd: true // 用来区分是自己添加的还是服务端获取的
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
  },
  computed: {
    flowStatus: {
      get() {
        return this.detailFlowData.flowStatus === 0
      },
      set(val) {
        this.detailFlowData.flowStatus = val === true ? 0 : 1
        console.log(this.detailFlowData.flowStatus)
      }
    }
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
     * 添加工作流验证
     */
    addFlowValidate() {
      console.log(this.detailFlowData)
      console.log(this.detailFlowStep)
      return false
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
                this.total--
              })
            } else {
              this.flowList.splice(this.flowList.findIndex(item => item.id === row.id), 1)
              this.total--
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
    /**
     * 给table加上rowIndex
     */
    tableRowClassName(currentData) {
      currentData.row.rowIndex = currentData.rowIndex + 1
    },
    /**
     * 删除步骤
     */
    deletStep(row) {
      if (this.detailFlowStep.length <= 1) {
        this.$message({
          type: 'warning',
          message: '至少保留一个步骤'
        })
        return false
      }
      this.$confirm('此操作将删除该步骤, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里只是从页面上删除了改步骤，要想真正修改改步骤，需要点击页面下面的弹窗
        this.detailFlowStep.splice(this.detailFlowStep.findIndex(item => item.id === row.rowIndex - 1), 1)
      })
    },
    /**
     * 增加步骤
     */
    addEmptStep() {
      this.detailFlowStep.push(Object.assign({}, this.getGzb01TFlow))
    },
    /**
     * 点击详情查看班组详情
     */
    addOrEditFlow(addOrEdit, row) {
      // /crm/configCode/queryCode  返回短信，邮件等通知形式
      this.dialogFormVisible = true
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
      if (addOrEdit === 'add') {
        this.detailFlowData = {
          flowStatus: '',
          flowName: '',
          discrible: ''
        }
        this.detailFlowStep = []
        this.detailFlowStep.push(Object.assign({}, this.getGzb01TFlow))
        gzbFlow.getQueryCode(queryList).then(http.spread((RoleList, noticeType, thirdpartyApp) => {
          this.$set(this, 'RoleList', RoleList.data.d)
          this.$set(this, 'noticeType', noticeType.data.d)
          this.$set(this, 'thirdpartyApp', thirdpartyApp.data.d)
        }))
      } else if (addOrEdit === 'edit') {
        queryList.push({ id: row.id })
        console.log('edit')
        gzbFlow.getAllFlowDetail(queryList).then(http.spread((RoleList, noticeType, thirdpartyApp, flowDetail) => {
          this.RoleList = RoleList.data.d
          this.$set(this, 'noticeType', noticeType.data.d)
          this.detailFlowData = flowDetail.data.d.getGzb01TFlow
          this.detailFlowStep = flowDetail.data.d.getFlowDetail
          console.log(this.detailFlowData)
          console.log(this.detailFlowStep)
          this.detailFlowData.flowStatus = this.detailFlowData.flowStatus === 0
          this.detailFlowStep.forEach(item => {
            item.sumRoleId = item.sumRoleId.toString()
          })
          this.$set(this, 'thirdpartyApp', thirdpartyApp.data.d)
        }))
      }
    },
    /**
     * 点击确定 添加或者修改工作流
     */
    addOrEditCodeTable() {
      const stepDatas = []
      let stepData = {}
      this.detailFlowStep.forEach(item => {
        stepData = {
          'flowOrder': item.rowIndex - 1,
          'flowRoleId': item.flowRoleId.toString(),
          'remindId': item.remindId,
          'duration': item.duration,
          'thirdFunctionId': item.thirdFunctionId,
          'whereabouts': item.whereabouts,
          'isApproval': item.isApproval,
          'isAttach': item.isAttach
        }
      })
      stepDatas.push(stepData)
      const submitData = {
        id: this.detailFlowData.id ? this.detailFlowData.id : 0, // id 的默认值
        flowName: this.detailFlowData.flowName,
        discrible: this.detailFlowData.discrible,
        flowStatus: this.detailFlowData.flowStatus ? 0 : 1, // 状态的默认值
        gzb01TFlowDetailListStr: JSON.stringify(stepDatas)
      }
      // const result = this.addFlowValidate()
      // if (!result) {
      //   return false
      // }
      gzbFlow.updateFlowDetailList(submitData).then((response) => {
        console.log(response)
        const res = response.data
        if (res.e === '000000') {
          this.$message({
            message: res.m ? res.m : '工作流修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          // 这里找到 工作流列表中对应的行，将值改变为修改后的状态
          const index = this.flowList.findIndex(item => item.id === submitData.id)
          if (index !== -1) {
            this.flowList[index].flowName = submitData.flowName
            this.flowList[index].discrible = submitData.discrible
            this.flowList[index].flowStatus = submitData.flowStatus
            this.flowList[index].count = stepDatas.length
          }
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '工作流修改失败',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        } else {
          this.$message({
            message: res.m ? res.m : '工作流修改失败',
            type: 'warning'
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.m ? err.m : '工作流修改失败',
          type: 'error'
        })
      })
      // console.log(submitData)
    },
    /**
     * 改变 某工作流启用禁用状态, 由于v-model无法使用过滤器，则通过computed实现
     */
    changeFlowStatus(val) {
      console.log(val)
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.showPicture()
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.showPicture()
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
.dialog_footer {
  text-align: center;
}
</style>
