<template>
    <div class="container py-24 pt-4 flex flex-col mb-8">
        <h1 class="flex text-2xl justify-center">Créer une recette</h1>

        <div class="py-5"></div>

        <h1 class="px-1 text-2xl font-bold flex justify-start text-app_primary_color">{{recipe_result?.title}} </h1>

        <div class="pt-8 mb-8 relative w-full">
            <input
                v-model="query_title"
                type="tel"
                placeholder="Titre"
                pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
            
            <div class="py-5"></div>

            <!-- additional rows for ingredients -->
            <div 
                class="flex flex-row"
                v-for="(set, index) in list_ingredients" :key="index">
                <input
                    v-model="set.query_quantity"
                    type="number"
                    placeholder="quantity"
                    pattern="[0-9]"
                    class="py-1 px-2 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">

                <input
                    v-model="set.query_metric"
                    type="text"
                    placeholder="metrique"
                    class="py-1 px-2 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">

                <input
                    v-model="set.query_ingredient"
                    type="text"
                    placeholder="ingrédient"
                    class="py-1 px-2 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
            </div>

            <!-- Button to Show Additional Line of Inputs -->
            <button @click="addNewSetOfInputs" class="mt-4">
                Ajouter un ingrédient
            </button>

            <div class="py-5"></div>

            <textarea
                v-model="query_methodology"
                rows="4" 
                class="block p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Instruction de la recette">
            </textarea>
            
            <div class="py-5"></div>
            
            <input
                v-model="query_nb_pers"
                type="number"
                placeholder="Nombre de participants"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
            
            <div class="py-5"></div>
        </div>
        <div class="py-6"></div>
        <button 
            class="flex justify-center bg-app_primary_color hover:opacity-80 py-2 px-2 rounded-md" 
            @click="createRecipe()">
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

    // test is http://127.0.0.1:5000
    const backend_url = 'https://foobi.jcloud.ik-server.com'

    const router = useRouter()
    const route = useRoute()

    const query_title = ref("")
    const query_quantity = ref(0)
    const query_metric = ref("")
    const query_ingredient = ref("")
    const list_ingredients = ref([])
    const query_methodology = ref("")
    const query_nb_pers = ref()

    const errorWhileCreation = ref(false)
    const errorMessage = ref()

    const successAfterCreation = ref(false)
    const successMessage = ref()

    const API_KEY = '708a8e7429c0436d98c1bb6fc739f96a'

    const recipe_result = ref(null)

    const query_timeOut = ref()

    const addNewSetOfInputs = () => {
        list_ingredients.value.push({
          quantity: query_quantity.value,
          metric: query_metric.value,
          ingredient: query_ingredient.value
        })
        console.log(list_ingredients)
    }


    const createRecipe = async () => {
        if (route.query.id !== undefined && route.query.group_id !== undefined){
            try {
                var list = list_ingredients.value.map(item => ({
                    quantity: item.query_quantity,
                    metric: item.query_metric,
                    ingredient: item.query_ingredient
                }))
                
                const result = await axios.post(
                    `${backend_url}/create_recette`,
                    qs.stringify(
                        { 
                            user_id: route.query.id,
                            title: query_title.value,
                            ingredients: JSON.stringify(list),
                            methodology: query_methodology.value,
                            nb_people: query_nb_pers.value
                        }
                    )
                ).then( () =>
                    successAfterCreation.value = true,
                    errorWhileCreation.value = false,
                    successMessage.value = "La recette a été créé avec succès."
                ).finally(() => {
                    window.location.href = `${window.location.origin}/account?id=${route.query.id}&group_id=${route.query.group_id}`
                })
            } catch(error){
                errorWhileCreation.value = true
                errorMessage.value = "Une erreur s'est produite. Réessayez s'il vous plait"
            }
            return
        } else if(route.query.id !== undefined && route.query.api_id !== undefined) {
            try {

                const result = await axios.post(
                    `${backend_url}/create_recette`,
                    qs.stringify(
                        { 
                            user_id: route.query.id,
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
                    window.location.href = `${window.location.origin}/search?id=${route.query.id}&group_id=${route.query.group_id}`
                })
            } catch(error){
                errorWhileCreation.value = true
                errorMessage.value = "Une erreur s'est produite. Réessayez s'il vous plait"
            }
            return
        }
    }


</script>