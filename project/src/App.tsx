import React, { useState } from 'react';
import { Upload, Video, FileText, X } from 'lucide-react';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [textFileName, setTextFileName] = useState("");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  const handleTextChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTextFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTextContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoURL(null);
  };

  const clearText = () => {
    setTextContent("");
    setTextFileName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="pt-12 pb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          File Upload Center
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Upload your video or text files with ease
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          
          {/* Left Side - Video Upload */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center gap-3 text-white">
                <Video className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Video Upload</h2>
              </div>
              <p className="text-purple-100 mt-2">
                Upload and preview your video files
              </p>
            </div>
            
            <div className="p-6">
              {!videoURL ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer group"
                  >
                    <Upload className="w-16 h-16 text-purple-400 group-hover:text-purple-500 mb-4 transition-colors" />
                    <span className="text-lg font-semibold text-gray-700 mb-2">
                      Click to upload video
                    </span>
                    <span className="text-sm text-gray-500">
                      Supports MP4, AVI, MOV and more
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Video Preview
                    </h3>
                    <button
                      onClick={clearVideo}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black">
                    <video
                      src={videoURL}
                      controls
                      className="w-full h-64 object-contain"
                    />
                  </div>
                  {videoFile && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Video className="w-4 h-4" />
                        <span className="font-medium">{videoFile.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center Divider */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-px h-96 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Right Side - Text Upload */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
              <div className="flex items-center gap-3 text-white">
                <FileText className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Text Upload</h2>
              </div>
              <p className="text-blue-100 mt-2">
                Upload and view your text documents
              </p>
            </div>
            
            <div className="p-6">
              {!textContent ? (
                <div className="relative">
                  <input
                    type="file"
                    accept=".txt,.md,.csv,.json"
                    onChange={handleTextChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="text-upload"
                  />
                  <label
                    htmlFor="text-upload"
                    className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                  >
                    <Upload className="w-16 h-16 text-blue-400 group-hover:text-blue-500 mb-4 transition-colors" />
                    <span className="text-lg font-semibold text-gray-700 mb-2">
                      Click to upload text file
                    </span>
                    <span className="text-sm text-gray-500">
                      Supports TXT, MD, CSV, JSON files
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      File Content
                    </h3>
                    <button
                      onClick={clearText}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {textFileName && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{textFileName}</span>
                      </div>
                    </div>
                  )}
                  <div className="bg-gray-900 rounded-xl p-4 max-h-64 overflow-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-words">
                      {textContent}
                    </pre>
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