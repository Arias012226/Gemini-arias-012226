import React, { useState } from 'react';
import { Button, Textarea, Card, Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Components';
import { generateContent } from '../services/geminiService';
import { Upload, FileText, Image as ImageIcon, Wand2, ArrowRight } from 'lucide-react';

interface DocIntelligenceProps {
  labels: Record<string, string>;
}

const DocIntelligence: React.FC<DocIntelligenceProps> = ({ labels }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target?.result as string);
      };
      if (selectedFile.type.startsWith('image/')) {
        reader.readAsDataURL(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleProcess = async () => {
    setLoading(true);
    setOutput('');

    try {
      let prompt = "Analyze this content and provide a detailed summary in Markdown format.";
      let inlineData;
      let model = 'gemini-3-flash-preview';

      if (activeTab === 'upload' && file) {
        if (file.type.startsWith('image/')) {
           model = 'gemini-2.5-flash-image'; // Use vision capable model
           // Need base64 string without header for API
           if (filePreview) {
             const base64Data = filePreview.split(',')[1];
             inlineData = {
               mimeType: file.type,
               data: base64Data
             };
           }
        } else {
          // Text file
          prompt += `\n\nContent:\n${filePreview}`;
        }
      } else {
        prompt += `\n\nContent:\n${inputText}`;
      }

      const result = await generateContent(model, prompt, undefined, inlineData);
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput('Error processing document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold font-serif text-primary tracking-tight">{labels.docIntelligence}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Input Section */}
        <Card className="p-6 bg-card/80 backdrop-blur-md flex flex-col h-full border-primary/20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload" activeValue={activeTab} onClick={() => setActiveTab('upload')}><Upload className="w-4 h-4 mr-2" /> {labels.upload}</TabsTrigger>
              <TabsTrigger value="paste" activeValue={activeTab} onClick={() => setActiveTab('paste')}><FileText className="w-4 h-4 mr-2" /> {labels.pasteText}</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" activeValue={activeTab}>
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl h-64 flex flex-col items-center justify-center p-6 text-center hover:bg-muted/10 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                  accept=".txt,.md,.png,.jpg,.jpeg,.json" 
                />
                {file ? (
                   <div className="space-y-2">
                     {file.type.startsWith('image/') ? (
                        <ImageIcon className="w-12 h-12 mx-auto text-primary" />
                     ) : (
                        <FileText className="w-12 h-12 mx-auto text-primary" />
                     )}
                     <p className="font-medium text-lg">{file.name}</p>
                     <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                   </div>
                ) : (
                  <div className="space-y-2 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Click or drag file to upload</p>
                    <p className="text-xs">Supports TXT, MD, PNG, JPG</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="paste" activeValue={activeTab}>
              <Textarea 
                className="h-64 resize-none font-mono text-sm leading-relaxed" 
                placeholder="Paste your text here for analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </TabsContent>

             <div className="mt-6">
              <Button onClick={handleProcess} disabled={loading || (!file && !inputText)} className="w-full h-12 text-lg shadow-lg">
                {loading ? <Wand2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                {labels.process}
              </Button>
            </div>
          </Tabs>
        </Card>

        {/* Output Section */}
        <Card className="p-6 bg-card/90 backdrop-blur-md shadow-2xl flex flex-col h-full border-primary/10">
          <div className="flex items-center space-x-2 mb-4">
             <ArrowRight className="text-muted-foreground" />
             <h3 className="text-lg font-semibold">Analysis Result</h3>
          </div>
          <Textarea 
             className="flex-1 resize-none bg-muted/20 font-mono text-sm border-0 focus-visible:ring-1"
             value={output}
             readOnly
             placeholder="AI analysis will appear here..."
          />
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>Copy</Button>
            <Button variant="outline" onClick={() => {
                const blob = new Blob([output], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'analysis.md';
                a.click();
            }} disabled={!output}>Download MD</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocIntelligence;
