import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes';

function App() {
  return (
    // 1. Router Paling Luar
    <BrowserRouter>
      {/* 2. Provider Context di dalamnya */}
      <ToastProvider>
         {/* 3. Routing Logic */}
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;