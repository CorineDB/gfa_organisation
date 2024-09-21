<template>
  <div>
    <div v-if="template =='ano' " class="overflow-hidden bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Information Ano</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">details et fichiers</p>
      </div>
     
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Dossier</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{datas.dossier}}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Statut</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"> 
              <span v-if="datas.statut ==0" class="bg-purple-500 text-white px-2 py-1 rounded-md">  en cours </span>
              <span v-if="datas.statut ==-1" class="bg-green-500 text-white px-2 py-1 rounded-md">  valider </span>
              <span v-if="datas.statut ==-2" class="bg-red-500 text-white px-2 py-1 rounded-md">  non valider </span>
             </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Date de soumission</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{datas.dateDeSoumission}}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Destinataire</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{datas.destinataire}}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Bailleur</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"> {{datas.bailleur.sigle}} </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Fichiers</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">
                <li v-for="data in datas.fichiers" :key="data.id" class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div class="flex w-0 flex-1 items-center">
                  <svg stroke="currentColor" class="h-5 w-5" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <span class="ml-2 w-0 flex-1 truncate">{{data.nom}}</span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a :href="`${base_url}${data.url}`" target="_blank" :download="data.nom" class="font-medium text-indigo-600 hover:text-indigo-500">telecharger</a>
                </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div v-if="template=='details-projet' " class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Mes fichiers</h3>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Mes documents</dt>
         
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">
              <li v-for="data in datas" :key="data.id" class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div class="flex w-0 flex-1 items-center">
                  <svg stroke="currentColor" class="h-5 w-5" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <span class="ml-2 w-0 flex-1 truncate">{{data.nom}}</span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a :href="`${base_url}${data.url}`" target="_blank" :download="data.nom" class="font-medium text-indigo-600 hover:text-indigo-500">telecharger</a>
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
    </div>
    <div v-if="template=='audit' " class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Rapport</h3>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Mes documents</dt>
         
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">
              <li  class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div class="flex w-0 flex-1 items-center">
                  <svg stroke="currentColor" class="h-5 w-5" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <span class="ml-2 w-0 flex-1 truncate">{{datas.nom}}</span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a :href="`${base_url}${datas.url}`" target="_blank" :download="datas.nom" class="font-medium text-indigo-600 hover:text-indigo-500">telecharger</a>
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
    </div>
  </div>
</template>

<script>
import {API_BASE_URL} from "@/services/configs/environment.js";
export default {
  props:['template','datas'],
  data() {
    return {
      base_url:API_BASE_URL,
    }
  }
}
</script>

<style>

</style>