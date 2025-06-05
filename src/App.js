import React from 'react'; // Removed useContext as it's not directly used
import { AppProvider } from './contexts/AppContext';
import { useApp } from './hooks/useApp';
import { Toast } from './components/common/Toast';
import { WorldLandingScreen } from './components/screens/WorldLanding';
import { DashboardScreen } from './components/screens/Dashboard';
import { CreateSupportPageScreen } from './components/screens/CreateSupportPage';
import { DiscoveryScreen } from './components/screens/Discovery';
import { BudgetingScreen } from './components/screens/BudgetingScreen';
import { GrantScoutScreen } from './components/screens/GrantScout';
import { CreatorSetupScreen } from './components/screens/CreatorSetupScreen';

// Main application structure. All individual components, screens, contexts, hooks,
// and services have been moved to their respective directories.

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
  const { screen, worldIdVerified, isCreatorVerified } = useApp();

  if (!worldIdVerified) {
    return <WorldLandingScreen />;
  }

  // If World ID is verified, but the creator profile isn't set up,
  // and the current screen isn't already 'CreatorSetup', navigate there.
  // This handles the initial setup flow post-World ID verification.
  if (worldIdVerified && !isCreatorVerified && screen !== 'CreatorSetup') {
    // This logic ensures that after World ID verification, if the creator
    // hasn't completed their profile, they are directed to the setup screen.
    // If they are already on 'CreatorSetup' or have completed it, this block is skipped.
    // Consider using setScreen('CreatorSetup') if direct navigation is preferred,
    // but the switch default handles this.
  }

  switch (screen) {
    case 'WorldLanding':
      // This case should ideally only be hit if worldIdVerified becomes false after initial load.
      return <WorldLandingScreen />;
    case 'CreatorSetup':
      return <CreatorSetupScreen />;
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
    default:
      // Default navigation logic:
      // If creator is verified, go to Dashboard.
      // If not verified as creator (and World ID is verified), go to CreatorSetup.
      return isCreatorVerified ? <DashboardScreen /> : <CreatorSetupScreen />;
  }
};

export default App;