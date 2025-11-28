// Mock for react-native-gesture-handler on web
import React from 'react';

export const GestureHandlerRootView = ({ children, style }) => {
  return React.createElement('div', { style }, children);
};

export const GestureDetector = ({ gesture, children }) => {
  return React.createElement(React.Fragment, null, children);
};

// Export common gesture handlers as no-ops
export const TapGestureHandler = ({ children, onGestureEvent }) => children;
export const PanGestureHandler = ({ children, onGestureEvent }) => children;
export const LongPressGestureHandler = ({ children, onGestureEvent }) => children;

export default {
  GestureHandlerRootView,
  GestureDetector,
  TapGestureHandler,
  PanGestureHandler,
  LongPressGestureHandler,
};

