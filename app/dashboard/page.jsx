"use client";

import Header from "../components/header/Header";
import TransactionTypes from "../components/TransactionTypes";

export default function Dashboard() {
  return (
    <div className="main-dashboard">
      <Header />
      <TransactionTypes />
    </div>
  );
}
