<template>
  

   
</template>

<script>
var XLSX = require("xlsx");

import PtabService from "@/services/modules/pta.service.js";
import BailleursService from "@/services/modules/bailleur.service.js";
import JsonExcel from "vue-json-excel";
import VueHtml2pdf from 'vue-html2pdf';
import TacheService from "@/services/modules/tache.service.js";

import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
export default {
  props: ['ppm'],
  components: { Multiselect, Vmodal, VueHtml2pdf, JsonExcel },
  data() {
    return {
      etattoggle: true,
      graytoggle: true,
      redtoggle: false,
      translatetoggle: false,
      chargement: false,


      greentoggle: false,
      ptab: [],
      items: ['Item 1', 'Item 2', 'Item 3'],
      activeItems: [],
      fich: [],

      ptabR: [],
      openFiltre: false,
      statutActuel: false,
      annee: null,
      bailleur: '',
      bailleurs: [],
      version: 'current',
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
    }
  },
  computed: {
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' }),
    ...mapState({
      loading: state => state.loading
    }),

    
    dataNew() {
      const programme = []
      if (this.ptab != undefined && this.ptab != null) {
        this.ptab.forEach(element => {
          const bailleur = element.bailleur
          const bn = element.budgetNational
          const pret = element.pret

          programme.push({ bailleur, nom: element.nom, code: element.code, isProjet: true, bn, pret })
          element.composantes.forEach(composante => {
            const bn = composante.budgetNational
            const pret = composante.pret
            let poids = composante.poids
            let poidsActuel = composante.poidsActuel
            let t1Bn = ''
            let t1Pret = ''
            let t2Bn = ''
            let t2Pret = ''
            let t3Bn = ''
            let t3Pret = ''
            let t4Bn = ''
            let t4Pret = ''
            let tBn = ''
            let tPret = ''
            let total = ''
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret
              t1Bn = composante.trimestre1.budgetNational
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret
              t2Bn = composante.trimestre2.budgetNational
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret
              t3Bn = composante.trimestre3.budgetNational
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret
              t4Bn = composante.trimestre4.budgetNational
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn
            tPret = t1Pret + t2Pret + t3Pret + t4Pret
            total = tBn + tPret

            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, isComposante: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total })
            composante.sousComposantes.forEach(sousComposante => {
              const bn = sousComposante.budgetNational
              const pret = sousComposante.pret
              let poids = sousComposante.poids
              let poidsActuel = sousComposante.poidsActuel
              let t1Bn = ''
              let t1Pret = ''
              let t2Bn = ''
              let t2Pret = ''
              let t3Bn = ''
              let t3Pret = ''
              let t4Bn = ''
              let t4Pret = ''
              let tBn = ''
              let tPret = ''
              let total = ''
              let nom = "PAS DE SOUS COMPOSANTE"
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1
                t1Bn = sousComposante.trimestre1.budgetNational * 1

              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1
                t2Bn = sousComposante.trimestre2.budgetNational * 1
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1
                t3Bn = sousComposante.trimestre3.budgetNational * 1
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1
                t4Bn = sousComposante.trimestre4.budgetNational * 1
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn
              tPret = t1Pret + t2Pret + t3Pret + t4Pret
              total = tBn + tPret
              if (nom !== 'PAS DE SOUS COMPOSANTE') {
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, isSC: true, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total })
              }
              sousComposante.activites.forEach(activite => {
                const bn = activite.budgetNational
                const pret = activite.pret
                let poids = activite.poids
                let poidsActuel = activite.poidsActuel
                let structureResponsable = activite.structureResponsable
                let structureAssocie = activite.structureAssocie
                let t1Bn = ''
                let t1Pret = ''
                let t2Bn = ''
                let t2Pret = ''
                let t3Bn = ''
                let t3Pret = ''
                let t4Bn = ''
                let t4Pret = ''
                let tBn = ''
                let tPret = ''
                let total = ''
                const planing = {
                  janvier: '',
                  fevrier: '',
                  mars: '',
                  avril: '',
                  mai: '',
                  juin: '',
                  juillet: '',
                  aout: '',
                  septembre: '',
                  octobre: '',
                  novembre: '',
                  decembre: ''
                }
                const planingt = {
                  janvier: '',
                  fevrier: '',
                  mars: '',
                  avril: '',
                  mai: '',
                  juin: '',
                  juillet: '',
                  aout: '',
                  septembre: '',
                  octobre: '',
                  novembre: '',
                  decembre: ''
                }
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret
                  t1Bn = activite.trimestre1.budgetNational
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret
                  t2Bn = activite.trimestre2.budgetNational
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret
                  t3Bn = activite.trimestre3.budgetNational
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret
                  t4Bn = activite.trimestre4.budgetNational
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn
                tPret = t1Pret + t2Pret + t3Pret + t4Pret
                total = tBn + tPret

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok"
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok"
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok"
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok"
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok"
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok"
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok"
                  }
                  if (activiteDuree[7] == 1) {
                    planing.aout = "ok"
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok"
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok"
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok"
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok"
                  }
                }





                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, isActivite: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing })
                activite.taches.forEach(tache => {
                  const planingt = {
                    janvier: '',
                    fevrier: '',
                    mars: '',
                    avril: '',
                    mai: '',
                    juin: '',
                    juillet: '',
                    aout: '',
                    septembre: '',
                    octobre: '',
                    novembre: '',
                    decembre: ''
                  }
                  let poids = tache.poids
                  let poidsActuel = tache.poidsActuel
                  const tacheDuree = tache.durees
                  const pret = ''
                  const bn = ''
                  let t1Bn = ''
                  let t1Pret = ''
                  let t2Bn = ''
                  let t2Pret = ''
                  let t3Bn = ''
                  let t3Pret = ''
                  let t4Bn = ''
                  let t4Pret = ''
                  let tBn = ''
                  let tPret = ''
                  // let total = ''

                  if (tacheDuree != undefined || activiteDuree != null) {
                    if (tacheDuree[0] == 1) {
                      planingt.janvier = "ok"
                    }
                    if (tacheDuree[1] == 1) {
                      planingt.fevrier = "ok"
                    }
                    if (tacheDuree[2] == 1) {
                      planingt.mars = "ok"
                    }
                    if (tacheDuree[3] == 1) {
                      planingt.avril = "ok"
                    }
                    if (tacheDuree[4] == 1) {
                      planingt.mai = "ok"
                    }
                    if (tacheDuree[5] == 1) {
                      planingt.juin = "ok"
                    }
                    if (tacheDuree[6] == 1) {
                      planingt.juillet = "ok"
                    }
                    if (tacheDuree[7] == 1) {
                      planingt.aout = "ok"
                    }
                    if (tacheDuree[8] == 1) {
                      planingt.septembre = "ok"
                    }
                    if (tacheDuree[9] == 1) {
                      planingt.octobre = "ok"
                    }
                    if (tacheDuree[10] == 1) {
                      planingt.novembre = "ok"
                    }
                    if (tacheDuree[11] == 1) {
                      planingt.decembre = "ok"
                    }
                  }

                  // programme.push({ bailleur, id: tache.id, nom: tache.nom, code: tache.code, poids, poidsActuel, isTache: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, planingt })
                })
              })
            })
          })

        })
      }
      this.fich.push(programme)
      return programme

      console.log(programme)
    },


    json_data() {
      const programme = []
      if (this.ptab != undefined && this.ptab != null) {
        this.ptab.forEach(element => {
          const bailleur = element.bailleur
          const bn = element.budgetNational
          const pret = element.pret

          let poids = ""
          let poidsActuel = ''

          let t1Pret = ''
          let t1Bn = ''
          let t2Pret = ''
          let t2Bn = ''
          let t3Pret = ''
          let t3Bn = ''
          let t4Bn = ''
          let t4Pret = ''
          let tBn = ''
          let tPret = ''
          let total = ''
          let structureResponsable = ''
          let structureAssocie = ''

          programme.push({ bailleur, nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
          element.composantes.forEach(composante => {
            const bn = composante.budgetNational
            const pret = composante.pret
            let poids = composante.poids
            let poidsActuel = composante.poidsActuel
            let t1Bn = ''
            let t1Pret = ''
            let t2Bn = ''
            let t2Pret = ''
            let t3Bn = ''
            let t3Pret = ''
            let t4Bn = ''
            let t4Pret = ''
            let tBn = ''
            let tPret = ''
            let total = ''
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret
              t1Bn = composante.trimestre1.budgetNational
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret
              t2Bn = composante.trimestre2.budgetNational
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret
              t3Bn = composante.trimestre3.budgetNational
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret
              t4Bn = composante.trimestre4.budgetNational
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn
            tPret = t1Pret + t2Pret + t3Pret + t4Pret
            total = tBn + tPret
            let structureResponsable = ''
            let structureAssocie = ''
            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
            composante.sousComposantes.forEach(sousComposante => {
              const bn = sousComposante.budgetNational
              const pret = sousComposante.pret
              let poids = sousComposante.poids
              let poidsActuel = sousComposante.poidsActuel
              let t1Bn = ''
              let t1Pret = ''
              let t2Bn = ''
              let t2Pret = ''
              let t3Bn = ''
              let t3Pret = ''
              let t4Bn = ''
              let t4Pret = ''
              let tBn = ''
              let tPret = ''
              let total = ''
              let nom = "PAS DE SOUS COMPOSANTE"
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1
                t1Bn = sousComposante.trimestre1.budgetNational * 1

              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1
                t2Bn = sousComposante.trimestre2.budgetNational * 1
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1
                t3Bn = sousComposante.trimestre3.budgetNational * 1
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1
                t4Bn = sousComposante.trimestre4.budgetNational * 1
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn
              tPret = t1Pret + t2Pret + t3Pret + t4Pret
              total = tBn + tPret
              let structureResponsable = ''
              let structureAssocie = ''
              if (nom !== 'PAS DE SOUS COMPOSANTE') {
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
              }
              sousComposante.activites.forEach(activite => {
                const bn = activite.budgetNational
                const pret = activite.pret
                let poids = activite.poids
                let poidsActuel = activite.poidsActuel
                let structureResponsable = activite.structureResponsable
                let structureAssocie = activite.structureAssocie
                let t1Bn = ''
                let t1Pret = ''
                let t2Bn = ''
                let t2Pret = ''
                let t3Bn = ''
                let t3Pret = ''
                let t4Bn = ''
                let t4Pret = ''
                let tBn = ''
                let tPret = ''
                let total = ''
                const planing = {
                  janvier: '',
                  fevrier: '',
                  mars: '',
                  avril: '',
                  mai: '',
                  juin: '',
                  juillet: '',
                  aout: '',
                  septembre: '',
                  octobre: '',
                  novembre: '',
                  decembre: ''
                }
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret
                  t1Bn = activite.trimestre1.budgetNational
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret
                  t2Bn = activite.trimestre2.budgetNational
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret
                  t3Bn = activite.trimestre3.budgetNational
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret
                  t4Bn = activite.trimestre4.budgetNational
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn
                tPret = t1Pret + t2Pret + t3Pret + t4Pret
                total = tBn + tPret

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok"
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok"
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok"
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok"
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok"
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok"
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok"
                  }
                  if (activiteDuree[7] == 6) {
                    planing.aout = "ok"
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok"
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok"
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok"
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok"
                  }
                }

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
                activite.taches.forEach(tache => {
                  let poids = tache.poids
                  let poidsActuel = tache.poidsActuel
                  let tBn = ''
                  let tPret = ''
                  let total = ''
                  let structureResponsable = ''
                  let structureAssocie = ''

                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing })
                })
              })
            })
          })

        })
      }
      return programme
    },
    json_dataR() {
      const programme = []
      if (this.ptabR != undefined && this.ptabR != null) {
        this.ptabR.forEach(element => {
          const bailleur = element.bailleur
          const bn = element.budgetNational
          const pret = element.pret
          let poids = ""
          let poidsActuel = ''

          let t1Pret = ''
          let t1Bn = ''
          let t2Pret = ''
          let t2Bn = ''
          let t3Pret = ''
          let t3Bn = ''
          let t4Bn = ''
          let t4Pret = ''
          let tBn = ''
          let tPret = ''
          let total = ''
          let structureResponsable = ''
          let structureAssocie = ''

          programme.push({ bailleur, nom: element.nom, code: element.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
          element.composantes.forEach(composante => {
            const bn = composante.budgetNational
            const pret = composante.pret
            let poids = composante.poids
            let poidsActuel = composante.poidsActuel
            let t1Bn = 0
            let t1Pret = 0
            let t2Bn = 0
            let t2Pret = 0
            let t3Bn = 0
            let t3Pret = 0
            let t4Bn = 0
            let t4Pret = 0
            let tBn = 0
            let tPret = 0
            let total = 0
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret
              t1Bn = composante.trimestre1.budgetNational
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret
              t2Bn = composante.trimestre2.budgetNational
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret
              t3Bn = composante.trimestre3.budgetNational
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret
              t4Bn = composante.trimestre4.budgetNational
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn
            tPret = t1Pret + t2Pret + t3Pret + t4Pret
            total = tBn + tPret
            let structureResponsable = ''
            let structureAssocie = ''
            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
            composante.sousComposantes.forEach(sousComposante => {
              const bn = sousComposante.budgetNational
              const pret = sousComposante.pret
              let poids = sousComposante.poids
              let poidsActuel = sousComposante.poidsActuel
              let t1Bn = 0
              let t1Pret = 0
              let t2Bn = 0
              let t2Pret = 0
              let t3Bn = 0
              let t3Pret = 0
              let t4Bn = 0
              let t4Pret = 0
              let tBn = 0
              let tPret = 0
              let total = 0
              let nom = "PAS DE SOUS COMPOSANTE"
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1
                t1Bn = sousComposante.trimestre1.budgetNational * 1

              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1
                t2Bn = sousComposante.trimestre2.budgetNational * 1
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1
                t3Bn = sousComposante.trimestre3.budgetNational * 1
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1
                t4Bn = sousComposante.trimestre4.budgetNational * 1
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn
              tPret = t1Pret + t2Pret + t3Pret + t4Pret
              total = tBn + tPret
              let structureResponsable = ''
              let structureAssocie = ''
              if (nom !== 'PAS DE SOUS COMPOSANTE') {
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
              }
              sousComposante.activites.forEach(activite => {
                const bn = activite.budgetNational
                const pret = activite.pret
                let poids = activite.poids
                let poidsActuel = activite.poidsActuel
                let structureResponsable = activite.structureResponsable
                let structureAssocie = activite.structureAssocie
                let t1Bn = 0
                let t1Pret = 0
                let t2Bn = 0
                let t2Pret = 0
                let t3Bn = 0
                let t3Pret = 0
                let t4Bn = 0
                let t4Pret = 0
                let tBn = 0
                let tPret = 0
                let total = 0
                const planing = {
                  janvier: '',
                  fevrier: '',
                  mars: '',
                  avril: '',
                  mai: '',
                  juin: '',
                  juillet: '',
                  aout: '',
                  septembre: '',
                  octobre: '',
                  novembre: '',
                  decembre: ''
                }
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret
                  t1Bn = activite.trimestre1.budgetNational
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret
                  t2Bn = activite.trimestre2.budgetNational
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret
                  t3Bn = activite.trimestre3.budgetNational
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret
                  t4Bn = activite.trimestre4.budgetNational
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn
                tPret = t1Pret + t2Pret + t3Pret + t4Pret
                total = tBn + tPret

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok"
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok"
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok"
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok"
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok"
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok"
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok"
                  }
                  if (activiteDuree[7] == 1) {
                    planing.aout = "ok"
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok"
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok"
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok"
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok"
                  }
                }

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, })
                activite.taches.forEach(tache => {
                  let poids = tache.poids
                  let poidsActuel = tache.poidsActuel
                  let tBn = ''
                  let tPret = ''
                  let total = ''
                  let structureResponsable = ''
                  let structureAssocie = ''

                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing })
                })
              })
            })
          })

        })
      }
      return programme
    },

    dataNewR() {
      const programme = []
      if (this.ptabR != undefined && this.ptabR != null) {
        this.ptabR.forEach(element => {
          const bailleur = element.bailleur
          const bn = element.budgetNational
          const pret = element.pret

          programme.push({ bailleur, nom: element.nom, code: element.code, isProjet: true, bn, pret })
          element.composantes.forEach(composante => {
            const bn = composante.budgetNational
            const pret = composante.pret
            let poids = composante.poids
            let poidsActuel = composante.poidsActuel
            let t1Bn = 0
            let t1Pret = 0
            let t2Bn = 0
            let t2Pret = 0
            let t3Bn = 0
            let t3Pret = 0
            let t4Bn = 0
            let t4Pret = 0
            let tBn = 0
            let tPret = 0
            let total = 0
            if (composante.trimestre1 != undefined) {
              t1Pret = composante.trimestre1.pret
              t1Bn = composante.trimestre1.budgetNational
            }
            if (composante.trimestre2 != undefined) {
              t2Pret = composante.trimestre2.pret
              t2Bn = composante.trimestre2.budgetNational
            }
            if (composante.trimestre3 != undefined) {
              t3Pret = composante.trimestre3.pret
              t3Bn = composante.trimestre3.budgetNational
            }
            if (composante.trimestre4 != undefined) {
              t4Pret = composante.trimestre4.pret
              t4Bn = composante.trimestre4.budgetNational
            }
            tBn = t1Bn + t2Bn + t3Bn + t4Bn
            tPret = t1Pret + t2Pret + t3Pret + t4Pret
            total = tBn + tPret

            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids, poidsActuel, isComposante: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total })
            composante.sousComposantes.forEach(sousComposante => {
              const bn = sousComposante.budgetNational
              const pret = sousComposante.pret
              let poids = sousComposante.poids
              let poidsActuel = sousComposante.poidsActuel
              let t1Bn = 0
              let t1Pret = 0
              let t2Bn = 0
              let t2Pret = 0
              let t3Bn = 0
              let t3Pret = 0
              let t4Bn = 0
              let t4Pret = 0
              let tBn = 0
              let tPret = 0
              let total = 0
              let nom = "PAS DE SOUS COMPOSANTE"
              if (sousComposante.nom != 0) {
                nom = sousComposante.nom
              }
              if (sousComposante.trimestre1 != undefined && sousComposante.trimestre1 != 0) {
                t1Pret = sousComposante.trimestre1.pret * 1
                t1Bn = sousComposante.trimestre1.budgetNational * 1

              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0) {
                t2Pret = sousComposante.trimestre2.pret * 1
                t2Bn = sousComposante.trimestre2.budgetNational * 1
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1
                t3Bn = sousComposante.trimestre3.budgetNational * 1
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret * 1
                t4Bn = sousComposante.trimestre4.budgetNational * 1
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn
              tPret = t1Pret + t2Pret + t3Pret + t4Pret
              total = tBn + tPret
              if (nom !== 'PAS DE SOUS COMPOSANTE') {
                programme.push({ bailleur, nom, code: sousComposante.code, poids, poidsActuel, isSC: true, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total })
              }

              sousComposante.activites.forEach(activite => {
                const bn = activite.budgetNational
                const pret = activite.pret
                let poids = activite.poids
                let poidsActuel = activite.poidsActuel
                let structureResponsable = activite.structureResponsable
                let structureAssocie = activite.structureAssocie
                let t1Bn = 0
                let t1Pret = 0
                let t2Bn = 0
                let t2Pret = 0
                let t3Bn = 0
                let t3Pret = 0
                let t4Bn = 0
                let t4Pret = 0
                let tBn = 0
                let tPret = 0
                let total = 0
                const planing = {
                  janvier: '',
                  fevrier: '',
                  mars: '',
                  avril: '',
                  mai: '',
                  juin: '',
                  juillet: '',
                  aout: '',
                  septembre: '',
                  octobre: '',
                  novembre: '',
                  decembre: ''
                }
                if (activite.trimestre1 != undefined) {
                  t1Pret = activite.trimestre1.pret
                  t1Bn = activite.trimestre1.budgetNational
                }
                if (activite.trimestre2 != undefined) {
                  t2Pret = activite.trimestre2.pret
                  t2Bn = activite.trimestre2.budgetNational
                }
                if (activite.trimestre3 != undefined) {
                  t3Pret = activite.trimestre3.pret
                  t3Bn = activite.trimestre3.budgetNational
                }
                if (activite.trimestre4 != undefined) {
                  t4Pret = activite.trimestre4.pret
                  t4Bn = activite.trimestre4.budgetNational
                }
                tBn = t1Bn + t2Bn + t3Bn + t4Bn
                tPret = t1Pret + t2Pret + t3Pret + t4Pret
                total = tBn + tPret

                //extraire les activiteDuree[] des dates et le mettre dans un tableau
                const activiteDuree = activite.durees
                if (activiteDuree != undefined || activiteDuree != null) {
                  if (activiteDuree[0] == 1) {
                    planing.janvier = "ok"
                  }
                  if (activiteDuree[1] == 1) {
                    planing.fevrier = "ok"
                  }
                  if (activiteDuree[2] == 1) {
                    planing.mars = "ok"
                  }
                  if (activiteDuree[3] == 1) {
                    planing.avril = "ok"
                  }
                  if (activiteDuree[4] == 1) {
                    planing.mai = "ok"
                  }
                  if (activiteDuree[5] == 1) {
                    planing.juin = "ok"
                  }
                  if (activiteDuree[6] == 1) {
                    planing.juillet = "ok"
                  }
                  if (activiteDuree[7] == 1) {
                    planing.aout = "ok"
                  }
                  if (activiteDuree[8] == 1) {
                    planing.septembre = "ok"
                  }
                  if (activiteDuree[9] == 1) {
                    planing.octobre = "ok"
                  }
                  if (activiteDuree[10] == 1) {
                    planing.novembre = "ok"
                  }
                  if (activiteDuree[11] == 1) {
                    planing.decembre = "ok"
                  }
                }

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids, poidsActuel, isActivite: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing })
                activite.taches.forEach(tache => {
                  let poids = tache.poids
                  let poidsActuel = tache.poidsActuel
                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids, poidsActuel, isTache: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret })
                })
              })
            })
          })

        })
      }
      return programme
    },
    title_pdf() {
      if (this.annee == null) {
        const year = new Date().getFullYear()
        return "pta reviser -" + year
      } else {
        return "pta reviser -" + this.annee
      }
    },
    title_excel() {
      if (this.annee == null) {
        const year = new Date().getFullYear()
        return "pta reviser -" + year
      } else {
        return "pta reviser -" + this.annee
      }
    },

    title_pdfReviser() {
      if (this.annee == null) {
        const year = new Date().getFullYear()
        return "pta " + this.version.nom + "-" + year
      } else {
        return "pta " + + this.version.nom + "-" + this.annee
      }
    },
    title_Reviser_excel() {
      if (this.annee == null) {
        const year = new Date().getFullYear()
        return "pta " + this.version.nom + "-" + year
      } else {
        return "pta " + + this.version.nom + "-" + this.annee
      }
    },
  },
  methods: {
    saveSuiviOld(id, data) {
      this.chargement = true
      var form = {
        tacheId: id
      }
      TacheService.suiviTache(form).then((data) => {
        // this.doSuiviOld = false
        //this.$toast.success('Operation éffectué avec succès')
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
    }
    ,
    togglesuivie(id) {

      // this.redtoggle = true;
      //  this.graytoggle =false;
      //  this.translatetoggle =true;


      this.chargement = true
      var form = {
        tacheId: id
      }
      console.log(id)
      TacheService.suiviTache(form).then((data) => {

        // this.doSuiviOld = false
        // this.dataNew;
        this.$toast.success('Operation éffectué avec succès')
        // window.location.reload();
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
    exportToExcel() {
      console.log('gghghghgh');
      console.log(this.dataNew);


      const tableDataWithColors = this.dataNew.map(row => {
        return {
          ...row,
          bailleur: 'bg-red-500'
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(tableDataWithColors);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tableau de données');
      XLSX.writeFile(workbook, 'tableau.xlsx');

    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
    ...mapActions("revisionPtab", {
      fetchProgrammeScopes: "FETCH_PROGRAMME_SCOPES"
    }),
    chargement(bool) {
      this.$store.dispatch('SET_LOADER', bool)
    },
    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'exporter-un-suivi-ppm') {
          this.exporterSuiviPpm = true
        }
        if (element.slug === 'exporter-un-suivi-ptab') {
          this.exporterSuiviPta = true
        }
        if (element.slug === 'exporter-un-suivi-ppm') {
          this.exporterSuiviRePpm = true
        }
        if (element.slug === 'exporter-un-suivi-pta') {
          this.exporterSuiviRePta = true
        }
        if (element.slug === 'voir-le-plan-de-decaissement-du-ptab') {
          this.planDecaissementPtaVisible = true
        }
        if (element.slug === 'exporter-un-suivi-financier') {
          this.exporterSuiviFinance = true
        }
        if (element.slug === 'voir-ptab') {
          this.ptaVisible = true
        }
        if (element.slug === 'voir-ppm') {
          this.ppmVisible = true
        }
        if (element.slug === 'voir-revision-ptab') {
          this.revisionVisible = true
        }
        if (element.slug === 'voir-ptab') {
          this.filtrePta = true
        }
        if (element.slug === 'voir-ppm') {
          this.filtrePpm = true
        }
        if (element.slug === 'voir-ptab') {
          this.filtreRePta = true
        }
        if (element.slug === 'voir-ppm') {
          this.filtreRePpm = true
        }


      });

    },

    customLabel({ sigle }) {
      return ` ${sigle}`
    },
    choiceVersion(version) {
      if (this.scopes.length > 0) {
        if ("actuelle" === version) {
          this.currentPage = true;
        } else {
          this.currentPage = false;
          this.getPtaRevise()
        }
      } else {
        this.currentPage = true;
      }
    },
    getPta() {
      let data = {}
      if (this.annee == null) {
        const year = new Date().getFullYear()
        data = {

          programmeId: this.currentUser.programme.id,
          annee: year
        }
      } else {
        data = {

          programmeId: this.currentUser.programme.id,
          annee: Number(annee)
        }
      }
      this.active()
      PtabService.getPta(data).then((data) => {
        this.ptab = data.data.data
        this.disabled()
      }).catch((e) => {
        this.$toast.error(e)
        this.disabled()
      })
    },
    getPtaRevise() {
      let data = {}
      if (this.annee == null) {
        const year = new Date().getFullYear()
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: year
        }
      } else {
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: Number(annee)
        }
      }
      this.active()
      PtabService.getReviser(data).then((data) => {
        this.ptabR = data.data.data
        this.disabled()
      }).catch((e) => {
        this.$toast.error(e)
        this.disabled()
      })
    },
    getPtaReviseFiltre() {
      let data = {}
      if (this.annee == null) {
        const year = new Date().getFullYear()
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: year
        }
      } else {
        data = {
          ptabScopeId: this.version.id,
          programmeId: this.currentUser.programme.id,
          annee: Number(this.annee)
        }
      }
      this.active()
      PtabService.getReviser(data).then((data) => {
        this.ptabR = data.data.data
        this.disabled()
      }).catch((e) => {
        this.$toast.error(e)
        this.disabled()
      })
    },
    getPtaFiltre() {
      let data = {}
      this.chargement(true)
      if (this.ppm == null) {

        if (this.bailleur == null) {
          data = {
            programmeId: this.currentUser.programme.id,
            annee: Number(this.annee)
          }
        } else {
          data = {
            bailleurId: this.bailleur.id,
            programmeId: this.currentUser.programme.id,
            annee: Number(this.annee)
          }
        }

      } else {
        data = {
          bailleurId: this.bailleur.id,
          programmeId: this.currentUser.programme.id,
          annee: Number(this.annee),
          ppm: this.ppm
        }
      }
      this.active()
      PtabService.getFiltre(data).then((data) => {
        this.ptab = data.data.data
        this.openFiltre = false
        this.chargement(false)
        this.disabled()
      }).catch((e) => {
        this.chargement(false)
        this.$toast.error(e)
        this.disabled()

      })
    },

    getBailleur() {
      BailleursService.get().then((data) => {
        this.bailleurs = data.data.data
      }).catch((e) => {
        this.$toast.error(e)
      })
    },
  },
  mounted() {
    this.getPermission()

    if (this.revisionVisible || this.ppmVisible || this.ptaVisible) {
      this.getPta()
      this.getBailleur()
      this.fetchProgrammeScopes(this.currentUser.programme.id).then((response) => {
        this.scopes = response.data.data
      });
    }


  }
}
</script>

<style ></style>
