import React, { useState } from 'react';
import { Upload, FileText, Database, CheckCircle, AlertCircle, Download, X, Eye } from 'lucide-react';
import Papa from 'papaparse';

interface ImportedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: any[];
  headers: string[];
  rows: number;
  status: 'processing' | 'success' | 'error';
  errors?: string[];
}

export function DataImport() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ImportedFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
      processFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setUploadStatus('uploading');
    
    const newFiles: ImportedFile[] = [];
    
    for (const file of files) {
      const fileId = Math.random().toString(36).substr(2, 9);
      
      try {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const text = await file.text();
          
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
              const errors = results.errors.map(error => error.message);
              
              newFiles.push({
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                data: results.data,
                headers: results.meta.fields || [],
                rows: results.data.length,
                status: errors.length > 0 ? 'error' : 'success',
                errors: errors.length > 0 ? errors : undefined
              });
            },
            error: (error) => {
              newFiles.push({
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                data: [],
                headers: [],
                rows: 0,
                status: 'error',
                errors: [error.message]
              });
            }
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // For Excel files, we'd need a library like SheetJS
          // For now, show as unsupported but ready for implementation
          newFiles.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            data: [],
            headers: [],
            rows: 0,
            status: 'error',
            errors: ['Excel files not yet supported. Please convert to CSV.']
          });
        }
      } catch (error) {
        newFiles.push({
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          data: [],
          headers: [],
          rows: 0,
          status: 'error',
          errors: [error instanceof Error ? error.message : 'Unknown error occurred']
        });
      }
    }
    
    setTimeout(() => {
      setImportedFiles(prev => [...prev, ...newFiles]);
      setUploadStatus(newFiles.every(f => f.status === 'success') ? 'success' : 'error');
    }, 1000);
  };

  const removeFile = (fileId: string) => {
    setImportedFiles(files => files.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setShowPreview(false);
    }
  };

  const previewFile = (file: ImportedFile) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const downloadTemplate = () => {
    const headers = ['Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total Amount', 'Region', 'Sales Rep'];
    const sampleData = [
      ['2024-01-15', 'Acme Corp', 'Premium Widget', '5', '299.99', '1499.95', 'North', 'John Smith'],
      ['2024-01-16', 'Tech Solutions', 'Standard Widget', '10', '199.99', '1999.90', 'South', 'Sarah Johnson']
    ];
    
    const csvContent = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportProcessedData = () => {
    if (importedFiles.length === 0) return;
    
    const allData = importedFiles.flatMap(file => file.data);
    const headers = importedFiles[0]?.headers || [];
    
    const csvContent = [headers, ...allData.map(row => headers.map(header => row[header] || ''))].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_sales_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setUploadStatus('idle')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload More Files
                </button>
                <button
                  onClick={exportProcessedData}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export Processed Data
                </button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h4 className="text-lg font-medium text-gray-900">Upload Had Issues</h4>
              <p className="text-gray-600">Some files had errors. Check the file list below for details.</p>
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

      {/* Imported Files List */}
      {importedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Imported Files</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {importedFiles.map(file => (
              <div key={file.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB • {file.rows} rows • {file.headers.length} columns
                      </p>
                      {file.errors && (
                        <p className="text-sm text-red-600 mt-1">
                          {file.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2`}>
                      {file.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {file.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                      <span className={`text-sm font-medium ${
                        file.status === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {file.status === 'success' ? 'Success' : 'Error'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'success' && (
                        <button
                          onClick={() => previewFile(file)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Preview data"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Preview Modal */}
      {showPreview && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Data Preview: {selectedFile.name}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-auto max-h-96">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {selectedFile.headers.map((header, index) => (
                        <th key={index} className="text-left py-2 px-4 font-medium text-gray-900">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedFile.data.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {selectedFile.headers.map((header, colIndex) => (
                          <td key={colIndex} className="py-2 px-4 text-gray-700">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedFile.data.length > 10 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Showing first 10 rows of {selectedFile.data.length} total rows
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sample Template */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Need a template?</h3>
            <p className="text-gray-600 mt-1">Download our sample CSV template to get started quickly</p>
          </div>
          <button 
            onClick={downloadTemplate}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}
