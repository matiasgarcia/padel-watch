// Mock for react-native-screens on web
import React from 'react';

// Create a ScreenContext with a default value
const defaultContextValue = {
  screensEnabled: true,
  enableScreens: () => {},
};

// Create the context - React.createContext automatically creates Provider and Consumer
const ScreenContext = React.createContext(defaultContextValue);

// Verify Consumer exists (it should be created automatically by React.createContext)
if (!ScreenContext.Consumer) {
  // Fallback if Consumer doesn't exist (shouldn't happen, but just in case)
  ScreenContext.Consumer = ({ children }) => children(defaultContextValue);
}

// Mock Screen component
export const Screen = ({ children, ...props }) => {
  return React.createElement(React.Fragment, null, children);
};

// Mock ScreenContainer component
export const ScreenContainer = ({ children, ...props }) => {
  return React.createElement('div', { style: { flex: 1 } }, children);
};

// Mock ScreenStack component
export const ScreenStack = ({ children, ...props }) => {
  return React.createElement('div', { style: { flex: 1 } }, children);
};

// Mock enableScreens function
export const enableScreens = () => {};

// Mock screensEnabled function
export const screensEnabled = () => true;

// Export the context - this is what @react-navigation/stack uses
export { ScreenContext };

// Default export with all necessary components
const mockModule = {
  Screen,
  ScreenContainer,
  ScreenStack,
  enableScreens,
  screensEnabled,
  ScreenContext,
};

// Make sure the default export also has the context
export default mockModule;
