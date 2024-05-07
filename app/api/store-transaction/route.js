// pages/api/storeTransaction.js

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    TransactionId,
    senderAddress,
    receiverAddress,
    amount,
    tokenAddress,
    senderSignature,
    receiverSignature,
    status,
  } = await req.json();

  // Connect to MongoDB
  console.log("hello world");
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();

  const collection = db.collection("transactions");
  try {
    await collection.insertOne({
      TransactionId,
      senderAddress,
      receiverAddress,
      amount,
      tokenAddress,
      senderSignature,
      receiverSignature,
      status,
    });
    return NextResponse.json(
      { message: "Transaction stored successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error storing transaction", error },
      { status: 500 }
    );
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}
