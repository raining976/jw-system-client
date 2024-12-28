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
        @change-page="handlePageChange" @delete="handleDelete" :selectable="userStore.isAdmin" @edit="handleEdit"
        :editable="!userStore.isStudent" :deletable="userStore.isAdmin" @delete-selected="handleDeleteSelected" />

    <common-form-dialog v-model:visible="dialogVisible" title="修改成绩" :fields="formFields" :modelValue="form"
        :isEdit="true" @submit="handleSubmit" @update:visible="updateVisible" @close="closeDialog" :rules="rules" />

</template>

<script setup>
import { useUserStore } from '@/store';
const userStore = useUserStore()

// 搜索条件
const searchValue = ref('')
const tableData = ref([]);

const columns = ref([
    { key: 'enrollment_id', label: 'id' },
    { key: "student_id", label: "学号" },
    { key: 'name', label: "学生姓名" },
    { key: "gender", label: "性别" },
    { key: "grade", label: "年级" },
    { key: "major", label: "专业" },
    { key: "score", label: "成绩" },
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

import { errorNotice } from '../../utils/notice';
const route = useRoute()
const fetchMyStudents = async () => {
    // 调用后端分页接口
    let form = {
        scourse_id: Number(route.query.scourse_id),
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }

    await proxy.$api.findStudentsByScourseId(form).then(res => {
        if (res.code == 20000) {
            tableData.value = res.data.data
            totalPages.value = Math.ceil(res.data.total / pageSize.value)
        } else {
            errorNotice(res.msg)
        }
    })

};

const updateData = () => {
    fetchMyStudents()
}


onMounted(() => {
    updateData()

})


// 修改成绩


// 以下是编辑和添加部分
const handleEdit = (row) => {
    dialogVisible.value = true
    form.value = row
};
const dialogVisible = ref(false)
const formFields = ref([
    { label: "id", prop: "enrollment_id", type: "el-input", disabled: true },
    {
        label: "成绩",
        prop: "score",
        type: "el-input",
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
    score: [
        { required: true, message: "成绩不能为空", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                if (value === "" || value === null || value === undefined) {
                    callback(new Error("成绩不能为空"));
                } else if (value <= 0 || value > 100) {
                    callback(new Error("成绩必须大于 0 且小于等于 100"));
                } else {
                    callback(); // 验证通过
                }
            },
            trigger: "blur"
        }
    ],
});

const handleSubmit = (form) => {
    updateScore(form)
}


const updateScore = async (form) => {
    const { enrollment_id, score } = form
    await proxy.$api.updateScore({ enrollment_id, score })
    updateData()

}

const updateVisible = (v) => {
    dialogVisible.value = v
}

const closeDialog = () => {
    dialogVisible.value = false
    form.value = { ...emptyForm.value }
}

</script>
