import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextResponse } from 'next/server';

const sesClient = new SESClient({ region: "us-east-1" });

export async function POST(req: Request) {
  try {
    const { userEmail, caseId, milestone, lang } = await req.json();
    
    // Configuración de contenido según el Hito y el Idioma Global
    const isFinal = milestone === 'HITO_2';
    
    const subject = lang === 'es' 
      ? (isFinal ? `Liquidación Final Exitosa - Caso ${caseId}` : 'Cita Confirmada - FISKAL')
      : (isFinal ? `Final Settlement Success - Case ${caseId}` : 'Appointment Confirmed - FISKAL');

    const htmlBody = lang === 'es' ? `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #00e5ff;">
        <h2 style="color: #00e5ff;">FISKAL: Pago Completado</h2>
        <p>Tu pago para el <strong>${milestone}</strong> del caso ${caseId} ha sido procesado con éxito.</p>
        ${isFinal ? '<p>Ya puedes descargar tus documentos finales desde tu panel.</p>' : '<p>Tu experto te contactará en breve.</p>'}
        <div style="margin-top: 30px; font-size: 12px; color: #777;">Este es un correo automático de FISKAL Tech.</div>
      </div>
    ` : `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #00e5ff;">
        <h2 style="color: #00e5ff;">FISKAL: Payment Completed</h2>
        <p>Your payment for <strong>${milestone}</strong> of case ${caseId} was processed successfully.</p>
        ${isFinal ? '<p>You can now download your final documents from your dashboard.</p>' : '<p>Your expert will contact you shortly.</p>'}
        <div style="margin-top: 30px; font-size: 12px; color: #777;">This is an automated email from FISKAL Tech.</div>
      </div>
    `;

    const emailCommand = new SendEmailCommand({
      Destination: { ToAddresses: [userEmail], BccAddresses: ['admin@fiskal.com'] },
      Message: {
        Body: { Html: { Data: htmlBody } },
        Subject: { Data: subject },
      },
      Source: "FISKAL - Soporte Técnico <info.fiskal.soporte@gmail.com>", 
    });

    await sesClient.send(emailCommand);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
