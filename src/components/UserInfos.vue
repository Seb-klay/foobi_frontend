<template>
    <div>
        <div class="container flex flex-col items-center">
            <img class="mx-auto h-full w-14 pt-10 rounded-md" src="../assets/utilisateur.png" alt="">
            <div class="pb-10">
                {{ user_infos.name }}
            </div>
        </div>

        <hr class="container border-black border-opacity-10 border w-11/12">

        <h1 class="container text-3xl text-app_primary_color pb-4">Groupes</h1>
        <div class="container flex flex-row justify-between gap-4 pb-10 md:text-2xl sm:text-xl"
            v-for="(group, index) in user_infos.groups"
            :key="index"
            >
            <h1 class="md:p-2 sm:p-1">{{ group.name }}</h1>
            <button
                class="border-2 border-black rounded-md shadow-xl md:p-2"
                @click="changeGroup(group.id)">
                <div v-if="route.query.group_id == group.id">
                    <h1 class="bg-app_primary_color bg-opacity-50 p-1 rounded-md">#{{ group.id }}</h1>
                </div>
                <div v-else>
                    <h1 class="p-1 rounded-md">#{{ group.id }}</h1>
                </div>
                
            </button>
            <button 
                @click="quitGroup(group.id)"
                class="bg-red-400 shadow-xl border-2 border-transparent rounded-md hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100 md:p-2 sm:p-1"
                >
                <h1>Quitter</h1>
            </button>
            <button 
                v-if="group.islocked == true"
                @click="unlockGroup(group.id)" 
                class="bg-app_primary_color bg-opacity-50 shadow-xl border-2 border-transparent rounded-md hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100 md:p-2 sm:p-1"
                >
                Fermé
            </button>
            <button 
                v-else 
                @click="lockGroup(group.id)" 
                class="bg-app_primary_color shadow-xl border-2 border-transparent rounded-md hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100 md:p-2 sm:p-1"
                >
                Ouvert
            </button>
        </div>

        <hr class="container border-black border-opacity-10 border w-11/12">

        <h1 class="container text-3xl text-app_primary_color pb-4">Repas à venir</h1>
        <div 
            v-if="user_infos.repas.size !== 0" 
            class="flex gap-10 overflow-x-scroll pb-10">
            <div
                class="flex flex-col px-5 md:text-2xl sm:text-xl"
                v-for="(repas, index) in user_infos.repas"
                :key="index">
                <button @click="get_day_repas_infos(repas.date_repas)">
                    <h1 class="md:p-2 sm:p-1">{{ day_of_week[repas.day_of_week] + ' ' + repas.moment }}</h1>
                    <h1 class="md:p-2 sm:p-1">{{ repas.date_repas }}</h1>
                    <h1 class="md:p-2 sm:p-1">{{ repas.recettes[0]?.title }}</h1>
                </button>
            </div>
        </div>
        <div
            v-else
            class="flex flex-col px-10 pb-10 md:text-2xl sm:text-xl">
            <h1>Aucun repas à afficher...</h1>
        </div>

        <hr class="container border-black border-opacity-10 border w-11/12">

        <h1 class="container text-3xl text-app_primary_color pb-4">Recettes enregistrées</h1>
        <div class="flex gap-10 px-10 overflow-x-scroll pb-32 z-1">
            <div
            class="shadow-xl bg-gradient-to-r from-app_primary_color to-app_secondary_color rounded-xl"
            v-for="(recette, index) in user_infos.recettes"
            :key="index">
                <div class="flex flex-col relative w-52 h-52 p-6 border border-transparent rounded-xl shadow">
                    <RouterLink :to="{path : '/recipe_infos', query: { id: route.query.id, group_id : route.query.group_id, recipe_id: recette.id} }">
                        <h1 class="flex bottom-2 text-xl">{{ recette.title }}</h1>
                    </RouterLink>
                    <div class="flex flex-row">
                        <button @click="planifierRepas(recette.id)" class="h-auto w-10 bottom-4 left-4 absolute rounded-2xl bg-app_primary_color border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100">
                            <img class="p-2" src="../assets/croix-plus.png" alt="creer repas">
                        </button>
                        <!-- <button class="h-auto w-10 bottom-4 left-16 absolute rounded-2xl bg-app_primary_color border-black border-2 border-opacity-80 hover:bg-opacity-50 hover:delay-100 hover:ease-in hover:duration-100">
                            <img class="p-2" src="../assets/signet.png" alt="enregistré">
                        </button> -->
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import { useRoute, useRouter } from "vue-router"
    import axios from 'axios'
    import { ref } from "vue"
    import qs from 'qs'

    const backend_url = 'https://foobi.jcloud.ik-server.com'

    const day_of_week = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'])

    const route = useRoute()
    const router = useRouter()

    const errorWhileCreation = ref(false)
    const errorMessage = ref()

    const get_user_infos = async () => {
        try {
            const result = await axios.get(
                `${backend_url}/get_info_user?user_id=${route.query.id}`
            )
            return result.data
        } catch(error){
            console.log(error)
        }
    }

    const user_infos = await get_user_infos()

    const changeGroup = (group_id) => {
        router.push({
            path: '/account',
            query: {
                id : route.query.id,
                group_id : group_id
                
            }
        })
    }

    const planifierRepas = (recipe_id) => {
        console.log(recipe_id)
        window.location.href = `${window.location.origin}/create_repas?id=${route.query.id}&group_id=${route.query.group_id}&recipe_id=${recipe_id}`
    }

    const get_day_repas_infos = (day) => {
        const date_repas = new Date(day).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
        });

        window.location.href = `${window.location.origin}/repas_of_the_day_info?id=${route.query.id}&group_id=${route.query.group_id}&day=${date_repas.replace(/\//g, '.')}`
    }

  const quitGroup = async (group_id) => {
      if (route.query.id !== undefined && group_id !== 0){
          try {
              const result = await axios.post(
                  `${backend_url}/quit_group`,
                  qs.stringify(
                      { 
                          user_id: route.query.id, 
                          group_id: group_id
                      }
                  )
              ).then( () =>
                window.location.reload()
              )
          } catch(error){
              errorWhileCreation.value = true
              errorMessage.value = error.message
          }

          return
      }
  }

    const lockGroup = async (group_id) => {
      if (route.query.id !== undefined && group_id !== 0){
          try {
              const result = await axios.post(
                  `${backend_url}/lock_group`,
                  qs.stringify(
                      {
                          group_id: group_id
                      }
                  )
              ).then( () =>
                window.location.reload()
              )
          } catch(error){
              errorWhileCreation.value = true
              errorMessage.value = error.message
          }

          return
      }
  }

    const unlockGroup = async (group_id) => {
      if (route.query.id !== undefined && group_id !== 0){
          try {
              const result = await axios.post(
                  `${backend_url}/unlock_group`,
                  qs.stringify(
                      {
                          group_id: group_id
                      }
                  )
              ).then( () =>
                window.location.reload()
              )
          } catch(error){
              errorWhileCreation.value = true
              errorMessage.value = error.message
          }

          return
      }
    }

</script>