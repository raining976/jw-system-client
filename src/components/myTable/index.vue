<template>
    <div>
        <!-- 表格 -->
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th v-if="selectable">
                        <input type="checkbox" @change="toggleSelectAll" v-model="selectAll">
                    </th>
                    <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                    <th v-if="editable || deletable || isChange || isDetail || isChoose || isCancel || isApprove || isReject">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in data" :key="index">
                    <td v-if="selectable">
                        <input type="checkbox" v-model="selectedItems" :value="row">
                    </td>
                    <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
                    <td v-if="editable || deletable || isChoose || isChange || isDetail || isCancel || isApprove || isReject" >
                        <button v-if="editable" class="btn btn-warning me-2" @click="$emit('edit', row)">
                            编辑
                        </button>

                        <button v-if="isStudent && !isCancel" class="btn me-2"
                            :class="{ 'btn-light': isChosen[row.scourse_id], 'btn-info': !isChosen[row.scourse_id] }"
                            :disabled="isChosen[row.scourse_id]" @click="$emit('choose', row)">{{
                                isChosen[row.scourse_id] ?
                                    "已选" : "选课" }}</button>
                        <button v-if="isChange" class="btn btn-info me-2" @click="$emit('adjust', row)">调课</button>
                        <button v-if="isDetail" class="btn btn-light me-2" @click="$emit('detail', row)">查看</button>
                        <button v-if="isApprove && row.status == '申请中'" class="btn btn-success me-2" @click="$emit('approve', row)">同意</button>
                        <button v-if="isReject && row.status == '申请中'" class="btn btn-warning me-2" @click="$emit('reject', row)">拒绝</button>
                        <template v-if="deletable">
                            <el-popconfirm title="确定删除?" @confirm="$emit('delete', row)">
                                <template #reference>
                                    <button class="btn btn-danger">
                                        删除
                                    </button>
                                </template>
                            </el-popconfirm>
                        </template>
                        <template v-if="isStudent && isCancel && row.grade == 0">
                            <el-popconfirm title="该操作不可逆，确定退选?" @confirm="$emit('cancelCourse', row)">
                                <template #reference>
                                    <button class="btn btn-secondary me-2">退选</button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 删除按钮和分页器 -->
        <div class="d-flex justify-content-between align-items-center" v-if="isPage">
            <template v-if="selectable && deletable">
                <el-popconfirm title="确定删除当前选中的课程?" @confirm="deleteSelected">
                    <template #reference>
                        <button class="btn btn-danger" :disabled="selectedItems.length === 0">
                            删除所有选中
                        </button>
                    </template>
                </el-popconfirm>
            </template>

            <!-- 分页器 -->
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="$emit('change-page', currentPage - 1)">
                            上一页
                        </a>
                    </li>
                    <li v-for="num in totalPages" :key="num" class="page-item" :class="{ active: num === currentPage }">
                        <a class="page-link" href="#" @click.prevent="$emit('change-page', num)">
                            {{ num }}
                        </a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="$emit('change-page', currentPage + 1)">
                            下一页
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
    columns: { // 表头
        type: Array,
        required: true,
    },
    data: { // 数据
        type: Array,
        required: true,
    },
    rowsPerPage: { // 页大小
        type: Number,
        default: 5,
    },
    selectable: {
        type: Boolean,
        default: false,
    },
    editable: {
        type: Boolean,
        default: false,
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
    isTeacher: {
        type: Boolean,
        default: false,
    },
    isCancel: {
        type: Boolean,
        default: false,
    },
    isChosen: {
        type: Object,
        default: {},
    },
    isDetail: {
        type: Boolean,
        default: false,
    },
    isChange: {
        type: Boolean,
        default: false,
    },
    isChoose: {
        type: Boolean,
        default: false,
    },
    isPage: {
        type: Boolean,
        default: true,
    },
    isApprove: {
        type: Boolean,
        default: false,
    },
    isReject: {
        type: Boolean,
        default: false,
    },
    deletable: {
        type: Boolean,
        default: false,
    },
    totalPages: {
        type: Number,
        default: 1,
    },
    currentPage: {
        type: Number,
        default: 1,
    }
})
const selectAll = ref(false);
const selectedItems = ref([]);



const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedItems.value = [...props.data];
    } else {
        selectedItems.value = [];
    }
};

const emit = defineEmits(['delete-selected', 'edit', 'delete', 'change-page', 'choose', 'adjust', 'detail','approve','reject'])
const deleteSelected = () => {
    emit("delete-selected", selectedItems.value);
    selectedItems.value = [];
    selectAll.value = false;
};

watch(selectAll, toggleSelectAll);

</script>