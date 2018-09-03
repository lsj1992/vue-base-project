<template>
    <!-- 内部用来添加角色的组件  -->
    <el-form :model="roluData">
      <el-form-item>
        <el-input name="sumRoleName" style="width: 40%; margin-right: 25px;" v-model="detailFlowData.sumRoleName">
          <template slot="prepend">角色名称</template>
        </el-input>
        <el-switch
            v-model="detailFlowData.flowStatus"
            active-text="启用"
            inactive-text="禁用"
            @change="changeFlowStatus"
            >
          </el-switch>
      </el-form-item>
      <el-form-item>
        <el-input name="sumRoleType" style="width: 40%; margin-right: 25px;" v-model="detailFlowData.sumRoleType">
          <template slot="prepend">角色类型</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input name="sumRoleApp" style="width: 40%; margin-right: 25px;" v-model="detailFlowData.sumRoleApp">
          <template slot="prepend">第三方程序</template>
        </el-input>
      </el-form-item>
      <el-form-item class="flow_desc" label="角色描述">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3}"
          v-model="detailFlowData.sumRoleDesc">
        </el-input>
      </el-form-item>
    </el-form>

</template>
<script>
export default {
  components: { },
  name: 'addRuleDialog',
  data() {
    return {
    }
  },
  props: {
    // sumRoleName: 增加角色名称
    // sumRoleDesc: 但是哥仨个
    // sumRoleType: 0
    // sumRoleApp: 1
    // sumRoleStatus: 1
    roluData: {}
  }

}
</script>
  
