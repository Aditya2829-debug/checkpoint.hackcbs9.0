import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { HomeScreen } from '../features/home/HomeScreen';
import { ProductAnalysisScreen } from '../features/products/ProductAnalysisScreen';
import { GeminiExplainerScreen } from '../features/ai-explainer/GeminiExplainerScreen';
import { WomenHygieneScreen } from '../features/women-hygiene/WomenHygieneScreen';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { WatchlistScreen } from '../features/watchlist/WatchlistScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeScreen />} />
        <Route path="product/:id" element={<ProductAnalysisScreen />} />
        <Route path="ai-explainer/:id" element={<GeminiExplainerScreen />} />
        <Route path="women-hygiene" element={<WomenHygieneScreen />} />
        <Route path="women-hygiene/:id" element={<WomenHygieneScreen />} />
        <Route path="history" element={<HistoryScreen />} />
        <Route path="explore" element={<HomeScreen />} />
        <Route path="watchlist" element={<WatchlistScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
