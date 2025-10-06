<template>
  <div>
    <button class="btn btn-outline-primary" @click="generateExcelTable"><FileTextIcon class="w-4 h-4 mr-2" />Exporter Excel</button>
  </div>
</template>

<script>
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default {
  props: {
    data: {
      type: Array,
      required: true,
      default: [],
    },

    years: {
      type: Array,
      required: false,
      default: [],
    },
  },
  data() {
    return {};
  },
  methods: {
    applyBorders(cell, addBottomBorder = false) {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: addBottomBorder ? { style: "thin" } : undefined,
        right: { style: "thin" },
      };
    },
    formatDateOnly(dateTimeString) {
      // Vérifie si la chaîne est valide
      if (!dateTimeString) return null;

      // Utilise split pour extraire uniquement la date
      const [date] = dateTimeString.split(" ");
      return date;
    },

    formatObject(obj) {
      if (!obj) return "";
      return Object.entries(obj)
        .map(([key, value]) => (key === "moy" ? value : `${key}: ${value}`))
        .join(",");
    },
    async generateExcelTable() {
      console.log(this.data);
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Rapport");

      // Définir les styles par défaut
      const defaultStyle = {
        font: { name: "Arial", size: 10 },
        alignment: { vertical: "middle", horizontal: "center", wrapText: true },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };

      // Définir la largeur des colonnes
      const columnWidths = [
        { width: 50 }, // Résultats escomptés
        { width: 20 }, // Indice
        { width: 50 }, // Indicateurs
        { width: 30 }, // Description de l'indicateur
        { width: 20 }, // Situation de référence
        ...this.years.map(() => ({ width: 15 })), // Cibles pour chaque année
        { width: 15 }, // Total Cibles
        ...this.years.map(() => ({ width: 15 })), // Réalisation pour chaque année
        { width: 15 }, // Total Réalisation
        { width: 20 }, // Taux de réalisation
        { width: 20 }, // Sources de données
        { width: 20 }, // Méthode de collecte
        { width: 20 }, // Fréquence
        { width: 20 }, // Responsable
      ];
      sheet.columns = columnWidths;

      // Ajouter les en-têtes
      const headerRow1 = ["Résultats escomptés", "Indice", "Indicateurs", "Description de l'indicateur", "Situation de référence", ...Array(this.years.length).fill("Cibles"), "Total", ...Array(this.years.length).fill("Réalisation"), "Total", "Taux de réalisation", "Sources de données", "Méthode de collecte", "Fréquence", "Responsable"];
      const headerRow2 = [null, null, null, null, null, ...this.years, null, ...this.years, null, null, null, null, null, null];

      // Fusionner les cellules pour les en-têtes complexes
      sheet.mergeCells(1, 1, 2, 1); // Résultats escomptés
      sheet.mergeCells(1, 2, 2, 2); // Indice
      sheet.mergeCells(1, 3, 2, 3); // Indicateurs
      sheet.mergeCells(1, 4, 2, 4); // Description
      sheet.mergeCells(1, 5, 2, 5); // Situation de référence

      const cibleStartCol = 6; // Première colonne pour "Cibles"
      const cibleEndCol = cibleStartCol + this.years.length - 1; // Dernière colonne pour "Cibles"
      sheet.mergeCells(1, cibleStartCol, 1, cibleEndCol); // Cibles

      const realisationStartCol = cibleEndCol + 2; // Première colonne pour "Réalisation"
      const realisationEndCol = realisationStartCol + this.years.length - 1; // Dernière colonne pour "Réalisation"
      sheet.mergeCells(1, realisationStartCol, 1, realisationEndCol); // Réalisation

      sheet.mergeCells(1, realisationEndCol + 1, 2, realisationEndCol + 1); // Taux de réalisation
      sheet.mergeCells(1, realisationEndCol + 2, 2, realisationEndCol + 2); // Sources de données
      sheet.mergeCells(1, realisationEndCol + 3, 2, realisationEndCol + 3); // Méthode de collecte
      sheet.mergeCells(1, realisationEndCol + 4, 2, realisationEndCol + 4); // Fréquence
      sheet.mergeCells(1, realisationEndCol + 5, 2, realisationEndCol + 5); // Responsable
      sheet.mergeCells(1, realisationEndCol + 6, 2, realisationEndCol + 6); // Actions

      // Ajouter les lignes d'en-tête
      sheet.addRow(headerRow1).font = { bold: true, color: { argb: "000000" } };
      sheet.addRow(headerRow2).font = { bold: true, color: { argb: "FFFFFF" } };

      // Appliquer un style d'arrière-plan aux lignes d'en-tête
      sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4472C4" } };
      sheet.getRow(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4472C4" } };

      // Ajouter les données dynamiques
      this.data.forEach((result, rowIndex) => {
        result.indicateurs.forEach((indicateur) => {
          const row = [
            result.nom,
            `Ind ${indicateur.indice || ""}`,
            indicateur.nom || "",
            indicateur.description || "",
            indicateur.situation_reference || "",
            ...this.years.map((year) => {
              const cible = indicateur.valeursCible.find((v) => v.annee === year)?.valeurCible || "";
              return cible;
            }),
            indicateur.totalCibles || "",
            ...this.years.map((year) => {
              const realisation = indicateur.valeursCible.find((v) => v.annee === year)?.valeur_realiser || "";
              return realisation;
            }),
            indicateur.totalRealisations || "",
            indicateur.taux_realisation || "",
            indicateur.sources_de_donnee || "",
            indicateur.methode_de_la_collecte || "",
            indicateur.frequence_de_la_collecte || "",
            indicateur.responsable || "",
          ];
          sheet.addRow(row).eachCell((cell) => Object.assign(cell, defaultStyle));
        });
      });

      // Sauvegarder le fichier Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "Rapport.xlsx");
    },
  },
};
</script>
