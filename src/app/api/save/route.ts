import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate data
    if (!data.instagram || !data.phone) {
      return NextResponse.json({ error: 'Instagram and Phone number are required' }, { status: 400 });
    }

    if (!/^\d{10}$/.test(data.phone)) {
      return NextResponse.json({ error: 'Phone number must be exactly 10 digits' }, { status: 400 });
    }

    // Save to data.json for Admin panel view
    try {
      const filePath = path.join(process.cwd(), 'data.json');
      let existingData = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent) {
          existingData = JSON.parse(fileContent);
        }
      }
      existingData.push({
        instagram: data.instagram,
        phone: data.phone,
        chocolate: data.chocolate || 'Not specified',
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    } catch (fsErr) {
      console.warn("Could not write to data.json (likely readonly serverless environment):", fsErr);
    }

    // Send email using FormSubmit.co
    const userEmail = "kumarnk15122002@gmail.com";
    
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${userEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "🎉 WOO-HOO! SHE SAID YES! ❤️ (Proposal Response)",
          _template: "box",
          Instagram_ID: data.instagram,
          Phone_Number: data.phone,
          Favorite_Chocolate: data.chocolate,
          Message: "Congratulation Bhai! Aapki GF ne YES bol diya hai! ❤️🎉 Ab jaldi se date plan karo!",
        }),
      });

      if (!response.ok) {
        console.warn("FormSubmit notice:", await response.text());
      }
    } catch (netErr) {
      console.warn("FormSubmit request failed:", netErr);
    }

    return NextResponse.json({ success: true, message: 'Response saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
