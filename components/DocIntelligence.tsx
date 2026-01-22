import React, { useState, useEffect } from 'react';
import { Button, Textarea, Card, Tabs, TabsList, TabsTrigger, TabsContent, Select } from './ui/Components';
import { generateContent } from '../services/geminiService';
import { Upload, FileText, Image as ImageIcon, Wand2, ArrowRight, FileType } from 'lucide-react';
import { Agent } from '../types';
import jsYaml from 'js-yaml';
import { DEFAULT_AGENTS_YAML } from '../constants';

interface DocIntelligenceProps {
  labels: Record<string, string>;
  apiKey: string;
}

const DocIntelligence: React.FC<DocIntelligenceProps> = ({ labels, apiKey }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Execution Config
  const [execMode, setExecMode] = useState<'model' | 'agent'>('model');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [customPrompt, setCustomPrompt] = useState("Analyze this content and provide a detailed summary in Markdown format.");
  
  const [agents, setAgents] = useState<Agent[]>([]);

  // Load agents to populate selector
  useEffect(() => {
     try {
         const parsed = jsYaml.load(DEFAULT_AGENTS_YAML) as Agent[];
         if(Array.isArray(parsed)) {
             setAgents(parsed);
             if(parsed.length > 0) setSelectedAgentId(parsed[0].id);
         }
     } catch(e) {}
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(selectedFile); 
    }
  };

  const handleProcess = async () => {
    setLoading(true);
    setOutput('');

    try {
      let finalPrompt = customPrompt;
      let inlineData;
      let modelToUse = selectedModel;
      let systemInstruction = undefined;

      // Decide Model & System Prompt based on Mode
      if (execMode === 'agent') {
          const agent = agents.find(a => a.id === selectedAgentId);
          if (agent) {
              modelToUse = agent.model;
              systemInstruction = agent.systemPrompt;
              // Keep custom prompt as user instruction
          }
      }

      // Handle Content Source
      if (activeTab === 'upload' && file && filePreview) {
          const base64Data = filePreview.split(',')[1];
          inlineData = {
              mimeType: file.type,
              data: base64Data
          };
          
          // Force vision/pdf capable models if needed, though Gemini 1.5/2.5 handles PDF
          if (file.type === 'application/pdf') {
              // Ensure appropriate model is used if generic one selected
          }
      } else {
          finalPrompt += `\n\nContent:\n${inputText}`;
      }

      const result = await generateContent(modelToUse, finalPrompt, systemInstruction, inlineData, apiKey);
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput('Error processing document. Check API Key or File format.');
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
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl h-64 flex flex-col items-center justify-center p-6 text-center hover:bg-muted/10 transition-colors cursor-pointer relative overflow-hidden">
                {!file && <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                  accept=".txt,.md,.png,.jpg,.jpeg,.json,.pdf" 
                />}
                
                {file ? (
                   <div className="space-y-2 w-full h-full flex flex-col items-center justify-center relative">
                     <button onClick={() => {setFile(null); setFilePreview(null)}} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full z-10">X</button>
                     
                     {file.type.startsWith('image/') && filePreview && (
                        <img src={filePreview} className="max-h-48 object-contain" alt="preview" />
                     )}
                     {file.type === 'application/pdf' && filePreview && (
                         <embed src={filePreview} type="application/pdf" width="100%" height="100%" />
                     )}
                     {!file.type.startsWith('image/') && file.type !== 'application/pdf' && (
                        <FileText className="w-12 h-12 mx-auto text-primary" />
                     )}
                     <p className="font-medium text-lg">{file.name}</p>
                     <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                   </div>
                ) : (
                  <div className="space-y-2 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Click or drag file to upload</p>
                    <p className="text-xs">Supports PDF, TXT, MD, Images</p>
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

             <div className="mt-6 space-y-4">
                 <div className="flex space-x-2 bg-muted/50 p-2 rounded-lg">
                    <button 
                        className={`flex-1 text-xs py-1 rounded ${execMode === 'model' ? 'bg-background shadow' : 'text-muted-foreground'}`}
                        onClick={() => setExecMode('model')}
                    >
                        Custom Model
                    </button>
                    <button 
                        className={`flex-1 text-xs py-1 rounded ${execMode === 'agent' ? 'bg-background shadow' : 'text-muted-foreground'}`}
                        onClick={() => setExecMode('agent')}
                    >
                        Use Agent
                    </button>
                 </div>

                 {execMode === 'model' ? (
                     <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                         <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
                         <option value="gemini-2.5-flash-image">gemini-2.5-flash-image (Vision)</option>
                         <option value="gemini-3-pro-preview">gemini-3-pro-preview (Advanced)</option>
                     </Select>
                 ) : (
                     <Select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)}>
                         {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                     </Select>
                 )}

                 <Textarea 
                    placeholder="Enter instructions for the AI..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="h-20"
                 />

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
