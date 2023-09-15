<template>
    <div
        class="container">
        <h1 class="flex pt-12 pb-12 text-2xl justify-center">Repas du {{route.query.day}}</h1>
        <div class="flex flex-col gap-10 px-10 pb-32 z-1 items-center">
            <div
            class="flex w-52 justify-center shadow-xl bg-gradient-to-r from-app_primary_color to-app_secondary_color rounded-xl"
            v-for="(repas, index) in repas_infos"
            :key="index">
                    <div class="flex flex-col relative w-52 h-52 p-6 border border-transparent rounded-xl shadow">
                        <button @click="get_infos_repas(repas.id)">
                            <h1 class="flex bottom-2 text-xl">{{ repas.recettes[0]?.title }}</h1>
                        </button>
                        <h1 class="flex bottom-2 text-xl">{{ repas.number_people }} pers.</h1>
                        <h1 class="flex bottom-2 text-xl">{{ repas.moment }}</h1>
                        <div class="flex flex-row">
                            <button 
                                class="h-auto w-10 bottom-4 right-16 absolute rounded-2xl bg-app_primary_color border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100"
                            >
                                <img class="p-2" src="../assets/croix-plus.png" alt="creer repas">
                            </button>
                            <button 
                                @click="deleteRepas(repas.id)"
                                class="bg-red-400 h-auto w-10 bottom-4 right-4 absolute rounded-2xl border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100"
                            >
                                <img class="p-2" src="../assets/poubelle.png" alt="enregistré">
                            </button>
                        </div>
                    </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute, useRouter } from "vue-router"
    import axios from 'axios'
    import { ref, onMounted } from "vue"
    import qs from 'qs'

    const backend_url = 'https://foobi.jcloud.ik-server.com'
    // test is const backend_url = 'http://127.0.0.1:8080'

    const get_infosState = ref(null)

    const route = useRoute()
    const router = useRouter()

    const get_info_repas_of_the_day = async () => {
        try {
            const result = await axios.get(
                `${backend_url}/get_repas_by_date?date_repas=${route.query.day}&group_id=${route.query.group_id}`
            )
            get_infosState.value = true
            repas_infos.value = result.data
        } catch(error){
            console.log(error)
        }
    }

    const deleteRepas = async (repas_id) => {
        console.log(repas_id)
        try {
            const result = await axios.post(
                `${backend_url}/delete_repas`,
                    qs.stringify(
                        { 
                            repas_id: repas_id
                        }
                    )
            ).then( () => {
                get_infosState.value = true
                window.location.reload()
            })
        } catch(error){
            console.log(error)
        }
    }

    const repas_infos = ref(null)

    const get_infos_repas = (repas_id) => {
        console.log(repas_id)
        router.push({
            path: '/repas_infos',
            query: {
                id : route.query.id,
                group_id : route.query.group_id,
                day : route.query.day,
                repas_id : repas_id
                
            }
        })
    }

    onMounted(() => {
        get_info_repas_of_the_day()
    })

</script>