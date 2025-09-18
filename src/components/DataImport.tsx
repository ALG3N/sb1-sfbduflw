import React, { useState } from 'react';
import { Upload, FileText, Database, CheckCircle, AlertCircle, Download } from 'lucide-react';

export function DataImport() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      simulateUpload();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Import Sales Data</h1>
        <p className="text-gray-600 mt-2">Upload your sales data to get powerful analytics and insights</p>
      </div>

      {/* Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">CSV/Excel Files</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Upload spreadsheet files containing your sales data</p>
          <div className="flex items-center text-sm text-blue-600">
            <span>Supported formats: .csv, .xlsx, .xls</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Database Connection</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Connect directly to your existing database</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Coming Soon</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">API Integration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Integrate with your existing sales systems</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Coming Soon</span>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Sales Data</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadStatus === 'idle' && (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Drop your files here</h4>
              <p className="text-gray-600 mb-4">or click to select files</p>
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Select Files
              </label>
            </>
          )}

          {uploadStatus === 'uploading' && (
            <div className="space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-medium text-gray-900">Processing your data...</p>
              <p className="text-gray-600">This may take a few moments</p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h4 className="text-lg font-medium text-gray-900">Upload Successful!</h4>
              <p className="text-gray-600">Your data has been processed and is ready for analysis</p>
              <button
                onClick={() => setUploadStatus('idle')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Upload More Files
              </button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h4 className="text-lg font-medium text-gray-900">Upload Failed</h4>
              <p className="text-gray-600">There was an error processing your file. Please try again.</p>
              <button
                onClick={() => setUploadStatus('idle')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Data Requirements */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Data Format Requirements</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Required columns:</strong> Date, Customer, Product, Quantity, Unit Price, Total Amount</p>
            <p><strong>Optional columns:</strong> Region, Sales Rep, Category, Customer Email</p>
            <p><strong>Date format:</strong> YYYY-MM-DD or MM/DD/YYYY</p>
            <p><strong>Currency:</strong> Numeric values only (no currency symbols)</p>
          </div>
        </div>
      </div>

      {/* Sample Template */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Need a template?</h3>
            <p className="text-gray-600 mt-1">Download our sample CSV template to get started quickly</p>
          </div>
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}