import React, { useState, useRef, useEffect } from 'react';
import { useOperational } from '../../context/OperationalContext';
import { queryEventFlowAi, AiResponse, SpatialCardData } from '../../services/api';
import {
  X,
  Sparkles,
  Send,
  Database,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
  DoorOpen,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: {
    source: string;
    location: string;
    updated: string;
    metricValue?: string | number;
  }[];
  spatialCard?: SpatialCardData;
  suggestedAction?: string;
}

export const EventFlowAssistant: React.FC = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    eventMeta,
    zones,
    gates,
    incidents,
    crew,
    parking,
    systemHealth,
    applyRecommendation,
    addToast,
  } = useOperational();

  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Good day, Operations Commander. I am the **EventFlow AI Assistant**, grounded in live telemetry across Wankhede Stadium (8 Sections, 8 Perimeter Gates, and 4 External Mobility Zones).\n\nAsk me about turnstile bottlenecks, section compression, external arrival corridors, or crew deployments.',
      timestamp: '19:32',
      sources: [
        { source: 'ai_dataset #4182', location: 'Wankhede Ground Mesh', updated: 'Just now' }
      ],
      spatialCard: {
        title: 'GATE C1',
        subtitle: 'C BLOCK',
        status: 'CONGESTED',
        metric: '1,480 flow/min • 1,420 queue',
        recommendation: '→ Recommended: Gate A1 & Gate D1',
        lat: 18.9365,
        lng: 72.8270,
      },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAiAssistantOpen]);

  if (!isAiAssistantOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response: AiResponse = await queryEventFlowAi(q, {
        event: eventMeta,
        zones,
        gates,
        incidents,
        crew,
        parking,
      });

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sourceReferences,
        spatialCard: response.spatialCard,
        suggestedAction: response.suggestedAction,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: '⚠️ The AI context pipeline is temporarily operating in degraded mode. The manager command dashboard remains fully operational with direct database sensors.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'Which gate is currently most congested?',
    'What should we do about Section C2 / Block C?',
    'Show me 4 external zones status',
    'Which sections are approaching capacity?',
    'Why did you recommend redirecting visitors?',
    'How many medical teams are available?',
    'Show me all critical alerts',
  ];

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white/85 backdrop-blur-2xl border-l border-white/60 shadow-elevated flex flex-col animate-in slide-in-from-right duration-300 text-[#2B211B]"
      role="dialog"
      aria-label="EventFlow AI Assistant"
    >
      {/* Header — Apple Liquid Glass */}
      <div className="p-4 sm:p-5 border-b border-[#E3DDD2]/60 bg-white/40 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2B211B] text-[#F6F3ED] flex items-center justify-center shadow-glass">
            <Sparkles className="w-5 h-5 text-[#B66A4C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#2B211B]">
                EventFlow <span className="text-[#B66A4C]">Assistant</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                DATABASE LINKED
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#806C5D] block">
              Grounded in 8 Gates • 8 Sections • 4 External Zones
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAiAssistantOpen(false)}
          className="w-9 h-9 rounded-xl hover:bg-[#EEE9DF]/70 border border-transparent hover:border-[#E3DDD2] flex items-center justify-center text-[#806C5D] hover:text-[#2B211B] transition-colors cursor-pointer"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {msg.sender === 'assistant' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-[#B66A4C]" />
                  <span className="text-[10px] font-mono font-bold text-[#806C5D]">EVENTFLOW AI</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mono font-bold text-[#806C5D]">COMMANDER</span>
                  <User className="w-3.5 h-3.5 text-[#2B211B]" />
                </>
              )}
              <span className="text-[9px] font-mono text-[#806C5D]/60">• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[92%] sm:max-w-[88%] whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#2B211B] text-white shadow-soft rounded-tr-none'
                  : 'bg-white/70 backdrop-blur-xl text-[#2B211B] border border-white/80 shadow-soft rounded-tl-none font-sans'
              }`}
            >
              {msg.text}

              {/* Compact Apple Liquid Glass Spatial Response Card */}
              {msg.spatialCard && (
                <div className="mt-3 p-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-glass text-[#2B211B] space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#E3DDD2]/60">
                    <span className="text-xs font-mono font-black tracking-tight text-[#2B211B]">
                      {msg.spatialCard.title}
                    </span>
                    <span className="text-[9px] font-mono font-black text-[#806C5D] bg-[#F6F3ED] px-1.5 py-0.5 rounded uppercase">
                      {msg.spatialCard.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        msg.spatialCard.status === 'CRITICAL' || msg.spatialCard.status === 'CONGESTED'
                          ? 'bg-[#DC2626] animate-pulse'
                          : msg.spatialCard.status === 'HIGH' || msg.spatialCard.status === 'BUSY' || msg.spatialCard.status === 'ELEVATED'
                          ? 'bg-[#D97706]'
                          : 'bg-[#2E7D32]'
                      }`}
                    />
                    <span className="text-[10px] font-mono font-black uppercase text-[#2B211B]">
                      {msg.spatialCard.status}
                    </span>
                    <span className="text-[10px] font-mono text-[#806C5D]">
                      • {msg.spatialCard.metric}
                    </span>
                  </div>

                  {msg.spatialCard.recommendation && (
                    <div className="pt-1.5 border-t border-[#E3DDD2]/50 text-[10px] font-mono font-bold text-[#B66A4C] flex items-center gap-1">
                      <span>{msg.spatialCard.recommendation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Source References Pillbox (Explainability) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#E3DDD2]/70 space-y-1">
                  <span className="text-[9px] font-mono font-bold text-[#806C5D] uppercase flex items-center gap-1">
                    <Database className="w-3 h-3 text-[#B66A4C]" /> GROUNDED DATA SOURCES:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {msg.sources.map((src, i) => (
                      <div
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/80 border border-[#E3DDD2] text-[9px] font-mono text-[#5A4638] flex items-center gap-1"
                      >
                        <span className="font-semibold">{src.source}</span>
                        <span>({src.location})</span>
                        {src.metricValue && <span className="font-bold text-[#2B211B]">[{src.metricValue}]</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Action Button if present */}
              {msg.suggestedAction && (
                <div className="mt-2.5 p-2 rounded-xl bg-white/80 border border-[#B66A4C]/30 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#5A4638] font-medium truncate">
                    {msg.suggestedAction}
                  </span>
                  <button
                    onClick={() => {
                      applyRecommendation('rec-001');
                      addToast('success', 'Directive Mobilized', 'Operational flow redistribution deployed.');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#2B211B] hover:bg-[#3d2f26] text-white text-[10px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    Execute
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-[#E3DDD2] w-48 text-xs font-mono text-[#806C5D]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B66A4C]" />
            <span>Consulting ai_dataset...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 border-t border-[#E3DDD2]/60 bg-white/40 backdrop-blur-md overflow-x-auto">
        <span className="text-[9px] font-mono font-bold text-[#806C5D] uppercase block mb-1.5">
          SUGGESTED OPERATIONAL INQUIRIES
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {sampleQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(query)}
              className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-[#E3DDD2] text-[10px] font-mono font-medium text-[#2B211B] whitespace-nowrap transition-colors cursor-pointer shadow-xs"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-[#E3DDD2]/60 bg-white/60 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask EventFlow AI about gates, sections, external zones..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/80 border border-[#E3DDD2] text-xs text-[#2B211B] focus:outline-none focus:border-[#B66A4C] transition-colors placeholder:text-[#806C5D]"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#2B211B] hover:bg-[#3d2f26] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
