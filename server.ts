import express, { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
const axios = require("axios");
const cors = require("cors");
// import * as redis from "redis";
const redis = require("redis");
const port = Number(process.env.PORT) ?? 8080;

const client = redis.createClient({ url: "redis://redis:6379" });
// const client = redis.createClient(6379, "redis");
// const client = redis.createClient();

// const client = createClient({ url: 'redis://redis:6379' }); //in Prod we can enter url in ()
// client.on("error", (err:Error) => console.log("Redis Client Error", err));

const DEFAULT_EXPIRATION = 36000000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// client.get("photos");

async function start() {
  await client.connect();
  app.get("/photos", async (req, res) => {
    // await client.connect();
    const albumId = req.query.albumId; //query means http:/fvvfvsf/fssv/?a=5 <---query params
    const photos = await getOrSetCache(
      `photos?albumId=${albumId}`,
      async () => {
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/photos",
          { params: { albumId } } //query param, to limit res number
        );
        return data;
      }
    );

    res.json(photos);
  });

  app.get("/photos/:id", async (req: Request, res: Response) => {
    //path params :id
    const photo = await getOrSetCache(`photos:${req.params.id}`, async () => {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
      );
      return data;
    });

    res.json(photo);
  });

  function getOrSetCache(key: string, cb: CallableFunction) {
    return new Promise(async (resolve, reject) => {
      // client.get(key as String, async (error:Error, data:string) => {
      //   if (error) return reject(error);
      //   if (data != null) return resolve(JSON.parse(data));
      //   //if data not available
      //   const freshData:string = await cb();
      //   client.setEx(key as String, DEFAULT_EXPIRATION, JSON.stringify(freshData));
      //   resolve(freshData);
      // });

      client
        .get(key)
        .then(async (data: string) => {
          if (data != null) return resolve(JSON.parse(data));
          //if data not available
          const freshData: string = await cb();
          client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
          resolve(freshData);
        })
        .catch((e: Error) => {
          return reject(e);
        });
    });
  }
}

start();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${port}`);
});
