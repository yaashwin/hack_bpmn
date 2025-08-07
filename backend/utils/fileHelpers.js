const fs = require('fs-extra');
const path = require('path');

const saveTextFile = async (originalFileName, content) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = path.extname(originalFileName);
    const nameWithoutExt = path.basename(originalFileName, extension);
    
    const newFileName = `${nameWithoutExt}-${timestamp}-${randomString}${extension}`;
    const filePath = path.join(__dirname, '../uploads/texts', newFileName);
    
    await fs.writeFile(filePath, content, 'utf8');
    
    return newFileName;
  } catch (error) {
    console.error('Error saving text file:', error);
    throw error;
  }
};

const saveGeneratedFile = async (fileName, content, type) => {
  try {
    // Create subdirectories for different file types
    const typeDir = path.join(__dirname, '../uploads/generated', type);
    await fs.ensureDir(typeDir);
    
    const filePath = path.join(typeDir, fileName);
    await fs.writeFile(filePath, content, 'utf8');
    
    return fileName;
  } catch (error) {
    console.error(`Error saving ${type} file:`, error);
    throw error;
  }
};

const readTextFile = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../uploads/texts', fileName);
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error reading text file:', error);
    throw error;
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

const getFileStats = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    console.error('Error getting file stats:', error);
    return null;
  }
};

module.exports = {
  saveTextFile,
  saveGeneratedFile,
  readTextFile,
  deleteFile,
  getFileStats
};