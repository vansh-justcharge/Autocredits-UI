import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import InventoryPage from './pages/InventoryPage';
import LoansPage from './pages/LoansPage';
import InsurancePage from './pages/InsurancePage';
import InsuranceModel from './pages/InsuranceModel'; 
import InsuranceCase from './pages/Insurance_case';
import UserManagementPage from './pages/UserManagementPage';
import SalesPage from './pages/SalesPage';
import PaymentTrack from './pages/PaymentTrack';
import LoanCase from './pages/LoanCase';
import { FormProvider } from './contexts/FormContext';
// import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/leads"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LeadsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InventoryPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/loans/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LoansPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/loan-case/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LoanCase></LoanCase>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/insurance"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FormProvider>
                    <InsurancePage />
                  </FormProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          {/* InsuranceModel Route: For View/Edit */}
          <Route
            path="/dashboard/insurance/model"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InsuranceModel />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/insurance-case/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FormProvider>
                     <InsuranceCase />
                  </FormProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user-management"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserManagementPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/sales/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SalesPage></SalesPage>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payment/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PaymentTrack></PaymentTrack>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          /> */}

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
