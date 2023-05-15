import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";

const STAGE = process.env.STAGE;

export const handler = async (event: APIGatewayProxyEvent): Promise<{statusCode: number, body: string}> => {
  try {
    console.log(JSON.stringify(event.body));

    const message = JSON.parse(event.body).message;

    if (!message) {
      return {
        statusCode: 400,
        body: "No message.",
      };
    }

    const client = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'}); // Region needed as aws-sdk doesn't seem to read from .aws/config correctly.

    await client.put({
      TableName: `${STAGE}-messages`,
      Item: {
        id: v4(),
        message,
      },
    }).promise();

    const response = {
      message,
      success: true,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: (error as Error).message,
    };
  }
};