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
    <banner-list ref="showBanner" :imagesTableList="imagesTableList" :total="total" @editBannerRow="editBannerRow"></banner-list>
    <!-- 弹出窗口，添加和修改banner详细信息 -->
    <el-dialog class="add_code_table" :title="dialogTit" :fullscreen="fullscreen" :visible.sync="dialogFormVisible">
      <!-- 增加表单验证  -->
      <el-form class="add_code_form" label-position="cener"  label-width="100px" :rules="validateBanner" :model="detailBannerData">
        <el-form-item prop="configName" label="轮播图片id" v-show="showStatus">
          <el-input  name="configName" v-model="detailBannerData.bannerPicId" :disabled="disabled">
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
        <el-form-item label="">
          <template>
            <banner-list :showRadio="showRadio" ref="editOrAddBanner" :imagesTableList="imagesTableList" :total="total" @editBannerRow="editBannerRow"></banner-list>
          </template>
        </el-form-item>
        <el-form-item label="描述">
          <el-input placeholder="请输banner描述" v-model="detailBannerData.bannerDesc" :disabled="disabled">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 列表 底部 开始-->
      <div slot="footer" class="dialog_footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
      <!-- 列表 底部 开始-->
    </el-dialog>
  </div>
</template>
<script>
import { getBannerList, showBannerById } from '@/api/gzb_banner'
import bannerList from './component/bannerList'
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
      detailBannerData: {}, // banner 的详细信息
      dialogFormVisible: false, // 弹窗的展示隐藏
      disabled: false, // input 是否可用
      dialogTit: '添加轮播图', // 用来显示弹窗标题
      fullscreen: true, // 用来控制弹窗全屏
      validateBanner: {}, // 用来做表单验证
      showStatus: true, // 用来控制，bannerid表单是否显示
      showRadio: true // 用来控制bannerlist中单选框的显示隐藏
    }
  },
  filters: {},
  computed: {

  },
  created() {
    this.getBannerList()
  },
  methods: {
    /**
     * 获取banner列表
     */
    getBannerList() {
      const _this = this
      getBannerList().then(function(response) {
        const res = response.data
        if (res.code === '000000') {
          _this.imagesTableList = res.data
          _this.total = res.count
        }
      })
    },
    /**
     * 点击添加按钮添加banner
     */
    addBanner() {

    },
    /**
     * 点击编辑修改当前banner信息
     */
    editBannerRow(row) {
      const _this = this
      console.log('编辑')
      _this.dialogFormVisible = true
      _this.dialogTit = '编辑轮播图'
      showBannerById().then(function(response) {
        const res = response.data
        if (res.code === '000000') {
          _this.detailBannerData = res.data
          console.log(res)
        }
        console.log(response.data)
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

</style>
