<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加疾病</el-button>
                </div>
            </template>
            <el-table :data="sicknessList.data" border stripe style="width: 100%" show-overflow-tooltip :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="title" label="疾病名称" min-width="80" />
                <el-table-column prop="profile" label="疾病描述" min-width="200" />
                <el-table-column prop="symptom" label="症状" min-width="180" />
                <el-table-column prop="diagnose" label="诊断" min-width="180" />
                <el-table-column label="分类操作" min-width="200">
                    <template #default="scope">
                        <el-button color="#13B9C9" @click="showEditDialog(scope.row)">修改疾病</el-button>
                        <el-button color="#13B9C9" @click="delSickness(scope.row.did)">删除疾病</el-button>
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
        <el-dialog v-model="sicknessDialog" :title="sicknessDialogTitle" width="50%" @close="handleClose">
            <el-form ref="sicknessRef" :model="sicknessMsg" :rules="sicknessRules" label-width="100px">
                <el-form-item label="疾病名称:" prop="title">
                    <el-input v-model="sicknessMsg.title" />
                </el-form-item>
                <el-form-item label="疾病描述:" prop="profile">
                    <el-input v-model="sicknessMsg.profile" />
                </el-form-item>
                <el-form-item label="症状:" prop="symptom">
                    <el-input v-model="sicknessMsg.symptom" />
                </el-form-item>
                <el-form-item label="诊断:" prop="diagnose">
                    <el-input v-model="sicknessMsg.diagnose" type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="sicknessDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(sicknessRef)">
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
const sicknessList = reactive({ data: [] })
const getClassifyList = async () => {
    const res = await proxy.$http.get(`/disease/list?pno=${currentPage.value}&count=${pageSize.value}`)
    if (res.code !== 200) {
        return ElMessage.error('疾病列表获取失败')
    }
    sicknessList.data = res.data
    total.value = res.total
}
// 分页器
const total = ref(1)
const currentPage = ref(1)
const pageSize = ref(5)
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getClassifyList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getClassifyList()
}

// 对话框表单数据
let sicknessMsg = reactive({
    title: '',
    profile: '',
    symptom: '',
    diagnose: '',
    mtime: ''
})
// 控制对话框显示隐藏
const sicknessDialog = ref(false)
// 对话框标题
const sicknessDialogTitle = ref()
const sicknessRef = ref()
// 对话框表单验证规则
const sicknessRules = reactive({
    title: [
        { required: true, message: '请输入疾病名称', trigger: 'blur' }
    ],
    profile: [
        { required: true, message: '请输入病描述', trigger: 'blur' }
    ],
    symptom: [
        { required: true, message: '请输入症状', trigger: 'blur' }
    ],
    diagnose: [
        { required: true, message: '请输入断', trigger: 'blur' }
    ]
})
// 显示添加对话框
const showAddDialog = () => {
    sicknessDialogTitle.value = '疾病添加'
    sicknessDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    sicknessDialogTitle.value = '修改疾病'
    sicknessMsg = val
    sicknessDialog.value = true
}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/disease/add`, sicknessMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    sicknessDialog.value = false
    getClassifyList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/disease/update`, sicknessMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    sicknessDialog.value = false
    getClassifyList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (sicknessDialogTitle.value == '疾病添加') {
                addDialog()
            }
            if (sicknessDialogTitle.value == '修改疾病') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}
// 关闭对话框回调函数
const handleClose = () => {
    sicknessDialog.value = false
    Object.keys(sicknessMsg).forEach((key) => {
        sicknessMsg[key] = ''
    })
    getClassifyList()
}

// 删除疾病
const delSickness = (id) => {
    ElMessageBox.confirm(
        '确定要删除该药品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(async () => {
            const res = await proxy.$http.delete(`/disease?did=${id}`)
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