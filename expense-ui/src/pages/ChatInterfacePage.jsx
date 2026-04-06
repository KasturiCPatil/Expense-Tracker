import React, { useState, useRef, useEffect } from 'react';
import { Send, HeadphonesIcon } from 'lucide-react';

export default function ChatInterfacePage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi! I am your HR Expeditor Bot 🎧.\nPlease select the category of your issue below so I can route you to a Live Agent:", 
      sender: 'bot', 
      options: ["Issue related to receipts", "Grade limit", "Expense capture", "Other"] 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  // 0: awaiting option, 1: awaiting detail, 2: awaiting phone number, 3: done
  const [selectedIssue, setSelectedIssue] = useState('');
  
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text, options = null) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot', options }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
  };

  const handleOptionSelect = (option) => {
    if (currentStep !== 0) return;
    addUserMessage(option);
    setSelectedIssue(option);
    setCurrentStep(1);
    setLoading(true);
    
    setTimeout(() => {
      addBotMessage(`You selected "${option}".\nPlease briefly describe your specific issue regarding this topic in the text box below:`);
      setLoading(false);
    }, 600);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (currentStep === 0) return; // Must select an option first

    const userText = inputValue;
    addUserMessage(userText);
    setInputValue('');
    setLoading(true);

    if (currentStep === 1) {
      // Finished giving details, ask for phone
      setCurrentStep(2);
      setTimeout(() => {
        addBotMessage("Thank you for the details. Our human support group will contact you live to resolve this.\n\nPlease type your Phone Number below so an agent can call you:");
        setLoading(false);
      }, 800);
    } else if (currentStep === 2) {
      // Finished giving phone, complete
      setCurrentStep(3);
      setTimeout(() => {
         addBotMessage(`Thank you! We have registered your number (${userText}).\n\nAn agent specializing in "${selectedIssue}" will contact you shortly. You may now close this window.`);
         setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-brand-600 px-6 py-5 flex items-center justify-between border-b border-brand-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30">
             <HeadphonesIcon size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-white tracking-wide">Live Support Intake</h2>
            <p className="text-brand-100 text-xs flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Routing to Support Agents</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-3xl px-6 py-4 shadow-sm text-[15px] leading-relaxed ${msg.sender === 'user' ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            
            {/* Render options if the bot provided them and we are at step 0 */}
            {msg.options && currentStep === 0 && (
              <div className="mt-4 flex flex-wrap gap-2 max-w-[85%]">
                {msg.options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleOptionSelect(opt)}
                    className="bg-white border border-brand-200 text-brand-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-50 hover:border-brand-300 transition-colors shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-brand-400 rounded-3xl rounded-tl-sm px-6 py-4 shadow-sm flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white px-6 pb-6 pt-4 border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-3 relative">
          <input 
            type={currentStep === 2 ? "tel" : "text"}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={
              currentStep === 0 ? "Please click an option above ↑" : 
              currentStep === 1 ? "Details about your issue..." : 
              currentStep === 2 ? "Enter your phone number..." : 
              "Chat session completed."
            }
            className={`flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none transition-all text-slate-700 ${currentStep === 0 || currentStep === 3 ? 'opacity-50 cursor-not-allowed' : 'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'}`}
            disabled={loading || currentStep === 0 || currentStep === 3}
          />
          <button 
            type="submit" 
            className="bg-brand-600 hover:bg-brand-700 text-white w-14 rounded-2xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center"
            disabled={loading || currentStep === 0 || currentStep === 3 || !inputValue.trim()}
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
