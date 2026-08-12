export function printDocument(elementId?: string, documentTitle?: string) {
  try {
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        const printWindow = window.open('', '_blank', 'width=1000,height=800');
        if (printWindow) {
          const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map((s) => s.outerHTML)
            .join('\n');

          printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="id">
              <head>
                <meta charset="UTF-8">
                <title>${documentTitle || 'Dokumen Keuangan Yayasan'}</title>
                ${styles}
                <style>
                  body {
                    background-color: white !important;
                    color: #0f172a !important;
                    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
                    padding: 24px !important;
                    margin: 0 !important;
                  }
                  .print\\:hidden, button, header, aside, footer {
                    display: none !important;
                  }
                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    box-shadow: none !important;
                  }
                  table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                  }
                  @page {
                    size: A4 portrait;
                    margin: 15mm;
                  }
                </style>
              </head>
              <body>
                <div>
                  ${element.innerHTML}
                </div>
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.focus();
                      window.print();
                    }, 300);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          return;
        }
      }
    }

    // Direct window print as default fallback
    window.print();
  } catch (error) {
    console.error('Error triggering print:', error);
    try {
      window.print();
    } catch (e) {
      alert('Gagal membuka dialog cetak. Silakan gunakan kombinasi tombol Ctrl+P (atau Cmd+P).');
    }
  }
}
