// Most coming from https://github.com/discordeno/discordeno/tree/main/template/bigbot

import { BASE_URL, createRestManager } from "discordeno";
import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config()

const discordToken: string = process.env["DISCORD_TOKEN"] || "";
const restAuth: string = process.env["REST_AUTHORIZATION"] || "testing";
const restPort: number = Number(process.env["REST_PORT"]);
const restUrl: string = `http://127.0.0.1:${restPort}`;

const rest = createRestManager({
  token: discordToken,
  secretKey: restAuth,
  customUrl: restUrl,
  debug: console.log,
});


rest.convertRestError = (errorStack, data): any => {
  if (!data) return { message: errorStack.message };
  return { ...data, message: errorStack.message };
};

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

app.post("/*", async (req, res) => {
  handleRequest(req, res);
});

app.get("/*", async (req, res) => {
  handleRequest(req, res);
});

app.put("/*", async (req, res) => {
  handleRequest(req, res);
});

app.delete("/*", async (req, res) => {
  handleRequest(req, res);
});

app.patch("/*", async (req, res) => {
  handleRequest(req, res);
});

async function handleRequest(req: Request, res: Response) {
  if (!restAuth || restAuth !== req.headers.authorization) {
    return res.status(401).json({ error: "Invalid authorization key." });
  }

  try {
    const result = await rest.runMethod(rest, req.method as any, `${BASE_URL}${req.url}`, req.body);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(204).json();
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
  }
}

app.listen(restPort, () => {
  console.log(`REST listening at ${restUrl}`);
});
