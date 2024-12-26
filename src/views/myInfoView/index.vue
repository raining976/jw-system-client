<template>
  <div class="container d-flex justify-content-center align-items-center vh-80">
    <div class="card shadow-sm custom-card " style="min-width: 50%;">
      <div class="card-header text-center py-3">
        <h5>用户信息</h5>
      </div>
      <div class="card-body">
        <form>
          <div v-for="(value, fieldKey) in userInfo" :key="fieldKey" class="mb-3 row align-items-center">
            <label :for="fieldKey" class="col-sm-3 col-form-label text-end">
              {{ getFieldLabel(fieldKey) }}
            </label>
            <div class="col-sm-8">
              <template v-if="isEditing && isEditableField(fieldKey)">
                <select v-if="fieldKey === 'gender'" :id="fieldKey" class="form-select"
                  v-model="editableUserInfo[fieldKey]">
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="保密">保密</option>
                </select>

                <select v-else-if="fieldKey === 'grade'" :id="fieldKey" class="form-select"
                  v-model="editableUserInfo[fieldKey]">
                  <option v-for="year in [2021, 2022, 2023, 2024]" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>

                <input v-else type="text" :id="fieldKey" class="form-control" v-model="editableUserInfo[fieldKey]" />
              </template>

              <template v-else>
                <input type="text" :id="fieldKey" class="form-control" :value="value" disabled />
              </template>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-primary" @click="toggleEdit">
              {{ isEditing ? "取消" : "编辑" }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-success" @click="saveChanges">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>


// 用户信息和状态
const userInfo = ref({
  role: "student", // 示例角色，可根据实际数据修改
  username: "john_doe",
  student_id: "S12345",
  name: "test",
  gender: "男",
  major: "Computer Science",
  grade: 2023,
  department: "Mathematics",
  teacher_id: "T9876",
});
import { useUserStore } from '@/store';
const userStore = useUserStore()
onMounted(() => {
  userInfo.value = userStore.userInfo
})

const isEditing = ref(false);
const editableUserInfo = ref({});


// 判断字段是否可编辑
const isEditableField = (key) => {
  const editableFields = {
    admin: [],
    student: ["name", "gender", "major", "grade"],
    teacher: ["name", "gender", "department"],
  };
  return editableFields[userInfo.value.role]?.includes(key);
};

// 获取字段的显示名称
const getFieldLabel = (key) => {
  const labels = {
    role: "角色",
    username: "账号",
    password: "密码",
    user_id: "用户ID",
    student_id: "学号",
    teacher_id: "教师ID",
    name: "姓名",
    gender: "性别",
    major: "专业",
    grade: "年级",
    department: "系别",
  };
  return labels[key] || key;
};

// 切换编辑模式
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editableUserInfo.value = { ...userInfo.value }; // 进入编辑模式时复制数据
  }
};

const { proxy } = getCurrentInstance()


// 保存修改
const saveChanges = async () => {
  userInfo.value = { ...editableUserInfo.value }; // 保存修改到原始数据
  isEditing.value = false;
  await proxy.$api.updateMyInfo(userInfo.value)
  userStore.getInfo()
  console.log("保存成功", userInfo.value);
};


</script>

<style scoped>
.card {
  padding: 20px;
}

.card-header {
  padding: 10px !important;
}
</style>