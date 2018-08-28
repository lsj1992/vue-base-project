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
          <img class="thumbnail" :src="scope.row.picImg" preview="0" :preview-text="scope.row.bannerDesc" alt="">
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
            :on-preview="handlePreview"
            :on-change="handChange"
            :file-list="imagesList"
            :auto-upload="false"
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
            :autosize="{ minRows: 5}">
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
      uploadUrl: process.env.UPLOAD_API,
      uploadData: {
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

  },
  created() {
    this.showPicture()
  },
  methods: {
    /**
     * 上传到服务器
     */
    submitUpload() {
      this.$refs.uploadImgForm.submit()
    },
    /**
     * 点击当前加载的图片时候调用
     */
    handChange(file) {
      console.log(file)
      console.log(this.imagesList)
      // this.uploadImg.imagesList.slice(-1)
    },
    /**
     * 点击当前加载的图片时候调用
     */
    emptyImagesList() {
      this.imagesList = []
    },
    /**
     * 点击当前加载的图片时候调用
     */
    handlePreview(file) {
      console.log(file)
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
      const _this = this
      bannerApi.showPicture().then(function(response) {
        const res = response.data
        _this.imagesTableList = res.data
        _this.total = res.count
        // _this.imagesTableList.map((item, index, self) => {
        //   console.log('index' + index)
        //   console.log(item.picStatus)
        // })
      })
    },
    /**
     * 启用禁用图片
     */
    changePicStatus(row) {
      console.log(row)
      console.log(row.id)
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
