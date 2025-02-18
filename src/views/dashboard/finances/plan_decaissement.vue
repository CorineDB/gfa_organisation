<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Plan d'Action</h2>
  <div class="grid grid-cols-12 gap-6 my-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" class="w-56 pr-10 form-control box" v-model="search" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="showModalFiltre = true"><FilterIcon class="w-4 h-4 mr-3" />Filtrer le Plan de décaissement</button>
        <button class="btn btn-primary" title="Réinitialiser le filtre" @click="resetFilter()">
          <RefreshCwIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
  <!-- <pre>{{ dataNew }}</pre> -->
  <div v-if="currentPage && ptaVisible" class="current">
    <div style="max-height: 80vh" class="relative flex overflow-y-auto">
      <div style="width: 33.33%; position: sticky; left: 0; background: transparent; z-index: 1; margin-right: 1%">
        <table class="top-0 left-0 block w-full text-sm text-left table-fixed border-collaspe table1">
          <thead class="sticky top-0 z-20 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr style="height: 82px" class="">
              <!-- <th rowspan="2" class=" w-24 px-6 py-3 border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Bailleurs</th> -->
              <th scope="col" rowspan="2" class="px-6 py-3 border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Code PTBA</th>
              <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Etat des taches</th>
            </tr>
            <tr></tr>
          </thead>

          <tbody>
            <tr v-for="pta in filteredData" :key="pta.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <!-- <th scope="row" class=" p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ pta.owner_nom }}
                   <pre>{{ pta.nom }}</pre>
                </th> -->

              <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span v-if="pta.isProjet" class="text-lg font-bold"> {{ pta.code }}</span>
                <span v-if="pta.isComposante" class="text-sm text-blue-500"> {{ pta.code }}</span>
                <span v-if="pta.isSC && pta.code != 0" class="text-sm text-yellow-600"> {{ pta.code }}</span>
                <span v-if="pta.isActivite" class="text-sm text-green-600">
                  <!-- <pre>{{ pta }}</pre> -->
                  {{ pta.code }}
                </span>
                <span v-if="pta.isTache" class="text-sm text-red-600"> {{ pta.code }}</span>
              </td>
              <td>
                <select v-if="pta.isTache" class="form-select form-select-sm mt-2" aria-label=".form-select-sm example" @change="togglesuivie(pta)">
                  <option value="0">0%</option>
                  <option value="50">50%</option>
                  <option value="100">100%</option>
                </select>
                <!-- <button
                    v-if="pta.isTache"
                    @click="togglesuivie(pta)"
                    class="flex items-center justify-between px-1 text-white transition-all rounded-full shadow w-14 h-7"
                    :class="{
                      'bg-gray-400': false,
                      'bg-red-400': pta.poidsActuel == 0 || tabletoggle[pta.id] == 0,
                      'bg-green-400 ': greentoggle && (pta.poidsActuel > 0 || tabletoggle[pta.id] == 1),
                    }"
                  >
                    <div
                      class="w-5 h-5 transform translate-x-0 bg-white rounded-full"
                      :class="{
                        'translate-x-full': pta.poidsActuel > 0 || translatetoggle || tabletoggle[pta.id] == 1,
                      }"
                    ></div>
                  </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="absolute shadow-md perso left-64 sm:rounded-lg">
        <table class="w-full overflow-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="sticky top-0 text-xs text-gray-700 uppercase _z-20 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr class="">
              <th scope="col" rowspan="3" class="px-6 py-3 border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">OutComes / OutPut / activiés / Taches</th>
              <!-- <th scope="col" colspan="6" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant projet XOF</th> -->
              <!-- <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant budgetisé XOF</th> -->
              <!-- <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Poids</th>
              <th v-if="statutActuel" scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">poids actuel</th> -->

              <!-- <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">STRUCTURE ASSOCIER</th> -->
              <!-- <th scope="col" rowspan="2" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">STRUCTURE RESPONSABLE</th> -->
              <!-- <th scope="col" colspan="12" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">PLANING</th> -->
              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TRIMESTRE 1</th>

              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TRIMESTRE 2</th>

              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TRIMESTRE 3</th>

              <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TRIMESTRE 4</th>
              <!-- <th scope="col" colspan="3" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Actions</th> -->
            </tr>

            <tr class="">
              <!-- <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant financé</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Dépenses</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Solde</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Taux d'exécution financière</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TOTAL</th> -->
              <!-- <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">BN</th>
                <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">EMP</th>
                <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TOTAL</th> -->
              <!-- <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">JAV</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">FEV</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">MARS</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">AVRIL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">MAI</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">JUIN</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">JUILLET</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">AOUT</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">SEPTEMBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">OCTOBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">NOVEMBRE</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">DECEMBRE</th> -->
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant financé XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TOTAL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant financé XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TOTAL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant financé XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TOTAL</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Fond propres</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">Montant financé XOF</th>
              <th scope="col" class="px-6 py-3 text-center border dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">TOTAL</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="pta in dataNew" :key="pta.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span v-if="pta.isProjet" class="text-lg font-bold">projet: {{ pta.nom }}</span>
                <span v-if="pta.isComposante" class="text-sm text-blue-500">OutComes: {{ pta.nom }}</span>
                <span v-if="pta.isSC" class="text-sm text-yellow-600"> <span class="text-sm text-yellow-600" v-if="pta.code != 0">OutPut:</span> {{ pta.nom }}</span>
                <span v-if="pta.isActivite" class="text-sm text-green-600 shadow bg-gradient-to-br from-yellow-400 to-yellow-600">Activite: {{ pta.nom }}</span>
                <span v-if="pta.isTache" class="text-sm text-red-600"> {{ pta.nom }}</span>
              </td>
              <!-- Fond propre -->
              <!-- <td v-if="pta.bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.bn) }} </span>
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700 font-bold" v-else>0</td> -->

              <!-- Montant financé -->
              <!-- <td v-if="pta.pret" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.pret) }} </span>
              </td>
              <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700 font-bold">0</td> -->

              <!-- Dépenses -->
              <!-- <td v-if="pta.depenses" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.depenses) }} </span>
              </td>
              <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700 font-bold">0</td> -->

              <!-- Solde -->
              <!-- <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold text-yellow-500"> {{ $h.formatCurrency(pta.pret + pta.bn - pta.depenses) }}</span>
              </td> -->

              <!-- tef -->
              <!-- <td v-if="pta.pret + pta.bn > 0" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold text-yellow-500"> {{ ((pta.depenses / (pta.pret + pta.bn)) * 100).toFixed(2) }} %</span>
              </td>
              <td v-else class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">Non disponible</td> -->

              <!-- total budgetaire-->

              <!-- <td v-if="pta.pret != '' || pta.bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold text-yellow-500"> {{ $h.formatCurrency(pta.pret + pta.bn) }} </span>
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td> -->

              <!-- <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span v-if="pta.poids != undefined" class="font-bold"> {{ pta.poids }} </span>
                 <span v-else class="font-bold" >0 FCFA</span>
              </td> -->

              <!-- <td v-if="statutActuel" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span v-if="pta.poidsActuel != undefined" class="font-bold text-green-500"> {{ pta.poidsActuel }} </span>
                 <span v-else class="font-bold" >0 FCFA</span>
              </td> -->

              <!-- <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                  <span v-if="pta.structureAssocie != undefined" class="font-bold"> {{ pta.structureAssocie }} </span>
                   <span v-else class="font-bold" >0 FCFA</span>
                </td> -->
              <!-- <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span v-if="pta.structureResponsable != undefined" class="font-bold"> {{ pta.structureResponsable }} </span>
                 <span v-else class="font-bold" >0 FCFA</span>
              </td> -->

              <!--  Planing vrai activité-->

              <!-- <td v-if="pta.planing != undefined && pta.planing.janvier != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.janvier != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border shadow whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.fevrier != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.fevrier != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.mars != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.mars != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.avril != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.avril != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.mai != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.mai != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.juin != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.juin != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.juillet != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.juillet != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>

              <td class="relative p-2 border whitespace-nowrap dark:bg-yellow-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.aout != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.aout != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.septembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.septembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.octobre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.octobre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.novembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-blue-400 to-blue-600"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.novembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.planing != undefined && pta.planing.decembre != ''" class="p-2 bg-blue-500 border border-l-0 border-r-0"></td>
              <td v-else-if="pta.planingt != undefined && pta.planingt.decembre != ''" class="p-2 border border-l-0 border-r-0 shadow bg-gradient-to-br from-red-400 to-red-600"></td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td> -->

              <!-- fin planing -->

              <td v-if="pta.t1Bn != undefined && pta.t1Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t1Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>
              <td v-if="pta.t1Pret != undefined && pta.t1Pret != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t1Pret) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t1Pret != '' || pta.t1Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t1Pret + pta.t1Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t2Bn != undefined && pta.t2Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t2Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t2Pret != undefined && pta.t2Pret != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t2Pret) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t2Pret != '' || pta.t2Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t2Pret + pta.t2Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t3Bn != undefined && pta.t3Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t3Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t3Pret != undefined && pta.t3Pret != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t3Pret) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t3Pret != '' || pta.t3Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t3Pret + pta.t3Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t4Bn != undefined && pta.t4Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t4Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>

              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t4Pret != undefined && pta.t4Pret != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span class="font-bold"> {{ $h.formatCurrency(pta.t4Pret) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA</span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>

              <td v-if="pta.t4Pret != '' || pta.t4Bn != ''" class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <span v-if="pta.t4Pret != undefined && pta.t4Bn != undefined" class="font-bold"> {{ $h.formatCurrency(pta.t4Pret + pta.t4Bn) }} </span>
                <!--  <span v-else class="font-bold" >0 FCFA </span> -->
              </td>
              <td class="relative p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700" v-else></td>
              <!-- <td class="p-2 border whitespace-nowrap dark:bg-gray-800 dark:border-gray-700">
                <button v-if="pta.isActivite" @click="ouvrirModalSuiviFinancierActivite(pta)" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Suivre</button>

                <button v-if="pta.isActivite" @click="voirSuiviActivite()" class="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xs px-4 py-2 mr-2">Voir les suivis</button>

                <button v-if="pta.isActivite" @click="handleDelete(pta)" class="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-xs px-4 py-2">Supprimer</button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <NoRecordsMessage class="col-span-12" v-if="!dataNew.length" title="Aucun plan de décaissement pour l'instant" description="Il semble qu'il n'y ait pas de plan d'action à afficher.Veuillez ajouter des suivis financiers aux différentes activités." />

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalFiltre" @hidden="showModalFiltre = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Filtrer le pta</h2>
    </ModalHeader>
    <form @submit.prevent="filtreParAnnee(annees)">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <!-- <pre>{{years}}</pre> -->
          <div class="">
            <label class="form-label">Année</label>
            <TomSelect v-model="annees" :options="{ placeholder: 'Selectionez une année' }" class="w-full">
              <option v-for="(year, index) in years" :key="index" :value="year.nom">{{ year.nom }}</option>
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
        <div v-for="(plan, index) in suiviFinancier" :key="index" class="col-span-12 border-b pb-4 mb-4">
          <h3 class="text-sm font-medium mb-2">Plan {{ index + 1 }}</h3>

          <div class="w-full">
            <InputForm label="Consommé" v-model="plan.consommer" type="number" />

            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.consommer">
              {{ erreurSuiviFinancier[index].consommer }}
            </p>
          </div>

          <div class="w-full mt-3">
            <label class="form-label">Sources</label>
            <TomSelect v-model="plan.type" :options="{ placeholder: 'Selectionez une source' }" class="w-full">
              <option value="0">Fond propre</option>
              <option value="1">Budget Alloue</option>
            </TomSelect>
          </div>

          <div class="w-full mt-3">
            <label class="form-label">Sélectionnez le trimestre</label>
            <TomSelect v-model="plan.trimestre" :options="{ placeholder: 'Selectionez le trimestre' }" class="w-full">
              <option value="1">Trimestre 1</option>
              <option value="2">Trimestre 2</option>
              <option value="3">Trimestre 3</option>
              <option value="4">Trimestre 4</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div>

          <!-- <div class="w-full mt-3">
            <InputForm v-model="plan.trimestre" :min="1" :max="4" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Sélectionnez le trimestre" label="Sélectionnez le trimestre" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.trimestre">
              {{ erreurSuiviFinancier[index].trimestre }}
            </p>
          </div> -->

          <div class="w-full mt-3">
            <InputForm v-model="plan.annee" :min="2000" class="col-span-12" type="number" :required="true" :disabled="true" placeHolder="Saisissez l'année" label="Saisissez l'année de décaissement" />
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="erreurSuiviFinancier?.[index]?.annee">
              {{ erreurSuiviFinancier[index].annee }}
            </p>
          </div>

          <button type="button" @click="removePlan(index)" class="mt-2 text-red-600 text-sm underline">Supprimer ce suivi</button>
        </div>

        <button type="button" @click="addPlan" class="col-span-12 btn btn-outline-primary">Ajouter un autre suivi</button>
      </ModalBody>
      <ModalFooter>
        <div class="flex items-center justify-center">
          <button type="button" @click="resetModalSuiviFinancierActivite" class="w-full mr-1 btn btn-outline-secondary">Annuler</button>
          <VButton class="inline-block" label="Enregistrer" :loading="loadingSuiviFinancier" :type="submit" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
</template>

<script>
//var XLSX = require("xlsx");
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

export default {
  props: ["ppm"],
  components: { VButton, NoRecordsMessage, InputForm },
  data() {
    return {
      currentPages: 1,
      search: "",
      itemsPerPage: this.dataNew?.length + 1,
      isCreate: true,
      suiviFinancierPayload: {
        activiteId: null,
        trimestre: 1, // Trimestre actuel
        annee: new Date().getFullYear(), // Set current year as default
        consommer: 0,
        type: 0,
      },
      showModalSuiviFinancier: false,
      loadingSuiviFinancier: false,
      erreurSuiviFinancier: null,
      suiviFinancier: [],
      years: [],
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
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
    ...mapState({
      loading: (state) => state.loading,
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
    filteredData() {
      const keys = ["nom"];
      const lowercasedSearch = this.search.toLowerCase();

      if (this.search == "") {
        return this.dataNew;
      } else {
        this.dataNew.filter((item) =>
          keys.some((key) => {
            const value = key.split(".").reduce((obj, keyPart) => obj?.[keyPart], item);
            return value?.toString().toLowerCase().includes(lowercasedSearch);
          })
        );
      }
    },

    json_data() {
      const programme = [];
      if (this.ptab != undefined && this.ptab != null) {
        this.ptab.forEach((element) => {
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

          programme.push({ bailleur, nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
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
            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
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
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
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

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
                activite.taches.forEach((tache) => {
                  let poids = tache.poids;
                  let poidsActuel = tache.poidsActuel;
                  let tBn = "";
                  let tPret = "";
                  let total = "";
                  let structureResponsable = "";
                  let structureAssocie = "";

                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing });
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

          programme.push({ bailleur, nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
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
            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
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
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
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

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie });
                activite.taches.forEach((tache) => {
                  let poids = tache.poids;
                  let poidsActuel = tache.poidsActuel;
                  let tBn = "";
                  let tPret = "";
                  let total = "";
                  let structureResponsable = "";
                  let structureAssocie = "";

                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing });
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
  },
  methods: {
    // paginatedAndFilteredData() {
    //   const { paginatedData, totalFilteredItems } = $h.filterData({
    //     itemsPerPage: this.itemsPerPage,
    //     search: this.search,
    //     data: this.dataNew(),
    //     currentPage: this.currentPages,
    //     keys: ["nom"],
    //   });

    //   // Mettre à jour le total pour recalculer la pagination
    //   this.totalItems = totalFilteredItems;

    //   return paginatedData;
    // },
    voirSuiviActivite(data) {
      this.$router.push({ name: "finances_suivi" });
    },
    mode() {
      return this.isCreate ? "Ajouter" : "Modifier";
    },
    resetModalSuiviFinancierActivite(item) {
      this.suiviFinancier = [];
      this.showModalSuiviFinancier = false;
    },
    removePlan(index) {
      this.suiviFinancier.splice(index, 1);
    },
    addPlan() {
      this.suiviFinancier.push(this.suiviFinancierPayload);
    },

    suiviFinancierActivite() {
      this.loadingSuiviFinancier = true;

      for (let index = 0; index < this.suiviFinancier.length; index++) {
        SuiviFinancierService.create(this.suiviFinancier[index])
          .then(() => {
            this.loadingSuiviFinancier = false;
            toast.success("Suivi Financier créer.");
            this.resetModalSuiviFinancierActivite();
            this.showModalSuiviFinancier = false;
            // getDatas();
          })
          .catch((error) => {
            console.log(error);
            this.loadingSuiviFinancier = false;

            if (error.response && error.response.data && error.response.data.errors) {
              //alert("ok")
              this.erreurSuiviFinancier = error.response.data.errors;
              toast.error(error.response.data.message);
            } else {
              toast.error(error.message);
            }

            // Mettre à jour les messages d'erreurs dynamiquement
            // if (error.response && error.response.data && error.response.data.errors) {
            //   erreurSuiviFinancier = error.response.data.errors;
            // } else {
            //   toast.error(error.response.data.errors.message);
            // }
          });
      }
    },
    getCurrentQuarter() {
      const month = new Date().getMonth() + 1; // Les mois sont indexés à partir de 0
      return Math.ceil(month / 3); // Calcul du trimestre actuel
    },
    resetFilter() {
      this.filtreParAnnee(new Date().getFullYear());
    },

    ouvrirModalSuiviFinancierActivite(item) {
      console.log(item.activiteId);
      this.suiviFinancierPayload.activiteId = item.activiteId;
      this.suiviFinancierPayload.trimestre = this.getCurrentQuarter();
      this.suiviFinancier.push(this.suiviFinancierPayload);
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
          //this.$toast.success('Operation éffectué avec succès')
        })
        .catch((error) => {
          if (error.response) {
            // Requête effectuée mais le serveur a répondu par une erreur.
            const message = error.response.data.message;
            this.$toast.error(message);
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
      //this.dataNew;

      this.redtoggle = false;
      this.graytoggle = false;
      //this.greentoggle=true;
      this.translatetoggle = false;

      //console.log(this.tabletoggle[id]);

      this.chargement = true;
      var form = {
        tacheId: pta.id,
      };
      //  console.log(id)
      if (pta.poidsActuel > 0) {
        this.tabletoggle[pta.id] = 0;
        TacheService.deleteSuivis(pta.id)
          .then((data) => {
            // this.doSuiviOld = false
            // this.dataNew;
            this.$toast.success("suivie supprimé avec succès");
            // window.location.reload();
          })
          .catch((error) => {
            if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message;
              this.$toast.error(message);
            } else if (error.request) {
              // Demande effectuée mais aucune réponse n'est reçue du serveur.
              //console.log(error.request);
            } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
            }
          });
      } else {
        this.tabletoggle[pta.id] = 1;

        TacheService.suiviTache(form)
          .then((data) => {
            // this.doSuiviOld = false
            // this.dataNew;
            this.$toast.success("suivie éffectué avec succès");
            // window.location.reload();
          })
          .catch((error) => {
            if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message;
              this.$toast.error(message);
            } else if (error.request) {
              // Demande effectuée mais aucune réponse n'est reçue du serveur.
              //console.log(error.request);
            } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
            }
          });
      }
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
          if (this.showModalFiltre) this.showModalFiltre = false;
          this.ptab = data.data.data;
          this.disabled();
          toast.success("Filtre éffectuer avec succès");
        })
        .catch((e) => {
          console.log(e);
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
          this.$toast.error(e);
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
          this.$toast.error(e);
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
          this.$toast.error(e);
          this.disabled();
        });
    },

    getBailleur() {
      BailleursService.get()
        .then((data) => {
          this.bailleurs = data.data.data;
        })
        .catch((e) => {
          this.$toast.error(e);
        });
    },
  },
  mounted() {
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

    var anneeActuelle = new Date().getFullYear() + 5;
    let i = 0;
    for (var annee = 2016; annee <= anneeActuelle; annee++) {
      i++;
      this.years.push({ nom: `${annee}` });
    }
    console.log(this.years);
  },
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
