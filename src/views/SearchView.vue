<template>
    <div class="container">
        <div class="flex flex-row pt-12 py-11 mb-8 relative">
            <input 
                v-model="search_recipe"
                @input="get_receips"
                type="text" 
                name="search_recipe" 
                placeholder="Chercher une recette"
                class="flex py-2 w-11/12 px-1 bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
            
            <RouterLink :to="{path : '/create_recipe', query: { id: route.query.id, group_id : route.query.group_id} }">
                <button class="flex h-auto w-10 rounded-2xl bg-app_primary_color border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100">
                    <img class="p-2 rounded-2xl" src="/src/assets/croix-plus.png" alt="ajouter recette custom">
                </button>
            </RouterLink>
        </div>
        <div v-if="search_recipe == ''">
            <Suspense>
                <RandomRecipes />
                <template #fallback>
                    <h1>Chargement...</h1>
                </template>
            </Suspense>
        </div>
        <div v-else>
            <div
                v-if="search_recipes_state !== false && search_recipes_results !== null"
                class="grid grid-cols-1 gap-6 items-end justify-end pb-28 md:grid-cols-3 md:gap-3 md:grid-flow-row">
                <div
                    v-for="recipe in search_recipes_results.results"
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
            <div v-if="errorState">
                <h1 class="text-red-500">{{errorMessage}}</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue"
    import RandomRecipes from '../components/RandomRecipes.vue'
    import axios from 'axios'
    import { RouterLink, useRoute } from "vue-router";

    const search_recipe = ref("")
    const query_timeOut = ref(null)

    const search_recipes_results = ref(null)
    const search_recipes_state = ref(false)

    const errorState = ref(null)
    const errorMessage = ref()

    const route = useRoute()
        
    const API_KEY = '708a8e7429c0436d98c1bb6fc739f96a'

    const get_receips = async () => {
        clearTimeout(query_timeOut.value)
        query_timeOut.value = setTimeout(async () => {
            if (search_recipe !== ''){
                try {
                    const result = await axios.get(
                        `https://api.spoonacular.com/recipes/complexSearch?query=${search_recipe.value}&number=10&&apiKey=${API_KEY}`
                    )
                    search_recipes_results.value = result.data
                    search_recipes_state.value = true
                    errorState.value = false
                    return result.data

                } catch(error){
                    search_recipes_state.value = false
                    errorState.value = true
                    errorMessage.value = error.message
                }
            }
        }, 500)
    }

    const planifierRepas = (api_id) => {
        window.location.href = `${window.location.origin}/create_repas?id=${route.query.id}&group_id=${route.query.group_id}&api_id=${api_id}`
    }

</script>