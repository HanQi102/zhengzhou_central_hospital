<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加药品</el-button>
                </div>
            </template>
            <!--  药品列表表格 -->
            <el-table :data="medicineList.data" border stripe style="width: 100%" show-overflow-tooltip :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="title" label="药名" min-width="140" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="sale_price" label="原价" />
                <el-table-column prop="market_price" label="活动价" />
                <el-table-column prop="company" label="生产厂家" width="280" />
                <el-table-column label="分类操作" min-width="220">
                    <template #default="scope">
                        <el-button size="small" :icon="Edit" color="#13B9C9"
                            @click="showEditDialog(scope.row)">修改</el-button>
                        <el-button size="small" :icon="Postcard" color="#13B9C9">详情</el-button>
                        <el-button size="small" :icon="Delete" color="#13B9C9">删除</el-button>
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
        <el-dialog v-model="MedicineDialog" :title="MedicineDialogTitle" width="70%" @close="handleClose">
            <el-form ref="MedicineRef" :model="MedicineMsg" :rules="MedicineRules" label-width="120px">
                <el-form-item label="药品名称" prop="title">
                    <el-input v-model="MedicineMsg.title" />
                </el-form-item>
                <el-form-item label="原价" prop="sale_price">
                    <el-input v-model="MedicineMsg.sale_price" />
                </el-form-item>
                <el-form-item label="活动价" prop="market_price">
                    <el-input v-model="MedicineMsg.market_price" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="MedicineMsg.type" placeholder="选择类型">
                        <el-option value="中药" />
                        <el-option value="西药" />
                        <el-option value="中成药" />
                        <el-option value="其他" />
                    </el-select>
                </el-form-item>
                <el-form-item label="规格" prop="unit">
                    <el-select v-model="MedicineMsg.unit" placeholder="选择规格">
                        <el-option value="盒" />
                        <el-option value="片" />
                        <el-option value="颗" />
                        <el-option value="贴" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="pic">
                    <el-input v-model="MedicineMsg.pic" />
                </el-form-item>
                <el-form-item label="功能主治" prop="fun">
                    <el-input v-model="MedicineMsg.fun" />
                </el-form-item>
                <el-form-item label="不良反应" prop="bad">
                    <el-input v-model="MedicineMsg.bad" />
                </el-form-item>
                <el-form-item label="禁忌" prop="need">
                    <el-input v-model="MedicineMsg.need" />
                </el-form-item>
                <el-form-item label="生产企业" prop="company">
                    <el-input v-model="MedicineMsg.company" />
                </el-form-item>
                <el-form-item label="批准文号" prop="num">
                    <el-input v-model="MedicineMsg.num" />
                </el-form-item>
                <el-form-item label="详细介绍" prop="detail">
                    <el-input v-model="MedicineMsg.detail" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="MedicineDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(MedicineRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance } from 'element-plus'
import { Edit, Postcard, Delete } from '@element-plus/icons-vue'

const { proxy }: any = getCurrentInstance();

// 药品列表数据
const medicineList = reactive({ data: [] })
// 获取药品列表数据
const getMedicineList = async () => {
    const res = await proxy.$http.get(`/medicine/list?pno=${currentPage.value}&count=${pageSize.value}`)

    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    medicineList.data = res.data
    total.value = res.total
}
// 分页器
const total = ref(1)
const currentPage = ref(1)
const pageSize = ref(5)
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getMedicineList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getMedicineList()
}

// 控制对话框显示隐藏
const MedicineDialog = ref(false)
// 对话框标题
const MedicineDialogTitle = ref()
// 对话框表单数据
let MedicineMsg = reactive({
    title: '',
    sale_price: '',
    market_price: '',
    type: '',
    unit: '',
    pic: '',
    fun: '',
    bad: '',
    need: '',
    company: '',
    num: '',
    detail: '',
})

const MedicineRef = ref()
// 对话框表单验证规则
const MedicineRules = reactive({
    title: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
    sale_price: [{ required: true, message: '请输入药品原价', trigger: 'blur' }],
    market_price: [{ required: true, message: '请输入药品活动价', trigger: 'blur' }],
    type: [{ required: true, message: '请输入药品类型', trigger: 'blur' }],
    unit: [{ required: true, message: '请输入药品规格', trigger: 'blur' }],
    pic: [{ required: true, message: '请输入药品图片路径', trigger: 'blur' }],
    fun: [{ required: true, message: '请输入药品主治功能', trigger: 'blur' }],
    bad: [{ required: true, message: '请输入药品不良反应', trigger: 'blur' }],
    need: [{ required: true, message: '请输入药品禁忌', trigger: 'blur' }],
    company: [{ required: true, message: '请输入药品生产企业', trigger: 'blur' }],
    num: [{ required: true, message: '请输入药品批准文号', trigger: 'blur' }],
    detail: [{ required: true, message: '请输入药品详细介绍', trigger: 'blur' }],
})
// 显示添加对话框
const showAddDialog = () => {
    MedicineDialogTitle.value = '添加药品'
    MedicineDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    MedicineDialogTitle.value = '修改药品'
    MedicineMsg = val
    MedicineDialog.value = true
}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/medicine/add`, MedicineMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    MedicineDialog.value = false
    getMedicineList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/medicine/update`, MedicineMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    MedicineDialog.value = false
    getMedicineList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (MedicineDialogTitle.value == '添加药品') {
                addDialog()
            }
            if (MedicineDialogTitle.value == '修改药品') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}

const handleClose = () => {
    MedicineDialog.value = false
}


onMounted(() => {
    getMedicineList()
})
</script>

<style lang="less" scoped></style>