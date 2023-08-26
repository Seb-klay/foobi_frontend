<template>
    <div
        v-if="repas_infos !== null"
        class="container">
        <h1 class="flex pt-12 pb-12 text-2xl justify-center">Repas du jour</h1>
        <div class="flex flex-col gap-10 px-10 pb-32 z-1">
            <div>
                <h1 class="text-xl">{{repas_infos.date_repas}}</h1>
                <h1 class="text-xl">{{repas_infos.moment}}</h1>
                <h1 class="text-xl">{{repas_infos.number_people}} personnes</h1>
            </div>

            <hr class="container border-black border-opacity-10 border w-11/12">

            <div 
                class="overflow-y-scroll"
                v-for="recette in repas_infos.recettes" 
                :key="recette.id">
                <h1 class="text-xl bg-app_primary_color rounded-xl shadow-xl p-2">{{recette.title}}</h1>
                <h1 class="text-xl pt-4 pb-2">Ingrédients : </h1>
                <div class="flex flex-rows" v-for="ingr in recette.ingredients" :key="ingr.id">
                    <h1 class="px-1">{{ ingr.quantity / recette.number_people * repas_infos.number_people }}</h1>
                    <h1 class="px-1"> {{ ingr.metric }} </h1>
                    <h1 class="px-1"> {{ ingr.ingredient }}</h1>
                </div>
                <h1 class="text-xl pt-4 pb-2">Méthodologie : </h1>
                <h1 class="px-1">{{repas_infos.methodology}}</h1>
            </div>
        </div>
    </div>
    <div v-else>
        <h1 class="container flex justify-center pt-6 text-red-500">Une erreur est survenue</h1>
    </div>
</template>

<script setup>
    import { useRoute } from "vue-router"
    import axios from 'axios'
    import { ref, onMounted } from "vue"

    const backend_url = 'https://foobi.jcloud.ik-server.com'
    // test is const backend_url = 'http://127.0.0.1:8080'

    const get_infosState = ref(null)

    const route = useRoute()

    const get_infos_repas = async () => {
        try {
            const result = await axios.get(
                `${backend_url}/get_info_repas?repas_id=${route.query.repas_id}`
            )
            get_infosState.value = true
            repas_infos.value = result.data
        } catch(error){
            console.log(error)
        }
    }

    const repas_infos = ref(null)

    onMounted(() => {
        get_infos_repas()
    })

</script>