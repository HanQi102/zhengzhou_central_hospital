<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加疾病</el-button>
                </div>
            </template>
            <el-table :data="divisionList.data" border stripe style="width: 100%" show-overflow-tooltip :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="title" label="科室名称" min-width="80" />
                <el-table-column prop="pic" label="图片" min-width="200">
                    <template #default="scope">
                        <img style="width: 100px" :src="scope.row.pic" fit="fit" />

                    </template>
                </el-table-column>
                <el-table-column label="分类操作" min-width="200">
                    <template #default="scope">
                        <el-button color="#13B9C9" @click="showEditDialog(scope.row)">修改疾病</el-button>
                        <el-button color="#13B9C9" @click="delDivision(scope.row.id)">删除疾病</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <!-- 分页器 -->
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 2, 5, 10]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </template>
        </el-card>
        <!-- 添加修改对话框 -->
        <el-dialog v-model="divisionDialog" :title="divisionDialogTitle" width="70%" @close="handleClose">
            <el-form ref="divisionRef" :model="divisionMsg" :rules="divisionRules" label-width="100px">
                <el-form-item label="科室名称:" prop="title">
                    <el-input v-model="divisionMsg.title" />
                </el-form-item>
                <el-form-item label="图片:" prop="pic">
                    <el-input v-model="divisionMsg.pic" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="divisionDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(divisionRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, ElMessageBox } from 'element-plus'

const { proxy }: any = getCurrentInstance()
// 疾病列表表格数据
const divisionList = reactive({ data: [] })
const getClassifyList = async () => {
    const res = await proxy.$http.get(`/office/list?pno=${currentPage.value}&count=${pageSize.value}`)
    if (res.code !== 200) {
        return ElMessage.error('疾病列表获取失败')
    }
    divisionList.data = res.data
    total.value = res.total
}
// 分页器
const total = ref(1)
const currentPage = ref(1)
const pageSize = ref(2)
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getClassifyList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getClassifyList()
}

// 对话框表单数据
let divisionMsg = reactive({
    title: '',
    pic: '',
    sort: '',
    oid: '',
    add: ''
})
// 控制对话框显示隐藏
const divisionDialog = ref(false)
// 对话框标题
const divisionDialogTitle = ref()
const divisionRef = ref()
// 对话框表单验证规则
const divisionRules = reactive({
    title: [
        { required: true, message: '请输入科室名称', trigger: 'blur' }
    ],
    pic: [
        { required: true, message: '请输入病科室图片路径', trigger: 'blur' }
    ],
})
// 显示添加对话框
const showAddDialog = () => {
    divisionDialogTitle.value = '疾病添加'
    divisionDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    divisionDialogTitle.value = '修改疾病'
    divisionMsg = val
    divisionDialog.value = true
}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/office/add`, divisionMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    divisionDialog.value = false
    getClassifyList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/office/update`, divisionMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    divisionDialog.value = false
    getClassifyList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (divisionDialogTitle.value == '疾病添加') {
                addDialog()
            }
            if (divisionDialogTitle.value == '修改疾病') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}
// 关闭对话框回调函数
const handleClose = () => {
    divisionDialog.value = false
    Object.keys(divisionMsg).forEach((key) => {
        divisionMsg[key] = ''
    })
    getClassifyList()
}

// 删除疾病
const delDivision = (id) => {
    ElMessageBox.confirm(
        '确定要删除该药品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(async () => {
            const res = await proxy.$http.delete(`/office?id=${id}`)
            if (res.code !== 200) {
                return ElMessage.error(res.msg)
            }
            ElMessage.success(res.msg)
            getClassifyList()

        })
        .catch(() => { })
}


onMounted(() => {
    getClassifyList()
})
</script>

<style lang="less" scoped></style>