import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

export async function POST(req: Request) {
  try {
    const { clientEmail, professionalName, date, time, actionUrl } = await req.json();
    if (!clientEmail) {
      return NextResponse.json({ error: 'Sin destinatario' }, { status: 400 });
    }

    const htmlBody = `
      <div style="font-family: sans-serif; background: #001a2c; color: white; padding: 30px; border: 1px solid #00e5ff; border-radius: 10px; max-width: 520px; margin: auto;">
        <h2 style="color: #00e5ff; text-align: center;">FISKAL TECH</h2>
        <div style="background: #003a57; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Estado:</strong> Cita cancelada por el profesional</p>
          ${professionalName ? `<p><strong>Profesional:</strong> ${professionalName}</p>` : ''}
          ${date ? `<p><strong>Fecha:</strong> ${date}</p>` : ''}
          ${time ? `<p><strong>Hora:</strong> ${time}</p>` : ''}
        </div>
        <p>Tu cita fue cancelada por el profesional. Por favor agenda nuevamente.</p>
        <p>Si tu cita ya estaba pagada, no necesitas volver a pagar.</p>
        ${actionUrl ? `
        <div style="text-align: center; margin-top: 16px;">
          <a href="${actionUrl}" style="background: #00ff88; color: #001a2c; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Agendar nuevamente
          </a>
        </div>
        ` : ''}
        <p style="text-align: center; font-size: 10px; color: #aaa; margin-top: 20px;">Soporte: info.fiskal.soporte@gmail.com</p>
      </div>
    `;

    const command = new SendEmailCommand({
      Destination: { ToAddresses: [clientEmail] },
      Message: {
        Body: { Html: { Data: htmlBody } },
        Subject: { Data: "Cita cancelada por el profesional - FISKAL" },
      },
      Source: "info.fiskal.soporte@gmail.com",
    });

    await sesClient.send(command);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SES send-cancel error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
