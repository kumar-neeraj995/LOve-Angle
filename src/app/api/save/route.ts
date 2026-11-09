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

    const finalChocolate = data.chocolate || 'Not specified';
    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // ── 1. Save to data.json (works locally / on Render, skipped on Vercel serverless) ──
    try {
      const filePath = path.join(process.cwd(), 'data.json');
      let existingData: any[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent) existingData = JSON.parse(fileContent);
      }
      existingData.push({
        instagram: data.instagram,
        phone: data.phone,
        chocolate: finalChocolate,
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    } catch (fsErr) {
      console.warn('Could not write to data.json (serverless env):', fsErr);
    }

    // ── 2. Instant push notification via ntfy.sh (free, no account needed) ───────────────
    const ntfyTopic = 'love-angel-neeraj-995'; // unique private topic
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: {
          'Title': '🎉 She Said YES! ❤️',
          'Priority': 'urgent',
          'Tags': 'tada,heart,confetti_ball',
          'Content-Type': 'text/plain',
        },
        body: `Congratulations bhai! Aapki GF ne YES bol diya! 🥳\n\n📸 Instagram: ${data.instagram}\n📱 Phone: ${data.phone}\n🍫 Chocolate: ${finalChocolate}\n🕐 Time: ${submittedAt} IST`,
      });
      console.log('✅ ntfy.sh push notification sent!');
    } catch (ntfyErr) {
      console.warn('⚠️ ntfy.sh notification failed:', ntfyErr);
    }

    // ── 3. Email via Gmail SMTP (Nodemailer) — works when env vars are set ──────────────
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASS;

    if (gmailUser && gmailPass) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass },
        });
        await transporter.sendMail({
          from: `"Love Angel 💌" <${gmailUser}>`,
          to: gmailUser,
          subject: '🎉 WOO-HOO! SHE SAID YES! ❤️ — New Proposal Response!',
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff0f5;border-radius:16px;padding:32px;border:2px solid #ffb3c6;"><h1 style="color:#e63d7e;text-align:center;">🎉 She Said YES! ❤️</h1><p style="text-align:center;color:#c2185b;">Congratulations bhai! 🥳</p><table style="width:100%;border-collapse:collapse;"><tr style="background:#ffe0eb;"><td style="padding:12px;font-weight:bold;color:#880e4f;">📸 Instagram</td><td style="padding:12px;">${data.instagram}</td></tr><tr><td style="padding:12px;font-weight:bold;color:#880e4f;">📱 Phone</td><td style="padding:12px;">${data.phone}</td></tr><tr style="background:#ffe0eb;"><td style="padding:12px;font-weight:bold;color:#880e4f;">🍫 Chocolate</td><td style="padding:12px;">${finalChocolate}</td></tr><tr><td style="padding:12px;font-weight:bold;color:#880e4f;">🕐 Time</td><td style="padding:12px;">${submittedAt} IST</td></tr></table><p style="text-align:center;color:#c2185b;margin-top:24px;">Ab jaldi se date plan karo! 💑✨</p></div>`,
        });
        console.log('✅ Email sent via Gmail SMTP');
      } catch (mailErr) {
        console.error('❌ Gmail SMTP error:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Response saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
