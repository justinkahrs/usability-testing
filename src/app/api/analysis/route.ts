import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const response = await axios.post(
      "https://hook.us2.make.com/pnnc2o715ykxgtqqete14fhpchl61dnm",
      data
    );

    return NextResponse.json({
      success: true,
      status: response.status,
      received: data,
      responseData: response.data,
    });
  } catch (error) {
    console.error("Error forwarding analysis data:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}
