<template>
    <div class="welcomeBox">
        <img src="../../assets/zhengzhouHospital.svg" alt="">
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

</script>

<style lang="less" scoped>
.welcomeBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 70%;
    }
}
</style>