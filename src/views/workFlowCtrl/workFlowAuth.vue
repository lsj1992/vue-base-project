<template>
  <div class="workFlowAuthCtrl">
    <!-- 顶部添加按钮 -->
    <el-row>
      <el-col :span="24">
        <div class="search_box">
          <el-row>
            <el-col :span="8">
              <el-select
                v-model="teamVal"
                filterable
                @change="searchFlowList"
                placeholder="请选择">
                <el-option
                  v-for="item in teamList"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
            </el-select>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="请输入内容" size='medium' v-model="fuzzyQuery" class="input-with-select">
                <el-button slot="append" @click="fuzzyFlowListQuery" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 工作流列表展示 -->
     <el-table
      :data="flowList"
      :row-class-name="tableRowClassName"
      border
      background
      v-if="showFlowList"
      style="width: 100%">
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
        label="是否启用"
        align="center"
        style="width: 25%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.selfAddIsAvailable"
              active-text="启用"
              inactive-text="禁用"
              disabled
              @click.native="changeFlowStatus(scope.row)"
              >
            </el-switch>
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        style="width: 25%">
        <template slot-scope="scope">
          <el-button @click="detailMsg(scope.row)" type="primary" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showFlowList"
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
      <el-form class="add_image_form" disabled :model="detailFlowData">
        <el-form-item>
          <el-input name="configName" style="width: 40%; margin-right: 25px;" v-model="detailFlowData.flowName">
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
          <!-- 步骤 -->
          <el-table
            :data="detailFlowStep"
            :row-class-name="tableStepAddIndex"
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
  name: 'workFlowAuthCtrl',
  data() {
    return {
      teamVal: '', // 选择的班组
      teamList: [], // 分组列表【select下拉框中的值】
      fuzzyQuery: '', // 模糊查询
      flowList: [], // 查询出的工作流 列表
      showFlowList: false, // 用来控制当前班组下工作流列表的显示隐藏
      currentPage: 1,
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: 10,
      total: 0,
      dialogTit: '工作流详情', // 弹窗的标题
      fullscreen: false, // 弹窗的全屏控制
      dialogFormVisible: false, // 弹窗的展示隐藏
      detailFlowData: {}, // 工作流详情
      detailFlowStep: [], // 工作流详情 步骤
      RoleList: [], // 审批角色
      noticeType: [], // 通知形式
      thirdpartyApp: [], // 第三方程序
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
  },
  created() {
    this.getGroupList()
  },
  methods: {
    /**
     * 获取班组分类
     */
    getGroupList() {
      gzbFlow.getGroupList().then(response => {
        const res = response.data
        if (res.e === '000000') {
          this.teamList = res.d
          console.log(this.teamList)
        }
      })
    },
    fuzzyFlowListQuery() {
      this.searchFlowList()
    },
    /**
     * 查询班组列表
     */
    searchFlowList() {
      // pageSize: 条数
      // page: 页数
      // allotId: 分配的id
      // allotType: 分配的类型 0->班组 1->企业 2->项目
      const data = {
        pageSize: this.pageSize,
        page: this.currentPage,
        allotId: this.teamVal,
        allotType: 0,
        flowName: this.fuzzyQuery
      }
      gzbFlow.getQuery(data).then(response => {
        const res = response.data
        if (res.code === '000000') {
          this.flowList = res.data
          this.flowList.map(item => {
            item.selfAddIsAvailable = item.isAvailable === 0
          })
          this.showFlowList = true
          this.total = res.count
        }
      })
    },
    /**
     * 点击详情查看班组详情
     */
    detailMsg(row) {
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
        },
        {
          id: row.flowId
        }]
      gzbFlow.getAllFlowDetail(queryList).then(http.spread((RoleList, noticeType, thirdpartyApp, flowDetail) => {
        this.$set(this, 'RoleList', RoleList.data.d)
        this.$set(this, 'noticeType', noticeType.data.d)
        this.detailFlowData = flowDetail.data.d.getGzb01TFlow
        this.detailFlowStep = flowDetail.data.d.getFlowDetail
        this.$set(this, 'thirdpartyApp', thirdpartyApp.data.d)
      }))
    },
    /**
     * 改变当前 班组下 某 工作流启用禁用状态
     */
    changeFlowStatus(row) {
      // console.log(row)
      // this.$set(this.flowList[row.rowIndex], 'selfAddIsAvailable', row.selfAddIsAvailable)
      // this.flowList[row.rowIndex].selfAddIsAvailable = row.selfAddIsAvailable
      // this.flowList[row.rowIndex].isAvailable = row.selfAddIsAvailable ? 0 : 1
      const data = {
        allotId: row.allotId, // 班组id
        allotType: row.allotType, // 分类匹配 0 班组 1 企业 2 项目
        flowId: row.flowId, // 工作流id
        isAvailable: !row.selfAddIsAvailable ? 0 : 1 // 启用禁用状态
      }
      gzbFlow.updateStatus(data).then(response => {
        const res = response.data
        if (res.code === '000000') {
          this.$message({
            message: res.m ? res.m : '修改工作流状态成功',
            type: 'success'
          })
          this.$set(this.flowList[row.rowIndex], 'selfAddIsAvailable', !row.selfAddIsAvailable)
          this.flowList[row.rowIndex].isAvailable = !row.selfAddIsAvailable ? 0 : 1
        } else {
          this.$message({
            message: res.m ? res.m : '修改工作流状态失败',
            type: 'warning'
          })
          this.flowList[row.rowIndex].isAvailable = row.selfAddIsAvailable ? 0 : 1
          this.flowList[row.rowIndex].selfAddIsAvailable = row.selfAddIsAvailable
        }
      })
    },
    /**
     * 给table加上rowIndex
     */
    tableRowClassName(currentData) {
      currentData.row.rowIndex = currentData.rowIndex
    },
    /**
     * 给步骤的 table加上rowIndex
     */
    tableStepAddIndex(currentData) {
      currentData.row.rowIndex = currentData.rowIndex + 1
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      console.log(`当前页 跳转: ${val}`)
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style scoped>
.workFlowAuthCtrl {
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
.workFlowAuthCtrl >>> .el-form-item__label {
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
  padding: 0 50px 50px;
}
.flow_desc >>> .el-form-item__label {
  padding: 0 20px;
  text-align: center;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 20px;
}
</style>
