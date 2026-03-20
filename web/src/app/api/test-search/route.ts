import { searchUsers } from '@/app/actions/room'; import { NextResponse } from 'next/server'; export async function GET() { const res = await searchUsers(''); return NextResponse.json(res); }
