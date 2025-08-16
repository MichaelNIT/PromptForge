import React, { useState, useEffect } from "react";
import { Copy, Check, Zap, Brain, Target, FileText, Settings, Star, StarOff, Download, BookOpen, Lightbulb, User, ChevronDown } from "lucide-react";

export default function PromptForge() {
  const [form, setForm] = useState({
    role: "",
    task: "",
    context: "",
    reasoning: "",
    format: ""
  });
  
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultRole: "",
    defaultFormat: ""
  });

  // Expert roles for dropdown
  const expertRoles = [
    "Expert Data Analyst",
    "Creative Writer",
    "Technical Consultant",
    "Marketing Strategist",
    "Research Scientist",
    "Software Engineer",
    "UX/UI Designer",
    "Business Consultant",
    "Content Creator",
    "Academic Researcher",
    "Financial Advisor",
    "Legal Expert",
    "Medical Professional",
    "Educational Tutor",
    "Project Manager",
    "Social Media Specialist",
    "Sales Professional",
    "HR Specialist",
    "Customer Service Expert",
    "Innovation Strategist"
  ];

  // Pre-built templates
  const templates = [
    {
      name: "Essay Helper",
      role: "Academic Writing Expert",
      task: "Help me write a well-structured essay on the given topic",
      context: "This is for an academic assignment that requires proper citation and argumentation",
      reasoning: "Break down the essay structure, provide key points, and suggest supporting evidence",
      format: "Outline with introduction, body paragraphs, and conclusion structure"
    },
    {
      name: "Business Email",
      role: "Professional Communication Expert",
      task: "Draft a professional business email",
      context: "Corporate environment requiring clear, concise, and appropriate tone",
      reasoning: "Consider the recipient, purpose, and desired outcome of the communication",
      format: "Standard business email format with subject line, greeting, body, and closing"
    },
    {
      name: "Story Writer",
      role: "Creative Writing Expert",
      task: "Create an engaging story based on the provided premise",
      context: "Fiction writing that should captivate readers and maintain narrative flow",
      reasoning: "Develop compelling characters, plot structure, and descriptive scenes",
      format: "Narrative prose with dialogue, scene descriptions, and character development"
    },
    {
      name: "Code Review",
      role: "Senior Software Engineer",
      task: "Review the provided code and suggest improvements",
      context: "Code quality assessment focusing on best practices, performance, and maintainability",
      reasoning: "Analyze code structure, identify potential issues, and suggest optimizations",
      format: "Structured feedback with specific line comments and improvement suggestions"
    },
    {
      name: "Market Analysis",
      role: "Business Intelligence Analyst",
      task: "Analyze the market trends and provide strategic insights",
      context: "Business decision-making requiring data-driven recommendations",
      reasoning: "Examine market data, identify patterns, and assess competitive landscape",
      format: "Executive summary with key findings, charts, and actionable recommendations"
    }
  ];

  // Load saved data on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('promptforge-saved') || '[]');
    const prefs = JSON.parse(localStorage.getItem('promptforge-preferences') || '{}');
    setSavedPrompts(saved);
    setPreferences({ defaultRole: "", defaultFormat: "", ...prefs });
    
    // Apply default preferences
    if (prefs.defaultRole || prefs.defaultFormat) {
      setForm(prev => ({
        ...prev,
        role: prefs.defaultRole || prev.role,
        format: prefs.defaultFormat || prev.format
      }));
    }
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
    setRoleDropdownOpen(false);
  };

  const fullPrompt = `Role: ${form.role}

Task: ${form.task}

Context: ${form.context}

Reasoning: ${form.reasoning}

Output Format: ${form.format}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullPrompt.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const savePrompt = () => {
    const promptName = prompt("Enter a name for this prompt:");
    if (promptName && fullPrompt.trim()) {
      const newPrompt = {
        id: Date.now(),
        name: promptName,
        ...form,
        createdAt: new Date().toISOString()
      };
      const updated = [...savedPrompts, newPrompt];
      setSavedPrompts(updated);
      localStorage.setItem('promptforge-saved', JSON.stringify(updated));
    }
  };

  const loadPrompt = (prompt) => {
    setForm({
      role: prompt.role,
      task: prompt.task,
      context: prompt.context,
      reasoning: prompt.reasoning,
      format: prompt.format
    });
    setShowSaved(false);
  };

  const deletePrompt = (id) => {
    const updated = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updated);
    localStorage.setItem('promptforge-saved', JSON.stringify(updated));
  };

  const loadTemplate = (template) => {
    setForm({
      role: template.role,
      task: template.task,
      context: template.context,
      reasoning: template.reasoning,
      format: template.format
    });
    setShowTemplates(false);
  };

  const exportToFile = () => {
    const content = `# ${form.role ? form.role : 'Untitled'} Prompt\n\n${fullPrompt}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.role || 'prompt'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePreferences = () => {
    const newPrefs = {
      defaultRole: form.role,
      defaultFormat: form.format
    };
    setPreferences(newPrefs);
    localStorage.setItem('promptforge-preferences', JSON.stringify(newPrefs));
    alert('Preferences saved! These will be your defaults for new prompts.');
  };

  const sections = [
    { 
      id: "task", 
      label: "Task", 
      placeholder: "e.g., Analyze this dataset and identify key trends, Write a compelling story",
      icon: Target,
      description: "Specify the main objective"
    },
    { 
      id: "context", 
      label: "Context", 
      placeholder: "Provide relevant background information, constraints, or domain knowledge",
      icon: FileText,
      description: "Add background information"
    },
    { 
      id: "reasoning", 
      label: "Reasoning", 
      placeholder: "e.g., Think step by step, Show your work, Explain your methodology",
      icon: Zap,
      description: "Guide the thinking process"
    },
    { 
      id: "format", 
      label: "Output Format", 
      placeholder: "e.g., Table with headers, JSON structure, Bullet points, Executive summary",
      icon: Settings,
      description: "Specify how you want the response structured"
    }
  ];

  const isComplete = Object.values(form).every(value => value.trim().length > 0);
  const wordCount = fullPrompt.trim().split(/\s+/).length;

  const tips = [
    "Be specific about expertise level and domain knowledge",
    "Include constraints, requirements, and success criteria",
    "Ask for step-by-step reasoning for complex tasks",
    "Specify exact output format (JSON, table, bullets, etc.)",
    "Provide relevant context and background information",
    "Use examples to clarify expectations",
    "Break complex tasks into smaller components"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Zap size={32} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              PromptForge
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Craft powerful prompts with expert roles, templates, and smart organization
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-400/50 rounded-lg hover:bg-purple-500/30 transition-all"
          >
            <BookOpen size={16} />
            Templates
          </button>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all"
          >
            <Star size={16} />
            Saved ({savedPrompts.length})
          </button>
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 rounded-lg hover:bg-yellow-500/30 transition-all"
          >
            <Lightbulb size={16} />
            Tips
          </button>
          <button
            onClick={savePreferences}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition-all"
          >
            <User size={16} />
            Save as Default
          </button>
        </div>

        {/* Templates Panel */}
        {showTemplates && (
          <div className="mb-8 bg-purple-900/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Quick Templates</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => loadTemplate(template)}
                  className="p-4 bg-purple-800/30 border border-purple-500/30 rounded-xl hover:bg-purple-700/40 transition-all text-left"
                >
                  <h4 className="font-semibold text-purple-200 mb-2">{template.name}</h4>
                  <p className="text-sm text-purple-300/70">{template.role}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saved Prompts Panel */}
        {showSaved && (
          <div className="mb-8 bg-blue-900/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-blue-300 mb-4">Saved Prompts</h3>
            {savedPrompts.length === 0 ? (
              <p className="text-gray-400">No saved prompts yet. Create and save your first prompt!</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {savedPrompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center justify-between p-3 bg-blue-800/30 border border-blue-500/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-200">{prompt.name}</h4>
                      <p className="text-sm text-blue-300/70">{prompt.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadPrompt(prompt)}
                        className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded hover:bg-blue-500/50 transition-all text-sm"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        className="px-3 py-1 bg-red-500/30 text-red-200 rounded hover:bg-red-500/50 transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips Panel */}
        {showTips && (
          <div className="mb-8 bg-yellow-900/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">💡 Best Practices</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-yellow-100">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role Dropdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-gray-700 hover:border-cyan-400/70 transition-all duration-300 rounded-2xl p-6 relative z-50">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full transition-colors ${
                  form.role ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'
                }`}>
                  <Brain size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-cyan-300">Role</h3>
                    {form.role && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Choose who the AI should act as</p>
                  <div className="relative">
                    <button
                      onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                      className="w-full p-4 rounded-xl bg-gray-900/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all flex items-center justify-between"
                    >
                      <span className={form.role ? 'text-white' : 'text-gray-500'}>
                        {form.role || 'Select an expert role...'}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {roleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-600 rounded-xl max-h-60 overflow-y-auto z-[9999] shadow-2xl">
                        {expertRoles.map((role, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleRoleSelect(role)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-700 last:border-b-0"
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Form Sections */}
            {sections.map((section, idx) => {
              const IconComponent = section.icon;
              const isActive = activeSection === section.id;
              const hasContent = form[section.id].length > 0;
              
              return (
                <div
                  key={section.id}
                  className={`group bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-2xl p-6 ${
                    isActive 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 scale-[1.02]' 
                      : hasContent
                      ? 'border-green-400/50 hover:border-cyan-400/70'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full transition-colors ${
                      hasContent ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-cyan-300">
                          {section.label}
                        </h3>
                        {hasContent && (
                          <div className="flex items-center gap-1 text-green-400">
                            <Check size={16} />
                            <span className="text-sm">{form[section.id].length} chars</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{section.description}</p>
                      <textarea
                        rows={3}
                        value={form[section.id]}
                        onChange={(e) => handleChange(section.id, e.target.value)}
                        onFocus={() => setActiveSection(section.id)}
                        onBlur={() => setActiveSection(null)}
                        placeholder={section.placeholder}
                        className="w-full p-4 rounded-xl bg-gray-900/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <FileText size={20} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400">Preview</h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  isComplete ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'
                }`}></div>
              </div>
              
              <div className="mb-4">
                <span className="text-sm text-gray-400">
                  {wordCount} words • {isComplete ? 'Complete ✅' : 'In progress'}
                </span>
              </div>
              
              <div className="bg-gray-900/60 rounded-xl p-4 mb-4 min-h-[300px]">
                {fullPrompt.trim() ? (
                  <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {fullPrompt}
                  </pre>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <FileText size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Your prompt will appear here...</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  disabled={!fullPrompt.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 hover:bg-cyan-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied to Clipboard ✅
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Prompt
                    </>
                  )}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={savePrompt}
                    disabled={!isComplete}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Star size={14} />
                    Save
                  </button>
                  <button
                    onClick={exportToFile}
                    disabled={!fullPrompt.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-300 border border-purple-400/50 rounded-lg hover:bg-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Download size={14} />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}