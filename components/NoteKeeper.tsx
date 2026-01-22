import React, { useState } from 'react';
import { Button, Textarea, Card, Input, Tabs, TabsList, TabsTrigger, TabsContent, Select } from './ui/Components';
import { generateContent } from '../services/geminiService';
import { Wand2, Highlighter, Table, MessageSquare, Sparkles, FileType, Eye, Edit3, Send } from 'lucide-react';

interface NoteKeeperProps {
  labels: Record<string, string>;
  apiKey: string;
}

const NoteKeeper: React.FC<NoteKeeperProps> = ({ labels, apiKey }) => {
  const [noteContent, setNoteContent] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('format');
  
  // Tool States
  const [keywords, setKeywords] = useState('');
  const [keywordColor, setKeywordColor] = useState('#ffeb3b');
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [summaryPrompt, setSummaryPrompt] = useState('Summarize the key points.');
  
  const handleAIAction = async (action: string) => {
      setLoading(true);
      try {
          let prompt = "";
          let model = "gemini-3-flash-preview";
          let sysPrompt = "";

          switch(action) {
              case 'format':
                  prompt = `Format the following text into clean, structured Markdown. Improve headings, lists, and spacing.\n\n${noteContent}`;
                  break;
              case 'keywords':
                  prompt = `Return the following text as HTML. Wrap the following keywords: [${keywords}] in <span style="background-color: ${keywordColor}; color: black; padding: 0 4px; border-radius: 4px;">KEYWORD</span>. Return ONLY the HTML body content.\n\n${noteContent}`;
                  break;
              case 'entities':
                  prompt = `Analyze the text and identify up to 20 key entities (people, places, concepts, dates). Create a Markdown table with columns: Entity, Type, Context/Description. Append this table to the end of the text.\n\n${noteContent}`;
                  break;
              case 'magic_mermaid':
                  prompt = `Create a Mermaid.js Mindmap based on this text. Return only the mermaid code block.\n\n${noteContent}`;
                  break;
              case 'magic_socratic':
                   prompt = `Act as a Socratic philosopher. Critique the arguments or points in this text. Raise 3 challenging questions and identify one potential logical fallacy or blind spot. Append this critique to the text.\n\n${noteContent}`;
                   break;
              default:
                  break;
          }

          if (action === 'keywords') {
              // Special handling for keywords to simple overwrite/preview
              // For simplicity in this demo, we might just update the content or show in a separate view.
              // Since we want to "modify the transform note", we will update content but converting markdown to HTML is tricky for editing.
              // We will just append a note about keywords for now or try to update.
              // Better strategy for "Keywords": Ask AI to bold them in markdown if color isn't supported, 
              // OR return HTML and we switch to a specific HTML view. 
              // Let's stick to Markdown bolding for stability in the editor:
              prompt = `Identify these keywords: [${keywords}] in the text and make them **BOLD** and uppercase. Return the full updated markdown.\n\n${noteContent}`;
          }

          const result = await generateContent(model, prompt, sysPrompt, undefined, apiKey);
          
          if (action === 'magic_mermaid' || action === 'entities' || action === 'magic_socratic') {
              setNoteContent(prev => prev + "\n\n" + result);
          } else {
              setNoteContent(result);
          }

      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const handleChat = async () => {
      if(!chatPrompt) return;
      setLoading(true);
      const newHistory = [...chatHistory, `User: ${chatPrompt}`];
      setChatHistory(newHistory);
      
      try {
          const contextPrompt = `Context:\n${noteContent}\n\nQuestion: ${chatPrompt}`;
          const result = await generateContent("gemini-3-flash-preview", contextPrompt, "You are a helpful assistant answering questions based on the provided notes.", undefined, apiKey);
          setChatHistory([...newHistory, `AI: ${result}`]);
          setChatPrompt('');
      } catch(e) {
           setChatHistory([...newHistory, `Error: Failed to get response.`]);
      } finally {
          setLoading(false);
      }
  };

  const handleSummary = async () => {
      setLoading(true);
      try {
          const prompt = `${summaryPrompt}\n\nText:\n${noteContent}`;
          const result = await generateContent("gemini-3-flash-preview", prompt, "You are a summarizer.", undefined, apiKey);
          setNoteContent(prev => prev + "\n\n### Summary\n" + result);
      } catch(e) {} finally { setLoading(false); }
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in-95 duration-500">
       {/* Editor Section */}
       <Card className="flex-1 flex flex-col p-4 bg-card/80 backdrop-blur-md h-full">
           <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold font-serif text-primary">{labels.noteKeeper}</h2>
               <div className="flex space-x-2">
                   <Button variant={viewMode === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('edit')}><Edit3 className="w-4 h-4 mr-1" /> {labels.edit}</Button>
                   <Button variant={viewMode === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('preview')}><Eye className="w-4 h-4 mr-1" /> {labels.preview}</Button>
               </div>
           </div>
           
           {viewMode === 'edit' ? (
               <Textarea 
                className="flex-1 resize-none font-mono text-sm leading-relaxed p-4"
                placeholder="Paste your notes here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
               />
           ) : (
               <div className="flex-1 overflow-auto p-4 border rounded-md bg-white/50 dark:bg-black/20 prose dark:prose-invert max-w-none whitespace-pre-wrap">
                   {noteContent}
               </div>
           )}
       </Card>

       {/* Tools Section */}
       <Card className="w-full md:w-80 flex flex-col p-4 bg-card/90 backdrop-blur-xl h-full border-l border-primary/10">
           <Tabs value={activeTool} onValueChange={setActiveTool} className="flex-1 flex flex-col">
               <TabsList className="grid grid-cols-5 mb-4">
                   <TabsTrigger value="format"><Wand2 className="w-4 h-4" /></TabsTrigger>
                   <TabsTrigger value="keywords"><Highlighter className="w-4 h-4" /></TabsTrigger>
                   <TabsTrigger value="entities"><Table className="w-4 h-4" /></TabsTrigger>
                   <TabsTrigger value="chat"><MessageSquare className="w-4 h-4" /></TabsTrigger>
                   <TabsTrigger value="magic"><Sparkles className="w-4 h-4" /></TabsTrigger>
               </TabsList>

               <div className="flex-1 overflow-auto">
                   <TabsContent value="format" activeValue={activeTool}>
                       <div className="space-y-4">
                           <h3 className="font-semibold">{labels.format}</h3>
                           <p className="text-xs text-muted-foreground">Auto-format disorganized text into clean Markdown.</p>
                           <Button onClick={() => handleAIAction('format')} disabled={loading} className="w-full">
                               {loading ? <Wand2 className="animate-spin mr-2" /> : <FileType className="mr-2" />} Auto Format
                           </Button>
                           
                           <div className="pt-4 border-t">
                               <h3 className="font-semibold mb-2">{labels.summary}</h3>
                               <Textarea value={summaryPrompt} onChange={(e) => setSummaryPrompt(e.target.value)} className="mb-2 h-20" />
                               <Button onClick={handleSummary} disabled={loading} variant="outline" className="w-full">Generate Summary</Button>
                           </div>
                       </div>
                   </TabsContent>

                   <TabsContent value="keywords" activeValue={activeTool}>
                       <div className="space-y-4">
                           <h3 className="font-semibold">{labels.keywords}</h3>
                           <Input 
                            placeholder="Enter keywords (comma separated)" 
                            value={keywords} 
                            onChange={(e) => setKeywords(e.target.value)} 
                           />
                           <div className="flex items-center space-x-2">
                               <label className="text-xs">Color:</label>
                               <input type="color" value={keywordColor} onChange={(e) => setKeywordColor(e.target.value)} className="h-8 w-16" />
                           </div>
                           <Button onClick={() => handleAIAction('keywords')} disabled={loading} className="w-full">Highlight</Button>
                       </div>
                   </TabsContent>

                   <TabsContent value="entities" activeValue={activeTool}>
                        <div className="space-y-4">
                           <h3 className="font-semibold">{labels.entities}</h3>
                           <p className="text-xs text-muted-foreground">Extract 20 key entities into a table.</p>
                           <Button onClick={() => handleAIAction('entities')} disabled={loading} className="w-full">Extract Entities</Button>
                       </div>
                   </TabsContent>

                   <TabsContent value="chat" activeValue={activeTool}>
                       <div className="flex flex-col h-[calc(100vh-200px)] md:h-[500px]">
                           <div className="flex-1 overflow-auto bg-muted/30 rounded p-2 mb-2 text-xs space-y-2">
                               {chatHistory.map((msg, i) => (
                                   <div key={i} className={`p-2 rounded ${msg.startsWith('User') ? 'bg-primary/10 ml-4' : 'bg-secondary/10 mr-4'}`}>
                                       {msg}
                                   </div>
                               ))}
                           </div>
                           <div className="flex space-x-2">
                               <Input value={chatPrompt} onChange={(e) => setChatPrompt(e.target.value)} placeholder="Ask about notes..." />
                               <Button size="sm" onClick={handleChat} disabled={loading}><Send className="w-4 h-4" /></Button>
                           </div>
                       </div>
                   </TabsContent>

                   <TabsContent value="magic" activeValue={activeTool}>
                       <div className="space-y-4">
                           <h3 className="font-semibold">{labels.magic}</h3>
                           <Button variant="outline" onClick={() => handleAIAction('magic_mermaid')} disabled={loading} className="w-full justify-start">
                               <span className="mr-2">🧠</span> Generate Mind Map
                           </Button>
                           <Button variant="outline" onClick={() => handleAIAction('magic_socratic')} disabled={loading} className="w-full justify-start">
                               <span className="mr-2">🦉</span> Socratic Critique
                           </Button>
                       </div>
                   </TabsContent>
               </div>
           </Tabs>
       </Card>
    </div>
  );
};

export default NoteKeeper;
