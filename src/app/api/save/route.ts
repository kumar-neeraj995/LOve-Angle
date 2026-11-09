import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

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

    // ── 2. Send email via Gmail SMTP (Nodemailer) ──────────────────────────────────────
    const gmailUser = process.env.GMAIL_USER;      // e.g. kumarnk15122002@gmail.com
    const gmailPass = process.env.GMAIL_APP_PASS;  // 16-char App Password (no spaces)

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"Love Angel 💌" <${gmailUser}>`,
          to: gmailUser,   // send to yourself
          subject: '🎉 WOO-HOO! SHE SAID YES! ❤️ — New Proposal Response!',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff0f5;border-radius:16px;padding:32px;border:2px solid #ffb3c6;">
              <h1 style="color:#e63d7e;text-align:center;font-size:2rem;margin-bottom:8px;">🎉 She Said YES! ❤️</h1>
              <p style="text-align:center;color:#c2185b;font-size:1.1rem;margin-bottom:24px;">Congratulations bhai! Aapki GF ne proposal accept kar liya! 🥳</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr style="background:#ffe0eb;">
                  <td style="padding:12px 16px;font-weight:bold;color:#880e4f;border-radius:8px 0 0 0;">📸 Instagram</td>
                  <td style="padding:12px 16px;color:#333;border-radius:0 8px 0 0;">${data.instagram}</td>
                </tr>
                <tr style="background:#fff0f5;">
                  <td style="padding:12px 16px;font-weight:bold;color:#880e4f;">📱 Phone Number</td>
                  <td style="padding:12px 16px;color:#333;">${data.phone}</td>
                </tr>
                <tr style="background:#ffe0eb;">
                  <td style="padding:12px 16px;font-weight:bold;color:#880e4f;">🍫 Fav Chocolate</td>
                  <td style="padding:12px 16px;color:#333;">${finalChocolate}</td>
                </tr>
                <tr style="background:#fff0f5;">
                  <td style="padding:12px 16px;font-weight:bold;color:#880e4f;">🕐 Submitted At</td>
                  <td style="padding:12px 16px;color:#333;">${submittedAt} IST</td>
                </tr>
              </table>
              <p style="text-align:center;color:#c2185b;margin-top:24px;font-size:0.95rem;">Ab jaldi se date plan karo! 💑✨</p>
              <p style="text-align:center;font-size:0.75rem;color:#aaa;margin-top:16px;">Sent by Love Angel App 💌</p>
            </div>
          `,
        });

        console.log('✅ Email sent successfully via Gmail SMTP');
      } catch (mailErr) {
        console.error('❌ Gmail SMTP error:', mailErr);
        // Don't fail the request — data is still saved
      }
    } else {
      console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASS env vars not set — email skipped');
    }

    return NextResponse.json({ success: true, message: 'Response saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
