import { NextResponse } from 'next/server';

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

    // Send email using FormSubmit.co
    const userEmail = "kumarnk15122002@gmail.com";
    
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

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Email sent successfully!' });
    } else {
      console.error("FormSubmit error:", await response.text());
      return NextResponse.json({ error: 'Failed to send email to you. Please try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

