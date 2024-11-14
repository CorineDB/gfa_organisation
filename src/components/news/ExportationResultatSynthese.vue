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

    async generateExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("SYNTHESE_FACTUEL");

      // Table 1: Organization Info
      worksheet.addRow(["Structure", this.org]);
      worksheet.addRow(["Nom et prénom point focal", this.pointfocal]);
      worksheet.addRow(["Date d'auto-évaluation", this.dateevaluation]);
      worksheet.addRow([]); // Blank row for spacing
      worksheet.addRow([]); // Blank row for spacing

      //Table 2  Indice de Gouvernance
      const headerIndice = worksheet.addRow(["Principe", "Indice Factuel", "Indice de perception", "Indice synthétique"]);
      headerIndice.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      this.datas.forEach((principe) => {
        const rowPrincipe = worksheet.addRow([principe.nom, principe.indice_factuel ?? "", principe.indice_de_perception ?? "", principe.indice_synthetique ?? ""]);

        rowPrincipe.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: getColorForExcel(principe?.indice_factuel) } };
        rowPrincipe.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: getColorForExcel(principe?.indice_de_perception) } };
        rowPrincipe.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: getColorForExcel(principe?.indice_synthetique) } };

        rowPrincipe.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
      worksheet.addRow([]); // Blank row for spacing
      worksheet.addRow([]); // Blank row for spacing

      // Ajustement automatique de la largeur des colonnes
      worksheet.columns.forEach((column) => {
        column.width = 30;
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const date = new Date().getTime();
      saveAs(new Blob([buffer]), `RESULTATS_SYNTHETIQUE_${date}.xlsx`);
    },
  },
};
</script>
