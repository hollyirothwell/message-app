import { APIGatewayProxyEvent } from "aws-lambda";
import { marshall } from "@aws-sdk/util-dynamodb";
import nock from "nock";
import { handler } from "../../handlers/get-messages";
import { v4 } from "uuid";

const event = {} as APIGatewayProxyEvent;

describe("Given I receive a get request for all messages", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("When there are messages in the database", () => {
    const items = {
      Items: [
        marshall({
          id: v4(),
          message: "Test message",
        }),
      ],
    };

    nock("https://dynamodb.eu-west-2.amazonaws.com")
      .post("/")
      .reply(201, () => items);

    it("Then I receive all messages", async () => {
      expect(await handler(event)).toMatchInlineSnapshot(`
        Object {
          "body": "[{\\"message\\":\\"Test message\\"}]",
          "statusCode": 200,
        }
      `);
    });
  });
  describe("When there are no messages in the database", () => {
    const items = {
      Items: [marshall({})],
    };

    nock("https://dynamodb.eu-west-2.amazonaws.com")
      .post("/")
      .reply(201, () => items);

    it("Then I receive no messages", async () => {
      expect(await handler(event)).toMatchInlineSnapshot(`
        Object {
          "body": "[{}]",
          "statusCode": 200,
        }
      `);
    });
  });

  describe("When it fails for any reason", () => {
    nock("https://dynamodb.eu-west-2.amazonaws.com")
      .post("/")
      .reply(201, () => null);

    it("Then I recieve a 500", async () => {
      expect(await handler(event)).toMatchInlineSnapshot(`
        Object {
          "body": "Cannot read property 'map' of undefined",
          "statusCode": 500,
        }
      `);
    });
  });
});
