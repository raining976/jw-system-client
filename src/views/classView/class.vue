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
        @change-page="handlePageChange" @adjust="handleAdjust" @delete="handleDelete" :selectable="userStore.isAdmin"
        :isTeacher="userStore.isTeacher" :editable="userStore.isAdmin" :deletable="userStore.isAdmin"
        @delete-selected="handleDeleteSelected" @detail="handleDetail" :isDetail="true"  :isChange="userStore.isTeacher"/>

    <common-form-dialog v-model:visible="dialogVisible" title="调课申请" :fields="formFields" :modelValue="form"
        :isEdit="true" @submit="handleSubmit" @update:visible="updateVisible" @close="closeDialog" :rules="rules" />
</template>

<script setup>
import { useUserStore } from '@/store';
const userStore = useUserStore()

// 搜索条件
const searchValue = ref('')
const tableData = ref([]);

const columns = ref([
    { key: "scourse_id", label: "选课号" },
    { key: 'course_id', label: "课程号" },
    { key: "course_name", label: "课程名称" },
    { key: "day", label: "上课天" },
    { key: "time", label: "上课时间" },
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
    await proxy.$api.findTeacherClass(form).then(res => {
        if (res.code == 20000) {
            tableData.value = res.data.data
            totalPages.value = Math.ceil(res.data.total / pageSize.value)
        } else {
            errorNotice(res.msg)
        }

    })
};

// 获取所有上课班级
const fetchAllClass = () => {

}

const updateData = () => {
    if (userStore.isTeacher)
        fetchMyClass()
    else if(userStore.isAdmin) {
        fetchAllClass()
    }
}


onMounted(() => {
    updateData()
})




const router = useRouter()
const handleDetail = (row) => {
    router.push({
        path: '/classStudents',
        query: {
            scourse_id: row.scourse_id
        }
    })
}


// 以下是调课


// 以下是编辑和添加部分
const handleAdjust = (row) => {
    dialogVisible.value = true
    form.value = row
};
const dialogVisible = ref(false)
const formFields = ref([
    { label: '选课号', prop: "scourse_id", type: 'el-input', disabled: true },
    { label: '课程名', prop: "course_id", type: 'el-input', disabled: true },
    {
        label: "调课原因",
        prop: "reason",
        type: "el-input",
    }, {
        label: "调课说明",
        prop: 'detail',
        type: 'el-input'
    }
])


const emptyForm = ref({ // 空表 用来恢复form
    enrollment_id: '',
    score: "",
})

const form = ref({
    enrollment_id: '',
    score: "",
})

const rules = ref({
    reason: [{ required: true, message: "调课原因不能为空", trigger: "blur" }],
    detail: [{ required: true, message: "调课说明不能为空", trigger: "blur" }],
});

const handleSubmit = (form) => {
    createScheduleChange(form)
}


const createScheduleChange = async (form) => {
    let {scourse_id, reason, detail} = form
    let teacher_id = userStore.userInfo.teacher_id
    await proxy.$api.createScheduleChange({scourse_id,teacher_id, reason,detail})



}

const updateVisible = (v) => {
    dialogVisible.value = v
}

const closeDialog = () => {
    dialogVisible.value = false
    form.value = { ...emptyForm.value }
}

</script>