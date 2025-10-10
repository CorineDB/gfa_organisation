<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Plan d'Action</h2>
  <div class="grid grid-cols-12 gap-6 my-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" v-model="searchs" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="showModalFiltre = true"><FilterIcon class="w-4 h-4 mr-3" />Filtrer le PA</button>
        <!-- v-if="!isLoadingData && currentOrganisation?.profile_de_gouvernance" :org="currentOrganisation?.nom" :pointfocal="`${currentOrganisation?.nom_point_focal}  ${currentOrganisation?.prenom_point_focal}`" :dateevaluation="currentFactuel?.evaluatedAt" -->
        <!-- <ExportationResultatSynthese :datas="dataNew" class="mr-3" /> -->
        <!-- <download-excel :data="json_data" class="btn btn-primary">
          Télécharger Excel
          <DownloadIcon class="w-4 h-4" />
        </download-excel> -->

        <button @click="exportToExcel" class="mr-2 btn btn-primary">
          <DownloadIcon class="w-4 h-4 mr-2" />
          Export Excel (XLSX)
        </button>

        <DownloadPDFButton :tableIds="['ptaTable34']" pageName="Plan d'action" format="a0" />
      </div>
    </div>
  </div>
  <!-- <pre>{{ dataNew }}</pre> -->
  <div v-if="currentPage && ptaVisible" class="current">
    <div style="max-height: 80vh" class="relative flex overflow-y-auto">
      <div style="position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
        <table class="top-0 left-0 block w-full text-sm text-left table-fixed border-collaspe table1">
          <thead class="sticky top-0 z-20 text-xs border bg-blue-200 text-gray-700 uppercase _bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr style="height: 82px" class="">
              <!-- <th rowspan="2" class=" w-24 px-6 py-3 border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Bailleurs</th> -->

              <th scope="col" rowspan="2" class="px-6 py-3 border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Code PTBA</th>
              <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Etat des taches</th>
              <th scope="col" rowspan="2" class="px-6 py-3 border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Actions</th>
            </tr>
            <tr></tr>
          </thead>

          <tbody>
            <tr v-for="pta in filteredDataNew" :key="pta.id" style="height: 52px; max-height: 52px" :class="['border-b dark:border-gray-300', pta.isComposante ? 'bg-blue-200' : pta.isActivite ? 'bg-slate-400' : 'bg-white dark:bg-gray-200']">
              <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span v-if="pta.isProjet" class="text-lg font-bold"> {{ pta.code }}</span>
                <span v-if="pta.isComposante" class="text-sm text-blue-500"> {{ pta.code }}</span>
                <span v-if="pta.isSC && pta.code != 0" class="text-sm text-yellow-600"> {{ pta.code }}</span>
                <span v-if="pta.isActivite" class="text-sm text-green-600">
                  <!-- <pre>{{ pta }}</pre> -->
                  {{ pta.code }}
                </span>
                <span v-if="pta.isTache" class="text-sm text-red-600"> {{ pta.code }}</span>
              </td>
              <td class="px-3 py-1">
                <select class="form-select" aria-label=".form-select-sm example" v-if="pta.isTache" v-model="tabletoggle[pta.id]" @change="togglesuivie(pta)">
                  <option :value="0">0%</option>
                  <option :value="50">50%</option>
                  <option :value="100">100%</option>
                </select>
              </td>
              <td class="border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 text-center">
                <button v-if="pta.isActivite" @click="ouvrirModalPlanDeDecaissementActivite(pta)" title="Ajouter un plan de décaissement" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs p-1 mr-2">
                  <!-- <DollarSignIcon class="w-4 h-4" /> --> Ajouter un plan de décaissement
                </button>
                <button v-if="pta.isActivite" @click="ouvrirModalSuiviFinancierActivite(pta)" title="suivre" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs p-1 mr-2">
                  <!-- <TrendingUpIcon class="w-4 h-4" /> -->
                   Suivre
                </button>

                <button v-if="pta.isActivite" @click="voirSuiviActivite()" title="Voir les suivis" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs p-1 mr-2">
                  <!-- <EyeIcon class="w-4 h-4" /> -->
                   Voir les suivis
                </button>

                <!-- <button v-if="pta.isActivite" @click="handleDelete(pta)" class="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-4 py-2">Supprimer</button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

     <div  :class="[
            'absolute shadow-md',
            'sm:rounded-lg',
            'transition-all duration-300 ease-in-out',
            (filteredDataNew.length > 0 && hasActivities) ? 'left-[38rem]' : 'left-[23rem]'
          ]">
        <table class="w-full overflow-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="sticky top-0 text-xs border bg-blue-200 text-gray-700 uppercase _z-20 _bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr class="">
              <th scope="col" rowspan="3" class="px-6 py-3 border dark:bg-gray-800 border-gray-300 whitespace-nowrap">OutCome / OutPut / activiés / Taches</th>
              <th scope="col" colspan="6" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Montant projet XOF</th>
              <!-- <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Montant budgetisé XOF</th> -->
              <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Poids</th>
              <th v-if="statutActuel" scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">poids actuel</th>

              <!-- <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">STRUCTURE ASSOCIER</th> -->
              <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">STRUCTURE RESPONSABLE</th>
              <th scope="col" colspan="12" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">PLANING</th>
              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 1</th>

              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 2</th>

              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 3</th>

              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 4</th>
            </tr>

            <tr class="bg-blue-100">
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Dépenses</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Solde</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Taux d'exécution financière</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>

              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">JAV</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">FEV</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">MARS</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">AVRIL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">MAI</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">JUIN</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">JUILLET</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">AOUT</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">SEPTEMBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">OCTOBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">NOVEMBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">DECEMBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="pta in filteredDataNew" :key="pta.id" style="height: 52px; max-height: 52px" :class="['border-b dark:border-gray-300', pta.isComposante ? 'bg-blue-200' : pta.isActivite ? 'bg-slate-400' : 'bg-white dark:bg-gray-800']">
              <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 uppercase">
                <span v-if="pta.isProjet" class="text-sm text-blue-500">Projet: {{ pta.nom }}</span>
                <span v-if="pta.isComposante" class="text-sm text-blue-500">OutCome: {{ pta.nom }}</span>
                <span v-if="pta.isSC" class="text-sm text-yellow-600"> <span class="text-sm text-yellow-600" v-if="pta.code != 0">OutPut:</span> {{ pta.nom }}</span>
                <span v-if="pta.isActivite" class="text-sm text-green-600 shadow bg-gradient-to-br from-yellow-400 to-yellow-600">Activite: {{ pta.nom }}</span>
                <span v-if="pta.isTache" class="text-sm text-red-600"> {{ pta.nom }}</span>
              </td>
              <!-- Fond propre -->
              <!-- v-if="pta.bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black">{{ pta.bn == null || pta.bn == 0 ? 0 : $h.formatCurrency(pta.bn) }} </span>
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 font-bold" v-else>0</td> -->

              <!-- Subvention -->
              <!-- v-if="pta.pret" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.pret == null || pta.pret == 0 ? 0 : $h.formatCurrency(pta.pret) }}</span>
              </td>
              <!-- <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 font-bold">0</td> -->

              <!-- Dépenses -->
              <!-- v-if="pta.depenses" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.depenses == null || pta.depenses == 0 ? 0 : $h.formatCurrency(pta.depenses) }}</span>
              </td>
              <!-- <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 font-bold">0</td> -->

              <!-- Solde -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.pret + pta.bn - pta.depenses == null || pta.pret + pta.bn - pta.depenses == 0 ? 0 : $h.formatCurrency(pta.pret + pta.bn - pta.depenses) }}</span>
              </td>

              <!-- tef -->
              <td v-if="pta.pret + pta.bn > 0 && !pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ ((pta.depenses / (pta.pret + pta.bn)) * 100).toFixed(2) }} %</span>
              </td>
              <!-- <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">Non disponible</td> -->

              <!-- total budgetaire-->
              <!-- v-if="pta.pret != '' || pta.bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.pret + pta.bn == null || pta.pret + pta.bn == 0 ? 0 : $h.formatCurrency(pta.pret + pta.bn) }}</span>
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span v-if="pta.poids != undefined" class="font-bold text-black"> {{ pta.poids }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>

              <td v-if="statutActuel && !pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span v-if="pta.poidsActuel != undefined" class="font-bold text-black"> {{ pta.poidsActuel }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>

              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span v-if="pta.structureResponsable != undefined" class="font-bold text-black"> {{ pta.structureResponsable }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>

              <!--  Planing vrai activité-->

              <td v-if="pta.planing != undefined && pta.planing.janvier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.janvier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border shadow whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.fevrier != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.fevrier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.mars != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.mars != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.avril != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.avril != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.mai != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.mai != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.juin != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.juin != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.juillet != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.juillet != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>

              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-yellow-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.aout != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.aout != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.septembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.septembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.octobre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.octobre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.novembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.novembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <td v-if="pta.planing != undefined && pta.planing.decembre != ''" class="p-2 bg-blue-500 border border-l-0 border-r-0"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.decembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

              <!-- fin planing -->

              <!-- v-if="pta.t1Bn != undefined && pta.t1Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t1Bn == null || pta.t1Bn == 0 ? 0 : $h.formatCurrency(pta.t1Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t1Pret != undefined && pta.t1Pret != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t1Pret == null || pta.t1Pret == 0 ? 0 : $h.formatCurrency(pta.t1Pret) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t1Pret != '' || pta.t1Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t1Pret + pta.t1Bn == null || pta.t1Pret + pta.t1Bn == 0 ? 0 : $h.formatCurrency(pta.t1Pret + pta.t1Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t2Bn != undefined && pta.t2Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t2Bn == null || pta.t2Bn == 0 ? 0 : $h.formatCurrency(pta.t2Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t2Pret != undefined && pta.t2Pret != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t2Pret == null || pta.t2Pret == 0 ? 0 : $h.formatCurrency(pta.t2Pret) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!--  v-if="pta.t2Pret != '' || pta.t2Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t2Pret + pta.t2Bn == null || pta.t2Pret + pta.t2Bn == 0 ? 0 : $h.formatCurrency(pta.t2Pret + pta.t2Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t3Bn != undefined && pta.t3Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t3Bn == null || pta.t3Bn == 0 ? 0 : $h.formatCurrency(pta.t3Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!--  v-if="pta.t3Pret != undefined && pta.t3Pret != ''"  -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t3Pret == null || pta.t3Pret == 0 ? 0 : $h.formatCurrency(pta.t3Pret) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t3Pret != '' || pta.t3Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ $h.formatCurrency(pta.t3Pret + pta.t3Bn) }} {{ pta.t3Pret + pta.t3Bn == null || pta.t3Pret + pta.t3Bn == 0 ? 0 : $h.formatCurrency(pta.t3Pret + pta.t3Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t4Bn != undefined && pta.t4Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t4Bn == null || pta.t4Bn == 0 ? 0 : $h.formatCurrency(pta.t4Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>

              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!--  -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span class="font-bold text-black"> {{ pta.t4Pret == null || pta.t4Pret == 0 ? 0 : $h.formatCurrency(pta.t4Pret) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

              <!-- v-if="pta.t4Pret != '' || pta.t4Bn != ''" -->
              <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
                <span v-if="pta.t4Pret != undefined && pta.t4Bn != undefined" class="font-bold text-black"> {{ pta.t4Pret + pta.t4Bn == null || pta.t4Pret + pta.t4Bn == 0 ? 0 : $h.formatCurrency(pta.t4Pret + pta.t4Bn) }}</span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <table v-show="false == true" id="ptaTable34" class="w-full overflow-auto text-sm text-left text-gray-500 dark:text-gray-400">
    <thead class="sticky top-0 text-xs border bg-blue-200 text-gray-700 uppercase _z-20 _bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr class="">
        <th scope="col" rowspan="2" class="px-6 py-3 border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Code PTBA</th>

        <th scope="col" rowspan="3" class="px-6 py-3 border dark:bg-gray-800 border-gray-300 whitespace-nowrap">OutCome / OutPut / activiés / Taches</th>
        <th scope="col" colspan="6" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Montant projet XOF</th>
        <!-- <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Montant budgetisé XOF</th> -->
        <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Poids</th>
        <th v-if="statutActuel" scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">poids actuel</th>

        <!-- <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">STRUCTURE ASSOCIER</th> -->
        <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">STRUCTURE RESPONSABLE</th>
        <th scope="col" colspan="12" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">PLANING</th>
        <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 1</th>

        <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 2</th>

        <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 3</th>

        <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TRIMESTRE 4</th>
      </tr>

      <tr class="bg-blue-100">
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Dépenses</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Solde</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Taux d'exécution financière</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>

        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">JAV</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">FEV</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">MARS</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">AVRIL</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">MAI</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">JUIN</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">JUILLET</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">AOUT</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">SEPTEMBRE</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">OCTOBRE</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">NOVEMBRE</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">DECEMBRE</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Fond propres</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">Subvention XOF</th>
        <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 border-gray-300 whitespace-nowrap">TOTAL</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="pta in filteredDataNew" :key="pta.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-300">
        <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span v-if="pta.isProjet" class="text-sm text-blue-500">{{ pta.code }}</span>
          <span v-if="pta.isComposante" class="text-sm text-blue-500"> {{ pta.code }}</span>
          <span v-if="pta.isSC && pta.code != 0" class="text-sm text-yellow-600"> {{ pta.code }}</span>
          <span v-if="pta.isActivite" class="text-sm text-green-600">
            <!-- <pre>{{ pta }}</pre> -->
            {{ pta.code }}
          </span>
          <span v-if="pta.isTache" class="text-sm text-red-600"> {{ pta.code }}</span>
        </td>
        <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 uppercase">
          <span v-if="pta.isProjet" class="text-sm text-blue-500">Projet: {{ pta.nom }}</span>
          <span v-if="pta.isComposante" class="text-sm text-blue-500">OutCome: {{ pta.nom }}</span>
          <span v-if="pta.isSC" class="text-sm text-yellow-600"> <span class="text-sm text-yellow-600" v-if="pta.code != 0">OutPut:</span> {{ pta.nom }}</span>
          <span v-if="pta.isActivite" class="text-sm text-green-600 shadow bg-gradient-to-br from-yellow-400 to-yellow-600">Activite: {{ pta.nom }}</span>
          <span v-if="pta.isTache" class="text-sm text-red-600"> {{ pta.nom }}</span>
        </td>
        <!-- Fond propre -->
        <!-- v-if="pta.bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black">{{ pta.bn == null || pta.bn == 0 ? 0 : $h.formatCurrency(pta.bn) }} </span>
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 font-bold" v-else>0</td> -->

        <!-- Subvention -->
        <!-- v-if="pta.pret" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.pret == null || pta.pret == 0 ? 0 : $h.formatCurrency(pta.pret) }}</span>
        </td>
        <!-- <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 font-bold">0</td> -->

        <!-- Dépenses -->
        <!-- v-if="pta.depenses" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.depenses == null || pta.depenses == 0 ? 0 : $h.formatCurrency(pta.depenses) }}</span>
        </td>
        <!-- <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300 font-bold">0</td> -->

        <!-- Solde -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.pret + pta.bn - pta.depenses == null || pta.pret + pta.bn - pta.depenses == 0 ? 0 : $h.formatCurrency(pta.pret + pta.bn - pta.depenses) }} </span>
        </td>

        <!-- tef -->
        <td v-if="pta.pret + pta.bn > 0 && !pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ ((pta.depenses / (pta.pret + pta.bn)) * 100).toFixed(2) }} %</span>
        </td>
        <!-- <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">Non disponible</td> -->

        <!-- total budgetaire-->
        <!-- v-if="pta.pret != '' || pta.bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.pret + pta.bn == null || pta.pret + pta.bn == 0 ? 0 : $h.formatCurrency(pta.pret + pta.bn) }}</span>
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span v-if="pta.poids != undefined" class="font-bold text-black"> {{ pta.poids }} </span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>

        <td v-if="statutActuel && !pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span v-if="pta.poidsActuel != undefined" class="font-bold text-black"> {{ pta.poidsActuel }} </span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>

        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span v-if="pta.structureResponsable != undefined" class="font-bold text-black"> {{ pta.structureResponsable }} </span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>

        <!--  Planing vrai activité-->

        <td v-if="pta.planing != undefined && pta.planing.janvier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.janvier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border shadow whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.fevrier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.fevrier != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.mars != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.mars != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.avril != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.avril != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.mai != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.mai != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.juin != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.juin != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.juillet != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.juillet != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>

        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-yellow-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.aout != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.aout != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.septembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.septembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.octobre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.octobre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.novembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.novembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <td v-if="pta.planing != undefined && pta.planing.decembre != '' && !pta.isProjet" class="p-2 bg-blue-500 border border-l-0 border-r-0"></td>
        <td v-else-if="pta.planingt != undefined && pta.planingt.decembre != '' && !pta.isProjet" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
        <td v-else-if="!pta.isProjet" class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300"></td>

        <!-- fin planing -->

        <!-- v-if="pta.t1Bn != undefined && pta.t1Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t1Bn == null || pta.t1Bn == 0 ? 0 : $h.formatCurrency(pta.t1Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t1Pret != undefined && pta.t1Pret != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t1Pret == null || pta.t1Pret == 0 ? 0 : $h.formatCurrency(pta.t1Pret) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t1Pret != '' || pta.t1Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t1Pret + pta.t1Bn == null || pta.t1Pret + pta.t1Bn == 0 ? 0 : $h.formatCurrency(pta.t1Pret + pta.t1Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA </span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t2Bn != undefined && pta.t2Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t2Bn == null || pta.t2Bn == 0 ? 0 : $h.formatCurrency(pta.t2Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t2Pret != undefined && pta.t2Pret != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t2Pret == null || pta.t2Pret == 0 ? 0 : $h.formatCurrency(pta.t2Pret) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA </span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!--  v-if="pta.t2Pret != '' || pta.t2Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t2Pret + pta.t2Bn == null || pta.t2Pret + pta.t2Bn == 0 ? 0 : $h.formatCurrency(pta.t2Pret + pta.t2Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA </span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t3Bn != undefined && pta.t3Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t3Bn == null || pta.t3Bn == 0 ? 0 : $h.formatCurrency(pta.t3Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!--  v-if="pta.t3Pret != undefined && pta.t3Pret != ''"  -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t3Pret == null || pta.t3Pret == 0 ? 0 : $h.formatCurrency(pta.t3Pret) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t3Pret != '' || pta.t3Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ $h.formatCurrency(pta.t3Pret + pta.t3Bn) }} {{ pta.t3Pret + pta.t3Bn == null || pta.t3Pret + pta.t3Bn == 0 ? 0 : $h.formatCurrency(pta.t3Pret + pta.t3Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA </span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t4Bn != undefined && pta.t4Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t4Bn == null || pta.t4Bn == 0 ? 0 : $h.formatCurrency(pta.t4Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>

        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!--  -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span class="font-bold text-black"> {{ pta.t4Pret == null || pta.t4Pret == 0 ? 0 : $h.formatCurrency(pta.t4Pret) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA</span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->

        <!-- v-if="pta.t4Pret != '' || pta.t4Bn != ''" -->
        <td v-if="!pta.isProjet" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300">
          <span v-if="pta.t4Pret != undefined && pta.t4Bn != undefined" class="font-bold text-black"> {{ pta.t4Pret + pta.t4Bn == null || pta.t4Pret + pta.t4Bn == 0 ? 0 : $h.formatCurrency(pta.t4Pret + pta.t4Bn) }}</span>
          <!--  <span v-else class="font-bold" >0 FCFA </span> -->
        </td>
        <!-- <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-300" v-else></td> -->
      </tr>
    </tbody>
  </table>
  <NoRecordsMessage class="col-span-12" v-if="!filteredDataNew.length" title="Aucun plan d'action n'est disponible pour le moment. Veuillez en établir un." />

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer le pta</h2>
    </ModalHeader>
    <form @submit.prevent="filtreParAnnee(annees)">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="annees" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button
            type="button"
            @click="
              showModalFiltre = false;
              annees = '';
            "
            class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary"
          >
            Annuler
          </button>
          <VButton :loading="isLoading" label="Filtrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <Modal backdrop="static" :show="showModalSuiviFinancier" @hidden="showModalSuiviFinancier = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ isCreate ? "Ajouter" : "Modifier" }} un Suivi Financier</h2>
    </ModalHeader>

    <form @submit.prevent="suiviFinancierActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(suivi, index) in suiviFinancier" :key="suivi.id" class="col-span-12 border-b pb-4 mb-4">
          <!-- <pre>{{ suivi }}</pre> -->

          <h3 class="text-sm font-medium mb-2">Plan {{ index + 1 }}</h3>

          <div class="w-full">
            <InputForm label="Consommé" v-model="suivi.consommer" type="number" />

            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.consommer">
              {{ erreurSuiviFinancier[index].consommer }}
            </p>
          </div>
          <!-- 
          <div class="w-full mt-3">
            <label class="form-label">Sources</label>
            <TomSelect v-model="suivi.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="0">Fond propre</option>
              <option value="1">Budget Alloue</option>
            </TomSelect>
          </div> -->

          <div class="w-full mt-3">
            <label class="form-label">Sélectionnez le trimestre</label>
            <TomSelect v-model="suivi.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full" @change="miseAjourTabSuivi(suivi.trimestre, index)">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <div class="col-span-12 mt-3">
            <label class="form-label">Année</label>
            <TomSelect v-model="suivi.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full" @change="miseAjourTabSuivi(suivi.annee, index)">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <button type="button" @click="removeSuivi(index)" class="mt-2 text-red-600 text-sm underline">Supprimer ce suivi</button>

          <div class="col-span-12" v-if="getPlageActivite">
            <div class="flex items-center mt-2" v-for="(plage, t) in getPlageActivite.durees" :key="t">
              <ClockIcon class="w-4 h-4 mr-2" />
              <div>
                Plage de date {{ getPlageActivite.durees.length + 1 }} : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageActivite.durees[getPlageActivite.durees.length - 1].debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageActivite.durees[getPlageActivite.durees.length - 1].fin) }}</span>
              </div>
            </div>
          </div>

          <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Durée du projet : Du <span class="px-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
            </div>
          </div>
        </div>

        <button type="button" @click="addSuivi" class="col-span-12 btn btn-outline-primary">Ajouter un autre suivi</button>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="resetModalSuiviFinancierActivite" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingSuiviFinancier" :type="submit" :disabled="loaderListeSuivi" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- filtre suivi financier -->
  <Modal backdrop="static" :show="showModalFiltreSuiviFinancier" @hidden="showModalFiltreSuiviFinancier = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer le suivi financier</h2>
    </ModalHeader>
    <form @submit.prevent="filterSuiviFinancierActivite">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <pre>{{years}}</pre> -->
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="filterPayloadSuiviFinancier.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
          </div>
          <div class="">
            <label class="form-label">Trimestre</label>
            <TomSelect v-model="filterPayloadSuiviFinancier.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option v-for="(i, index2) in 4" :key="index2" :value="i">Trimestre {{ i }}</option>
            </TomSelect>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetFilterModalSuivi" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoadingFilterSuiviFinancier" label="Filtrer" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <Modal backdrop="static" size="modal-xl" :show="voirSuiviModal" @hidden="voirSuiviModal = false">
    <ModalHeader>
      <h2 class="_mt-10 text-lg font-medium intro-y bloc">Suivi Financier</h2>
    </ModalHeader>

    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="_p-5 _mt-5 col-span-12 intro-y box">
        <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
          <div></div>
          <div class="flex mt-5 sm:mt-0">
            <button class="mr-2 shadow-md btn btn-primary" @click="openFilterModalSuiviFinancier"><FilterIcon class="w-4 h-4 mr-3" />Filtrer le suivi financier</button>

            <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilters()">
              <RefreshCwIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="col-span-12">
          
          <!-- Table -->
          <div class="border my-4 rounded-lg border-gray-300 shadow-md">
            <!-- suivi budgetaire  current -->
            <div class="current">
              <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-blue-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Activités</th>
                      <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Année</th>
                      <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Trimestre</th>
                      <th scope="col" colspan="4" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Période</th>
                      <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Exercice</th>
                      <th scope="col" colspan="4" class="py-3 px-6 text-center border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Cumul</th>
                      <th scope="col" rowspan="2" class="py-3 px-6 border bg-blue-200 dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap text-center">Actions</th>
                    </tr>
                    <tr>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Budget</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Consommé</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">Disponible</th>
                      <th scope="col" class="py-3 px-6 border bg-blue-100 dark:bg-gray-800 dark:border-gray-700 text-center whitespace-nowrap">TEF</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Loader pendant le chargement -->
                    <tr v-if="loadListeSuivi || loaderListeSuivi">
                      <td colspan="9" class="text-center py-12 border-gray-300">
                        <div class="flex justify-center items-center">
                          <LoaderSnipper />
                          <span class="ml-3 text-gray-600">Chargement des suivis financiers...</span>
                        </div>
                      </td>
                    </tr>

                    <!-- Données du tableau -->
                    <tr v-else v-for="(suivi, index) in listeSuivi.suiviFinanciers" :key="index" class="bg-white border-b hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi?.activite?.codePta }}-{{ suivi?.activite?.nom }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.annee }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.trimestre }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.periode.budget == null || suivi.periode.budget == 0 ? 0 : $h.formatCurrency(suivi.periode.budget) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.periode.consommer == null || suivi.periode.consommer == 0 ? 0 : $h.formatCurrency(suivi.periode.consommer) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.periode.disponible == null || suivi.periode.disponible == 0 ? 0 : $h.formatCurrency(suivi.periode.disponible) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.periode.pourcentage }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.exercice.budget == null || suivi.exercice.budget == 0 ? 0 : $h.formatCurrency(suivi.exercice.budget) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.exercice.consommer == null || suivi.exercice.consommer == 0 ? 0 : $h.formatCurrency(suivi.exercice.consommer) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.exercice.disponible == null || suivi.exercice.disponible == 0 ? 0 : $h.formatCurrency(suivi.exercice.disponible) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.exercice.pourcentage }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.cumul.budget == null || suivi.cumul.budget == 0 ? 0 : $h.formatCurrency(suivi.cumul.budget) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.cumul.consommer == null || suivi.cumul.consommer == 0 ? 0 : $h.formatCurrency(suivi.cumul.consommer) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.cumul.disponible == null || suivi.cumul.disponible == 0 ? 0 : $h.formatCurrency(suivi.cumul.disponible) }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                        <span class="font-bold">{{ suivi.cumul.pourcentage }}</span>
                      </td>
                      <td class="p-2 whitespace-nowrap border bg-blue-50 dark:bg-gray-800 dark:border-gray-700 text-center">
                        <button @click="ouvrirModalSuiviFinancierActivite(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Suivre</button>

                        <button @click="handleDetail(suivi)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Voir détail</button>

                        <!-- <button @click="handleDelete(suivi)" class="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-4 py-2">Supprimer</button> -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Message si aucune donnée - en bas du tableau -->
          <div v-if="!loadListeSuivi && !loaderListeSuivi && (!listeSuivi.suiviFinanciers || listeSuivi.suiviFinanciers.length === 0)" class="text-center py-8 mt-4">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun suivi financier trouvé</h3>
              <p class="mt-1 text-sm text-gray-500">
                Aucune donnée ne correspond aux critères de filtrage sélectionnés.
              </p>
              <div class="mt-6">
                <button @click="resetFilters" class="btn btn-primary btn-sm">
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ModalBody>
    <ModalFooter>
      <button type="button" @click="voirSuiviModal = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
    </ModalFooter>
  </Modal>

  <Modal backdrop="static" :show="showModalPlanDeDecaissement" @hidden="showModalPlanDeDecaissement = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Plan de décaissement</h2>
    </ModalHeader>

    <form @submit.prevent="planDeDecaissementActivite">
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div v-for="(plan, index) in planDeDecaissement" :key="plan.id" class="col-span-12 border-b pb-4 mb-4">
          <h3 class="text-sm font-medium mb-2">Plan {{ index + 1 }}</h3>

          <div class="col-span-12 mt-4">
            <label class="form-label">Année</label>
            <TomSelect v-model="plan.annee" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurPlanDeDecaissement[index].trimestre }}
            </p>
          </div>

          <!-- <InputForm v-model="plan.annee" :min="2000" class="col-span-12" type="number" :required="true" placeHolder="Saisissez l'année" label="Saisissez l'année de décaissement" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.annee">
            {{ erreurPlanDeDecaissement[index].annee }}
          </p> -->

          <div class="w-full mt-4">
            <label class="form-label">Sélectionnez le trimestre</label>
            <TomSelect v-model="plan.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurPlanDeDecaissement[index].trimestre }}
            </p>
          </div>

          <!-- <InputForm v-model="plan.trimestre" :min="1" :max="4" class="col-span-12" type="number" :required="true" placeHolder="Sélectionnez le trimestre" label="Sélectionnez le trimestre" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.trimestre">
            {{ erreurPlanDeDecaissement[index].trimestre }}
          </p> -->

          <InputForm v-model="plan.budgetNational" :min="0" class="col-span-12 mt-4" type="number" :required="true" placeHolder="Saisissez le fond propre" label="Saisissez le fond propre" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.budgetNational">
            {{ erreurPlanDeDecaissement[index].budgetNational }}
          </p>

          <InputForm v-model="plan.pret" :min="0" class="col-span-12 mt-4" type="number" :required="true" placeHolder="Saisissez la subvention" label="Saisissez la subvention" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurPlanDeDecaissement?.[index]?.pret">
            {{ erreurPlanDeDecaissement[index].pret }}
          </p>

          <button type="button" @click="removePlan(index)" class="mt-2 text-red-600 text-sm underline">Supprimer ce plan</button>

          <div class="col-span-12" v-if="getPlageActivite">
            <div class="flex items-center mt-2" v-for="(plage, t) in getPlageActivite.durees" :key="t">
              <ClockIcon class="w-4 h-4 mr-2" />
              <div>
                Plage de date {{ getPlageActivite.durees.length + 1 }} : Du <span class="pr-1 font-bold"> {{ $h.reformatDate(getPlageActivite.durees[getPlageActivite.durees.length - 1].debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageActivite.durees[getPlageActivite.durees.length - 1].fin) }}</span>
              </div>
            </div>
          </div>

          <div v-if="getPlageProjet" class="flex items-center mt-2 col-span-12">
            <ClockIcon class="w-4 h-4 mr-2" />
            <div>
              Durée du projet : Du <span class="px-1 font-bold"> {{ $h.reformatDate(getPlageProjet.debut) }}</span> au <span class="font-bold"> {{ $h.reformatDate(getPlageProjet.fin) }}</span>
            </div>
          </div>
        </div>

        <button type="button" @click="addPlan" class="col-span-12 btn btn-outline-primary">Ajouter un autre plan</button>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="showModalPlanDeDecaissement = false" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingPlanDeDecaissement" :type="submit" :disabled="loaderListePlan" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
</template>

<script>
import * as XLSX from "xlsx";
import PtabService from "@/services/modules/pta.service.js";
import BailleursService from "@/services/modules/bailleur.service.js";
import TacheService from "@/services/modules/tache.service.js";
import VButton from "@/components/news/VButton.vue";
import { toast } from "vue3-toastify";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { helper as $h } from "@/utils/helper";
import NoRecordsMessage from "@/components/NoRecordsMessage.vue";
import SuiviFinancierService from "@/services/modules/suiviFinancier.service";
import InputForm from "@/components/news/InputForm.vue";
import AuthService from "@/services/modules/auth.service";
import PlanDeDecaissementService from "@/services/modules/plan.decaissement.service";
import SuiviFinancier from "@/services/modules/suiviFinancier.service";
import ActiviteService from "@/services/modules/activite.service";
import PlanDecaissementComponent from "@/components/PlanDecaissement.vue";
import PlanDeCaissement from "@/services/modules/plan.decaissement.service";
import DownloadPDFButton from "../../../components/DownloadPDFButton.vue";
import ExportationResultatSynthese from "@/components/news/ExportationResultatSynthese.vue";

export default {
  props: ["ppm"],
  components: { VButton, NoRecordsMessage, InputForm, DownloadPDFButton, ExportationResultatSynthese },
  data() {
    return {
      searchs: "",
      listePlanDeDecaissement: [],
      planDeDecaissement: [],
      showModalPlanDeDecaissement: false,
      loadingPlanDeDecaissement: false,
      erreurPlanDeDecaissement: null,
      planDeDecaissementPayload: {
        activiteId: null,
        trimestre: this.getCurrentQuarter(), // Trimestre actuel
        annee: new Date().getFullYear(), // Set current year as default
        budgetNational: 0,
        pret: 0,
      },

      filterPayloadSuiviFinancier: {
        trimestre: new Date().getMonth() < 3 ? 1 : new Date().getMonth() < 6 ? 2 : new Date().getMonth() < 9 ? 3 : 4,
        annee: new Date().getFullYear(),
      },
      showModalFiltreSuiviFinancier: false,
      loadListeSuivi: false,
      listeSuivi: [],
      isCreate: true,
      suiviFinancierPayload: {
        activiteId: null,
        trimestre: 1, // Trimestre actuel
        annee: new Date().getFullYear(), // Set current year as default
        consommer: 0,
        // type: 0,
      },
      voirSuiviModal: false,
      showModalSuiviFinancier: false,
      loadingSuiviFinancier: false,
      erreurSuiviFinancier: null,
      suiviFinancier: [],
      // years: [],
      annees: "",
      tabletoggle: [],
      etattoggle: true,
      graytoggle: true,
      redtoggle: false,
      translatetoggle: false,
      chargement: false,
      showModalFiltre: false,
      greentoggle: true,
      ptab: [],
      items: ["Item 1", "Item 2", "Item 3"],
      activeItems: [],
      fich: [],

      ptabR: [],
      openFiltre: false,
      statutActuel: false,
      annee: null,
      bailleur: "",
      bailleurs: [],
      version: "current",
      version: "",
      versionSlug: "",
      scopes: [],
      currentPage: true,
      revisionAdd: false,
      revisionVisible: false,
      ptaVisible: false,
      filtrePta: false,
      filtrePpm: false,
      filtreRePta: false,
      filtreRePpm: false,
      planDecaissementPtaVisible: false,
      ppmVisible: false,
      exporterSuiviPpm: false,
      exporterSuiviPta: false,
      exporterSuiviRePpm: false,
      exporterSuiviRePta: false,
      debutProgramme: "",
      finProgramme: "",
      tableauListeSuivi: [],
      listeSuivi: [],
      loaderListePlan: false,
      loaderListeSuivi: false,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    ...mapState({
      loading: (state) => state.loading,
      years() {
        console.log("debut", `${this.debutProgramme.split("-")}`);
        console.log("fin", `${this.finProgramme.split("-")}`);
        let anneeDebut = parseInt(`${this.debutProgramme.split("-")[0]}`);
        let anneeFin = parseInt(`${this.finProgramme.split("-")[0]}`);
        let annees = [];
        for (let annee = anneeDebut; annee <= anneeFin; annee++) {
          if (annee <= new Date().getFullYear()) {
            annees.push(annee);
          }
        }

        console.log("annees", annees);

        return annees;
      },
      hasActivities(){
        return this.filteredDataNew.some(item => item.isActivite === true)
      }
    }),
    dataNew() {
      const programme = [];
      if (this.ptab != undefined && this.ptab != null) {
        this.ptab.forEach((element) => {
          const bailleur = element.bailleur;
          const bn = element.budgetNational;
          const pret = element.pret;
          const depenses = element.depenses;

          programme.push({ bailleur, depenses, nom: element.nom, code: element.code, isProjet: true, bn, pret });
          element.composantes.forEach((composante) => {
            const bn = composante.budgetNational;
            const pret = composante.pret;
            const depenses = composante.depenses;
            let poids = composante.poids;
            let poidsActuel = composante.poidsActuel;
            let t1Bn = "";
            let t1Pret = "";
            let t2Bn = "";
            let t2Pret = "";
            let t3Bn = "";
            let t3Pret = "";
            let t4Bn = "";
            let t4Pret = "";
            let tBn = "";
            let tPret = "";
            let total = "";
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret;
              t1Bn = composante.trimestre1.budgetNational;
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret;
              t2Bn = composante.trimestre2.budgetNational;
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret;
              t3Bn = composante.trimestre3.budgetNational;
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret;
              t4Bn = composante.trimestre4.budgetNational;
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn;
            tPret = t1Pret + t2Pret + t3Pret + t4Pret;
            total = tBn + tPret;

            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, isComposante: true, bn, depenses, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total });
            composante.sousComposantes.forEach((sousComposante) => {
              const bn = sousComposante.budgetNational;
              const pret = sousComposante.pret;
              const depenses = sousComposante.depenses;
              let poids = sousComposante.poids;
              let poidsActuel = sousComposante.poidsActuel;
              let t1Bn = "";
              let t1Pret = "";
              let t2Bn = "";
              let t2Pret = "";
              let t3Bn = "";
              let t3Pret = "";
              let t4Bn = "";
              let t4Pret = "";
              let tBn = "";
              let tPret = "";
              let total = "";
              let nom = "PAS DE SOUS COMPOSANTE";
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom;
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1;
                t1Bn = sousComposante.trimestre1.budgetNational * 1;
              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1;
                t2Bn = sousComposante.trimestre2.budgetNational * 1;
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1;
                t3Bn = sousComposante.trimestre3.budgetNational * 1;
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1;
                t4Bn = sousComposante.trimestre4.budgetNational * 1;
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn;
              tPret = t1Pret + t2Pret + t3Pret + t4Pret;
              total = tBn + tPret;
              if (nom !== "PAS DE SOUS COMPOSANTE") {
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, isSC: true, bn, pret, bn, depenses, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total });
              }
              sousComposante.activites.forEach((activite) => {
                const bn = activite.budgetNational;
                const pret = activite.pret;
                const activiteId = activite.id;
                const depenses = activite.depenses;
                let poids = activite.poids;
                let poidsActuel = activite.poidsActuel;
                let structureResponsable = activite.structureResponsable;
                let structureAssocie = activite.structureAssocie;
                let t1Bn = "";
                let t1Pret = "";
                let t2Bn = "";
                let t2Pret = "";
                let t3Bn = "";
                let t3Pret = "";
                let t4Bn = "";
                let t4Pret = "";
                let tBn = "";
                let tPret = "";
                let total = "";
                const planing = {
                  janvier: "",
                  fevrier: "",
                  mars: "",
                  avril: "",
                  mai: "",
                  juin: "",
                  juillet: "",
                  aout: "",
                  septembre: "",
                  octobre: "",
                  novembre: "",
                  decembre: "",
                };
                const planingt = {
                  janvier: "",
                  fevrier: "",
                  mars: "",
                  avril: "",
                  mai: "",
                  juin: "",
                  juillet: "",
                  aout: "",
                  septembre: "",
                  octobre: "",
                  novembre: "",
                  decembre: "",
                };
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret;
                  t1Bn = activite.trimestre1.budgetNational;
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret;
                  t2Bn = activite.trimestre2.budgetNational;
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret;
                  t3Bn = activite.trimestre3.budgetNational;
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret;
                  t4Bn = activite.trimestre4.budgetNational;
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn;
                tPret = t1Pret + t2Pret + t3Pret + t4Pret;
                total = tBn + tPret;

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees;
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok";
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok";
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok";
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok";
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok";
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok";
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok";
                  }
                  if (activiteDuree[7] == 1) {
                    planing.aout = "ok";
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok";
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok";
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok";
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok";
                  }
                }

                programme.push({ bailleur, nom: activite.nom, activiteId, code: activite.code, poids, poidsActuel, isActivite: true, bn, pret, depenses, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing });
                activite.taches.forEach((tache) => {
                  const planingt = {
                    janvier: "",
                    fevrier: "",
                    mars: "",
                    avril: "",
                    mai: "",
                    juin: "",
                    juillet: "",
                    aout: "",
                    septembre: "",
                    octobre: "",
                    novembre: "",
                    decembre: "",
                  };
                  let poids = tache.poids;
                  let poidsActuel = tache.poidsActuel;
                  const tacheDuree = tache.durees;
                  const pret = "";
                  const bn = "";
                  let t1Bn = "";
                  let t1Pret = "";
                  let t2Bn = "";
                  let t2Pret = "";
                  let t3Bn = "";
                  let t3Pret = "";
                  let t4Bn = "";
                  let t4Pret = "";
                  let tBn = "";
                  let tPret = "";
                  // let total = ''

                  if (tacheDuree != undefined || activiteDuree != null) {
                    if (tacheDuree[0] == 1) {
                      planingt.janvier = "ok";
                    }
                    if (tacheDuree[1] == 1) {
                      planingt.fevrier = "ok";
                    }
                    if (tacheDuree[2] == 1) {
                      planingt.mars = "ok";
                    }
                    if (tacheDuree[3] == 1) {
                      planingt.avril = "ok";
                    }
                    if (tacheDuree[4] == 1) {
                      planingt.mai = "ok";
                    }
                    if (tacheDuree[5] == 1) {
                      planingt.juin = "ok";
                    }
                    if (tacheDuree[6] == 1) {
                      planingt.juillet = "ok";
                    }
                    if (tacheDuree[7] == 1) {
                      planingt.aout = "ok";
                    }
                    if (tacheDuree[8] == 1) {
                      planingt.septembre = "ok";
                    }
                    if (tacheDuree[9] == 1) {
                      planingt.octobre = "ok";
                    }
                    if (tacheDuree[10] == 1) {
                      planingt.novembre = "ok";
                    }
                    if (tacheDuree[11] == 1) {
                      planingt.decembre = "ok";
                    }
                  }

                  this.tabletoggle[tache.id] = tache.tep ?? 0;
                  programme.push({ bailleur, id: tache.id, nom: tache.nom, code: tache.code, poids, poidsActuel, isTache: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, planingt });
                });
              });
            });
          });
        });
      }
      this.fich.push(programme);
      return programme;
    },
    filteredDataNew() {
      if (!this.searchs) {
        return this.dataNew;
      }

      const searchTerm = this.searchs.toLowerCase();
      return this.dataNew.filter((pta) => {
        return pta.nom?.toLowerCase().includes(searchTerm) || pta.code?.toString().toLowerCase().includes(searchTerm) || pta.description?.toLowerCase().includes(searchTerm);
      });
    },
    json_data() {
      const programme = [];
      if (this.ptab != undefined && this.ptab != null) {
        this.ptab.forEach((element) => {
          // const bailleur = element.bailleur;
          const bn = element.budgetNational;
          const pret = element.pret;

          let poids = "";
          let poidsActuel = "";

          let t1Pret = "";
          let t1Bn = "";
          let t2Pret = "";
          let t2Bn = "";
          let t3Pret = "";
          let t3Bn = "";
          let t4Bn = "";
          let t4Pret = "";
          let tBn = "";
          let tPret = "";
          let total = "";
          let structureResponsable = "";
          let structureAssocie = "";

          programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
          element.composantes.forEach((composante) => {
            const bn = composante.budgetNational;
            const pret = composante.pret;
            let poids = composante.poids;
            let poidsActuel = composante.poidsActuel;
            let t1Bn = "";
            let t1Pret = "";
            let t2Bn = "";
            let t2Pret = "";
            let t3Bn = "";
            let t3Pret = "";
            let t4Bn = "";
            let t4Pret = "";
            let tBn = "";
            let tPret = "";
            let total = "";
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret;
              t1Bn = composante.trimestre1.budgetNational;
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret;
              t2Bn = composante.trimestre2.budgetNational;
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret;
              t3Bn = composante.trimestre3.budgetNational;
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret;
              t4Bn = composante.trimestre4.budgetNational;
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn;
            tPret = t1Pret + t2Pret + t3Pret + t4Pret;
            total = tBn + tPret;
            let structureResponsable = "";
            let structureAssocie = "";
            programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

            //programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
            composante.sousComposantes.forEach((sousComposante) => {
              const bn = sousComposante.budgetNational;
              const pret = sousComposante.pret;
              let poids = sousComposante.poids;
              let poidsActuel = sousComposante.poidsActuel;
              let t1Bn = "";
              let t1Pret = "";
              let t2Bn = "";
              let t2Pret = "";
              let t3Bn = "";
              let t3Pret = "";
              let t4Bn = "";
              let t4Pret = "";
              let tBn = "";
              let tPret = "";
              let total = "";
              let nom = "PAS DE SOUS COMPOSANTE";
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom;
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1;
                t1Bn = sousComposante.trimestre1.budgetNational * 1;
              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1;
                t2Bn = sousComposante.trimestre2.budgetNational * 1;
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1;
                t3Bn = sousComposante.trimestre3.budgetNational * 1;
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1;
                t4Bn = sousComposante.trimestre4.budgetNational * 1;
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn;
              tPret = t1Pret + t2Pret + t3Pret + t4Pret;
              total = tBn + tPret;
              let structureResponsable = "";
              let structureAssocie = "";
              if (nom !== "PAS DE SOUS COMPOSANTE") {
                programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

                //programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
              }
              sousComposante.activites.forEach((activite) => {
                const bn = activite.budgetNational;
                const pret = activite.pret;
                let poids = activite.poids;
                let poidsActuel = activite.poidsActuel;
                let structureResponsable = activite.structureResponsable;
                let structureAssocie = activite.structureAssocie;
                let t1Bn = "";
                let t1Pret = "";
                let t2Bn = "";
                let t2Pret = "";
                let t3Bn = "";
                let t3Pret = "";
                let t4Bn = "";
                let t4Pret = "";
                let tBn = "";
                let tPret = "";
                let total = "";
                const planing = {
                  janvier: "",
                  fevrier: "",
                  mars: "",
                  avril: "",
                  mai: "",
                  juin: "",
                  juillet: "",
                  aout: "",
                  septembre: "",
                  octobre: "",
                  novembre: "",
                  decembre: "",
                };
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret;
                  t1Bn = activite.trimestre1.budgetNational;
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret;
                  t2Bn = activite.trimestre2.budgetNational;
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret;
                  t3Bn = activite.trimestre3.budgetNational;
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret;
                  t4Bn = activite.trimestre4.budgetNational;
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn;
                tPret = t1Pret + t2Pret + t3Pret + t4Pret;
                total = tBn + tPret;

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees;
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok";
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok";
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok";
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok";
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok";
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok";
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok";
                  }
                  if (activiteDuree[7] == 6) {
                    planing.aout = "ok";
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok";
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok";
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok";
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok";
                  }
                }
                programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

                //programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
                activite.taches.forEach((tache) => {
                  let poids = tache.poids;
                  let poidsActuel = tache.poidsActuel;
                  let tBn = "";
                  let tPret = "";
                  let total = "";
                  let structureResponsable = "";
                  let structureAssocie = "";

                  programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

                  //programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing });
                });
              });
            });
          });
        });
      }
      return programme;
    },
    json_dataR() {
      const programme = [];
      if (this.ptabR != undefined && this.ptabR != null) {
        this.ptabR.forEach((element) => {
          const bailleur = element.bailleur;
          const bn = element.budgetNational;
          const pret = element.pret;
          let poids = "";
          let poidsActuel = "";

          let t1Pret = "";
          let t1Bn = "";
          let t2Pret = "";
          let t2Bn = "";
          let t3Pret = "";
          let t3Bn = "";
          let t4Bn = "";
          let t4Pret = "";
          let tBn = "";
          let tPret = "";
          let total = "";
          let structureResponsable = "";
          let structureAssocie = "";

          programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

          //programme.push({ bailleur, nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
          element.composantes.forEach((composante) => {
            const bn = composante.budgetNational;
            const pret = composante.pret;
            let poids = composante.poids;
            let poidsActuel = composante.poidsActuel;
            let t1Bn = 0;
            let t1Pret = 0;
            let t2Bn = 0;
            let t2Pret = 0;
            let t3Bn = 0;
            let t3Pret = 0;
            let t4Bn = 0;
            let t4Pret = 0;
            let tBn = 0;
            let tPret = 0;
            let total = 0;
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret;
              t1Bn = composante.trimestre1.budgetNational;
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret;
              t2Bn = composante.trimestre2.budgetNational;
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret;
              t3Bn = composante.trimestre3.budgetNational;
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret;
              t4Bn = composante.trimestre4.budgetNational;
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn;
            tPret = t1Pret + t2Pret + t3Pret + t4Pret;
            total = tBn + tPret;
            let structureResponsable = "";
            let structureAssocie = "";
            programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

            //programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
            composante.sousComposantes.forEach((sousComposante) => {
              const bn = sousComposante.budgetNational;
              const pret = sousComposante.pret;
              let poids = sousComposante.poids;
              let poidsActuel = sousComposante.poidsActuel;
              let t1Bn = 0;
              let t1Pret = 0;
              let t2Bn = 0;
              let t2Pret = 0;
              let t3Bn = 0;
              let t3Pret = 0;
              let t4Bn = 0;
              let t4Pret = 0;
              let tBn = 0;
              let tPret = 0;
              let total = 0;
              let nom = "PAS DE SOUS COMPOSANTE";
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom;
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1;
                t1Bn = sousComposante.trimestre1.budgetNational * 1;
              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1;
                t2Bn = sousComposante.trimestre2.budgetNational * 1;
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1;
                t3Bn = sousComposante.trimestre3.budgetNational * 1;
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1;
                t4Bn = sousComposante.trimestre4.budgetNational * 1;
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn;
              tPret = t1Pret + t2Pret + t3Pret + t4Pret;
              total = tBn + tPret;
              let structureResponsable = "";
              let structureAssocie = "";
              if (nom !== "PAS DE SOUS COMPOSANTE") {
                programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

                //programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
              }
              sousComposante.activites.forEach((activite) => {
                const bn = activite.budgetNational;
                const pret = activite.pret;
                let poids = activite.poids;
                let poidsActuel = activite.poidsActuel;
                let structureResponsable = activite.structureResponsable;
                let structureAssocie = activite.structureAssocie;
                let t1Bn = 0;
                let t1Pret = 0;
                let t2Bn = 0;
                let t2Pret = 0;
                let t3Bn = 0;
                let t3Pret = 0;
                let t4Bn = 0;
                let t4Pret = 0;
                let tBn = 0;
                let tPret = 0;
                let total = 0;
                const planing = {
                  janvier: "",
                  fevrier: "",
                  mars: "",
                  avril: "",
                  mai: "",
                  juin: "",
                  juillet: "",
                  aout: "",
                  septembre: "",
                  octobre: "",
                  novembre: "",
                  decembre: "",
                };
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret;
                  t1Bn = activite.trimestre1.budgetNational;
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret;
                  t2Bn = activite.trimestre2.budgetNational;
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret;
                  t3Bn = activite.trimestre3.budgetNational;
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret;
                  t4Bn = activite.trimestre4.budgetNational;
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn;
                tPret = t1Pret + t2Pret + t3Pret + t4Pret;
                total = tBn + tPret;

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees;
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok";
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok";
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok";
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok";
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok";
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok";
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok";
                  }
                  if (activiteDuree[7] == 1) {
                    planing.aout = "ok";
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok";
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok";
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok";
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok";
                  }
                }
                programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

                //programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
                activite.taches.forEach((tache) => {
                  let poids = tache.poids;
                  let poidsActuel = tache.poidsActuel;
                  let tBn = "";
                  let tPret = "";
                  let total = "";
                  let structureResponsable = "";
                  let structureAssocie = "";
                  programme.push({ nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });

                  //programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing });
                });
              });
            });
          });
        });
      }
      return programme;
    },

    dataNewR() {
      const programme = [];
      if (this.ptabR != undefined && this.ptabR != null) {
        this.ptabR.forEach((element) => {
          const bailleur = element.bailleur;
          const bn = element.budgetNational;
          const pret = element.pret;

          programme.push({ bailleur, nom: element.nom, code: element.code, isProjet: true, bn, pret });
          element.composantes.forEach((composante) => {
            const bn = composante.budgetNational;
            const pret = composante.pret;
            let poids = composante.poids;
            let poidsActuel = composante.poidsActuel;
            let t1Bn = 0;
            let t1Pret = 0;
            let t2Bn = 0;
            let t2Pret = 0;
            let t3Bn = 0;
            let t3Pret = 0;
            let t4Bn = 0;
            let t4Pret = 0;
            let tBn = 0;
            let tPret = 0;
            let total = 0;
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret;
              t1Bn = composante.trimestre1.budgetNational;
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret;
              t2Bn = composante.trimestre2.budgetNational;
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret;
              t3Bn = composante.trimestre3.budgetNational;
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret;
              t4Bn = composante.trimestre4.budgetNational;
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn;
            tPret = t1Pret + t2Pret + t3Pret + t4Pret;
            total = tBn + tPret;

            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, isComposante: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total });
            composante.sousComposantes.forEach((sousComposante) => {
              const bn = sousComposante.budgetNational;
              const pret = sousComposante.pret;
              let poids = sousComposante.poids;
              let poidsActuel = sousComposante.poidsActuel;
              let t1Bn = 0;
              let t1Pret = 0;
              let t2Bn = 0;
              let t2Pret = 0;
              let t3Bn = 0;
              let t3Pret = 0;
              let t4Bn = 0;
              let t4Pret = 0;
              let tBn = 0;
              let tPret = 0;
              let total = 0;
              let nom = "PAS DE SOUS COMPOSANTE";
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom;
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1;
                t1Bn = sousComposante.trimestre1.budgetNational * 1;
              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1;
                t2Bn = sousComposante.trimestre2.budgetNational * 1;
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1;
                t3Bn = sousComposante.trimestre3.budgetNational * 1;
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1;
                t4Bn = sousComposante.trimestre4.budgetNational * 1;
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn;
              tPret = t1Pret + t2Pret + t3Pret + t4Pret;
              total = tBn + tPret;
              if (nom !== "PAS DE SOUS COMPOSANTE") {
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, isSC: true, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total });
              }

              sousComposante.activites.forEach((activite) => {
                const bn = activite.budgetNational;
                const pret = activite.pret;
                let poids = activite.poids;
                let poidsActuel = activite.poidsActuel;
                let structureResponsable = activite.structureResponsable;
                let structureAssocie = activite.structureAssocie;
                let t1Bn = 0;
                let t1Pret = 0;
                let t2Bn = 0;
                let t2Pret = 0;
                let t3Bn = 0;
                let t3Pret = 0;
                let t4Bn = 0;
                let t4Pret = 0;
                let tBn = 0;
                let tPret = 0;
                let total = 0;
                const planing = {
                  janvier: "",
                  fevrier: "",
                  mars: "",
                  avril: "",
                  mai: "",
                  juin: "",
                  juillet: "",
                  aout: "",
                  septembre: "",
                  octobre: "",
                  novembre: "",
                  decembre: "",
                };
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret;
                  t1Bn = activite.trimestre1.budgetNational;
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret;
                  t2Bn = activite.trimestre2.budgetNational;
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret;
                  t3Bn = activite.trimestre3.budgetNational;
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret;
                  t4Bn = activite.trimestre4.budgetNational;
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn;
                tPret = t1Pret + t2Pret + t3Pret + t4Pret;
                total = tBn + tPret;

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees;
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok";
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok";
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok";
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok";
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok";
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok";
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok";
                  }
                  if (activiteDuree[7] == 1) {
                    planing.aout = "ok";
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok";
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok";
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok";
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok";
                  }
                }

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, isActivite: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing });
                activite.taches.forEach((tache) => {
                  let poids = tache.poids;
                  let poidsActuel = tache.poidsActuel;
                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, isTache: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret });
                });
              });
            });
          });
        });
      }
      return programme;
    },
    title_pdf() {
      if (this.annee == null) {
        const year = new Date().getFullYear();
        return "pta reviser -" + year;
      } else {
        return "pta reviser -" + this.annee;
      }
    },
    title_excel() {
      if (this.annee == null) {
        const year = new Date().getFullYear();
        return "pta reviser -" + year;
      } else {
        return "pta reviser -" + this.annee;
      }
    },

    title_pdfReviser() {
      if (this.annee == null) {
        const year = new Date().getFullYear();
        return "pta " + this.version.nom + "-" + year;
      } else {
        return "pta " + +this.version.nom + "-" + this.annee;
      }
    },
    title_Reviser_excel() {
      if (this.annee == null) {
        const year = new Date().getFullYear();
        return "pta " + this.version.nom + "-" + year;
      } else {
        return "pta " + +this.version.nom + "-" + this.annee;
      }
    },
    // getPlageActivite() {
    //   let obj = null;

    //   if (this.selectedIds.activiteId !== "") {
    //     obj = this.activites.find((item) => item.id === this.selectedIds.activiteId);
    //   }

    //   return obj ? obj : null;
    //   // Retourne le nom ou `null` si non trouvé
    // },
  },
  methods: {
    exportToExcel() {
      try {
        // Préparer les données pour l'export
        const exportData = this.filteredDataNew.map((item) => ({
          Code: item.code || "",
          Nom: item.nom || "",
          Description: item.description || "",
          Type: item.isProjet ? "Projet" : item.isComposante ? "Composante" : item.isSC ? "Sous-Composante" : item.isActivite ? "Activité" : item.isTache ? "Tâche" : "",
          "Budget National": item.budgetNational || 0,
          Prêt: item.pret || 0,
          Total: (item.budgetNational || 0) + (item.pret || 0),
        }));

        // Créer le workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(wb, ws, "Plan d'Action");

        // Générer le nom du fichier avec la date
        const today = new Date();
        const dateStr = today.toISOString().split("T")[0];
        const filename = `Plan_Action_${dateStr}.xlsx`;

        // Télécharger le fichier
        XLSX.writeFile(wb, filename);

        toast.success("Export Excel réussi !");
      } catch (error) {
        console.error("Erreur lors de l'export Excel:", error);
        toast.error("Erreur lors de l'export Excel");
      }
    },
    removePlan(index) {
      this.planDeDecaissement.splice(index, 1);
    },
    addPlan() {
      const newItem = {
        activiteId: this.planDeDecaissementPayload.activiteId,
        trimestre: 1, // Trimestre actuel
        annee: new Date().getFullYear(), // Set current year as default
        budgetNational: 0,
        pret: 0,
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      };
      this.planDeDecaissement.push(newItem);
    },
    ...mapActions({
      // Mapping des actions pour le module activites
      prolongerDureeActivite: "activites/PROLONGER_DATE",
      // Mapping des actions pour le module planDeDecaissements
      storePlanDecaissement: "planDeDecaissements/STORE_PLAN_DE_DECAISSEMENT",
    }),
    removeSuivi(index) {
      this.suiviFinancier.splice(index, 1);
    },
    async planDeDecaissementActivite() {
      this.loadingPlanDeDecaissement = true;

      let errorIndex = [];

      for (let index = 0; index < this.planDeDecaissement.length; index++) {
        // let status =  this.listePlanDeDecaissement.some(plan  => plan.annee ==  this.planDeDecaissement[index].annee && plan.trimestre == this.planDeDecaissement[index].trimestre );

        let plan = this.listePlanDeDecaissement.filter((plan) => plan.annee == this.planDeDecaissement[index].annee && plan.trimestre == this.planDeDecaissement[index].trimestre);

        const action = plan.length > 0 ? PlanDeCaissement.update(plan[0].id, this.planDeDecaissement[index]) : this.storePlanDecaissement(this.planDeDecaissement[index]);

        try {
          await action;

          toast.success(`Plan  de decaissement n° ${index + 1} enrégistré avec succès`);

          errorIndex.push(index);

          if (index === this.planDeDecaissement.length - 1) {
            this.showModalPlanDeDecaissement = false;

            setTimeout(() => {
              this.planDeDecaissement = [];
            }, 500);
          }

          // getDatas();
          // getDatasCadre();
          // resetForm();
        } catch (error) {
          this.loadingPlanDeDecaissement = false;

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors.length > 0) {
            this.erreurPlanDeDecaissement = error.response.data.errors;
            toast.error("Une erreur s'est produite dans votre formualaire");
          } else {
            toast.error(`Plan ${index + 1} : ${error.response.data.message}`);
          }
        } finally {
          this.loadingPlanDeDecaissement = false;
          this.getListePlanDeDecaissement(this.planDeDecaissement[0].activiteId);
        }
      }

      if (this.planDeDecaissement.length > 0) {
        console.log("this.planDeDecaissement", this.planDeDecaissement);

        if (errorIndex.length > 0) {
          console.log("errorIndex", errorIndex);
          errorIndex.forEach((item) => {
            this.removePlan(item);
          });
        }
      }
    },
    ouvrirModalPlanDeDecaissementActivite(data) {
      // console.log(data)

      const newItem = {
        activiteId: data.activiteId,
        trimestre: this.getCurrentQuarter(),
        annee: new Date().getFullYear(),
        budgetNational: 0,
        pret: 0,
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      };

      console.log("data.id", data.activiteId);

      this.getListePlanDeDecaissement(data.activiteId);

      this.planDeDecaissementPayload.activiteId = data.activiteId;
      this.planDeDecaissement.push(newItem);
      this.showModalPlanDeDecaissement = true;
    },
    async getcurrentUser() {
      await AuthService.getCurrentUser()
        .then((result) => {
          this.debutProgramme = result.data.data.programme.debut;
          this.finProgramme = result.data.data.programme.fin;
        })
        .catch((e) => {
          console.error(e);
          toast.error("Une erreur est survenue: Utilisateur connecté .");
        });
    },

    async filterSuiviFinancierActivite() {
      this.isLoadingFilterSuiviFinancier = true;

      // Validation des données avant envoi
      const annee = parseInt(this.filterPayloadSuiviFinancier.annee);
      const trimestre = parseInt(this.filterPayloadSuiviFinancier.trimestre);

      if (!annee || isNaN(annee)) {
        toast.error("Veuillez sélectionner une année valide");
        this.isLoadingFilterSuiviFinancier = false;
        return;
      }

      if (!trimestre || isNaN(trimestre)) {
        toast.error("Veuillez sélectionner un trimestre valide");
        this.isLoadingFilterSuiviFinancier = false;
        return;
      }

      const payload = {
        annee: annee,
        trimestre: trimestre
      };

      console.log("Payload du filtre:", payload);

      await SuiviFinancierService.filtre(payload)
        .then((result) => {
          // Garder la même structure que getListeDataSuivi()
          this.listeSuivi = result.data.data;
          console.log("this.listeSuivi", this.listeSuivi);
          this.isLoadingFilterSuiviFinancier = false;
          this.resetFilterModalSuivi();
          toast.success("Suivi Financier filtré.");
        })
        .catch((e) => {
          console.log(e);
          this.isLoadingFilterSuiviFinancier = false;
          toast.error("Vérifier les informations et ressayer.");
        });
    },

    resetFilterModalSuivi() {
      this.isLoadingFilterSuiviFinancier = false;
      this.showModalFiltreSuiviFinancier = false;
    },
    getCurrentQuarter() {
      const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
      console.log("Math.ceil(month / 3)", Math.ceil(month / 3));
      return Math.ceil(month / 3); // Calcul du trimestre actuel
    },
    openFilterModalSuiviFinancier() {
      this.filterPayloadSuiviFinancier.trimestre = this.getCurrentQuarter();
      this.showModalFiltreSuiviFinancier = true;

      console.log("this.filterPayloadSuiviFinancier", this.filterPayloadSuiviFinancier);
      console.log("this.showModalFiltreSuiviFinancier", this.showModalFiltreSuiviFinancier);
    },
    async getListeDataSuivi() {
      this.loadListeSuivi = true;
      await SuiviFinancierService.get()
        .then((result) => {
          this.listeSuivi = result.data.data;

          console.log(this.listeSuivi);
          this.loadListeSuivi = false;
        })
        .catch((e) => {
          console.error(e);
          this.loadListeSuivi = false;
          toast.error("Une erreur est survenue: Liste des type des options.");
        });
      // initTabulator();
    },
    voirSuiviActivite(data) {
      this.getListeDataSuivi();
      // this.getcurrentUser()
      this.voirSuiviModal = true;
      // this.$router.push({ name: "finances_suivi" });
    },
    mode() {
      return this.isCreate ? "Ajouter" : "Modifier";
    },
    resetModalSuiviFinancierActivite() {
      this.suiviFinancier.splice(0); // Vider le tableau de manière réactive
      this.erreurSuiviFinancier = null; // Reset des erreurs
      this.loadingSuiviFinancier = false; // Reset du loading
      this.showModalSuiviFinancier = false;
    },

    resetFilters() {
      // Réinitialiser les filtres aux valeurs par défaut
      this.filterPayloadSuiviFinancier.annee = new Date().getFullYear();
      this.filterPayloadSuiviFinancier.trimestre = this.getCurrentQuarter();

      // Recharger les données avec les filtres par défaut
      this.getListeDataSuivi();
    },

    addSuivi() {
      const newItem = {
        activiteId: this.suiviFinancier[0].activiteId,
        trimestre: this.getCurrentQuarter(),
        annee: new Date().getFullYear(),
        consommer: 0,

        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      };
      this.suiviFinancier.push(newItem);

      // let payLoad = {
      //   trimestre: this.getCurrentQuarter(),
      //   annee: new Date().getFullYear(),
      // };

      // this.filterSuiviFinancierActiviteParAnnee(payLoad);
    },
    async filterSuiviFinancierActiviteParAnnee(payload) {
      this.loaderListeSuivi = true;

      SuiviFinancier.filtre(payload)
        .then((data) => {
          this.loaderListeSuivi = false;
          // Garder la même structure que getListeDataSuivi()
          this.listeSuivi = data.data.data;
        })
        .catch((error) => {
          this.loaderListeSuivi = false;
          //console.log(error);
        });
    },
    getListePlanDeDecaissement(id) {
      this.loaderListePlan = true;

      ActiviteService.plansDeDecaissement(id)
        .then((data) => {
          this.loaderListePlan = false;
          //console.log(data.data.data);
          this.listePlanDeDecaissement = data.data.data;

          console.log("this.listePlanDeDecaissement", this.listePlanDeDecaissement);
        })
        .catch((error) => {
          this.loaderListePlan = false;
          //console.log(error);
        });
    },
    miseAjourTabSuivi(payLoad, index) {
      let taille = payLoad.toString().length;

      let form = {
        trimestre: taille < 2 ? payLoad : this.suiviFinancier[index].trimestre,
        annee: taille > 1 ? payLoad : this.suiviFinancier[index].annee,
      };

      console.log("form", form);

      this.filterSuiviFinancierActiviteParAnnee(form);
    },

    async suiviFinancierActivite() {
      this.loadingSuiviFinancier = true;

      let errorIndex = [];

      console.log("this.listeSuivi", this.listeSuivi);

      for (let index = 0; index < this.suiviFinancier.length; index++) {
        // let suivi = this.listeSuivi.filter((suivi) => suivi.annee == this.suiviFinancier[index].annee && suivi.trimestre == this.suiviFinancier[index].trimestre && suivi.activite.id == this.suiviFinancier[index].activiteId);

        // console.log("suivi", suivi);

        let payload = this.suiviFinancier[index];

        delete payload.id;

        // console.log("payload", payload);

        // const action = suivi.length > 0 ? SuiviFinancier.update(suivi[0]?.activite.id, this.suiviFinancier[index]) : SuiviFinancierService.create(payload);

        const action = SuiviFinancierService.create(payload);

        try {
          await action;

          toast.success(`Suivi financier n° ${index + 1} enrégistré avec succès`);

          errorIndex.push(index);

          console.log("index === this.suiviFinancier.length - 1", index === this.suiviFinancier.length - 1);

          if (index === this.suiviFinancier.length - 1) {
            this.showModalSuiviFinancier = false;

            setTimeout(() => {
              this.planDeDecaissement = [];
            }, 500);
          }

          // getDatas();
          // getDatasCadre();
          // resetForm();
        } catch (error) {
          console.log("error", error);

          this.loadingSuiviFinancier = false;

          // Mettre à jour les messages d'erreurs dynamiquement
          if (error.response && error.response.data && error.response.data.errors.length > 0) {
            this.erreurSuiviFinancier = error.response.data.errors;
            toast.error("Une erreur s'est produite dans votre formualaire");
          } else {
            toast.error(`Suivi ${index + 1} : ${error.response.data.message}`);
          }
        } finally {
          this.loadingSuiviFinancier = false;
          // this.getListePlanDeDecaissement(this.suiviFinancier[0].activiteId);
        }

        if (this.suiviFinancier.length > 0) {
          console.log("this.suiviFinancier", this.suiviFinancier);

          if (errorIndex.length > 0) {
            console.log("errorIndex", errorIndex);
            errorIndex.forEach((item) => {
              this.removeSuivi(item);
            });
          }
        }
      }
    },
    getCurrentQuarter() {
      const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
      return Math.ceil(month / 3); // Calcul du trimestre actuel
    },

    ouvrirModalSuiviFinancierActivite(item) {
      this.suiviFinancier.splice(0); // Vider le tableau de manière réactive

      // Gérer les deux cas : pta (avec activiteId) ou suivi (avec activite.id)
      const activiteId = item.activiteId || item.activite?.id || item.id;

      if (!activiteId) {
        console.error("Impossible de récupérer l'ID de l'activité", item);
        return;
      }

      const newItem = {
        activiteId: activiteId,
        trimestre: this.getCurrentQuarter(),
        annee: new Date().getFullYear(),
        consommer: 0,
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      };

      let payLoad = {
        trimestre: this.getCurrentQuarter(),
        annee: new Date().getFullYear(),
      };

      console.log("activiteId trouvé:", activiteId);

      this.filterSuiviFinancierActiviteParAnnee(payLoad);

      this.suiviFinancierPayload.activiteId = activiteId;
      this.suiviFinancierPayload.trimestre = this.getCurrentQuarter();
      this.suiviFinancier.push(newItem);
      this.showModalSuiviFinancier = true;
      this.isCreate = true;
    },
    handleDelete(params) {
      idSelect.value = params.id;
      deleteModalPreview.value = true;
    },
    handleEdit(params) {
      console.log(params);
      showModalCreate.value = true;
    },
    filtreParAnnee(datas) {
      let data = {};

      data = {
        organisationId: this.$route.params.ongId,
        annee: datas,
      };
      this.getPta(data);
    },
    handleInput(event) {},
    saveSuiviOld(id, data) {
      this.chargement = true;
      var form = {
        tacheId: id,
      };
      TacheService.suiviTache(form)
        .then((data) => {
          // this.doSuiviOld = false
          toast.success("Operation éffectué avec succès");
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            //console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            //console.log('dernier message', error.message);
          }
        });
      this.chargement = false;
    },

    isgray() {
      return true;
    },
    isActive(index) {
      return this.activeItems.includes(index);
    },
    toggle(index) {
      const isActive = this.activeItems.includes(index);
      if (isActive) {
        this.activeItems.splice(this.activeItems.indexOf(index), 1);
      } else {
        this.activeItems.push(index);
      }
    },
    togglesuivie(pta) {
      var form = {
        tacheId: pta.id,
        poidsActuel: this.tabletoggle[pta.id],
      };

      TacheService.suiviTache(form)
        .then((data) => {
          toast.success("suivie éffectué avec succès");
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            toast.error(message);
          } else if (error.request) {
            // Demande effectuée mais aucune réponse n'est reçue du serveur.
            console.log(error.request);
          } else {
            // Une erreur s'est produite lors de la configuration de la demande
            console.log("dernier message", error.message);
          }
        });
      //}
      this.chargement = false;
    },
    // exportToExcel() {
    //   //  console.log('gghghghgh');
    //   //  console.log(this.dataNew);

    //   const tableDataWithColors = this.dataNew.map((row) => {
    //     return {
    //       ...row,
    //       bailleur: "bg-red-500",
    //     };
    //   });

    //   const worksheet = XLSX.utils.json_to_sheet(tableDataWithColors);
    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, "Tableau de données");
    //   XLSX.writeFile(workbook, "tableau.xlsx");
    // },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES",
    }),
    chargement(bool) {
      this.$store.dispatch("SET_LOADER", bool);
    },
    active() {
      this.$store.dispatch("active");
    },
    disabled() {
      this.$store.dispatch("disabled");
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach((element) => {
        if (element.slug === "exporter-un-suivi-ppm") {
          this.exporterSuiviPpm = true;
        }
        if (element.slug === "exporter-un-suivi-ptab") {
          this.exporterSuiviPta = true;
        }
        if (element.slug === "exporter-un-suivi-ppm") {
          this.exporterSuiviRePpm = true;
        }
        if (element.slug === "exporter-un-suivi-pta") {
          this.exporterSuiviRePta = true;
        }
        if (element.slug === "voir-le-plan-de-decaissement-du-ptab") {
          this.planDecaissementPtaVisible = true;
        }
        if (element.slug === "exporter-un-suivi-financier") {
          this.exporterSuiviFinance = true;
        }
        if (element.slug === "voir-ptab") {
          this.ptaVisible = true;
        }
        if (element.slug === "voir-ppm") {
          this.ppmVisible = true;
        }
        if (element.slug === "voir-revision-ptab") {
          this.revisionVisible = true;
        }
        if (element.slug === "voir-ptab") {
          this.filtrePta = true;
        }
        if (element.slug === "voir-ppm") {
          this.filtrePpm = true;
        }
        if (element.slug === "voir-ptab") {
          this.filtreRePta = true;
        }
        if (element.slug === "voir-ppm") {
          this.filtreRePpm = true;
        }
      });
    },

    customLabel({ sigle }) {
      return ` ${sigle}`;
    },
    choiceVersion(version) {
      if (this.scopes.length > 0) {
        if ("actuelle" === version) {
          this.currentPage = true;
        } else {
          this.currentPage = false;
          this.getPtaRevise();
        }
      } else {
        this.currentPage = true;
      }
    },
    getPta(data) {
      this.active();
      PtabService.getOrganisationPta(data)
        .then((data) => {
          this.showModalFiltre = false;
          this.ptab = data.data.data;
          this.disabled();
          toast.success("Filtre éffectuer avec succès");
        })
        .catch((e) => {
          toast.error("Erreur lors du filtrage des informations");
          this.disabled();
        });
    },
    getPtaRevise() {
      let data = {};
      if (this.annee == null) {
        const year = new Date().getFullYear();
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: year,
        };
      } else {
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: Number(annee),
        };
      }
      this.active();
      PtabService.getReviser(data)
        .then((data) => {
          this.ptabR = data.data.data;
          this.disabled();
        })
        .catch((e) => {
          toast.error(e);
          this.disabled();
        });
    },
    getPtaReviseFiltre() {
      let data = {};
      if (this.annee == null) {
        const year = new Date().getFullYear();
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: year,
        };
      } else {
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: Number(this.annee),
        };
      }
      this.active();
      PtabService.getReviser(data)
        .then((data) => {
          this.ptabR = data.data.data;
          this.disabled();
        })
        .catch((e) => {
          toast.error(e);
          this.disabled();
        });
    },
    getPtaFiltre() {
      let data = {};
      this.chargement = true;
      if (this.ppm == null) {
        if (this.bailleur == null) {
          data = {
            programmeId: this.currentUser.programme.id,
            annee: Number(this.annee),
          };
        } else {
          data = {
            bailleurId: this.bailleur.id,
            programmeId: this.currentUser.programme.id,
            annee: Number(this.annee),
          };
        }
      } else {
        data = {
          bailleurId: this.bailleur.id,
          programmeId: this.currentUser.programme.id,
          annee: Number(this.annee),
          ppm: this.ppm,
        };
      }
      this.active();
      PtabService.getFiltre(data)
        .then((data) => {
          this.ptab = data.data.data;
          this.openFiltre = false;
          this.chargement = false;
          this.disabled();
        })
        .catch((e) => {
          this.chargement = false;
          toast.error(e);
          this.disabled();
        });
    },

    getBailleur() {
      BailleursService.get()
        .then((data) => {
          this.bailleurs = data.data.data;
        })
        .catch((e) => {
          toast.error(e);
        });
    },
  },
  mounted() {
    this.getcurrentUser();
    this.getPermission();

    if (this.revisionVisible || this.ppmVisible || this.ptaVisible) {
      console.log(this.$route.params.ongId);
      let data = {};
      data = {
        organisationId: this.$route.params.ongId,
      };
      this.getPta(data);
      this.getBailleur();
      this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
        this.scopes = response.data.data;
      });
    }
  },
};
</script>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

table td {
  border: 1px solid rgb(46, 46, 46);
  padding-block: 0px;
  padding-inline: 0px;
}
</style>