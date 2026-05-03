import fs from 'fs';
import { PDFParse } from 'pdf-parse';

/**
 * Extracts text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{text: string, numPages: number}>} - Extracted text and page count
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const pdfParser = new PDFParse();
        const pdfData = await pdfParser.parseBuffer(fileBuffer);
        
        let extractedText = '';
        
        // Extract text from each page
        if (pdfData.text) {
            extractedText = pdfData.text;
        }
        
        return {
            text: extractedText,
            numPages: pdfData.numPages || 0,
        };
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
};
