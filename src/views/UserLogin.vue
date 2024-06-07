<template>
    <div>
        <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
        <el-form :model="user" label-position="top" @submit.prevent="isLogin ? login() : register()">
            <el-form-item label="Username">
                <el-input v-model="user.username" required></el-input>
            </el-form-item>
            <el-form-item label="Password">
                <el-input type="password" v-model="user.password" required></el-input>
            </el-form-item>
            <el-form-item v-if="!isLogin" label="Email">
                <el-input type="email" v-model="user.email" required></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">{{ isLogin ? 'Login' : 'Register' }}</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="isLogin = !isLogin">{{ isLogin ? 'Switch to Register' : 'Switch to Login' }}</el-button>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import api from '../config/axios';
import { useUserStore } from '@/stores/user';
export default {
    data() {
        return {
            userStore: useUserStore(),
            isLogin: true,
            user: {
                username: '',
                password: '',
                email: ''
            }
        };
    },
    methods: {
        login() {
            console.log('Login:', this.user);
            // 发送登录请求
            api.post('/auth/login', this.user)
                .then(res => {
                    console.log(res);
                    // 如果登录成功，跳转到首页
                    if (res.data.success) {
                        // 保存用户信息
                        this.userStore.setUser(res.data.user);
                        console.log(this.userStore.user);
                        // 判断用户类型
                        if (res.data.user.role === 1) {
                            this.$router.push('/admin');
                            ElMessage.success('Welcome, Admin');
                        } else {
                            this.$router.push('/home');
                            ElMessage.success('Welcome, User');
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                }).finally(() => {
                    // 清空密码
                    this.user.password = '';
                });
        },
        register() {
            console.log('Register:', this.user);
            // 发送注册请求
            api.post('/auth/register', this.user)
                .then(res => {
                    console.log(res);
                    // 如果注册成功，跳转到登录页
                    if (res.data.success) {
                        // 弹窗提示
                        alert('注册成功，请登录');
                        this.isLogin = true;
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-item {
    margin-bottom: 20px;
}

.switch-button {
    text-align: center;
    margin-top: 20px;
}
</style>