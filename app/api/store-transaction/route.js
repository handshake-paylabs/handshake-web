// pages/api/storeTransaction.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    senderAddress,
    receiverAddress,
    amount,
    tokenAddress,
    senderSignature,
    receiverSignature,
    status,
    tokenName,
    initiateDate,
    approveDate,
    transectionDate,
  } = await req.json();

  // Connect to MongoDB
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("transactions");

  try {
    // Find the document with the highest TransactionId
    const lastTransaction = await collection.findOne(
      {},
      { sort: { TransactionId: -1 } }
    );

    // Generate a new TransactionId value by incrementing the last one
    const TransactionId = lastTransaction
      ? lastTransaction.TransactionId + 1
      : 1;

    // Insert the new document with the auto-incremented TransactionId
    await collection.insertOne({
      TransactionId,
      senderAddress,
      receiverAddress,
      amount,
      tokenAddress,
      senderSignature,
      receiverSignature,
      status,
      tokenName,
      initiateDate,
      approveDate,
      transectionDate,
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
