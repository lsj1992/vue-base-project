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
          <img class="banner_thumbnail" :src="imgBaseUrl + scope.row.bannerUrl" preview="0" :preview-text="scope.row.bannerDesc" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="bannerIndex"
        label="序号"
        align="center"
        style="width: 25%">
      </el-table-column>
      <el-table-column
        prop="bannerDesc"
        label="描述"
        align="center"
        style="width: 25%">
      </el-table-column>
       <el-table-column
        prop="bannerType"
        label="类型"
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
        label="操作"
        align="center"
        v-if="showOperation"
        style="width: 35%">
        <template slot-scope="scope">
          <el-button @click="editBanner(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteConfim('codeTable', scope.row)" type="danger" size="small">删除</el-button>
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
      imgBaseUrl: process.env.UPLOAD_API
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
    editBanner(row) {
      this.$emit('editBannerRow', row)
    },
    /**
     * 切换每页显示条数
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      // this.getConfigCodeList()
    },
    /**
     * 跳转，上一页上一页
     */
    handleCurrentChange(val) {
      // this.getConfigCodeList()
      console.log(`当前页 跳转: ${val}`)
    }
  },
  watch: {
    changeSelect(newVal) {
      console.log(newVal)
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
