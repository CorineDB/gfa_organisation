<template>
 <div  class="p-2 border rounded">
    <div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-xs font-medium text-gray-500">{{datas.date}} ~~ <span class="text-gray-700 font-semibold"> {{datas.auteur}} </span> </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul v-if="datas.documents.length > 0" role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">
                <li v-for="document in datas.documents" :key="document.id"  class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div class="flex w-0 flex-1 items-center">
                    <svg stroke="currentColor" class="h-5 w-5" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    <span  class="ml-2 w-0 flex-1 truncate">{{document.nom}}</span>
                  </div>
                  <div class="ml-4 flex-shrink-0">                           
                    <a :href="`${base_url}${document.url}`" target="_blank" :download="document.pdf" class="font-medium text-indigo-600 hover:text-indigo-500">voir document</a>
                  </div>
                </li>
              </ul>
              <div v-else class="font-semibold"> pas de documents lié à cette reponse </div>
            </dd>
          </div>
        </dl>
        <div class="bg-yellow-50 text-xs my-3 shadow rounded-sm p-2">
          <p v-if="datas.commentaire != null || datas.commentaire != undefined">  {{datas.commentaire}}</p>
          <p v-else class="font-semibold"> pas de commentaire pour cette reponse </p>
        </div>
        <div class="flex px-6 justify-end">
          <button @click="isReponse = ! isReponse" class="bg-green-500 flex space-x-3 text-white px-4 py-2 rounded-md border-green-500 outile-none">
            <span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M568.482 177.448L424.479 313.433C409.3 327.768 384 317.14 384 295.985v-71.963c-144.575.97-205.566 35.113-164.775 171.353 4.483 14.973-12.846 26.567-25.006 17.33C155.252 383.105 120 326.488 120 269.339c0-143.937 117.599-172.5 264-173.312V24.012c0-21.174 25.317-31.768 40.479-17.448l144.003 135.988c10.02 9.463 10.028 25.425 0 34.896zM384 379.128V448H64V128h50.916a11.99 11.99 0 0 0 8.648-3.693c14.953-15.568 32.237-27.89 51.014-37.676C185.708 80.83 181.584 64 169.033 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48v-88.806c0-8.288-8.197-14.066-16.011-11.302a71.83 71.83 0 0 1-34.189 3.377c-7.27-1.046-13.8 4.514-13.8 11.859z"></path></svg></span>
          </button>
        </div>
      </div>
    </div>
  
    <hr v-if="isReponse" class="my-2">
    <form v-if="isReponse" @submit.prevent="sendRelancer" class="px-4 overflow-y-auto">
      <div v-if="currentRole=='bailleur'" class="my-2">
        <label class="my-2 block" for="">Selectionnez l'etat de l'ano </label>
        <select id="choice" required v-model="Relance.statut" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm   focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="" selected>Selectionnez le statut</option>
          <option v-for="(statut, index) in statuts" :key="index" :value="statut.value"> {{statut.name}}</option>
        </select>
      </div>
      <div class="my-2">
        <label class="my-2 block" for="">Pieces jointes </label>
        <input  class="block w-full text-sm text-gray-900 bg-gray-50 p-2.5 border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" multiple type="file" @change="previewFiles">
      </div>
      <div class="my-2">
        <label class="my-2 block">Description <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
        <textarea v-model="Relance.commentaire"  class="px-3 py-2 mt-1 border-2 border-gray-300 w-full focus:outline-none focus:ring-2  focus:border-transparent" rows="3"></textarea>
      </div>
      <div class="py-2 my-4 flex justify-center space-x-8">
        <button type="submit" class="bg-primary  flex space-x-2  items-center text-white px-4 py-2 border border-primary font-semibold uppercase">
          <span class="text-sm font-semibold uppercase" v-if="!chargement">
            enregistrer
          </span>
          <span v-else class="flex items-center space-x-2">
            <span class="text-xs px-4 font-semibold ">
              envoi ...
            </span>
            <svg  xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </span>
        </button>
        <vbutton type="reset" template="danger" > annuler </vbutton>
      </div>
    </form> 
  </div>
</template>

<script>
import {API_BASE_URL} from "@/services/configs/environment.js";
import AnosService from "@/services/modules/ano.service.js";
import Vbutton from '@/components/Vbutton.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  components:{Vbutton},
  props:['datas','anoId','statut'],
  data() {
    return {
      base_url:API_BASE_URL,
      isReponse:false,
      currentRole:'',
      Relance:{
        statut:null,
        files:[],
        commentaire:'',
      },
      statuts:[
        {name:'en cours',value:0},
        {name:'valider',value:1},
        {name:'non valider',value:-1}
      ],
      chargement:false,
    }
  },
   computed: {
   
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },
  methods:{
    previewFiles(event) {
      const data = event.target.files
      for (const property in data) {
        this.Relance.files.push(data[property])
      }
      this.Relance.files.pop()
      this.Relance.files.pop()
     
    },
    sendRelancer() {

      if(this.chargement == false) {
        this.chargement = true
        const formData = new FormData();
        formData.append('statut',this.statut)
        formData.append('commentaire',this.Relance.commentaire)
        formData.append('anoId',this.anoId)
        formData.append('reponseId',this.datas.idReponse)
        for( let i = 0; i < this.Relance.files.length; i++ ){
          let file = this.Relance.files[i];
          formData.append('fichier'+ i , file);
        }
      AnosService.reponseAnos(formData).then(() => {
        this.$toast.success('envoyé !!!')
        this.chargement = false
         this.isReponse = false
      }).catch((e) => {
        this.$toast.error(e)
         this.chargement = false
      })
      }
      
    },
  },
  mounted() {
    if(this.currentUser != undefined) {
      this.currentRole = this.currentUser.type

    }
  }
}
</script>

<style>

</style>