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
      :isDialog="false"
      :imagesTableList="imagesTableList"
      :total="total"
      :currentPage="currentPage"
      :pageSizes="pageSizes"
      :pageSize="pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @deleteBanner="deleteBanner"
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
              :isDialog = true
              :total="dialogTotal"
              :currentPage="dialogCurrentPage"
              :pageSizes="dialogPageSizes"
              :pageSize="dialogPageSize"
              :showRadio="dialogShowRadio"
              :showOperation="showOperation"
              ref="showBanner"
              :imagesTableList="dialogImagesTableList"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              @editBannerRow="editBannerRow">
              </banner-list>
            <el-input v-else v-model="detailBannerData.bannerUrl" :disabled="disabled"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            placeholder="请输banner描述"
            v-model="detailBannerData.bannerDesc"
            :autosize="{ minRows: 3,maxRows:5}"
            resize="none"
            maxlength="200"
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
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    bannerList
  },
  name: 'bannerCtrl',
  data() {
    return {
      imagesTableList: [],
      total: 0,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      currentPage: 1,
      dialogImagesTableList: [], // 弹窗
      dialogTotal: 0,
      dialogPageSize: 10,
      dialogPageSizes: [10, 20, 30, 40, 50],
      dialogCurrentPage: 1,
      detailBannerData: {
        bannerPicId: undefined,
        bannerType: undefined,
        bannerIndex: undefined,
        bannerDesc: '',
        bannerUrl: ''
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
      isAddBanner: false, // 用来控制 弹窗中 bannerlist 是否显示 同时用来判断 弹窗的区分按钮请求的方法
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
    ...mapMutations('banner', [
      'SET_SELECTED_BANNER'
    ]),
    /**
     * 获取banner列表
     */
    getBannerList(isDilog) {
      const data = {
        page: isDilog ? this.dialogCurrentPage : this.currentPage,
        pageSize: isDilog ? this.dialogPageSize : this.pageSize
      }
      if (isDilog) {
        bannerApi.showEnabledPicture(data).then((response) => {
          const res = response.data
          if (res.code === '000000') {
            this.dialogImagesTableList = res.data
            this.dialogTotal = res.count
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
      } else {
        bannerApi.getBannerList(data).then((response) => {
          const res = response.data
          if (res.code === '000000') {
            this.imagesTableList = res.data
            this.total = res.count
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
      }
    },
    /**
     * 点击添加按钮弹出添加banner对话框
     */
    addBanner() {
      this.getBannerList(true)
      this.showDialogImgList = true
      this.dialogFormVisible = true
      this.showStatus = false
      this.isAddBanner = true
      this.detailBannerData = {
        bannerPicId: undefined,
        bannerType: undefined,
        bannerIndex: undefined,
        bannerDesc: '',
        bannerUrl: ''
      }
      this.SET_SELECTED_BANNER(undefined)
      this.$nextTick().then(() => {
        this.$refs.showBanner.changeRadioStatus('')
      })
      this.dialogTit = '添加轮播图'
    },
    /**
     * 确认按钮 确认添加banner
     */
    shureAddBanner() {
      if (this.isAddBanner) {
        let index = null
        let msg = ''
        let flag = true
        const bannerData = this.detailBannerData
        for (const key in bannerData) {
          if (bannerData[key] === undefined || bannerData[key] === '') {
            if (key === 'bannerIndex') {
              msg = '轮播序号必填！'
              flag = false
            } else if (key === 'bannerType') {
              msg = '轮播类型必填！'
              flag = false
            } else if (key === 'bannerDesc') {
              msg = '轮播描述必填！'
              flag = false
            }
            if (!flag) {
              this.$message({
                message: msg,
                type: 'warning'
              })
              return false
            }
          }
        }
        if (this.getSelectedBanner) {
          index = this.dialogImagesTableList.findIndex(item => item.id === this.getSelectedBanner)
        } else {
          this.$message({
            message: '图片必须选择',
            type: 'warning'
          })
          return false
        }
        const data = {
          bannerPicId: this.getSelectedBanner,
          bannerIndex: bannerData.bannerIndex,
          bannerDesc: bannerData.bannerDesc,
          bannerType: bannerData.bannerType,
          bannerUrl: this.dialogImagesTableList[index].picUrl
        }
        bannerApi.insertBanner(data).then((response) => {
          const res = response.data
          if (res.e === '000000') {
            this.$message({
              message: res.m ? res.m : '添加banner成功',
              type: 'success'
            })
            this.SET_SELECTED_BANNER(undefined)
            this.dialogFormVisible = false
            this.getBannerList(false)
          }
        })
      } else {
        const data = {
          id: this.detailBannerData.id,
          bannerPicId: this.detailBannerData.bannerPicId,
          bannerIndex: this.detailBannerData.bannerIndex,
          bannerDesc: this.detailBannerData.bannerDesc,
          bannerType: this.detailBannerData.bannerType,
          bannerUrl: this.detailBannerData.bannerUrl
        }
        bannerApi.updateBanner(data).then((response) => {
          const res = response.data
          if (res.e === '000000') {
            this.$message({
              message: res.m ? res.m : '更改banner内容成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getBannerList(false)
          }
        })
      }
    },
    /**
     * 点击编辑修改当前banner信息
     */
    editBannerRow(row) {
      this.dialogFormVisible = true
      this.showStatus = true
      this.dialogTit = '编辑轮播图'
      this.isAddBanner = false
      const data = {
        bannerId: row.id
      }
      bannerApi.showBannerById(data).then((response) => {
        const res = response.data
        if (res.e === '000000') {
          this.detailBannerData = res.d
          this.detailBannerData.bannerType = this.detailBannerData.bannerType.toString()
          this.showDialogImgList = false
          console.log(this.detailBannerData.bannerPicId)
        }
      })
    },
    /**
     * 点击编辑修改当前banner信息
     */
    deleteBanner(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bannerApi.deleteBanner({ id: row.id }).then((response) => {
          const res = response.data
          if (res.e === '000000') {
            this.imagesTableList.splice(this.imagesTableList.findIndex(item => item.id === row.id), 1)
            this.total--
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      if (this.dialogFormVisible) {
        this.dialogPageSize = val
      } else {
        this.pageSize = val
      }
      this.getBannerList(false)
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      if (this.dialogFormVisible) {
        this.dialogCurrentPage = val
      } else {
        this.currentPage = val
      }
      this.getBannerList(true)
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
