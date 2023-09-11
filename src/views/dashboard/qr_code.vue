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
            <div class="text-3xl mt-5">Vous etes sur supprimer {{ deleteData.nom }} ?</div>
            <div class="text-slate-500 mt-2">
              Cette operation est irreverssible ? <br />Cliquer 
              sur annuler pour annuler l'operation
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">
              Annuler
            </button>
            <button type="button" @click="deleteCampagne" class="btn btn-danger w-24">
              Supprimer
            </button>
          </div>
        </ModalBody>
      </Modal>
      <!-- END: Modal Content -->
  
  
      <!-- BEGIN: Modal Content -->
      <Modal :show="showModal" @hidden="close">
        <ModalBody class="p-10 ">
          <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeCampagne">
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Nom</label>
              <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="libellé campagne" />
            </div>
            <div class="my-2">
              
              <label for="regular-form-1" class="form-label">Date de debut</label>
              <input id="regular-form-1" :min="min" type="date" required v-model="formData.debut" class="form-control" placeholder="" />
            </div>
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Date de fin</label>
              <input id="regular-form-1" :min="min" type="date" required v-model="formData.fin" class="form-control" placeholder="" />
            </div>
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Indicateurs </label>
              
              <TomSelect v-model="formData.indicateurId" :options="{placeholder: 'Selectionez un indicateur'}" class="w-full">
                
                <option  
                  v-for="(indicateur,index) in indicateurs" 
                  :key="index" 
                  :value="indicateur.id">{{indicateur.nom}}</option>
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
  
          <form v-else key="modifier" @submit.prevent="updateGroupe">
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Nom</label>
              <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control" placeholder="libellé campagne" />
            </div>
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Date de debut</label>
              <input id="regular-form-1" type="date" required v-model="saveUpdate.debut" class="form-control" placeholder="" />
            </div>
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Date de fin</label>
              <input id="regular-form-1" type="date" required v-model="saveUpdate.fin" class="form-control" placeholder="" />
            </div>
            <div class="my-2">
              <label for="regular-form-1" class="form-label">Indicateurs </label>
              <TomSelect v-model="saveUpdate.indicateurId" :options="{placeholder: 'Selectionez un indicateur'}" class="w-full">
                <option :value="saveUpdate.indicateurId"> {{ saveUpdate.indicateurNom }} </option>
                <option  
                  v-for="(indicateur,index) in indicateurs" 
                  :key="index" 
                  :value="indicateur.id">{{indicateur.nom}}</option>
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
      <!-- END: Modal Content -->
      <!-- BEGIN: Modal Toggle -->
      <div class=" flex justify-between ">
        <button  @click="addCampagne" class="btn btn-primary flex space-x-2 items-center">
          <PlusSquareIcon />
          <span class="uppercase font-semibold"> ajouter</span>
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
     
      <!-- END: Modal Toggle -->
      <div class="overflow-x-auto mt-5">
        <table class="table mt-5">
            <thead class="table-light">
                <tr>
                  <th class="whitespace-nowrap">#</th>
                  <th class="whitespace-nowrap">Campagne </th>
                  <th class="whitespace-nowrap">Debut </th>
                  <th class="whitespace-nowrap">Fin </th>
                  <th class="whitespace-nowrap">Indicateur </th>
                  <th class="whitespace-nowrap">Date creation</th>
                  <th class="whitespace-nowrap">Date mise à jours</th>
                  <th class="whitespace-nowrap">Actions</th>
                </tr>
            </thead>
            <tbody>
             
              <tr v-for="(data , index) in resultQuery " :key="index">
                <td> {{ index +1 }} </td>
                <td>{{data.nom}}</td>
                <td>{{data.debut}}</td>
                <td>{{data.fin}}</td>
                <td> {{data.indicateur.nom}} </td>
                <td> {{data.created_at}} </td>
                <td> {{data.updated_at}}</td>
                <td class="flex space-x-2 items-center">
                  <Tippy 
                    tag="a" 
                    href="javascript:;" 
                    class="tooltip " 
                    content="cliquez pour modifier"> 
                    <span @click="modifier(index,data)" class="text-blue-500 cursor-pointer"> <EditIcon /></span>
                  </Tippy>
                  <Tippy 
                    tag="a" 
                    href="javascript:;" 
                    class="tooltip " 
                    content="cliquez pour supprimer"> 
                    <span @click="supprimer(index,data)" class="text-red-500 cursor-pointer"><Trash2Icon /></span>
                  </Tippy>
  
                  <Tippy 
                    tag="a" 
                    href="javascript:;" 
                    class="tooltip " 
                    content="cliquez pour voir les bsd"> 
                    <span @click="voirBSD(index,data.id)" class="text-indigo-500 cursor-pointer"><EyeIcon /></span>
                  </Tippy>
                  <Tippy 
                    tag="a" 
                    href="javascript:;" 
                    class="tooltip " 
                    content="cliquez pour voir les votes par bsd"> 
                    <span @click="voirVote(index,data.id)" class="text-indigo-500 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide block mx-auto"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span>
                  </Tippy>
                </td>
              </tr>
            </tbody>
        </table>
      </div>
      
      </div>
  </template>
  
  <script setup>
    import { ref,reactive,onMounted,provide,computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router'
    import CampagneService from "@/services/modules/campagne.service";
    import IndicateurService from "@/services/modules/indicateur.service";
  
    const router = useRouter()
    const route = useRoute()
    const showModal = ref(false)
    const deleteModalPreview = ref(false)
    const successNotification = ref();
    const search = ref('')
    const campagnes = ref([])
    const indicateurs = ref([])
    const deleteData = reactive({})
    const saveUpdate = reactive({})
    const chargement = ref(false)
    const isUpdate = ref(false)
    const formData = reactive({
      nom:'',
      debut:'',
      fin:'',
      indicateurId:''
    })
  
    const message = reactive({
      type: 'success',
      message:'',
    })
  
    const min = computed(()=> {
      var d = new Date();
        var day = d.getDate() <= 9 ? `0${d.getDate()}`: d.getDate()
        var month = (d.getMonth()+1) <= 9 ? `0${(d.getMonth()+1)}` : (d.getMonth()+1)
        let min1 = `${d.getFullYear()}-${month}-${day}`
        return min1
    })
  
    const resultQuery = computed(()=> {
      if(search.value){
        return campagnes.value.filter((item)=>{
          return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
          search.value.toLowerCase().split(' ').every(v => item.debut.toLowerCase().includes(v)) ||
          search.value.toLowerCase().split(' ').every(v => item.fin.toLowerCase().includes(v)) ||
          search.value.toLowerCase().split(' ').every(v => item.indicateur.nom.toLowerCase().includes(v)) ||
          search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v)) 
        })
        }else{
          return campagnes.value;
        }
    })
   
    onMounted(function () {
      getData()
      getIndicateur()
    })
  
    const getData = function () {
      CampagneService.get().then((data) => {
        campagnes.value = data.data.data
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
  
    function close() {
      formData.nom = ''
      formData.debut = ''
      formData.fin = ''
      formData.indicateurId = ''
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
  
  
    const addCampagne = function () {
      showModal.value = true
      isUpdate.value = false
    }
  
  
    const storeCampagne = function() {
      if(chargement.value == false) {
        chargement.value = true
        CampagneService.create(formData).then((data) => {
          message.type = 'success'
          message.message = 'Nouveaux campagne créee'
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
  
    const deleteCampagne = function() {
        deleteModalPreview.value = false
        campagnes.value.splice(campagnes.value.indexOf(deleteData.index), 1);
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
      saveUpdate.debut = data.debut
      saveUpdate.fin = data.fin
      saveUpdate.indicateurId = data.indicateur.id
      saveUpdate.indicateurNom = data.indicateur.nom
      saveUpdate.id = data.id
      showModal.value = true
      isUpdate.value = true
    }
  
    const updateGroupe = function() {
      if(chargement.value == false) {
        chargement.value = true
        const  formData = {
          nom:saveUpdate.nom,
          debut:saveUpdate.debut,
          fin:saveUpdate.fin,
          indicateurId:saveUpdate.indicateurId,
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
  
    const voirBSD = function(index,id)  {
      router.push({name:'CampagnesByBsd',params:{id:id}})
    }
    const voirVote = function(index,id)  {
      router.push({name:'Votes',params:{id:id}})
    }
    
  </script>
  
  <style lang="scss" scoped>
  
  </style>