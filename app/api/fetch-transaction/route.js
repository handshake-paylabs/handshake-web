// pages/api/queryTransactions.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const type = searchParams.get("type");

  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("transactions");

  try {
    const query = {};
    if (type === "sender") {
      query.senderAddress = address;
    } else if (type === "receiver") {
      query.receiverAddress = address;
    } else if (type === "all") {
      query.$or = [{ senderAddress: address }, { receiverAddress: address }];
    } else {
      return NextResponse.json(
        { message: "Invalid type. Must be 'sender', 'receiver', or 'all'" },
        { status: 400 }
      );
    }

    const transactions = await collection.find(query).toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching transactions", error },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
