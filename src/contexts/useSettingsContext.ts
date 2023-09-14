import { useContext } from 'react';
//
import { SettingsContext } from 'src/features/settings/context/SettingsContext';

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};
