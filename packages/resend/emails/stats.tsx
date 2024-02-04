import {
  Button,
  Text,
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Link,
  Section,
  Img,
  Heading,
} from "@react-email/components";

export interface StatsUpdateEmailProps {
  baseUrl: string;
  // userEmail: string;
  received: number;
  receivedPercentageDifference: number | null;
  archived: number;
  read: number;
  archiveRate: number;
  readRate: number;
  sent: number;
  sentPercentageDifference: number | null;
  // newSenders: { from: string }[];
}

export default function StatsUpdateEmail(props: StatsUpdateEmailProps) {
  const {
    baseUrl = "https://www.myemailhero.com",
    // userEmail = "hello@example.com",
    received = 112,
    receivedPercentageDifference = 12,
    archived = 89,
    read = 55,
    archiveRate = 82,
    readRate = 22,
    sent = 45,
    sentPercentageDifference = -5,
    // newSenders = [
    //   {
    //     from: "James <james@example.com>",
    //   },
    //   {
    //     from: "Matt <matt@example.com>",
    //   },
    //   {
    //     from: "Paul <paul@example.com>",
    //   },
    // ],
  } = props;

  return (
    <Html>
      <Head />
      <Preview>Your weekly email stats from My Email Hero.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-8">
              <Link href={baseUrl} className="text-[15px]">
                <Img
                  src={`https://www.myemailhero.com/icon.png`}
                  width="40"
                  height="40"
                  alt="My Email Hero"
                  className="mx-auto my-0"
                />
              </Link>
            </Section>

            <Section>
              <Heading className="mx-0 my-[30px] p-0 text-center text-center text-[24px] font-normal text-black">
                Your weekly email stats from My Email Hero
              </Heading>

              <Text style={paragraph}>Here are your weekly email stats:</Text>

              <Text style={paragraph}>
                You received {received} emails.{" "}
                {typeof receivedPercentageDifference === "number" && (
                  <>
                    That's {receivedPercentageDifference >= 0 ? "up" : "down"}{" "}
                    {receivedPercentageDifference.toFixed(1)}% from last week.
                  </>
                )}
              </Text>
              <Text style={paragraph}>
                You archived {archived} emails and read {read} emails.
              </Text>
              <Text style={paragraph}>
                Your archive rate is {archiveRate.toFixed(1)}%. Your read rate
                is {readRate.toFixed(1)}%.
              </Text>
              <Text style={paragraph}>
                You sent {sent} emails this week.{" "}
                {typeof sentPercentageDifference === "number" && (
                  <>
                    That's {sentPercentageDifference >= 0 ? "up" : "down"}{" "}
                    {sentPercentageDifference.toFixed(1)}% from last week.
                  </>
                )}
              </Text>

              {/* <Text style={paragraph}>
                You received emails from {newSenders.length} new senders this
                week:
              </Text> */}
            </Section>

            {/* <ul>
              {newSenders.map((sender) => (
                <li key={sender.from}>
                  <Text style={paragraph}>
                    {sender.from}{" "}
                    <Link
                      href={`https://mail.google.com/mail/u/${userEmail}/#advanced-search/from=${encodeURIComponent(
                        sender.from,
                      )}`}
                    >
                      View
                    </Link>
                  </Text>
                </li>
              ))}
            </ul> */}

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                href={`${baseUrl}/stats`}
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "5px",
                }}
              >
                View Full Stats
              </Button>
            </Section>

            <Section>
              <Text>
                You're receiving this email because you're subscribed to Inbox
                Zero stats updates. You can change this in your{" "}
                <Link
                  href={`${baseUrl}/settings#email-updates`}
                  className="text-[15px]"
                >
                  settings
                </Link>
                .
              </Text>

              <Link
                href={`${baseUrl}/settings#email-updates`}
                className="text-[15px]"
              >
                Unsubscribe from emails like this
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

const paragraph = {
  fontSize: "15px",
  lineHeight: "21px",
  color: "#3c3f44",
};
