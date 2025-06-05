import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as aiService from '../services/ai';
import {
  LOCALSTORAGE_PAGES_KEY, LOCALSTORAGE_SUPPORTED_KEY, LOCALSTORAGE_CREATOR_VERIFIED_KEY,
  LOCALSTORAGE_BUDGET_ITEMS_KEY, LOCALSTORAGE_AI_BUDGET_GENERATED_KEY,
  LOCALSTORAGE_GRANTS_KEY, LOCALSTORAGE_WORLD_ID_KEY, LOCALSTORAGE_COMMENTS_KEY, LOCALSTORAGE_LIKES_KEY,
  throttle
} from '../services/localStorage';
// Note: fetch import might be needed here if AI functions are not moved out. (Comment can be removed as fetch is handled in ai.js)
// For now, assuming AI functions will be moved to src/services/ai.js which handles its own fetch. (Comment can be removed)

// --- App Context for State Management ---
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [screen, setScreen] = useState('WorldLanding');
  const [activeSupportPageId, setActiveSupportPageId] = useState(null);

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

  // Use AI functions from src/services/ai.js
  const generateAIBudget = useCallback(
    (projectDescription, projectGoal) => aiService.generateAIBudget(projectDescription, projectGoal, showToast, setBudgetItems),
    [showToast, setBudgetItems]
  );

  const generateGrantIdeas = useCallback(
    (projectDescription, projectCategory) => aiService.generateGrantIdeas(projectDescription, projectCategory, showToast, setGrants),
    [showToast, setGrants]
  );

  const generateAvatar = useCallback(
    (name) => aiService.generateAvatar(name, showToast),
    [showToast]
  );

  const generateProjectImage = useCallback(
    (projectTitle, category) => aiService.generateProjectImage(projectTitle, category, showToast),
    [showToast]
  );

  const enhanceDescription = useCallback(
    (basicDescription, projectType) => aiService.enhanceDescription(basicDescription, projectType, showToast),
    [showToast]
  );

  const generateProjectTitle = useCallback(
    (description, category) => aiService.generateProjectTitle(description, category, showToast),
    [showToast]
  );

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
    worldIdVerified, handleWorldIdVerification, handleSimulatedVerification,
    addComment, toggleLike, getPageLikes, isPageLikedByUser, getPageComments
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
