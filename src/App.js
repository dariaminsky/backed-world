import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Gift, Users, TrendingUp, DollarSign, Rocket, Search, ChevronLeft, PlusCircle, Trash2, Brain, Sparkles, Award, FileText, Send, ImageIcon, User, Wand2, RefreshCw, Camera, Shield, Globe, Heart, MessageCircle, ThumbsUp, UserCheck, Zap, ShieldCheck } from 'lucide-react';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

// Backed App: Style constants
const C3_LIGHT_BG = '#F9FAFB'; 
const C3_CARD_BG_LIGHT = '#FFFFFF';
const C3_TEXT_PRIMARY_LIGHT = '#111827'; 
const C3_TEXT_SECONDARY_LIGHT = '#6B7280';
const C3_BORDER_LIGHT = '#E5E7EB'; 
const C3_LOGO_HIGHLIGHT = '#22D3EE';
const C3_LOGO_MID = '#00A9E0';
const C3_LOGO_BASE = '#3B82F6';
const C3_ACCENT_COLOR = C3_LOGO_MID;
const C3_ACCENT_BACKGROUND_ALPHA = '33'; 
const C3_ERROR_RED = '#EF4444';
const C3_SUCCESS_GREEN = '#10B981';

// LocalStorage Keys
const LOCALSTORAGE_PAGES_KEY = 'backedSupportPages'; 
const LOCALSTORAGE_SUPPORTED_KEY = 'backedSupportedPages';
const LOCALSTORAGE_CREATOR_VERIFIED_KEY = 'backedCreatorVerified'; 
const LOCALSTORAGE_BUDGET_ITEMS_KEY = 'backedBudgetItems';
const LOCALSTORAGE_AI_BUDGET_GENERATED_KEY = 'backedAIBudgetGenerated';
const LOCALSTORAGE_GRANTS_KEY = 'backedGrants';
const LOCALSTORAGE_WORLD_ID_KEY = 'backedWorldId';
const LOCALSTORAGE_COMMENTS_KEY = 'backedComments';
const LOCALSTORAGE_LIKES_KEY = 'backedLikes';

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
  const [screen, setScreen] = useState('WorldLanding');
  const [activeSupportPageId, setActiveSupportPageId] = useState(null); 
  
  // World ID Verification State
  const [worldIdVerified, setWorldIdVerified] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_WORLD_ID_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) { console.error("Error loading World ID:", error); return null; }
  });
  
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
  
  const [grants, setGrants] = useState(() => {
    try {
      const storedGrants = localStorage.getItem(LOCALSTORAGE_GRANTS_KEY);
      return storedGrants ? new Map(JSON.parse(storedGrants)) : new Map();
    } catch (error) { console.error("Error loading grants:", error); return new Map(); }
  });

  // Social Features State
  const [comments, setComments] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_COMMENTS_KEY);
      return stored ? new Map(JSON.parse(stored)) : new Map();
    } catch (error) { console.error("Error loading comments:", error); return new Map(); }
  });

  const [likes, setLikes] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_LIKES_KEY);
      return stored ? new Map(JSON.parse(stored)) : new Map();
    } catch (error) { console.error("Error loading likes:", error); return new Map(); }
  });
  
  const [toast, setToast] = useState(null);

  const throttledSetSupportPages = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_PAGES_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);
  const throttledSetSupported = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_SUPPORTED_KEY, JSON.stringify(Array.from(value))), 500), []);
  const throttledSetCreatorVerified = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_CREATOR_VERIFIED_KEY, JSON.stringify(value)), 500), []);
  const throttledSetBudgetItems = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_BUDGET_ITEMS_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);
  const throttledSetAIBudgetGenerated = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_AI_BUDGET_GENERATED_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);
  const throttledSetGrants = useCallback(throttle((value) => localStorage.setItem(LOCALSTORAGE_GRANTS_KEY, JSON.stringify(Array.from(value.entries()))), 500), []);

  useEffect(() => { throttledSetSupportPages(supportPages); }, [supportPages, throttledSetSupportPages]);
  useEffect(() => { throttledSetSupported(supportedByMe); }, [supportedByMe, throttledSetSupported]);
  useEffect(() => { throttledSetCreatorVerified(isCreatorVerified); }, [isCreatorVerified, throttledSetCreatorVerified]);
  useEffect(() => { throttledSetBudgetItems(budgetItems); }, [budgetItems, throttledSetBudgetItems]);
  useEffect(() => { throttledSetAIBudgetGenerated(aiBudgetGeneratedForToken); }, [aiBudgetGeneratedForToken, throttledSetAIBudgetGenerated]);
  useEffect(() => { throttledSetGrants(grants); }, [grants, throttledSetGrants]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, key: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const createSupportPage = useCallback((pageData) => {
    const pageId = Date.now().toString();
    const newPage = { id: pageId, ...pageData, supporters: 0, amount: 0 };
    setSupportPages(prev => new Map(prev).set(pageId, newPage));
    return pageId;
  }, []);

  const supportPage = useCallback((pageId, amount) => {
    setSupportPages(prev => {
      const newMap = new Map(prev);
      const page = newMap.get(pageId);
      if (page) {
        newMap.set(pageId, { ...page, supporters: page.supporters + 1, amount: page.amount + amount });
      }
      return newMap;
    });
    setSupportedByMe(prev => new Set(prev).add(pageId));
    showToast('Thank you for your support!', 'success');
  }, [showToast]);

  const createBudgetItem = useCallback((itemData) => {
    const itemId = Date.now().toString();
    const newItem = { id: itemId, ...itemData };
    setBudgetItems(prev => new Map(prev).set(itemId, newItem));
    return itemId;
  }, []);

  const deleteBudgetItem = useCallback((itemId) => {
    setBudgetItems(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  }, []);

  const isPageSupportedByMe = useCallback((pageId) => supportedByMe.has(pageId), [supportedByMe]);

  // AI Functions
  const generateAIBudget = useCallback(async (projectDescription, projectGoal) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.REACT_APP_GOOGLE_AI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a realistic budget breakdown for this project: "${projectDescription}" with a goal of $${projectGoal}. 

Return exactly 5-7 budget items in this exact JSON format (no markdown, no extra text):
[
  {"name": "Item Name", "amount": 150.00, "category": "Equipment", "description": "Brief description"},
  {"name": "Item Name", "amount": 75.00, "category": "Software", "description": "Brief description"}
]

Categories must be one of: Equipment, Software, Marketing, Materials, Services, Other
Amounts should be realistic and add up to roughly the goal amount.`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error('Failed to generate budget');
      
      const data = await response.json();
      const budgetText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      const budgetData = JSON.parse(budgetText.replace(/```json\n?|\n?```/g, ''));
      
      // Add budget items to state
      budgetData.forEach(item => {
        const itemId = Date.now().toString() + Math.random();
        const newItem = { 
          id: itemId, 
          ...item, 
          createdAt: new Date().toISOString(),
          isAIGenerated: true 
        };
        setBudgetItems(prev => new Map(prev).set(itemId, newItem));
      });

      showToast('AI budget generated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('AI Budget Generation Error:', error);
      showToast('Failed to generate AI budget. Please try again.', 'error');
      return false;
    }
  }, [showToast]);

  const generateGrantIdeas = useCallback(async (projectDescription, projectCategory) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.REACT_APP_GOOGLE_AI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Find relevant grants for this ${projectCategory} project: "${projectDescription}"

Return exactly 3-5 grant opportunities in this exact JSON format (no markdown, no extra text):
[
  {
    "name": "Grant Name",
    "organization": "Organization Name",
    "amount": "Up to $X,XXX",
    "deadline": "Month Year or Rolling",
    "description": "Brief description of what they fund",
    "eligibility": "Key eligibility requirements",
    "website": "https://website.com or Contact for info"
  }
]

Focus on real, relevant grants for ${projectCategory} projects. Include a mix of government, foundation, and corporate grants.`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error('Failed to generate grants');
      
      const data = await response.json();
      const grantsText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      const grantsData = JSON.parse(grantsText.replace(/```json\n?|\n?```/g, ''));
      
      // Add grants to state
      grantsData.forEach(grant => {
        const grantId = Date.now().toString() + Math.random();
        const newGrant = { 
          id: grantId, 
          ...grant, 
          createdAt: new Date().toISOString(),
          isAIGenerated: true 
        };
        setGrants(prev => new Map(prev).set(grantId, newGrant));
      });

      showToast('Grant opportunities found!', 'success');
      return true;
    } catch (error) {
      console.error('Grant Generation Error:', error);
      showToast('Failed to find grants. Please try again.', 'error');
      return false;
    }
  }, [showToast]);

  // AI Avatar Generation
  const generateAvatar = useCallback(async (name, style = 'professional') => {
    try {
      // Using DiceBear API for avatar generation (free, no API key needed)
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
      return avatarUrl;
    } catch (error) {
      console.error('Avatar Generation Error:', error);
      showToast('Failed to generate avatar', 'error');
      return null;
    }
  }, [showToast]);

  // AI Project Image Generation (using placeholder service)
  const generateProjectImage = useCallback(async (projectTitle, category) => {
    try {
      // Using Unsplash for project images (free, no API key needed)
      const keywords = `${category},${projectTitle.split(' ').slice(0, 2).join(',')}`;
      const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(keywords)}`;
      return imageUrl;
    } catch (error) {
      console.error('Project Image Generation Error:', error);
      showToast('Failed to generate project image', 'error');
      return null;
    }
  }, [showToast]);

  // AI Description Enhancement
  const enhanceDescription = useCallback(async (basicDescription, projectType) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.REACT_APP_GOOGLE_AI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Enhance this ${projectType} project description to be more compelling and professional for crowdfunding:

Original: "${basicDescription}"

Make it:
- More engaging and persuasive
- Clear about the project's value
- Include why people should support it
- Keep it concise but compelling (2-3 paragraphs max)
- Professional but approachable tone

Return only the enhanced description, no extra formatting.`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error('Failed to enhance description');
      
      const data = await response.json();
      const enhancedText = data.candidates[0].content.parts[0].text.trim();
      
      showToast('Description enhanced!', 'success');
      return enhancedText;
    } catch (error) {
      console.error('Description Enhancement Error:', error);
      showToast('Failed to enhance description', 'error');
      return basicDescription; // Return original on failure
    }
  }, [showToast]);

  // AI Title Generation
  const generateProjectTitle = useCallback(async (description, category) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.REACT_APP_GOOGLE_AI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate 3 compelling project titles for this ${category} project:

Description: "${description}"

Requirements:
- Catchy and memorable
- Clear about what the project is
- Good for crowdfunding campaigns
- 3-8 words each

Return exactly 3 titles in this format (no extra text):
1. Title One
2. Title Two  
3. Title Three`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error('Failed to generate titles');
      
      const data = await response.json();
      const titlesText = data.candidates[0].content.parts[0].text.trim();
      
      // Parse the titles
      const titles = titlesText.split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
      
      return titles;
    } catch (error) {
      console.error('Title Generation Error:', error);
      showToast('Failed to generate titles', 'error');
      return [];
    }
  }, [showToast]);

  // World ID Verification
  const handleWorldIdVerification = useCallback((result) => {
    try {
      const worldIdData = {
        nullifier_hash: result.nullifier_hash,
        merkle_root: result.merkle_root,
        proof: result.proof,
        verification_level: result.verification_level,
        verified_at: new Date().toISOString()
      };
      
      setWorldIdVerified(worldIdData);
      localStorage.setItem(LOCALSTORAGE_WORLD_ID_KEY, JSON.stringify(worldIdData));
      setScreen('Dashboard');
      showToast('Welcome to Backed! You are now verified as a real human.', 'success');
    } catch (error) {
      console.error('World ID verification error:', error);
      showToast('Verification failed. Please try again.', 'error');
    }
  }, [showToast]);

  const handleSimulatedVerification = useCallback(() => {
    try {
      const simulatedWorldIdData = {
        nullifier_hash: 'simulated_nullifier_' + Date.now(),
        merkle_root: 'simulated_merkle_root',
        proof: 'simulated_proof_data',
        verification_level: 'orb',
        verified_at: new Date().toISOString(),
        simulated: true
      };
      
      setWorldIdVerified(simulatedWorldIdData);
      localStorage.setItem(LOCALSTORAGE_WORLD_ID_KEY, JSON.stringify(simulatedWorldIdData));
      setScreen('Dashboard');
      showToast('🔒 Simulated verification successful! Welcome to Backed!', 'success');
    } catch (error) {
      console.error('Simulated verification error:', error);
      showToast('Simulated verification failed. Please try again.', 'error');
    }
  }, [showToast]);

  // Social Features
  const addComment = useCallback((pageId, comment) => {
    const commentId = Date.now().toString();
    const newComment = {
      id: commentId,
      pageId,
      text: comment,
      author: worldIdVerified ? 'Verified Human' : 'Anonymous',
      isVerified: !!worldIdVerified,
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => {
      const newMap = new Map(prev);
      const pageComments = newMap.get(pageId) || [];
      newMap.set(pageId, [...pageComments, newComment]);
      localStorage.setItem(LOCALSTORAGE_COMMENTS_KEY, JSON.stringify(Array.from(newMap.entries())));
      return newMap;
    });
    
    showToast('Comment added!', 'success');
  }, [worldIdVerified, showToast]);

  const toggleLike = useCallback((pageId) => {
    if (!worldIdVerified) {
      showToast('Please verify with World ID to like projects', 'error');
      return;
    }

    setLikes(prev => {
      const newMap = new Map(prev);
      const pageLikes = newMap.get(pageId) || new Set();
      const userHash = worldIdVerified.nullifier_hash;
      
      if (pageLikes.has(userHash)) {
        pageLikes.delete(userHash);
      } else {
        pageLikes.add(userHash);
      }
      
      newMap.set(pageId, pageLikes);
      localStorage.setItem(LOCALSTORAGE_LIKES_KEY, JSON.stringify(Array.from(newMap.entries()).map(([k, v]) => [k, Array.from(v)])));
      return newMap;
    });
  }, [worldIdVerified, showToast]);

  const getPageLikes = useCallback((pageId) => {
    const pageLikes = likes.get(pageId) || new Set();
    return pageLikes.size;
  }, [likes]);

  const isPageLikedByUser = useCallback((pageId) => {
    if (!worldIdVerified) return false;
    const pageLikes = likes.get(pageId) || new Set();
    return pageLikes.has(worldIdVerified.nullifier_hash);
  }, [likes, worldIdVerified]);

  const getPageComments = useCallback((pageId) => {
    return comments.get(pageId) || [];
  }, [comments]);

  const value = {
    screen, setScreen,
    activeSupportPageId, setActiveSupportPageId,
    isCreatorVerified, setIsCreatorVerified,
    supportPages, setSupportPages,
    supportedByMe, setSupportedByMe,
    budgetItems, setBudgetItems,
    aiBudgetGeneratedForToken, setAiBudgetGeneratedForToken,
    grants, setGrants,
    toast, showToast,
    createSupportPage, supportPage, isPageSupportedByMe,
    createBudgetItem, deleteBudgetItem,
    generateAIBudget, generateGrantIdeas,
    generateAvatar, generateProjectImage, enhanceDescription, generateProjectTitle,
    // World ID & Social Features
    worldIdVerified, handleWorldIdVerification, handleSimulatedVerification,
    addComment, toggleLike, getPageLikes, isPageLikedByUser, getPageComments
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// --- Toast Component ---
const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const toastStyles = {
    info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
    success: { bg: '#F0FDF4', border: C3_SUCCESS_GREEN, text: '#15803D' },
    error: { bg: '#FEF2F2', border: C3_ERROR_RED, text: '#DC2626' }
  };

  const style = toastStyles[toast.type] || toastStyles.info;

  return (
    <div
      style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
        backgroundColor: style.bg, border: `1px solid ${style.border}`,
        color: style.text, padding: '12px 16px', borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        maxWidth: '300px', fontSize: '14px'
      }}
    >
      {toast.message}
    </div>
  );
};

// --- Logo Component ---
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

// --- Button Component ---
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', style = {} }) => {
  const baseStyle = {
    border: 'none', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '500', transition: 'all 0.2s ease', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', gap: '6px'
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 16px', fontSize: '16px' },
    lg: { padding: '12px 20px', fontSize: '18px' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#9CA3AF' : C3_ACCENT_COLOR, color: 'white',
      boxShadow: disabled ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    secondary: {
      backgroundColor: disabled ? '#F3F4F6' : C3_CARD_BG_LIGHT,
      color: disabled ? '#9CA3AF' : C3_TEXT_PRIMARY_LIGHT,
      border: `1px solid ${disabled ? '#D1D5DB' : C3_BORDER_LIGHT}`
    },
    outline: {
      backgroundColor: 'transparent', color: disabled ? '#9CA3AF' : C3_ACCENT_COLOR,
      border: `1px solid ${disabled ? '#D1D5DB' : C3_ACCENT_COLOR}`
    }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
};

// --- Input Component ---
const Input = ({ label, value, onChange, placeholder = '', type = 'text', required = false, className = '', style = {} }) => (
  <div className={className} style={style}>
    {label && (
      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
        {label} {required && <span style={{ color: C3_ERROR_RED }}>*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
        borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
        color: C3_TEXT_PRIMARY_LIGHT
      }}
    />
  </div>
);

// --- TextArea Component ---
const TextArea = ({ label, value, onChange, placeholder = '', rows = 3, required = false, className = '', style = {} }) => (
  <div className={className} style={style}>
    {label && (
      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
        {label} {required && <span style={{ color: C3_ERROR_RED }}>*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      style={{
        width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
        borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
        color: C3_TEXT_PRIMARY_LIGHT, resize: 'vertical'
      }}
    />
  </div>
);

// --- World Landing Screen ---
const WorldLandingScreen = () => {
  const { handleWorldIdVerification, handleSimulatedVerification, worldIdVerified } = useApp();

  if (worldIdVerified) {
    return <DashboardScreen />;
  }

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <GradientSphereLogo size={80} />
              <div style={{ 
                position: 'absolute', top: '-8px', right: '-8px',
                backgroundColor: '#22c55e', borderRadius: '50%', padding: '4px'
              }}>
                <Shield size={20} color="white" />
              </div>
            </div>
          </div>
          
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '16px', lineHeight: '1.2' }}>
            The First <span style={{ color: '#22c55e' }}>Scam-Proof</span><br />Creator Platform
          </h1>
          
          <p style={{ fontSize: '20px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '32px', lineHeight: '1.5' }}>
            Fund creators you can trust. Every user is verified as a real human through World ID.
          </p>

          {/* Value Props */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                backgroundColor: '#f0fdf4', borderRadius: '50%', width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <UserCheck size={28} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                No Fake Supporters
              </h3>
              <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                Every backer verified as real human
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                backgroundColor: '#eff6ff', borderRadius: '50%', width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <Globe size={28} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                Global Trust
              </h3>
              <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                Built on World Network verification
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                backgroundColor: '#fef7ff', borderRadius: '50%', width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <Zap size={28} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                AI-Powered
              </h3>
              <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                Smart tools to launch faster
              </p>
            </div>
          </div>
        </div>

        {/* World ID Verification */}
        <div style={{ 
          backgroundColor: C3_CARD_BG_LIGHT, padding: '32px', borderRadius: '20px', 
          border: `2px solid #22c55e`, marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(34, 197, 94, 0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '16px' }}>
            Join the Verified Creator Community
          </h2>
          <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '24px' }}>
            Verify you're human to start creating and supporting projects
          </p>
          
          <IDKitWidget
            app_id={process.env.REACT_APP_WORLD_APP_ID || "app_staging_2a0c1a10e8b8af51e9c8f2c8a5b4a3d2"}
            action="backed_verification"
            onSuccess={handleWorldIdVerification}
            handleVerify={(result) => Promise.resolve(result)}
          >
            {({ open }) => (
              <Button 
                onClick={open}
                size="lg"
                style={{ 
                  backgroundColor: '#22c55e', borderColor: '#22c55e',
                  fontSize: '18px', padding: '16px 32px', borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                }}
              >
                <Shield size={20} /> Verify with World ID
              </Button>
            )}
          </IDKitWidget>
          
          {/* Simulated Verification for Testing */}
          <div style={{ 
            marginTop: '16px', padding: '16px', backgroundColor: '#fef3c7', 
            borderRadius: '12px', border: '1px dashed #d97706' 
          }}>
            <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '12px', textAlign: 'center' }}>
              🧪 For testing: World ID not available in your region?
            </p>
            <Button 
              onClick={handleSimulatedVerification}
              variant="secondary"
              size="sm"
              style={{ 
                backgroundColor: '#fbbf24', borderColor: '#f59e0b', color: 'white',
                fontSize: '14px', width: '100%'
              }}
            >
              <Shield size={16} /> Use Simulated Verification
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span>Privacy-preserving</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span>Decentralized</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Creator Setup Screen ---
const CreatorSetupScreen = () => {
  const { setIsCreatorVerified, setScreen, showToast, generateAvatar } = useApp();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    name: '', bio: '', twitter: '', website: '', avatar: ''
  });
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const handleInputChange = (field, value) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateAvatar = async () => {
    if (!verificationData.name.trim()) {
      showToast('Please enter your name first', 'error');
      return;
    }
    
    setIsGeneratingAvatar(true);
    const avatarUrl = await generateAvatar(verificationData.name);
    setIsGeneratingAvatar(false);
    
    if (avatarUrl) {
      setVerificationData(prev => ({ ...prev, avatar: avatarUrl }));
    }
  };

  const handleSubmit = () => {
    if (!verificationData.name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    setIsCreatorVerified(true);
    setScreen('Dashboard');
    showToast('Creator profile set up successfully!', 'success');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <GradientSphereLogo size={64} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '12px' }}>
              Welcome to Backed
            </h1>
            <p style={{ fontSize: '18px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              The platform where creators get the support they need to bring their projects to life.
            </p>
            <Button onClick={() => setStep(2)} size="lg">
              Get Started <Rocket size={20} />
            </Button>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '24px', textAlign: 'center' }}>
              Set Up Your Creator Profile
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Creator Name"
                value={verificationData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your name or brand"
                required
              />

              {/* AI Avatar Section */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Profile Avatar
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    backgroundColor: C3_BORDER_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {verificationData.avatar ? (
                      <img src={verificationData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={32} color={C3_TEXT_SECONDARY_LIGHT} />
                    )}
                  </div>
                  <Button 
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar || !verificationData.name.trim()}
                    variant="outline"
                    style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                  >
                    {isGeneratingAvatar ? <Sparkles size={16} /> : <Wand2 size={16} />}
                    {isGeneratingAvatar ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
              </div>
              
              <TextArea
                label="Bio"
                value={verificationData.bio}
                onChange={(value) => handleInputChange('bio', value)}
                placeholder="Tell people about yourself and what you create"
                rows={4}
              />
              
              <Input
                label="Twitter"
                value={verificationData.twitter}
                onChange={(value) => handleInputChange('twitter', value)}
                placeholder="@yourusername"
              />
              
              <Input
                label="Website"
                value={verificationData.website}
                onChange={(value) => handleInputChange('website', value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} style={{ flex: 1 }}>
                Complete Setup
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {renderStep()}
      </div>
    </div>
  );
};

// --- Dashboard Screen ---
const DashboardScreen = () => {
  const { setScreen, supportPages, budgetItems, grants, worldIdVerified } = useApp();

  const totalSupportPages = supportPages.size;
  const totalSupport = Array.from(supportPages.values()).reduce((sum, page) => sum + page.amount, 0);
  const totalBudgetItems = budgetItems.size;
  const totalGrants = grants.size;

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GradientSphereLogo size={32} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, margin: 0 }}>
                Backed
              </h1>
              <p style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT, margin: 0 }}>
                Scam-Proof Creator Platform
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {worldIdVerified && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#f0fdf4', color: '#22c55e', padding: '4px 12px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '500'
              }}>
                <UserCheck size={14} />
                Verified Human
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
            Creator Dashboard
          </h2>
          <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT }}>
            Manage your support pages and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Users size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Support Pages
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              {totalSupportPages}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              Active campaigns
            </p>
          </div>

          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <DollarSign size={24} color={C3_SUCCESS_GREEN} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Total Support
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              ${totalSupport.toFixed(2)}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              From supporters
            </p>
          </div>

          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <TrendingUp size={24} color={C3_LOGO_MID} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Budget Items
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              {totalBudgetItems}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              Tracked expenses
            </p>
          </div>

          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Award size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Grant Leads
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              {totalGrants}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              Opportunities found
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div 
            onClick={() => setScreen('CreateSupportPage')}
            style={{ 
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', 
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = C3_ACCENT_COLOR}
            onMouseLeave={(e) => e.target.style.borderColor = C3_BORDER_LIGHT}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <PlusCircle size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Create Support Page
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              Launch a new campaign to get support for your next project
            </p>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </div>

          <div 
            onClick={() => setScreen('Discovery')}
            style={{ 
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', 
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = C3_ACCENT_COLOR}
            onMouseLeave={(e) => e.target.style.borderColor = C3_BORDER_LIGHT}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Search size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Discover Creators
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              Find and support other creators in the community
            </p>
            <Button variant="outline" size="sm">
              Explore
            </Button>
          </div>

          <div 
            onClick={() => setScreen('Budgeting')}
            style={{ 
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', 
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = C3_ACCENT_COLOR}
            onMouseLeave={(e) => e.target.style.borderColor = C3_BORDER_LIGHT}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <DollarSign size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Budget Planner
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              Plan and track your project expenses with AI assistance
            </p>
            <Button variant="outline" size="sm">
              Plan Budget
            </Button>
          </div>

          <div 
            onClick={() => setScreen('GrantScout')}
            style={{ 
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', 
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#8B5CF6'}
            onMouseLeave={(e) => e.target.style.borderColor = C3_BORDER_LIGHT}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Award size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Grant Scout
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              AI-powered grant discovery tailored to your projects
            </p>
            <Button variant="outline" size="sm" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}>
              <Brain size={16} /> Find Grants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Create Support Page Screen ---
const CreateSupportPageScreen = () => {
  const { setScreen, createSupportPage, showToast, generateProjectImage, enhanceDescription, generateProjectTitle } = useApp();
  const [formData, setFormData] = useState({
    title: '', description: '', goal: '', category: 'Art', image: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description.trim()) {
      showToast('Please enter a basic description first', 'error');
      return;
    }
    
    setIsEnhancing(true);
    const enhanced = await enhanceDescription(formData.description, formData.category);
    setIsEnhancing(false);
    
    if (enhanced && enhanced !== formData.description) {
      setFormData(prev => ({ ...prev, description: enhanced }));
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.title.trim()) {
      showToast('Please enter a project title first', 'error');
      return;
    }
    
    setIsGeneratingImage(true);
    const imageUrl = await generateProjectImage(formData.title, formData.category);
    setIsGeneratingImage(false);
    
    if (imageUrl) {
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleGenerateTitles = async () => {
    if (!formData.description.trim()) {
      showToast('Please enter a description first', 'error');
      return;
    }
    
    setIsGeneratingTitles(true);
    const titles = await generateProjectTitle(formData.description, formData.category);
    setIsGeneratingTitles(false);
    
    if (titles.length > 0) {
      setSuggestedTitles(titles);
    }
  };

  const selectTitle = (title) => {
    setFormData(prev => ({ ...prev, title }));
    setSuggestedTitles([]);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.goal) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const goalAmount = parseFloat(formData.goal);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      showToast('Please enter a valid goal amount', 'error');
      return;
    }

    const pageId = createSupportPage({
      ...formData,
      goal: goalAmount,
      createdAt: new Date().toISOString()
    });

    showToast('Support page created successfully!', 'success');
    setScreen('Dashboard');
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => setScreen('Dashboard')} size="sm" style={{ marginRight: '16px' }}>
            <ChevronLeft size={16} /> Back
          </Button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GradientSphereLogo size={24} />
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT }}>
              Create Support Page
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '32px', borderRadius: '16px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '24px' }}>
            Tell us about your project
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* AI-Enhanced Project Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Title <span style={{ color: C3_ERROR_RED }}>*</span>
                </label>
                <Button 
                  onClick={handleGenerateTitles}
                  disabled={isGeneratingTitles || !formData.description.trim()}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  {isGeneratingTitles ? <Sparkles size={14} /> : <Brain size={14} />}
                  {isGeneratingTitles ? 'Generating...' : 'AI Suggest'}
                </Button>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Give your project a compelling title"
                style={{
                  width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                  borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                  color: C3_TEXT_PRIMARY_LIGHT
                }}
              />
              
              {/* AI Title Suggestions */}
              {suggestedTitles.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <p style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '8px' }}>
                    AI Suggestions:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {suggestedTitles.map((title, index) => (
                      <button
                        key={index}
                        onClick={() => selectTitle(title)}
                        style={{
                          padding: '8px 12px', border: `1px solid #8B5CF6`, borderRadius: '6px',
                          backgroundColor: 'transparent', color: '#8B5CF6', fontSize: '14px',
                          cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI-Enhanced Description */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Description <span style={{ color: C3_ERROR_RED }}>*</span>
                </label>
                <Button 
                  onClick={handleEnhanceDescription}
                  disabled={isEnhancing || !formData.description.trim()}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  {isEnhancing ? <Sparkles size={14} /> : <Wand2 size={14} />}
                  {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you're creating and why it matters"
                rows={6}
                style={{
                  width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                  borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                  color: C3_TEXT_PRIMARY_LIGHT, resize: 'vertical'
                }}
              />
            </div>

            {/* AI Project Image */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Image
                </label>
                <Button 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !formData.title.trim()}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  {isGeneratingImage ? <Sparkles size={14} /> : <Camera size={14} />}
                  {isGeneratingImage ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
              <div style={{ 
                width: '100%', height: '200px', border: `1px solid ${C3_BORDER_LIGHT}`,
                borderRadius: '8px', overflow: 'hidden', backgroundColor: C3_BORDER_LIGHT,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {formData.image ? (
                  <img src={formData.image} alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: C3_TEXT_SECONDARY_LIGHT }}>
                    <ImageIcon size={32} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '14px' }}>No image yet</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Funding Goal"
                value={formData.goal}
                onChange={(value) => handleInputChange('goal', value)}
                placeholder="1000"
                type="number"
                required
              />

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                    borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                    color: C3_TEXT_PRIMARY_LIGHT
                  }}
                >
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Film">Film</option>
                  <option value="Writing">Writing</option>
                  <option value="Games">Games</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setScreen('Dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} style={{ flex: 1 }}>
                Create Support Page
              </Button>
            </div>
            
            {/* AI Helper Note */}
            <div style={{ 
              backgroundColor: '#F0F9FF', border: '1px solid #8B5CF6', borderRadius: '8px', 
              padding: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' 
            }}>
              <Brain size={16} color="#8B5CF6" />
              <p style={{ fontSize: '14px', color: '#8B5CF6', margin: 0 }}>
                <strong>Pro Tip:</strong> After creating your page, visit Budget Planner to auto-generate a detailed budget breakdown for your project!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Discovery Screen ---
const DiscoveryScreen = () => {
  const { setScreen, supportPages, supportPage, isPageSupportedByMe, toggleLike, getPageLikes, isPageLikedByUser, addComment, getPageComments, worldIdVerified } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeComments, setActiveComments] = useState({});
  const [newComment, setNewComment] = useState('');

  const supportPagesArray = Array.from(supportPages.values());
  
  const filteredPages = supportPagesArray.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSupport = (pageId) => {
    const amount = 10;
    supportPage(pageId, amount);
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="secondary" onClick={() => setScreen('Dashboard')} size="sm" style={{ marginRight: '16px' }}>
              <ChevronLeft size={16} /> Back
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <GradientSphereLogo size={24} />
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT }}>
                Discover Creators
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Search */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C3_TEXT_SECONDARY_LIGHT }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              style={{
                width: '100%', padding: '12px 12px 12px 40px', border: `1px solid ${C3_BORDER_LIGHT}`,
                borderRadius: '8px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                color: C3_TEXT_PRIMARY_LIGHT
              }}
            />
          </div>
        </div>

        {/* Support Pages Grid */}
        {filteredPages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Search size={48} color={C3_TEXT_SECONDARY_LIGHT} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              No projects found
            </h3>
            <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a support page!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredPages.map(page => {
              const progressPercentage = page.goal > 0 ? (page.amount / page.goal) * 100 : 0;
              const isSupported = isPageSupportedByMe(page.id);
              
              return (
                <div key={page.id} style={{ 
                  backgroundColor: C3_CARD_BG_LIGHT, borderRadius: '16px', 
                  border: `1px solid ${C3_BORDER_LIGHT}`, overflow: 'hidden' 
                }}>
                  {/* Project Image */}
                  {page.image && (
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={page.image} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ 
                          backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`, 
                          color: C3_ACCENT_COLOR, padding: '4px 8px', borderRadius: '6px', 
                          fontSize: '12px', fontWeight: '500' 
                        }}>
                          {page.category}
                        </span>
                        {page.image && (
                          <span style={{ 
                            backgroundColor: '#F0F9FF', color: '#8B5CF6', 
                            padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <Brain size={10} /> AI Enhanced
                          </span>
                        )}
                      </div>
                      {isSupported && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: C3_SUCCESS_GREEN }}>
                          <CheckCircle size={16} />
                          <span style={{ fontSize: '12px', fontWeight: '500' }}>Supported</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                      {page.title}
                    </h3>
                    
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px', lineHeight: '1.5' }}>
                      {page.description.length > 120 ? `${page.description.substring(0, 120)}...` : page.description}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                          ${page.amount.toFixed(2)} raised
                        </span>
                        <span style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                          ${page.goal.toFixed(2)} goal
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: C3_BORDER_LIGHT, borderRadius: '4px' }}>
                        <div style={{ 
                          width: `${Math.min(progressPercentage, 100)}%`, height: '100%', 
                          backgroundColor: C3_SUCCESS_GREEN, borderRadius: '4px' 
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT }}>
                          {page.supporters} supporters
                        </span>
                        <span style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT }}>
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Social Actions */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <button
                        onClick={() => toggleLike(page.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                          color: isPageLikedByUser(page.id) ? '#EF4444' : C3_TEXT_SECONDARY_LIGHT,
                          fontSize: '14px'
                        }}
                      >
                        <Heart size={16} fill={isPageLikedByUser(page.id) ? '#EF4444' : 'none'} />
                        {getPageLikes(page.id)}
                      </button>
                      
                      <button
                        onClick={() => setActiveComments(prev => ({ 
                          ...prev, 
                          [page.id]: !prev[page.id] 
                        }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                          color: C3_TEXT_SECONDARY_LIGHT, fontSize: '14px'
                        }}
                      >
                        <MessageCircle size={16} />
                        {getPageComments(page.id).length}
                      </button>
                      
                      {worldIdVerified && (
                        <div style={{ 
                          display: 'flex', alignItems: 'center', gap: '4px', 
                          marginLeft: 'auto', fontSize: '12px', color: C3_SUCCESS_GREEN 
                        }}>
                          <ShieldCheck size={14} />
                          Verified Creator
                        </div>
                      )}
                    </div>

                    {/* Comments Section */}
                    {activeComments[page.id] && (
                      <div style={{ 
                        backgroundColor: C3_LIGHT_BG, padding: '16px', borderRadius: '8px', 
                        marginBottom: '16px', border: `1px solid ${C3_BORDER_LIGHT}` 
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                            Comments
                          </h4>
                          
                          {getPageComments(page.id).length === 0 ? (
                            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                              No comments yet. Be the first to comment!
                            </p>
                          ) : (
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {getPageComments(page.id).map((comment, index) => (
                                <div key={index} style={{ 
                                  padding: '8px 0', borderBottom: index < getPageComments(page.id).length - 1 ? `1px solid ${C3_BORDER_LIGHT}` : 'none' 
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                                      Anonymous User
                                    </span>
                                    <ShieldCheck size={12} color={C3_SUCCESS_GREEN} />
                                    <span style={{ fontSize: '10px', color: C3_TEXT_SECONDARY_LIGHT }}>
                                      {new Date(comment.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: '14px', color: C3_TEXT_PRIMARY_LIGHT }}>
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {worldIdVerified ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              style={{
                                flex: 1, padding: '8px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                                borderRadius: '6px', fontSize: '14px', backgroundColor: C3_CARD_BG_LIGHT,
                                color: C3_TEXT_PRIMARY_LIGHT
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (newComment.trim()) {
                                  addComment(page.id, newComment.trim());
                                  setNewComment('');
                                }
                              }}
                              size="sm"
                              disabled={!newComment.trim()}
                            >
                              Post
                            </Button>
                          </div>
                        ) : (
                          <div style={{ 
                            textAlign: 'center', padding: '12px', backgroundColor: C3_CARD_BG_LIGHT, 
                            borderRadius: '6px', border: `1px dashed ${C3_BORDER_LIGHT}` 
                          }}>
                            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '8px' }}>
                              Verify with World ID to comment
                            </p>
                            <Button size="sm" onClick={() => setScreen('WorldLanding')}>
                              <ShieldCheck size={14} /> Verify Now
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      onClick={() => handleSupport(page.id)}
                      disabled={isSupported}
                      style={{ width: '100%' }}
                    >
                      {isSupported ? (
                        <>
                          <CheckCircle size={16} /> Supported
                        </>
                      ) : (
                        <>
                          <Gift size={16} /> Support $10
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Budgeting Screen ---
const BudgetingScreen = () => {
  const { setScreen, budgetItems, createBudgetItem, deleteBudgetItem, generateAIBudget, supportPages } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '', amount: '', category: 'Equipment', description: ''
  });
  const [aiFormData, setAiFormData] = useState({
    description: '', goal: ''
  });

  const budgetItemsArray = Array.from(budgetItems.values());
  const totalBudget = budgetItemsArray.reduce((sum, item) => sum + item.amount, 0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.amount) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    createBudgetItem({
      ...formData,
      amount,
      createdAt: new Date().toISOString()
    });

    setFormData({ name: '', amount: '', category: 'Equipment', description: '' });
    setShowAddForm(false);
  };

  const handleDelete = (itemId) => {
    deleteBudgetItem(itemId);
  };

  const handleAIGenerate = async () => {
    if (!aiFormData.description.trim() || !aiFormData.goal) return;
    
    setIsGenerating(true);
    const success = await generateAIBudget(aiFormData.description, aiFormData.goal);
    setIsGenerating(false);
    
    if (success) {
      setShowAIForm(false);
      setAiFormData({ description: '', goal: '' });
    }
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="secondary" onClick={() => setScreen('Dashboard')} size="sm" style={{ marginRight: '16px' }}>
              <ChevronLeft size={16} /> Back
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <GradientSphereLogo size={24} />
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT }}>
                Budget Planner
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={() => setShowAIForm(true)} style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}>
              <Brain size={16} /> AI Generate
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <PlusCircle size={16} /> Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Summary Card */}
        <div style={{ 
          backgroundColor: C3_CARD_BG_LIGHT, padding: '32px', borderRadius: '16px', 
          border: `1px solid ${C3_BORDER_LIGHT}`, marginBottom: '32px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '8px' }}>
              Total Budget
            </h2>
            <p style={{ fontSize: '40px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              ${totalBudget.toFixed(2)}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              {budgetItemsArray.length} items tracked
            </p>
          </div>
        </div>

        {/* AI Generate Form */}
        {showAIForm && (
          <div style={{ 
            backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px', 
            border: `1px solid #8B5CF6`, marginBottom: '32px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Brain size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                AI Budget Generator
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <TextArea
                label="Project Description"
                value={aiFormData.description}
                onChange={(value) => setAiFormData(prev => ({ ...prev, description: value }))}
                placeholder="Describe your project (e.g., 'Creating an indie game about space exploration')"
                rows={3}
              />
              
              <Input
                label="Target Budget"
                value={aiFormData.goal}
                onChange={(value) => setAiFormData(prev => ({ ...prev, goal: value }))}
                placeholder="5000"
                type="number"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setShowAIForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiFormData.description.trim() || !aiFormData.goal}
                style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
              >
                {isGenerating ? <Sparkles size={16} /> : <Brain size={16} />}
                {isGenerating ? 'Generating...' : 'Generate Budget'}
              </Button>
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showAddForm && (
          <div style={{ 
            backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px', 
            border: `1px solid ${C3_BORDER_LIGHT}`, marginBottom: '32px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '20px' }}>
              Add Budget Item
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Input
                label="Item Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="e.g. Camera equipment"
              />
              
              <Input
                label="Amount"
                value={formData.amount}
                onChange={(value) => handleInputChange('amount', value)}
                placeholder="0.00"
                type="number"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                    borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                    color: C3_TEXT_PRIMARY_LIGHT
                  }}
                >
                  <option value="Equipment">Equipment</option>
                  <option value="Software">Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Materials">Materials</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <TextArea
                label="Description (Optional)"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Additional details about this expense"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Add Item
              </Button>
            </div>
          </div>
        )}

        {/* Budget Items List */}
        {budgetItemsArray.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <DollarSign size={48} color={C3_TEXT_SECONDARY_LIGHT} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              No budget items yet
            </h3>
            <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '24px' }}>
              Start planning your project budget by adding expense items
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <PlusCircle size={16} /> Add First Item
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgetItemsArray.map(item => (
              <div key={item.id} style={{ 
                backgroundColor: C3_CARD_BG_LIGHT, padding: '20px', borderRadius: '12px', 
                border: `1px solid ${C3_BORDER_LIGHT}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT }}>
                      {item.name}
                    </h3>
                    <span style={{ 
                      backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`, 
                      color: C3_ACCENT_COLOR, padding: '2px 8px', borderRadius: '4px', 
                      fontSize: '12px', fontWeight: '500' 
                    }}>
                      {item.category}
                    </span>
                    {item.isAIGenerated && (
                      <span style={{ 
                        backgroundColor: '#F0F9FF', color: '#8B5CF6', 
                        padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Brain size={10} /> AI
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '4px' }}>
                      {item.description}
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT }}>
                    ${item.amount.toFixed(2)}
                  </span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    style={{ color: C3_ERROR_RED, borderColor: C3_ERROR_RED }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Grant Scout Screen ---
const GrantScoutScreen = () => {
  const { setScreen, grants, generateGrantIdeas } = useApp();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState({
    description: '', category: 'Art'
  });

  const grantsArray = Array.from(grants.values());

  const handleSearch = async () => {
    if (!searchData.description.trim()) return;
    
    setIsSearching(true);
    const success = await generateGrantIdeas(searchData.description, searchData.category);
    setIsSearching(false);
    
    if (success) {
      setShowSearchForm(false);
    }
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="secondary" onClick={() => setScreen('Dashboard')} size="sm" style={{ marginRight: '16px' }}>
              <ChevronLeft size={16} /> Back
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <GradientSphereLogo size={24} />
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT }}>
                Grant Scout
              </h1>
            </div>
          </div>
          <Button onClick={() => setShowSearchForm(true)} style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}>
            <Brain size={16} /> Find Grants
          </Button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Award size={48} color="#8B5CF6" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
            AI-Powered Grant Discovery
          </h2>
          <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, maxWidth: '600px', margin: '0 auto' }}>
            Discover funding opportunities tailored to your projects using advanced AI analysis
          </p>
        </div>

        {/* Search Form */}
        {showSearchForm && (
          <div style={{ 
            backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px', 
            border: `1px solid #8B5CF6`, marginBottom: '32px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Brain size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Describe Your Project
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <TextArea
                label="Project Description"
                value={searchData.description}
                onChange={(value) => setSearchData(prev => ({ ...prev, description: value }))}
                placeholder="Describe your project in detail (e.g., 'Developing an educational app for children with learning disabilities')"
                rows={4}
              />
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Category
                </label>
                <select
                  value={searchData.category}
                  onChange={(e) => setSearchData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                    borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                    color: C3_TEXT_PRIMARY_LIGHT
                  }}
                >
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Film">Film</option>
                  <option value="Writing">Writing</option>
                  <option value="Games">Games</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setShowSearchForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchData.description.trim()}
                style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
              >
                {isSearching ? <Sparkles size={16} /> : <Search size={16} />}
                {isSearching ? 'Searching...' : 'Find Grants'}
              </Button>
            </div>
          </div>
        )}

        {/* Grants List */}
        {grantsArray.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Award size={48} color={C3_TEXT_SECONDARY_LIGHT} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              No grants found yet
            </h3>
            <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '24px' }}>
              Use AI to discover funding opportunities for your projects
            </p>
            <Button onClick={() => setShowSearchForm(true)} style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}>
              <Brain size={16} /> Start Grant Search
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT }}>
                Grant Opportunities ({grantsArray.length})
              </h3>
            </div>
            
            {grantsArray.map(grant => (
              <div key={grant.id} style={{ 
                backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px', 
                border: `1px solid ${C3_BORDER_LIGHT}`
              }}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
                      {grant.name}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#8B5CF6', fontWeight: '500', marginBottom: '8px' }}>
                      {grant.organization}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      backgroundColor: '#F0FDF4', color: '#15803D', 
                      padding: '4px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' 
                    }}>
                      {grant.amount}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px', lineHeight: '1.5' }}>
                  {grant.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
                      DEADLINE
                    </p>
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                      {grant.deadline}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
                      ELIGIBILITY
                    </p>
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                      {grant.eligibility}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                    {grant.website}
                  </span>
                  <Button variant="outline" size="sm">
                    <FileText size={14} /> Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  return (
    <AppProvider>
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <AppContent />
        <Toast />
      </div>
    </AppProvider>
  );
};

const AppContent = () => {
  const { screen, worldIdVerified } = useApp();

  // If not verified with World ID, show landing
  if (!worldIdVerified) {
    return <WorldLandingScreen />;
  }

  // Once verified, show the appropriate screen
  switch (screen) {
    case 'Dashboard':
      return <DashboardScreen />;
    case 'CreateSupportPage':
      return <CreateSupportPageScreen />;
    case 'Discovery':
      return <DiscoveryScreen />;
    case 'Budgeting':
      return <BudgetingScreen />;
    case 'GrantScout':
      return <GrantScoutScreen />;
    case 'WorldLanding':
      return <WorldLandingScreen />;
    default:
      return <DashboardScreen />;
  }
};

export default App;