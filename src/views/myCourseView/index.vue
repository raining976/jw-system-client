<template>
    <div class="d-flex justify-content-between my-2">
        <div class="d-flex">
            <!-- 课程名搜索 -->
            <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue"
                @keydown.enter="updateData">
            <!-- 搜索按钮 -->
            <button class="btn btn-primary" style="width: 120px;" @click="updateData">搜索</button>
        </div>
    </div>
    <myTable :data="tableData" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
        @change-page="handlePageChange" :selectable="userStore.isAdmin"
        :isStudent="userStore.isStudent" :isCancel="true" :editable="userStore.isAdmin" :deletable="userStore.isAdmin"
        @delete-selected="handleDeleteSelected"  @cancelCourse="handleCancelCourse"/>
</template>

<script setup>
import { useUserStore } from "@/store"

const userStore = useUserStore()

// 搜索条件
const searchValue = ref('')
const tableData = ref([]);

const columns = ref([
    { key: "scourse_id", label: "选课号" },
    { key: "course_name", label: "课程名称" },
    { key: 'teacher_name', label: '上课老师' },
    { key: "day", label: "上课天" },
    { key: "time", label: "上课时间" },
    { key: "grade", label: "成绩" },
]);


const handleDelete = async (row) => {
    // await proxy.$api.deleteCourses({ ids: [row.course_id] })
    updateData()
};

const handleDeleteSelected = async (selectedItems) => {
    const ids = selectedItems.map((item) => item.scourse_id);
    // await proxy.$api.deleteCourses({ ids })
    updateData()
};


const currentPage = ref(1);
const totalPages = ref(1); // 从后端获取的总页数

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    updateData();
};
const pageSize = ref(8)
const { proxy } = getCurrentInstance()

const fetchMyClass = async () => {
    // 调用后端分页接口
    let form = {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }
    await proxy.$api.findMyCourse(form).then(res => {
        console.log('res.data',res.data)
        tableData.value = res.data.data
    })
};

const updateData = () => {
    fetchMyClass()
}


onMounted(() => {
    updateData()
})



const handleCancelCourse = async(row) =>{
    await proxy.$api.cancelCourse({enrollment_id: row.enrollment_id})
    updateData()

}

</script>