<template>
    <div v-if="tableData.length || userStore.isAdmin">
        <div class="d-flex justify-content-between my-2" v-if="userStore.isAdmin">
            <div class="d-flex">
                <!-- 课程名搜索 -->
                <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue"
                    @keydown.enter="updateData">

                <!-- 搜索按钮 -->
                <button class="btn btn-primary" style="width: 120px;" @click="updateData">搜索</button>
            </div>
        </div>
        <myTable :data="tableData" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @delete="handleDelete" :selectable="userStore.isAdmin"
            :isTeacher="userStore.isTeacher" :deletable="userStore.isAdmin" :isApprove="userStore.isAdmin"
            :isReject="userStore.isAdmin" @delete-selected="handleDeleteSelected" :isPage="userStore.isAdmin"
            @approve="handleApprove" @reject="handleReject" />
    </div>
    <div v-else>空空如也～～～</div>

</template>

<script setup>
import { useUserStore } from '@/store';
const userStore = useUserStore()

// 搜索条件
const searchValue = ref('')
const tableData = ref([]);

const columns = ref([
    { key: "change_id", label: "id" },
    { key: 'scourse_id', label: "选课号" },

    { key: "reason", label: "调课原因" },
    { key: "detail", label: "调课说明" },
    { key: "status", label: "调课状态" },
]);


const handleDelete = async (row) => {
    await proxy.$api.deleteChange({ ids: [row.change_id] })
    updateData()
};

const handleDeleteSelected = async (selectedItems) => {
    const ids = selectedItems.map((item) => item.scourse_id);
    await proxy.$api.deleteChange({ ids })
    updateData()
};


const currentPage = ref(1);
const totalPages = ref(1);

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    updateData();
};
const pageSize = ref(8)
const { proxy } = getCurrentInstance()

// 老师查
const teacherFind = async () => {
    // 调用后端分页接口
    let form = {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }
    await proxy.$api.teacherFindSchedule(form).then(res => {
        tableData.value = res.data.data
        totalPages.value = Math.ceil(res.data.total / pageSize.value)
    })
};

// 学生查
const studentFind = async () => {
    // 调用后端分页接口
    let form = {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }
    await proxy.$api.studentFindSchedule(form).then(res => {
        tableData.value = res.data.data
        totalPages.value = Math.ceil(res.data.total / pageSize.value)


    })
};

// 管理员查
const adminFind = async () => {
    // 调用后端分页接口
    let form = {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }
    await proxy.$api.adminFindSchedule(form).then(res => {
        tableData.value = res.data.data
        totalPages.value = Math.ceil(res.data.total / pageSize.value)


    })
};




const updateData = () => {
    if (userStore.isTeacher)
        teacherFind()
    else if (userStore.isStudent) {
        studentFind()
    } else if (userStore.isAdmin) {
        adminFind()
    }
}



onMounted(() => {
    if (userStore.isAdmin) {
        columns.value.push({ key: 'teacher_name', label: "任课老师" })
    }
    updateData()
})


const handleApprove = async (row) => {
    await proxy.$api.approveChange({ change_id: row.change_id })
    updateData()
}

const handleReject = async (row) => {
    await proxy.$api.rejectChange({ change_id: row.change_id })
    updateData()
}
</script>