<template>
    <div class="loginBox">
        <!-- 登录表单 -->
        <el-form ref="loginRef" :model="loginInfo" :rules="LoginRules">
            <el-form-item prop="uname">
                <el-input v-model="loginInfo.uname" />
            </el-form-item>
            <el-form-item prop="upwd">
                <el-input v-model="loginInfo.upwd" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(loginRef)">
                    登录
                </el-button>
                <el-button @click="resetForm(loginRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// 路由跳转
const router = useRouter()
const { proxy }: any = getCurrentInstance()
// 登录表单数据
const loginInfo = reactive({
    uname: 'admin',
    upwd: '123456',
})
const loginRef = ref()
// 登录表单验证规则
const LoginRules = {
    uname: [
        { required: true, message: '请输入用户名', trigger: 'change' },
        { min: 5, max: 10, message: '用户名为5-10个字符', trigger: 'change' }
    ],
    upwd: [{ required: true, message: '请输入密码', trigger: 'change' },
    { min: 6, max: 12, message: '密码为6-12个字符', trigger: 'change' }],
}
// 登录事件
const login = async () => {
    const res = await proxy.$http.post('/users/login', loginInfo);
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    sessionStorage.setItem('token', res.token)
    ElMessage({
        type: 'success',
        message: res.msg,
        duration: 800,
        onClose: () => {
            router.push('/home')
        }
    })

}
// 登录按钮
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            login()
        } else {
            ElMessage.error('用户名或密码输入不合格！')
        }
    })
}
// 重置按钮
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}


</script>

<style lang="less" scoped>
.loginBox {
    width: 100%;
    height: 100%;
    background: url(../../assets/bj2.png);
    background-size: cover;
    position: relative;

    .el-form {
        width: 260px;
        border: 3px solid #54B9C9;
        padding: 30px 20px;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 70%;
    }
}
</style>