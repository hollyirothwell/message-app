import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { v4 } from "uuid";

const STAGE = process.env.STAGE;

export const handler = async (event: APIGatewayProxyEvent): Promise<{statusCode: number, body: string}> => {
  try {
    console.log(JSON.stringify(event.body));

    const message = JSON.parse(event.body).message;

    const client = new AWS.DynamoDB.DocumentClient();

    await client.put({
      TableName: `${STAGE}-messages`,
      Item: {
        id: v4(),
        message,
      },
    }).promise();

    return {
      statusCode: 200,
      body: "Successful POST",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: (error as Error).message,
    };
  }
};