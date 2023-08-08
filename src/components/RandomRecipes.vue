<template>
    <div class="grid grid-cols-1 gap-6 items-end justify-end pb-28 md:grid-cols-3 md:gap-3 md:grid-flow-row">
        <div
            v-for="recipe in random_recipes_results.recipes"
            :key="recipe.id"
            class="flex overflow-hidden justify-center">
            <div
            class="relative w-52 h-72 p-6 rounded-xl shadow-xl"
            :style="{'background-image': `url(${recipe.image})`, 'background-position': 'center'}">
                <div
                    class="absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-md bg-black bg-opacity-40">
                    <RouterLink :to="{path : '/recipe_infos', query: { id: route.query.id, group_id : route.query.group_id, api_id: recipe.id} }">
                        <h1 class="flex p-2 text-app_primary_color font-bold text-xl">{{ recipe.title }}</h1>
                    </RouterLink>

                    <div class="flex flex-row">
                        <button @click="planifierRepas(recipe.id)" class="h-auto w-10 bottom-4 left-4 absolute rounded-3xl bg-app_primary_color border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100">
                            <img class="p-2" src="../assets/croix-plus.png" alt="créer repas">
                        </button>

                        <!-- <button class="h-auto w-10 bottom-4 left-16 absolute rounded-2xl bg-app_primary_color border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100">
                            <img class="p-2" src="../assets/signet.png" alt="enregistré">
                        </button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { useRoute } from "vue-router";

    const API_KEY = '708a8e7429c0436d98c1bb6fc739f96a'

    const route = useRoute()

    const get_random_receips = async () => {
        try {
            const result = await axios.get(
                `https://api.spoonacular.com/recipes/random?number=15&apiKey=${API_KEY}`
            )
            return result.data

        } catch(error){
            console.log(error)
        }
    }

    const random_recipes_results = await get_random_receips()

    const planifierRepas = (api_id) => {
        window.location.href = `${window.location.origin}/create_repas?id=${route.query.id}&group_id=${route.query.group_id}&api_id=${api_id}`
    }

</script>