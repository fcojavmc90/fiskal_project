import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === 'MODIFY') {
            const newData = record.dynamodb.NewImage;
            if (newData.status?.S === 'ACCEPTED') {
                const emailParams = {
                    Destination: { ToAddresses: ["tu-email-verificado@dominio.com"] },
                    Message: {
                        Body: { Html: { Data: "<h1>Cita Confirmada</h1><p>Tu asesoría en FISKAL ha sido aceptada.</p>" } },
                        Subject: { Data: "Confirmación de Cita - FISKAL" }
                    },
                    Source: "no-reply@fiskal.com"
                };
                try { await ses.send(new SendEmailCommand(emailParams)); }
                catch (e) { console.error(e); }
            }
        }
    }
};
