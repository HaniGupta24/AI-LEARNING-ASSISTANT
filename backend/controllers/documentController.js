import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from 'fs/promises';
import mongoose from "mongoose";
import { count, error } from "console";
import { userInfo } from "os";

// @desc Upload a document
// @route POST /api/documents
// @access Private

export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'Please upload a file',
            statusCode:400

             });
        }
        const { title } = req.body;
        if (!title) {
            //Cleanup uploaded file if error occurs
            await fs.unlink(req.file.path);
            return res.status(400).json({ 
                success: false,
                error: 'Please provide a title',
                statusCode:400
             });
        }
        //Construct the URL for the uploaded file
        const baseUrl = `http://localhost:${process.env.PORT || 8000}`;//In production, this should be your actual domain
const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

//Create a document record
const document = await Document.create({
    userId : req.user._id,
    title,
    FileName: req.file.originalname,
    filePath: fileUrl,
    fileSize: req.file.size,
    status: 'processing',
});
//process pdf in background (in production, consider using a job queue like Bull or RabbitMQ)
processPDF(document._id, req.file.path).catch((err) => {
    console.error('Error processing PDF:', err);
});
        res.status(201).json({
            success: true,
            data: document,
            message:'Document uploaded successfully. Processing in background.',

        });
    }
    catch (error) {
        //Cleanup uploaded file if error occurs
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }
        next(error);

    }
};    
//Helper function to process PDF, extract text, chunk it, and update the document record
const processPDF = async (documentId, filePath) => {
    try {
        const { text, numPages } = await extractTextFromPDF(filePath);
        //CREATE CHUNKS
        const chunks = chunkText(text, 500, 50);

        // Update the document record with the extracted text and chunks
        await Document.findByIdAndUpdate(documentId, {
           extractedText: text,
              chunks: chunks,
            status: 'ready',
        });
        console.log(`Document ${documentId} processed successfully `);
    } catch (error) {
        console.error('Error processing PDF ${documentId}:', error);
        // Update the document record with an error status
        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
    }
};

//@desc Get all documents for the authenticated user
//@route GET /api/documents
//@access Private
export const getDocuments = async (req, res, next) => {
    try {
const documents = await Document.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(req.user._id) } },
    {$lookup:{
        from: 'flashcards',
        localField: '_id',
        foreignField: 'documentId',
        as: 'flashcards'
    }},
    {$lookup:{      
        from: 'quizzes',
        localField: '_id',
        foreignField: 'documentId',
        as: 'quizzes'
    }},
    {$addFields:{
        flashcardCount: { $size: '$flashcards' },
        quizCount: { $size: '$quizzes' }
    }},
    {$project:{
        extractedText:0,
        chunks:0,
        flashcards:0,
        quizzes:0,
    }},
    {$sort:{uploadDate:-1}}
]);
        res.status(200).json({
            success: true,
            count: documents.length,  
            data: documents

        });
    }
    
    catch (error) {
//Cleanup uploaded file if error occurs

        
        next(error);
    }
};  

//@desc Get a single document with chunks
//@route GET /api/documents/:id
//@access Private
export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }
        
        if (document.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this document',
                statusCode: 403
            });
        }
        
        res.status(200).json({
            success: true,
            data: document
        });
    }
    catch (error) {
        next(error);
    }
};


//@desc Delete document
//@route DELETE /api/documents/:id
//@access Private
export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }
        
        if (document.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this document',
                statusCode: 403
            });
        }
        
        // Delete associated file if exists
        if (document.filePath) {
            const filePath = document.filePath.replace(/^.*\/uploads\//, '');
            await fs.unlink(`uploads/${filePath}`).catch(() => {});
        }
        
        await Document.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};

//@desc Update document title
//@route PUT /api/documents/:id
//@access Private
export const updateDocumentTitle = async (req, res, next) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a title',
                statusCode: 400
            });
        }
        
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }
        
        if (document.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this document',
                statusCode: 403
            });
        }
        
        document.title = title;
        await document.save();
        
        res.status(200).json({
            success: true,
            data: document,
            message: 'Document title updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
};

//@desc Update document (alias for updateDocumentTitle)
export const updateDocument = updateDocumentTitle;

