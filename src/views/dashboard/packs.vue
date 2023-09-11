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
          <button type="button" @click="deletePack" class="btn btn-danger w-24">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storePack">

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="Libellé" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">prix</label>
            <input id="regular-form-1" type="number" required v-model="formData.prix" step="500" class="form-control" placeholder="Prix" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Promotion </label>
            <TomSelect v-model="formData.promotionId" :options="{placeholder: 'Selectionez une promotion'}" class="w-full">
              <option  
                v-for="(promotion,index) in promotions" 
                :key="index" 
                :value="promotion.id">{{promotion.nom}}</option>
            </TomSelect>
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="formData.description" class="form-control" placeholder="description" />
          </div>

          <button class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
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

        <form v-else key="modifier" @submit.prevent="updatePack">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control" placeholder="Libellé" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">prix</label>
            <input id="regular-form-1" type="number" required v-model="saveUpdate.prix" step="500" class="form-control" placeholder="Prix" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Promotion </label>
            
            <TomSelect v-model="saveUpdate.promotionId" :options="{placeholder: 'Selectionez une promotion'}" class="w-full">
              <option :value="saveUpdate.promotionId"> {{ saveUpdate.promotionNom }} </option>
              <option  
                v-for="(promotion,index) in promotions" 
                :key="index" 
                :value="promotion.id">{{promotion.nom}}</option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.description" class="form-control" placeholder="description" />
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
      <button  @click="addPack" class="btn btn-primary flex space-x-2 items-center">
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
                <th class="whitespace-nowrap">Pack</th>
                <th class="whitespace-nowrap">Prix </th>
                <th class="whitespace-nowrap">Description </th>
                <th class="whitespace-nowrap">Promotion </th>
                <th class="whitespace-nowrap">Pourcentage </th>
                <th class="whitespace-nowrap">Date creation</th>
                <th class="whitespace-nowrap">Date mise à jours</th>
                <th class="whitespace-nowrap">Actions</th>
              </tr>
          </thead>
          <tbody>
            
            <tr v-for="(data , index) in resultQuery " :key="index">
              <td> {{ index +1 }} </td>
              <td>{{data.nom}}</td>
              <td>{{data.prix}} XOF </td>
              <td>{{data.description}}  </td>
              <td> {{ data.promotion.nom }} </td>
              <td> {{ data.promotion.pourcentage }} % </td>
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
              </td>
            </tr>
          </tbody>
      </table>
    </div>
    
    </div>
</template>

<script setup>
  import { ref,reactive,onMounted,provide,computed } from 'vue';
  import PackService from "@/services/modules/pack.service";
  import PromotionService from "@/services/modules/promotion.service";
  const showModal = ref(false)
  const deleteModalPreview = ref(false)
  const successNotification = ref();
  const search = ref('')
  const promotions = ref([])
  const packs = ref([])
  const deleteData = reactive({})
  const saveUpdate = reactive({})
  const chargement = ref(false)
  const isUpdate = ref(false)
  const formData = reactive({
    nom:'',
    description:'',
    prix:'',
    promotionId:''
  })

  const message = reactive({
    type: 'success',
    message:'',
  })

  const resultQuery = computed(()=> {
    if(search.value){
      return packs.value.filter((item)=>{
        return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.prix.toString().toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.description.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.promotion.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.promotion.pourcentage.toString().toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v)) 
      })
      }else{
        // return packs.value;

        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return packs.value.slice(startIndex, endIndex);
      }
  })
 
  onMounted(function () {
    getPromotion()
    getData()
  })

  const getData = function () {
    PackService.get().then((data) => {
      packs.value = data.data.data
    }).catch((e) => {
     // disabled()
      alert(e)
    })
  }
  const getPromotion = function () {
    PromotionService.get().then((data) => {
      promotions.value = data.data.data
    }).catch((e) => {
     // disabled()
      alert(e)
    })
  }
  function close() {
    formData.nom = ''
    formData.description = ''
    formData.prix = ''
    formData.promotionId = ''
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


  const addPack = function () {
    showModal.value = true
    isUpdate.value = false
  }

  const storePack = function() {
    if(chargement.value == false) {
      chargement.value = true
      PackService.create(formData).then((data) => {
        message.type = 'success'
        message.message = 'Pack creer avec success '
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
  const deletePack = function() {
    deleteModalPreview.value = false
    packs.value.splice(packs.value.indexOf(deleteData.index), 1);
    PackService.destroy(deleteData.id).then((data) => {
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
    saveUpdate.id = data.id
    saveUpdate.nom = data.nom
    saveUpdate.description = data.description
    saveUpdate.prix = data.prix
    saveUpdate.promotionId = data.promotion.id
    saveUpdate.promotionNom = data.promotion.nom
    showModal.value = true
    isUpdate.value = true
  }
  const updatePack = function() {
    if(chargement.value == false) {
      chargement.value = true
      const  formData = {
        nom:saveUpdate.nom,
        description:saveUpdate.description,
        prix:saveUpdate.prix,
        promotionId:saveUpdate.promotionId
      }
      PackService.update(saveUpdate.id,formData).then((data) => {
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
</script>

<style lang="scss" scoped>

</style>