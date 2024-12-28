<template>
  <el-dialog :title="title" :visible="visible" v-model="localVisible" :width="width" @close="handleClose"
    @update:visible="updateVisible">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item v-for="(item, index) in fields" :key="index" :label="item.label" :prop="item.prop"
        :label-width="item.labelWidth || labelWidth" >
        <el-input v-if="item.type == 'el-input'" v-model="form[item.prop]" @keydown.enter="submit"
          :disabled="item.disabled && isEdit"></el-input>
        <el-select v-else v-model="form[item.prop]">
          <el-option v-for="option in item.attrs?.options" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElInput, ElButton, ElDialog, ElForm, ElFormItem } from 'element-plus';
import 'element-plus/dist/index.css';
import { ref, watch, defineProps, defineEmits } from 'vue';
const props = defineProps({
  // 是否是编辑模式
  isEdit: {
    type: Boolean,
    required: true
  },
  // 是否可见
  visible: {
    type: Boolean,
    required: true,
  },
  // 标题
  title: {
    type: String,
    default: "弹出表单",
  },
  // 表单字段配置
  fields: {
    type: Array,
    required: true,
  },
  // 表单数据，用于编辑模式传入
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  // 表单校验规则
  rules: {
    type: Object,
    default: () => ({}),
  },
  // 弹窗宽度
  width: {
    type: String,
    default: "500px",
  },
  // 标签宽度
  labelWidth: {
    type: String,
    default: "120px",
  },
})
// 解构 props
const { modelValue, visible, fields, title, rules, width, labelWidth } = props;
const emit = defineEmits(['close', 'submit', 'update:visible']);

const localVisible = ref(false)
// 通过 ref 创建响应式数据
// 2. 使用 ref() 创建响应式数据
const form = ref({ ...modelValue });

// 3. 使用 watch() 来监听 modelValue 的变化
watch(() => props.modelValue, (newVal) => {
  form.value = { ...newVal };
}, { immediate: true });

// 4. 定义关闭弹窗的函数
const close = () => {
  emit('update:visible', false);
};

// 监听父组件传递的 visible prop
watch(() => props.visible, (newValue) => {
  localVisible.value = newValue
}, { immediate: true });

const formRef = ref(null)
// 5. 提交表单的函数
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', form.value);
    
      emit('close');
    }
  });
};

// 6. 处理关闭事件
const handleClose = () => {
  document.querySelector('#otherInput').focus()
  formRef.value.clearValidate();
  emit('close');
};
// 更新 visible 的值
const updateVisible = (newValue) => {
  emit('update:visible', newValue);  // 更新父组件中的 visible
};
// 7. 使用 defineEmits() 来定义事件
</script>

<style scoped>
.el-dialog {
  z-index: 9999 !important;
  /* 确保弹窗位于最前面 */
}
</style>