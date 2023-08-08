<template>
    <header class="sticky top-0 text-white bg-app_primary_color py-10 shadow-xl">
        <button class="h-auto w-10 p-1 bottom-4 right-4 absolute">
            <RouterLink :to="{path : '/create_group', query: { id: route.query.id} }">
                <img class="flex flex-1 h-auto w-icon-sm" src="src/assets/croix-plus.png" alt="Créer groupe">
            </RouterLink>
        </button> 
    </header>
</template>

<script setup>
    import { RouterLink, useRoute } from "vue-router"

    const route = useRoute()

</script>