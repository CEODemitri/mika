import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const options = {
    method: "GET",
    url: "https://moon-phase.p.rapidapi.com/advanced",
    params: {
      lat: "51.4768",
      lon: "-0.0004",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "moon-phase.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch moon phase data" },
      { status: 500 }
    );
  }
}
