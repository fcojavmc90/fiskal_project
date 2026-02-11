import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

export async function POST(req: Request) {
  try {
    const { clientEmail, professionalEmail, meetingLink, date, time } = await req.json();
    const isPayment = meetingLink.includes('square.link');

    const htmlBody = `
      <div style="font-family: sans-serif; background: #001a2c; color: white; padding: 30px; border: 1px solid #00e5ff; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #00e5ff; text-align: center;">FISKAL TECH</h2>
        <div style="background: #003a57; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Evento:</strong> ${time}</p>
          ${!isPayment ? `<p><strong>Fecha:</strong> ${date}</p>` : ''}
        </div>
        <div style="text-align: center;">
          <a href="${meetingLink}" style="background: #00ff88; color: #001a2c; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            ${isPayment ? 'PAGAR AHORA' : 'UNIRSE A REUNIÓN'}
          </a>
        </div>
        <p style="text-align: center; font-size: 10px; color: #aaa; margin-top: 20px;">Soporte: info.fiskal.soporte@gmail.com</p>
      </div>
    `;

    const recipients = [clientEmail, professionalEmail].filter(Boolean);
    if (recipients.length === 0) {
      return NextResponse.json({ error: 'Sin destinatarios' }, { status: 400 });
    }
    const command = new SendEmailCommand({
      Destination: { ToAddresses: recipients as string[] },
      Message: {
        Body: { Html: { Data: htmlBody } },
        Subject: { Data: isPayment ? "Pago Requerido FISKAL" : "Cita Confirmada FISKAL" },
      },
      Source: "info.fiskal.soporte@gmail.com",
    });

    await sesClient.send(command);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SES send-meeting error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
