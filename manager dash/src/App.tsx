import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OperationalProvider, useOperational } from './context/OperationalContext';
import { LandingPage } from './components/landing/LandingPage';
import { VolunteerMobileView } from './pages/VolunteerMobileView';
import { CrewMobileView } from './pages/CrewMobileView';
import { UserAttendeeView } from './pages/UserAttendeeView';
import { ManagerLayout } from './components/layout/ManagerLayout';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { ZonesPage } from './pages/ZonesPage';
import { TasksPage } from './pages/TasksPage';
import { AlertsPage } from './pages/AlertsPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiIntelligencePage } from './pages/AiIntelligencePage';
import { IncidentsPage } from './pages/IncidentsPage';
import { CrewPage } from './pages/CrewPage';
import { GatesPage } from './pages/GatesPage';
import { ParkingPage } from './pages/ParkingPage';
import { WeatherPage } from './pages/WeatherPage';
import { UserAppHubPage } from './pages/UserAppHubPage';
import { LostAndFoundPage } from './pages/LostAndFoundPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const { activeRoute } = useOperational();

  // If not authenticated, render HACHCELESTIAL Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Role-Based Interface Routing
  if (role === 'volunteer') {
    return <VolunteerMobileView />;
  }

  if (role === 'crew') {
    return <CrewMobileView />;
  }

  if (role === 'user') {
    return <UserAttendeeView />;
  }

  // Default: Manager / Admin Command Interface
  const renderActivePage = () => {
    switch (activeRoute) {
      case '/manager/command':
      case '/manager/live':
        return <ManagerDashboard />;
      case '/manager/intel':
      case '/manager/analytics':
        return <AnalyticsPage />;
      case '/manager/zones':
        return <ZonesPage />;
      case '/manager/gates':
        return <GatesPage />;
      case '/manager/crew':
        return <CrewPage />;
      case '/manager/attendees':
      case '/manager/user-app':
        return <UserAppHubPage />;
      case '/manager/parking':
        return <ParkingPage />;
      case '/manager/weather':
        return <WeatherPage />;
      case '/manager/lost-found':
      case '/manager/incidents':
        return <LostAndFoundPage />;
      case '/manager/alerts':
        return <AlertsPage />;
      case '/manager/ai':
        return <AiIntelligencePage />;
      case '/manager/tasks':
        return <TasksPage />;
      case '/manager/what-if':
        return <WhatIfPage />;
      case '/manager':
      default:
        return <ManagerDashboard />;
    }
  };

  return <ManagerLayout>{renderActivePage()}</ManagerLayout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <OperationalProvider>
        <AppContent />
      </OperationalProvider>
    </AuthProvider>
  );
};

export default App;
