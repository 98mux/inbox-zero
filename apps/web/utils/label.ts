import "server-only";
import { type gmail_v1 } from "googleapis";
import prisma from "@/utils/prisma";
import {
  emailheroLabelKey,
  RedisLabel,
  myemailheroLabels,
  getUserLabels as getRedisUserLabels,
  emailheroLabelKeys,
  saveemailheroLabel,
  saveUserLabels,
  emailheroLabelsType,
} from "@/utils/redis/label";
import { isDefined } from "@/utils/types";

export const emailheroLabels: Record<emailheroLabelKey, string> = {
  archived: "IZ Archived",
  labeled: "IZ Labeled",
  acted: "IZ Acted",
  cold_email: "Cold Email",
  // drafted: "Response Drafted by IZ",
  // suggested_label: "Label Suggested by IZ",
};

export const INBOX_LABEL_ID = "INBOX";
export const SENT_LABEL_ID = "SENT";

export async function getGmailLabels(gmail: gmail_v1.Gmail) {
  const res = await gmail.users.labels.list({ userId: "me" });
  return res.data.labels;
}

async function createGmailLabel(options: {
  name: string;
  gmail: gmail_v1.Gmail;
}) {
  const { name, gmail } = options;

  try {
    const res = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name,
        color: {
          backgroundColor: "#000000",
          textColor: "#ffffff",
        },
        messageListVisibility: "hide",
        labelListVisibility: "labelShow",
      },
    });

    return res.data;
  } catch (error) {
    console.error("createGmailLabel error", error);
  }
}

export async function getUserLabels(options: {
  email: string;
}): Promise<RedisLabel[] | null> {
  const { email } = options;

  // 1. check if the labels exist in redis
  const redisLabels = await getRedisUserLabels({ email });
  if (redisLabels?.length) return redisLabels;

  // 2. if not check if the labels exist in the db
  const dbLabels = await prisma.label.findMany({
    where: { user: { email }, enabled: true },
  });
  if (dbLabels.length) {
    await saveUserLabels({ email, labels: dbLabels });
    return dbLabels;
  }

  // no labels found
  return [];
}

export async function getUserLabel(options: {
  email: string;
  labelName: string;
  gmail: gmail_v1.Gmail;
}): Promise<
  | { id?: string | null; name?: string | null; description?: string | null }
  | undefined
> {
  const { email, labelName } = options;
  const labels = await getUserLabels({ email });
  const label = labels?.find((l) => l.name === labelName);

  if (label) return label;

  // fallback to gmail if not found
  const gmailLabels = await getGmailLabels(options.gmail);
  const gmailLabel = gmailLabels?.find((l) => l.name === labelName);
  return gmailLabel;
}

export async function getOrCreateemailheroLabels(
  email: string,
  gmail: gmail_v1.Gmail,
): Promise<emailheroLabelsType> {
  // 1. check redis
  const redisLabels = await myemailheroLabels({ email });

  if (
    redisLabels &&
    Object.keys(redisLabels).length === emailheroLabelKeys.length
  )
    return redisLabels;

  // 2. if redis doesn't have them then check gmail
  const gmailLabels = await getGmailLabels(gmail);

  // 3. if gmail has them then save them to redis and return them
  const gmailRedisLabels = (
    await Promise.all(
      emailheroLabelKeys.map(async (key) => {
        let gmailLabel = gmailLabels?.find(
          (l) => l.name === emailheroLabels[key],
        );

        if (!gmailLabel) {
          gmailLabel = await createGmailLabel({
            name: emailheroLabels[key],
            gmail,
          });
        }

        if (gmailLabel?.id && gmailLabel?.name) {
          const label = { id: gmailLabel.id, name: gmailLabel.name };
          await saveemailheroLabel({
            email,
            labelKey: key,
            label,
          });
          return [key, label] as [emailheroLabelKey, RedisLabel];
        }
      }),
    )
  ).filter(isDefined);

  const res = Object.fromEntries(gmailRedisLabels) as emailheroLabelsType;
  return res;
}

export async function getOrCreateemailheroLabel(options: {
  labelKey: emailheroLabelKey;
  email: string;
  gmail: gmail_v1.Gmail;
}): Promise<RedisLabel | undefined> {
  const { gmail, labelKey, email } = options;

  const redisLabel = await myemailheroLabels({ email });
  if (redisLabel) return redisLabel[labelKey];

  const gmailLabels = await getGmailLabels(gmail);

  const labelName = emailheroLabels[labelKey];

  let gmailLabel = gmailLabels?.find((l) => l.name === labelName);

  if (!gmailLabel) {
    gmailLabel = await createGmailLabel({
      name: labelName,
      gmail,
    });
  }

  if (gmailLabel?.id && gmailLabel?.name) {
    const label = { id: gmailLabel.id, name: gmailLabel.name };
    await saveemailheroLabel({
      email,
      labelKey,
      label,
    });

    return label;
  }
}
