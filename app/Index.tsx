import '@app/base.scss';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Tasks from './pages/tasks/Tasks';
import Home from './pages/home/Home';

function Index() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </HashRouter>
  );
}

const rootElement = document.getElementById('reactRoot');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
