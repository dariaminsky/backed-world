import React, { useState, createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { Share2, Copy, CheckCircle, XCircle, Gift, Users, TrendingUp, Lightbulb, DollarSign, ExternalLink, Info, Check, Globe, Rocket, PartyPopper, Search, Eye, Edit3, ChevronLeft, PlusCircle, Trash2, Send, Brain, Sparkles, RefreshCw, Zap, Edit, Image as ImageIcon, UserCircle, Palette, UploadCloud } from 'lucide-react';

// Backed App: Style constants remain largely the same
const C3_PRIMARY_BLACK = '#000000';
const C3_LIGHT_BG = '#F9FAFB'; 
const C3_CARD_BG_LIGHT = '#FFFFFF';
const C3_TEXT_PRIMARY_LIGHT = '#111827'; 
const C3_TEXT_SECONDARY_LIGHT = '#6B7280';
const C3_BORDER_LIGHT = '#E5E7EB'; 
const C3_LOGO_HIGHLIGHT = '#22D3EE'; // Keeping logo colors for now, can be updated if "Backed" has new branding
const C3_LOGO_MID = '#00A9E0';
const C3_LOGO_BASE = '#3B82F6';
const C3_ACCENT_COLOR = C3_LOGO_MID;
const C3_ACCENT_BACKGROUND_ALPHA = '33'; 
const C3_ERROR_RED = '#EF4444';
const C3_SUCCESS_GREEN = '#10B981';

// LocalStorage Keys - Prefixed with "backed"
const LOCALSTORAGE_PAGES_KEY = 'backedSupportPages'; 
const LOCALSTORAGE_SUPPORTED_KEY = 'backedSupportedPages';
const LOCALSTORAGE_CREATOR_VERIFIED_KEY = 'backedCreatorVerified'; 
const LOCALSTORAGE_BUDGET_ITEMS_KEY = 'backedBudgetItems';
const LOCALSTORAGE_AI_BUDGET_GENERATED_KEY = 'backedAIBudgetGenerated';


// --- App Context for State Management ---
const AppContext = createContext();

const throttle = (func, delay) => {
  let timeoutId = null;
  let lastArgs = null;
  return (...args) => {
    lastArgs = args;
    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        func(...lastArgs);
        timeoutId = null;
      }, delay);
    }
  };
};


const AppProvider = ({ children }) => {
  const [screen, setScreen] = useState('CreatorSetup');
  const [activeSupportPageId, setActiveSupportPageId] = useState(null); 
  const [isCreatorVerified, setIsCreatorVerified] = useState(() => {
    try {
      const storedVerified = localStorage.getItem(LOCALSTORAGE_CREATOR_VERIFIED_KEY);
      return storedVerified ? JSON.parse(storedVerified) : false;
    } catch (error) { console.error("Error loading creator verification status:", error); return false; }
  });

  const [supportPages, setSupportPages] = useState(() => {
    try {
      const storedPages = localStorage.getItem(LOCALSTORAGE_PAGES_KEY); 
      return storedPages ? new Map(JSON.parse(storedPages)) : new Map();
    } catch (error) { console.error("Error loading support pages:", error); return new Map(); }
  });
  const [supportedByMe, setSupportedByMe] = useState(() => {
    try {
      const storedSupported = localStorage.getItem(LOCALSTORAGE_SUPPORTED_KEY);
      return storedSupported ? new Set(JSON.parse(storedSupported)) : new Set();
    } catch (error) { console.error("Error loading supported pages:", error); return new Set(); }
  });

  const [budgetItems, setBudgetItems] = useState(() => {
    try {
      const storedBudget = localStorage.getItem(LOCALSTORAGE_BUDGET_ITEMS_KEY);
      return storedBudget ? new Map(JSON.parse(storedBudget)) : new Map();
    } catch (error) { console.error("Error loading budget items:", error); return new Map(); }
  });
  const [aiBudgetGeneratedForToken, setAiBudgetGeneratedForToken] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_AI_BUDGET_GENERATED_KEY);
      return stored ? new Map(JSON.parse(stored)) : new Map();
    } catch (error) { console.error("Error loading AI budget status:", error); return new Map(); }
  });

  const [toast, setToast] = useState(null);

  const throttledSetSupportPages = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_PAGES_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);
  const throttledSetSupported = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_SUPPORTED_KEY, JSON.stringify(Array.from(value))), 500), []);
  const throttledSetCreatorVerified = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_CREATOR_VERIFIED_KEY, JSON.stringify(value)), 500), []);
  const throttledSetBudgetItems = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_BUDGET_ITEMS_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);
  const throttledSetAIBudgetGenerated = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_AI_BUDGET_GENERATED_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);


  useEffect(() => { throttledSetSupportPages(supportPages); }, [supportPages, throttledSetSupportPages]);
  useEffect(() => { throttledSetSupported(supportedByMe); }, [supportedByMe, throttledSetSupported]);
  useEffect(() => { throttledSetCreatorVerified(isCreatorVerified); }, [isCreatorVerified, throttledSetCreatorVerified]);
  useEffect(() => { throttledSetBudgetItems(budgetItems); }, [budgetItems, throttledSetBudgetItems]);
  useEffect(() => { throttledSetAIBudgetGenerated(aiBudgetGeneratedForToken); }, [aiBudgetGeneratedForToken, throttledSetAIBudgetGenerated]);


  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, key: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigateTo = useCallback((screenName, pageId = null) => {
    setScreen(screenName);
    if (pageId !== undefined) { 
        setActiveSupportPageId(pageId);
    }
  }, []);

  const toggleCreatorVerified = useCallback(() => {
    setIsCreatorVerified(prev => {
        const newState = !prev;
        if (newState) {
            showToast('Creator Verified!', 'success');
        } else {
            showToast('Creator verification removed.', 'info'); 
        }
        return newState;
    });
  }, [showToast]);

  const createSupportPage = useCallback((pageDetails) => {
    if (!isCreatorVerified) {
        showToast('Please verify as a creator first to create a Support Page.', 'error');
        return;
    }
    const newId = `page_${Date.now()}`;
    const newPage = { 
        ...pageDetails, 
        id: newId, 
        creatorName: pageDetails.creatorName || "Anonymous Creator", 
        raised: 0, 
        supporters: 0, 
        useOfFunds: pageDetails.description,
        completionRate: 1.0,
        onTimeDelivery: 1.0,
    };
    setSupportPages(prev => new Map(prev).set(newId, newPage));
    setActiveSupportPageId(newId); 
    showToast('Your Support Page is live!', 'success');
    navigateTo('CreatorDashboard', newId); 
  }, [navigateTo, showToast, isCreatorVerified]);

  const supportPageAction = useCallback((pageIdToSupport) => {
    if (!supportPages.has(pageIdToSupport)) { showToast('Support Page not found.', 'error'); return false; }
    if (supportedByMe.has(pageIdToSupport)) { showToast('You have already supported this creator.', 'error'); navigateTo('SupportVerificationFlow', pageIdToSupport); return false; }

    const page = supportPages.get(pageIdToSupport);
    const updatedPage = { ...page, raised: page.raised + page.price, supporters: page.supporters + 1 };
    setSupportPages(prev => new Map(prev).set(pageIdToSupport, updatedPage));
    setSupportedByMe(prev => new Set(prev).add(pageIdToSupport));
    showToast('Thanks for your support!', 'success'); 
    navigateTo('SupportConfirmation', pageIdToSupport);
    return true;
  }, [supportPages, supportedByMe, navigateTo, showToast]);

  const copyToClipboard = useCallback((text, message = 'Link copied!') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(message,'success');
      })
      .catch(err => {
        console.error('Failed to copy with navigator.clipboard: ', err);
        try {
            const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
            ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            showToast(message, 'success');
        } catch (fallbackErr) {
            showToast('Failed to copy.', 'error'); 
            console.error('Fallback copy failed: ', fallbackErr);
        }
      });
  }, [showToast]);

  const addOrUpdateBudgetItem = useCallback((tokenId, itemData, itemIdToUpdate) => {
    setBudgetItems(prevBudgetItems => {
      const currentItems = prevBudgetItems.get(tokenId) || [];
      let updatedItems;
      if (itemIdToUpdate) { 
        updatedItems = currentItems.map(i => 
          i.id === itemIdToUpdate ? { ...i, ...itemData } : i 
        );
      } else { 
        const newItem = { ...itemData, id: `budget_${Date.now()}_${Math.random().toString(36).substr(2,5)}` };
        updatedItems = [...currentItems, newItem];
      }
      return new Map(prevBudgetItems).set(tokenId, updatedItems);
    });
  }, []);

  const setInitialBudgetForToken = useCallback((tokenId, itemsFromAI) => {
    const initialItems = itemsFromAI.map(item => ({
        description: item.description, 
        amount: item.amount, 
        aiEstimateNotes: item.aiEstimateNotes, 
        id: `budget_ai_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    }));
    setBudgetItems(prev => new Map(prev).set(tokenId, initialItems));
    setAiBudgetGeneratedForToken(prev => new Map(prev).set(tokenId, true));
  }, []);


  const removeBudgetItem = useCallback((tokenId, itemId) => {
    setBudgetItems(prev => {
      const current = prev.get(tokenId) || [];
      return new Map(prev).set(tokenId, current.filter(i => i.id !== itemId));
    });
  }, []);

  const contextValue = useMemo(() => ({
    screen, activeSupportPageId, supportPages, supportedByMe, toast, isCreatorVerified,
    budgetItems, aiBudgetGeneratedForToken,
    navigateTo, showToast, createSupportPage, supportPageAction, copyToClipboard,
    toggleCreatorVerified,
    addOrUpdateBudgetItem, removeBudgetItem, setInitialBudgetForToken
  }), [
    screen, activeSupportPageId, supportPages, supportedByMe, toast, isCreatorVerified, 
    budgetItems, aiBudgetGeneratedForToken, 
    navigateTo, showToast, createSupportPage, supportPageAction, copyToClipboard,
    toggleCreatorVerified,
    addOrUpdateBudgetItem, removeBudgetItem, setInitialBudgetForToken
  ]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// --- UI Components ---
const ToastNotification = ({ /* ... */ }) => {
  const { toast } = useContext(AppContext);
  if (!toast) return null;
  let bgColor, textColor;
  switch (toast.type) {
    case 'success': bgColor = `bg-[${C3_SUCCESS_GREEN}]`; textColor = 'text-white'; break;
    case 'error': bgColor = `bg-[${C3_ERROR_RED}]`; textColor = 'text-white'; break;
    default: bgColor = `bg-gray-700`; textColor = 'text-white';
  }
  return (
    <div className={`fixed top-5 right-5 ${bgColor} ${textColor} p-3.5 rounded-md shadow-lg z-50 animate-slide-in-down flex items-center text-sm`}>
      {toast.type === 'success' && <CheckCircle size={16} className="mr-2" />}
      {toast.type === 'error' && <XCircle size={16} className="mr-2" />}
      {toast.type === 'info' && <Info size={16} className="mr-2" />}
      <span>{toast.message}</span>
    </div>
  );
};

const GradientSphereLogo = ({ size = 28 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 30% 25%, ${C3_LOGO_HIGHLIGHT} 0%, ${C3_LOGO_MID} 35%, ${C3_LOGO_BASE} 80%)`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.15)', 
    }}
    className="mr-2"
  />
);

const Header = () => {
  const { navigateTo, screen } = useContext(AppContext);
  return (
    <header className={`p-4 border-b`} style={{ backgroundColor: C3_PRIMARY_BLACK, borderColor: '#333' }}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => navigateTo('CreatorSetup')}>
          <GradientSphereLogo />
          {/* App Name Update */}
          <h1 className={`text-xl font-semibold text-white`}>Backed</h1>
        </div>
        <nav className="flex items-center space-x-2">
            {screen !== 'DiscoveryScreen' && (
                 <button
                    onClick={() => navigateTo('DiscoveryScreen')}
                    className={`text-sm py-2 px-3 rounded-md hover:bg-gray-700 flex items-center text-white font-medium`}
                    style={{ backgroundColor: '#2D3748' }} >
                    <Search size={16} className="mr-1.5" /> Discover
                </button>
            )}
             <button
                onClick={() => navigateTo('CreatorDashboard')}
                className={`text-sm py-2 px-3 rounded-md hover:bg-gray-700 flex items-center border font-medium text-gray-300`}
                style={{ borderColor: '#4A5568' }} >
                Dashboard
            </button>
        </nav>
      </div>
    </header>
  );
};

const ProgressBar = ({ current, total, label, small = false }) => { 
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className={small ? "my-0.5" : "my-1"}>
      {label && <p className={`text-xs font-medium mb-1`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>{label}</p>}
      <div className={`w-full rounded-full ${small ? 'h-1' : 'h-1.5'}`} style={{backgroundColor: C3_BORDER_LIGHT}}>
        <div className={`${small ? 'h-1' : 'h-1.5'} rounded-full`} style={{ width: `${percentage}%`, background: `linear-gradient(to right, ${C3_LOGO_MID}, ${C3_LOGO_BASE})` }}></div>
      </div>
      {!small && total > 0 && ( 
          <p className={`text-xs mt-1 text-right`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>
            ${current.toLocaleString()} / ${total.toLocaleString()} USDC
          </p>
      )}
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, options, required = false, error }) => (
  <div className="mb-2">
    <label htmlFor={name} className={`block text-xs font-medium mb-1`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>
      {label} {required && <span style={{ color: C3_ERROR_RED }}>*</span>}
    </label>
    <select
      id={name} name={name} value={value} onChange={onChange} required={required}
      className={`w-full p-2.5 rounded-md border outline-none focus:ring-1 focus:ring-opacity-75 text-sm ${error ? `border-[${C3_ERROR_RED}] focus:ring-[${C3_ERROR_RED}]` : `border-[${C3_BORDER_LIGHT}] focus:ring-[${C3_ACCENT_COLOR}]`}`} 
      style={{ backgroundColor: C3_CARD_BG_LIGHT, color: C3_TEXT_PRIMARY_LIGHT }}
    >
      <option value="">-- Select --</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <p className="text-xs mt-1" style={{ color: C3_ERROR_RED }}>{error}</p>}
  </div>
);


const InputField = ({ label, type = 'text', value, onChange, placeholder, name, required = false, step, error, as = "input", children }) => {
  const commonProps = {
    id: name, name: name, value: value, onChange: onChange, placeholder: placeholder, required: required,
    className: `w-full p-2.5 rounded-md border outline-none focus:ring-1 focus:ring-opacity-75 text-sm ${error ? `border-[${C3_ERROR_RED}] focus:ring-[${C3_ERROR_RED}]` : `border-[${C3_BORDER_LIGHT}] focus:ring-[${C3_ACCENT_COLOR}]`}`, 
    style: { backgroundColor: C3_CARD_BG_LIGHT, color: C3_TEXT_PRIMARY_LIGHT }
  };
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={name} className={`block text-xs font-medium`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>
          {label} {required && <span style={{ color: C3_ERROR_RED }}>*</span>}
        </label>
        {children} 
      </div>
      {as === "textarea" ? (
        <textarea {...commonProps} rows={as === "textarea" && type === "small" ? 2 : 3} /> 
      ) : (
        <input type={type} step={step} {...commonProps} />
      )}
      {error && <p className="text-xs mt-1" style={{ color: C3_ERROR_RED }}>{error}</p>}
    </div>
  );
};

const Button = ({ onClick, children, primary = false, className = '', type = 'button', disabled = false, icon: IconComponent, small = false }) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`font-medium shadow-sm transition-opacity duration-200 flex items-center justify-center ${primary ? `text-white` : `border`} ${disabled ? 'opacity-50 cursor-not-allowed' : `hover:opacity-90`} ${small ? 'py-1 px-2 text-xs rounded' : 'w-full py-2.5 px-4 rounded-md text-sm'} ${className}`} 
    style={{ backgroundColor: primary ? C3_PRIMARY_BLACK : 'transparent', color: primary ? (disabled ? C3_TEXT_SECONDARY_LIGHT : 'white') : C3_ACCENT_COLOR, borderColor: primary ? 'transparent' : C3_BORDER_LIGHT }} 
  >
    {IconComponent && <IconComponent size={small ? 12 : 16} className="mr-1.5" />} 
    {children}
  </button>
);

const Card = ({ children, className = "", ...rest }) => (
  <div 
    className={`p-4 md:p-6 rounded-xl border shadow-sm ${className}`} 
    style={{ backgroundColor: C3_CARD_BG_LIGHT, borderColor: C3_BORDER_LIGHT }}
    {...rest}
  >
    {children}
  </div>
);

// --- Screen Components ---
const CreatorSetupScreen = () => {
  const { createSupportPage, showToast, isCreatorVerified, toggleCreatorVerified } = useContext(AppContext);
  const [formData, setFormData] = useState({ 
    creatorName: '', tokenName: '', price: '', goal: '', description: '', utility: '',
    creatorAvatarData: null, projectImageData: null 
  });
  const [errors, setErrors] = useState({});
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState([]);
  const [isGeneratingPerks, setIsGeneratingPerks] = useState(false);
  const [perkSuggestions, setPerkSuggestions] = useState([]);

  const [generatedAvatarData, setGeneratedAvatarData] = useState(formData.creatorAvatarData);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generatedProjectImageData, setGeneratedProjectImageData] = useState(formData.projectImageData);
  const [isGeneratingProjectImage, setIsGeneratingProjectImage] = useState(false);

  useEffect(() => {
    if (formData.creatorName.trim() && !generatedAvatarData && !isGeneratingAvatar) {
      handleGenerateAvatar(true); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.creatorName]); 

  useEffect(() => {
    if (formData.tokenName.trim() && !generatedProjectImageData && !isGeneratingProjectImage) {
      handleGenerateProjectImage(true); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.tokenName]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => { 
    const newErrors = {};
    if (!formData.creatorName.trim()) newErrors.creatorName = "Creator name is required.";
    if (!formData.tokenName.trim()) newErrors.tokenName = "Support Page Name is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) newErrors.price = "Contribution Amount must be a positive number.";
    if (formData.goal) {
      const goalNum = parseFloat(formData.goal);
      if (isNaN(goalNum) || goalNum < 0) newErrors.goal = "Funding goal must be a non-negative number.";
      else if (priceNum > 0 && goalNum > 0 && goalNum < priceNum) newErrors.goal = "Funding goal should be >= Contribution Amount.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyWorldId = () => {
    toggleCreatorVerified(); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCreatorVerified) {
        showToast('Please verify as a creator first.', 'error');
        return;
    }
    if (!validateForm()) { showToast('Please correct errors.', 'error'); return; }
    createSupportPage({ 
        ...formData, 
        price: parseFloat(formData.price), 
        goal: formData.goal ? parseFloat(formData.goal) : 0,
        creatorAvatarData: generatedAvatarData, 
        projectImageData: generatedProjectImageData,
    });
  };

  const callImagenAPI = async (prompt, setImageDataState, setLoadingState, imageTypeForToast, isAuto = false) => {
    setLoadingState(true);
    if (!isAuto) setImageDataState(null); 
    if (!isAuto) showToast(`✨ AI is generating ${imageTypeForToast}...`, "info");

    const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
    const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `Imagen API request failed: ${response.status}`);
      }
      const result = await response.json();
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        const imageData = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setImageDataState(imageData); 
        if (!isAuto) showToast(`✨ AI ${imageTypeForToast} generated!`, "success");
      } else {
        if (!isAuto) throw new Error(`AI did not return a valid ${imageTypeForToast}.`);
        else console.warn(`Auto-generation for ${imageTypeForToast} did not return image.`);
      }
    } catch (e) {
      console.error(`Error with Imagen API for ${imageTypeForToast}:`, e);
      if (!isAuto) showToast(`AI ${imageTypeForToast} generation error: ${e.message}`, "error");
    } finally {
      setLoadingState(false);
    }
  };

  const handleGenerateAvatar = (isAuto = false) => {
    if (!formData.creatorName.trim() && !isAuto) { 
      showToast("Please enter Creator Name first.", "error");
      return;
    }
    const prompt = `8-bit pixel art style avatar for a web3 creator named "${formData.creatorName || 'Creator'}". Simple, clean, modern, suitable for a small profile picture. Vibrant colors.`;
    callImagenAPI(prompt, setGeneratedAvatarData, setIsGeneratingAvatar, "avatar", isAuto);
  };

  const handleGenerateProjectImage = (isAuto = false) => {
    if (!formData.tokenName.trim() && !isAuto) {
      showToast("Please enter Support Page Name first.", "error");
      return;
    }
    const prompt = `8-bit pixel art style abstract banner image representing a creative project or support campaign called "${formData.tokenName || 'My Project'}". Modern, clean, optimistic, with subtle digital or network motifs. Suitable for a webpage banner. Tech-inspired.`;
    callImagenAPI(prompt, setGeneratedProjectImageData, setIsGeneratingProjectImage, "project image", isAuto);
  };


  const callGeminiForSuggestionsAPI = async (prompt, setSuggestionsState, setLoadingState, fieldNameForToast) => {
    setLoadingState(true);
    setSuggestionsState([]); 
    showToast(`✨ AI is brainstorming ${fieldNameForToast}...`, "info");
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            suggestions: {
              type: "ARRAY",
              items: { type: "STRING", description: "A single suggestion." }
            }
          },
          required: ["suggestions"]
        }
      }
    };
    const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `API request failed: ${response.status}`);
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
        if (parsedJson.suggestions && Array.isArray(parsedJson.suggestions)) {
          setSuggestionsState(parsedJson.suggestions);
          showToast(`✨ AI has some ${fieldNameForToast} ideas!`, "success");
        } else {
          throw new Error(`AI response for ${fieldNameForToast} was not in the expected format.`);
        }
      } else {
        throw new Error(`AI did not return valid ${fieldNameForToast} suggestions.`);
      }
    } catch (e) {
      console.error(`Error with AI for ${fieldNameForToast}:`, e);
      showToast(`AI error for ${fieldNameForToast}: ${e.message}`, "error");
      setSuggestionsState([]); 
    } finally {
      setLoadingState(false);
    }
  };

  const handleGenerateDescriptionSuggestions = () => {
    if (!formData.tokenName.trim()) {
      showToast("Please enter a Support Page Name first.", "error");
      return;
    }
    const prompt = `Generate 3 distinct, compelling, and concise project description suggestions (each 1-2 sentences) for a creator's support page named "${formData.tokenName}". The creator is ${formData.creatorName || 'an amazing creator'}. Focus on what the support helps fund or achieve.`;
    callGeminiForSuggestionsAPI(prompt, setDescriptionSuggestions, setIsGeneratingDesc, "descriptions");
  };

  const handleGeneratePerkSuggestions = () => {
    if (!formData.tokenName.trim() || !formData.description.trim()) {
        showToast("Please enter Support Page Name and Description first for perk ideas.", "error");
        return;
    }
    const prompt = `For a creator's support page named "${formData.tokenName}" which is about "${formData.description}", suggest 3-5 distinct and appealing perk ideas for supporters. Each perk should be a short phrase. Examples: "Early access to new content", "Exclusive Discord role", "Behind-the-scenes updates", "Personalized thank-you note", "Vote on future projects".`;
    callGeminiForSuggestionsAPI(prompt, setPerkSuggestions, setIsGeneratingPerks, "perks");
  };

  const SuggestionButtons = ({ suggestions, onSelect, fieldName }) => {
    if (!suggestions || suggestions.length === 0) return null;
    return (
      <div className="mt-2 mb-3 space-y-1">
        <p className="text-xs" style={{color: C3_TEXT_SECONDARY_LIGHT}}>AI Suggestions for {fieldName}:</p>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="w-full text-left text-xs p-2 rounded-md border hover:bg-gray-50 transition-colors"
            style={{borderColor: C3_BORDER_LIGHT, color: C3_TEXT_PRIMARY_LIGHT}}
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className={`text-2xl font-semibold mb-6 text-center`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Create Your Support Page</h2>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3"> 
          <InputField name="creatorName" label="Creator Name" value={formData.creatorName} onChange={handleChange} placeholder="Your name or alias" required error={errors.creatorName} />
          <div className="mb-2 flex items-center space-x-2">
            {generatedAvatarData ? (
              <img src={generatedAvatarData} alt="Creator Avatar" className="w-16 h-16 rounded-full object-cover border" />
            ) : isGeneratingAvatar ? (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">Generating...</div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"><UserCircle size={32} className="text-gray-400"/></div>
            )}
            <div className="flex flex-col space-y-1">
                <Button onClick={() => handleGenerateAvatar(false)} disabled={isGeneratingAvatar || !formData.creatorName.trim()} small icon={RefreshCw} className="w-auto">Regenerate Avatar</Button>
                <Button onClick={() => showToast("Upload functionality coming soon!", "info")} small icon={UploadCloud} className="w-auto">Upload Avatar</Button>
            </div>
          </div>

          <InputField name="tokenName" label="Support Page Name" value={formData.tokenName} onChange={handleChange} placeholder="e.g., My Art Fund" required error={errors.tokenName} />
           <div className="mb-2">
            {generatedProjectImageData ? (
                 <img src={generatedProjectImageData} alt="Project Banner" className="w-full h-32 object-cover rounded-md border" />
            ) : isGeneratingProjectImage ? (
                <div className="w-full h-32 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">Generating Project Image...</div>
            ): (
                <div className="w-full h-32 rounded-md bg-gray-200 flex items-center justify-center"><ImageIcon size={32} className="text-gray-400"/></div>
            )}
            <div className="flex space-x-2 mt-1">
                <Button onClick={() => handleGenerateProjectImage(false)} disabled={isGeneratingProjectImage || !formData.tokenName.trim()} small icon={RefreshCw} className="w-auto">Regenerate Image</Button>
                <Button onClick={() => showToast("Upload functionality coming soon!", "info")} small icon={UploadCloud} className="w-auto">Upload Image</Button>
            </div>
          </div>
          <InputField name="price" label="Set Contribution Amount (USDC)" type="number" value={formData.price} onChange={handleChange} placeholder="e.g., 5" required step="0.01" error={errors.price} />
          <InputField name="goal" label="Target Funding Goal (USDC, Optional)" type="number" value={formData.goal} onChange={handleChange} placeholder="e.g., 1000" step="0.01" error={errors.goal} />

          <InputField name="description" label="Description (What are you funding?)" value={formData.description} onChange={handleChange} placeholder="Help me create my next masterpiece!" required error={errors.description} as="textarea">
            <button type="button" onClick={handleGenerateDescriptionSuggestions} disabled={isGeneratingDesc || !formData.tokenName.trim()} className="p-1 text-gray-400 hover:text-accent-color transition-colors">
              <Sparkles size={16} />
            </button>
          </InputField>
          <SuggestionButtons suggestions={descriptionSuggestions} onSelect={(s) => setFormData(p => ({...p, description: s}))} fieldName="Description" />

          <InputField 
            name="utility" 
            label="Supporter Perks (optional)" 
            value={formData.utility} 
            onChange={handleChange} 
            placeholder="e.g., early-access, Discord role, exclusive download" 
            as="textarea" 
            type="small" 
          >
            <button type="button" onClick={handleGeneratePerkSuggestions} disabled={isGeneratingPerks || !formData.tokenName.trim() || !formData.description.trim()} className="p-1 text-gray-400 hover:text-accent-color transition-colors">
              <Sparkles size={16} />
            </button>
          </InputField>
          <SuggestionButtons suggestions={perkSuggestions} onSelect={(s) => setFormData(p => ({...p, utility: s}))} fieldName="Perks" />

          <div className="pt-3 space-y-3"> 
            <Button onClick={handleVerifyWorldId} icon={isCreatorVerified ? CheckCircle : Globe} className={isCreatorVerified ? "!border-green-500 !text-green-600" : ""}>
                {isCreatorVerified ? 'Creator Verified!' : 'Verify with World ID (Simulated)'}
            </Button>
            <Button type="submit" primary icon={Rocket} disabled={!isCreatorVerified}>Create Support Page</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// ... (PublicTokenPage, SupportVerificationFlow, SupportConfirmationScreen, CreatorDashboard, DiscoveryScreen, TokenCard, AIGrantScoutScreen, BudgetingScreen)
// These will be updated to use `page.creatorAvatarData` and `page.projectImageData` (base64 strings)
// and reflect other terminology changes.

const PublicTokenPage = ({ /* ... */ }) => {
  const { supportPages, activeSupportPageId, navigateTo, copyToClipboard, showToast } = useContext(AppContext);
  const page = activeSupportPageId ? supportPages.get(activeSupportPageId) : null; 
  const [showMatchingInfo, setShowMatchingInfo] = useState(false);

  useEffect(() => {
    if (!activeSupportPageId) navigateTo('DiscoveryScreen'); 
    else if (activeSupportPageId && !supportPages.has(activeSupportPageId)) { 
        showToast("Support Page not found.", "error");
        navigateTo('DiscoveryScreen');
    }
  }, [page, activeSupportPageId, navigateTo, showToast, supportPages]);

  if (!page) return ( 
    <div className="p-4 text-center" style={{ color: C3_TEXT_SECONDARY_LIGHT }}>
      Loading support page details...
      <Button onClick={() => navigateTo('DiscoveryScreen')} className="mt-4" icon={Search}>Go to Discovery</Button>
    </div>
  );

  const shareLink = () => { 
    const link = `https://yourapp.com/page/${page.id}`;
    copyToClipboard(link);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <button onClick={() => navigateTo('DiscoveryScreen')} className={`mb-4 text-sm flex items-center hover:opacity-75`} style={{color: C3_ACCENT_COLOR}}>
        <ChevronLeft size={16} className="mr-1" /> Back to Discovery
      </button>
      <Card className="mb-4">
        {page.projectImageData ? (
            <img 
                src={page.projectImageData} 
                alt={`${page.tokenName} project image`} 
                className="w-full h-48 object-cover rounded-md mb-4" 
            />
        ) : ( 
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                 <ImageIcon size={40} className="text-gray-400" />
            </div>
        )}

        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
                {page.creatorAvatarData ? (
                    <img src={page.creatorAvatarData} alt={page.creatorName} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                        <UserCircle size={24} className="text-gray-400"/>
                    </div>
                )}
                <div>
                    <h2 className={`text-2xl md:text-3xl font-semibold`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>{page.tokenName}</h2>
                    <p className={`text-sm md:text-md`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>by {page.creatorName}</p>
                </div>
            </div>
            <button onClick={shareLink} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} style={{ color: C3_ACCENT_COLOR }} />
            </button>
        </div>
        <div className="mb-4">
          {/* v5 update: "Contribution Amount" terminology */}
          <p className={`text-xl md:text-2xl font-semibold`} style={{ color: C3_ACCENT_COLOR }}>{page.price.toLocaleString()} USDC <span className={`text-sm font-normal`} style={{color: C3_TEXT_SECONDARY_LIGHT}}>/ contribution</span></p>
        </div>

        {page.goal > 0 && <div className="mb-6"><ProgressBar current={page.raised} total={page.goal} label="Funding Goal Progress" /></div>}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-2`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Use of Funds</h3>
          <p className={`text-sm leading-relaxed`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>{page.useOfFunds}</p>
        </div>

        {page.utility && (
          <div className="mb-6 p-3 rounded-md border" style={{borderColor: C3_ACCENT_COLOR, backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}` }}>
            <h3 className={`text-md font-semibold mb-1 flex items-center`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>
              <Gift size={16} className="mr-2" style={{color: C3_ACCENT_COLOR}} /> Supporter Perks
            </h3>
            {page.utility.includes('\n') || page.utility.includes(',') || page.utility.includes(';') ? (
                <ul className="list-disc list-inside pl-1 space-y-0.5 text-sm" style={{color: C3_TEXT_SECONDARY_LIGHT}}>
                    {page.utility.split(/[\n,;]+/).map(perk => perk.trim()).filter(perk => perk).map((perk, idx) => <li key={idx}>{perk}</li>)}
                </ul>
            ) : (
                <p className={`text-sm`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>{page.utility}</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-6 text-sm" style={{ color: C3_TEXT_SECONDARY_LIGHT }}>
          <div className="flex items-center"><Users size={16} className="mr-1.5" />{page.supporters} Supporters</div>
          {page.raised > 0 && (<div className="flex items-center"><TrendingUp size={16} className="mr-1.5" />${page.raised.toLocaleString()} Raised</div>)}
        </div>

        {/* v5 update: Matching Funds Info Box Updated */}
        <div className="mb-6 p-4 rounded-md bg-sky-50 border border-sky-200">
            <div className="flex justify-between items-center">
                 <p className="text-sm font-medium text-sky-700">
                    Matching Bonus: <span className="font-semibold">Enabled!</span>
                 </p>
                 <button className="ml-1 text-xs underline text-sky-600 hover:text-sky-800" onClick={() => setShowMatchingInfo(!showMatchingInfo)}>
                    {showMatchingInfo ? 'Hide details' : 'How it works?'}
                </button>
            </div>
            {showMatchingInfo && (
                <div className="mt-2.5 text-xs space-y-1.5" style={{color: C3_TEXT_SECONDARY_LIGHT}}>
                    <p className="font-medium" style={{color: C3_TEXT_PRIMARY_LIGHT}}>We partner with leading organizations to boost your contribution:</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                        <li><strong>Allo.Capital:</strong> Leverages Quadratic Funding, where many unique contributions can attract significantly more matching funds than a single large one. Your voice matters!</li>
                        <li><strong>Artizen:</strong> Provides matching funds specifically for creator-led projects, helping bring bold ideas to life.</li>
                    </ul>
                    <p className="mt-1.5"><em>(Matching fund simulation: +$0.25 per contribution)</em></p>
                </div>
            )}
        </div>

        <Button onClick={() => navigateTo('SupportVerificationFlow', page.id)} primary icon={Globe}>Verify & Support</Button>
        <p className="text-xs text-center mt-2" style={{color: C3_TEXT_SECONDARY_LIGHT}}>
            Verified supporters unlock a +25% matching boost (simulation).
        </p>
      </Card>
    </div>
  );
};

const SupportVerificationFlow = ({ /* ... */ }) => {
  const { activeSupportPageId, supportPages, supportPageAction, supportedByMe, navigateTo, showToast } = useContext(AppContext); 
  const [isVerifying, setIsVerifying] = useState(false); 
  const [verificationStatus, setVerificationStatus] = useState(''); 
  const [showFeeModal, setShowFeeModal] = useState(false); 

  const page = activeSupportPageId ? supportPages.get(activeSupportPageId) : null;
  const supportPrice = page ? page.price : 0;
  const platformFee = page ? parseFloat((page.price * 0.01).toFixed(2)) : 0; 
  const totalCharged = page ? supportPrice + platformFee : 0;

  const proceedWithSupport = () => {
    setShowFeeModal(false);
    setIsVerifying(true);
    setVerificationStatus('');
    setTimeout(() => { 
      if (!activeSupportPageId) { showToast("No active Support Page.", "error"); navigateTo('DiscoveryScreen'); setIsVerifying(false); return; }
      if (supportedByMe.has(activeSupportPageId)) setVerificationStatus('failed_already_supported');
      else {
        const success = supportPageAction(activeSupportPageId); 
        if (success) setVerificationStatus('success'); 
        else { setVerificationStatus('failed_generic'); navigateTo('PublicTokenPage', activeSupportPageId); } 
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleInitialSupportClick = () => {
    if (supportedByMe.has(activeSupportPageId)) {
      setVerificationStatus('failed_already_supported');
      showToast("You've already supported this creator.", 'error');
    } else {
      setShowFeeModal(true); 
    }
  };


  useEffect(() => {
    if (activeSupportPageId && supportedByMe.has(activeSupportPageId) && verificationStatus !== 'failed_already_supported' && !showFeeModal && !isVerifying) {
      setVerificationStatus('failed_already_supported');
      showToast("You've already supported this creator.", 'error'); 
    } else if (!activeSupportPageId && !isVerifying && !showFeeModal) { 
        showToast("No Support Page selected for verification.", "error");
        navigateTo('DiscoveryScreen');
    }
  }, [activeSupportPageId, supportedByMe, isVerifying, verificationStatus, showFeeModal, showToast, navigateTo]);

  if (!page && !isVerifying) { 
    return (
      <div className="p-4 text-center" style={{ color: C3_TEXT_SECONDARY_LIGHT }}>
        Loading support page information...
        <Button onClick={() => navigateTo('DiscoveryScreen')} className="mt-4" icon={Search}>Go to Discovery</Button>
      </div>
    );
  }

  if (showFeeModal) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-3 text-center" style={{color: C3_TEXT_PRIMARY_LIGHT}}>Confirm Your Support</h3>
                <div className="space-y-1 text-sm mb-4">
                    <div className="flex justify-between"><span>Contribution Amount:</span> <span>${supportPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Platform Fee (1%):</span> <span>${platformFee.toFixed(2)}</span></div>
                    <hr className="my-1 border-gray-200"/>
                    <div className="flex justify-between font-semibold"><span>Total Charged:</span> <span>${totalCharged.toFixed(2)}</span></div>
                </div>
                <p className="text-xs text-center mb-4" style={{color: C3_TEXT_SECONDARY_LIGHT}}>
                    This is a simulated transaction.
                </p>
                <div className="space-y-2">
                    <Button onClick={proceedWithSupport} primary>Confirm & Support</Button>
                    <Button onClick={() => {setShowFeeModal(false); navigateTo('PublicTokenPage', activeSupportPageId);}}>Cancel</Button>
                </div>
            </Card>
        </div>
    );
  }


  return ( 
    <div className="max-w-md mx-auto p-4 text-center">
      <Card>
        <h2 className={`text-2xl font-semibold mb-6`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Support Verification</h2>
        {isVerifying && (<><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 mx-auto mb-4" style={{borderColor: C3_ACCENT_COLOR, borderTopColor: 'transparent'}}></div><p style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Simulating World ID verification & payment...</p></>)}
        {!isVerifying && verificationStatus === 'failed_already_supported' && (<><Info size={40} className={`mx-auto mb-4`} style={{ color: C3_ACCENT_COLOR }} /><p className={`mb-6`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>You've already supported this creator.</p><Button onClick={() => navigateTo('PublicTokenPage', activeSupportPageId)} icon={Eye}>View Support Page</Button></>)}
        {!isVerifying && verificationStatus === 'failed_generic' && (<><XCircle size={40} className={`mx-auto mb-4`} style={{ color: C3_ERROR_RED }} /><p className={`mb-6`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Support failed. Please try again.</p><Button onClick={() => navigateTo('PublicTokenPage', activeSupportPageId)} icon={ChevronLeft}>Back to Support Page</Button></>)}
        {!isVerifying && !verificationStatus && !showFeeModal && (
            <>
                <p className={`mb-4`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Click below to proceed with your support.</p>
                <Button onClick={handleInitialSupportClick} primary icon={Check}>Proceed with Support</Button>
            </>
        )}
      </Card>
    </div>
  );
};


const SupportConfirmationScreen = ({ /* ... */ }) => {
  const { supportPages, activeSupportPageId, navigateTo, copyToClipboard } = useContext(AppContext);
  const page = activeSupportPageId ? supportPages.get(activeSupportPageId) : null;

  useEffect(() => { if (!page) navigateTo('DiscoveryScreen'); }, [page, navigateTo]); 
  if (!page) return <div style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Loading confirmation...</div>;

  const matchingBonus = page.supporters * 0.25; 
  const shareLink = () => copyToClipboard(`https://yourapp.com/page/${page.id}`, 'Support Page link copied!');

  return ( 
    <div className="max-w-md mx-auto p-4 text-center">
      <Card>
        <PartyPopper size={40} className={`mx-auto mb-4`} style={{color: C3_ACCENT_COLOR}} />
        <h2 className={`text-2xl font-semibold mb-2`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Thanks for your support of {page.creatorName}!</h2>
        <p className={`mb-6`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Thank you for empowering creators.</p>
        <div className={`p-4 rounded-md mb-6 border`} style={{ backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`, borderColor: C3_ACCENT_COLOR }}>
          <p className={`text-sm`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Total Raised for {page.tokenName}:</p>
          <p className={`text-2xl font-semibold`} style={{ color: C3_ACCENT_COLOR }}>${page.raised.toLocaleString()} USDC</p>
          {matchingBonus > 0 && <p className={`text-sm mt-1`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Includes +${matchingBonus.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} matching bonus (simulated)</p>}
          <p className="text-xs text-gray-500 mt-2">
            Funds arrive instantly in the creator’s World App wallet and can be spent
            with the Worldcoin Card (simulation).
          </p>
        </div>
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md text-center">
            <Gift size={24} className="mx-auto mb-2 text-indigo-600" />
            <p className="text-sm font-medium text-indigo-700">You've received a unique Supporter Badge!</p>
            <p className="text-xs text-indigo-500">(View in Wallet - Simulated)</p>
        </div>

        <div className="space-y-3 mt-6"> 
          <Button onClick={shareLink} primary icon={Share2}>Share This Support Page</Button>
          <Button onClick={() => navigateTo('DiscoveryScreen')} icon={Search}>Discover More Creators</Button>
        </div>
        <p className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-200">
            This support item is a non-transferable show-of-support, not a financial instrument.
        </p>
      </Card>
    </div>
  );
};


const CreatorDashboard = ({ /* ... */ }) => {
  const { supportPages, copyToClipboard, navigateTo, activeSupportPageId } = useContext(AppContext);
  const creatorSupportPages = useMemo(() => Array.from(supportPages.values()), [supportPages]); 

  if (creatorSupportPages.length === 0) return ( 
    <div className="p-4 text-center">
      <Lightbulb size={40} className="mx-auto mb-4 text-yellow-400" />
      <p style={{ color: C3_TEXT_PRIMARY_LIGHT }} className="text-lg font-medium mb-2">Ready to launch your first creative project? ✨</p>
      <p style={{ color: C3_TEXT_SECONDARY_LIGHT }} className="mb-4 text-sm">Create a Support Page to start funding your ideas.</p>
      <Button onClick={() => navigateTo('CreatorSetup')} primary icon={Rocket} className="w-auto mx-auto">Create Support Page</Button>
    </div>
  );

  let pageToDisplayDetails = null;
  if (activeSupportPageId && supportPages.has(activeSupportPageId)) {
    pageToDisplayDetails = supportPages.get(activeSupportPageId);
  } else if (creatorSupportPages.length > 0) {
    pageToDisplayDetails = creatorSupportPages[creatorSupportPages.length - 1];
  }

  const sharePageLink = (pageId) => copyToClipboard(`https://yourapp.com/page/${pageId}`, 'Support Page link copied!');

  return ( 
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-semibold`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Creator Dashboard</h2>
        <Button onClick={() => navigateTo('CreatorSetup')} className="w-auto" primary icon={Edit3}>New Support Page</Button>
      </div>
      {pageToDisplayDetails && ( 
          <Card className="mb-6">
            <h3 className={`text-xl font-semibold mb-1`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>{pageToDisplayDetails.tokenName} - Quick Stats</h3>
             <button onClick={() => sharePageLink(pageToDisplayDetails.id)} className={`text-xs flex items-center mt-1 mb-3 hover:opacity-75 font-medium`} style={{color: C3_ACCENT_COLOR}}><Copy size={12} className="mr-1" /> Copy Link</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-md border`} style={{backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`, borderColor: C3_BORDER_LIGHT}}><p className={`text-xs`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Total Raised</p><p className={`text-2xl font-semibold`} style={{ color: C3_ACCENT_COLOR }}>${pageToDisplayDetails.raised.toLocaleString()}</p></div>
              <div className={`p-3 rounded-md border`} style={{backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`, borderColor: C3_BORDER_LIGHT}}><p className={`text-xs`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Supporters</p><p className={`text-2xl font-semibold`} style={{ color: C3_ACCENT_COLOR }}>{pageToDisplayDetails.supporters.toLocaleString()}</p></div>
            </div>
            {pageToDisplayDetails.goal > 0 && (<div className="mt-4"><ProgressBar current={pageToDisplayDetails.raised} total={pageToDisplayDetails.goal} label="Progress Toward Funding Goal" /></div>)}
            <div className="mt-4">
                <p className="text-xs font-medium mb-1" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Creator Score (Simulated)</p>
                <ProgressBar current={Math.min(pageToDisplayDetails.supporters, 100)} total={100} small={true} /> 
            </div>
          </Card>
      )}
      <h3 className={`text-xl font-semibold mt-6 mb-3`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Your Support Pages ({creatorSupportPages.length})</h3>
      {creatorSupportPages.length > 0 ? ( 
        <div className="space-y-3"> 
          {creatorSupportPages.map(page => (
            <Card key={page.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"> 
              <div className="flex items-center flex-1 min-w-0 mr-2">
                {page.creatorAvatarData ? (
                    <img src={page.creatorAvatarData} alt={page.creatorName} className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0"/>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center flex-shrink-0">
                        <UserCircle size={20} className="text-gray-400"/>
                    </div>
                )}
                <div>
                    <h4 className="text-md font-semibold truncate" style={{color: C3_TEXT_PRIMARY_LIGHT}}>{page.tokenName}</h4>
                    <p className="text-xs" style={{color: C3_TEXT_SECONDARY_LIGHT}}>${page.raised.toLocaleString()} raised from {page.supporters} supporters.</p>
                    <div className="mt-1 w-32"> 
                         <ProgressBar current={Math.min(page.supporters, 100)} total={100} small={true} />
                    </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 space-x-2 flex flex-shrink-0">
                <Button onClick={() => navigateTo('PublicTokenPage', page.id)} small className="w-auto" icon={Eye}>View</Button>
                <Button onClick={() => navigateTo('BudgetingScreen', page.id)} small className="w-auto" icon={DollarSign}>Budget</Button>
                <Button onClick={() => sharePageLink(page.id)} small className="w-auto" icon={Copy}>Copy</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (<p style={{color: C3_TEXT_SECONDARY_LIGHT}}>You haven't created any Support Pages yet.</p>)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"> 
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('AIGrantScout')}>
            <div className="flex items-center mb-1.5"><Lightbulb size={16} className={`mr-2`} style={{ color: C3_ACCENT_COLOR }} /><h3 className={`text-lg font-semibold`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>AI Grant Scout</h3></div>
            <p className={`text-sm`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Discover funding opportunities tailored for you.</p>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('BudgetingScreen', pageToDisplayDetails ? pageToDisplayDetails.id : (creatorSupportPages.length > 0 ? creatorSupportPages[0].id : null) )}>
            <div className="flex items-center mb-1.5"><DollarSign size={16} className={`mr-2`} style={{ color: C3_ACCENT_COLOR }} /><h3 className={`text-lg font-semibold`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Budgeting & Financials</h3></div>
            <p className={`text-sm`} style={{ color: C3_TEXT_SECONDARY_LIGHT }}>Manage your funds and plan your creative projects.</p>
        </Card>
      </div>
    </div>
  );
};

const TokenCard = ({ token: page }) => { 
    const { navigateTo } = useContext(AppContext);
    return (
        <Card className="flex flex-col justify-between h-full p-4"> 
            <div>
                {page.projectImageData ? (
                    <img src={page.projectImageData} alt={page.tokenName} className="w-full h-32 object-cover rounded-md mb-2" />
                ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                        <ImageIcon size={32} className="text-gray-400" />
                    </div>
                )}
                <div className="flex items-center mb-1">
                    {page.creatorAvatarData ? (
                        <img src={page.creatorAvatarData} alt={page.creatorName} className="w-6 h-6 rounded-full mr-2 object-cover flex-shrink-0"/>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center flex-shrink-0">
                            <UserCircle size={16} className="text-gray-400"/>
                        </div>
                    )}
                    <h3 className="text-md font-semibold truncate" style={{color: C3_TEXT_PRIMARY_LIGHT}}>{page.tokenName}</h3> 
                </div>
                <p className="text-xs mb-1" style={{color: C3_TEXT_SECONDARY_LIGHT}}>by {page.creatorName}</p>
                <p className="text-sm font-medium mb-2" style={{color: C3_ACCENT_COLOR}}>{page.price.toLocaleString()} USDC / contribution</p> 
                {page.goal > 0 && (<ProgressBar current={page.raised} total={page.goal} />)}
                 <p className="text-xs mt-2" style={{color: C3_TEXT_SECONDARY_LIGHT}}>{page.supporters} supporters</p>
            </div>
            <Button onClick={() => navigateTo('PublicTokenPage', page.id)} primary className="mt-3 w-full" icon={Eye}>View Support Page</Button>
        </Card>
    );
};
const DiscoveryScreen = ({ /* ... */ }) => {
    const { supportPages, navigateTo } = useContext(AppContext);
    const allSupportPages = useMemo(() => Array.from(supportPages.values()).reverse(), [supportPages]); 
    return ( 
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-semibold" style={{color: C3_TEXT_PRIMARY_LIGHT}}>Discover Support Pages</h2> 
                 <Button onClick={() => navigateTo('CreatorSetup')} primary icon={Edit3} className="w-auto">Create Page</Button>
            </div>
            {allSupportPages.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{allSupportPages.map(page => (<TokenCard key={page.id} token={page} />))}</div>)  
            : (<div className="text-center py-10"><Search size={40} className="mx-auto mb-4" style={{color: C3_TEXT_SECONDARY_LIGHT}} /><p className="text-lg mb-2" style={{color: C3_TEXT_PRIMARY_LIGHT}}>No Support Pages launched yet.</p><p style={{color: C3_TEXT_SECONDARY_LIGHT}}>Be the first to create a Support Page!</p></div>)} 
        </div>
    );
};

const AIGrantScoutScreen = ({ /* ... */ }) => {
  const { navigateTo, showToast } = useContext(AppContext);
  const [projectDescription, setProjectDescription] = useState('');
  const [suggestedGrants, setSuggestedGrants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchGrants = async () => {
    if (!projectDescription.trim()) { showToast("Please enter a project description.", "error"); return; }
    setIsLoading(true); setError(null); setSuggestedGrants([]);

    const prompt = `Based on the following project description, suggest 3-5 fictional but realistic-sounding grant opportunities for a creator. For each grant, provide a "grantName", a brief "grantFocus" (what kind of projects it supports), and a "fundingAmount" (e.g., "$5,000 - $10,000" or "up to $25,000"). Project Description: "${projectDescription}"`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", properties: { grants: { type: "ARRAY", items: { type: "OBJECT", properties: { grantName: { type: "STRING" }, grantFocus: { type: "STRING" }, fundingAmount: { type: "STRING" } }, required: ["grantName", "grantFocus", "fundingAmount"] } } }, required: ["grants"]
        }
      }
    };
    const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error?.message || `API Error: ${response.status}`); }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
        if (parsedJson.grants && Array.isArray(parsedJson.grants)) { setSuggestedGrants(parsedJson.grants); }
        else { throw new Error("Unexpected AI response format."); }
      } else { throw new Error("AI could not generate suggestions."); }
    } catch (e) { console.error("Grant Scout Error:", e); setError(e.message); showToast(`Grant Scout Error: ${e.message}`, "error");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <button onClick={() => navigateTo('CreatorDashboard')} className={`mb-4 text-sm flex items-center hover:opacity-75`} style={{color: C3_ACCENT_COLOR}}><ChevronLeft size={16} className="mr-1" /> Back to Dashboard</button>
      <Card>
        <div className="flex items-center mb-4"> <Brain size={20} className="mr-2" style={{color: C3_ACCENT_COLOR}}/><h2 className={`text-xl font-semibold`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>AI Grant Scout</h2></div>
        <p className="mb-4 text-sm" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Describe your project, and AI will suggest (fictional) grant opportunities.</p>
        <InputField name="projectDescription" label="Your Project Description" as="textarea" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="e.g., Digital art series on climate change..." required />
        <Button onClick={handleFetchGrants} primary disabled={isLoading} icon={Send}>{isLoading ? 'Scouting...' : 'Find Grants ✨'}</Button>
        {error && <p className="mt-4 text-sm text-center" style={{color: C3_ERROR_RED}}>{error}</p>}
        {suggestedGrants.length > 0 && (
          <div className="mt-6"><h3 className="text-lg font-semibold mb-3" style={{color: C3_TEXT_PRIMARY_LIGHT}}>Suggested Grants:</h3>
            <div className="space-y-3"> 
              {suggestedGrants.map((grant, index) => (
                <Card key={index} className="border-l-4 p-4" style={{borderColor: C3_ACCENT_COLOR}}> 
                  <h4 className="font-semibold text-md" style={{color: C3_TEXT_PRIMARY_LIGHT}}>{grant.grantName}</h4>
                  <p className="text-sm my-1" style={{color: C3_TEXT_SECONDARY_LIGHT}}><strong style={{color: C3_TEXT_PRIMARY_LIGHT}}>Focus:</strong> {grant.grantFocus}</p>
                  <p className="text-sm" style={{color: C3_TEXT_SECONDARY_LIGHT}}><strong style={{color: C3_TEXT_PRIMARY_LIGHT}}>Funding:</strong> {grant.fundingAmount}</p>
                  <Button onClick={() => showToast('Apply button (simulated)', 'info')} small className="w-auto px-3 py-1 mt-2 text-xs">Apply (Simulated)</Button> 
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const BudgetingScreen = ({ /* ... */ }) => {
  const { navigateTo, supportPages, activeSupportPageId, budgetItems, addOrUpdateBudgetItem, removeBudgetItem, setInitialBudgetForToken, aiBudgetGeneratedForToken, showToast } = useContext(AppContext); 

  const [projectDetails, setProjectDetails] = useState({ teamSize: '', duration: '', locationType: '', equipmentNeeds: '' });
  const [projectDetailsErrors, setProjectDetailsErrors] = useState({});
  const [isGeneratingInitialBudget, setIsGeneratingInitialBudget] = useState(false);

  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [editingBudgetItemId, setEditingBudgetItemId] = useState(null);
  const [currentAiEstimateNotes, setCurrentAiEstimateNotes] = useState('');


  const [expenseCategorySuggestions, setExpenseCategorySuggestions] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  let currentSupportPageForBudget = null; 
  if (activeSupportPageId && supportPages.has(activeSupportPageId)) {
    currentSupportPageForBudget = supportPages.get(activeSupportPageId);
  } else if (supportPages.size > 0 && !activeSupportPageId) { 
    currentSupportPageForBudget = Array.from(supportPages.values())[supportPages.size - 1];
  }

  const pageHasAiGeneratedBudget = currentSupportPageForBudget ? aiBudgetGeneratedForToken.get(currentSupportPageForBudget.id) || false : false; 
  const currentBudgetItems = currentSupportPageForBudget ? (budgetItems.get(currentSupportPageForBudget.id) || []) : []; 
  const totalRaised = currentSupportPageForBudget ? currentSupportPageForBudget.raised : 0;
  const totalPlannedExpenses = currentBudgetItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const fundingGoal = currentSupportPageForBudget?.goal > 0 ? currentSupportPageForBudget.goal : null;
  let remainingOrSurplusVsGoal = null;
  if (fundingGoal !== null) {
    remainingOrSurplusVsGoal = fundingGoal - totalPlannedExpenses;
  }
  const remainingBudgetAfterRaised = totalRaised - totalPlannedExpenses;


  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({ ...prev, [name]: value }));
    if(projectDetailsErrors[name]) setProjectDetailsErrors(prev => ({...prev, [name]: null}));
  };

  const validateProjectDetails = () => {
    const errors = {};
    if (!projectDetails.teamSize) errors.teamSize = "Team size is required.";
    if (!projectDetails.duration || parseInt(projectDetails.duration) <=0) errors.duration = "Valid duration is required.";
    if (!projectDetails.locationType) errors.locationType = "Location type is required.";
    if (!projectDetails.equipmentNeeds.trim()) errors.equipmentNeeds = "Please list key needs.";
    setProjectDetailsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const parseAiCostEstimate = (costString) => {
    if (!costString) return "0";
    const numbers = costString.match(/\d+([,.]\d+)?/g); 
    if (numbers && numbers.length > 0) {
      const firstNum = parseFloat(numbers[0].replace(/,/g, ''));
      return isNaN(firstNum) ? "0" : firstNum.toString();
    }
    return "0"; 
  };


  const handleGenerateInitialBudget = async () => {
    if (!currentSupportPageForBudget) { showToast("No active Support Page to budget for.", "error"); return; } 
    if (!validateProjectDetails()) { showToast("Please fill in all project details.", "error"); return; }
    setIsGeneratingInitialBudget(true);
    showToast("✨ AI is drafting your initial budget...", "info");

    const prompt = `
      A creator is launching a project support page named "${currentSupportPageForBudget.tokenName}".
      Project Description: "${currentSupportPageForBudget.description || 'Not specified'}"
      Target Funding Goal (if any): ${fundingGoal ? `$${fundingGoal.toLocaleString()}` : 'Not specified'}
      Project Details:
      - Team Size: ${projectDetails.teamSize}
      - Duration: ${projectDetails.duration} months
      - Location Type: ${projectDetails.locationType}
      - Key Equipment/Software Needs: ${projectDetails.equipmentNeeds}

      Based on this, generate a list of 5-7 relevant expense categories.
      For each item, provide "categoryName" (e.g., "Software Licensing"), "estimatedCost" (e.g., "$100/month", "$500 total", "$50-$150 one-time"), and brief "notes" (1 short sentence on why it might be needed or what it covers).
      The creator will use this as a starting point and adjust the numbers. Try to make the total estimated costs somewhat align with the Target Funding Goal if one is provided, but prioritize realistic common expenses for such a project.
    `;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", properties: { budgetPlan: { type: "ARRAY", items: { type: "OBJECT", properties: { categoryName: { type: "STRING" }, estimatedCost: { type: "STRING" }, notes: { type: "STRING" } }, required: ["categoryName", "estimatedCost", "notes"] } } }, required: ["budgetPlan"]
        }
      }
    };
    const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error?.message || `API Error: ${response.status}`); }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
        if (parsedJson.budgetPlan && Array.isArray(parsedJson.budgetPlan)) {
          const aiBudgetItems = parsedJson.budgetPlan.map(item => ({
            description: item.categoryName, 
            amount: parseAiCostEstimate(item.estimatedCost), 
            aiEstimateNotes: `(AI Est: ${item.estimatedCost}) - ${item.notes}` 
          }));
          setInitialBudgetForToken(currentSupportPageForBudget.id, aiBudgetItems); 
          showToast("✨ AI draft budget generated! Please review and adjust amounts.", "success");
        } else { throw new Error("Unexpected AI budget format."); }
      } else { throw new Error("AI could not generate a budget draft."); }
    } catch (e) { console.error("AI Budget Generation Error:", e); showToast(`AI Budget Error: ${e.message}`, "error");
    } finally { setIsGeneratingInitialBudget(false); }
  };

  const handleSaveBudgetItem = (e) => {
    e.preventDefault();
    if (!currentSupportPageForBudget) { showToast("Select or create a Support Page first.", "error"); return; } 
    const amount = parseFloat(newItemAmount);
    if (!newItemDesc.trim() || isNaN(amount) || amount < 0) { 
      showToast("Valid description and non-negative amount required.", "error"); return;
    }

    const itemData = { 
        description: newItemDesc, 
        amount: amount.toString(),
        aiEstimateNotes: editingBudgetItemId ? (currentBudgetItems.find(i => i.id === editingBudgetItemId)?.aiEstimateNotes || '') : '' 
    };

    addOrUpdateBudgetItem(currentSupportPageForBudget.id, itemData, editingBudgetItemId); 

    setNewItemDesc(''); setNewItemAmount(''); setEditingBudgetItemId(null); setCurrentAiEstimateNotes('');
    setExpenseCategorySuggestions([]);
    showToast(editingBudgetItemId ? "Budget item updated!" : "Budget item added!", "success");
  };

  const handleEditBudgetItem = (item) => {
    setNewItemDesc(item.description); 
    setNewItemAmount(item.amount);
    setEditingBudgetItemId(item.id);
    setCurrentAiEstimateNotes(item.aiEstimateNotes || ''); 
    setExpenseCategorySuggestions([]); 
  };

  const handleFetchExpenseCategorySuggestions = async () => {
    if (!currentSupportPageForBudget || !currentSupportPageForBudget.tokenName || !currentSupportPageForBudget.description) { 
      showToast("Support Page name and description needed for category ideas.", "error");
      return;
    }
    setIsFetchingCategories(true); setExpenseCategorySuggestions([]);
    showToast("✨ AI is brainstorming categories...", "info");
    const prompt = `For a creator project support page named "${currentSupportPageForBudget.tokenName}" about: "${currentSupportPageForBudget.description}", suggest 3-5 common expense categories. Provide only the category names as a list.`; 
    const payload = { 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            categorySuggestions: {
              type: "ARRAY",
              items: { type: "STRING", description: "A single expense category name." }
            }
          },
          required: ["categorySuggestions"]
        }
      }
    };
    const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error?.message || `API Error: ${response.status}`); }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
        if (parsedJson.categorySuggestions && Array.isArray(parsedJson.categorySuggestions)) {
          setExpenseCategorySuggestions(parsedJson.categorySuggestions);
          showToast("✨ AI has category ideas!", "success");
        } else { throw new Error("Unexpected AI response format for categories."); }
      } else { throw new Error("AI could not suggest expense categories."); }
    } catch (e) {
      console.error("Expense Category Suggestion Error:", e);
      showToast(`Category Suggestion Error: ${e.message}`, "error");
      setExpenseCategorySuggestions([]);
    } finally {
      setIsFetchingCategories(false);
    }
  };


  if (!currentSupportPageForBudget) { 
    return (
      <div className="max-w-xl mx-auto p-4 text-center">
         <button onClick={() => navigateTo('CreatorDashboard')} className={`mb-4 text-sm flex items-center hover:opacity-75`} style={{color: C3_ACCENT_COLOR}}><ChevronLeft size={16} className="mr-1" /> Back to Dashboard</button>
        <Card><Info size={32} className="mx-auto mb-3" style={{color: C3_TEXT_SECONDARY_LIGHT}}/><p style={{color: C3_TEXT_SECONDARY_LIGHT}}>No Support Page selected for budgeting.</p><p className="text-xs mt-1" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Create a Support Page or select one from your dashboard.</p><Button onClick={() => navigateTo('CreatorSetup')} className="mt-4 w-auto mx-auto px-4">Create Support Page</Button></Card>
      </div>
    );
  }

  const teamSizeOptions = [ {value: "Solo", label: "Solo"}, {value: "2-3 people", label: "2-3 people"}, {value: "4-5 people", label: "4-5 people"}, {value: "5+ people", label: "5+ people"} ];
  const locationTypeOptions = [ {value: "Remote", label: "Remote"}, {value: "Co-working Space", label: "Co-working Space"}, {value: "Small Office/Studio", label: "Small Office/Studio"}, {value: "Home Office", label: "Home Office"} ];


  return (
    <div className="max-w-xl mx-auto p-4">
      <button onClick={() => navigateTo('CreatorDashboard')} className={`mb-4 text-sm flex items-center hover:opacity-75`} style={{color: C3_ACCENT_COLOR}}><ChevronLeft size={16} className="mr-1" /> Back to Dashboard</button>
      <Card>
        <div className="flex items-center mb-1"><DollarSign size={20} className="mr-2" style={{color: C3_ACCENT_COLOR}}/><h2 className={`text-xl font-semibold`} style={{ color: C3_TEXT_PRIMARY_LIGHT }}>Budget & Financials</h2></div>
        <p className="mb-4 text-sm" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Manage funds for: <strong style={{color: C3_TEXT_PRIMARY_LIGHT}}>{currentSupportPageForBudget.tokenName}</strong></p>

        {!pageHasAiGeneratedBudget && (
          <Card className="mb-6 bg-sky-50 border-sky-200 p-4">
            <h3 className="text-lg font-semibold mb-2" style={{color: C3_TEXT_PRIMARY_LIGHT}}>Draft Your Budget with AI ✨</h3>
            <p className="text-xs mb-3" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Provide project details, and AI will generate an initial budget draft for you to refine.</p>
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateInitialBudget();}} className="space-y-3">
              <SelectField name="teamSize" label="Team Size" value={projectDetails.teamSize} onChange={handleProjectDetailsChange} options={teamSizeOptions} required error={projectDetailsErrors.teamSize} />
              <InputField name="duration" label="Project Duration (Months)" type="number" value={projectDetails.duration} onChange={handleProjectDetailsChange} placeholder="e.g., 6" required error={projectDetailsErrors.duration} />
              <SelectField name="locationType" label="Location Type" value={projectDetails.locationType} onChange={handleProjectDetailsChange} options={locationTypeOptions} required error={projectDetailsErrors.locationType} />
              <InputField name="equipmentNeeds" label="Key Equipment/Software Needs" as="textarea" type="small" value={projectDetails.equipmentNeeds} onChange={handleProjectDetailsChange} placeholder="e.g., Adobe Creative Suite, Camera, Hosting fees" required error={projectDetailsErrors.equipmentNeeds} />
              <Button type="submit" primary icon={Zap} disabled={isGeneratingInitialBudget}>
                {isGeneratingInitialBudget ? 'Generating Budget...' : 'Generate Draft Budget with AI ✨'}
              </Button>
            </form>
          </Card>
        )}

        {pageHasAiGeneratedBudget && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"> 
              <div className="p-3 rounded-md border" style={{backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`, borderColor: C3_BORDER_LIGHT}}> 
                <p className="text-xs font-medium" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Total Raised</p>
                <p className="text-lg font-semibold" style={{color: C3_ACCENT_COLOR}}>${totalRaised.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-md border" style={{backgroundColor: `${C3_ERROR_RED}${C3_ACCENT_BACKGROUND_ALPHA}`, borderColor: C3_BORDER_LIGHT}}> 
                <p className="text-xs font-medium" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Planned Expenses</p>
                <p className="text-lg font-semibold" style={{color: C3_ERROR_RED}}>${totalPlannedExpenses.toLocaleString()}</p>
              </div>
              {fundingGoal !== null && (
                <div className={`p-3 rounded-md border ${remainingOrSurplusVsGoal >= 0 ? `bg-[${C3_SUCCESS_GREEN}${C3_ACCENT_BACKGROUND_ALPHA}]` : `bg-[${C3_ERROR_RED}${C3_ACCENT_BACKGROUND_ALPHA}]`}`} style={{borderColor: C3_BORDER_LIGHT}}> 
                    <p className="text-xs font-medium" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Remaining/Surplus vs Goal ({`Goal: $${fundingGoal.toLocaleString()}`})</p>
                    <p className={`text-lg font-semibold ${remainingOrSurplusVsGoal >= 0 ? `text-[${C3_SUCCESS_GREEN}]` : `text-[${C3_ERROR_RED}]`}`}>${remainingOrSurplusVsGoal.toLocaleString()}</p>
                </div>
              )}
               <div className="p-3 rounded-md border" style={{backgroundColor: `${C3_SUCCESS_GREEN}${C3_ACCENT_BACKGROUND_ALPHA}`, borderColor: C3_BORDER_LIGHT}}> 
                    <p className="text-xs font-medium" style={{color: C3_TEXT_SECONDARY_LIGHT}}>Funds Available (Raised - Planned)</p>
                    <p className="text-lg font-semibold" style={{color: C3_SUCCESS_GREEN}}>${remainingBudgetAfterRaised.toLocaleString()}</p>
                </div>
            </div>

            <form onSubmit={handleSaveBudgetItem} className="mb-6 p-4 border rounded-lg" style={{borderColor: C3_BORDER_LIGHT}}>
              <h3 className="text-md font-semibold mb-2" style={{color: C3_TEXT_PRIMARY_LIGHT}}>{editingBudgetItemId ? 'Edit Expense Item' : 'Add New Expense Item'}</h3>
              {editingBudgetItemId && currentAiEstimateNotes && (
                <p className="text-xs mb-2 p-2 rounded bg-yellow-50 border border-yellow-200" style={{color: C3_TEXT_SECONDARY_LIGHT}}>
                  <Info size={12} className="inline mr-1" /> {currentAiEstimateNotes}
                </p>
              )}
              <div className="mb-3">
                <Button type="button" onClick={handleFetchExpenseCategorySuggestions} disabled={isFetchingCategories} small icon={expenseCategorySuggestions.length > 0 ? RefreshCw : Sparkles} className="w-auto">
                  {isFetchingCategories ? 'Getting Ideas...' : (expenseCategorySuggestions.length > 0 ? 'Refresh Category Ideas ✨' : 'AI Category Ideas ✨')}
                </Button>
                {expenseCategorySuggestions.length > 0 && (
                  <div className="mt-2 space-x-1 space-y-1">
                    {expenseCategorySuggestions.map((cat, idx) => (
                      <button key={idx} type="button" onClick={() => { setNewItemDesc(cat); setExpenseCategorySuggestions([]); }}
                        className="text-xs py-1 px-2 rounded-md border hover:bg-gray-100" style={{borderColor: C3_BORDER_LIGHT, color: C3_ACCENT_COLOR}} >{cat}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2">
                <div className="flex-grow mb-2 sm:mb-0"><InputField name="expenseDesc" label="Description" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} placeholder="e.g., Software subscription, or click AI idea" required /></div>
                <div className="w-full sm:w-1/3 mb-2 sm:mb-0"><InputField name="expenseAmount" label="Amount (USDC)" type="number" value={newItemAmount} onChange={(e) => setNewItemAmount(e.target.value)} placeholder="e.g., 50" required step="0.01" /></div>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button type="submit" primary icon={editingBudgetItemId ? Check : PlusCircle} className="w-full sm:w-auto px-4">
                    {editingBudgetItemId ? 'Update Expense' : 'Add Expense'}
                </Button>
                {editingBudgetItemId && (
                    <Button type="button" onClick={() => { setEditingBudgetItemId(null); setNewItemDesc(''); setNewItemAmount(''); setCurrentAiEstimateNotes('');}} className="w-full sm:w-auto px-4">Cancel Edit</Button>
                )}
              </div>
            </form>

            <div>
              <h3 className="text-md font-semibold mb-2" style={{color: C3_TEXT_PRIMARY_LIGHT}}>Planned Expenses:</h3>
              {currentBudgetItems.length > 0 ? (<ul className="space-y-2">{currentBudgetItems.map(item => (<li key={item.id} className="flex justify-between items-center p-3 border rounded-md" style={{borderColor: C3_BORDER_LIGHT}}>
                <div className="flex-1 min-w-0 mr-2"> 
                    <p style={{color: C3_TEXT_PRIMARY_LIGHT}} className="truncate font-medium">{item.description}</p> 
                    {item.aiEstimateNotes && <p className="text-xs italic" style={{color: C3_TEXT_SECONDARY_LIGHT}}>{item.aiEstimateNotes}</p>} 
                    <p className="text-sm font-semibold" style={{color: C3_ACCENT_COLOR}}>${parseFloat(item.amount || 0).toLocaleString()}</p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-1"> 
                    <Button onClick={() => handleEditBudgetItem(item)} small icon={Edit} className="p-1.5 hover:bg-gray-100"/> 
                    <Button onClick={() => removeBudgetItem(currentSupportPageForBudget.id, item.id)} small icon={Trash2} className="p-1.5 !border-red-300 !text-red-500 hover:!bg-red-50"/>
                </div>
                </li>))}</ul>) 
              : (<p className="text-sm" style={{color: C3_TEXT_SECONDARY_LIGHT}}>No expenses added yet. Use the form above or let AI generate a draft.</p>)}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};


// Main App Component
function App() {
  const { screen } = useContext(AppContext);
  const renderScreen = () => {
    switch (screen) {
      case 'CreatorSetup': return <CreatorSetupScreen />;
      case 'PublicTokenPage': return <PublicTokenPage />;
      case 'SupportVerificationFlow': return <SupportVerificationFlow />;
      case 'SupportConfirmation': return <SupportConfirmationScreen />;
      case 'CreatorDashboard': return <CreatorDashboard />;
      case 'DiscoveryScreen': return <DiscoveryScreen />;
      case 'AIGrantScout': return <AIGrantScoutScreen />;
      case 'BudgetingScreen': return <BudgetingScreen />;
      default: return <CreatorSetupScreen />;
    }
  };
  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: C3_LIGHT_BG, color: C3_TEXT_PRIMARY_LIGHT }}>
      <style jsx global>{\`
        body { background-color: ${C3_LIGHT_BG}; }
      \`}</style>
      <Header />
      <main className="container mx-auto px-2 py-4 md:px-4 md:py-8">{renderScreen()}</main>
      <ToastNotification />
    </div>
  );
}

export default function ProvidedApp() {
  return ( <AppProvider><App /></AppProvider> );
}
