import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Simple password protection
    if (password !== 'iloveyou') {
      return NextResponse.json({ error: 'Unauthorized: Incorrect password' }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), 'data.json');
    
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      if (fileContent) {
        existingData = JSON.parse(fileContent);
      }
    }

    return NextResponse.json({ success: true, data: existingData });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
