<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{duration: 3000,}" class="flex">
      <CheckCircleIcon v-if="message.type==='success'" class="text-success" />
      <div class="ml-4 mr-4">
          <div :class="{'text-red-500 capitalize ': message.type!='success'}" class="font-medium">{{message.type}}</div>
          <div class="text-slate-500 mt-1">
            {{message.message}}
          </div>
      </div>
    </Notification>
    <!-- toast notification -->

   
    <!-- BEGIN: Modal Content -->
    <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
          <div class="text-3xl mt-5">Vous etes sur de supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">
            Cette operation est irreverssible ? <br />Cliquer 
            sur annuler pour annuler l'operation
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">
            Annuler
          </button>
          <button type="button" @click="deletecampagneBsd" class="btn btn-danger w-24">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeBsd">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Equipement </label>
            <TomSelect v-model="bsdId" :options="{placeholder: 'Selectionez un equipement '}" class="w-full">
              <option
                v-for="(bsd,index) in bsds" 
                :key="index" 
                :value="bsd.id">{{bsd.nom}}</option>
            </TomSelect>
          </div>
          <div v-if="showIndcateurSelect" class="my-2">
            <label for="regular-form-1" class="form-label">Indicateur </label>
            <TomSelect v-model="indicateurId" :options="{placeholder: 'Selectionez un indicateur '}" class="w-full">
              <option  
                v-for="(indicateur,index) in indicateurs" 
                :key="index" 
                :value="indicateur.id">{{indicateur.nom}}</option>
            </TomSelect>
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Sites </label>
            <TomSelect v-model="formData.siteId" :options="{placeholder: 'Selectionez un site '}" class="w-full">
              <option  
                v-for="(site,index) in sites" 
                :key="index" 
                :value="site.id">{{site.nom}}</option>
            </TomSelect>
          </div>
          <button
            class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
              <span class="text-sm font-semibold uppercase" v-if="!chargement">
                Ajouter
              </span>
              <span v-else class="flex justify-center items-center space-x-2">
                <span class=" px-4 font-semibold ">
                  chargement ...
                </span>
                <svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
          </button>
        </form>

        <form v-else key="modifier" @submit.prevent="updateCampagneBsd">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control" placeholder="libellé" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.description" class="form-control" placeholder="description" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Groupes </label>
            
            <TomSelect v-model="saveUpdate.groupeId" :options="{placeholder: 'Selectionez un groupe'}" class="w-full">
              <option :value="saveUpdate.promotionId"> {{ saveUpdate.groupeNom }} </option>
              <option  
                v-for="(groupe,index) in groupes" 
                :key="index" 
                :value="groupe.id">{{groupe.nom}}</option>
            </TomSelect>

          </div>

          <button
            class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              modifier
            </span>
            <span v-else class="flex justify-center items-center space-x-2">
                <span class=" px-4 font-semibold ">
                  chargement ...
                </span>
                <svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </span>
          </button>
        </form>
      </ModalBody>
    </Modal>
    <Modal :show="showModalGestionnaire" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeGestionnaire">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Gestionnaire </label>
            <TomSelect v-model="formData.userId" :options="{placeholder: 'Selectionez un utilisateur '}" class="w-full">
              <option  
                v-for="(user,index) in users" 
                :key="index" 
                :value="user.id">{{user.nom}} {{ user.prenoms }}</option>
            </TomSelect>
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Sites </label>
            <TomSelect v-model="formData.siteId" :options="{placeholder: 'Selectionez un site '}" class="w-full">
              <option  
                v-for="(site,index) in sites" 
                :key="index" 
                :value="site.id">{{site.nom}}</option>
            </TomSelect>
          </div>
          <button
            class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
              <span class="text-sm font-semibold uppercase" v-if="!chargement">
                Ajouter
              </span>
              <span v-else class="flex justify-center items-center space-x-2">
                <span class=" px-4 font-semibold ">
                  chargement ...
                </span>
                <svg  xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
          </button>
        </form>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class=" flex justify-between ">
      <button  @click="addBSD" class="btn btn-primary flex space-x-2 items-center">
        <PlusSquareIcon />
        <span class="uppercase font-semibold"> ajouter un equipement</span>
      </button>
      <button  @click="addGestionnaire" class="btn btn-primary flex space-x-2 items-center">
        <PlusSquareIcon />
        <span class="uppercase font-semibold"> ajouter un gestionnaire</span>
      </button>
      <div class="search hidden sm:block">
        <input
          type="text"
          class="search__input form-control border-transparent"
          v-model="search"
          placeholder="Recherche..."
        />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      
    </div>
    <div class="my-4 flex justify-between items-center ">
      <span class="text-xl uppercase font-bold">Campagne  {{ campagne }}  </span>
      <button  @click="toBack" class="bg-indigo-500 text-white rounded-lg font-semibold px-3 py-2 outline-none flex space-x-2 items-center">
        <CornerUpLeftIcon />
        <span class="uppercase font-semibold"> Campagnes</span>
      </button>
    </div>
    <!-- END: Modal Toggle -->
    <div class="overflow-x-auto mt-5">
      <table class="table mt-5">
          <thead class="table-light">
              <tr>
                <th class="whitespace-nowrap">#</th>
                <th class="whitespace-nowrap">Adresse </th>
                <th class="whitespace-nowrap">Equipement  </th>
                
              </tr>
          </thead>
          <tbody>
           
            <tr v-for="(data , index) in resultQuery " :key="index">
              <td> {{ index +1 }} </td>
              <td>{{data.site}}</td>
              <td>{{data.nom}}</td>
            </tr>
          </tbody>
      </table>
    </div>
    
    </div>
</template>

<script setup>
  import { ref,reactive,onMounted,provide,computed, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router'
  import BsdService from "@/services/modules/bsd.service";
  import SiteService from "@/services/modules/site.service";
  import CampagneService from "@/services/modules/campagne.service";
  import IndicateurService from "@/services/modules/indicateur.service";
  import UsersService from "@/services/modules/user.service";


  const router = useRouter()
  const route = useRoute()
  const showModal = ref(false)
  const showModalGestionnaire = ref(false)
  const deleteModalPreview = ref(false)
  const successNotification = ref();
  const campagne = ref('')
  const search = ref('')
  const campagneByBsd = ref([])
  const bsds = ref([])
  const indicateurs = ref([])
  const users = ref([])
  const sites = ref([])
  const deleteData = reactive({})
  const saveUpdate = reactive({})
  const chargement = ref(false)
  const isUpdate = ref(false)
  const showIndcateurSelect = ref(false)
  const bsdId = ref('')
  const indicateurId = ref('okkkkk')
  const formData = reactive({
    bsdId:'',
    siteId:'',
    indicateurId:''
  })

  const message = reactive({
    type: 'success',
    message:'',
  })

  const resultQuery = computed(()=> {
    if(search.value){
      return campagneByBsd.value.filter((item)=>{
        return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.adresse.toString().toLowerCase().includes(v))
      })
      }else{
        return campagneByBsd.value;
      }
  })

  watch(bsdId, (id) => {
  
    var bsd = null
    for (let i = 0; i < bsds.value.length; i++) {
      if (bsds.value[i].id == id) {
        
        bsd = bsds.value[i]
        break;
      }
    }
    if(bsd && bsd.type == 'kit')
    {
      showIndcateurSelect.value = true
    }
    else{
      showIndcateurSelect.value = false
    }
  })

  
 
  onMounted(function () {
    getData()
    getBSD()
    getSite()
    getUser()
    getIndicateur()
  })
  
  const getData = function () {
    CampagneService.getBsdByCampagne(route.params.id).then((data) => {
      campagneByBsd.value = data.data.data
      campagne.value = campagneByBsd.value.campagne.nom
      campagneByBsd.value = campagneByBsd.value.bsds
    }).catch((e) => {
     // disabled()
      alert(e)
    })
  }

  const getIndicateur = function () {
  IndicateurService.getAll().then((data) => {
    indicateurs.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

  const getBSD = function () {
    BsdService.getBsdByEntreprise().then((data) => {
      bsds.value = data.data.data
    }).catch((e) => {
     // disabled()
      alert(e)
    })
  }
  const getSite = function () {
    SiteService.get().then((data) => {
      sites.value = data.data.data
    }).catch((e) => {
     // disabled()
      alert(e)
    })
  }
  const getUser = function () {
    UsersService.get().then((data) => {
      users.value = data.data.data
    }).catch((e) => {
     // disabled()
      alert(e)
    })
  }

  function close() {
    formData.bsdId = ''
    formData.siteId = ''
    showModal.value = false
  }


  provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
  });
  const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
  };


  const addBSD = function () {
    showModal.value = true
    isUpdate.value = false
  }

  const addGestionnaire = function () {
    showModalGestionnaire.value = true
    isUpdate.value = false
  }


  const storeBsd = function() {
    if(chargement.value == false) {
      chargement.value = true
      formData.bsdId = bsdId.value
      formData.indicateurId = indicateurId
      CampagneService.addBSD(route.params.id,formData).then((data) => {
        message.type = 'success'
        message.message = 'Vous avez ajouté un BSD  à la campagne'
        successNotificationToggle()
        close()
        getData()
        chargement.value = false  
      }).catch((error) => {
        chargement.value = false  
        if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const erreurs = error.response.data.message
            message.type = 'erreur'
            message.message =  erreurs
            successNotificationToggle()
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      })
    }
  }

  const storeGestionnaire = function() {
    if(chargement.value == false) {
      chargement.value = true
      CampagneService.addGestionnaire(route.params.id,formData).then((data) => {
        message.type = 'success'
        message.message = 'Vous avez ajouté un gestionnaire  à la campagne'
        successNotificationToggle()
        close()
        getData()
        chargement.value = false  
      }).catch((error) => {
        chargement.value = false  
        if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const erreurs = error.response.data.message
            message.type = 'erreur'
            message.message =  erreurs
            successNotificationToggle()
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      })
    }
  }

  const supprimer = function(index,data) {
    deleteModalPreview.value = true
    deleteData.id = data.id
    deleteData.nom = data.nom
    deleteData.index = index
  }
  const deletecampagneBsd = function() {
      deleteModalPreview.value = false
      campagneByBsd.value.splice(campagneByBsd.value.indexOf(deleteData.index), 1);
      CampagneService.destroy(deleteData.id).then((data) => {
        message.type = 'success'
        message.message = 'Operation éffectué avec success'
        successNotificationToggle()
        getData()
      }).catch((error) => {
        
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const erreurs = error.response.data.message
          message.type = 'erreur'
          message.message = erreurs
          successNotificationToggle()
        } else if (error.request) {
        // Demande effectuée mais aucune réponse n'est reçue du serveur.
        //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }
      })
  }

  const modifier = function(index,data) {
    saveUpdate.nom = data.nom
    //saveUpdate.description = data.description
    saveUpdate.id = data.id
    //saveUpdate.groupeId = data.groupe.id
    //saveUpdate.groupeNom = data.groupe.nom
    showModal.value = true
    isUpdate.value = true
  }
  const updateCampagneBsd = function() {
    if(chargement.value == false) {
      chargement.value = true
      const  formData = {
        nom:saveUpdate.nom,
        description:saveUpdate.description,
        groupeId:saveUpdate.groupeId
      }
      CampagneService.update(saveUpdate.id,formData).then((data) => {
        chargement.value = false
        message.type = 'success'
        message.message = 'Mise à jours éffectué avec succèss'
        successNotificationToggle()
        close()
        getData()
        this.getData()
      }).catch((error) => {
        chargement.value = false  
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const erreurs = error.response.data.message
          message.type = 'erreur'
          message.message = erreurs
          successNotificationToggle()
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      })
    }
  }
  const toBack = function() {
    router.go(-1)
  }
</script>

<style lang="scss" scoped>

</style>