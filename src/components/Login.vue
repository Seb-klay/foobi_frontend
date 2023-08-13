<template>
    <div class="container py-0 pt-4 flex flex-col items-center">
        <h1 class="text-xl">Login</h1>
        <div class="pt-8 mb-8 relative w-full">
            <input
                v-model="query_email"
                type="text"
                placeholder="adresse e-mail"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
        </div>
        <div class="pt-8 mb-8 relative w-full">
            <input
                v-model="query_password"
                type="password"
                placeholder="Mot de passe"
                class="py-1 px-1 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
        </div>
        <button class="bg-app_primary_color shadow-xl hover:opacity-80 py-2 px-2 rounded-md" @click="login">
            Se connecter
        </button>
        <h2 class="py-10">Pas encore de compte ? <a class="bg-app_primary-color px-1 rounded-sm" href="/signin">Cliquez ici</a></h2>

        <div v-if="errorState">
            <h2 class="text-rose-600">{{errorMessage}}</h2>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { ref } from 'vue'
    import {useRouter, useRoute} from 'vue-router'

    const backend_url = 'https://foobi.jcloud.ik-server.com'

    const router = useRouter()
    const route = useRoute()

    const query_email = ref("")
    const query_password = ref("")
    const errorState = ref(null)
    const errorMessage = ref()
    const query_timeOut = ref(null)

    var user_id = null

    const login = async () => {
        if (query_email.value !== "" && query_password.value !== ""){
            try {
                const result = await axios.get(
                    `${backend_url}/login?mail=${query_email.value}&password=${query_password.value}`
                ).then(
                    (response) => {
                        user_id = response.data.id
                        //window.location.href = `${window.location.origin}/account?id=${user_id}`
                    }
                )
            return user_id 

            } catch(error){
                errorState.value = true
                errorMessage.value = "Vos informations ne sont pas correctes"
            }

            return
        }
        errorState.value = true
        errorMessage.value = "Veuillez insérer vos informations"
    }

</script>
