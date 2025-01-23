<template>
  <div>
    <button class="btn btn-outline-primary" @click="generateExcelTable"><FileTextIcon class="w-4 h-4 mr-2" />Exporter Excel</button>
  </div>
</template>

<script>
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getColorForExcel } from "../../utils/findColorIndicator";

export default {
  props: {
    datas: {
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
        { width: 50 }, // Indicateurs
        { width: 30 }, // Auteur
        { width: 15 }, // Trimestre
        { width: 15 }, // Cumul
        ...this.years.map(() => ({ width: 15 })), // Cibles années
        { width: 15 }, // Total Cibles
        ...this.years.map(() => ({ width: 15 })), // Réalisation années
        { width: 15 }, // Total Réalisation
        { width: 25 }, // Taux de réalisation
        { width: 20 }, // Date de suivie
      ];
      sheet.columns = columnWidths;

      // Ajouter les en-têtes
      const headerRow1 = ["Indicateurs", "Auteur", "Trimestre", "Cumul", ...Array(this.years.length).fill("Cibles"), "Total", ...Array(this.years.length).fill("Réalisation"), "Total", "Taux de réalisation", "Date de suivie"];
      const headerRow2 = [null, null, null, null, ...this.years, null, ...this.years, null, null, null];

      // Ajouter les lignes d'en-tête
      sheet.addRow(headerRow1);
      sheet.addRow(headerRow2);

      // Fusion des cellules pour les en-têtes complexes
      try {
        sheet.mergeCells(1, 1, 2, 1); // Indicateurs
        sheet.mergeCells(1, 2, 2, 2); // Auteur
        sheet.mergeCells(1, 3, 2, 3); // Trimestre
        sheet.mergeCells(1, 4, 2, 4); // Cumul
        sheet.mergeCells(1, 5, 1, 5 + this.years.length - 1); // Cibles
        sheet.mergeCells(
          1,
          5 + this.years.length,
          1,
          5 + 2 * this.years.length // Réalisation
        );
        sheet.mergeCells(1, 5 + 2 * this.years.length + 1, 2, 5 + 2 * this.years.length + 1); // Taux de réalisation
        sheet.mergeCells(1, 5 + 2 * this.years.length + 2, 2, 5 + 2 * this.years.length + 2); // Date de suivie
      } catch (error) {
        console.error("Erreur de fusion des cellules :", error.message);
      }

      // Appliquer le style aux en-têtes
      const header1 = sheet.getRow(1);
      const header2 = sheet.getRow(2);
      header1.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4472C4" } };
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        Object.assign(cell, defaultStyle);
      });
      header2.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4472C4" } };
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        Object.assign(cell, defaultStyle);
      });

      // Ajouter les données dynamiques
      this.datas.forEach((indicateur) => {
        const row = [indicateur.indicateur.nom, indicateur.auteur.nom, indicateur.trimestre, indicateur.cumul.join(", "), ...(this.years.map((year) => indicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeurCible) || ""), indicateur.indicateur.valeurCibleTotal || "", ...this.years.map((year) => indicateur.indicateur.valeursCible.find((valeur) => valeur.annee === year)?.valeur_realiser || ""), indicateur.indicateur.valeurRealiserTotal || "", indicateur.indicateur.taux_realisation || "", this.formatDateOnly(indicateur.dateSuivie) || ""];
        sheet.addRow(row).eachCell((cell) => Object.assign(cell, defaultStyle));
      });

      // Sauvegarder le fichier Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "Rapport.xlsx");
    },
  },
};
</script>
