<template>
    <div class="container py-0 pt-4 flex flex-col items-center">
        <h1 class="text-xl">Créer un compte</h1>
        <div class="pt-8 mb-8 relative w-full">
            <input
                v-model="query_group_name"
                type="text"
                placeholder="Nom du groupe"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
        </div>
        <button class="bg-app_primary_color hover:opacity-80 py-2 px-2 rounded-md" @click="createGroup">
            Enregistrer
        </button>

        <div v-if="errorWhileCreation">
            <ErrorComp />
            {{errorMessage}}
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import qs from 'qs'
    import { ref } from 'vue'
    import ErrorComp from '../components/Error.vue'
    import {useRouter, useRoute} from 'vue-router'

    const backend_url = 'https://foobi.jcloud.ik-server.com'

    const router = useRouter()
    const route = useRoute()

    const query_group_name = ref("")

    var errorWhileCreation = ref(false)
    const errorMessage = ref()


    const createGroup = async () => {
        if (route.query.id !== undefined && query_group_name !== ''){
            try {
                const result = await axios.post(
                    `${backend_url}/create_group`,
                    qs.stringify(
                        { 
                            user_id: route.query.id, 
                            name: query_group_name.value
                        }
                    )
                ).then( (response) =>
                    router.push({
                        path: '/home',
                        query: {
                            id : route.query.id,
                            group_id: response.data.id
                        }
                    }
                )
                )
            } catch(error){
                errorWhileCreation = true
                errorMessage.value = error.message
            }

            return
        }
    }

</script>