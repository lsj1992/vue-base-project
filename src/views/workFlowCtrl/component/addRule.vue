<template>
    <!-- 内部用来添加角色的组件  -->
    <el-form
      ref="addRuleValidate"
      :model="newRuleData"
      :rules="validateAddRule">
      <el-form-item prop="sumRoleName">
        <el-input name="sumRoleName" style="width: 40%; margin-right: 25px;" v-model="newRuleData.sumRoleName">
          <template slot="prepend">角色名称</template>
        </el-input>
        <el-switch
          v-model="newRuleData.sumRoleStatus"
          active-text="启用"
          inactive-text="禁用"
          @change="changeFlowStatus"
          >
        </el-switch>
      </el-form-item>
      <el-form-item prop="sumRoleType" label="角色类型">
        <el-select v-model="newRuleData.sumRoleType" placeholder="请选择">
          <el-option
            v-for="item in ruleType"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
          <template slot="prepend">角色类型</template>
        </el-select>
        <!-- <el-input name="sumRoleType" style="width: 40%; margin-right: 25px;" v-model="newRuleData.sumRoleType">
          <template slot="prepend">角色类型</template>
        </el-input> -->
      </el-form-item>
      <el-form-item prop="sumRoleApp">
        <el-input name="sumRoleApp" type="number" style="width: 40%; margin-right: 25px;" v-model="newRuleData.sumRoleApp">
          <template slot="prepend">第三方程序</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="sumRoleDesc" class="flow_desc" label="角色描述">
        <el-input
          name="sumRoleDesc"
          type="textarea"
          :autosize="{ minRows: 3}"
          v-model="newRuleData.sumRoleDesc">
        </el-input>
      </el-form-item>
    </el-form>
</template>
<script>
import { addGzbSumRole } from '@/api/gzb_flow'
export default {
  name: 'AddRuleDialog',
  data() {
    const validateSumRoleName = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('角色名称不能为空'))
      } else {
        callback()
      }
    }
    const validateSumRoleDesc = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('角色描述不能为空'))
      } else {
        callback()
      }
    }
    const validateSumRoleType = (rule, value, callback) => {
      if (value === null || value === undefined) {
        callback(new Error('角色类型不能为空'))
      } else {
        callback()
      }
    }
    const validateSumRoleApp = (rule, value, callback) => {
      if (!value || value.trim().length <= 0) {
        callback(new Error('第三方程序不能为空'))
      } else {
        callback()
      }
    }
    return {
      newRuleData: Object.assign({}, this.roluData),
      validateAddRule: {
        sumRoleName: [{ required: true, trigger: 'blur', validator: validateSumRoleName }],
        sumRoleDesc: [{ required: true, trigger: 'blur', validator: validateSumRoleDesc }],
        sumRoleType: [{ required: true, trigger: 'blur', validator: validateSumRoleType }],
        sumRoleApp: [{ required: true, trigger: 'blur', validator: validateSumRoleApp }]
      },
      ruleType: [
        {
          id: 0,
          value: '菜单'
        },
        {
          id: 1,
          value: '工作流'
        }
      ]
    }
  },
  props: {
    roluData: {
      type: Object,
      required: true
    }
  },
  methods: {
    changeFlowStatus() {},
    addRule() {
      const data = {
        sumRoleName: this.newRuleData.sumRoleName,
        sumRoleDesc: this.newRuleData.sumRoleDesc,
        sumRoleType: this.newRuleData.sumRoleType,
        sumRoleApp: this.newRuleData.sumRoleApp,
        sumRoleStatus: this.newRuleData.sumRoleStatus ? 0 : 1
      }
      return new Promise((resolve, reject) => {
        this.$refs.addRuleValidate.validate((valid) => {
          if (valid) {
            addGzbSumRole(data).then((response) => {
              const res = response.data
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      })
    }
  }

}
</script>
  
