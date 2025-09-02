export async function extractTextFromFile(file: File): Promise<string> {
    try {
      if (file.type === 'application/pdf') {
        return await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        return await file.text();
      } else if (file.type.includes('document') || 
                 file.name.endsWith('.docx') || 
                 file.name.endsWith('.doc')) {
        throw new Error('Word documents are not yet supported. Please convert your CV to PDF or text format.');
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or text file.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to process the uploaded file.');
    }
  }
  
  async function extractTextFromPDF(file: File): Promise<string> {
    try {
      // Dynamically import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      
      // Use the exact version we installed (3.11.174)
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => {
            // Handle different text item types
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      // Clean up the extracted text
      fullText = fullText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .trim();
      
      if (!fullText || fullText.length < 50) {
        throw new Error('No readable text found in the PDF. Please ensure your CV contains selectable text (not just images).');
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF processing failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to extract text from PDF. Please try a different file.');
    }
  }