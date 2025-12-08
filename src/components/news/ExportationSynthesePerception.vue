<template>
  <div>
    <button class="btn btn-outline-secondary" @click="generateExcel"><FileTextIcon class="w-4 h-4 mr-2" />Exporter Excel</button>
  </div>
</template>

<script>
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getColorForExcel } from "../../utils/findColorIndicator";

export default {
  props: {
    currentPerception: {
      type: Object,
      required: true,
      default: {},
    },

    pointfocal: {
      type: String,
      required: false,
      default: "",
    },
    org: {
      type: String,
      required: false,
      default: "",
    },
    dateevaluation: {
      type: String,
      required: false,
      default: "",
    },
  },

  methods: {
    async generateExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Perception Gouvernance");

      // Table 1: Organization Info
      worksheet.addRow(["Structure", this.org]).font = { bold: true };
      worksheet.addRow(["Nom et prénom point focal", this.pointfocal]);
      worksheet.addRow(["Date d'auto-évaluation", this.dateevaluation]);
      worksheet.addRow([]); // Blank row for spacing
      worksheet.addRow([]); // Blank row for spacing

      // En-tête pour l'indice de gouvernance
      const headerRow = worksheet.addRow(["Indice de perception de gouvernance", "", this.currentPerception.indice_de_gouvernance]);
      headerRow.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: getColorForExcel(this.currentPerception.indice_de_gouvernance) },
        };
      });
      // worksheet.mergeCells("A1:B1");

      // Deuxième ligne d'en-tête
      const header2 = worksheet.addRow(["Principes", "Questions opérationnelles", "Score"]);
      header2.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Ajout des données pour chaque principe
      this.currentPerception.synthese.forEach((principe) => {
        const startRow = worksheet.lastRow.number + 1;
        const principleColor = getColorForExcel(principe.indice_de_perception);
        
        // Première ligne avec le nom du principe et la première question
        let row = worksheet.addRow([principe.nom, principe.questions_de_gouvernance[0].nom, principe.questions_de_gouvernance[0].moyenne_ponderee]);

        // Style pour le nom du principe (colonne 1)
        row.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: principleColor },
        };
        row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
        row.getCell(1).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Style pour la question (colonne 2) - hérite de la couleur du principe
        row.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: principleColor },
        };
        row.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
        row.getCell(2).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Style pour le score (colonne 3) - hérite de la couleur du principe
        row.getCell(3).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: principleColor },
        };
        row.getCell(3).alignment = { vertical: "middle", horizontal: "center" };
        row.getCell(3).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Ajout des autres questions du principe
        principe.questions_de_gouvernance.slice(1).forEach((question) => {
          row = worksheet.addRow(["", question.nom, question.moyenne_ponderee]);
          
          // La couleur de la ligne dépend de la moyenne de la question (comme dans le HTML ligne 22)
          const questionColor = getColorForExcel(question.moyenne_ponderee);
          
          // Colonne 1 (vide) - garde la couleur du principe via la fusion
          
          // Colonne 2 (question) - utilise la couleur de la question
          row.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: questionColor },
          };
          row.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
          row.getCell(2).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          // Colonne 3 (score) - utilise la couleur de la question
          row.getCell(3).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: questionColor },
          };
          row.getCell(3).alignment = { vertical: "middle", horizontal: "center" };
          row.getCell(3).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Fusionner les cellules pour le nom du principe
        worksheet.mergeCells(`A${startRow}:A${worksheet.lastRow.number}`);

        // Ligne "Indice de perception du principe" pour chaque principe
        row = worksheet.addRow(["", "Indice de perception du principe", principe.indice_de_perception]);
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: principleColor },
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Ajustement automatique de la largeur des colonnes
      worksheet.columns.forEach((column) => {
        column.width = 50;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const date = new Date().getTime();
      saveAs(new Blob([buffer]), `SYNTHESSE_PERCEPTION_${date}.xlsx`);
    },
  },
};
</script>
