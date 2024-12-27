<template>
    <!-- 搜索和添加老师 -->
    <div class="d-flex justify-content-between my-2">
        <div class="d-flex">
            <!-- 老师搜索 -->
            <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue"
                @keydown.enter="fetchTeachers">
            <!-- 搜索按钮 -->
            <button class="btn btn-primary" style="width: 120px;" @click="fetchTeachers">搜索</button>
        </div>
        <!-- Button trigger modal -->
        <el-button plain @click="dialogVisible = true, isEdit = false">
            添加教师
        </el-button>
    </div>
    <div>
        <myTable :data="teachers" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @edit="handleEdit" @delete="handleDelete" selectable editable deletable
            @delete-selected="handleDeleteSelected" />
    </div>
    <common-form-dialog v-model:visible="dialogVisible" title="教师信息" :fields="formFields" :modelValue="form"
        :isEdit="isEdit" @submit="handleSubmit" @update:visible="updateVisible" @close="closeDialog" :rules="rules" />
</template>

<script setup>

import { ref } from "vue";
import { errorNotice } from "../../../utils/notice";

const searchValue = ref('')
const teachers = ref([]);

const columns = ref([
    { key: "user_id", label: "用户id" },
    { key: "username", label: "用户名" },
    { key: "teacher_id", label: "教师工号" },
    { key: "teacher_name", label: "教师姓名" },
    { key: "gender", label: "性别" },
    { key: "department", label: "院系" },
]);

const handleDelete = async (row) => {
    await proxy.$api.deleteUsers({ ids: [row.user_id] })
    fetchTeachers()
};


const handleDeleteSelected = async (selectedItems) => {
    const ids = selectedItems.map((item) => item.user_id);
    await proxy.$api.deleteUsers({ ids })
    fetchTeachers()
};


const currentPage = ref(1);
const totalPages = ref(1); // 从后端获取的总页数

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchTeachers(); // 调用后端接口获取数据
};


const pageSize = ref(8)
const { proxy } = getCurrentInstance()

const fetchTeachers = async () => {
    // 调用后端分页接口
    let form = {
        // role: 'teacher',
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value,
    }
    await proxy.$api.getTeacherAll(form).then(res => {
        if (res.code == 20000) {
            teachers.value = res.data.data
            totalPages.value = Math.ceil(res.data.total / pageSize.value)
        } else {
            errorNotice(res.msg)
        }

    })
};


onMounted(() => {
    fetchTeachers()
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
    { label: "教师工号", prop: "teacher_id", type: "el-input" },
    { label: "教师姓名", prop: "teacher_name", type: "el-input" },
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
    { label: "院系", prop: "department", type: "el-input" },
])


const emptyForm = ref({ // 空表 用来恢复form
    user_id: '',
    username: "",
    teacher_id: "",
    teacher_name: "",
    gender: "",
    department: "",
})

const form = ref({
    user_id: '',
    username: "",
    teacher_id: "",
    teacher_name: "",
    gender: "",
    department: "",
})

const rules = ref({
    username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
    teacher_id: [{ required: true, message: "学号不能为空", trigger: "blur" }],
    teacher_name: [{ required: true, message: "教师姓名不能为空", trigger: "blur" }],
    gender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
    department: [{ required: true, message: "院系不能为空", trigger: "blur" }],
});

const handleSubmit = (form) => {
    isEdit.value ? updateTeacher(form) : createTeacher(form)
}


const createTeacher = async (form) => {
    const { username, teacher_id, teacher_name, gender, department } = form
    await proxy.$api.createTeacher({ username, teacher_id, teacher_name, gender, department }).then(res => {
        fetchTeachers()
    })

}

const updateTeacher = async (form) => {
    const { user_id, username, teacher_id, teacher_name, gender, department } = form
    await proxy.$api.updateTeacherInfo({ user_id, username, teacher_id, teacher_name, gender, department }).then(res => {
        fetchTeachers()
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