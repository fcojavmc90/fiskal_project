import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION || "us-east-1";
const appointmentTable = process.env.APPOINTMENT_TABLE;
const userProfileTable = process.env.USERPROFILE_TABLE;

if (!appointmentTable || !userProfileTable) {
  console.error("Missing table envs. Set APPOINTMENT_TABLE and USERPROFILE_TABLE.");
  process.exit(1);
}

const client = new DynamoDBClient({ region });
const ddb = DynamoDBDocumentClient.from(client);

const TARGET_STATUSES = new Set(["REQUESTED", "ACCEPTED", "RESCHEDULE_PROPOSED"]);

async function scanAll(tableName) {
  let items = [];
  let ExclusiveStartKey = undefined;
  do {
    const res = await ddb.send(new ScanCommand({ TableName: tableName, ExclusiveStartKey }));
    items = items.concat(res.Items || []);
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

async function main() {
  console.log("Scanning user profiles...");
  const profiles = await scanAll(userProfileTable);
  const emailByOwner = new Map();
  for (const p of profiles) {
    if (p?.owner && p?.email) {
      emailByOwner.set(p.owner, p.email);
    }
  }
  console.log(`Loaded ${emailByOwner.size} owner->email mappings`);

  console.log("Scanning appointments...");
  const appointments = await scanAll(appointmentTable);
  const candidates = appointments.filter(a =>
    TARGET_STATUSES.has(a?.status) &&
    a?.clientOwner &&
    (!a?.clientEmail || a.clientEmail === "")
  );

  console.log(`Found ${candidates.length} appointments to update`);

  let updated = 0;
  for (const appt of candidates) {
    const email = emailByOwner.get(appt.clientOwner);
    if (!email) continue;
    await ddb.send(new UpdateCommand({
      TableName: appointmentTable,
      Key: { id: appt.id },
      UpdateExpression: "SET clientEmail = :email",
      ExpressionAttributeValues: { ":email": email },
    }));
    updated += 1;
  }

  console.log(`Updated ${updated} appointments`);
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
