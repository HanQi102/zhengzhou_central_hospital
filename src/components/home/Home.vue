<template>
    <div class="homeBox">
        <el-container>
            <el-header>
                <el-row>
                    <el-col :span="23">
                        <img src="../../assets/logo.png" alt="" @click="$router.push('/home')">
                        <p>郑州大学附属郑州市中心医院医务管理系统</p>
                    </el-col>
                    <el-col :span="1">

                        <el-popconfirm title="确定要退出登录吗?" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="loginOut">
                            <template #reference>
                                <el-icon :size="30">
                                    <SwitchButton />
                                </el-icon>
                            </template>
                        </el-popconfirm>
                    </el-col>
                </el-row>

            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '60px' : '200px'">
                    <p @click="isCollapse = !isCollapse">|||</p>
                    <el-menu active-text-color="#409EFF" background-color="#056F89" class="el-menu-vertical-demo" router
                        :collapse="isCollapse" :collapse-transition="false" unique-opened default-active="2"
                        text-color="#fff">
                        <el-sub-menu :index="item.id.toString()" v-for="(item, index) in menuList" :key="item.id">
                            <template #title>
                                <el-icon>
                                    <component :is="icons[index]" />
                                </el-icon>
                                <span>{{ item.authName }}</span>
                            </template>
                            <el-menu-item :index="itemChil.id.toString()" v-for="(itemChil, index) in item.children"
                                :key="itemChil.id" :route="`/home/${itemChil.path}`"
                                @click="showTitle(item.authName, itemChil.authName)">{{
                                    itemChil.authName
                                }}</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb :separator-icon="ArrowRight" v-if="$route.path != '/home/welcome'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ breadcrumbList.itemAuthName }}</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ breadcrumbList.itemChilAuthName }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// 路由跳转
const router = useRouter()

const { proxy }: any = getCurrentInstance();

// menu菜单列表数据
const menuList = ref([])

// 获取menu菜单列表数据
const getMenuList = async () => {
    const res = await proxy.$http.get('/menu/list')
    if (res.code !== 200) {
        return ElMessage.error(res.msg)
    }
    menuList.value = res.data;
    console.log(menuList.value)
}

//侧边栏图标数组
const icons = reactive([
    'User',
    'SwitchFilled',
    'Document',
    'MessageBox',
    'Location',
    'Shop',
    'Orange',
    'Suitcase',
    'VideoPlay'
])
// menu菜单折叠
const isCollapse = ref(false)

// 退出登录
const loginOut = () => {
    sessionStorage.removeItem('token');
    router.push('/login');
};
// 面包屑数据
let breadcrumbList = reactive({
    itemAuthName: '',
    itemChilAuthName: ''
}
)
const showTitle = (itemAuthName: string, itemChilAuthName: string) => {
    breadcrumbList.itemAuthName = itemAuthName
    breadcrumbList.itemChilAuthName = itemChilAuthName


}
onMounted(() => {
    getMenuList()
})
</script>

<style lang="less" scoped>
.homeBox {
    width: 100%;
    height: 100%;
    background-color: rgb(90, 204, 204);


    .el-container {
        height: 100%;

        .el-header {
            background-color: #13B9C9;
            color: white;

            .el-col {
                display: flex;
                align-items: center;
                height: 60px;

                img {
                    width: 50px;
                    height: 50px;
                    cursor: pointer;
                }

                p {
                    font-size: 20px;
                    letter-spacing: 3px;
                    margin-left: 30px;
                }

                .el-icon {
                    cursor: pointer;
                }
            }
        }

        .el-aside {
            // height: calc(100vh - 60px);
            height: 100%;
            background-color: #056F89;

            p {
                width: 100%;
                height: 34px;
                letter-spacing: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                background-color: #056F89;
                cursor: pointer;

                &:hover {
                    background-color: #04596E;
                }
            }

            .el-menu {
                border: none;
            }
        }

        // .el-mian {
        //     --el-main-padding: 0 !important;
        // }
        .el-main {
            background: url(../../assets/mainBj.cd9d9983.jpg);
            background-size: cover;
        }
    }
}
</style>