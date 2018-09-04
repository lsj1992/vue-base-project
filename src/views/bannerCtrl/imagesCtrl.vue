<template>
  <div class="imgCtrl">
    <!-- 顶部添加按钮 -->
    <el-row>
      <el-col :span="24">
        <div class="search_box">
          <el-button type="primary" @click="addImage" plain>添加</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 图片 列表 -->
    <el-table
      :data="imagesTableList"
      border
      style="width: 100%">
      <el-table-column
        label="图片id"
        align="center"
        style="width: 20%;">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        align="center"
        style="width: 20%;">
        <template slot-scope="scope">
          <img class="thumbnail" :src="imgBaseUrl + scope.row.picUrl" preview="0" :preview-text="scope.row.bannerDesc" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="picDesc"
        label="描述"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        prop="picUrl"
        label="链接"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        style="width: 35%">
        <template slot-scope="scope">
         <el-switch
          v-model="scope.row.picStatus"
          active-text="启用"
          inactive-text="禁用"
          @change="changePicStatus(scope.row)"
          >
        </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 图片列表的分页 -->
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
    <!-- 弹出窗口，添加和修改banner详细信息 -->
    <el-dialog 
      class="add_code_table"
      :title="dialogTit"
      :fullscreen="fullscreen"
      width="60%"
      :visible.sync="dialogFormVisible">
      <!-- 增加表单验证  -->
      <el-form class="add_image_form" :model="uploadData">
        <el-form-item>
          <el-upload
            class="upload-demo"
            :data="uploadData"
            ref="uploadImgForm"
            :action="uploadUrl"
            :on-change="handChange"
            :file-list="imagesList"
            :auto-upload="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            name="picture"
            list-type="picture">
            <el-button slot="trigger" @click="emptyImagesList" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input 
            placeholder="请输图片描述"
            v-model="uploadData.picDesc"
            type="textarea"
            :autosize="{ minRows: 3,maxRows:5}"
            resize="none"
            maxlength="200">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 列表 底部 开始-->
      <div slot="footer" class="dialog_footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button  @click="submitUpload" type="primary">确 定</el-button>
      </div>
      <!-- 列表 底部 开始-->
    </el-dialog>
  </div>
</template>
<script>
import * as bannerApi from '@/api/gzb_banner'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  name: 'imgCtrl',
  data() {
    return {
      imagesTableList: [],
      total: 0,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      currentPage: 1,
      uploadUrl: '/crm/bannerPic/insertPicture',
      // fileUrl: process.env.files_href,
      imgBaseUrl: process.env.files_href,
      uploadData: {
        filename: '',
        token: '',
        picDesc: ''
      }, // 图片 的详细信息
      dialogFormVisible: false, // 弹窗的展示隐藏
      dialogTit: '添加图片', // 用来显示弹窗标题
      fullscreen: true, // 用来控制弹窗全屏
      imagesList: [] // 上传图片列表
    }
  },
  filters: {},
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.showPicture()
  },
  methods: {
    /**
     * 上传到服务器
     */
    submitUpload() {
      this.uploadData.token = this.token
      // this.uploadData.name = this.token
      this.$refs.uploadImgForm.submit()
    },
    /**
     * 当选择的图片改变时候触发
     */
    handChange(file) {
      // console.log(file)
    },
    /**
     * 上传成功时调用
     *  ⭐⭐⭐⭐⭐注意上传成功和上传失败，返回的对象结构不同，
     */
    uploadSuccess(res) {
      if (res.code === '000000') {
        this.imagesTableList = res.data
        this.imagesTableList.forEach(item => {
          item.picStatus = item.picStatus === 0
          console.log(item.picStatus)
        })
        this.total = res.count
        this.dialogFormVisible = false
      } else if (res.e === '1000015') {
        this.$message({
          message: res.m ? res.m : '上传图片图片失败！',
          type: 'warning'
        })
        this.$nextTick().then(() => {
          this.$store.dispatch('FedLogOut').then(() => {
            this.$router.push({ path: '/login' })
          })
        })
      } else {
        this.$message({
          message: res.m ? res.m : '上传图片图片失败！',
          type: 'warning'
        })
      }
    },
    /**
     * 上传失败时调用
     */
    uploadError(err) {
      this.$message({
        message: err.m ? err.m : '上传图片图片失败！',
        type: 'warning'
      })
    },
    /**
     * 点击选择文件时候
     */
    emptyImagesList() {
      this.imagesList = []
    },
    /**
     * 展示添加图片列表
     */
    addImage() {
      const _this = this
      _this.dialogFormVisible = true
      _this.fullscreen = false
      _this.imagesList = []
      _this.uploadData.picDesc = ''
    },
    /**
     * 获取图片列表
     */
    showPicture() {
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      bannerApi.showPicture(data).then((response) => {
        const res = response.data
        if (res.code === '000000') {
          this.imagesTableList = res.data
          this.imagesTableList.forEach(item => {
            item.picStatus = item.picStatus === 0
            console.log(item.picStatus)
          })
          this.total = res.count
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '获取图片列表失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        } else {
          this.$message({
            message: res.m ? res.m : '获取图片列表失败！',
            type: 'warning'
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.m ? err.m : '获取图片列表失败！',
          type: 'error'
        })
      })
    },
    /**
     * 启用禁用图片
     */
    changePicStatus(row) {
      const data = {
        id: row.id,
        picStatus: row.picStatus ? 0 : 1
      }
      bannerApi.updatePicture(data).then((response) => {
        const res = response.data
        console.log(res)
        if (res.code === '000000') {
          this.$message({
            message: res.m ? res.m : '更新图片专题成功！',
            type: 'success'
          })
        } else if (res.e === '1000015') {
          this.$message({
            message: res.m ? res.m : '更新图片专题失败！',
            type: 'warning'
          })
          this.$nextTick().then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
          })
        } else {
          this.$message({
            message: res.m ? res.m : '更新图片专题失败！',
            type: 'warning'
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.m ? err.m : '更新图片专题失败！',
          type: 'error'
        })
      })
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

<style rel="stylesheet/scss" lang="scss" scoped>
.imgCtrl {
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
.imgCtrl >>> .el-form-item__label {
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
</style>
