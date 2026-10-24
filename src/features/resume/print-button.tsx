'use client';

const PDF_FILENAME = 'Helder-Burato-Berto-Resume';

export function PrintButton() {
  // Browsers derive the PDF filename from document.title, so swap it only for
  // the print dialog and keep the SEO-friendly page title on screen.
  const handlePrint = () => {
    const pageTitle = document.title;
    const restore = () => {
      document.title = pageTitle;
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);
    document.title = PDF_FILENAME;
    window.print();
  };

  return (
    <button type="button" className="rs-button" onClick={handlePrint}>
      Print / Save as PDF
    </button>
  );
}
