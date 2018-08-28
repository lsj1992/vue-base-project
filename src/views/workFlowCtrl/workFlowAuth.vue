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
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 工作流列表展示 -->
     <el-table
      :data="flowList"
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
              v-model="scope.row.isAvailable"
              active-text="启用"
              inactive-text="禁用"
              @change="changeFlowStatus(scope.row)"
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
      class="add_code_table"
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
          <el-table
          :data="detailFlowStep"
          border
          background
          style="width: 100%">
          <el-table-column
            prop="sumRoleName"
            label="步骤"
            align="center"
            style="width: 25%">
          </el-table-column>
          <el-table-column
            prop="sumRoleName"
            label="审批角色"
            align="center"
            style="width: 25%">
          </el-table-column>
          <el-table-column
            label="通知形式"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              {{scope.row.remindId === 'SMS' ? '短信': '邮箱'}}
            </template>
          </el-table-column>
          <el-table-column
            label="等待周期"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              {{scope.row.duration + '分钟'}}
            </template>
          </el-table-column>
          <el-table-column
            label="第三方程序"
            align="center"
            style="width: 25%">
             <template slot-scope="scope">
              <!-- TAX BUREAU 税务局 -->
              <!-- POSTAL_BANK 邮储银行 -->
              {{scope.row.remindId === 'TAX BUREAU' ? '税务局': '邮储银行'}}
            </template>
          </el-table-column>
          <el-table-column
            label="中止回滚节点"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              <!-- 0 通知给创建者 -->
              <!-- 1 通知给上一级 -->
              <!-- 2 给上面所有人通知 -->
              {{scope.row.whereabouts | whereabouts}}
            </template>
          </el-table-column>
          <el-table-column
            label="是否需要审批"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              <!-- 0 是 -->
              <!-- 1 否 -->
              {{scope.row.isAttach === 0 ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column
            label="是否添加附件"
            align="center"
            style="width: 25%">
            <template slot-scope="scope">
              <!-- 0 是 -->
              <!-- 1 否 -->
              {{scope.row.isApproval === 0 ? '是' : '否'}}
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
      detailFlowStep: [] // 工作流详情 步骤
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
    this.getGroupList()
  },
  methods: {
    /**
     * 获取班组分类
     */
    getGroupList() {
      const _this = this
      gzbFlow.getGroupList().then(response => {
        const res = response.data
        if (res.code === '000000') {
          _this.teamList = res.data
        }
      })
      // {"d":[{"id":217,"groupNo":null,"groupName":"你","vocationId":null,"groupDesc":null,"groupImg":null,"createUserId":null,"createTime":null,"groupStatus":null,"starLevel":null,"districtId":null,"totalMember":null}],"e":"000000","m":"成功"}
    },
    /**
     * 查询班组列表
     */
    searchFlowList() {
      // {"msg":"成功","code":"000000","data":[{"id":null,"flowId":152,"flowName":"测试一","discrible":"测试一","allotId":null,"allotType":null,"isAvailable":null,"pageSize":null,"page":null,"start":null,"end":null}],"count":7}
      // pageSize: 条数
      // page: 页数
      // allotId: 分配的id
      // allotType: 分配的类型 0->班组 1->企业 2->项目
      const data = {
        pageSize: this.pageSize,
        page: this.currentPage,
        allotId: this.teamVal,
        allotType: 0
      }
      gzbFlow.getQuery(data).then(response => {
        const res = response.data
        if (res.code === '000000') {
          this.flowList = res.data
          this.showFlowList = true
          this.total = res.count
        }
      })
    },
    /**
     * 点击详情查看班组详情
     */
    detailMsg(row) {
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
      this.detailFlowStep = getGzb01TFlow
      this.detailFlowData = getFlowDetail
    },
    /**
     * 改变当前 班组下 某 工作流启用禁用状态
     */
    changeFlowStatus(row) {
      console.log(row)
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
