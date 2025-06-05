export const LOCALSTORAGE_PAGES_KEY = "backedSupportPages";
export const LOCALSTORAGE_SUPPORTED_KEY = "backedSupportedPages";
export const LOCALSTORAGE_CREATOR_VERIFIED_KEY = "backedCreatorVerified";
export const LOCALSTORAGE_BUDGET_ITEMS_KEY = "backedBudgetItems";
export const LOCALSTORAGE_AI_BUDGET_GENERATED_KEY = "backedAIBudgetGenerated";
export const LOCALSTORAGE_GRANTS_KEY = "backedGrants";
export const LOCALSTORAGE_WORLD_ID_KEY = "backedWorldId";
export const LOCALSTORAGE_COMMENTS_KEY = "backedComments";
export const LOCALSTORAGE_LIKES_KEY = "backedLikes";

export const throttle = (func, delay) => {
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
