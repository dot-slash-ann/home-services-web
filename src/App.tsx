/** @jsxImportSource preact */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { h } from 'preact';
import CategoriesPage from './pages/categories';
import Home from './pages/home';
import TagsPage from './pages/tags';
import TransactionsPage from './pages/transactions';
import UsersPage from './pages/users';
import VendorsPage from './pages/vendors';
import Navbar from './components/Navbar';
import NotFound from './pages/errors/not-found';
import BudgetsPage from './pages/budgets';
import BudgetDetailsPage from './pages/budget-details';

const App = (): h.JSX.Element => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/budgets/:id" element={<BudgetDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        {/* Cast to any to bypass type incompatibility */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
