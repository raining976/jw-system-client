<template>
  <div class="container mt-5">
    <!-- 信息盒子 -->
    <div class="card mx-auto" style="max-width: 600px;">
      <div class="card-body">
        <h5 class="card-title text-center">用户信息</h5>
        <form>
          <!-- 用户名 -->
          <div class="mb-3 row align-items-center">
            <label for="username" class="col-sm-2 col-form-label text-end">账号</label>
            <div class="col-sm-9">
              <input type="text" id="username" class="form-control" :value="userInfo.username" disabled />
            </div>
          </div>

          <!-- 姓名 -->
          <div class="mb-3 row align-items-center">
            <label for="name" class="col-sm-2 col-form-label text-end">姓名</label>
            <div class="col-sm-9">
              <input type="text" id="name" class="form-control" :value="userInfo.name" disabled />
            </div>
          </div>

          <!-- 性别 -->
          <div class="mb-3 row align-items-center">
            <label for="gender" class="col-sm-2 col-form-label text-end">性别</label>
            <div class="col-sm-9">
              <div v-if="isEditing">
                <select id="gender" class="form-select" v-model="editableUserInfo.gender">
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="保密">保密</option>
                </select>
              </div>
              <div v-else>
                <input type="text" id="gender" class="form-control" :value="userInfo.gender" disabled />
              </div>
            </div>
          </div>

          <!-- 学号 -->
          <div class="mb-3 row align-items-center">
            <label for="studentId" class="col-sm-2 col-form-label text-end">学号</label>
            <div class="col-sm-9">
              <input type="text" id="studentId" class="form-control" :value="userInfo.studentId" disabled />
            </div>
          </div>

          <!-- 年级 -->
          <div class="mb-3 row align-items-center">
            <label for="grade" class="col-sm-2 col-form-label text-end">年级</label>
            <div class="col-sm-9">
              <div v-if="isEditing">
                <select id="grade" class="form-select" v-model="editableUserInfo.grade">
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div v-else>
                <input type="text" id="grade" class="form-control" :value="userInfo.grade" disabled />
              </div>
            </div>
          </div>

          <!-- 专业 -->
          <div class="mb-3 row align-items-center">
            <label for="major" class="col-sm-2 col-form-label text-end">专业</label>
            <div class="col-sm-9">
              <div v-if="isEditing">
                <input type="text" id="major" class="form-control" v-model="editableUserInfo.major" />
              </div>
              <div v-else>
                <input type="text" id="major" class="form-control" :value="userInfo.major" disabled />
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="d-flex justify-content-between mt-4" style="margin: 0 40px;">
            <button type="button" class="btn btn-primary" @click="toggleEdit">
              {{ isEditing ? '取消' : '编辑' }}
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
import { reactive, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const userInfo = reactive({
  user_id: "",
  username: '',
  name: "张三",
  gender: "男",
  student_id: "20230001",
  grade: 2023,
  major: "计算机科学与技术",
});
const getInfo = () => {
  proxy.$api.getUserInfo().then(res => {
    if (res.code == 20000) {
      userInfo.username = res.data.username;
      userInfo.name = res.data.name;
      userInfo.gender = res.data.gender;
      userInfo.studentId = res.data.student_id;
      userInfo.grade = res.data.grade;
      userInfo.major = res.data.major;
    }
  })
}

// 可编辑的数据
const editableUserInfo = reactive({
  gender: "",
  grade: null,
  major: "",
});

// 编辑模式标志
const isEditing = ref(false);

// 切换编辑模式
const toggleEdit = () => {
  if (isEditing.value) {
    // 取消编辑时，恢复原始数据
    Object.assign(editableUserInfo, userInfo);
  } else {
    // 开始编辑时，设置为当前用户数据
    Object.assign(editableUserInfo, userInfo);
  }
  isEditing.value = !isEditing.value;
};

// 保存更改
const saveChanges = () => {
  // 提交编辑数据并退出编辑模式
  Object.assign(userInfo, editableUserInfo);
  isEditing.value = false;
  console.log("保存后的用户信息:", userInfo);
  // 调用更新用户信息的后端接口，传递修改后的数据
  // proxy.$api.updateUserInfo(userInfo).then(res => {
  //   if (res.code == 20000) {
  //     // 后端保存成功后，用返回的最新数据更新前端展示的userInfo
  //     userInfo.name = res.data.name;
  //     userInfo.gender = res.data.gender;
  //     userInfo.studentId = res.data.student_id;
  //     userInfo.grade = res.data.grade;
  //     userInfo.major = res.data.major;
  //   }
  // });

};

onMounted(() => {
  getInfo();
});
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
</style>