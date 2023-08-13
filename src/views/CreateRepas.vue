<template>
    <div class="container py-0 pt-4 flex flex-col">
        <h1 class="flex text-2xl justify-center">Planifier un repas</h1>

        <div class="py-5"></div>

        <h1 class="px-1 text-2xl font-bold flex justify-start text-app_primary_color">{{recipe_result?.title}} </h1>

        <div class="pt-8 mb-8 relative w-full">
            <input
                v-model="query_date_repas"
                type="text"
                placeholder="Date du repas (01-01-2025)"
                pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
            
            <div class="py-5"></div>
            
            <input
                v-model="query_nb_pers"
                type="tel"
                placeholder="Nombre de participants"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
            
            <div class="py-5"></div>

            <h1>Moment du repas :</h1>
            
            <div class="flex items-center mb-4">
                <input v-model="query_moment" id="default-radio-1" type="radio" value="Midi" name="moment" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="default-radio-1" class="ml-2 font-medium text-black ">Midi</label>
            </div>
            <div class="flex items-center">
                <input v-model="query_moment" checked id="default-radio-2" type="radio" value="Soir" name="moment" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="default-radio-2" class="ml-2 font-medium text-black ">Soir</label>
            </div>
        </div>
        <div class="py-12"></div>
        <button 
            class="flex justify-center bg-app_primary_color hover:opacity-80 py-2 px-2 rounded-md" 
            @click="createRepas()">
            Enregistrer
        </button>

        <div v-if="errorWhileCreation">
            <ErrorComp />
            <h1 class="flex justify-center text-red-400">{{errorMessage}}</h1>
        </div>
        <div v-else-if="successAfterCreation">
            <h1 class="flex justify-center text-green-500">{{successMessage}}</h1>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import qs from 'qs'
    import { ref, onMounted } from 'vue'
    import ErrorComp from '../components/Error.vue'
    import {useRouter, useRoute} from 'vue-router'

    const backend_url = 'https://foobi.jcloud.ik-server.com/'

    const router = useRouter()
    const route = useRoute()

    const query_date_repas = ref("")
    const query_moment = ref("")
    const query_nb_pers = ref()
    const open = ref(false)

    const errorWhileCreation = ref(false)
    const errorMessage = ref()

    const successAfterCreation = ref(false)
    const successMessage = ref()

    const API_KEY = '708a8e7429c0436d98c1bb6fc739f96a'

    const recipe_result = ref(null)

    const query_timeOut = ref()


    const createRepas = async () => {
        if (route.query.id !== undefined && route.query.recipe_id !== undefined && query_nb_pers !== undefined){
            try {
                const result = await axios.post(
                    `${backend_url}/create_repas`,
                    qs.stringify(
                        { 
                            user_id: route.query.id, 
                            recipe_id: route.query.recipe_id,
                            group_id: route.query.group_id,
                            date_repas: query_date_repas.value,
                            moment: query_moment.value,
                            nb_pers: query_nb_pers.value
                        }
                    )
                ).then( () =>
                    successAfterCreation.value = true,
                    successMessage.value = "Le repas a été créé avec succès."
                ).finally(() => {
                    window.location.href = `${window.location.origin}/search?id=${route.query.id}&group_id=${route.query.group_id}`
                })
            } catch(error){
                errorWhileCreation.value = true
                errorMessage.value = "Une erreur s'est produite. Réessayez s'il vous plait"
            }
            return
        } else if(route.query.id !== undefined && route.query.api_id !== undefined && query_nb_pers !== undefined) {
            try {
                var recipe_id = route.query.recipe_id

                const findByIdAPI_result = await find_by_api_id()


                if (findByIdAPI_result == 'None'){
                    // create recipe for that spoonacular recipe
                    const creation_result = await create_recipe(recipe_result)

                    recipe_id = creation_result.id
                    
                } else {
                    recipe_id = findByIdAPI_result
                }

                const result = await axios.post(
                    `${backend_url}/create_repas`,
                    qs.stringify(
                        { 
                            user_id: route.query.id,
                            group_id: route.query.group_id,
                            recipe_id: recipe_id,
                            api_id: route.query.api_id,
                            date_repas: query_date_repas.value,
                            moment: query_moment.value,
                            nb_pers: query_nb_pers.value
                        }
                    )
                ).then( () =>
                    successAfterCreation.value = true,
                    successMessage.value = "Le repas a été créé avec succès.",
                    clearTimeout(query_timeOut.value),
                    query_timeOut.value = setTimeout(3000)
                ).finally(() => {
                    window.location.href = `${window.location.origin}/calendar?id=${route.query.id}&group_id=${route.query.group_id}`
                })
            } catch(error){
                errorWhileCreation.value = true
                errorMessage.value = "Une erreur s'est produite. Réessayez s'il vous plait"
            }
            return
        }
    }

    const find_by_api_id = async () => {
        const result = await axios.get(
            `${backend_url}/find_by_api_id?api_id=${route.query.api_id}`
        )

        return result.data
    }

    const create_recipe = async (recipe) => {
        var list = recipe.value.extendedIngredients.map(item => ({
            quantity: item.amount,
            metric: item.unit,
            ingredient: item.name
        }))
        const result = await axios.post(
            `${backend_url}/create_recette`,
            qs.stringify(
                { 
                    user_id: route.query.id,
                    title: recipe.value.title,
                    id_api: recipe.value.id,
                    ingredients: JSON.stringify(list),
                    methodology: recipe.value.instructions,
                    nb_people: recipe.value.servings
                }
            )
        )

        return result.data
    }

    const get_receips = async () => {
        if (route.query.recipe_id !== undefined){
            try {
                const result = await axios.get(
                    `${backend_url}/get_info_recette?recipe_id=${route.query.recipe_id}`
                )
                return result.data
            } catch(error){
                errorState.value = true
                errorMessage.value = error.message
            }
        }else if(route.query.api_id !== undefined) {
            try {
                const result = await axios.get(
                    `https://api.spoonacular.com/recipes/${route.query.api_id}/information?apiKey=${API_KEY}`
                )
                return result.data
            } catch(error){
                errorWhileCreation.value = true
                errorMessage.value = error.message
            }
        }
    }

    onMounted(async () => {
        recipe_result.value = await get_receips()
    })

</script>