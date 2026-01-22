import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { DEFAULT_AGENTS_YAML } from '../constants';
import { generateContent, repairInvalidYaml } from '../services/geminiService';
import { Button, Textarea, Select, Card, Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Components';
import jsYaml from 'js-yaml';
import { Play, PenTool, Download, Upload, Wand2, Copy, Check, FileText } from 'lucide-react';

interface AgentStudioProps {
  labels: Record<string, string>;
  apiKey: string;
}

const DEFAULT_SKILL_MD = "# Global Agent Skills\n\n- Always be polite.\n- Use emojis where appropriate.\n- Reference the provided context.";

const AgentStudio: React.FC<AgentStudioProps> = ({ labels, apiKey }) => {
  const [activeTab, setActiveTab] = useState('run');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [yamlContent, setYamlContent] = useState(DEFAULT_AGENTS_YAML);
  const [skillMd, setSkillMd] = useState(DEFAULT_SKILL_MD);
  const [yamlError, setYamlError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse YAML on mount or content change
  useEffect(() => {
    try {
      const parsed = jsYaml.load(yamlContent) as Agent[];
      if (Array.isArray(parsed)) {
        setAgents(parsed);
        if (!selectedAgentId && parsed.length > 0) {
          setSelectedAgentId(parsed[0].id);
        }
        setYamlError(null);
      } else {
         setYamlError('YAML must be an array of Agents');
      }
    } catch (e) {
      setYamlError('Invalid YAML');
    }
  }, [yamlContent]);

  const handleRun = async () => {
    if (!selectedAgentId || !prompt) return;
    
    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;

    setLoading(true);
    setOutput('');
    
    const enhancedSystemPrompt = `${agent.systemPrompt}\n\nGlobal Skills/Context:\n${skillMd}`;

    try {
      const result = await generateContent(
        agent.model,
        prompt,
        enhancedSystemPrompt,
        undefined,
        apiKey
      );
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput('Error generating content. Please check console and API Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadYaml = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
          const content = ev.target?.result as string;
          try {
             const parsed = jsYaml.load(content);
             if (Array.isArray(parsed)) {
                 setYamlContent(content);
             } else {
                 // Not standard, try to fix
                 setLoading(true);
                 const fixed = await repairInvalidYaml(content, apiKey, true); // standardize=true
                 setYamlContent(fixed);
                 setLoading(false);
             }
          } catch (err) {
               setLoading(true);
               const fixed = await repairInvalidYaml(content, apiKey, true);
               setYamlContent(fixed);
               setLoading(false);
          }
      };
      reader.readAsText(file);
  };

    const handleUploadSkill = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setSkillMd(ev.target?.result as string);
      reader.readAsText(file);
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold font-serif text-primary tracking-tight">{labels.agentStudio}</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="run" activeValue={activeTab} onClick={() => setActiveTab('run')}><Play className="w-4 h-4 mr-2" /> {labels.run}</TabsTrigger>
          <TabsTrigger value="manage" activeValue={activeTab} onClick={() => setActiveTab('manage')}><PenTool className="w-4 h-4 mr-2" /> Agents.yaml</TabsTrigger>
          <TabsTrigger value="skill" activeValue={activeTab} onClick={() => setActiveTab('skill')}><FileText className="w-4 h-4 mr-2" /> {labels.skillMd}</TabsTrigger>
        </TabsList>

        <TabsContent value="run" activeValue={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Control Panel */}
            <Card className="col-span-1 p-6 space-y-6 md:h-[calc(100vh-250px)] overflow-y-auto bg-card/80 backdrop-blur-sm border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium">{labels.selectAgent}</label>
                <Select 
                  value={selectedAgentId} 
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="bg-background"
                >
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </Select>
              </div>

              {activeAgent && (
                <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2 border border-border">
                  <p className="font-semibold text-primary">{activeAgent.name}</p>
                  <p className="text-muted-foreground">{activeAgent.description}</p>
                   {/* Allow user to override prompt per run? No, just model selection maybe */}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">{labels.prompt}</label>
                <Textarea 
                  className="h-32 resize-none" 
                  placeholder={labels.prompt}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button onClick={handleRun} disabled={loading || !prompt} className="w-full">
                {loading ? (
                  <span className="flex items-center"><Wand2 className="mr-2 h-4 w-4 animate-spin" /> {labels.processing}</span>
                ) : (
                  <span className="flex items-center"><Play className="mr-2 h-4 w-4" /> {labels.execute}</span>
                )}
              </Button>
            </Card>

            {/* Output Panel */}
            <Card className="col-span-1 md:col-span-2 p-6 flex flex-col md:h-[calc(100vh-250px)] bg-card/90 backdrop-blur-md shadow-xl border-primary/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Output</h3>
                <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex-1 bg-muted/30 rounded-md p-4 overflow-auto font-mono text-sm border border-border/50 shadow-inner">
                {output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic">
                    Agent output will appear here...
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" activeValue={activeTab}>
          <Card className="p-6 h-full flex flex-col space-y-4 bg-card/80 backdrop-blur-md">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">agents.yaml</h3>
              <div className="space-x-2 flex items-center">
                <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                    <Upload className="mr-2 h-4 w-4" /> {labels.upload}
                    <input type="file" className="hidden" accept=".yaml,.yml" onChange={handleUploadYaml} />
                </label>
                
                <Button variant="outline" size="sm" onClick={() => {
                  const blob = new Blob([yamlContent], { type: 'text/yaml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'agents.yaml';
                  a.click();
                }}>
                  <Download className="mr-2 h-4 w-4" /> {labels.download}
                </Button>
              </div>
            </div>
            
            {yamlError && <div className="text-red-500 text-sm font-medium">{yamlError}</div>}
            
            <Textarea 
              className="flex-1 font-mono text-sm bg-slate-950 text-slate-50 p-4 leading-relaxed" 
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              spellCheck={false}
            />
          </Card>
        </TabsContent>

        <TabsContent value="skill" activeValue={activeTab}>
             <Card className="p-6 h-full flex flex-col space-y-4 bg-card/80 backdrop-blur-md">
                 <div className="flex justify-between items-center">
                    <h3 className="font-semibold">SKILL.md (Global Context)</h3>
                     <div className="space-x-2 flex items-center">
                        <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                            <Upload className="mr-2 h-4 w-4" /> {labels.upload}
                            <input type="file" className="hidden" accept=".md,.txt" onChange={handleUploadSkill} />
                        </label>
                         <Button variant="outline" size="sm" onClick={() => {
                            const blob = new Blob([skillMd], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'SKILL.md';
                            a.click();
                            }}>
                            <Download className="mr-2 h-4 w-4" /> {labels.download}
                        </Button>
                     </div>
                 </div>
                 <Textarea 
                    className="flex-1 font-mono text-sm p-4 leading-relaxed" 
                    value={skillMd}
                    onChange={(e) => setSkillMd(e.target.value)}
                />
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentStudio;
