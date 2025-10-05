import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import connectDB from './mongodb.js';

let gridFSBucket;

export async function getGridFSBucket() {
  if (!gridFSBucket) {
    await connectDB();
    const db = mongoose.connection.db;
    gridFSBucket = new GridFSBucket(db, {
      bucketName: 'artwork_images'
    });
  }
  return gridFSBucket;
}

export async function uploadImageToGridFS(file, filename) {
  try {
    const bucket = await getGridFSBucket();
    
    // Convertir le File en Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          originalName: file.name,
          contentType: file.type,
          uploadDate: new Date()
        }
      });

      uploadStream.on('error', (error) => {
        reject(error);
      });

      uploadStream.on('finish', (file) => {
        resolve({
          fileId: file._id,
          filename: file.filename,
          contentType: file.metadata?.contentType,
          size: file.length
        });
      });

      // Écrire le buffer dans le stream
      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error(`Erreur upload GridFS: ${error.message}`);
  }
}

export async function getImageFromGridFS(fileId) {
  try {
    const bucket = await getGridFSBucket();
    
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
      
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      downloadStream.on('error', (error) => {
        reject(error);
      });
      
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
  } catch (error) {
    throw new Error(`Erreur récupération GridFS: ${error.message}`);
  }
}

export async function deleteImageFromGridFS(fileId) {
  try {
    const bucket = await getGridFSBucket();
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    return true;
  } catch (error) {
    throw new Error(`Erreur suppression GridFS: ${error.message}`);
  }
}

export async function getImageMetadata(fileId) {
  try {
    const bucket = await getGridFSBucket();
    
    return new Promise((resolve, reject) => {
      bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray((err, files) => {
        if (err) {
          reject(err);
        } else if (files.length === 0) {
          reject(new Error('Fichier non trouvé'));
        } else {
          resolve(files[0]);
        }
      });
    });
  } catch (error) {
    throw new Error(`Erreur métadonnées GridFS: ${error.message}`);
  }
}