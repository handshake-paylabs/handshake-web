import React from "react";
import TransactionAccordion from "../components/test/TransactionAccordion";
import Head from "next/head";

function page() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      <Head>
        <title>Expandable Accordion List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Expandable Accordion List</h1>
        <TransactionAccordion />
      </main>
    </div>
  );
}

export default page;
