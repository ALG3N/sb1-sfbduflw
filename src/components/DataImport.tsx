import React, { useState, useCallback } from 'react';
import { Upload, FileText, Database, CheckCircle, AlertCircle, Download, X, Eye, Trash2, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { FileUpload } from '../types';

export function DataImport() {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [showPreview, setShowPreview] = useState<FileUpload | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  }, []);

  const processFiles = (fileList: File[]) => {
    fileList.forEach(file => {
      const fileUpload: FileUpload = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
        uploadedAt: new Date().toISOString()
      };

      setFiles(prev => [...prev, fileUpload]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, progress: Math.min(f.progress + 10, 90) }
            : f
        ));
      }, 200);

      // Process CSV file
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          clearInterval(progressInterval);
          
          const errors: string[] = [];
          if (results.errors.length > 0) {
            errors.push(...results.errors.map(e => e.message));
          }

          setFiles(prev => prev.map(f => 
            f.id === fileUpload.id 
              ? { 
                  ...f, 
                  status: errors.length > 0 ? 'error' : 'completed',
                  progress: 100,
                  data: results.data,
                  errors
                }
              : f
          ));
        },
        error: (error) => {
          clearInterval(progressInterval);
          setFiles(prev => prev.map(f => 
            f.id === fileUpload.id 
              ? { ...f, status: 'error', progress: 0, errors: [error.message] }
              : f
          ));
        }
      });
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const downloadTemplate = () => {
    const template = [
      ['Date', 'Customer', 'Product', 'Category', 'Quantity', 'Unit Price', 'Total Amount', 'Region', 'Sales Rep'],
      ['2024-01-15', 'Acme Corp', 'Premium Widget', 'Electronics', '5', '299.99', '1499.95', 'North', 'John Smith'],
      ['2024-01-16', 'Tech Solutions', 'Standard Widget', 'Electronics', '10', '199.99', '1999.90', 'South', 'Sarah Johnson']
    ];
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportProcessedData = (file: FileUpload) => {
    if (!file.data) return;
    
    const csvContent = Papa.unparse(file.data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${file.name}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'uploading': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Your Sales Data</h3>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
        </div>
        
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
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-4">
            {files.map(file => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                    {file.status === 'completed' && (
                      <>
                        <button
                          onClick={() => setShowPreview(file)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Preview data"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => exportProcessedData(file)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Export processed data"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {file.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {file.errors && file.errors.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-sm text-red-600 font-medium">Errors:</p>
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {file.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {file.status === 'completed' && file.data && (
                  <div className="mt-2 text-sm text-green-600">
                    Successfully processed {file.data.length} rows
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Data Preview: {showPreview.name}</h3>
              <button
                onClick={() => setShowPreview(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              {showPreview.data && showPreview.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(showPreview.data[0]).map(key => (
                          <th key={key} className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-900">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {showPreview.data.slice(0, 100).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {showPreview.data.length > 100 && (
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      Showing first 100 rows of {showPreview.data.length} total rows
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No data to preview</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Requirements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-medium text-gray-900 mb-3">Data Format Requirements</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Required columns:</strong> Date, Customer, Product, Quantity, Unit Price, Total Amount</p>
          <p><strong>Optional columns:</strong> Region, Sales Rep, Category, Customer Email</p>
          <p><strong>Date format:</strong> YYYY-MM-DD or MM/DD/YYYY</p>
          <p><strong>Currency:</strong> Numeric values only (no currency symbols)</p>
        </div>
      </div>
    </div>
  );
}