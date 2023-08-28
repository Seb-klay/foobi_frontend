<template>
    <div class="container h-full">
        <div v-if="route.query.api_id !== undefined">
            <div class="flex flex-col w-full justify-center pb-10 overflow-scroll" v-if="recipe_result !== null">
                <div class="flex pt-6 md:pt-12 w-full justify-center md:rounded-xl pb-4">
                    <img class="rounded-xl" :src=recipe_result.image alt="">
                </div>
                <h1 class="flex pt-6 md:pt-12 text-2xl justify-center">{{recipe_result.title}}</h1>
                <h1 class="flex text-xl justify-center">{{recipe_result.servings}} personnes</h1>
                <h1 class="flex pb-6 md:pb-12 text-xl justify-center">{{recipe_result.readyInMinutes}} minutes</h1>

                <div class="flex flex-col justify-center pb-24">
                    <h1 class="flex bg-app_primary_color rounded-xl shadow-xl p-1 text-black">Ingrédients :</h1>
                    <div
                        class="flex flex-row pt-3 overflow-y-scroll"
                        v-for="ingr in recipe_result.extendedIngredients" :key="ingr.id">
                        <h1 class="px-1">{{ingr.measures.metric.amount}}</h1>
                        <h1 class="px-1">{{ingr.measures.metric.unitLong}}</h1>
                        <h1 class="px-1">{{ingr.name}}</h1>
                    </div>
                    <div class="py-4"></div>
                    <h1 class="flex bg-app_primary_color rounded-xl shadow-xl p-1 text-black">Méthodologie :</h1>
                    <h1 class="py-4">{{recipe_result.instructions}}</h1>

                    <button 
                        @click="recordRecipe()"
                        class="w-full rounded-xl border border-app_primary_color">
                        <h1 class="text-xl text-app_primary_color">Enregistrer</h1>
                    </button>
                </div>
            </div>
        </div>
        <div v-else-if="route.query.recipe_id !== undefined">
            <div class="flex flex-col w-full justify-center pb-10 overflow-scroll" v-if="recipe_result !== null">
                <h1 class="flex pt-6 md:pt-12 text-2xl justify-center">{{recipe_result.title}}</h1>
                <h1 class="flex text-xl justify-center">{{recipe_result.nb_people}} personnes</h1>

                <div class="flex flex-col justify-center pb-24">
                    <h1 class="flex bg-app_primary_color rounded-xl shadow-xl p-1 text-black">Ingrédients :</h1>
                    <div
                        class="flex flex-row pt-3 overflow-y-scroll"
                        v-for="ingr in recipe_result.ingredients" :key="ingr.id">
                        <h1 class="px-1">{{ingr.quantity}}</h1>
                        <h1 class="px-1">{{ingr.metric}}</h1>
                        <h1 class="px-1">{{ingr.ingredient}}</h1>
                    </div>
                    <div class="py-4"></div>
                    <h1 class="flex bg-app_primary_color rounded-xl shadow-xl p-1 text-black">Méthodologie :</h1>
                    <h1 class="py-4">{{recipe_result.methodology}}</h1>
                </div>
            </div>
        </div>
        <div v-else-if="errorState == true">
            {{ errorMessage }}
            <NotFoundComp />
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from "vue-router"
    import axios from 'axios'
    import qs from 'qs'
    import { ref, onMounted } from "vue"
    import NotFoundComp from '../components/NotFound.vue'

    const backend_url = 'https://foobi.jcloud.ik-server.com/'
    //const backend_url = 'http://127.0.0.1:8080'

    const API_KEY = '708a8e7429c0436d98c1bb6fc739f96a'

    const route = useRoute()

    const get_receips_api = async () => {
        if (route.query.api_id !== undefined){
            try {
                const result = await axios.get(
                    `https://api.spoonacular.com/recipes/${route.query.api_id}/information?apiKey=${API_KEY}`
                )
                recipe_result.value = result.data
            } catch(error){
                errorState.value = true
                errorMessage.value = error.message
            }
        }
    }

    const get_receips = async () => {
        if (route.query.recipe_id !== undefined){
            try {
                const result = await axios.get(
                    `${backend_url}/get_info_recette?recipe_id=${route.query.recipe_id}`
                )
                recipe_result.value = result.data
            } catch(error){
                errorState.value = true
                errorMessage.value = error.message
            }
        }
    }

    const recipe_result = ref(null)

    const successAfterCreation = ref(null)
    const successMessage = ref("")
    const errorState = ref(null)
    const errorMessage = ref()

    const recordRecipe = async () => {
        if (route.query.id !== undefined && route.query.group_id !== undefined){
            try {
                var list = recipe_result.value.extendedIngredients.map(item => ({
                    quantity: item.amount,
                    metric: item.unit,
                    ingredient: item.name
                }))

                const result = await axios.post(
                    `${backend_url}/create_recette`,
                    qs.stringify(
                        { 
                            user_id: route.query.id,
                            title: recipe_result.value.title,
                            id_api: route.query.api_id,
                            ingredients: JSON.stringify(list),
                            methodology: recipe_result.value.instructions,
                            nb_people: recipe_result.value.servings
                        }
                    )
                ).then( () =>
                    successAfterCreation.value = true,
                    errorState.value = false,
                    successMessage.value = "La recette a été créé avec succès."
                ).finally(() => {
                    window.location.href = `${window.location.origin}/account?id=${route.query.id}&group_id=${route.query.group_id}`
                })
            } catch(error){
                errorState.value = true
                errorMessage.value = "Une erreur s'est produite. Réessayez s'il vous plait"
            }
        }
        return
    }

    onMounted(async () => {
        if (route.query.recipe_id !== undefined){
            await get_receips()
        } else {
            await get_receips_api()
        }
    })

</script>