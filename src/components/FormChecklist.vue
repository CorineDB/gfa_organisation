<template>
 <div>
    <div class="flex justify-between">
    <h1 class="text-lg font-semibold uppercase text-center py-2">
        {{ checklist.activite.nom }}
    </h1>
    <div class="flex items-center my-4">
      <label for="vrai" class="px-4 block text-sm uppercase font-medium text-gray-700">
        <input
          :id="`${checklist.activite.nom}1`"
          :name="`${checklist.activite.nom}`"
          type="radio"
          class="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300"
          value="1"
          v-model="checklist.activite.statut"
        />
        realiser
      </label>
      <label for="faux" class="px-4 block text-sm uppercase font-medium text-gray-700">
        <input
          :id="`${checklist.activite.nom}2`"
          :name="`${checklist.activite.nom}`"
          type="radio"
          class="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300"
          value="0"
          v-model="checklist.activite.statut"
        />
        non realiser
      </label>
    </div>
  </div>
  <div v-for="(form, index) in checklist.data" :key="index">
                <div v-if="form.inputType == 'edit'">
                  <label class="block py-2 text-sm font-semibold" for="">
                    {{ form.nom }}
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="form.content"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm"
                  />
                  <label class="block py-2 text-sm font-semibold" for="">
                    Justification
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="form.justification"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
                <div v-if="form.inputType == 'photos'">
                  <label class="block py-2 text-sm font-semibold" for="">
                    {{ form.nom }}
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input
                    type="file"
                    accept="png,jpg"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm"
                  />
                  <label class="block py-2 text-sm font-semibold" for="">
                    Justification
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="form.justification"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm"
                  />
                </div>
                <div v-if="form.inputType == 'boolean'">
                  <label
                    for="name"
                    class="my-4 block text-xl font-medium text-gray-700"
                    >{{ form.label }}</label
                  >
                  <div class="flex items-center my-4">
                    <label
                      for="vrai"
                      class="px-4 block text-sm uppercase font-medium text-gray-700"
                    >
                      <input
                        :id="`${form.content}1`"
                        :name="`${form.content}`"
                        v-model="form.content"
                        type="radio"
                        class="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300"
                      />
                      realiser
                    </label>
                    <label
                      for="faux"
                      class="px-4 block text-sm uppercase font-medium text-gray-700"
                    >
                      <input
                        :id="`${form.content}2`"
                        :name="`${form.content}`"
                        v-model="form.content"
                        type="radio"
                        class="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300"
                      />
                      non realiser
                    </label>
                    <label class="block py-2 text-sm font-semibold" for="">
                    Justification
                    <span class="px-2 text-xs sm:text-sm  md:text-lg font-black text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="form.justification"
                    class="px-2 py-1 md:px-4 md:py-2 mt-1 border-2 border-gray-300 outile-none focus:outline-none focus:ring-2 w-full focus:ring-blue-500/50 focus:border-transparent placeholder:text-xs md:placeholder:text-sm"
                  />
                  </div>
                </div>
                <div class="my-3 w-4/5" v-if="form.inputType=='file'">
                  <input type="text" v-model="form.nom" class="px-2 py-2  text-sm border border-primary w-full outline-none block " placeholder="Televerser un fichier">
                  <input  type="file" @change=" previewFiles" class="px-2 py-2  text-sm border border-primary w-2/3 outline-none block " placeholder="Saisissez votre libellé">
                </div>
  </div>
 </div>
</template>

<script>
export default {
props:['checklist']
}
</script>

<style>

</style>