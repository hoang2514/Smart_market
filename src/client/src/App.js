import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import Login from "./Components/Login/Login";
import Layout from "./Components/Layout";

import Dashboard from "./Components/Page/Dashboard/Dashboard";

import UserList from "./Components/Page/Employee/UserList";
import EditEmployee from "./Components/Page/Employee/EditEmployee";
import DetailEmployee from "./Components/Page/Employee/DetailEmployee";
import AddEmployee from "./Components/Page/Employee/AddEmployee";

import ProductManagement from "./Components/Page/ProductManagement/ProductList";
import ProductDetail from "./Components/Page/ProductManagement/ProductDetail";
import AddProduct from "./Components/Page/ProductManagement/AddProduct";

import CreateInvoicet from "./Components/Page/CreateInvoicet/CreateInvoicet";
import InvoicePreview from "./Components/Page/CreateInvoicet/InvoicePreview";
import CashPayment from "./Components/Page/CreateInvoicet/CashPayment";
import BankPayment from "./Components/Page/CreateInvoicet/BankPayment";

import ShowNotification from "./Components/Page/Notification/ShowNotification";
import DetailNotification from "./Components/Page/Notification/DetailNotification";
import CreateNotification from "./Components/Page/Notification/CreateNotification";

import PromotionList from "./Components/Page/Promotion/PromotionList";
import PromotionDetail from "./Components/Page/Promotion/PromotionDetail";
import AddPromotion from "./Components/Page/Promotion/AddPromotion";

import InvoicePage from "./Components/Page/Invoice/InvoicePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout content={<Dashboard />} />} />
        <Route
          path="/employee_management"
          element={<Layout content={<UserList />} />}
        />
        <Route
          path="/employee_management/edit/:id"
          element={<Layout content={<EditEmployee />} />}
        />
        <Route
          path="/employee_management/add"
          element={<Layout content={<AddEmployee />} />}
        />
        <Route
          path="/employee_management/detail/:id"
          element={<Layout content={<DetailEmployee />} />}
        />
        <Route
          path="/create_invoicet"
          element={<Layout content={<CreateInvoicet />} />}
        />
        <Route
          path="/invoice_preview"
          element={<Layout content={<InvoicePreview />} />}
        />
        <Route
          path="/invoice_preview/cash"
          element={<Layout content={<CashPayment />} />}
        />
        <Route
          path="/invoice_preview/bank"
          element={<Layout content={<BankPayment />} />}
        />
        <Route
          path="/product_management"
          element={<Layout content={<ProductManagement />} />}
        />
        <Route
          path="/product_management/add_product"
          element={<Layout content={<AddProduct />} />}
        />
        <Route
          path="/product/:id"
          element={<Layout content={<ProductDetail />} />}
        />
        <Route
          path="/notification"
          element={<Layout content={<ShowNotification />} />}
        />
        <Route
          path="/notification/seen/:id"
          element={<Layout content={<DetailNotification />} />}
        />
        <Route
          path="/notification/create"
          element={<Layout content={<CreateNotification />} />}
        />
        <Route
          path="/promotion"
          element={<Layout content={<PromotionList />} />}
        />
        <Route
          path="/promotion/add"
          element={<Layout content={<AddPromotion />} />}
        />
        <Route
          path="/promotion/:id"
          element={<Layout content={<PromotionDetail />} />}
        />
        <Route
          path="/invoice_history"
          element={<Layout content={<InvoicePage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
