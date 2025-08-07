import React, { useState } from 'react';
import { Upload, Video, FileText, X } from 'lucide-react';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [textFileName, setTextFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState({ video: null, text: null });
  const [isUploading, setIsUploading] = useState({ video: false, text: false });

  // API call to upload video file
  const uploadVideoToBackend = async (file) => {
    setIsUploading(prev => ({ ...prev, video: true }));
    setUploadStatus(prev => ({ ...prev, video: null }));

    const formData = new FormData();
    formData.append('video', file);
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size);

    try {
      const response = await fetch('http://localhost:3001/api/upload/video', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Video upload response:', result);
      setUploadStatus(prev => ({ ...prev, video: 'success' }));
      
      // Optional: You can store the backend response data
      // setVideoMetadata(result);
      
    } catch (error) {
      console.error('Video upload error:', error);
      setUploadStatus(prev => ({ ...prev, video: 'error' }));
    } finally {
      setIsUploading(prev => ({ ...prev, video: false }));
    }
  };

  // API call to upload text file
  const uploadTextToBackend = async (file, content) => {
    setIsUploading(prev => ({ ...prev, text: true }));
    setUploadStatus(prev => ({ ...prev, text: null }));

    const payload = {
      fileName: file.name,
      fileSize: file.size,
      content: content,
      fileType: file.type || 'text/plain'
    };

    try {
      const response = await fetch('http://localhost:3001/api/upload/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Text upload response:', result);
      setUploadStatus(prev => ({ ...prev, text: 'success' }));
      
    } catch (error) {
      console.error('Text upload error:', error);
      setUploadStatus(prev => ({ ...prev, text: 'error' }));
    } finally {
      setIsUploading(prev => ({ ...prev, text: false }));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    
    // Automatically upload to backend
    uploadVideoToBackend(file);
  };

  const handleTextChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTextFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setTextContent(content);
      
      // Upload to backend after reading
      uploadTextToBackend(file, content);
    };
    reader.readAsText(file);
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoURL(null);
    setUploadStatus(prev => ({ ...prev, video: null }));
  };

  const clearText = () => {
    setTextContent("");
    setTextFileName("");
    setUploadStatus(prev => ({ ...prev, text: null }));
  };

  // Status indicator component
  const StatusIndicator = ({ status, isUploading, type }) => {
    if (isUploading) {
      return <div className="status-indicator uploading">Uploading...</div>;
    }
    if (status === 'success') {
      return <div className="status-indicator success">✓ Uploaded successfully</div>;
    }
    if (status === 'error') {
      return <div className="status-indicator error">✗ Upload failed</div>;
    }
    return null;
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1 className="title">File Upload Center</h1>
        <p className="subtitle">Upload your video OR text files with ease</p>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="content-wrapper">
          
          {/* Left Side - Video Upload */}
          <div className="upload-card">
            <div className="card-header video-header">
              <div className="header-content">
                <Video className="header-icon" />
                <h2 className="card-title">Video Upload</h2>
              </div>
              <p className="card-description">
                Upload and preview your video files
              </p>
            </div>
            
            <div className="card-body">
              {!videoURL ? (
                <div className="upload-area">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="file-input"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="upload-label video-upload-label">
                    <Upload className="upload-icon" />
                    <span className="upload-text">Click to upload video</span>
                    <span className="upload-subtext">Supports MP4, AVI, MOV and more</span>
                  </label>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="preview-header">
                    <h3 className="preview-title">Video Preview</h3>
                    <button onClick={clearVideo} className="clear-button">
                      <X className="clear-icon" />
                    </button>
                  </div>
                  <div className="video-container">
                    <video src={videoURL} controls className="video-player" />
                  </div>
                  {videoFile && (
                    <div className="file-info">
                      <div className="file-details">
                        <Video className="file-icon" />
                        <span className="file-name">{videoFile.name}</span>
                      </div>
                      <div className="file-size">
                        Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <StatusIndicator 
                        status={uploadStatus.video} 
                        isUploading={isUploading.video} 
                        type="video" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center Divider */}
          <div className="divider"></div>

          {/* Right Side - Text Upload */}
          <div className="upload-card">
            <div className="card-header text-header">
              <div className="header-content">
                <FileText className="header-icon" />
                <h2 className="card-title">Text Upload</h2>
              </div>
              <p className="card-description">
                Upload and view your text documents
              </p>
            </div>
            
            <div className="card-body">
              {!textContent ? (
                <div className="upload-area">
                  <input
                    type="file"
                    accept=".txt,.md,.csv,.json"
                    onChange={handleTextChange}
                    className="file-input"
                    id="text-upload"
                  />
                  <label htmlFor="text-upload" className="upload-label text-upload-label">
                    <Upload className="upload-icon" />
                    <span className="upload-text">Click to upload text file</span>
                    <span className="upload-subtext">Supports TXT, MD, CSV, JSON files</span>
                  </label>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="preview-header">
                    <h3 className="preview-title">File Content</h3>
                    <button onClick={clearText} className="clear-button">
                      <X className="clear-icon" />
                    </button>
                  </div>
                  {textFileName && (
                    <div className="file-info">
                      <div className="file-details">
                        <FileText className="file-icon" />
                        <span className="file-name">{textFileName}</span>
                      </div>
                      <StatusIndicator 
                        status={uploadStatus.text} 
                        isUploading={isUploading.text} 
                        type="text" 
                      />
                    </div>
                  )}
                  <div className="text-preview">
                    <pre className="text-content">{textContent}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;