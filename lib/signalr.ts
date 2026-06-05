import * as signalR from "@microsoft/signalr";

// Production URL is the default — matches how BASE is handled in api.ts.
// Override with NEXT_PUBLIC_SIGNALR_URL for local dev.
const HUB =
  process.env.NEXT_PUBLIC_SIGNALR_URL ??
  "https://hotelos-notification.azurewebsites.net/hotelHub";

let conn: signalR.HubConnection | null = null;

export function getConnection(): signalR.HubConnection {
  if (!conn) {
    conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB, {
        accessTokenFactory: () =>
          localStorage.getItem("hotelos_client_token") ?? "",
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }
  return conn;
}

export async function connect(): Promise<signalR.HubConnection> {
  const c = getConnection();
  if (c.state === signalR.HubConnectionState.Disconnected) await c.start();
  return c;
}

export async function joinChannel(ch: string) {
  const c = await connect();
  await c.invoke("JoinChannel", ch);
}

export async function disconnect() {
  if (conn?.state !== signalR.HubConnectionState.Disconnected) await conn?.stop();
}
