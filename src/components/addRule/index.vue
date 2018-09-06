<template>
    <!-- 内部用来添加角色的组件  -->
    <el-form
      class="add_rule"
      ref="addRuleValidate"
      :model="newRuleData"
      :rules="validateAddRule">
      <el-form-item prop="sumRoleName">
        <el-input name="sumRoleName" style="width: 312px; margin-right: 25px;" v-model="newRuleData.sumRoleName">
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
      <el-form-item
        prop="sumRoleType"
        class="rule_type"
        label="角色类型"
        >
        <el-select
          class="rule_select"
          v-model="newRuleData.sumRoleType"
          placeholder="请选择">
          <el-option
            v-for="item in ruleType"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sumRoleApp">
        <el-input name="sumRoleApp" type="number" min='0' style="width: 312px; margin-right: 25px;" v-model="newRuleData.sumRoleApp">
          <template slot="prepend">第三方程序</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="sumRoleDesc" class="form_label" label="角色描述">
        <el-input
          name="sumRoleDesc"
          type="textarea"
          :autosize="{ minRows: 3,maxRows:5}"
          resize="none"
          maxlength="200"
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
      } else if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(value.trim())) {
        callback(new Error('角色名称只能是汉字和字母'))
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
      newRuleData: Object.assign({}, this.ruleData),
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
    ruleData: {
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
    },
    updateRule() {
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
  },
  mounted() {
  },
  watch: {
    ruleData(newVal) {
      this.newRuleData = Object.assign({}, newVal)
    }
  }

}
</script>
<style scoped>
.rule_type >>> .el-form-item__label {
  display: block;
  background-color: #f5f7fa;
  color: #909399;
  border: 1px solid #dcdfe6;
  height: 36px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 20px;
  white-space: nowrap;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
  font-weight: 400;
  width: 110px;
  text-align: center;
}

.rule_type >>> .el-form-item__label::before {
  display: none;
  content: ""
}

.add_rule >>> .el-input-group__prepend {
  width: 110px;
  text-align: center
}
.rule_select >>> .el-input__inner {
  width: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.form_label >>> .el-form-item__label {
  padding: 0 20px;
  text-align: center;
  border: 1px solid #dcdfe6;
  width: 110px;
  text-align: center;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 20px;
  font-weight: 400;
  color: #909399;
  background: #f5f7fa;
}
.form_label >>> .el-form-item__label::before {
  display: none;
  content: '';
}
</style>

  
