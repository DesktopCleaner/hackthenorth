import React, { useState } from 'react';
// import uploadFile from "../../convex/functions/uploadFile";
// import { FunctionReference } from "convex/server";
// import { useMutation } from "convex/react";
// import { api } from "../../convex/_generated/api";
import { CohereClient } from "cohere-ai";
import axios from "axios"

const cohere = new CohereClient({
  token: "ox62UMnb9zF2HS0t0LkTkyu7T0vgNZtjn5t32Hp3", // Replace with your actual Cohere API key
});


// const FileUpload: React.FC = () => 
//   const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setSelectedFile(file);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please select a file first.");
//       return;
//     }

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedFile) {
  //     alert("Please select a file first.");
  //     return;
  //   }
    

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedFile) {
  //     alert("Please select a file first.");
  //     return;
  //   }
  async function handleSubmit (e: React.FormEvent) {
    console.log("handling.....!")
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    
    // const formData = new FormData();
    // formData.append('file', selectedFile );

    
    try {

      // Read file content
      // const fileContent = await selectedFile.text();
      const ph = "abc";
      console.log("trying!....");

      // Send to Cohere API
      setIsLoading(true);
      console.log(isLoading)

      const response = await cohere.chat({
        message: `Please revise the following resume:\n\n${ph} `,
        model: "command", // or any other suitable model
        temperature: 0.3,
      });

      const marks = await cohere.chat({
        message: `Mark the resume above in terms of profession, experience, collaboration, 
        perseverance, leadership. Please give five seperate marks in the same line separated by one space`,
        model: "command", // or any other suitable model
        temperature: 0.3,
      });

      setIsLoading(false);

      // Set the revision
      console.log(response.text);
      // Download response.text as a Word document
      // Create a Blob with plain text content
      

      // Create a download link
      const blob = new Blob([response.text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'revised_resume.txt';

      // Trigger download
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Inform the user
      //alert('Your revised resume has been downloaded as a text file.');
      
    } 
    catch (error) {
      console.error("Error processing file:", error);
      alert("An error occurred while processing the file.");
      setIsLoading(false);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <label htmlFor="file" className="mb-2">Upload your resume (PDF, Word):</label>
      <input 
        type="file" 
        id="file"
        accept=".pdf,.doc,.docx,.txt"  // Accept only PDF, Word, and text files
        onChange={handleFileChange} 
        className="mb-4"
      />
      <button 
        type="submit" 
        className="bg-blue-500 text-white py-2 px-4 rounded">
        Submit
      </button>

      {/* Display selected file name */}
      {selectedFile && (
        <p className="mt-4 text-gray-700">Selected file: {selectedFile.name}</p>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Processing your resume...</p>
          </div>
        </div>
      )}
    </form>
  );
}

export default FileUpload;
