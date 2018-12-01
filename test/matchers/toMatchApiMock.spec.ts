import axios from "axios";
import adapter from "axios/lib/adapters/http";
import chai from "chai";
import chaiHttp from "chai-http";
import http from "http";
import r2 from "r2";
import "../../src";
import { getOwnSnapshots } from "../utils";

const port = "8123";
const testUrl = `http://localhost:${port}`;
const returnedObject = { hello: "world", foo: "bar" };
const urlQuery = "?abc=def";

const app = new http.Server();

app.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(returnedObject));
  res.end();
});

const getSnapshot = key =>
  getOwnSnapshots(__filename).find(snap => snap.key.includes(key));

describe("toMatchApiMock()", () => {
  beforeAll(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
  afterAll(() => {
    app.close();
  });

  it("Should work with axios module ~1~", async () => {
    const path = "/users/123";
    const res = await axios.get(testUrl + path + urlQuery, { adapter });

    expect(res).toMatchApiMock("axios-success");
    const { data } = getSnapshot("~1~");

    expect(data.mock.body).toEqual(returnedObject);
    expect(data.mock.statusCode).toBe(200);
    expect(data.httpMethod).toBe("get");
    expect(data.mockName).toBe("axios-success");
    expect(data.url).toBe(path);
  });

  it("Should work with chai module ~2~", async () => {
    const path = "/login";
    chai.use(chaiHttp);
    const res = await chai
      .request(testUrl)
      .post(path + urlQuery)
      .send();

    expect(res).toMatchApiMock("chai-success");
    const { data } = getSnapshot("~2~");

    expect(data.mock.body).toEqual(returnedObject);
    expect(data.mock.statusCode).toBe(200);
    expect(data.httpMethod).toBe("post");
    expect(data.mockName).toBe("chai-success");
    expect(data.url).toBe(path);
  });

  it("Should not work with unsupported response object (not of type axios, r2, fetch)", async () => {
    const res = {
      statttus: 200,
      my_url: testUrl
    };
    await expect(res).not.toMatchApiMock("failure-unsupported-response");
  });
});
