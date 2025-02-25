import { createSearchEngine } from '../../../../../app/bang/search/searchEngine';
import { SearchEngine } from '../../../../../app/bang/search/types';
import {
  Loggers,
  FrecencyStorageProvider
} from '../../../../../app/bang/search/score';
import { FrecencyData } from '../fixtures/types';

const noop = () => {};

const createFakeStorageProvider = (
  frecencyData: FrecencyData
): FrecencyStorageProvider => {
  const data = JSON.stringify(frecencyData);
  return {
    setItem: noop,
    getItem: () => data
  };
};

export const createFakeSearchEngine = (
  data: FrecencyData,
  loggers?: Loggers
): SearchEngine => {
  const contextualFrecencyStorageProvider = createFakeStorageProvider(data);
  let cache: Record<string, string> = {};

  const globalFrecencyStorageProvider = {
    getItem: key => cache[key] || null,
    setItem: (key, value) => {
      cache[key] = value;
    },
    clearCache: () => {
      cache = {};
    }
  };

  return createSearchEngine(
    { contextualFrecencyStorageProvider, globalFrecencyStorageProvider },
    loggers
  );
};
