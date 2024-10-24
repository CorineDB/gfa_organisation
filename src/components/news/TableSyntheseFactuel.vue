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
    datas: { type: Array, required: true },
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

      worksheet.columns = [
        { header: "", key: "principes", width: 20, style: { alignment: { horizontal: "center" } } },
        { header: "", key: "criteres", width: 25, style: { alignment: { horizontal: "center" } } },
        { header: "", key: "indicateurs", width: 100 },
        { header: "", key: "reponses", width: 15 },
        { header: "", key: "note", width: 10, style: { alignment: { horizontal: "center" } } },
        { header: "", key: "source", width: 30 },
      ];

      const headerRow = worksheet.addRow(["Principes", "Critères", "Indicateurs", "Réponses", "Note", "Source de validation"]);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1D3882" },
        };
        cell.font = {
          color: { argb: "FFFFFFFF" },
          bold: true,
        };
        this.applyBorders(cell);
      });

      this.datas.forEach((gouvernance) => {
        const gouvernanceRow = worksheet.addRow([gouvernance.nom, "", "", "", gouvernance.indice_factuel, ""]);
        const gouvernanceColor = getColorForExcel(gouvernance.indice_factuel);

        gouvernanceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber < 6) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: gouvernanceColor },
            };
          }
          this.applyBorders(cell);
        });

        gouvernance.principes_de_gouvernance.forEach((principe) => {
          let principeDisplayed = false;

          const principleColor = getColorForExcel(principe.score_factuel);

          principe.criteres_de_gouvernance.forEach((critere) => {
            let critereDisplayed = false;

            critere.indicateurs_de_gouvernance.forEach((indicateur) => {
              const row = worksheet.addRow([principeDisplayed ? "" : principe.nom, critereDisplayed ? "" : critere.nom, indicateur.nom, indicateur.option_de_reponse, indicateur.note, indicateur.source]);

              row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: principleColor } };
              row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: principleColor } };

              const indicatorColor = getColorForExcel(indicateur.note);
              row.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: indicatorColor } };
              row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: indicatorColor } };
              row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: indicatorColor } };

              row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber === 1) {
                  cell.border = { right: { style: "thin" } };
                } else if (colNumber === 2) {
                  cell.border = { left: { style: "thin" }, right: { style: "thin" } };
                } else {
                  this.applyBorders(cell);
                }
              });

              principeDisplayed = true;
              critereDisplayed = true;
            });

            const criteriaRow = worksheet.lastRow;
            criteriaRow.getCell(2).border = { bottom: { style: "thin" } };
          });

          const scoreRow = worksheet.addRow(["", "", "", "Score Factuel", principe.score_factuel, ""]);

          // Appliquer la couleur et les bordures
          scoreRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber === 1 || colNumber === 2) {
              // Coloration des colonnes Principes et Critères
              const color = principleColor;
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: color },
              };
              // Appliquer des bordures à toutes les cellules
              this.applyBorders(cell);
            } else if (colNumber !== 6) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: principleColor },
              };
              this.applyBorders(cell); // Appliquer des bordures uniquement ici
            }
          });

          // Appliquer des bordures à la source
          scoreRow.getCell(6).border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };

          // Appliquer bordures à droite pour la colonne score factuel
          scoreRow.getCell(4).border = { right: { style: "thin" } };
          const lastRow = worksheet.lastRow;
          lastRow.getCell(1).border = { right: { style: "thin" } };
          lastRow.getCell(4).border = { right: { style: "thin" } };
          lastRow.getCell(5).border = { right: { style: "thin" } };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const date = new Date().getTime();
      saveAs(new Blob([buffer]), `SYNTHESSE_FACTUEL_${date}.xlsx`);
    },
  },
};
</script>
