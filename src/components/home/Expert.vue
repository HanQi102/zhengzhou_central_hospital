<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加专家</el-button>
                </div>
            </template>
            <el-table :data="expertList.data" border stripe style="width: 100%" show-overflow-tooltip :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="name" label="姓名" min-width="80" />
                <el-table-column prop="title" label="职称" min-width="80" />
                <el-table-column prop="hospital_id" label="所属医院" min-width="80" />
                <el-table-column prop="office_id" label="所属科室" min-width="80" />
                <el-table-column prop="goodat" label="擅长诊治" min-width="80" />
                <el-table-column prop="profile" label="详细描述" min-width="80" />
                <el-table-column label="分类操作" min-width="200">
                    <template #default="scope">
                        <el-button color="#13B9C9" @click="showEditDialog(scope.row)">修改专家</el-button>
                        <el-button color="#13B9C9" @click="delExpert(scope.row.id)">删除专家</el-button>
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
        <el-dialog v-model="expertDialog" :title="expertDialogTitle" width="70%" @close="handleClose">
            <el-form ref="expertRef" :model="expertMsg" :rules="expertRules" label-width="100px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="expertMsg.name" />
                </el-form-item>
                <el-form-item label="所属医院" prop="hospital_id">
                    <el-select v-model="expertMsg.hospital_id" placeholder="选择医院">
                        <el-option value="乐清市人民医院" />
                        <el-option value="北京安贞医院" />
                        <el-option value="中国人民解放军总医院" />
                        <el-option value="北京协和医院" />
                        <el-option value="郑州大学第一附属医院" />
                        <el-option value="湘雅医院" />
                        <el-option value="承德县医院" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属科室" prop="office_id">
                    <el-select v-model="expertMsg.office_id" placeholder="选择科室">
                        <el-option value="心内科" />
                        <el-option value="耳鼻喉科" />
                        <el-option value="呼吸内科" />
                        <el-option value="外科" />
                        <el-option value="内科" />
                        <el-option value="妇产科" />
                        <el-option value="肿瘤科" />
                        <el-option value="口腔科" />
                        <el-option value="康复科" />
                        <el-option value="检验科" />
                        <el-option value="急诊科" />
                    </el-select>
                </el-form-item>
                <el-form-item label="职称" prop="title">
                    <el-select v-model="expertMsg.title" placeholder="选择职称">
                        <el-option value="医师" />
                        <el-option value="主治医师" />
                        <el-option value="副主任医师" />
                        <el-option value="主任医师" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="header_pic">
                    <el-input v-model="expertMsg.header_pic" />
                </el-form-item>
                <el-form-item label="擅长诊治" prop="goodat">
                    <el-input v-model="expertMsg.goodat" />
                </el-form-item>
                <el-form-item label="详细描述" prop="profile">
                    <el-input v-model="expertMsg.profile" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="expertDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(expertRef)">
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
// 专家列表表格数据
const expertList = reactive({ data: [] })
const getClassifyList = async () => {
    const res = await proxy.$http.get(`/expert/list?pno=${currentPage.value}&count=${pageSize.value}`)
    if (res.code !== 200) {
        return ElMessage.error('专家列表获取失败')
    }
    expertList.data = res.data
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
let expertMsg = reactive({
    name: '',
    hospital_id: '',
    office_id: '',
    title: '',
    header_pic: '',
    img_charge: '',
    video_charge: '',
    num: '',
    goodat: '',
    profile: '',
    id_pic: '',
    license_pic: '',
})
// 控制对话框显示隐藏
const expertDialog = ref(false)
// 对话框标题
const expertDialogTitle = ref()
const expertRef = ref()
// 对话框表单验证规则
const expertRules = reactive({
    name: [
        { required: true, message: '请输入专家姓名', trigger: 'blur' }
    ],
    hospital_id: [
        { required: true, message: '请选择专家所属医院', trigger: 'blur' }
    ],
    office_id: [
        { required: true, message: '请选择专家所属科室', trigger: 'blur' }
    ],
    title: [
        { required: true, message: '请选择专家职称', trigger: 'blur' }
    ],
    header_pic: [
        { required: true, message: '请输入专家图片路径', trigger: 'blur' }
    ],
    goodat: [
        { required: true, message: '请输入专家擅长诊治', trigger: 'blur' }
    ],
    profile: [
        { required: true, message: '请输入专家详细描述', trigger: 'blur' }
    ],
})
// 显示添加对话框
const showAddDialog = () => {
    expertDialogTitle.value = '专家添加'
    expertDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    expertDialogTitle.value = '修改专家'
    expertMsg = val
    expertDialog.value = true
}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/expert/add`, expertMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    expertDialog.value = false
    getClassifyList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/expert/update`, expertMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    expertDialog.value = false
    getClassifyList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (expertDialogTitle.value == '专家添加') {
                addDialog()
            }
            if (expertDialogTitle.value == '修改专家') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}
// 关闭对话框回调函数
const handleClose = () => {
    expertDialog.value = false
    Object.keys(expertMsg).forEach((key) => {
        expertMsg[key] = ''
    })
    getClassifyList()
}

// 删除专家
const delExpert = (id) => {
    ElMessageBox.confirm(
        '确定要删除该药品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(async () => {
            const res = await proxy.$http.delete(`/expert?id=${id}`)
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