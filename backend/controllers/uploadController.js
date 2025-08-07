const path = require('path');
const fs = require('fs-extra');
const geminiService = require('../services/geminiService');
const { saveTextFile, saveGeneratedFile } = require('../utils/fileHelpers');

// Handle binary (text/plain) upload
const uploadTextBinary = async (req, res) => {
  try {
    const rawText = req.rawBody?.toString('utf-8') || req.body?.toString('utf-8');

    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ error: 'No content received in binary file.' });
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const originalName = `binary_upload_${timestamp}_${randomString}.txt`;

    const filePath = path.join(__dirname, '../uploads/texts', originalName);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, rawText, 'utf8');

    const baseName = path.parse(originalName).name;

    const geminiInput = { content: rawText };

    // Generate outputs from Gemini
    const [bpmnContent, prdContent, drdContent] = await Promise.all([
      geminiService.generateBPMN(geminiInput),
      geminiService.generatePRD(geminiInput),
      geminiService.generateDRD(geminiInput),
    ]);

    const bpmnFile = await saveGeneratedFile(`${baseName}_process.bpmn`, bpmnContent, 'bpmn');
    const prdFile = await saveGeneratedFile(`${baseName}_requirements.md`, prdContent, 'prd');
    const drdFile = await saveGeneratedFile(`${baseName}_decision.dmn`, drdContent, 'drd');

    let summary = '';
    let summaryFile = '';
    try {
      summary = await geminiService.generateSummary(geminiInput);
      summaryFile = await saveGeneratedFile(`${baseName}_summary.txt`, summary, 'summaries');
    } catch (summaryErr) {
      console.error('Summary generation error:', summaryErr?.message || summaryErr);
      summary = 'Summary generation failed. Please try again later.';
    }

    res.json({
      success: true,
      message: 'Binary text file processed successfully',
      data: {
        originalFileName: originalName,
        savedFileName: originalName,
        generatedFiles: {
          bpmn: bpmnFile,
          prd: prdFile,
          drd: drdFile,
          summary: summaryFile || 'Not generated',
        },
        summary,
      },
    });
  } catch (error) {
    console.error('Binary text upload error:', error);
    res.status(500).json({
      error: 'Failed to process binary text file',
      details: error.message,
    });
  }
};

// Handle video upload
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { filename, originalname, size, path: filePath } = req.file;

    const videoInfo = {
      fileName: originalname,
      fileSize: size,
      filePath: filePath,
      uploadDate: new Date().toISOString()
    };

    const summaryPrompt = `Please provide a brief summary for a video file with the following details:
    - File Name: ${originalname}
    - File Size: ${(size / (1024 * 1024)).toFixed(2)} MB
    - Upload Date: ${new Date().toLocaleDateString()}`;

    let summary = '';
    let summaryFileName = '';
    try {
      summary = await geminiService.generateSummary({ content: summaryPrompt });
      summaryFileName = `${path.parse(filename).name}_summary.txt`;
      const summaryPath = path.join(__dirname, '../uploads/videos', summaryFileName);
      await fs.writeFile(summaryPath, summary);
    } catch (error) {
      summary = `Summary generation failed: ${error.message}`;
    }

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        ...videoInfo,
        savedFileName: filename,
        summary,
        summaryFile: summaryFileName || null
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to upload video',
      details: error.message
    });
  }
};

// Handle structured JSON text
const uploadText = async (req, res) => {
  try {
    const isBinary = req.headers['content-type'] === 'text/plain';
    let fileName, content;

    if (isBinary) {
      content = req.rawBody?.toString('utf-8') || req.body?.toString('utf-8');
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'No content received in binary file.' });
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      fileName = `binary_upload_${timestamp}_${randomString}.txt`;
    } else {
      const { fileName: fn, content: c } = req.body;
      fileName = fn;
      content = c;

      if (!fileName || !content) {
        return res.status(400).json({
          error: 'Missing required fields',
          received: {
            fileName: !!fileName,
            content: !!content
          },
          body: req.body
        });
      }
    }

    const savedFileName = await saveTextFile(fileName, content);

    const structuredData = {
      fileName,
      fileSize: content.length,
      content,
      uploadDate: new Date().toISOString(),
      contentLength: content.length,
      lineCount: content.split('\n').length,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length
    };

    let bpmnContent, prdContent, drdContent, summary;
    let bpmnFileName, prdFileName, drdFileName, summaryFileName;

    try {
      bpmnContent = await geminiService.generateBPMN(structuredData);
      bpmnFileName = await saveGeneratedFile(
        `${path.parse(savedFileName).name}_process.bpmn`,
        bpmnContent,
        'bpmn'
      );
    } catch (e) {
      bpmnContent = `BPMN generation failed: ${e.message}`;
    }

    try {
      prdContent = await geminiService.generatePRD(structuredData);
      prdFileName = await saveGeneratedFile(
        `${path.parse(savedFileName).name}_requirements.md`,
        prdContent,
        'prd'
      );
    } catch (e) {
      prdContent = `PRD generation failed: ${e.message}`;
    }

    try {
      drdContent = await geminiService.generateDRD(structuredData);
      drdFileName = await saveGeneratedFile(
        `${path.parse(savedFileName).name}_decision.dmn`,
        drdContent,
        'drd'
      );
    } catch (e) {
      drdContent = `DRD generation failed: ${e.message}`;
    }

    try {
      summary = await geminiService.generateSummary(structuredData);
      summaryFileName = await saveGeneratedFile(
        `${path.parse(savedFileName).name}_summary.txt`,
        summary,
        'summaries'
      );
    } catch (e) {
      summary = `Summary generation failed: ${e.message}`;
    }

    res.json({
      success: true,
      message: isBinary ? 'Binary text file processed successfully' : 'Text file processed successfully',
      data: {
        originalFileName: fileName,
        savedFileName,
        generatedFiles: {
          bpmn: bpmnFileName,
          prd: prdFileName,
          drd: drdFileName,
          summary: summaryFileName || null
        },
        summary,
        processedData: {
          contentLength: structuredData.contentLength,
          lineCount: structuredData.lineCount,
          wordCount: structuredData.wordCount
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to process text file',
      details: error.message
    });
  }
};

module.exports = {
  uploadVideo,
  uploadText,
  uploadTextBinary,
};
