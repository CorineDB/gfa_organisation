<template>
  <div class="relative flex flex-col">
      <div class="overflow-x-auto">
          <div class="py-2 inline-block min-w-full">
              <div class="overflow-x-auto">
                  <table class="min-w-full table-auto">
                      <thead class="border-b bg-gray-300">
                          <tr>
                              <th v-for="(head, index) in headers" :key="index" scope="col" class="text-xs md:text-sm whitespace-nowrap font-medium text-gray-900 py-2 px-4 text-left">
                                  <span v-if="head.monaie != undefined"> {{ head.name }} XOF </span>
                                  <span v-else> {{ head.name }} </span>

                                  <label class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
                                      <input type="checkbox" v-model="val[index]" class="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline" :name="index" @click="searchcolumn($event, head.name)" />
                                  </label>
                              </th>
                              <th scope="col" v-if="statut" class="text-xs md:text-sm font-medium text-gray-900 py-2 px-4 text-left">Statut</th>
                              <th scope="col" v-if="actions != undefined" class="text-xs md:text-sm font-medium text-gray-900 py-2 px-4 text-left">Actions</th>
                          </tr>
                      </thead>

                      <tbody>
                          <tr class="border-b border-gray-300 hover:bg-gray-200" v-for="(data, index) in listes" :key="index">
                              <td v-for="(head, indice) in headers" :key="indice" class="text-sm text-gray-900 font-light py-2 px-4">
                                  <div class="text-xs w-full" v-if="head.props !== undefined">
                                      <span v-if="data[head.props] != null">
                                          <span v-if="head.monaie"> {{ data[head.props][head.cle] | formatNumber }}</span>
                                          <span v-else> {{ data[head.props][head.cle] }}</span>
                                      </span>
                                      <span v-else> Donnée non definit </span>
                                  </div>
                                  <div class="text-xs w-full" v-if="head.props === undefined">
                                      <span v-if="head.monaie"> {{ data[head.cle] | formatNumber }} </span>
                                      <span v-else> {{ data[head.cle] }}</span>
                                  </div>
                              </td>
                              <td v-if="statut" class="text-sm text-gray-900 font-light py-2 px-4">
                                  <span v-if="data.statut == 0" class="bg-purple-500 text-white px-2 py-1 rounded-md whitespace-nowrap"> en cours </span>
                                  <span v-if="data.statut == 1" class="bg-green-500 text-white px-2 py-1 rounded-md whitespace-nowrap"> validé </span>
                                  <span v-if="data.statut == -1" class="bg-red-500 text-white px-2 py-1 rounded-md whitespace-nowrap"> non validé </span>
                              </td>
                              <td v-if="actions != undefined" class="text-sm space-x-3 text-gray-900 font-light py-2 px-4 flex items-center">
                                  <div v-for="(action, index) in actions" :key="index" class="flex item-center justify-center">
                                      <div v-if="action.name === 'suivre'" title="suivre" @click="$emit('suivre', data.id)" class="mr-2 cursor-pointer transform hover:text-blue-500 hover:scale-110">
                                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                      </div>

                                      <div v-if="action.name === 'modifier'" @click="$emit('modifier', data)" class="mr-2 cursor-pointer transform hover:text-blue-500 hover:scale-110">
                                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                                              <path fill="none" d="M0 0h24v24H0z"></path>
                                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                          </svg>
                                      </div>

                                      <div v-if="action.name === 'supprimer'" @click="$emit('supprimer', data)" class="mr-2 cursor-pointer transform hover:text-red-500 hover:scale-110">
                                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>
                                      </div>
                                      <div v-if="action.name === 'consulter'" title="consulter les suivis" @click="$emit('consulter', data.id)" class="mr-2 cursor-pointer transform hover:text-blue-500 hover:scale-110">
                                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                          </svg>
                                      </div>
                                      <div v-if="action.name === 'detail'" title="consulter les fichiers" @click="$emit('seeUpload', data)">
                                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 14 16" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM1 3h5v1H1V3zm6 9v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73C4.86 8.43 5.82 8 7.01 8V6l4 3-4 3H7z"></path></svg>
                                      </div>

                                      <div v-if="action.name === 'reponse'" title="reponse ano" @click="$emit('reponseAno', data)">
                                          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm120 190.77h-89l36.88-36.88-5.6-6.51a87.38 87.38 0 10-62.94 148 87.55 87.55 0 0082.42-58.25l5.37-15.13 30.17 10.67-5.3 15.13a119.4 119.4 0 11-112.62-159.18 118.34 118.34 0 0186.36 36.95l.56.62 4.31 5L376 149.81z"></path></svg>
                                      </div>
                                  </div>
                                  <div v-if="isComment" @click="$emit('commenter', data)" title="lacher un commentaire" class="mr-2 cursor-pointer transform text-indigo-500 hover:text-indigo-700 hover:scale-110">
                                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path></svg>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      <div class="absolute -bottom-12 right-2 u" v-if="totalPages > 15">
          <pagination :totalPages="totalPages" :perPage="perPage" :currentPage="currentPage" @pagechanged="onPageChange"></pagination>
      </div>
  </div>
</template>

<script>
import TrTable from "@/components/TrTable";
import Pagination from "@/components/Pagination";
export default {
  components: { TrTable, Pagination },
  props: ["datas", "headers", "actions", "statut", "sendRequest", "isComment", "count", "search", "total"],
  data() {
      return {
          //count :0,
          currentPage: 1,
          perPage: 15,
          selectedRows: [],
          val: [],
          test: "",
          totalFiltre: 0,

          listeSelection: [],
      };
  },
  computed: {
      totalPages() {
          if (this.datas != undefined) {
              return this.datas.length;
          }
      },
      listes() {
          return this.datas;
          // let datas = [];
          // if (this.filtered() != undefined) {
          //     for (let index = this.perPage * this.currentPage - this.perPage; index < this.perPage * this.currentPage; index++) {
          //         if (index <= this.totalPages - 1) {
          //             const element = this.filtered()[index];
          //             //console.log(index)
          //             datas.push(element);
          //         }
          //     }

          // }
      },
  },
  methods: {
      update(id, type, input, value) {
          if (this.sendRequest === false) {
              this.$emit("updateInputData", id, input, value);
          }
      },

      onPageChange(page) {
          if (page === this.totalPages) {
              page = this.totalPages / this.perPage;
          }
          this.currentPage = page;
      },

      getRowDetail($event, count, dataId) {
          count++;
          let rows = this.selectedRows;
          if (rows.includes(count)) {
              let index = rows.indexOf(count);
              rows.splice(index, 1);
              this.listeSelection.pop(dataId);
          } else {
              rows.push(count);
              this.listeSelection.push(dataId);
          }
          if (count === 0) {
              this.alert = false;
          }
      },
      selectAllCheckbox($event, count, dataId) {
          let columns = document.querySelectorAll(".rowCheckbox");
          this.listeSelection = [];
          if ($event.target.checked == true) {
              columns.forEach((column) => {
                  column.checked = true;
                  this.listeSelection.push(parseFloat(column.name));
              });
          } else {
              columns.forEach((column) => {
                  column.checked = false;
              });
              this.listeSelection = [];
          }
      },
      toggleColumn(key) {
          let columns = document.querySelectorAll("." + key);
          if (this.$refs[key].classList.contains("hidden") && this.$refs[key].classList.contains(key)) {
              columns.forEach((column) => {
                  column.classList.remove("hidden");
              });
          } else {
              columns.forEach((column) => {
                  column.classList.add("hidden");
              });
          }
      },

      filtered() {
          var self = this;
          var colonnes = [];
          var i = 0;
          this.totalFiltre = 0;

          this.headers.forEach((element) => {
              if (this.val[i]) {
                  if (element.props) {
                      colonnes.push([element.props, element.cle]);
                  } else {
                      colonnes.push(element.cle);
                  }
              }

              i++;
          });

          if (colonnes.length) {
              return this.datas.filter(function (data) {
                  for (let col of colonnes) {
                      if (Array.isArray(col)) {
                          if (data[col[0]][col[1]].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                              if (self.total) {
                                  self.totalFiltre = parseFloat(data[self.total]) + parseFloat(self.totalFiltre);
                                  self.$emit("retour", self.totalFiltre);
                              }

                              return data;
                          }
                      } else {
                          if (data[col].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                              if (self.total) {
                                  self.totalFiltre = parseFloat(data[self.total]) + parseFloat(self.totalFiltre);
                                  self.$emit("retour", self.totalFiltre);
                              }

                              return data;
                          }
                      }
                  }
              });
          } else {
              return this.datas.filter(function (data) {
                  for (let header of self.headers) {
                      if (data[header.props] != null) {
                          if (data[header.props][header.cle]) {
                              if (data[header.props][header.cle].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                                  //console.log(data)
                                  if (self.total) {
                                      self.totalFiltre = parseFloat(data[self.total]) + parseFloat(self.totalFiltre);
                                      self.$emit("retour", self.totalFiltre);
                                  }

                                  return data;
                              }
                          }
                      } else {
                          if (data[header.cle]) {
                              if (data[header.cle].toString().toLowerCase().indexOf(self.search.toLowerCase()) >= 0) {
                                  if (self.total) {
                                      self.totalFiltre = parseFloat(data[self.total]) + parseFloat(self.totalFiltre);
                                      self.$emit("retour", self.totalFiltre);
                                  }

                                  return data;
                              }
                          }
                      }
                  }
              });
          }
      },
  },
};
</script>

<style></style>
