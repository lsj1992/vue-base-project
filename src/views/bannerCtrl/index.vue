<template>
  <div class="bannerCtrl">
    <!-- 顶部添加按钮 -->
    <el-row>
      <el-col :span="24">
        <div class="search_box">
          <el-button type="primary" @click="addBanner()" plain>添加</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- banner 列表组件 -->
    <banner-list
      :showRadio="showRadio"
      ref="showBanner"
      :imagesTableList="imagesTableList"
      :total="total"
      :currentPage="currentPage"
      :pageSizes="pageSizes"
      :pageSize="pageSize"
      @editBannerRow="editBannerRow">
    </banner-list>
    <!-- 弹出窗口，添加和修改banner详细信息 -->
    <el-dialog class="add_code_table" :title="dialogTit" :fullscreen="fullscreen" :visible.sync="dialogFormVisible">
      <!-- 增加表单验证  -->
      <el-form class="add_code_form" label-position="cener"  label-width="100px" :rules="validateBanner" :model="detailBannerData">
        <el-form-item prop="configName" label="轮播图片id" v-if="showStatus">
          <el-input  name="configName" v-model="detailBannerData.bannerPicId" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="detailBannerData.bannerType" :disabled="disabled" placeholder="请选择">
            <el-option label="主页" value="1"></el-option>
            <el-option label="保险" value="2"></el-option>
            <el-option label="金融" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="configValue">
          <el-select name="configValue" v-model="detailBannerData.bannerIndex" :disabled="disabled" placeholder="请选择">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可用banner">
          <template>
            <banner-list
              v-if="showDialogImgList"
              :total="dialogTotal"
              :currentPage="dialogCurrentPage"
              :pageSizes="dialogPageSizes"
              :pageSize="dialogPageSize"
              :showRadio="dialogShowRadio"
              :showOperation="showOperation"
              ref="showBanner"
              :imagesTableList="dialogImagesTableList"
              @editBannerRow="editBannerRow">
              </banner-list>
            <el-input v-else v-model="detailBannerData.bannerUrl" :disabled="disabled"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            placeholder="请输banner描述"
            v-model="detailBannerData.bannerDesc"
            type="textarea"
            :autosize="{minRows:3}"
            :disabled="disabled">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 列表 底部 开始-->
      <div slot="footer" class="dialog_footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="shureAddBanner" type="primary">确 定</el-button>
      </div>
      <!-- 列表 底部 开始-->
    </el-dialog>
  </div>
</template>
<script>
import * as bannerApi from '@/api/gzb_banner'
import bannerList from './component/bannerList'
import { mapGetters } from 'vuex'
export default {
  components: {
    bannerList
  },
  name: 'bannerCtrl',
  data() {
    return {
      imagesTableList: [],
      total: 0,
      pageSize: 10, // 可有可无，可通过props传递到子组件
      pageSizes: [10, 20, 30, 40, 50], // 可有可无，可通过props传递到子组件
      currentPage: 1, // 可有可无，可通过props传递到子组件
      dialogImagesTableList: [],
      dialogTotal: 0,
      dialogPageSize: 10, // 可有可无，可通过props传递到子组件
      dialogPageSizes: [10, 20, 30, 40, 50], // 可有可无，可通过props传递到子组件
      dialogCurrentPage: 1, // 可有可无，可通过props传递到子组件
      detailBannerData: {
        bannerPicId: undefined,
        bannerType: undefined,
        bannerIndex: undefined,
        bannerDesc: ''
      }, // banner 的详细信息
      dialogFormVisible: false, // 弹窗的展示隐藏
      disabled: false, // input 是否可用
      dialogTit: '添加轮播图', // 用来显示弹窗标题
      fullscreen: true, // 用来控制弹窗全屏
      validateBanner: {}, // 用来做表单验证
      showStatus: true, // 用来控制，bannerid表单是否显示
      dialogShowRadio: true, // 用来控制弹窗中的bannerlist中单选框的显示隐藏
      showRadio: false, // 用来控制bannerlist中单选框的显示隐藏
      showOperation: false, // 用来控制 弹窗中 bannerlist中 操作列 的显示隐藏
      isAddBanner: false, // 用来控制 弹窗中 bannerlist 是否显示
      showDialogImgList: false // 用来控制弹窗中，图片列表是否显示
    }
  },
  filters: {},
  computed: {
    ...mapGetters('banner', ['getSelectedBanner'])
  },
  created() {
    this.getBannerList(false)
  },
  methods: {
    /**
     * 获取banner列表
     */
    getBannerList(isDilog) {
      const data = {
        page: isDilog ? this.dialogCurrentPage : this.currentPage,
        pageSize: isDilog ? this.dialogPageSize : this.pageSize
      }
      bannerApi.getBannerList(data).then((response) => {
        const res = response.data
        if (res.code === '000000') {
          if (isDilog) {
            this.dialogImagesTableList = res.data
            this.dialogTotal = res.count
          } else {
            this.imagesTableList = res.data
            this.total = res.count
          }
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取轮播列表失败！',
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
          message: err.m ? err.m : '获取轮播列表失败！',
          type: 'error'
        })
      })
    },
    /**
     * 点击添加按钮弹出添加banner对话框
     */
    addBanner() {
      this.getBannerList(true)
      this.showDialogImgList = true
      this.dialogFormVisible = true
      this.showStatus = false
      this.dialogTit = '添加轮播图'
    },
    /**
     * 确认按钮 确认添加banner
     */
    shureAddBanner() {
      // this.dialogImagesTableList.findIndex(item => item.id === this.getSelectedBanner)
      const index = this.dialogImagesTableList.findIndex(item => item.id === this.getSelectedBanner)
      const data = {
        bannerPicId: this.getSelectedBanner,
        bannerIndex: this.detailBannerData.bannerIndex,
        bannerDesc: this.detailBannerData.bannerDesc,
        bannerType: this.detailBannerData.bannerType,
        bannerUrl: this.dialogImagesTableList[index].bannerUrl
      }
      for (const index in data) {
        if (data[index] === undefined || data[index] === '') {
          this.$message({
            message: '必填项不能为空',
            type: 'warning'
          })
          return false
        }
      }
      bannerApi.insertBanner(data).then(function(response) {
        const res = response.data
        console.log(res)
        if (res.e === '000000') {
          this.$message({
            message: res.m ? res.m : '添加banner成功',
            type: 'success'
          })
          // _this.dialogImagesTableList = res.d.bannerList
          // _this.detailBannerData = {}
          console.log(res.d)
        }
      })
    },
    /**
     * 点击编辑修改当前banner信息
     */
    editBannerRow(row) {
      this.dialogFormVisible = true
      this.showStatus = true
      this.dialogTit = '编辑轮播图'
      const data = {
        bannerId: row.id
      }
      bannerApi.showBannerById(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.detailBannerData = res.d
          this.showDialogImgList = false
        }
      })
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getConfigCodeList()
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      this.getConfigCodeList()
      console.log(`当前页 跳转: ${val}`)
    }
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.bannerCtrl {
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
.bannerCtrl >>> .el-form-item__label {
  text-align: center;
  background-color: #f5f7fa;
  color: #909399;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.dialog_footer {
  text-align: center;
}

</style>
