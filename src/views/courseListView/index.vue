<template>
    <!-- 搜索和添加课程 -->
    <div class="d-flex justify-content-between my-2">
        <div class="d-flex">
            <!-- 课程名搜索 -->
            <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue" @keydown.enter="fetchCourses">
            <!-- 搜索按钮 -->
            <button class="btn btn-primary" style="width: 120px;" @click="fetchCourses">搜索</button>
        </div>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            添加课程
        </button>
    </div>
    <div>
        <myTable :data="courses" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @edit="handleEdit" @delete="handleDelete" selectable editable deletable
            @delete-selected="handleDeleteSelected" />
    </div>
</template>

<script setup>

import { ref } from "vue";
import { errorNotice } from "../../utils/notice";

import { useUserStore } from "@/store"

const userStore = useUserStore()

userStore.userInfo

// 搜索条件
const searchValue = ref('')
const courses = ref([]);

const columns = ref([
    { key: "course_id", label: "课程号" },
    { key: "course_name", label: "课程名称" },
    { key: "description", label: "课程描述" },
    { key: "created_at", label: "创建时间" },
    { key: "updated_at", label: "更新时间" },
]);

const handleDelete = async (row) => {
    await proxy.$api.deleteCourses({ ids: [row.course_id] })
    fetchCourses()
};

const handleEdit = (row) => {
    alert(`Edit course: ${row.course_name}`);
};

const handleDeleteSelected = async (selectedItems) => {
    const ids = selectedItems.map((item) => item.course_id);
    await proxy.$api.deleteCourses({ ids })
    fetchCourses()
};


const currentPage = ref(1);
const totalPages = ref(1); // 从后端获取的总页数

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchCourses(); // 调用后端接口获取数据
};
const pageSize = ref(8)
const { proxy } = getCurrentInstance()

const fetchCourses = async () => {
    // 调用后端分页接口
    let form = {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }
    await proxy.$api.findCourse(form).then(res => {
        if (res.code == 20000) {
            courses.value = res.data.data
            totalPages.value = Math.ceil(res.data.total / pageSize.value)
            console.log('totalPages.value',totalPages.value)
        } else {
            errorNotice(res.msg)
        }

    })
};

onMounted(() => {
    fetchCourses()
})
// fetchCourses(currentPage.value); // 初始化数据

</script>