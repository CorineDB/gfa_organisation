// Fonction utilitaire pour convertir les couleurs
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// src/plugins/exportPdf.js

// Fonction utilitaire pour attendre le rendu complet
function waitForVueRender() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

// Fonction utilitaire pour convertir les couleurs
function hexToRgb(color) {
  if (!color) return [255, 255, 255];
  
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    return matches ? matches.map(Number) : [255, 255, 255];
  } else if (color.startsWith('#')) {
    const hex = color.substring(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [r, g, b];
  }
  return [255, 255, 255];
}

// Fonction pour extraire les styles d'un élément
function extractElementStyles(element) {
  const computedStyle = window.getComputedStyle(element);
  
  let bgColor = element.style.backgroundColor || 
                computedStyle.backgroundColor || 
                computedStyle.getPropertyValue('background-color');
  
  let textColor = element.style.color || 
                  computedStyle.color || 
                  computedStyle.getPropertyValue('color');
  
  return {
    backgroundColor: bgColor,
    textColor: textColor
  };
}

// Fonction pour extraire les données d'un tableau HTML
async function extractTableData(tableId) {
  await waitForVueRender();
  
  const table = document.getElementById(tableId);
  if (!table) {
    return null;
  }

  const headers = [];
  const rows = [];

  // Extraire les en-têtes avec styles
  const headerRows = table.querySelectorAll('thead tr');
  headerRows.forEach(row => {
    const headerRow = [];
    row.querySelectorAll('th').forEach(th => {
      const styles = extractElementStyles(th);
      
      headerRow.push({
        content: th.textContent.trim(),
        colSpan: th.colSpan || 1,
        rowSpan: th.rowSpan || 1,
        styles: {
          fillColor: styles.backgroundColor && 
                    styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                    styles.backgroundColor !== 'transparent' 
            ? hexToRgb(styles.backgroundColor) 
            : [15, 52, 96],
          textColor: styles.textColor && 
                    styles.textColor !== 'rgba(0, 0, 0, 0)' 
            ? hexToRgb(styles.textColor) 
            : [255, 255, 255]
        }
      });
    });
    headers.push(headerRow);
  });

  // Extraire les données du corps avec styles
  const bodyRows = table.querySelectorAll('tbody tr');
  bodyRows.forEach(row => {
    const rowData = [];
    const rowStyles = extractElementStyles(row);
    
    // Récupérer aussi les styles du tbody parent
    const tbodyParent = row.closest('tbody');
    const tbodyStyles = tbodyParent ? extractElementStyles(tbodyParent) : null;
    
    row.querySelectorAll('td').forEach(td => {
      const cellStyles = extractElementStyles(td);
      
      // Cascade de couleurs : cellule → ligne → tbody → blanc
      let finalBgColor = cellStyles.backgroundColor;
      
      // Si pas de couleur sur la cellule, vérifier la ligne
      if ((!finalBgColor || finalBgColor === 'rgba(0, 0, 0, 0)' || finalBgColor === 'transparent') && 
          rowStyles.backgroundColor && 
          rowStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          rowStyles.backgroundColor !== 'transparent') {
        finalBgColor = rowStyles.backgroundColor;
      }
      
      // Si toujours pas de couleur, vérifier le tbody parent
      if ((!finalBgColor || finalBgColor === 'rgba(0, 0, 0, 0)' || finalBgColor === 'transparent') && 
          tbodyStyles && 
          tbodyStyles.backgroundColor && 
          tbodyStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          tbodyStyles.backgroundColor !== 'transparent') {
        finalBgColor = tbodyStyles.backgroundColor;
      }
      
      rowData.push({
        content: td.textContent.trim(),
        colSpan: td.colSpan || 1,
        rowSpan: td.rowSpan || 1,
        styles: {
          fillColor: finalBgColor && 
                    finalBgColor !== 'rgba(0, 0, 0, 0)' && 
                    finalBgColor !== 'transparent' 
            ? hexToRgb(finalBgColor) 
            : [255, 255, 255],
          textColor: cellStyles.textColor && 
                    cellStyles.textColor !== 'rgba(0, 0, 0, 0)' 
            ? hexToRgb(cellStyles.textColor) 
            : [0, 0, 0]
        }
      });
    });
    
    if (rowData.length > 0) {
      rows.push(rowData);
    }
  });

  return { headers, rows, title: table.getAttribute('data-title') || tableId };
}

// Fonction pour ajouter un tableau au PDF
function addTableToPDF(doc, tableData, startY, tableTitle) {
  if (!tableData) return startY;

  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  if (startY > pageHeight - 100) {
    doc.addPage();
    startY = margin;
  }

  if (tableTitle) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(tableTitle, 14, startY);
    startY += 10;
  }

  // Préparer les en-têtes avec colspan et rowspan
  const headData = tableData.headers.map(headerRow => 
    headerRow.map(cell => ({
      content: cell.content,
      colSpan: cell.colSpan || 1,
      rowSpan: cell.rowSpan || 1,
      styles: cell.styles || {}
    }))
  );
  
  // Préparer les données du corps avec colspan et rowspan
  const bodyData = tableData.rows.map(row => 
    row.map(cell => ({
      content: cell.content,
      colSpan: cell.colSpan || 1,
      rowSpan: cell.rowSpan || 1,
      styles: cell.styles || {}
    }))
  );

  // Note: vous devez avoir jsPDF et autoTable disponibles globalement
  const finalY = autoTable(doc, {
    head: headData,
    body: bodyData,
    startY: startY,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fontStyle: 'bold',
      halign: 'center',
      fillColor: [15, 52, 96],
      textColor: [255, 255, 255]
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
        const rowIndex = data.row.index;
        const colIndex = data.column.index;
        
        if (tableData.rows[rowIndex] && tableData.rows[rowIndex][colIndex]) {
          const cellData = tableData.rows[rowIndex][colIndex];
          if (cellData.styles) {
            data.cell.styles.fillColor = cellData.styles.fillColor;
            data.cell.styles.textColor = cellData.styles.textColor;
          }
          // Appliquer colspan et rowspan
          if (cellData.colSpan && cellData.colSpan > 1) {
            data.cell.colSpan = cellData.colSpan;
          }
          if (cellData.rowSpan && cellData.rowSpan > 1) {
            data.cell.rowSpan = cellData.rowSpan;
          }
        }
      }
      
      if (data.section === 'head') {
        const rowIndex = data.row.index;
        const colIndex = data.column.index;
        
        if (tableData.headers[rowIndex] && tableData.headers[rowIndex][colIndex]) {
          const headerCell = tableData.headers[rowIndex][colIndex];
          if (headerCell.styles) {
            data.cell.styles.fillColor = headerCell.styles.fillColor;
            data.cell.styles.textColor = headerCell.styles.textColor;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.halign = 'center';
          }
          // Appliquer colspan et rowspan pour les en-têtes
          if (headerCell.colSpan && headerCell.colSpan > 1) {
            data.cell.colSpan = headerCell.colSpan;
          }
          if (headerCell.rowSpan && headerCell.rowSpan > 1) {
            data.cell.rowSpan = headerCell.rowSpan;
          }
        }
      }
    }
  });

  return doc.lastAutoTable.finalY + 15;
}

// Fonction principale
async function generateMultiTablePDF(tableIds, documentName = "rapport_multi_tableaux", format = "a4", options = {}) {
  try {
    
    
    const defaultOptions = {
      orientation: "portrait",
      format: format.toLowerCase(),
      unit: 'mm',
      addDateTime: true,
      mainTitle: "Rapport de Données",
      tableTitles: {}
    };
    
    const config = { ...defaultOptions, ...options };

    // Note: jsPDF doit être disponible globalement
    const doc = new jsPDF({
      orientation: config.orientation,
      format: config.format,
      unit: config.unit
    });

    const pageWidth = doc.internal.pageSize.width;
    let currentY = 20;

    if (config.addDateTime) {
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();
      
      doc.setFontSize(12);
      const dateTimeStr = `Généré le: ${dateStr} à ${timeStr}`;
      const textXOffset = pageWidth - doc.getTextWidth(dateTimeStr) - 10;
      doc.text(dateTimeStr, textXOffset, 10);
    }

    if (config.mainTitle) {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(config.mainTitle, 14, currentY);
      currentY += 15;
    }

    for (const [index, tableId] of tableIds.entries()) {
      
      
      const tableData = await extractTableData(tableId);
      
      if (tableData) {
        const tableTitle = config.tableTitles[tableId] || tableData.title || `Tableau ${index + 1}`;
        currentY = addTableToPDF(doc, tableData, currentY, tableTitle);
      }
    }

    doc.save(`${documentName}.pdf`);
    
  } catch (error) {
  }
}

// Export par défaut pour Vue.js
export default generateMultiTablePDF;


  
  // Exemples d'utilisation :
  
  // Utilisation basique avec format par défaut (A0)
  // generateMultiTablePDF(['suiviFinancier', 'my-table5'], 'rapport_complet');
  
  // Utilisation avec format spécifique
  // generateMultiTablePDF(['suiviFinancier', 'my-table5'], 'rapport_complet', 'A4');
  
  // Utilisation avancée avec options personnalisées
  /*
  generateMultiTablePDF(
    ['suiviFinancier', 'my-table5', 'tableau3'], 
    'rapport_detaille',
    'A3', // Format du document
    {
      mainTitle: "Rapport de Suivi Complet",
      tableTitles: {
        'suiviFinancier': 'Suivi Financier Détaillé',
        'my-table5': 'Indicateurs de Performance',
        'tableau3': 'Données Complémentaires'
      },
      orientation: "portrait", // Peut surcharger l'orientation
      addDateTime: true
    }
  );
  */
  
  // Formats supportés : A0, A1, A2, A3, A4, A5, etc.
  // ou dimensions personnalisées : [largeur, hauteur] en mm



  

  