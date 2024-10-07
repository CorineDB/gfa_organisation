<template>
  <dashboard>
    <div class="w-full">
      <div v-if="showModal">
        <modal-top-right  :title="title"  v-on:close="close">
          <div class="w-full">
              <vform
                template="default"
                :champs="champs"
                cols="1"
                :submitText="submitText"
                @sendForm="sendForm"
                @closeModal="close" 
              ></vform>
          </div>
        </modal-top-right>
      </div>
      <nav class="mb-2 mt-4 text-sm font-semibold flex justify-between items-center 	" aria-label="Breadcrumb">
        <div>
          <ol class="inline-flex p-0 list-none">
            <li class="flex items-center ">
              <router-link to="#" class="text-gray-600">dashboard</router-link>
              <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            
            <li class="flex items-center text-blue-500 ">
              <router-link to="" class="">indicateurs</router-link>
            </li>
          </ol>
        </div>
        <div>
          <div class="w-full flex text-gray-600">
              <input @input="$emit('search',$event.target.value)" class="h-8 w-full px-5 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none relative -mr-9 block sm:block" v-model="search" type="text" name="search" placeholder="Rechercher" >
              <button type="submit" class="relative  p-2 rounded-lg">
              <svg class="w-4 h-4 text-gray-600 fill-current" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
              viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve"
              width="512px" height="512px">
            <path
              d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
            </button>
          </div>      
        </div>
      </nav>
    
      <div class="my-2 flex justify-between items-center ">
      
        <titre>Indicateurs</titre>
        <button v-if="categorieAdd" @click="addCategorie" title="ajouter une categorie"   class="py-2 px-4  overflow-hidden flex items-center text-xs font-semibold text-white uppercase  bg-primary focus:outline-none focus:shadow-outline">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg></span>
          <span class="mx-2 text-xs  md:text-sm font-semibold">ajouter un indicateur</span>
        </button>
      </div>

      <div class="align-middle inline-block w-full  overflow-hidden  pt-3 rounded-bl-lg rounded-br-lg">
      <table class="w-full p-4">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">#</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">Nom</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">Source de verification</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">Hypothese</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">Projet</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">Resultat</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-primary tracking-wider">Objectif</th>
            <th class="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-primary tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(categorie, i) in filteredCategorie()" :key="i">
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> {{i+1}} </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{{categorie.nom}}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> source de verification </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> hypothese </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> projet </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> resultat </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500"> objectif </td>

            <td class="px-6 py-4 whitespace-no-wrap text-center border-b border-gray-500 text-sm leading-5">
              <div class="flex item-center justify-center">
                <!-- <div title="details"  class="cursor-pointer w-4 mr-2 transform hover:text-blue-500 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div> -->
                
                <div v-if="categorieUpdate" class="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"  @click="modifierCategorie(categorie)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div v-if="categorieDelete"  class="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"  @click="supprimerCategorie(categorie)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>      
            </td>
          </tr>              
        </tbody>
      </table>
      </div>
     </div>
  </dashboard>
</template>

<script>
// import ModalTopRight from '@/components/ModalTopRight'
// import SearchBar from '@/components/SearchBar'
// import Titre from '@/components/Titre'
// import Vmodal from '@/components/Vmodal'
// import Vform from '@/components/Vform'
// import Dashboard from '@/layouts/Dashboard'

import { mapGetters, mapMutations, mapActions } from "vuex"

import extractFormData from "@/utils/extract-data"
export default {
  components: {
    Dashboard,
    Vmodal,
    Titre,
    SearchBar,
    ModalTopRight,
    Vform,
  },
  data() {
      return ({
        showModal:false,
        categorieAttributes: ["nom"],
        submitText: 'Enrégistrer',
        search:'',
        champs: [
        {
          name: "Nom",
          type: "text",
          key: "nom",
          placeholdere: "Nom de la categorie",
          isSelect: false,
          isTextArea: false,
          data: "",
          required: true,
          errors: [],
        }
      ],
      categorieVisible:false,
      categorieAdd:false,
      categorieDelete:false,
      categorieUpdate:false,      
        
      });
    },
    computed: {
    ...mapGetters({
      hasErrors: "GET_ERREURS",
      isLoading: "IS_LOADING",
      categorie: "categories/getCategorie",
      categories: "categories/getCategories",
       currentUser: "auths/GET_AUTHENTICATE_USER",
    }),
  },
  methods: {
      ...mapMutations({
        setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
        setCategorie: "categories/FILL", // map `this.CREATE_INSTANCE_PROGRAMME()` to `this.$store.commit('CREATE_INSTANCE_PROGRAMME')`
      }),

      ...mapActions("categories", {
        fetchCategories: "FETCH_LIST_CATEGORIE",
        saveCategorie: "STORE_CATEGORIE",
        updateCategorie: "UPDATE_CATEGORIE",
        deleteCategorie: "DESTROY_CATEGORIE",
      }),

      addCategorie() {
        this.title = "Ajouter une nouvelle categorie";

        this.submitText = "Enrégistrer";

        this.showCloseModal(true);
      },

      modifierCategorie (categorie) {
        this.title = "Modification de la categorie " + categorie.nom;

        this.submitText = "Modifier";

        this.setCategorie(categorie);

        this.categorieAttributes.forEach((item) => {
          this.champs.find((value, index) => {
            if (value.key === item) {
              this.champs[index]["data"] = this.categorie[item];
            }
          });
        });

        this.showCloseModal(true);
      },
      getPermission() {
        this.currentUser.role[0].permissions.forEach(element => {
            if(element.slug ==='voir-une-categorie') {
             
             
              this.categorieVisible = true
            }
            if(element.slug === 'creer-une-categorie') {
              this.categorieAdd = true
            
            }
            if(element.slug === 'modifier-une-categorie') {
              this.categorieUpdate = true
            }
            if(element.slug ==='supprimer-une-categorie') {
              this.categorieDelete = true
            }
            
          });

      },

      supprimerCategorie(categorie) {
        if ( window.confirm("Voulez-vous supprimer une categorie " + categorie.nom) )
        {
          this.deleteCategorie(categorie.id);
        }
      },
       close() {
        this.showCloseModal();

        this.resetForm();
      },

      showCloseModal(value = false) {
        this.showModal = value;
      },

      resetForm() {
        this.champs = this.champs.map((item) => {
          item.data = "";
          return item;
        });

        window.document.getElementById("vform")?.reset();

        this.setCategorie({});
      },

      filteredCategorie(){
        var self = this;

        return this.categories.filter(function (categorie){
          return categorie.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0;
        });
      },

      async updateInputData(id, attribut, value) {
        await this.updateCategorie({categorie: {[attribut] : value}, id : id}).then((value) => {
          this.setCategorie({})
        }).catch((value, status) => {
          if(this.hasErrors[attribut] !== undefined)
            alert(this.hasErrors[attribut])        
        })
      },

      sendForm() {
        this.champs = this.champs.map((item) => {
          item.errors = [];
          return item;
        });

        let categorie = extractFormData(this.champs, this.categorieAttributes);

        if (this.categorie?.id) {
          this.updateCategorie({ categorie: categorie, id: this.categorie?.id }).then(
            (response) => {
              if (response.status == 200 || response.status == 201) {
                this.close();
              }
            }
          );
        } else {
          this.saveCategorie(categorie).then((response) => {
            if (response.status == 200 || response.status == 201) {
              this.close();
            }
          });
        }
      }

  },

  watch: {
    isLoading: function (value) {
      //this.loading = value
    },

    hasErrors: function (errors) {
      this.champs.forEach((value) => {
        value.errors = errors[value.key];
      });
      //this.errors = errors
    },
  },

  mounted() {
    this.getPermission()
    if(!this.categorieVisible) {
      this.$router.push('/401-non-autorise')
    } 

    this.fetchCategories()
  },

}
</script>

<style scoped>

</style>