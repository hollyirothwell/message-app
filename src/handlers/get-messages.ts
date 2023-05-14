import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const STAGE = process.env.STAGE;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(JSON.stringify(event.body));

    const client = new AWS.DynamoDB.DocumentClient();

    const { Items: items } = await client.scan({
      TableName: `${STAGE}-messages`,
      ProjectionExpression: "id, message",
    }).promise();

    const messages = (items as {id: string, message: string}[]).map((item) => {
      return {
        message: item.message,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: (error as Error).message,
    };
  }
};