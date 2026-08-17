export function printDocument(
  elementId?: string,
  documentTitle?: string,
  optionsOrOrientation?: { orientation?: 'portrait' | 'landscape'; onAfterPrint?: () => void } | 'portrait' | 'landscape'
) {
  const orientation =
    typeof optionsOrOrientation === 'string'
      ? optionsOrOrientation
    : optionsOrOrientation?.orientation || 'portrait';

  const onAfterPrintCallback = typeof optionsOrOrientation === 'object' ? optionsOrOrientation.onAfterPrint : undefined;

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
        console.warn(`Element with ID '${elementId}' not found in DOM.`);
      }
    }

    // Remove any previous print portal or style
    const existingPortal = document.getElementById('global-app-print-portal');
    if (existingPortal) existingPortal.remove();
    const existingStyle = document.getElementById('global-app-print-style');
    if (existingStyle) existingStyle.remove();

    if (contentToPrint) {
      // 1. Inject print CSS into document head
      const styleEl = document.createElement('style');
      styleEl.id = 'global-app-print-style';
      styleEl.textContent = `
        @media screen {
          #global-app-print-portal {
            display: none !important;
            visibility: hidden !important;
          }
        }
        @media print {
          @page {
            size: A4 ${orientation};
            margin: 10mm 8mm;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
          }
          /* Hide everything except the print portal */
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
            z-index: 9999999 !important;
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
          .page-break-after-always {
            page-break-after: always !important;
            break-after: page !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          th, td {
            border: 1px solid #64748b !important;
            padding: 5px 7px !important;
            font-size: ${orientation === 'landscape' ? '8pt' : '8.5pt'} !important;
            line-height: 1.3 !important;
          }
          th {
            background-color: #e2e8f0 !important;
            color: #0f172a !important;
            font-weight: 800 !important;
          }
        }
      `;
      document.head.appendChild(styleEl);

      // 2. Create Print Portal and attach content
      const portal = document.createElement('div');
      portal.id = 'global-app-print-portal';
      portal.innerHTML = contentToPrint;
      document.body.appendChild(portal);

      // 3. Cleanup handler triggered only AFTER the user closes the print dialog
      let cleanedUp = false;
      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        try {
          if (document.title !== originalTitle) {
            document.title = originalTitle;
          }
          const p = document.getElementById('global-app-print-portal');
          if (p) p.remove();
          const s = document.getElementById('global-app-print-style');
          if (s) s.remove();
          if (onAfterPrintCallback) onAfterPrintCallback();
        } catch (err) {
          console.warn('Print cleanup notice:', err);
        }
      };

      window.addEventListener('afterprint', cleanup, { once: true });
      // Safe fallback timeout (15s) in case afterprint does not fire in some iframe wrappers
      setTimeout(cleanup, 15000);

      // Delay briefly to allow browser to calculate layout
      setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.error('window.print invocation failed:', e);
          cleanup();
        }
      }, 120);
      return;
    }

    // Direct fallback if no content
    window.print();
  } catch (error) {
    console.error('Error in printDocument helper:', error);
    try {
      window.print();
    } catch (e) {
      console.error('Fallback print failed:', e);
    }
  } finally {
    setTimeout(() => {
      if (document.title !== originalTitle) {
        document.title = originalTitle;
      }
    }, 1500);
  }
}


