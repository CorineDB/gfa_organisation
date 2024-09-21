<template>
  <div style="height:800px" class="bg-white shadow p-3">
  
    <ol style="height:90%" class="px-3 relative border-l overflow-auto border-gray-200 dark:border-gray-700">                  
      <li v-for="data in datas" :key="data.id" class="mb-10 ml-4">
      
        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
        <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{data.date}} </time>
        <h3 class=" font-semibold text-gray-900 dark:text-white">{{data.nom}} </h3>
        <p class="mb-4 text-xs font-normal text-gray-500 dark:text-gray-400">
          <span v-if="data.message.length > 50 && show ">
            {{data.message}}
          </span>
          <span>
            {{data.message.substring(0,50)}}
          </span>
        </p>
        <button v-if="data.message.length > 50 && !show "  @click="show = true" class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Voir plus <svg class="ml-2 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>
      </li>
    </ol>

    <div style="height:10%" class="border-t-2 border-gray-200 px-4 pt-4 mb-2 ">
        <div class="relative flex">
          
          <input type="text" v-model="message" @keyup.enter="save(message)" placeholder="Laissez un commentaire !" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3">
          <div class="absolute right-2 flex items-center inset-y-0  ">
              <button type="button" @click="save(message)"  class="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
          </div>
        </div>
    </div>

  </div>
</template>

<script>
import AnosService from "@/services/modules/ano.service.js";
import IndicateurSuiviService from "@/services/modules/indicateur.suivi.service";
import DecaissementService from "@/services/modules/decaissement.service";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  props:['datas','module','data'],
  data() {
    return {
      show:false,
      message:'',
      nom:''
    }
  },
  computed: {
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'}),
  },
  methods:{
    save(message) {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${day}-${month}-${year}`;
      
      if(this.module ==="ano") {
         const data = {
          commentaire : message,
        }
        AnosService.update(this.data.id,data).then(() => {
          this.datas.push({nom:this.currentUser.nom,message:message,date:currentDate})
          this.message = ''
        }).catch((e) => {
          this.$toast.error(e)
        })
      }
      if(this.module ==="suivi") {
        const indicateur = this.data.indicateur
        const data = {
          commentaire : message,
          indicateurId:indicateur.id,
         
        }
        this.datas.push({nom:this.currentUser.nom,message:message,date:currentDate})
        IndicateurSuiviService.update(this.data.id,data).then(() => {
          this.message = ''
        }).catch((e) => {
          this.$toast.error(e)
        })
      }
       if(this.module ==="decaissemement") {
        const indicateur = this.data.indicateur
        const data = {
          commentaire : message,
       
         
        }
        this.datas.push({nom:this.currentUser.nom,message:message,date:currentDate})
        DecaissementService.update(this.data.id,data).then(() => {
          this.message = ''
        }).catch((e) => {
          this.$toast.error(e)
        })
      }
      
      
    }
  },
  mounted() {
    
  }
}
</script>

<style>

</style>