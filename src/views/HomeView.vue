<template>
  <main>
    <CreationVue />
    <div class="container flex flex-col items-center pt-8 py-11 mb-8 relative">
      <input
        v-model="num_group"
        type="number"
        placeholder="Rejoindre un groupe (numéro)"
        class="flex py-2 px-4 w-full bg-transparent text-black border-b focus:outline-none focus:shadow-[0px_2px_0_0_#004E41]">
      <div class="py-5"></div>
      <div v-if="num_group !== undefined">
        <button class="flex justify-center items-center bg-app_primary_color hover:opacity-80 py-2 px-2 rounded-md" @click="joinGroup">
          Enregistrer
        </button>
      </div>
      <div v-if="errorWhileCreation">
        <ErrorComp />
        <h1 class="text-red-400 text-xl">{{ errorMessage }}</h1>
      </div>
    </div>
  </main>
</template>

<script setup>
  import CreationVue from "../components/Creation.vue"
  import ErrorComp from '../components/Error.vue'
  import axios from 'axios'
  import qs from 'qs'
  import { ref } from 'vue'
  import {useRouter, useRoute} from 'vue-router'

  const backend_url = 'https://foobi.jcloud.ik-server.com'

  const router = useRouter()
  const route = useRoute()

  const num_group = ref()

  var errorWhileCreation = ref(false)
  const errorMessage = ref()


  const joinGroup = async () => {
      if (route.query.id !== undefined && num_group !== 0){
          try {
              const result = await axios.post(
                  `${backend_url}/join_group`,
                  qs.stringify(
                      { 
                          user_id: route.query.id, 
                          group_id: num_group.value
                      }
                  )
              ).then( (response) =>
                  router.push({
                      path: '/account',
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