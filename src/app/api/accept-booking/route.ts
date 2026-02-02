import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { appointmentId, clientEmail, clientName, lang } = await req.json();
    
    // 1. Generar Link de Videollamada Único
    const meetingLink = `https://meet.jit.si/fiskal-${appointmentId}-${Math.random().toString(36).substring(7)}`;
    
    // 2. Definir Contenido Bilingüe
    const subject = lang === 'es' ? 'Cita Confirmada - FISKAL' : 'Appointment Confirmed - FISKAL';
    const message = lang === 'es' 
      ? `Hola ${clientName}, tu experto ha aceptado la cita. Únete aquí: ${meetingLink}`
      : `Hi ${clientName}, your expert has accepted the appointment. Join here: ${meetingLink}`;

    // 3. Simular Envío de Correo (Aquí conectarías con tu AWS SES o Resend)
    console.log(`📧 Enviando correo a ${clientEmail}: ${subject}`);

    // 4. Actualizar Base de Datos (Simulado)
    // db.appointments.update({ id: appointmentId, status: 'CONFIRMED', meetingLink });

    return NextResponse.json({ 
      success: true, 
      meetingLink,
      message: lang === 'es' ? 'Cita aceptada y correo enviado.' : 'Appointment accepted and email sent.' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
