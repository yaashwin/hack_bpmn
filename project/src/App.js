// import React, { useState } from 'react';
// import { Upload, Video, FileText, X, Send, Download, ArrowLeft } from 'lucide-react';

// // Simple routing state management
// const PAGES = {
//   UPLOAD: 'upload',
//   SUMMARY: 'summary'
// };

// function App() {
//   const [currentPage, setCurrentPage] = useState(PAGES.UPLOAD);
//   const [summaryData, setSummaryData] = useState(null);
  
//   const navigateToSummary = (data) => {
//     setSummaryData(data);
//     setCurrentPage(PAGES.SUMMARY);
//   };
  
//   const navigateToUpload = () => {
//     setCurrentPage(PAGES.UPLOAD);
//     setSummaryData(null);
//   };

//   if (currentPage === PAGES.SUMMARY) {
//     return <SummaryPage data={summaryData} onBack={navigateToUpload} />;
//   }

//   return <UploadPage onNavigateToSummary={navigateToSummary} />;
// }

// // Upload Page Component
// function UploadPage({ onNavigateToSummary }) {
//   const [videoFile, setVideoFile] = useState(null);
//   const [videoURL, setVideoURL] = useState(null);
//   const [textContent, setTextContent] = useState("");
//   const [textFileName, setTextFileName] = useState("");
//   const [uploadStatus, setUploadStatus] = useState({ video: null, text: null });
//   const [isUploading, setIsUploading] = useState({ video: false, text: false });
//   const [isProcessing, setIsProcessing] = useState(false);

//   // API call to upload video file
//   const uploadVideoToBackend = async (file) => {
//     setIsUploading(prev => ({ ...prev, video: true }));
//     setUploadStatus(prev => ({ ...prev, video: null }));

//     const formData = new FormData();
//     formData.append('video', file);
//     formData.append('fileName', file.name);
//     formData.append('fileSize', file.size);

//     try {
//       const response = await fetch('http://localhost:3001/api/upload/video', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Video upload response:', result);
//       setUploadStatus(prev => ({ ...prev, video: 'success' }));
      
//     } catch (error) {
//       console.error('Video upload error:', error);
//       setUploadStatus(prev => ({ ...prev, video: 'error' }));
//     } finally {
//       setIsUploading(prev => ({ ...prev, video: false }));
//     }
//   };

//   // API call to upload text file
//   const uploadTextToBackend = async (file, content) => {
//     setIsUploading(prev => ({ ...prev, text: true }));
//     setUploadStatus(prev => ({ ...prev, text: null }));

//     const payload = {
//       fileName: file.name,
//       fileSize: file.size,
//       content: content,
//       fileType: file.type || 'text/plain'
//     };

//     try {
//       const response = await fetch('http://localhost:3001/api/upload/text', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Text upload response:', result);
//       setUploadStatus(prev => ({ ...prev, text: 'success' }));
      
//     } catch (error) {
//       console.error('Text upload error:', error);
//       setUploadStatus(prev => ({ ...prev, text: 'error' }));
//     } finally {
//       setIsUploading(prev => ({ ...prev, text: false }));
//     }
//   };

//   // Process text and navigate to summary
//   const handleSendText = async () => {
//     if (!textContent || !textFileName) return;
    
//     setIsProcessing(true);
    
//     try {
//       const response = await fetch('http://localhost:3001/api/upload/text', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fileName: textFileName,
//           content: textContent,
//           fileType: 'text/plain'
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Processing response:', result);
      
//       // Navigate to summary page with the response data
//       onNavigateToSummary(result);
      
//     } catch (error) {
//       console.error('Text processing error:', error);
//       alert('Failed to process text file. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setVideoFile(file);
//     setVideoURL(URL.createObjectURL(file));
//     uploadVideoToBackend(file);
//   };

//   const handleTextChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setTextFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       setTextContent(content);
//       uploadTextToBackend(file, content);
//     };
//     reader.readAsText(file);
//   };

//   const clearVideo = () => {
//     setVideoFile(null);
//     setVideoURL(null);
//     setUploadStatus(prev => ({ ...prev, video: null }));
//   };

//   const clearText = () => {
//     setTextContent("");
//     setTextFileName("");
//     setUploadStatus(prev => ({ ...prev, text: null }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <div className="text-center py-12 px-4">
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
//           File Upload Center
//         </h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Upload your video or text files with ease
//         </p>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pb-12">
//         <div className="grid md:grid-cols-2 gap-8">
          
//           {/* Video Upload Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
//             <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
//               <div className="flex items-center gap-3 mb-2">
//                 <Video size={28} />
//                 <h2 className="text-2xl font-bold">Video Upload</h2>
//               </div>
//               <p className="opacity-90">Upload and preview your video files</p>
//             </div>
            
//             {!videoURL ? (
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
//                 <input
//                   type="file"
//                   accept="video/*"
//                   onChange={handleVideoChange}
//                   className="hidden"
//                   id="video-upload"
//                 />
//                 <label htmlFor="video-upload" className="cursor-pointer block">
//                   <Upload size={48} className="mx-auto mb-4 text-purple-500" />
//                   <div className="text-lg font-semibold text-gray-700 mb-2">
//                     Click to upload video
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Supports MP4, AVI, MOV and more
//                   </div>
//                 </label>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-800">Video Preview</h3>
//                   <button
//                     onClick={clearVideo}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <X size={20} className="text-gray-500" />
//                   </button>
//                 </div>
                
//                 <video
//                   src={videoURL}
//                   controls
//                   className="w-full rounded-xl shadow-lg"
//                 />
                
//                 {videoFile && (
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="flex items-center gap-3 mb-2">
//                       <Video size={20} className="text-purple-500" />
//                       <span className="font-medium text-gray-800">{videoFile.name}</span>
//                     </div>
//                     <div className="text-sm text-gray-600 mb-2">
//                       Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
//                     </div>
//                     <StatusIndicator 
//                       status={uploadStatus.video} 
//                       isUploading={isUploading.video} 
//                       type="video" 
//                     />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Text Upload Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
//             <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 mb-6 text-white">
//               <div className="flex items-center gap-3 mb-2">
//                 <FileText size={28} />
//                 <h2 className="text-2xl font-bold">Text Upload</h2>
//               </div>
//               <p className="opacity-90">Upload and view your text documents</p>
//             </div>
            
//             {!textContent ? (
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
//                 <input
//                   type="file"
//                   accept=".txt,.md,.csv,.json"
//                   onChange={handleTextChange}
//                   className="hidden"
//                   id="text-upload"
//                 />
//                 <label htmlFor="text-upload" className="cursor-pointer block">
//                   <Upload size={48} className="mx-auto mb-4 text-blue-500" />
//                   <div className="text-lg font-semibold text-gray-700 mb-2">
//                     Click to upload text file
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Supports TXT, MD, CSV, JSON files
//                   </div>
//                 </label>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-800">File Content</h3>
//                   <button
//                     onClick={clearText}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <X size={20} className="text-gray-500" />
//                   </button>
//                 </div>
                
//                 {textFileName && (
//                   <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                     <div className="flex items-center gap-3 mb-2">
//                       <FileText size={20} className="text-blue-500" />
//                       <span className="font-medium text-gray-800">{textFileName}</span>
//                     </div>
//                     <StatusIndicator 
//                       status={uploadStatus.text} 
//                       isUploading={isUploading.text} 
//                       type="text" 
//                     />
//                     {/* Debug info - remove this later */}
//                     <div className="text-xs text-gray-500 mt-2">
//                       Debug: Status={uploadStatus.text}, HasContent={!!textContent}, HasFileName={!!textFileName}
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
//                   <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
//                     {textContent}
//                   </pre>
//                 </div>
                
//                 {/* Debug Section - Always visible when we have content */}
//                 <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
//                   <div>🐛 Debug Info:</div>
//                   <div>textContent length: {textContent ? textContent.length : 'null'}</div>
//                   <div>textFileName: {textFileName || 'null'}</div>
//                   <div>uploadStatus.text: {uploadStatus.text || 'null'}</div>
//                   <div>isUploading.text: {isUploading.text ? 'true' : 'false'}</div>
//                 </div>
                
//                 {/* Send Button - ALWAYS show when textContent exists */}
//                 <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
//                   <div className="mb-3 text-sm text-blue-700 font-medium">
//                     📄 File loaded successfully! Ready for processing.
//                   </div>
//                   <button
//                     onClick={handleSendText}
//                     disabled={isProcessing}
//                     className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-xl text-lg border-2 border-blue-600"
//                   >
//                     {isProcessing ? (
//                       <>
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
//                         Processing Your File...
//                       </>
//                     ) : (
//                       <>
//                         <Send size={24} className="animate-pulse" />
//                         🚀 SEND FOR PROCESSING
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Summary Page Component
// function SummaryPage({ data, onBack }) {
//   const downloadSummary = () => {
//     if (!data?.data?.summary) return;
    
//     const element = document.createElement('a');
//     const file = new Blob([data.data.summary], { type: 'text/plain' });
//     element.href = URL.createObjectURL(file);
//     element.download = `${data.data.originalFileName || 'summary'}_summary.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={onBack}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <ArrowLeft size={24} className="text-gray-600" />
//             </button>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Processing Summary
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* File Info */}
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
//             <div className="flex items-center gap-3 mb-2">
//               <FileText size={24} className="text-green-600" />
//               <h2 className="text-xl font-semibold text-green-800">
//                 File: {data?.data?.originalFileName || 'Unknown'}
//               </h2>
//             </div>
//             <div className="text-green-700">
//               ✅ Processing completed successfully
//             </div>
//           </div>

//           {/* Summary Content */}
//           <div className="mb-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Summary</h3>
//             <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
//               <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
//                 {data?.data?.summary || 'No summary available'}
//               </pre>
//             </div>
//           </div>

//           {/* Download Button */}
//           <div className="flex justify-center">
//             <button
//               onClick={downloadSummary}
//               className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               <Download size={20} />
//               Download Summary
//             </button>
//           </div>

//           {/* Generated Files Info (Not downloadable as per requirement) */}
//           {data?.data?.generatedFiles && (
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <h4 className="text-lg font-semibold text-gray-700 mb-4">
//                 Generated Files (Server-side)
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {Object.entries(data.data.generatedFiles).map(([type, filename]) => (
//                   <div key={type} className="bg-gray-100 rounded-lg p-3">
//                     <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
//                       {type}
//                     </div>
//                     <div className="text-gray-800 truncate">{filename}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Status Indicator Component
// function StatusIndicator({ status, isUploading, type }) {
//   if (isUploading) {
//     return (
//       <div className="flex items-center gap-2 text-blue-600">
//         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
//         <span className="text-sm font-medium">Uploading...</span>
//       </div>
//     );
//   }
  
//   if (status === 'success') {
//     return (
//       <div className="flex items-center gap-2 text-green-600">
//         <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs">✓</span>
//         </div>
//         <span className="text-sm font-medium">Uploaded successfully</span>
//       </div>
//     );
//   }
  
//   if (status === 'error') {
//     return (
//       <div className="flex items-center gap-2 text-red-600">
//         <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
//           <span className="text-white text-xs">✗</span>
//         </div>
//         <span className="text-sm font-medium">Upload failed</span>
//       </div>
//     );
//   }
  
//   return null;
// }

// export default App;

import React, { useState } from 'react';
import { Upload, Video, FileText, X, Send, Download, ArrowLeft } from 'lucide-react';

// Simple routing state management
const PAGES = {
  UPLOAD: 'upload',
  SUMMARY: 'summary'
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.UPLOAD);
  const [summaryData, setSummaryData] = useState(null);
  
  const navigateToSummary = (data) => {
    setSummaryData(data);
    setCurrentPage(PAGES.SUMMARY);
  };
  
  const navigateToUpload = () => {
    setCurrentPage(PAGES.UPLOAD);
    setSummaryData(null);
  };

  if (currentPage === PAGES.SUMMARY) {
    return <SummaryPage data={summaryData} onBack={navigateToUpload} />;
  }

  return <UploadPage onNavigateToSummary={navigateToSummary} />;
}

// Upload Page Component
function UploadPage({ onNavigateToSummary }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [textFileName, setTextFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState({ video: null, text: null });
  const [isUploading, setIsUploading] = useState({ video: false, text: false });
  const [isProcessing, setIsProcessing] = useState(false);

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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Video upload response:', result);
      setUploadStatus(prev => ({ ...prev, video: 'success' }));
      
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

  // Process text and navigate to summary
  const handleSendText = async () => {
    if (!textContent || !textFileName) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: textFileName,
          content: textContent,
          fileType: 'text/plain'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Processing response:', result);
      
      // Navigate to summary page with the response data
      onNavigateToSummary(result);
      
    } catch (error) {
      console.error('Text processing error:', error);
      alert('Failed to process text file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          File Upload Center
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your video or text files with ease
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Video Upload Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Video size={28} />
                <h2 className="text-2xl font-bold">Video Upload</h2>
              </div>
              <p className="opacity-90">Upload and preview your video files</p>
            </div>
            
            {!videoURL ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer block">
                  <Upload size={48} className="mx-auto mb-4 text-purple-500" />
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    Click to upload video
                  </div>
                  <div className="text-sm text-gray-500">
                    Supports MP4, AVI, MOV and more
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Video Preview</h3>
                  <button
                    onClick={clearVideo}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                
                <video
                  src={videoURL}
                  controls
                  className="w-full rounded-xl shadow-lg"
                />
                
                {videoFile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Video size={20} className="text-purple-500" />
                      <span className="font-medium text-gray-800">{videoFile.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
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

          {/* Text Upload Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={28} />
                <h2 className="text-2xl font-bold">Text Upload</h2>
              </div>
              <p className="opacity-90">Upload and view your text documents</p>
            </div>
            
            {!textContent ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".txt,.md,.csv,.json"
                  onChange={handleTextChange}
                  className="hidden"
                  id="text-upload"
                />
                <label htmlFor="text-upload" className="cursor-pointer block">
                  <Upload size={48} className="mx-auto mb-4 text-blue-500" />
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    Click to upload text file
                  </div>
                  <div className="text-sm text-gray-500">
                    Supports TXT, MD, CSV, JSON files
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">File Content</h3>
                  <button
                    onClick={clearText}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                
                {textFileName && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText size={20} className="text-blue-500" />
                      <span className="font-medium text-gray-800">{textFileName}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Size: {textContent ? `${(new Blob([textContent]).size / 1024).toFixed(2)} KB` : '0 KB'}
                    </div>
                    <StatusIndicator 
                      status={uploadStatus.text} 
                      isUploading={isUploading.text} 
                      type="text" 
                    />
                  </div>
                )}
                
                <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                    {textContent}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Send Button - Fixed at bottom when text file is uploaded */}
        {textContent && textFileName && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">{textFileName}</div>
                    <div className="text-sm text-gray-600">Ready for processing</div>
                  </div>
                </div>
                <button
                  onClick={handleSendText}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg text-lg border-2 border-blue-600"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send for Processing
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add padding to bottom when send button is visible */}
        {textContent && textFileName && (
          <div className="h-24"></div>
        )}
      </div>
    </div>
  );
}

// Summary Page Component
function SummaryPage({ data, onBack }) {
  const downloadSummary = () => {
    if (!data?.data?.summary) return;
    
    const element = document.createElement('a');
    const file = new Blob([data.data.summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${data.data.originalFileName || 'summary'}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Processing Summary
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* File Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={24} className="text-green-600" />
              <h2 className="text-xl font-semibold text-green-800">
                File: {data?.data?.originalFileName || 'Unknown'}
              </h2>
            </div>
            <div className="text-green-700">
              ✅ Processing completed successfully
            </div>
          </div>

          {/* Summary Content */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Summary</h3>
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                {data?.data?.summary || 'No summary available'}
              </pre>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center">
            <button
              onClick={downloadSummary}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download size={20} />
              Download Summary
            </button>
          </div>

          {/* Generated Files Info */}
          {data?.data?.generatedFiles && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Generated Files (Server-side)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(data.data.generatedFiles).map(([type, filename]) => (
                  <div key={type} className="bg-gray-100 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {type}
                    </div>
                    <div className="text-gray-800 truncate">{filename}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ status, isUploading, type }) {
  if (isUploading) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
        <span className="text-sm font-medium">Uploading...</span>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
        <span className="text-sm font-medium">Uploaded successfully</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✗</span>
        </div>
        <span className="text-sm font-medium">Upload failed</span>
      </div>
    );
  }
  
  return null;
}

export default App;