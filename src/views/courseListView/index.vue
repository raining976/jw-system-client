<template>
    <!-- 搜索和添加课程 -->
    <div class="d-flex justify-content-between my-2">
        <div class="d-flex">
            <!-- 课程名搜索 -->
            <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue"
                @keydown.enter="fetchCourses">
            <!-- 搜索按钮 -->
            <button class="btn btn-primary" style="width: 120px;" @click="fetchCourses">搜索</button>
        </div>
        <el-button plain @click="dialogVisible = true, isEdit = false">
            添加课程
        </el-button>
    </div>
    <div>
        <myTable :data="courses" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @edit="handleEdit" @delete="handleDelete" selectable editable deletable
            @delete-selected="handleDeleteSelected" />
    </div>
    <common-form-dialog v-model:visible="dialogVisible" title="课程信息" :fields="formFields" :modelValue="form"
        :isEdit="isEdit" @submit="handleSubmit" @update:visible="updateVisible" @close="closeDialog" :rules="rules" />


</template>

<script setup>

import { ref, watch } from "vue";
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
        } else {
            errorNotice(res.msg)
        }

    })
};

onMounted(() => {
    fetchCourses()
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
    { label: "课程名称", prop: "course_name", type: "el-input" },
    // {
    //     label: "性别",
    //     prop: "gender",
    //     type: "el-select",
    //     attrs: {
    //         options: [
    //             {
    //                 label:"男",
    //                 value:"男",
    //             },
    //             {
    //                 label:"女",
    //                 value:"女",
    //             },
    //             {
    //                 label:"保密",
    //                 value:"保密",
    //             },
    //         ]
    //     }
    // },
    {
        label: "课程描述",
        prop: "description",
        type: "el-input",
        attrs: { type: "textarea" },
    }
])


const emptyForm = ref({ // 空表 用来恢复form
    course_id: '',
    course_name: "",
    description: ""
})

const form = ref({
    course_id: '',
    course_name: "",
    description: ""
})

const rules = ref({
    course_name: [{ required: true, message: "课程名称不能为空", trigger: "blur" }],
    description: [{ required: true, message: "课程描述不能为空", trigger: "blur" }],
    // gender:[{ required: true, message: "性别不为空", trigger: "blur" }],
});

const handleSubmit = (form) => {
    isEdit.value ? updateCourse(form) : createCourse(form)
}


const createCourse = async (form) => {
    const { course_name, description } = form
    await proxy.$api.createCourse({ course_name, description }).then(res => {
        fetchCourses()
    })

}

const updateCourse = async (form) => {
    const { course_id, description, course_name } = form
    await proxy.$api.updateCourse({ course_id, description, course_name }).then(res => {
        fetchCourses()
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