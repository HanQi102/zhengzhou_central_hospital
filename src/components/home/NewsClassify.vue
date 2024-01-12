<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加分类</el-button>
                </div>
            </template>
            <el-table :data="classifyList.data" border stripe style="width: 100%" :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="id" label="分类ID" min-width="80" />
                <el-table-column prop="cname" label="分类名称" min-width="180" />
                <el-table-column label="分类操作" min-width="220">
                    <template #default="scope">
                        <el-button color="#13B9C9" @click="showEditDialog(scope.row)">修改分类</el-button>
                        <el-button color="#13B9C9" @click="delclassify(scope.row.id)">删除分类</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加修改对话框 -->
        <el-dialog v-model="classifyDialog" :title="classifyDialogTitle" width="50%" @close="handleClose">
            <el-form ref="classifyRef" :model="classifyMsg" :rules="classifyRules" label-width="100px">
                <el-form-item label="分类名称:" prop="cname">
                    <el-input v-model="classifyMsg.cname" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="classifyDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(classifyRef)">
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
// 新闻分类列表表格数据
const classifyList = reactive({ data: [] })
const getClassifyList = async () => {
    const res = await proxy.$http.get(`/news/cat/list`)
    if (res.code !== 200) {
        return ElMessage.error('新闻分类列表获取失败')
    }
    classifyList.data = res.data
}

// 对话框表单数据
let classifyMsg = reactive({
    cname: ''
})
// 控制对话框显示隐藏
const classifyDialog = ref(false)
// 对话框标题
const classifyDialogTitle = ref()
const classifyRef = ref()
// 对话框表单验证规则
const classifyRules = reactive({
    cname: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
})
// 显示添加对话框
const showAddDialog = () => {
    classifyDialogTitle.value = '添加新闻分类'
    classifyDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    classifyDialogTitle.value = '修改新闻分类'
    classifyMsg = val
    classifyDialog.value = true
}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/news/cat/add`, classifyMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    classifyDialog.value = false
    getClassifyList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/news/cat/update`, classifyMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    classifyDialog.value = false
    getClassifyList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (classifyDialogTitle.value == '添加新闻分类') {
                addDialog()
            }
            if (classifyDialogTitle.value == '修改新闻分类') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}
// 关闭对话框回调函数
const handleClose = () => {
    classifyDialog.value = false
    Object.keys(classifyMsg).forEach((key) => {
        classifyMsg[key] = ''
    })
    getClassifyList()
}

// 删除新闻分类
const delclassify = (id) => {
    ElMessageBox.confirm(
        '确定要删除该药品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(async () => {
            const res = await proxy.$http.delete(`/news/cat?id=${id}`)
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