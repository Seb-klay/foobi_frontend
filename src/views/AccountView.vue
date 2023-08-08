<template>
    <div>
        <div v-if="hasToLogin">
            <Suspense>
                <UserInfos />
                <template #fallback>
                    <div class="container text-center text-4xl pt-12">Chargement...</div>
                </template>
            </Suspense>
        </div>
        <div v-else>
            <LoginVue />
        </div>
    </div>
</template>

<script setup>
    import UserInfos from '../components/UserInfos.vue'
    import LoginVue from '../components/Login.vue'
    import { useRoute } from "vue-router"
    import { ref } from 'vue'

    const route = useRoute()

    const hasToLogin = route.query.id !== undefined

    

</script>
