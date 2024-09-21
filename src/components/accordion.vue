<template>
    <div class="">
        <div class="tab__header">
            <a href="#" class="tab__link p-4  color hover:bg-blue-darker no-underline text-white border-b-2 border-white flex justify-between space-x-2" @click.prevent="active = !active">
                <strong>{{ title }}</strong>
                <strong>{{ date_de_soumission }}</strong>
                <strong>{{ auteur }}</strong>
                <span class="down-Arrow" v-show="!active">&#9660;</span>
                <span class="up-Arrow" v-show="active">&#9650;</span>
                <button title="exporter chaque soumission" v-title @click="download"
                    class="h-auto py-1 px-2 space-x-1 text-xs font-semibold text-white uppercase bg-indigo-500 focus:outline-none focus:shadow-outline">
                    <svg class="inline" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                        height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 16h2V7h3l-4-5-4 5h3z"></path>
                        <path d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
                        </path>
                    </svg>
                    <span class="text-xs font-semibold">Export Excel</span>
                </button>
                <button title="générer pdf" v-title
                    class="h-auto py-1 px-2 space-x-1 text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline"
                    @click="generateReport">
                    <span class="mx-2 text-sm font-semibold">generer pdf </span>
                </button>
            </a>
        </div>
        <div class="tab__content p-2 overflow-x-auto" v-show="active">
            <slot />
        </div>
    </div>
</template>


<script>

export default {
    props: [
        'title', 'date_de_soumission', 'auteur'
    ],
    data() {

        return {
            active: false,
        }
    },
    methods: {
        generateReport() {
            this.active = false
            this.$emit('generate-pdf')

        },
        download(){
            this.$emit('generate-excel')
        }
    }
}

</script>
<style>
.color {
    background-color: #2779BD;
}
</style>