<template>
    <div class=" container pb-1">
        <h1 class="flex pt-12 pb-6 text-2xl justify-center">Liste des ingrédients</h1>

        <div class="flex justify-center pb-6">
            <button
                @click="lastWeek"
                class="h-auto w-6">
                <img src="/src/assets/fleche-gauche.png" alt="semaine précédente">
            </button>
            <h1>Du {{ date.firstDateAxios }} au {{ date.lastDateAxios }}</h1>
            <button 
                @click="nextWeek"
                class="h-auto w-6">
                <img src="/src/assets/fleche-droite.png" alt="semaine suivante">
            </button>
        </div>

        <hr class="border-black border-opacity-10 border">

        <div 
            class="h-[80vh]">
            <div 
                class="grid grid-flow-row gap-1 overflow-x-scroll col-start-2 col-end-3">
                <div
                    class="grid grid-flow-col justify-start whitespace-pre"
                    v-for="diner in repasOfTheWeek"
                    :key="diner.id">
                    <div v-for="(recette, index) in diner.recettes"
                    :key="index">
                        <div class="flex flex-col" v-for="(ingr, index) in recette.ingredients"
                        :key="index">
                            <h1 class="text-xl">{{ingr.quantity}} {{ingr.metric}} {{ingr.ingredient}}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from "vue-router"
    import axios from 'axios'
    import { ref, onMounted, reactive, computed, watch } from 'vue'

    const backend_url = 'https://foobi.jcloud.ik-server.com'

    // get list of months and days
    const listOfMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    // get current date with first and last of the current week
    const currentDate = ref(new Date())
    const first = currentDate.value.getDate() - currentDate.value.getDay() + 1 // First day is the day of the month - the day of the week
    const last = first + 6 // last day is the first day + 6

    // first and last day of the week formated UTC
    const firstDateOfWeek = new Date(currentDate.value)
    firstDateOfWeek.setDate(first)
    const lastDateOfWeek = new Date(currentDate.value)
    lastDateOfWeek.setDate(last)

    const date = reactive({
        today : currentDate.value.getDate() + '.' + listOfMonths[currentDate.value.getMonth()],

        // dates formated for axios request
        firstDateAxios : computed(() => {
            const firstDateOfWeek = new Date(currentDate.value);
            firstDateOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay() + 1);
            return (
            firstDateOfWeek.getDate() +
            '-' +
            listOfMonths[firstDateOfWeek.getMonth()] +
            '-' +
            firstDateOfWeek.getFullYear()
            )
        }),

        lastDateAxios : computed(() => {
            const lastDateOfWeek = new Date(currentDate.value);
            lastDateOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay() + 7);
            return (
            lastDateOfWeek.getDate() +
            '-' +
            listOfMonths[lastDateOfWeek.getMonth()] +
            '-' +
            lastDateOfWeek.getFullYear()
            );
        })
    })

    const route = useRoute()

    const get_weekly_repas = computed( async () => {
        try {
            const result = await axios.get(
                `${backend_url}/get_repas_by_range_date?from_date_repas=${date.firstDateAxios}&to_date_repas=${date.lastDateAxios}&group_id=${route.query.group_id}`
            )
            repasOfTheWeek.value = await result.data
            //repasOfWeekState.value = true

        } catch(error){
            console.log(error)
        }
    })

    const repasOfTheWeek = ref(null)


    const getDinersForDay = (day, diner_day) => {
        const date_repas = new Date(diner_day).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
        });

        if (day == date_repas.replace(/\//g, '.')){
            return true
        } else {
            return false
        }
    }

    const lastWeek = () => {
        const nextWeekDate = new Date(currentDate.value)
        nextWeekDate.setDate(nextWeekDate.getDate() - 7)
        currentDate.value = nextWeekDate
    }

    const nextWeek = () => {
        const nextWeekDate = new Date(currentDate.value)
        nextWeekDate.setDate(nextWeekDate.getDate() + 7)
        currentDate.value = nextWeekDate
    }

    watch(get_weekly_repas, () => {
        // This function will be triggered whenever the computed property fetchData changes (i.e., when date.lastDateAxios changes)
        get_weekly_repas
    })


</script>