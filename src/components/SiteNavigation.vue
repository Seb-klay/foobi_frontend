<template>
    <footer class="fixed bottom-0 drop-shadow-[35px_35px_0_rgba(0,0,0,0.25)] w-full bg-app_secondary_color z-50">
        <nav class="container px-6 pt-3">
            <div class="mb-6 flex justify-center">
                <RouterLink :to="{path : '/', query: { id: route.query.id, group_id : route.query.group_id} }" class="mx-auto h-full w-14 focus:bg-app_primary_color py-4 px-4 rounded-md">
                    <img  src="/src/assets/loger.png" alt="accueil">
                </RouterLink>
                <RouterLink :to="{path : '/search', query: { id: route.query.id, group_id : route.query.group_id} }" class="mx-auto h-full w-14 focus:bg-app_primary_color py-4 px-4 rounded-md">
                    <img src="/src/assets/loupe.png" alt="recherche repas">
                </RouterLink>
                <RouterLink :to="{ path: '/account', query: { id: route.query.id, group_id : route.query.group_id} }" class="mx-auto h-full w-14 focus:bg-app_primary_color py-4 px-4 rounded-md">
                    <img src="/src/assets/utilisateur.png" alt="compte">
                </RouterLink>
                <RouterLink :to="{path : '/calendar', query: { id: route.query.id, group_id : route.query.group_id} }" class="mx-auto h-full w-14 focus:bg-app_primary_color py-4 px-4 rounded-md">
                    <img src="/src/assets/calendar-days.png" alt="calendrier">
                </RouterLink>
                <RouterLink :to="{path : '/list', query: { id: route.query.id, group_id : route.query.group_id} }" class="mx-auto h-full w-14 focus:bg-app_primary_color py-4 px-4 rounded-md">
                    <img src="/src/assets/livre-de-recettes.png" alt="liste de courses">
                </RouterLink>
            </div>
        </nav>
    </footer>
</template>

<script setup>
    import { RouterLink, useRoute } from "vue-router"
    import { ref } from 'vue'

    const route = useRoute()

</script>