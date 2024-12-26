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
                    <th v-if="editable || deletable">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row,index) in data" :key="index">
                    <td v-if="selectable">
                        <input type="checkbox" v-model="selectedItems" :value="row">
                    </td>
                    <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
                    <td v-if="editable || deletable">
                        <button v-if="editable" class="btn btn-warning me-2" @click="$emit('edit', row)">
                            编辑
                        </button>
                        <button v-if="deletable" class="btn btn-danger" @click="$emit('delete', row)">
                            删除
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 删除按钮和分页器 -->
        <div class="d-flex justify-content-between align-items-center">
            <button v-if="selectable && deletable" class="btn btn-danger" @click="deleteSelected"
                :disabled="selectedItems.length === 0">
                Delete Selected
            </button>

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
    deletable: {
        type: Boolean,
        default: false,
    },
    totalPages:{
        type:Number,
        default: 1,
    },
    currentPage: {
        type:Number,
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

const emit = defineEmits(['delete-selected','edit','delete','change-page'])
const deleteSelected = () => {
    emit("delete-selected", selectedItems.value);
    selectedItems.value = [];
    selectAll.value = false;
};

watch(selectAll, toggleSelectAll);

</script>