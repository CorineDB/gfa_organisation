<template>
  <div class="w-full">
    <vmodal v-if="showProlonger" title="prolonger la date d'echeance " @close="showProlonger = false">
      <div style="width:60vw" class="p-0 w-full">
        <form @submit.prevent="saveProlongerDate(activiteId, dates)" action="">

          <div class="grid grid-cols-2 gap-2 my-2">
            <div class="form-group my-2">
              <label class="text-xs font-semibold block text-gray-500 uppercase md:text-sm text-light">Date debut<span
                  class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
              <input v-model="dates.debut" required
                class="px-3 py-2 mt-1 border-2 border-gray-300  focus:outline-none focus:ring-2 w-full  focus:border-transparent"
                type="date" />
            </div>
            <div class="form-group my-2">
              <label class="text-xs font-semibold block text-gray-500 uppercase md:text-sm text-light">Date fin <span
                  class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span></label>
              <input v-model="dates.fin" required
                class="px-3 py-2 mt-1 border-2 border-gray-300  focus:outline-none focus:ring-2 w-full  focus:border-transparent"
                type="date" />
            </div>
          </div>
          <button type="submit"
            class="bg-primary  flex space-x-2  items-center text-white px-4 py-2 border border-primary font-semibold uppercase">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              enregistrer
            </span>
            <span v-else class="flex items-center space-x-2">
              <span class="text-xs px-4 font-semibold ">
                envoi ...
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-center animate-spin" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </vmodal>

    <modal-top-right v-if="showModal2" :title="title" v-on:close="closeB">
      <div class="p-4 overflow-auto">
        <vform template="default" :champs="champs2" :cols="cols" :savedInput="savedInput"  :submitText="submitText" :sendRequest="sendRequest"
          @sendForm="savePlanDecaissement" @closeModal="close2"></vform>
      </div>

    </modal-top-right>

    <delete-alert v-if="deleteModal" type="danger" title="Confirm Action" width="sm" v-on:close="deleteModal = false">
      <p class="text-gray-800">
        voulez vous supprimer cette activité?
      </p>

      <div class="text-right mt-4">
        <button @click="deleteModal = false"
          class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline">Annuler</button>
        <button class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
          @click="deleteActivites(deleteData)">Supprimer</button>
      </div>
    </delete-alert>

    <modal-top-right v-if="showModal" :title="title" v-on:close="closeA">
      <div class="p-4 overflow-auto">
        <vform template="default" :champs="champs" :cols="cols" :submitText="submitText" :sendRequest="sendRequest"
          @sendForm="sendForm" @closeModal="close"></vform>
      </div>

    </modal-top-right>

    <nav class="text-xs md:text-sm font-semibold flex justify-between items-center flex-wrap" aria-label="Breadcrumb">
      <div class="mb-2">
        <ol class="inline-flex p-0 list-none">
          <li class="flex items-center">
            <router-link to="#" class="text-gray-600">dashboard</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li class="flex items-center">
            <router-link to="/dashboard/projets" class="text-gray-600">projets</router-link>
            <svg class="w-3 h-3 mx-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>

          <li class="flex items-center text-blue-500">
            <router-link to="" class="">activités</router-link>
          </li>
        </ol>
      </div>
      <div>
        <search-bar @search="getSearchValue"></search-bar>
      </div>
    </nav>

    <div class="flex items-center justify-between my-2 flex-wrap sm:flex-nowrap">
      <div class="flex space-x-2  md:space-x-4 w-full sm:w-4/5  ">
        <span v-if="activiteVisible" :class="{ 'border-primary border-b-8 font-bold': seeActivite }"
          @click="gotoActivite()"
          class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase border-primary py-2 mb-2">Activités</span>
        <span v-if="planDecaissementVisible" :class="{ 'border-primary border-b-8 font-bold': seePlan }"
          @click="gotoPlan()"
          class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase py-2 mb-2">Plan de décaissement
        </span>

        <span :class="{ 'border-primary border-b-8 font-bold': seeStatistique }" @click="gotoStatistique()"
          class="inline-block cursor-pointer text-xs sm:text-sm  md:text-base uppercase py-2 mb-2">Statistiques
        </span>
      </div>
      <div>
        <button v-if="seeActivite && activiteAdd" @click="addActivite" title="ajouter une activite"
          class="px-4 py-2 flex overflow-hidden items-center text-xs font-semibold text-white uppercase bg-primary focus:outline-none focus:shadow-outline">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg></span>
          <span class="mx-2 text-xs font-semibold">ajouter </span>
        </button>

        <button v-if="seePlan && planDeDecaissement" @click="addPlan" title="ajouter"
          class="p-2 overflow-hidden flex space-x-2 items-center text-xs font-semibold text-white uppercase  bg-primary focus:outline-none focus:shadow-outline">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: ">
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg></span>
          <span class="mx-2 text-xs  md:text-sm font-semibold">ajouter</span>
        </button>
      </div>
    </div>

    <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
      <div class=" mx-auto">
        <div class="mb-4">
          <ul class="flex flex-wrap -mb-px items-end  space-y-4" id="myTab" data-tabs-toggle="#myTabContent"
            role="tablist">

            <li class="mr-2" role="presentation">

              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un projet</label>
                <multiselect v-model="projetFiltre" :options="projets" :preselect-first="true" :custom-label="customLabelP"
                    placeholder="selectionnez un projet" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" label="nom" track-by="id">
                </multiselect>
              </div>

            </li>
            <li class="mr-2" role="presentation">
              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un composant</label>
                <multiselect v-model="composanteFiltre" :options="composantes" :preselect-first="true"
                    :custom-label="customLabel" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" placeholder="selectionnez une composante" label="nom" track-by="id">
                </multiselect>
              </div>

            </li>
            <li class="mr-2" role="presentation">
              <div>
                <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un sous composant</label>
                <multiselect v-model="valueFiltre" :options="sousComposantes" :preselect-first="true"
                    :custom-label="customLabel" :selectLabel="'Appuyez sur Entrée pour sélectionner'" :deselectLabel="'Appuyez sur Entrée pour supprimer'" selectedLabel="Selectionné" placeholder="selectionnez une sous composante" label="nom" track-by="id">
                </multiselect>
              </div>

            </li>
          </ul>
          <ul class="flex flex-wrap justify-end -mb-px">
            <li class="mr-2" role="presentation">
              <button @click="toggle2" :class="{ 'active': pending }"
                class="inline-block text-yellow-500 hover:text-yellow-600 hover:border-yellow-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-yellow-400 dark:hover:text-yellow-300 "
                id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile"
                aria-selected="true">Non démarré

                <span
                  class="px-2 py-1 text-sm font-medium leading-normal text-center align-middle  text-white bg-yellow-600 rounded-full undefined ">
                  {{ enAttente.length }}
                </span>

              </button>
            </li>
            <li class="mr-2" role="presentation">
              <button @click="toggle3" :class="{ 'active': inProgress }"
                class="inline-block text-blue-500 hover:text-blue-600 hover:border-blue-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-blue-400 dark:hover:text-blue-300 "
                id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard"
                aria-selected="false">En cours

                <span
                  class="px-2 py-1 text-sm text-center align-middle font-medium leading-normal  text-white bg-indigo-600 rounded-full undefined">
                  {{ enCours.length }}
                </span>
              </button>
            </li>
            <li class="mr-2" role="presentation">
              <button @click="toggle" :class="{ 'active': success }"
                class="inline-block text-green-500 hover:text-green-600 hover:border-green-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-green-400 dark:hover:text-green-300"
                id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings"
                aria-selected="false">Terminé

                <span
                  class="px-2 py-1 text-sm font-medium leading-normal  text-white  text-center align-middle  bg-green-600 rounded-full undefined">
                  {{ terminer.length }}
                </span>
              </button>
            </li>
            <li role="presentation">
              <button @click="toggle4" :class="{ 'active': retard }"
                class="inline-block text-red-500 hover:text-red-600 hover:border-red-300 rounded-t-lg p-2 text-sm font-medium text-center border-transparent border-b-2 dark:text-red-400 dark:hover:text-red-300"
                id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts"
                aria-selected="false">En retard

                <span
                  class="px-2 py-1 text-sm font-medium leading-normal  text-white bg-red-600 text-center align-middle  rounded-full undefined">
                  {{ retardData.length }}
                </span>

              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>




    <div v-if="seeActivite && activiteVisible">
      <div v-if="!isSearch" class="version sans recherche">

        <div v-if="success">
          <empty v-if="terminer.length === 0">activité vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(activite, index) in terminer" :key="index">
                <card-activite :data="activite" :bailleur="activite.bailleur.sigle" :libelle="activite.nom"
                  :poids="activite.poids" :code="activite.codePta" :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational" :debut="activite.debut" :fin="activite.fin" :durees="activite.durees"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)" @supprimer="supprimer(activite)" @prolonger="prolonger(activite)"
                  @suivre="suivreMyActivite(activite)" @gotoNext="gotoNext(activite)" @validation="validation" :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"></card-activite>
                <!-- End cards Activités -->
              </div>
            </div>
          </div>
        </div>

        <div v-if="pending">
          <empty v-if="enAttente.length === 0">activité vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(activite, index) in enAttente" :key="index">
                <card-activite :data="activite" :bailleur="activite.bailleur.sigle" :libelle="activite.nom"
                  :poids="activite.poids" :code="activite.codePta" :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational" :debut="activite.debut" :fin="activite.fin" :durees="activite.durees"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)" @supprimer="supprimer(activite)" @prolonger="prolonger(activite)"
                  @suivre="suivreMyActivite(activite)" @validation="validation" @gotoNext="gotoNext(activite)" :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"></card-activite>
                <!-- End cards Activités -->
              </div>
            </div>
          </div>
        </div>

        <div v-if="inProgress">
          <empty v-if="enCours.length === 0">activité vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(activite, index) in enCours" :key="index">
                <card-activite :data="activite" :bailleur="activite.bailleur.sigle" :libelle="activite.nom"
                  :poids="activite.poids" :code="activite.codePta" :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational" :debut="activite.debut" :fin="activite.fin" :durees="activite.durees"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)" @supprimer="supprimer(activite)" @prolonger="prolonger(activite)"
                  @suivre="suivreMyActivite(activite)" @validation="validation" @gotoNext="gotoNext(activite)" :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"></card-activite>
                <!-- End cards Activités -->
              </div>
            </div>
          </div>
        </div>

        <div v-if="retard">
          <empty v-if="retardData.length === 0">activité vide !!!</empty>
          <div v-else>
            <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
              <div v-for="(activite, index) in retardData" :key="index">
                <card-activite :data="activite" :bailleur="activite.bailleur.sigle" :libelle="activite.nom"
                  :poids="activite.poids" :code="activite.codePta" :montantEPM="activite.pret"
                  :montantNE="activite.budgetNational" :debut="activite.debut" :fin="activite.fin" :durees="activite.durees"
                  :statut="getStatus(activite.statut)"
                  :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                  @modifier="modifier(activite)" @supprimer="supprimer(activite)" @prolonger="prolonger(activite)"
                  @suivre="suivreMyActivite(activite)" @validation="validation" @gotoNext="gotoNext(activite)" :isDelete="activiteDelete"
                  :isUpdate="activiteUpdate"></card-activite>
                <!-- End cards Activités -->
              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-else>
        <empty v-if="filtere.length === 0">activité vide !!!</empty>
        <div v-else>
          <div v-if="isShow" class="grid grid-cols-1 my-4 lg:grid-cols-3 md:grid-cols-2 sm:gap-5">
            <div v-for="(activite, index) in filtere" :key="index">
              <card-activite :code="activite.codePta" :data="activite" :bailleur="activite.bailleur.sigle"
                :libelle="activite.nom" :poids="activite.poids" :montantEPM="activite.pret"
                :montantNE="activite.budgetNational" :debut="activite.debut" :fin="activite.fin" :durees="activite.durees"
                :statut="getStatus(activite.statut)"
                :structureResponsable="activite.structureResponsable !== null ? getNom(activite.structureResponsable.nom, activite.structureResponsable.prenom) : ''"
                @modifier="modifier(activite)" @supprimer="supprimer(activite)" @prolonger="prolonger(activite)"
                @suivre="suivreMyActivite(activite)" @validation="validation" @gotoNext="gotoNext(activite)" :isDelete="activiteDelete"
                :isUpdate="activiteUpdate"></card-activite>
              <!-- End cards Activités -->
            </div>
          </div>
        </div>
      </div>






    </div>

    <div v-if="seePlan && planDecaissementVisible">
      <div class="p-2 my-4 rounded-sm shadow-md bg-gray-50">
        <div class="flex items-center justify-between flex-wrap">
          <!--Filtre sur projet -->
          <div class="w-2/5 flex items-center space-x-2">

            <multiselect v-model="activiteFiltre" :options="activites" :preselect-first="true"
              placeholder="selectionnez une activite" label="nom" track-by="id"></multiselect>
          </div>

        </div>

      </div>

      <div class="my-4 grid grid-cols-4 gap-2">
        <div v-for="(planDeDecaissement, index) in planDeDecaissements" :key="index">
          <card>
            <div class="p-2">
              <div class="flex justify-between">
                <h1 class="font-base font-bold text-gray-900">
                  {{ planDeDecaissement.annee }}
                </h1>
                <div>
                  <dropdown v-if="planDeDecaissementUpdate && planDecaissementDelete"
                    @modifier="modifierPlan(planDeDecaissement)" @supprimer="supprimerPlan(planDeDecaissement)"
                    :option="optionActivite"></dropdown>
                  <dropdown v-if="planDeDecaissementUpdate && planDecaissementDelete == false"
                    @modifier="modifierPlan(planDeDecaissement)" @supprimer="supprimerPlan(planDeDecaissement)"
                    :option="optionActiviteUpdate"></dropdown>
                  <dropdown v-if="!planDeDecaissementUpdate && planDecaissementDelete"
                    @modifier="modifierPlan(planDeDecaissement)" @supprimer="supprimerPlan(planDeDecaissement)"
                    :option="optionActiviteD"></dropdown>
                </div>
              </div>
              <div class="my-2">
                <p class="text-sm font-semibold py-1">
                  <span class="font-bold">Activité :</span>
                  <span class="text-gray-700"> {{ planDeDecaissement.activite.nom }} </span>
                </p>
                <p class="text-sm font-semibold py-1">
                  <span class="font-bold">Trimestre :</span>
                  <span class="text-gray-700"> {{ planDeDecaissement.trimestre }} </span>
                </p>
                <p class="text-sm font-semibold py-1">
                  <span class="font-bold">Montant BN :</span>
                  <span class="text-gray-700"> {{ planDeDecaissement.budgetNational }}</span>
                </p>
                <p class="text-sm font-semibold py-1">
                  <span class="font-bold">Montant EPM-PRET :</span>
                  <span class="text-gray-700"> {{ planDeDecaissement.pret }}</span>
                </p>
                <p class="text-sm font-semibold py-1">
                  <span class="font-bold pr-2">De</span> {{ planDeDecaissement.debut }}
                  <span class="font-bold px-2">Au</span> {{ planDeDecaissement.fin }}
                </p>
                <div class="flex justify-between">
                  <div></div>

                  <!-- <div class="flex space-x-2">
                      <span title="supprimer" class="text-red-500 cursor-pointer "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path></svg></span>
                      <span title="modifer" class="text-blue-500 cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span>
                      <span title="dupliquer" class="cursor-pointer"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"></path></svg></span>
                      <span title="continuer" class="cursor-pointer" ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z"></path></svg></span>
                    </div> -->
                </div>
              </div>
            </div>
          </card>
        </div>
      </div>

    </div>

    <div v-if="seeStatistique">
      <div class="flex items-center justify-between flex-wrap">
        <!--Filtre sur projet -->
        <div class="w-full grid grid-cols-2 items-center gap-4">
          <div>
            <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un projet</label>
            <multiselect v-model="projetFiltre" :options="projets" :preselect-first="true" :custom-label="customLabel"
              placeholder="selectionnez un projet" label="nom" track-by="id"></multiselect>
          </div>

          <div>
            <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un composant</label>
            <multiselect v-model="composanteFiltre" :options="composantes" :preselect-first="true"
              :custom-label="customLabel" placeholder="selectionnez une composante" label="nom" track-by="id">
            </multiselect>
          </div>
          <div>

            <label for="" class="block text-sm font-semibold uppercase my-2 ">Selectionnez un sous composant</label>
            <multiselect v-model="valueFiltre" :options="sousComposantes" :preselect-first="true"
              :custom-label="customLabel" placeholder="selectionnez une sous composante" label="nom" track-by="id">
            </multiselect>
          </div>

          <div></div>

        </div>

      </div>
      <div class="">
        <select
          class="px-11 py-2 mt-1 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
          name="" id="">
          <option class="font-semibold">Tous</option>
          <option class="font-semibold" v-for="i in 5" :key="i.id" value="">
            projet {{ i }}
          </option>
        </select>
      </div>
      <div class="grid  grid-cols-1 gap-4  md:grid-cols-2 md:gap-8 my-6 items-center">
        <div>
          <apexchart width="80%" type="pie" :options="chartOptions" :series="chartOptions.series"></apexchart>
        </div>
        <div>
          <apexchart type="bar" height="350" :options="chartOptionsExBar" :series="series"></apexchart>
        </div>

        <div>
          <apexchart width="80%" type="pie" :options="chartOptionsFi" :series="chartOptionsFi.series"></apexchart>
        </div>

        <div>
          <apexchart type="bar" height="350" :options="chartOptionsFiBar" :series="series"></apexchart>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import Vtable from "@/components/Vtable";
import Multiselect from "vue-multiselect";
import Dropdown from "@/components/Dropdown";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import Titre from "@/components/Titre";
import CardActivite from "@/components/CardActivite";
import Vmodal from "@/components/Vmodal";
import Vform from "@/components/Vform";
import ModalTopRight from "@/components/ModalTopRight";
import Dashboard from "@/layouts/Dashboard";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { extractFormData, getStringValueOfStatutCode } from "@/utils/index";
import Composante from "@/store/modules/composantes/composante";
import Empty from '@/components/Empty.vue'
import ComposanteService from "@/services/modules/composante.service.js";
import Activite from '@/store/modules/activites/activite';
import DeleteAlert from "@/components/DeleteAlert.vue";
import moment from 'moment'
import ProgrammeService from "@/services/modules/programme.service.js";
import ActiviteService from "@/services/modules/activite.service.js";

export default {
  components: {
    Dashboard,
    Vmodal,
    ModalTopRight,
    Titre,
    SearchBar,
    Card,
    Multiselect,
    Dropdown,
    CardActivite,
    DeleteAlert,
    Vtable,
    Empty,
    Vform
  },
  data() {
    return {
      savedInput: [],
      suivis: [],
      valueFiltre: null,
      activiteFiltre: null,
      composanteId: null,
      sousComposanteId: null,
      projetFiltre: null,
      composanteFiltre: null,
      pending: false,
      success: true,
      inProgress: false,
      retard: false,
      activiteId: '',
      programmeId: '',
      cols: 1,
      sendRequest: false,
      submitText: "Enregistrer",
      rangeValue: 0,
      showFiltre: false,
      showProlonger: false,
      chargement: false,
      activiteAttributs: ['nom', 'description', 'debut', 'fin', 'budgetNational', 'structureResponsableId', 'structureAssocieId', 'types', 'pret', 'poids'],
      dates: { debut: '', fin: '' },
      planDeDecaissementAttributs: ['annee', 'trimestre', 'pret', 'budgetNational'],
      champs: [
        { name: 'Nom de l\'activité', key: "nom", type: 'text', placeholdere: "Nom de l\'activité", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Type', key: "types", type: '', placeholdere: 'Selectionnez le type d\'activite', isSelect: true, isTextArea: false, data: '', required: true, options: this.$store.state.types, cle: 'type', value: 'nom', errors: [] },
        { name: 'Poids', type: 'number', key: "poids", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de début', key: "debut", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Date de fin', key: "fin", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Structure Responsable', key: "structureResponsableId", type: '', placeholdere: 'Veuillez selectionnez la structure responsable', isSelect: true, isTextArea: false, data: '', required: true, options: this.structures, cle: 'id', value: 'nom', errors: [] },
        { name: 'Structure associée', key: "structureAssocieId", type: '', placeholdere: 'Veuillez selectionnez la structure associée', isSelect: true, isTextArea: false, data: '', required: true, options: this.structures, cle: 'id', value: 'nom', errors: [] },
        { name: 'Description', type: '', key: "description", placeholdere: 'Description ede l\'activité', isSelect: false, isTextArea: true, data: '', required: false, errors: [] },
      ],
      champs2: [
        { name: 'Année de base', key: "annee", type: 'date', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Trimestre', key: "trimestre", type: '', placeholdere: 'Selectionnez le trimestre du plan', isSelect: true, isTextArea: false, data: '', required: true, options: this.$store.state.trimestres, cle: 'valeur', value: 'trimestre', errors: [] },
        { name: 'Prêt', type: 'number', key: "pret", placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
        { name: 'Budget National', key: "budgetNational", type: 'number', placeholdere: "", isSelect: false, isTextArea: false, data: '', required: true, errors: [] },
      ],

      showModal: false,
      showModal2: false,
      line: false,
      mosaique: true,
      showInput: true,
      isStateChange: false,
      seeStatistique: false,
      seePlan: false,
      seeActivite: true,
      option: [{ name: "supprimer" }, { name: "modifier" }],

      optionActivite: [
        { name: "supprimer" },
        { name: "modifier" }
      ],
      optionActiviteUpdate: [
        { name: "modifier" }
      ],
      optionActiviteD: [

        { name: "modifier" }
      ],

      dates: {
        debut: '', fin: ''
      },

      series: [
        {
          name: "Inflation",
          data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
        },
      ],

      chartOptionsExBar: {
        chart: {
          height: 350,
          type: "bar",
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },

          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },

          axisTicks: {
            show: false,
          },

          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },

        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },

        title: {
          text: "Taux execution du projet",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        }
      },

      chartOptionsFiBar: {
        chart: {
          height: 350,
          type: "bar",
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        title: {
          text: "Taux financier",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },

      chartOptions: {
        series: [44, 55],
        chart: {
          width: 380,
          type: "pie",
        },

        labels: ["Executé", "Non éxecute"],
        title: {
          text: "STATISTIQUE TAUX FINANCIER",
          align: "left",
          style: {
            fontSize: "18px",
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ]
      },

      chartOptionsFi: {
        series: [44, 55],
        chart: {
          width: 380,
          type: "pie",
        },

        labels: ["Utilisé", "Non utilise"],
        title: {
          text: "STATISTIQUE TAUX FINANCIER",
          align: "left",
          style: {
            fontSize: "18px",
          },
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ]
      },

      headers: [
        { name: "Activité", cle: "activite" },
        { name: "code pta", cle: "codePta" },
        { name: "poids initial", cle: 'poidsInitial' },
        { name: "poids actuel", cle: 'poidsActuel' },
        { name: "date de création", cle: 'created_at' },

      ],
      dataTable: [],
      activiteVisible: false,
      activiteAdd: false,
      activiteDelete: false,
      activiteUpdate: false,
      planDecaissementVisible: false,
      planDecaissementAdd: false,
      planDecaissementUpdate: false,
      planDecaissementDelete: false,
      StatistiqueVisible: false,
      idProjet: '',
      idComposante: '',
      idSC: '',
      newProjet: null,
      newComponent: null,
      newSC: null,
      isClick: false,
      isShow: true,
      sous_composantes: [],
      search: '',
      isSearch: false,
      projets: [],
      deleteData: {},
      deleteModal: false,
    };
  },

  computed: {
    //importation des variables du module activites
    ...mapState({
      activite: (state) => state.activites.activite,
      loading: (state) => state.loading,
      errors: (state) => state.errors,
    }),
    allData() {
      if (this.terminer != undefined || this.enAttente != undefined || this.enCours != undefined || this.retardData != undefined) {
        return [].concat(this.terminer, this.enAttente, this.enCours, this.retardData)
      }
    },
    filtere: function () {
      var self = this;
      return this.allData.filter(function (data) {
        return data.nom.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      });
    },
    terminer() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == 2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enAttente() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == -1 || element.statut == -2) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    enCours() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == 0) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    retardData() {
      if (this.activites != undefined) {
        const datas = []
        this.activites.forEach(element => {
          if (element.statut == 1) {
            datas.push(element)
          }
        })
        return datas
      }
    },
    ...mapGetters({
      structures: "structures/getStructures",

      composantes: "composantes/getComposantes",
      sousComposantes: "sousComposantes/getSousComposantes",
      activites: "activites/getActivites",
      activite: "activites/getActivite",
      planDeDecaissements: "planDeDecaissements/getPlanDeDecaissements",
      planDeDecaissement: "planDeDecaissements/getPlanDeDecaissement",
      currentUser: 'auths/GET_AUTHENTICATE_USER'
    }),
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },

  methods: {
    getSearchValue(data) {
      if (data != '') {
        this.isSearch = true
        this.search = data
      }
      else {
        this.isSearch = false
        this.search = data
      }

    },
    changeProjet(projet) {

      if (this.isClick) {
        this.projetFiltre = this.newProjet
        this.fetchComposantes(this.idProjet);
        this.isClick = false
        localStorage.removeItem('profondeurSC');
      } else {
        this.fetchComposantes(projet.id);
        let indexProjet = 0
        for (let index = 0; index < this.projets.length; index++) {
          const element = this.projets[index];
          if (projet.id == element.id) {
            indexProjet = index
          }
        }
        let composantes = this.projets[indexProjet].composantes
        
        if (composantes[0] != null) {

          let code = composantes[0].codePta
          let nom = composantes[0].nom
          this.composanteFiltre = { codePta: code, nom: nom }
          let indexComposante = composantes[0].id
          ComposanteService.sousComposantes(indexComposante).then((data) => {
            const sous_composantes = data.data.data
            if (sous_composantes[0] != null) {
              let code = sous_composantes[0].codePta
              let nom = sous_composantes[0].nom
              this.valueFiltre = { codePta: code, nom: nom }
              /* id sous composante */
              let indexSC = sous_composantes[0].id
              this.composanteId = indexSC
              this.fetchActivites(indexSC);
              this.isShow = true
            }
            else {

              this.composanteId = indexComposante
              this.fetchActivites(indexComposante);
              this.isShow = true
              this.valueFiltre = null
            }

          }).catch((error) => {
            if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }

          })

        }
        else {
          this.isShow = false
          this.composanteFiltre = null
          this.valueFiltre = null
        }

        //this.fetchActivites(Scomposante.id);
      }
    },
    changeComposante(composante) {
      if (this.isClick) {
        this.composanteFiltre = this.newComponent
        this.fetchSousComposantes(this.idComposante);
        this.isClick = false
        localStorage.removeItem('profondeurSC');
      } else {
        ComposanteService.sousComposantes(composante.id).then((data) => {
          const sous_composantes = data.data.data
          if (sous_composantes[0] != null) {
            let code = sous_composantes[0].codePta
            let nom = sous_composantes[0].nom
            this.valueFiltre = { codePta: code, nom: nom }
            /* id sous composante */
            let indexSC = sous_composantes[0].id
            this.composanteId = indexSC
            this.fetchActivites(indexSC);
            this.isShow = true
          }
          else {
            this.composanteId = composante.id
            this.fetchActivites(composante.id);
            this.isShow = true
            this.valueFiltre = null
          }

        }).catch((error) => {
          if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }

        })
      }


    },

    changeSC(Scomposante) {
     
      this.composanteId = Scomposante.id
      if (this.isClick) {
        this.valueFiltre = this.newSC
        this.fetchActivites(this.idSC);
        this.isClick = false
        localStorage.removeItem('profondeurSC');
        this.isShow = true
      } else {
        this.fetchActivites(Scomposante.id);
        this.isShow = true
      }

    },

    getSComposante(id) {
      ComposanteService.sousComposantes(id).then((data) => {
        const datas = data.data.data
        this.sous_composantes = datas

      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }

      })
    },
    //Charger les fonctions de communication avec le serveur
    ...mapMutations({
      setErrors: "SET_ERRORS_MESSAGE", // map `this.setErrors()` to `this.$store.commit('SET_ERRORS_MESSAGE')`,
      setPlanDeDecaissement: "planDeDecaissements/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setPlanDeDecaissements: "planDeDecaissements/SET_LIST_PLAN_DE_DECAISSEMENT",
      setActivite: "activites/FILL", // map `this.CREATE_INSTANCE_PROJET()` to `this.$store.commit('CREATE_INSTANCE_PROJET')`
      setActivites: "activites/SET_LIST_ACTIVITES",
      setComposantes: 'composantes/SET_LIST_COMPOSANTES',
      setSousComposantes: 'sousComposantes/SET_LIST_SOUSCOMPOSANTE'
    }),

    ...mapActions("activites", {
      fetchActivites: "FETCH_LIST_ACTIVITE_OF_COMPOSANTE",
      saveActivite: "STORE_ACTIVITE",
      updateActivite: "UPDATE_ACTIVITE",
      deleteActivite: "DESTROY_ACTIVITE",
    }),

    ...mapActions("planDeDecaissements", {
      fetchPlanDeDecaissements: "FETCH_LIST_PLAN_DE_DECAISSEMENT_ACTIVITE",
      savePlanDeDecaissement: "STORE_PLAN_DE_DECAISSEMENT",
      updatePlanDeDecaissement: "UPDATE_PLAN_DE_DECAISSEMENT",
      deletePlanDeDecaissement: "DESTROY_PLAN_DE_DECAISSEMENT",
    }),

    ...mapActions({
      fetchComposantes: "composantes/FETCH_LIST_COMPOSANTE_OF_PROJET",
      fetchSousComposantes: "sousComposantes/FETCH_LIST_SOUS_COMPOSANTE_OF_COMPOSANTE",
      fetchProjets: "projets/FETCH_LIST_PROJET_OF_PROGRAMME",
    }),

    gotoNext(activite, index) {
      let idProjet = ''
      let idComposante = ''
      let idSC = activite.composanteId
      let codeP = ''
      let nomP = ''
      let codeC = ''
      let nomC = ''
      let codeSC = ''
      let nomSC = ''
      let codeActivite = activite.codePta
      let nomActivite = activite.nom
      for (let index = 0; index < this.sousComposantes.length; index++) {
        const element = this.sousComposantes[index];
        if (element.id == activite.composanteId) {

          codeSC = element.codePta
          nomSC = element.nom
          idProjet = element.projetId
          idComposante = element.composanteId
        }

      }
      for (let index = 0; index < this.composantes.length; index++) {
        const element = this.composantes[index];
        if (element.id == idComposante) {

          codeC = element.codePta
          nomC = element.nom

        }
      }
      for (let index = 0; index < this.projets.length; index++) {
        const element = this.projets[index];
        if (element.id == idProjet) {

          codeP = element.codePta
          nomP = element.nom
        }
      }


      const profondeurActivite = {
        isClick: true,
        idP: idProjet,
        idC: idComposante,
        idSC: idSC,
        idActivite: activite.id,
        projet: { codePta: codeP, nom: nomP },
        composante: { codePta: codeC, nom: nomC },
        sousComposante: { codePta: codeSC, nom: nomSC },
        activite: { codePta: codeActivite, nom: nomActivite }
      }

      localStorage.setItem('profondeurActivite', JSON.stringify(profondeurActivite));
     
      this.$router.push({ name: 'dashboard_projets_taches_globale' })
    },

    ...mapActions("structures", {
      fetchStructure: "FETCH_LIST_STRUCTURE_OF_PROGRAMME",
    }),

    customLabelP({ bailleur, nom }) {
      return `${bailleur.sigle} – ${nom}`
    },
    customLabel({ codePta, nom }) {
      return `${codePta} – ${nom}`
    },

    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {

        if (element.slug === 'creer-une-activite') {
          this.activiteAdd = true
        }
        if (element.slug === 'voir-une-activite') {
          this.activiteVisible = true
        }
        if (element.slug === 'modifier-une-activite') {
          this.activiteUpdate = true
        }
        if (element.slug === 'supprimer-une-activite') {
          this.activiteDelete = true
        }
        //plan de decaissement

        if (element.slug === 'voir-un-plan-de-decaissement') {
          this.planDecaissementVisible = true
        }
        if (element.slug === 'creer-un-plan-de-decaissement') {
          this.planDecaissementAdd = true
        }
        if (element.slug === 'modifier-un-plan-de-decaissement') {
          this.planDecaissementUpdate = true
        }
        if (element.slug === 'supprimer-un-plan-de-decaissement') {
          this.planDecaissementDelete = true
        }
        if (element.slug === 'voir-une-statistique-activite') {
          this.StatistiqueVisible = true
        }

      });
    },

    getSuivi() {
      ActiviteService.getSuivi().then((data) => {
        const datas = data.data.data
        datas.forEach(element => {
          const activite = element.activite.nom
          const codePta = element.tache.codePta
          const poidsInitial = element.tache.poids
          const poidsActuel = element.poidsActuel
          const created_at = element.created_at
          this.dataTable.push({ activite: activite, codePta: codePta, poidsInitial: poidsInitial, poidsActuel: poidsActuel, created_at: created_at })
        })
       
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
      })
    },
    supprimerT() { },

    saveProlongerDate(id, data) {
      this.chargement = true
      ActiviteService.addDate(id, data).then((data) => {
      
        this.$toast.success('operation éffectué avec succès')
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
      })

      this.chargement = false

    },

    suivreMyActivite(activite) {
      this.$router.push({ name: 'dashboard_projets_activites_globale_suivis', params: { id: activite.id } })
    },

    filtreRange(value) {
      this.rangeValue = value;
    },

    gotoActivite() {
      this.seePlan = false;
      this.seeActivite = true;
      this.seeStatistique = false;
      this.fetchActivites(this.composanteId)
    },

    gotoStatistique() {
      this.seePlan = false;
      this.seeActivite = false;
      this.seeStatistique = true;
    },

    gotoPlan() {
      this.seePlan = true;
      this.seeActivite = false;
      this.seeStatistique = false;
    },


    switch1() {
      this.mosaique = true;
      this.line = false;
    },



    switch2() {
      this.mosaique = false;
      this.line = true;
    },

    addPlan() {

      this.title = "Ajouter"

      this.submitText = "Enregistrer"

      this.showModal2 = true;
    },

    modifierPlan(planDeDecaissement) {
      this.title = "Modifier un plan de decaissement";

      this.submitText = "Modifier"

      this.setPlanDeDecaissement(planDeDecaissement)

      this.planDeDecaissementAttributs.forEach((item) => {

        this.champs2.find((value, index) => {

          if (value.key === "trimestre" && item === "trimestre") {

            this.$store.state.trimestres.map((value) => {
              if (value.valeur === planDeDecaissement[item]) {
                this.champs2[index]['data'] = value
              }
            });

          }
          else if (value.key === 'annee') {
           
            this.champs2[index]['data'] = moment(planDeDecaissement.annee + "/" + planDeDecaissement.trimestre + '/01').format("YYYY-MM-DD")
          }
          else if (value.key === item) {
            this.champs2[index]['data'] = planDeDecaissement[item]
          }

        });

      });


      this.showModal2 = true;
    },

    supprimerPlan(plan) {
      if (window.confirm("Voulez-vous supprimer ce plan de décaissement ")) {
        if (this.sendRequest === false) {
          this.sendRequest = true;
          this.deletePlanDeDecaissement(plan.id).finally((value) => {
            if (response.status === 200 || response.status === 201) {
              this.sendRequest = false;
              this.fetchPlanDeDecaissements(this.activiteFiltre.id);
            }
          })
        }
      }
    },

    addActivite() {

      this.title = "Ajouter"

      this.submitText = "Enregistrer",

        this.showCloseModal(true)

    },

    getNom(nom, prenom) {

      let name = ''

      if (nom !== undefined && nom !== null) name += nom

      if (prenom !== undefined && prenom !== null) name += prenom

      return name;
    },

    prolonger(activite) {
      this.activiteId = activite.id
      this.showProlonger = true
    },

    supprimer(activite, index) {
      this.deleteModal = true
      this.deleteData.data = activite
      this.deleteData.index = index
    },

    deleteActivites(data) {
      //this.filteredBailleur.splice(data.index,1)
      this.deleteModal = false
      ActiviteService.destroy(data.data.id).then((data) => {
        this.$toast.success("Operation effectué avec success !")
        this.fetchActivites(this.composanteId);

      }).catch((error) => {

        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }
      })
    },



    modifier(activite) {
      localStorage.removeItem('formData')

      this.title = 'Modifier une activite'

      this.setActivite(activite)

      this.activiteAttributs.forEach((item) => {

        this.champs.find((value, index) => {

          if (value.key === item) {
            this.champs[index]['data'] = activite[item]
          }

        });

      });

      this.submitText = "Modifier",

        this.showCloseModal(true)
    },

    dupliquer() {
      this.title = "Dupliquer une activité";
      this.showModal = true;
    },

    editerSuivi() {
      this.showInput = false;
    },

    toggle() {
      this.pending = false;
      this.inProgress = false;
      this.success = true;
      this.retard = false
    },

    toggle2() {
      this.success = false;
      this.inProgress = false;
      this.pending = true;
      this.retard = false
    },

    toggle3() {
      this.pending = false;
      this.success = false;
      this.inProgress = true;
      this.retard = false
    },

    toggle4() {
      this.pending = false;
      this.success = false;
      this.inProgress = false;
      this.retard = true
    },

    getStatus(status) {
      return getStringValueOfStatutCode(status);
    },


    savePlanDecaissement() {
      if (this.sendRequest === false) {

        this.sendRequest = true;

        this.champs2 = this.champs2.map((item) => {
          item.errors = [];
          return item;
        });

        let planDeDecaissement = extractFormData(this.champs2, this.planDeDecaissementAttributs);

        planDeDecaissement['activiteId'] = this.activiteFiltre.id;

        planDeDecaissement.annee = moment(planDeDecaissement.annee).format('YYYY')

        planDeDecaissement.trimestre = planDeDecaissement.trimestre.valeur;

        if (this.planDeDecaissement?.id) {
          this.updatePlanDeDecaissement({ planDeDecaissement: planDeDecaissement, id: this.planDeDecaissement?.id })
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                this.fetchPlanDeDecaissements(this.activiteFiltre.id);
                this.close2();
              }
            })
            .finally((error) => {
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
              this.sendRequest = false;
              this.champs2.map(value => value.errors = this.erreurs[value.key])
            });
        } else {
          this.savePlanDeDecaissement(planDeDecaissement)
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                this.fetchPlanDeDecaissements(this.activiteFiltre.id);
                this.close2();
              }
            })
            .finally((error) => {
              this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
              this.sendRequest = false;
              this.champs2.map(value => value.errors = this.erreurs[value.key])
            });
        }
      }
    },

   
    validation() {
      this.fetchActivites(this.composanteId);
    },

    sendForm() {
      if (this.sendRequest === false) {
        this.sendRequest = true;

        this.champs = this.champs.map((item) => {
          item.errors = [];
          return item;
        });

        let activite = extractFormData(this.champs, this.activiteAttributs);



        activite.structureResponsableId = activite.structureResponsableId.id;

        activite.structureAssocieId = activite.structureAssocieId.id;

        activite.userId = activite.structureAssocieId;

        activite["type"] = activite.types.type;
        if (this.composanteId == undefined || this.composanteId == null) {
          this.$toast.error('Composante indefinit ')
          this.sendRequest = false;
          this.close()
        } else {
          activite.composanteId = this.composanteId;
          if (this.activite?.id) {
            this.updateActivite({ activite: activite, id: this.activite?.id })
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchActivites(this.composanteId);
                  this.close();
                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs.map(value => value.errors = this.erreurs[value.key])
              });
          } else {
            this.saveActivite(activite)
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.fetchActivites(this.composanteId);
                  this.close();
                  this.resetForm()
                  localStorage.removeItem('formData');
                }
              })
              .finally((error) => {
                this.setErrors({ message: error?.response?.data?.message, errors: error?.response?.data?.data?.errors })
                this.sendRequest = false;
                this.champs.map(value => value.errors = this.erreurs[value.key])
              });
          }
        }
      }
    },

    close() {
      this.showCloseModal();
      this.sendRequest = false;
      this.resetForm()
    },
    closeA() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },
    closeB() {
      this.showCloseModal();
      this.sendRequest = false;
      this.savedInput = []
      for (let i = 0; i < this.champs2.length; i++) {
        this.savedInput.push(this.champs[i].data)
      }
      const parsed = JSON.stringify(this.savedInput);
      localStorage.setItem('formData', parsed);
    },

    close2() {

      this.showModal2 = false;

      this.resetForm2();

      this.sendRequest = false;
    },

    resetForm2() {

      this.champs2 = this.champs2.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setPlanDeDecaissement({})
    },

    resetForm() {

      this.champs = this.champs.map(item => { item['data'] = ''; item['errors'] = []; return item })

      window.document.getElementById('vform').reset()

      this.setActivite({})
    },
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    fetchProjets(programme) {
      this.active()
      ProgrammeService.projets(programme).then((data) => {
        const datas = data.data.data
        this.projets = datas
        this.disabled()
      }).catch((error) => {
        this.disabled()
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const message = error.response.data.message
          this.$toast.error(message)
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
        }
      })
    },

    showCloseModal(value = false) {
      this.showModal = value;
    }
  },

  watch: {
    loading: function (value) {
      //this.loading = value
    },

    errors: function (errors) {

      if (errors instanceof Object && errors.length === undefined) {
        if (this.seePlan) {
          this.champs2.forEach((value) => {

            if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
              if (value.key === "types") {

                value.errors = errors["type"];

              }
              else value.errors = errors[value.key];
            }
          });
        }
        else if (this.seeActivite) {
          this.champs.forEach((value) => {
            if (errors[value.key] instanceof Array || errors[value.key] !== undefined) {
              
              if (value.key === "types") {
                value.errors = errors["type"];
              }
              else {
               
                value.errors = errors[value.key];
              }

            }
          });
        }
      }
      else if (errors instanceof Array && errors.length === 0) {
        this.champs = this.champs.map(item => { item['errors'] = []; return item })
      }
    },


    structures: function (structures) {

      this.champs.map((item) => {

        if (item.key === "structureAssocieId") {

          item.options = structures.map((structure) => {

            return {
              id: structure.id,
              nom: structure.nom,
            };

          });

        }

        if (item.key === "structureResponsableId") {

          item.options = structures.map((structure) => {

            return {
              id: structure.id,
              nom: structure.nom,
            };

          });

        }

        return item;

      });
    },


    projets: function (projets) {
      if (projets.length > 0) {
        this.projetFiltre = projets[0]
      }
    },

    projetFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchComposantes(valeur);
      }
      else {
        this.setComposantes([])
      }
    },

    composantes: function (composantes) {
      if (composantes.length > 0) {
        this.composanteFiltre = composantes[0]
      }
      else {
        this.composanteFiltre = null
      }
    },

    composanteFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchSousComposantes(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchSousComposantes(valeur);
      }
      else {
        this.setSousComposantes([])
      }
    },

    sousComposantes: function (sousComposantes) {
      if (sousComposantes.length > 0) {
        this.valueFiltre = sousComposantes[0];
      }
      else if (this.composanteFiltre !== null && typeof this.composanteFiltre !== 'undefined' && this.composanteFiltre.length !== 0) {
        this.fetchActivites(this.composanteFiltre.id);
        this.composanteId = this.composanteFiltre.id
        this.valueFiltre = null;
      }
      else {
        this.valueFiltre = null;
      }
    },

    valueFiltre: function (valeur) {

      if (valeur instanceof Composante || valeur instanceof Object) {
        this.fetchActivites(valeur.id);
        this.composanteId = valeur.id
      }

      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchActivites(valeur);
        this.composanteId = valeur
      }

    },

    activites: function (activites) {
      if (this.seePlan) {
        if (activites.length > 0) {
          this.activiteFiltre = activites[0]
        }
      }
    },

    activiteFiltre: function (valeur) {
      if (valeur instanceof Activite || valeur instanceof Object) {
        this.fetchPlanDeDecaissements(valeur.id);
      }
      else if (valeur !== null && typeof valeur !== 'undefined' && valeur.length !== 0) {
        this.fetchPlanDeDecaissements(valeur);
      }
      else {
        this.setPlanDeDecaissements([])
      }
    },

    seePlan: function (valeur) {
      if (this.activites.length > 0) {
        this.activiteFiltre = this.activites[0]
      }
    }

  },

  created() {
    const profondeurSC = JSON.parse(localStorage.getItem('profondeurSC'))
   
    if (profondeurSC != undefined || profondeurSC != null) {
      this.isClick = profondeurSC.isClick
      if (this.isClick) {

        this.idProjet = profondeurSC.id
        this.idSC = profondeurSC.idSC
        this.idComposante = profondeurSC.idC

        this.newProjet = profondeurSC.projet
        this.newComponent = profondeurSC.composente
        this.newSC = profondeurSC.sousComposante

      }
    }
    this.getPermission()
    this.programmeId = this.currentUser.programme.id

    if (this.programmeId) {
      Promise.all([this.fetchProjets(this.programmeId)]).then((value) => {

        this.fetchStructure(this.programmeId)

      });
    }

  }

};
</script>

<style>

</style>
