import * as signalR from "@microsoft/signalr";

const HUB = process.env.NEXT_PUBLIC_SIGNALR_URL ?? "http://localhost:5007/hotelHub";
let conn: signalR.HubConnection | null = null;

export function getConnection(): signalR.HubConnection {
  if (!conn) {
    conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB, {
        accessTokenFactory: () => localStorage.getItem("hotelos_client_token") ?? "",
      })
      .withAutomaticReconnect()
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
