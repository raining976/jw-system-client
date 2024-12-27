<template>
    <!-- 搜索和添加课程 -->
    <div class="d-flex justify-content-between my-2">
        <div class="d-flex">
            <!-- 课程名搜索 -->
            <input type="text" class="form-control me-2" placeholder="模糊搜索" v-model="searchValue"
                @keydown.enter="fetchSCourses">
            <!-- 搜索按钮 -->
            <button class="btn btn-primary" style="width: 120px;" @click="fetchSCourses">搜索</button>
        </div>

    </div>
    <div class="d-flex justify-content-left my-2 select-box" v-if="userStore.isAdmin">
        <!-- 选择课程、老师和上课天、上课时间来创建课程 -->
        <!-- 选择课程 -->
        <div class="container mt-3">
            <el-autocomplete v-model="course_name" :fetch-suggestions="courseSearchAsync" placeholder="输入课程搜索"
                @select="selectCourses" value-key="course_name" />
        </div>
        <!-- 选择老师 -->
        <div class="container mt-3">
            <el-autocomplete v-model="teacher_name" :fetch-suggestions="teacherSearchAsync" placeholder="输入老师搜索"
                @select="selectTeachers" value-key="name" />
        </div>

        <!-- 选择上课天 -->
        <div class="container mt-3">
            <div class="col-sm-12">
                <select id="day" class="form-select" v-model="createForm.day">
                    <option selected value="">选择上课天</option>
                    <option value="周一">周一</option>
                    <option value="周二">周二</option>
                    <option value="周三">周三</option>
                    <option value="周四">周四</option>
                    <option value="周五">周五</option>
                </select>
            </div>
        </div>

        <!-- 选择上课时间 -->
        <div class="container mt-3">
            <div class="col-sm-12">
                <select id="time" class="form-select" v-model="createForm.time">
                    <option value="">选择上课时间</option>
                    <option value="1">上午 1-2节</option>
                    <option value="2">上午 3-4节</option>
                    <option value="3">下午 5-6节</option>
                    <option value="4">下午 6-7节</option>
                </select>
            </div>
        </div>
        <div class="container mt-3" style="width: 120px;">
            <button type="button" class="btn btn-primary" 
                @click="createSCourse">
                添加选课
            </button>
        </div>
    </div>
    <div>
        <myTable :data="scourses" :columns="columns" :current-page="currentPage" :total-pages="totalPages"
            @change-page="handlePageChange" @edit="handleEdit" @delete="handleDelete" @choose="handleChoose" :selectable="userStore.isAdmin"
            :editable="false" :isStudent="userStore.isStudent" :deletable="userStore.isAdmin" @delete-selected="handleDeleteSelected" />
    </div>

</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
import { errorNotice } from "../../utils/notice";

import { useUserStore } from "@/store";
const userStore = useUserStore()
const { proxy } = getCurrentInstance()

// 模拟后端数据（课程和老师）
const courses = ref([]);
const teachers = ref([]);
// 添加选课的选项
const createForm = ref({
    course_id: '',
    teacher_id: '',
    day: "",
    time: '',
})
const course_name = ref("")
const teacher_name = ref("")

// 选择搜索结果
const selectCourses = (v) => {
    createForm.value.course_id = v.course_id
}

const selectTeachers = (v) => {
    createForm.value.teacher_id = v.teacher_id

}

const courseSearchAsync = (queryString, cb) => {
    proxy.$api.findCourse({ keyword: queryString }).then(res => {
        if (res.code == 20000) {
            cb(res.data.data)
        }
    }).catch(e => {
        cb([])
    })
}

const teacherSearchAsync = (queryString, cb) => {
    proxy.$api.getUserAll({ role: 'teacher', keyword: queryString }).then(res => {
        console.log('res', res)
        if (res.code == 20000) {
            cb(res.data.data)
        }
    }).catch(e => {
        cb([])
    })
}






// 搜索条件
const searchValue = ref('')
const scourses = ref([

]);

const columns = ref([
    { key: "scourse_id", label: "选课号" },
    { key: "course_id", label: "课程号" },
    { key: "teacher_id", label: "老师工号" },
    { key: "course_name", label: "课程名称" },
    { key: "teacher_name", label: "老师姓名" },
    { key: "day", label: "上课日" },
    { key: "time", label: "上课时间" },
]);

const handleDelete = async (row) => {
    await proxy.$api.deleteSCourses({ ids: [row.scourse_id] })
    fetchSCourses()
};

const handleEdit = (row) => {
    alert(`Edit course: ${row.course_name}`);
};

const handleDeleteSelected = async (selectedItems) => {
    const ids = selectedItems.map((item) => item.scourse_id);
    await proxy.$api.deleteSCourses({ ids })
    fetchSCourses()
};


const currentPage = ref(1);
const totalPages = ref(1); // 从后端获取的总页数

const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchSCourses(); // 调用后端接口获取数据
};
const pageSize = ref(8)


const fetchSCourses = async () => {
    // 调用后端分页接口
    let form = {
        pageSize: pageSize.value,
        pageNum: currentPage.value,
        keyword: searchValue.value
    }
    await proxy.$api.findSCourse(form).then(res => {
        if (res.code == 20000) {
            scourses.value = res.data.data
            totalPages.value = Math.ceil(res.data.total / pageSize.value)
        } else {
            errorNotice(res.msg)
        }

    })
};

const createSCourse = async () => {
    const isFormValid = Object.values(createForm.value).every(value => value !== '');
    if (isFormValid) {
        await proxy.$api.createSCourse(createForm.value)
        fetchSCourses()
    }
}

onMounted(() => {
    fetchSCourses()
    // 模拟请求课程数据
    courses.value = [
        { id: 1, name: '数学' },
        { id: 2, name: '英语' },
        { id: 3, name: '物理' }
    ];

    // 模拟请求老师数据
    teachers.value = [
        { id: 1, name: '张老师' },
        { id: 2, name: '李老师' },
        { id: 3, name: '王老师' }
    ];
})

// 学生选课
const handleChoose = (row) =>{
    alert(row.course_name, row.teacher_name)
}

</script>

<style scoped>
.select-box>div {
    width: 180px;
    margin: 0 5px;
    height: 40px;
}
</style>