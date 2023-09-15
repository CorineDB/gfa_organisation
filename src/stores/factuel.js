import { defineStore } from "pinia";

export const useFactuelStore = defineStore("factuel", {
  state: () => ({
    dataTable: [],
    bigTable: [],
    submitTable: [],
    etape: 0,
  }),
  actions: {
    setDataTable(table) {
      this.dataTable = table;
    },
    setBigTable(table) {
      this.bigTable = table;
    },
    setSubmitTable(table) {
      this.submitTable = table;
    },
    setEtape(etape) {
      this.etape = etape;
    },
  },
  getters: {
    getDataTable() {
      return this.dataTable;
    },
    getBigTable() {
      return this.bigTable;
    },
    getSubmitTable() {
      return this.submitTable;
    },
    getEtape() {
      return this.etape;
    },
  },
});
