import { APIGatewayProxyEvent } from "aws-lambda";
import nock from "nock";
import { handler } from "../../handlers/post-message";

describe("Given I receive a post request for a new message", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  describe("When a message is provided", () => {
    const event = {
      body: JSON.stringify({ message: "Test message" }),
    } as APIGatewayProxyEvent;

    nock("https://dynamodb.eu-west-2.amazonaws.com")
      .post("/")
      .reply(201, () => true);

    it("Then I receive a successful response", async () => {
      expect(await handler(event)).toMatchInlineSnapshot(`
        Object {
          "body": "{\\"message\\":\\"Test message\\",\\"success\\":true}",
          "statusCode": 200,
        }
      `);
    });
  });

  describe("When no message is provided", () => {
    const event = {
      body: JSON.stringify({ message: undefined }),
    } as APIGatewayProxyEvent;

    nock("https://dynamodb.eu-west-2.amazonaws.com")
      .post("/")
      .reply(201, () => true);

    it("Then I receive a 400 response", async () => {
      expect(await handler(event)).toMatchInlineSnapshot(`
        Object {
          "body": "No message.",
          "statusCode": 400,
        }
      `);
    });
  });

  describe("When it fails for any reason", () => {
    it("Then I recieve a 500", async () => {
      expect(await handler({} as APIGatewayProxyEvent)).toMatchInlineSnapshot(`
        Object {
          "body": "Unexpected token u in JSON at position 0",
          "statusCode": 500,
        }
      `);
    });
  });
});
