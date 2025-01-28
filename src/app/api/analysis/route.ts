import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Replicate the headers from the curl command
    const response = await axios.post(
      "https://hook.us2.make.com/pnnc2o715ykxgtqqete14fhpchl61dnm",
      data,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Referer: "http://localhost:3000/sessions/aef01df0-d3be-4477-93bb-9dbba96a7d14",
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
          "Sec-GPC": "1",
          Connection: "keep-alive",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Priority: "u=0",
        },
      }
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