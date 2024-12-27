<template>
    <!-- 搜索和添加学生 -->
    <div class="d-flex justify-content-between my-2">
        <div class="d-flex">
            <!-- 学生搜索 -->
            <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue"
                @keydown.enter="fetchStudents">
            <!-- 搜索按钮 -->
            <button class="btn btn-primary" style="width: 120px;" @click="fetchStudents">搜索</button>
        </div>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            添加学生
        </button>
    </div>
    <div>
        <myTable :data="students" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @edit="handleEdit" @delete="handleDelete" selectable editable deletable
            @delete-selected="handleDeleteSelected" />
    </div>
</template>

<script setup>

import { ref } from "vue";
import { errorNotice } from "../../../utils/notice";

const searchValue = ref('')
const students = ref([]);

const columns = ref([
    { key: "user_id", label: "用户id" },
    { key: "username", label: "用户名" },
    { key: "student_id", label: "学号" },
    { key: "name", label: "学生姓名" },
    { key: "gender", label: "性别" },
    { key: "grade", label: "年级" },
    { key: "major", label: "专业" },
]);


const handleDelete = async (row) => {
    await proxy.$api.deleteUsers({ ids: [row.user_id] })
    fetchStudents()
};

const handleEdit = (row) => {
    alert(`Edit students: ${row.name}`);
};

const handleDeleteSelected = async (selectedItems) => {
    const ids = selectedItems.map((item) => item.user_id);
    await proxy.$api.deleteUsers({ ids })
    fetchStudents()
};


const currentPage = ref(1);
const totalPages = ref(1); // 从后端获取的总页数

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchStudents(); // 调用后端接口获取数据
};


const pageSize = ref(8)
const { proxy } = getCurrentInstance()

const fetchStudents = async () => {
    // 调用后端分页接口
    let form = {
        role: 'student',
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value,
    }
    console.log(searchValue.value)
    await proxy.$api.getUserAll(form).then(res => {
        console.log(res.data)
        if (res.code == 20000) {
            students.value = res.data.data
            totalPages.value = Math.ceil(res.data.total / pageSize.value)
            console.log('totalPages.value', totalPages.value)
        } else {
            errorNotice(res.msg)
        }

    })
};


onMounted(() => {
    fetchStudents()
})




</script>