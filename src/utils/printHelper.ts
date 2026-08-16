export function printDocument(
  elementId?: string,
  documentTitle?: string,
  optionsOrOrientation?: { orientation?: 'portrait' | 'landscape' } | 'portrait' | 'landscape'
) {
  const orientation =
    typeof optionsOrOrientation === 'string'
      ? optionsOrOrientation
      : optionsOrOrientation?.orientation || 'portrait';

  const originalTitle = document.title;
  const targetTitle = documentTitle || 'Dokumen Resmi SDIT EL-FATAH';
  document.title = targetTitle;

  try {
    let contentToPrint = '';
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        contentToPrint = element.innerHTML;
      } else {
        console.warn(`Element with ID '${elementId}' not found. Falling back to direct window.print()`);
      }
    }

    if (contentToPrint) {
      // 1. Remove previous print portal or injected print styles if any
      const existingPortal = document.getElementById('global-app-print-portal');
      if (existingPortal) existingPortal.remove();
      const existingStyle = document.getElementById('global-app-print-style');
      if (existingStyle) existingStyle.remove();

      // 2. Inject print CSS into document head
      const styleEl = document.createElement('style');
      styleEl.id = 'global-app-print-style';
      styleEl.textContent = `
        @media screen {
          #global-app-print-portal {
            display: none !important;
          }
        }
        @media print {
          @page {
            size: A4 ${orientation};
            margin: 8mm;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          /* Hide all application UI except the print portal */
          body > *:not(#global-app-print-portal) {
            display: none !important;
            visibility: hidden !important;
          }
          /* Show only our print portal */
          #global-app-print-portal {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
          }
          #global-app-print-portal * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          .no-print, .print\\:hidden, button, header, aside, footer {
            display: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #94a3b8 !important;
            padding: 5px 8px !important;
            font-size: ${orientation === 'landscape' ? '8pt' : '9pt'} !important;
          }
          th {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            font-weight: 800 !important;
          }
        }
      `;
      document.head.appendChild(styleEl);

      // 3. Create Print Portal and attach content
      const portal = document.createElement('div');
      portal.id = 'global-app-print-portal';
      portal.innerHTML = contentToPrint;
      document.body.appendChild(portal);

      // 4. Trigger print
      const cleanup = () => {
        try {
          if (document.title !== originalTitle) {
            document.title = originalTitle;
          }
          const p = document.getElementById('global-app-print-portal');
          if (p) p.remove();
          const s = document.getElementById('global-app-print-style');
          if (s) s.remove();
        } catch (err) {
          console.warn('Print cleanup error', err);
        }
      };

      // Delay slightly so layout recalculates before triggering browser print dialog
      setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.error('window.print error:', e);
        } finally {
          setTimeout(cleanup, 1200);
        }
      }, 80);
      return;
    }

    // Direct window print fallback if no elementId content was found
    window.print();
  } catch (error) {
    console.error('Error triggering print:', error);
    try {
      window.print();
    } catch (e) {
      alert('Gagal membuka dialog cetak. Silakan gunakan tombol cetak atau pintasan Ctrl+P.');
    }
  } finally {
    setTimeout(() => {
      if (document.title !== originalTitle) {
        document.title = originalTitle;
      }
    }, 1500);
  }
}

