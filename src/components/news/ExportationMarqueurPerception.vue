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
    datas: {
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
      const headerRow = worksheet.addRow(["", "Indice factuel de gouvernance"]);
      headerRow.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: getColorForExcel(this.datas.indice_de_gouvernance) },
        };
      });

      // Ajout des données pour chaque principe
      this.datas.synthese.forEach((principe) => {
        const rowPrincipe = worksheet.addRow(["", principe.nom]);
        rowPrincipe.getCell(2).alignment = { vertical: "middle" };
        rowPrincipe.getCell(2).font = { bold: true };

        rowPrincipe.getCell(2).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: getColorForExcel(principe.moyenne_ponderee) },
        };
        // Ajout des autres questions du principe avec colorisation de la colonne "Score"
        principe.questions_de_gouvernance.forEach((question) => {
          const row = worksheet.addRow(["QP", question.nom]);
          row.getCell(1).alignment = { vertical: "middle" };

          row.getCell(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: getColorForExcel(question.moyenne_ponderee) },
          };
          row.getCell(2).alignment = { vertical: "middle" };

          row.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: getColorForExcel(question.moyenne_ponderee) },
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const date = new Date().getTime();
      saveAs(new Blob([buffer]), `MARQUEUR_PERCEPTION_${date}.xlsx`);
    },
  },
};
</script>
