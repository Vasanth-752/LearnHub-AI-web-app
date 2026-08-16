import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Plus, CheckCircle2, ArrowRight, Sparkles, MessageSquare, Bot } from 'lucide-react';
import { ChatConversation, ChatMessage, ThemeMode, NavigationTab } from '../types';

interface AiChatViewProps {
  conversations: ChatConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onNavigateToRoadmap: (roadmapId?: string) => void;
  theme: ThemeMode;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onSendMessage,
  onNavigateToRoadmap,
  theme,
}) => {
  const isAbyssal = theme === 'abyssal';
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isSending]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const msg = inputText;
    setInputText('');
    setIsSending(true);

    try {
      await onSendMessage(msg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Group conversations by category
  const categories = Array.from(
    new Set(conversations.map((c) => c.category || 'GENERAL'))
  );

  return (
    <div className="flex-1 flex h-full overflow-hidden animate-fadeIn">
      {/* Sub-Sidebar: Categorized Chat History matching Image 7 */}
      <div
        id="chat-history-sidebar"
        className={`w-64 border-r flex flex-col p-4 space-y-4 overflow-y-auto shrink-0 ${
          isAbyssal
            ? 'bg-[#0E1520] border-[#1F2C3F]'
            : 'bg-[#F5EFE3] border-[#E2D8C6]'
        }`}
      >
        {/* + New Conversation button */}
        <button
          id="btn-new-conversation"
          onClick={onNewConversation}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#293B52] text-[#F8FAFC] hover:bg-[#1E293B]'
              : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] hover:bg-[#F2ECE0]'
          }`}
        >
          <Plus size={14} />
          <span>New Conversation</span>
        </button>

        {/* Categorized List */}
        <div className="space-y-5 flex-1 overflow-y-auto">
          {categories.map((category) => {
            const categoryConvs = conversations.filter((c) => c.category === category);
            return (
              <div key={category} className="space-y-1.5">
                <h4 className="text-[10px] font-bold tracking-wider uppercase text-[#475569] dark:text-[#94A3B8] px-2">
                  {category}
                </h4>
                <div className="space-y-0.5">
                  {categoryConvs.map((conv) => {
                    const isActive = conv.id === activeConversation?.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => onSelectConversation(conv.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors truncate ${
                          isActive
                            ? isAbyssal
                              ? 'bg-[#1E293B] text-[#38BDF8]'
                              : 'bg-[#E5DCB] text-[#0F172A]'
                            : isAbyssal
                            ? 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                            : 'text-[#475569] hover:bg-[#EAE0CF] hover:text-[#0F172A]'
                        }`}
                      >
                        {conv.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF6EE] dark:bg-[#0B111A]">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 max-w-4xl mx-auto w-full">
          {/* Timestamp Header */}
          <div className="text-center">
            <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
              Today, 10:42 AM
            </span>
          </div>

          {activeConversation?.messages.map((message) => {
            const isUser = message.sender === 'user';

            if (isUser) {
              return (
                <div key={message.id} className="flex justify-end">
                  <div
                    className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-2xs ${
                      isAbyssal
                        ? 'bg-[#1E293B] text-[#F8FAFC] border border-[#334155]'
                        : 'bg-[#EAE0CF] text-[#0F172A] border border-[#D6CBB8]'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            }

            // AI Message with avatar & rich sections
            return (
              <div key={message.id} className="flex items-start gap-4">
                {/* AI Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-serif text-sm font-bold shrink-0 mt-1 shadow-2xs ${
                    isAbyssal
                      ? 'bg-[#1E293B] text-[#38BDF8] border border-[#334155]'
                      : 'bg-[#182736] text-[#FAF6EE]'
                  }`}
                >
                  L
                </div>

                <div className="flex-1 space-y-4 max-w-2xl text-sm text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed">
                  <div className="text-xs font-bold text-[#182736] dark:text-[#38BDF8]">
                    LearnHub AI
                  </div>

                  {/* Body Text */}
                  <div className="space-y-3 prose prose-stone dark:prose-invert max-w-none text-[#1E293B] dark:text-[#E2E8F0]">
                    {message.text.split('\n\n').map((block, idx) => {
                      if (block.startsWith('### ') || block.startsWith('## ')) {
                        return (
                          <h4
                            key={idx}
                            className="font-serif text-base font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] pt-1"
                          >
                            {block.replace(/^###\s*|^##\s*/, '')}
                          </h4>
                        );
                      }
                      if (block.startsWith('- ') || block.startsWith('* ')) {
                        const items = block.split('\n').filter((l) => l.trim().length > 0);
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs text-[#1E293B] dark:text-[#E2E8F0]">
                            {items.map((it, i) => (
                              <li key={i}>{it.replace(/^[-*]\s*/, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx} className="text-xs leading-relaxed text-[#1E293B] dark:text-[#E2E8F0] font-normal">{block}</p>;
                    })}
                  </div>

                  {/* Embedded Roadmap Created Card (Matching Screenshot 7) */}
                  {message.roadmapCard && (
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all shadow-2xs ${
                        isAbyssal
                          ? 'bg-[#151F2E] border-[#293B52]'
                          : 'bg-[#FCF7ED] border-[#E2D4BF]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#182736] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] flex items-center justify-center text-xs font-bold shrink-0">
                          ✓
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#9A4C1C] dark:text-[#38BDF8] uppercase tracking-wider">
                            Roadmap Created
                          </p>
                          <p className="text-xs font-serif font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                            {message.roadmapCard.title}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateToRoadmap(message.roadmapCard?.actionId)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors shadow-2xs shrink-0 ${
                          isAbyssal
                            ? 'bg-[#1E293B] border-[#334155] text-[#38BDF8] hover:bg-[#28384E]'
                            : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        View Roadmap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isSending && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#182736] text-[#FAF6EE] flex items-center justify-center font-serif text-sm font-bold">
                L
              </div>
              <div className="p-3.5 rounded-xl bg-[#F2ECE0] dark:bg-[#151F2E] text-xs flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Deconstructing concept with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area matching Image 7 */}
        <div className="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-2">
          <form
            onSubmit={handleSend}
            className={`flex items-center gap-2 p-2 pl-4 rounded-xl border shadow-xs transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#293B52] focus-within:border-[#38BDF8]'
                : 'bg-[#FFFDF9] border-[#DDD2C0] focus-within:border-[#0F172A]'
            }`}
          >
            <input
              id="input-chat-message"
              type="text"
              placeholder="Message LearnHub AI..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs md:text-sm bg-transparent border-none outline-none font-medium text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#64748B]"
            />

            {/* Attachment File Input */}
            <label
              className="p-2 text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Attach File or Excerpt"
            >
              <Paperclip size={17} />
              <input
                type="file"
                accept=".txt,.md,.js,.ts,.tsx,.json,.py"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      setInputText((prev) => (prev ? `${prev}\n\n[Attached: ${file.name}]\n${content}` : `[Attached: ${file.name}]\n${content}`));
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>

            {/* Send Button */}
            <button
              id="btn-send-chat"
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`p-2 rounded-lg text-white transition-all shadow-xs active:scale-95 ${
                !inputText.trim() || isSending
                  ? 'bg-neutral-400 dark:bg-neutral-700 opacity-50 cursor-not-allowed'
                  : 'bg-[#182736] dark:bg-[#38BDF8] dark:text-[#0F172A] hover:opacity-90'
              }`}
            >
              <Send size={15} />
            </button>
          </form>

          <p className="text-center text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};
