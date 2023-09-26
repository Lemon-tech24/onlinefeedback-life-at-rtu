import { NextResponse } from "next/server";
import { createPool } from "@vercel/postgres";
const db = createPool();
const res = NextResponse;
