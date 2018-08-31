<template>
<!-- 回到顶部 -->
<div class="Banner_List">
      <!-- 图片列表 -->
    <el-table
      :data="imagesTableList"
      border
      style="width: 100%">
      <el-table-column
        label="选择"
        align="center"
        v-if="showRadio"
        style="width: 20%;">
        <template slot-scope="scope">
          <el-radio class="radio" v-model="changeSelect" :label="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        align="center"
        style="width: 20%;">
        <template slot-scope="scope">
          <img class="banner_thumbnail" :src="imgBaseUrl + scope.row.picUrl" preview="0" :preview-text="scope.row.bannerDesc" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        align="center"
        v-if="!isDialog"
        style="width: 25%">
        <template slot-scope="scope">
          <span>{{scope.row.bannerIndex}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        align="center"
        style="width: 25%">
        <template slot-scope="scope">
          <span v-if="scope.row.bannerDesc">{{scope.row.bannerDesc}}</span>
          <span v-if="scope.row.picDesc">{{scope.row.picDesc}}</span>
        </template>
      </el-table-column>
       <el-table-column
        label="类型"
        align="center"
        v-if="!isDialog"
        style="width: 25%">
        <template slot-scope="scope">
          <span v-if="scope.row.bannerType === 1">主页</span>
          <span v-if="scope.row.bannerType === 2">保险</span>
          <span v-if="scope.row.bannerType === 3">金融</span>
        </template>
       </el-table-column>
      <el-table-column
        prop="picUrl"
        label="链接"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-if="showOperation"
        style="width: 35%">
        <template slot-scope="scope">
          <el-button @click="editBanner(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteBanner(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- banner列表的分页 -->
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
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'BannerList',
  props: {
    imagesTableList: {
      required: true,
      type: Array
    },
    isDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    showRadio: {
      type: Boolean,
      default: false
    },
    showOperation: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 20, 30, 40, 50]
      }
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters('banner', ['getSelectedBanner'])
  },
  data() {
    return {
      changeSelect: '',
      imgBaseUrl: process.env.files_href
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations('banner', [
      'SET_SELECTED_BANNER'
    ]),
    /**
     * 编辑banner
     */
    editBanner(row) {
      this.$emit('editBannerRow', row)
    },
    /**
     * 删除banner
     */
    deleteBanner(row) {
      this.$emit('deleteBanner', row)
    },
    /**
     * 改变状态
     */
    changeRadioStatus(val) {
      this.changeSelect = val
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      console.log('handleCurrentChange')
      this.$emit('handleCurrentChange', val)
    }
  },
  watch: {
    changeSelect(newVal) {
      this.SET_SELECTED_BANNER(newVal)
    }
  }

}
</script>

<style scoped>
.banner_thumbnail {
  width:80px;
  height: 30px;
}
</style>
