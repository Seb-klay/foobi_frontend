<template>
    <div class="container py-0 pt-4 flex flex-col items-center">
        <h1 class="text-xl">Créer un compte</h1>
        <div class="pt-8 mb-8 relative w-full">
            <input
                v-model="query_email"
                type="text"
                placeholder="adresse e-mail"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
        </div>
        <div class="pt-8 mb-8 relative w-full">
            <input
            v-model="query_username"
                type="text"
                placeholder="Nom d'utilisateur"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
        </div>
        <div class="pt-8 mb-8 relative w-full">
            <input
            v-model="query_password"
                type="password"
                placeholder="Mot de passe"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
        </div>
        <button class="bg-app_primary_color hover:opacity-80 py-2 px-2 rounded-md" @click="signin">
            Enregistrer
        </button>

        <div v-if="errorWhileCreation">
            <ErrorComp />
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import qs from 'qs'
    import { ref } from 'vue'
    import ErrorComp from '../components/Error.vue'
    import {useRouter} from 'vue-router'

    const backend_url = 'https://foobi.jcloud.ik-server.com'

    const router = useRouter()


    const query_email = ref("")
    const query_username = ref("")
    const query_password = ref("")

    var user_id = null

    var errorWhileCreation = ref(false)


    const signin = async () => {
        if (query_email && query_username && query_password !== null){
            try {
                const result = await axios.post(
                    `${backend_url}/create_user`,
                    qs.stringify(
                        { 
                            mail: query_email.value, 
                            name: query_username.value,
                            password: query_password.value
                        }
                    )
                ).then(
                    response => (user_id = response.data.id)
                ).finally(() =>
                    router.push({
                        name: 'account',
                        query: {
                            id : user_id
                        }
                    }
                )
            )
            } catch(error){
                errorWhileCreation = true
            }

            return
        }
    }

</script>