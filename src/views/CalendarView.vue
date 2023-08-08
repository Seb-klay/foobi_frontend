<template>
    <div class="container pb-1">
        <div v-if="repasOfWeekState !== null">
            <h1 class="flex pt-12 pb-6 text-2xl justify-center">Calendrier des repas</h1>
            <div class="flex justify-center pb-6">
                <button
                    @click="lastWeek"
                    class="h-auto w-6">
                    <img src="src/assets/fleche-gauche.png" alt="semaine précédente">
                </button>
                <h1>Du {{ date.firstDateAxios }} au {{ date.lastDateAxios }}</h1>
                <button 
                    @click="nextWeek"
                    class="h-auto w-6">
                    <img src="src/assets/fleche-droite.png" alt="semaine suivante">
                </button>
            </div>
            <h1 class="flex flex-row gap-3 pb-4 justify-between">Date</h1>

            <hr class="border-black border-opacity-10 border">

            <div 
                class="h-[80vh]"
                v-if="listDaysOfWeek.length !== 0">                
                <div
                    class="grid grid-cols-2  whitespace-pre"
                    v-for="(day, index) in listDaysOfWeek"
                    :key="index">
                    <div 
                        class="grid grid-rows-[7] pt-6">
                        <div 
                            class="grid justify-start bg-app_primary_color rounded-md shadow-xl px-1" 
                            v-if="day == date.today">
                            <h1>{{ listOfDaysName[index] }}</h1>
                            <h1>{{ day }}</h1>
                        </div>
                        <div 
                            class="grid justify-start"
                            v-else>
                            <h1>{{ listOfDaysName[index] }}</h1>
                            <h1>{{ day }}</h1>
                        </div>
                    </div>
                    <button @click="get_day_repas_infos(day)">
                        <div 
                            class="grid grid-flow-col gap-4 px-4 overflow-x-scroll col-start-2 col-end-3">
                            <div
                                class="grid grid-flow-col justify-start pt-6"
                                v-for="diner in repasOfTheWeek"
                                :key="diner.id">
                                <div class="grid grid-flow-row" v-if="getDinersForDay(day, diner.date_repas) == true">
                                    <h1 class="grid text-sm justify-center">{{diner.recettes[0]?.title}}</h1>
                                    <h1 class="grid text-sm justify-center">({{diner.number_people}} pers.) {{diner.moment}}</h1>
                                </div>
                                <div 
                                    v-else 
                                    class="hidden">

                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div v-else>
            <h1>Chargement...</h1>
        </div>
        
    </div>
</template>

<script setup>
    import { useRoute } from "vue-router"
    import axios from 'axios'
    import { ref, computed, reactive, watch } from 'vue'

    const backend_url = 'https://foobi.jcloud.ik-server.com'

    // get list of months and days
    const listOfMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const listOfDaysName = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

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


    // gives a list of all days of the week of the day sent to the function
    const getDayOfWeek = (date) => {
        const daysOfWeek = []

        for (let i = 0; i <= 6; i++){
            var nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + i)
            var newDate_formated = nextDate.getDate() + '.' + listOfMonths[nextDate.getMonth()] 
            daysOfWeek.push(newDate_formated)
        }

        return daysOfWeek
    }

    const repasOfWeekState = ref(null)
    const listDaysOfWeek = computed(() => { return getDayOfWeek(firstDateOfWeek)})

    const get_weekly_repas = computed( async () => {
        try {
            const result = await axios.get(
                `${backend_url}/get_repas_by_range_date?from_date_repas=${date.firstDateAxios}&to_date_repas=${date.lastDateAxios}&group_id=${route.query.group_id}`
            )
            repasOfTheWeek.value = await result.data
            repasOfWeekState.value = true

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

        if (day.length == 4){
            day = '0' + day
        }

        if (day == date_repas.replace(/\//g, '.')){
            return true
        } else {
            return false
        }
    }

    const route = useRoute()

    const get_day_repas_infos = (day) => {
        window.location.href = `${window.location.origin}/repas_of_the_day_info?id=${route.query.id}&group_id=${route.query.group_id}&day=${day}`
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
        listDaysOfWeek
        get_weekly_repas
    })

</script>