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
        <el-button plain @click="dialogVisible = true, isEdit = false">
            添加学生
        </el-button>
    </div>
    <div>
        <myTable :data="students" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @edit="handleEdit" @delete="handleDelete" selectable editable deletable
            @delete-selected="handleDeleteSelected" />
    </div>
    <common-form-dialog v-model:visible="dialogVisible" title="学生信息" :fields="formFields" :modelValue="form"
        :isEdit="isEdit" @submit="handleSubmit" @update:visible="updateVisible" @close="closeDialog" :rules="rules" />
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
    { key: "student_name", label: "学生姓名" },
    { key: "gender", label: "性别" },
    { key: "grade", label: "年级" },
    { key: "major", label: "专业" },
]);


const handleDelete = async (row) => {
    await proxy.$api.deleteUsers({ ids: [row.user_id] })
    fetchStudents()
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
        // role: 'student',
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value,
    }
    // console.log(searchValue.value)
    await proxy.$api.getStudentAll(form).then(res => {
        // console.log(res.data)
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

// 以下是编辑和添加部分
const handleEdit = (row) => {
    isEdit.value = true
    dialogVisible.value = true
    form.value = row
};
const dialogVisible = ref(false)
const isEdit = ref(false)
const formFields = ref([
    { label: "用户名", prop: "username", type: "el-input", disabled: true },
    { label: "学号", prop: "student_id", type: "el-input" },
    { label: "学生姓名", prop: "student_name", type: "el-input" },
    {
        label: "性别",
        prop: "gender",
        type: "el-select",
        attrs: {
            options: [
                {
                    label: "男",
                    value: "男",
                },
                {
                    label: "女",
                    value: "女",
                },
                {
                    label: "保密",
                    value: "保密",
                },
            ]
        }
    },
    {
        label: "年级",
        prop: "grade",
        type: "el-select",
        attrs: {
            options: [
                {
                    label: "2021",
                    value: "2021",
                },
                {
                    label: "2022",
                    value: "2022",
                },
                {
                    label: "2023",
                    value: "2023",
                },
                {
                    label: "2024",
                    value: "2024",
                },
            ]
        }
    },
    { label: "专业", prop: "major", type: "el-input" },
])


const emptyForm = ref({ // 空表 用来恢复form
    user_id: '',
    username: "",
    student_id: "",
    student_name: "",
    gender: "",
    grade: "",
    major: "",
})

const form = ref({
    user_id: '',
    username: "",
    student_id: "",
    student_name: "",
    gender: "",
    grade: "",
    major: "",
})

const rules = ref({
    username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
    student_id: [{ required: true, message: "学号不能为空", trigger: "blur" }],
    student_name: [{ required: true, message: "学生姓名不能为空", trigger: "blur" }],
    gender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
    grade: [{ required: true, message: "年级不能为空", trigger: "blur" }],
    major: [{ required: true, message: "专业不能为空", trigger: "blur" }],
});

const handleSubmit = (form) => {
    isEdit.value ? updateStudent(form) : createStudent(form)
}


const createStudent = async (form) => {
    const { username, student_name, student_id, major, grade, gender } = form
    await proxy.$api.createStudent({ username, student_name, student_id, major, grade, gender }).then(res => {
        console.log(res)
        fetchStudents()
    })

}

const updateStudent = async (form) => {
    const { user_id, username, student_id, student_name, gender, grade, major } = form
    await proxy.$api.updateStudentInfo({ user_id, username, student_id, student_name, gender, grade, major }).then(res => {
        fetchStudents()
    })

}

const updateVisible = (v) => {
    dialogVisible.value = v
}

const closeDialog = () => {
    dialogVisible.value = false
    form.value = { ...emptyForm.value }
}




</script>