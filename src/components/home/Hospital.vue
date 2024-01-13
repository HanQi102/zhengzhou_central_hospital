<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加医院</el-button>
                </div>
            </template>
            <!--  医院列表表格 -->
            <el-table :data="hospitalList.data" border stripe style="width: 100%" show-overflow-tooltip :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="title" label="医院名称" min-width="100" />
                <el-table-column prop="grade" label="级别">
                    <template #default="scope">
                        <p v-if="scope.row.grade == 1">三甲医院</p>
                        <p v-else-if="scope.row.grade == 2">三乙医院</p>
                        <p v-else-if="scope.row.grade == 3">二甲医院</p>
                        <p v-else-if="scope.row.grade == 4">一甲医院</p>
                    </template>
                </el-table-column>
                <el-table-column prop="province" label="省份(直辖市)" min-width="80" />
                <el-table-column prop="addr" label="地址" min-width="120" />
                <el-table-column prop="phone" label="电话" min-width="100" />
                <el-table-column label="分类操作" min-width="260">
                    <template #default="scope">
                        <el-button color="#13B9C9" @click="showEditDialog(scope.row)">修改医院</el-button>
                        <el-button color="#13B9C9" @click="delHospital(scope.row.id)">删除医院</el-button>
                        <el-button color="#13B9C9" @click="showDialog(scope.row)"> 医院详情
                        </el-button>
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
        <el-dialog v-model="hospitalDialog" :title="hospitalDialogTitle" width="70%" @close="handleClose"
            v-if="hospitalDialogTitle != '医院详情'">
            <el-form ref="hospitalRef" :model="hospitalMsg" :rules="hospitalRules" label-width="120px">
                <el-form-item label="医院名称" prop="title">
                    <el-input v-model="hospitalMsg.title" />
                </el-form-item>
                <el-form-item label="级别" prop="grade">
                    <el-select v-model="hospitalMsg.grade" placeholder="选择级别">
                        <el-option v-for="item in hospitalOptions" :value="item.desc" :label="item.label" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="pic">
                    <el-input v-model="hospitalMsg.pic" />
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-select v-model="hospitalMsg.province" placeholder="选择省份">
                        <el-option value="北京市" />
                        <el-option value="天津市" />
                        <el-option value="重庆市" />
                        <el-option value="上海市" />
                        <el-option value="河北省" />
                        <el-option value="河南省" />
                        <el-option value="山西省" />
                        <el-option value="辽宁省" />
                        <el-option value="吉林省" />
                        <el-option value="黑龙江省" />
                        <el-option value="广东省" />
                        <el-option value="四川省" />
                        <el-option value="山东省" />
                        <el-option value="湖北省" />
                        <el-option value="湖南省" />
                        <el-option value="广东省" />
                        <el-option value="贵州省" />
                        <el-option value="云南省" />
                        <el-option value="陕西省" />
                        <el-option value="甘肃省" />
                        <el-option value="青海省" />
                        <el-option value="广西壮族自治区" />
                        <el-option value="内蒙古自治区" />
                        <el-option value="西藏自治区" />
                        <el-option value="宁夏回族自治区" />
                        <el-option value="新疆维吾尔自治区" />
                        <el-option value="香港特别行政区" />
                        <el-option value="澳门特别行政区" />
                        <el-option value="台湾省" />
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="addr">
                    <el-input v-model="hospitalMsg.addr" />
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="hospitalMsg.phone" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="hospitalDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(hospitalRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 详情对话框 -->
        <el-dialog v-model="hospitalDialog" :title="hospitalDialogTitle" width="70%" @close="handleClose" v-else>
            <el-form ref="hospitalRef" :model="hospitalMsg" :rules="hospitalRules" label-width="120px">
                <el-form-item label="医院名称" prop="title">
                    <h3>{{ hospitalMsg.title }}</h3>
                </el-form-item>
                <el-form-item label="级别" prop="grade">
                    <p v-if="hospitalMsg.grade == '1'">三甲医院</p>
                    <p v-else-if="hospitalMsg.grade == '2'">三乙医院</p>
                    <p v-else-if="hospitalMsg.grade == '3'">二甲医院</p>
                    <p v-else-if="hospitalMsg.grade == '4'">一甲医院</p>
                </el-form-item>
                <el-form-item label="图片" prop="pic">
                    <img :src="hospitalMsg.pic" style="width: 600px; " fit="fit" />
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <p>{{ hospitalMsg.province }}</p>
                </el-form-item>
                <el-form-item label="地址" prop="addr">
                    <p>{{ hospitalMsg.addr }}</p>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <p>{{ hospitalMsg.phone }}</p>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance, ElMessageBox } from 'element-plus'

const { proxy }: any = getCurrentInstance();

// 医院列表数据
let hospitalList = reactive({ data: [] })
// 获取医院列表数据
const getHospitalList = async () => {
    const res = await proxy.$http.get(`/hospital/list?title=${hospitalMsg.title}&pno=${currentPage.value}&count=${pageSize.value}`)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    hospitalList.data = res.data
    total.value = res.total
    console.log(res);
}
// 分页器
const total = ref(1)
const currentPage = ref(1)
const pageSize = ref(5)
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getHospitalList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getHospitalList()
}

// 控制对话框显示隐藏
const hospitalDialog = ref(false)
// 对话框标题
const hospitalDialogTitle = ref()
// 对话框表单数据
let hospitalMsg = reactive({
    title: '',
    grade: '',
    pic: '',
    province: '',
    addr: '',
    phone: '010-66939206',
})
// 对话框表单Select 选择器数据
const hospitalOptions = ref([
    { id: 1, label: '一甲医院', desc: 4 },
    { id: 2, label: '二甲医院', desc: 3 },
    { id: 3, label: '三甲医院', desc: 1 },
    { id: 4, label: '三乙医院', desc: 2 },
])

const hospitalRef = ref()
// 对话框表单验证规则
const hospitalRules = reactive({
    title: [{ required: true, message: '请输入医院名称', trigger: 'blur' }],
    grade: [{ required: true, message: '请输入医院级别', trigger: 'blur' }],
    pic: [{ required: true, message: '请输入医院图片路径', trigger: 'blur' }],
    province: [{ required: true, message: '请输入医院省份', trigger: 'blur' }],
    addr: [{ required: true, message: '请输入医院详细地址', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入医院电话', trigger: 'blur' }],
})
// 显示添加对话框
const showAddDialog = () => {
    hospitalDialogTitle.value = '添加医院'
    hospitalDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    hospitalDialogTitle.value = '修改医院'
    hospitalMsg = val
    hospitalDialog.value = true
}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/hospital/add`, hospitalMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    hospitalDialog.value = false
    getHospitalList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/hospital/update`, hospitalMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    hospitalDialog.value = false
    getHospitalList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (hospitalDialogTitle.value == '添加医院') {
                addDialog()
            }
            if (hospitalDialogTitle.value == '修改医院') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}
// 关闭对话框回调函数
const handleClose = () => {
    hospitalDialog.value = false
    Object.keys(hospitalMsg).forEach((key) => {
        hospitalMsg[key] = ''
    })
    getHospitalList()
}

// 删除医院数据
const delHospital = (id) => {
    ElMessageBox.confirm(
        '确定要删除该医院吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            console.log(id);

            const res = await proxy.$http.delete(`/hospital?id=${id}`)

            if (res.code !== 200) {
                return ElMessage.error(res.msg)
            }
            ElMessage.success(res.msg)
            getHospitalList()
        }).catch(() => { })
}

// 显示详情对话框
const showDialog = (v) => {
    hospitalDialogTitle.value = '医院详情'
    hospitalMsg = v
    hospitalDialog.value = true
}

onMounted(() => {
    getHospitalList()
})
</script>

<style lang="less" scoped></style>