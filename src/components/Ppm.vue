<template>
</template>

<script>

import PtabService from "@/services/modules/pta.service.js";
import BailleursService from "@/services/modules/bailleur.service.js";

import { mapGetters, mapMutations, mapActions,mapState } from "vuex";
export default {

  component:{},
  data() {
    return {
      ptab:[],   
      openFiltre:false,
      annee:null,
      bailleur:'',
      bailleurs:[],
      revisionAdd:false,
      revisionVisible:false,
      ptaVisible:false,
      filtrePta:false,
      filtrePpm:false,
      filtreRePta:false,
      filtreRePpm:false,
      planDecaissementPtaVisible:false,
      ppmVisible:false,
      exporterSuiviPpm:false,
      exporterSuiviPta:false,
      exporterSuiviRePpm:false,
      exporterSuiviRePta:false,
    }
  },
  computed: {
   ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'}),
       ...mapState({
      loading : state => state.loading
    }),
    title_pdf() {
        if(this.annee ==null) {
        const year = new Date().getFullYear() 
          return "ppm -" + year
        }else {
          return "pmp -" + this.annee
        }
    },
    title_excel() {
        if(this.annee ==null) {
        const year = new Date().getFullYear() 
          return "ppm -" + year
        }else {
          return "pmp -" + this.annee
        }
    },
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

            programme.push({ bailleur, nom: composante.nom, code: composante.code, poids,poidsActuel, isComposante: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total })
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
                t1Bn = sousComposante.trimestre1.budgetNational *1
               
              }
              if (sousComposante.trimestre2 != undefined && sousComposante.trimestre2 != 0 ) {
                t2Pret = sousComposante.trimestre2.pret * 1
                t2Bn = sousComposante.trimestre2.budgetNational * 1
              }
              if (sousComposante.trimestre3 != undefined && sousComposante.trimestre3 != 0) {
                t3Pret = sousComposante.trimestre3.pret * 1
                t3Bn = sousComposante.trimestre3.budgetNational *1
              }
              if (sousComposante.trimestre4 != undefined && sousComposante.trimestre4 != 0) {
                t4Pret = sousComposante.trimestre4.pret *1
                t4Bn = sousComposante.trimestre4.budgetNational *1
              }

              tBn = t1Bn + t2Bn + t3Bn + t4Bn
              tPret = t1Pret + t2Pret + t3Pret + t4Pret
              total = tBn + tPret
              if(nom !== 'PAS DE SOUS COMPOSANTE') {
                programme.push({ bailleur, nom, code: sousComposante.code, poids,poidsActuel, isSC: true, bn, pret, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total })
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

                programme.push({ bailleur, nom: activite.nom, code: activite.code, poids,poidsActuel, isActivite: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret, tBn, tPret, total, structureResponsable, structureAssocie, planing })
                activite.taches.forEach(tache => {
                  let poids = tache.poids
                  let poidsActuel = tache.poidsActuel
                  programme.push({ bailleur, nom: tache.nom, code: tache.code, poids,poidsActuel, isTache: true, bn, pret, t1Pret, t1Bn, t2Pret, t2Bn, t3Pret, t3Bn, t4Bn, t4Pret })
                })
              })
            })
          })

        })
      }
      return programme
    },
  },
  methods:{
        generateReport () {
      this.$refs.html2Pdf.generatePdf()
    },
    chargement(bool) {
      this.$store.dispatch('SET_LOADER',bool)
    },
    customLabel ({  sigle }) {
      return ` ${sigle}`
    },

    active() {
      this.$store.dispatch('active')
    },
    disabled() {
      this.$store.dispatch('disabled')
    },
    
     getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if(element.slug ==='exporter-un-suivi-ppm') {
          this.exporterSuiviPpm = true
        }
       if(element.slug === 'exporter-un-suivi-ptab') {
        this.exporterSuiviPta = true
      }
      if(element.slug === 'exporter-un-suivi-ppm') {
        this.exporterSuiviRePpm = true
      }
      if(element.slug ==='exporter-un-suivi-pta') {
        this.exporterSuiviRePta = true
      }
      if(element.slug ==='voir-le-plan-de-decaissement-du-ptab') {
        this.planDecaissementPtaVisible= true
      }
      if(element.slug ==='exporter-un-suivi-financier') {
        this.exporterSuiviFinance = true
      }
      if(element.slug ==='voir-ptab') {
        this.ptaVisible = true
      }
      if(element.slug ==='voir-ppm') {
        this.ppmVisible = true
      }
      if(element.slug ==='voir-revision-ptab') {
        this.revisionVisible = true
      }
      if(element.slug ==='voir-ptab') {
        this.filtrePta = true
      }
      if(element.slug ==='voir-ppm') {
        this.filtrePpm = true
      }
      if(element.slug ==='voir-ptab') {
        this.filtreRePta = true
      }
      if(element.slug ==='voir-ppm') {
        this.filtreRePpm = true
      }

           
    });

    },


    getPtaFiltre() {
    
      this.chargement(true)
      let data = {}
      if(this.bailleur ==null) {
        data={
          programmeId:this.currentUser.programme.id,
          annee:Number(this.annee),
          ppm: 2
        }
      }
      else {
        data={
          bailleurId:this.bailleur.id,
          programmeId:this.currentUser.programme.id,
          annee:Number(this.annee),
          ppm: 2
        }
      }
        
        this.active()
        PtabService.getFiltre(data).then((data) => {
         this.ptab =  data.data.data
         this.openFiltre = false
          this.chargement(false)
          this.disabled()
        }).catch((e) => {
          this.chargement(false)
          this.disabled()
          this.$toast.error(e)
        })
    },
    getPpm() {
         const  data={
          programmeId:this.currentUser.programme.id,
          annee:new Date().getFullYear() ,
          ppm: 2
        }
        this.active()
        PtabService.getFiltre(data).then((data) => {
         this.ptab =  data.data.data
         this.disabled()
        }).catch((e) => {
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
    this.getPpm()
    this.getPermission()
    this.getBailleur()
  }
}
</script>

<style>

</style>