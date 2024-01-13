<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-button color="#13B9C9" @click="showAddDialog">添加文章</el-button>
                </div>
            </template>
            <!--  文章列表表格 -->
            <el-table :data="articleList.data" border stripe style="width: 100%" show-overflow-tooltip :header-cell-style="{
                backgroundColor: '#89DCE4',
                color: '#333333'
            }">
                <el-table-column prop="title" label="文章标题" min-width="140" />
                <el-table-column prop="author" label="作者" />
                <el-table-column prop="cat_id" label="分类" />
                <el-table-column label="分类操作" min-width="260">
                    <template #default="scope">
                        <el-button color="#13B9C9" @click="showEditDialog(scope.row)">修改文章</el-button>
                        <el-button color="#13B9C9" @click="delArticle(scope.row.aid)">删除文章</el-button>
                        <el-button color="#13B9C9" @click="showDialog(scope.row)"> 文章详情
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
        <el-dialog v-model="articleDialog" :title="articleDialogTitle" width="50%" @close="handleClose"
            v-if="articleDialogTitle != '文章详情'">
            <el-form ref="ArticleRef" :model="articleMsg" :rules="ArticleRules" label-width="120px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="articleMsg.title" />
                </el-form-item>
                <el-form-item label="分类" prop="cat_id">
                    <el-select v-model="articleMsg.cat_id" placeholder="选择分类">
                        <el-option value="教育" />
                        <el-option value="科学" />
                        <el-option value="体育" />
                        <el-option value="娱乐" />
                        <el-option value="国际" />
                        <el-option value="军事" />
                        <el-option value="时尚" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="pic">
                    <el-input v-model="articleMsg.pic" />
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="articleMsg.author" />
                </el-form-item>
                <el-form-item label="文章详情" prop="detail">
                    <el-input v-model="articleMsg.detail" type="textarea" />
                </el-form-item>
                <el-form-item label="ctime" prop="ctime">
                    <el-input v-model="articleMsg.ctime" />
                </el-form-item>
                <el-form-item label="is_rec" prop="is_rec">
                    <el-select v-model="articleMsg.is_rec" placeholder="选择rec">
                        <el-option value="0" />
                        <el-option value="1" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="articleDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(ArticleRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 详情对话框 -->
        <el-dialog v-model="articleDialog" :title="articleDialogTitle" width="50%" @close="handleClose" v-else>
            <el-form ref="ArticleRef" :model="articleMsg" :rules="ArticleRules" label-width="120px">
                <el-form-item label="标题" prop="title">
                    <h2>{{ articleMsg.title }}</h2>
                </el-form-item>
                <el-form-item label="分类" prop="cat_id">
                    <p>{{ articleMsg.cat_id }}</p>
                </el-form-item>
                <el-form-item label="图片" prop="pic">
                    <el-image :src="articleMsg.pic" />
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <p>{{ articleMsg.author }}</p>
                </el-form-item>
                <el-form-item label="文章详情" prop="detail">
                    <p>{{ articleMsg.detail }}</p>
                </el-form-item>
                <el-form-item label="ctime" prop="ctime">
                    <p>{{ articleMsg.ctime }}</p>
                </el-form-item>
                <el-form-item label="is_rec" prop="is_rec">
                    <p>{{ articleMsg.is_rec }}</p>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance, ElMessageBox } from 'element-plus'

const { proxy }: any = getCurrentInstance();

// 文章列表数据
const articleList = reactive({ data: [] })
// 获取文章列表数据
const getArticleList = async () => {
    const res = await proxy.$http.get(`/news/article/list?pno=${currentPage.value}&count=${pageSize.value}`)

    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    articleList.data = res.data
    total.value = res.total
}
// 分页器
const total = ref(1)
const currentPage = ref(1)
const pageSize = ref(5)
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getArticleList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getArticleList()
}

// 控制对话框显示隐藏
const articleDialog = ref(false)
// 对话框标题
const articleDialogTitle = ref()
// 对话框表单数据
let articleMsg = reactive({
    title: '',
    cat_id: '',
    pic: '',
    author: '',
    detail: '',
    ctime: '1672300000000',
    is_rec: '',
})

const ArticleRef = ref()
// 对话框表单验证规则
const ArticleRules = reactive({
    title: [{ required: true, message: '请输入文章名称', trigger: 'blur' }],
    cat_id: [{ required: true, message: '请输入文章分类', trigger: 'blur' }],
    pic: [{ required: true, message: '请输入文章图片路径', trigger: 'blur' }],
    author: [{ required: true, message: '请输入文章作者', trigger: 'blur' }],
    detail: [{ required: true, message: '请输入文章详情', trigger: 'blur' }],
    ctime: [{ required: true, message: '请输入文章ctime', trigger: 'blur' }],
    is_rec: [{ required: true, message: '请输入文章is_rec', trigger: 'blur' }],
})
// 显示添加对话框
const showAddDialog = () => {
    articleDialogTitle.value = '添加文章'
    articleDialog.value = true
}
// 显示修改对话框
const showEditDialog = (val) => {
    articleDialogTitle.value = '修改文章'
    articleMsg = val
    articleDialog.value = true
    console.log(articleMsg);

}
// 添加对话框事件
const addDialog = async () => {
    const res = await proxy.$http.post(`/news/article/add`, articleMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    articleDialog.value = false
    getArticleList()
}
// 修改对话框事件
const editDialog = async () => {
    const res = await proxy.$http.put(`/news/article/update`, articleMsg)
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    ElMessage.success(res.msg)
    articleDialog.value = false
    getArticleList()
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (articleDialogTitle.value == '添加文章') {
                addDialog()
            }
            if (articleDialogTitle.value == '修改文章') {
                editDialog()
            }
        } else {
            ElMessage.error('表单验证失败请查看是否有输入不合格！')
        }
    })
}
// 关闭对话框回调函数
const handleClose = () => {
    articleDialog.value = false
    Object.keys(articleMsg).forEach((key) => {
        articleMsg[key] = ''
    })
    getArticleList()
}

// 删除文章数据
const delArticle = (id) => {
    ElMessageBox.confirm(
        '确定要删除该文章吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            const res = await proxy.$http.delete(`/news/article?id=${id}`)
            if (res.code !== 200) {
                return ElMessage.error(res.msg)
            }
            ElMessage.success(res.msg)
            getArticleList()
        }).catch(() => { })
}

// 显示详情对话框
const showDialog = (v) => {
    articleDialogTitle.value = '文章详情'
    articleMsg = v
    articleDialog.value = true
}

onMounted(() => {
    getArticleList()
})
</script>

<style lang="less" scoped></style>