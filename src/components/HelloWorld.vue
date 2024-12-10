<template>
    <h2>{{ msg }}</h2>
</template>

<script setup lang="ts">
// import { ref } from 'vue'

// import {
//     Check,
//     Delete,
//     Edit,
//     Message,
//     Search,
//     Star,
//     Share,
//     Upload 
// } from '@element-plus/icons-vue'

defineProps<{ msg: string }>()

</script>

<style scoped>
</style>
