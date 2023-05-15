# Messaging App

This messaging app is a small example REST API for recording and retrieving messages.

## Contents

- [Message App](#messaging-app)
  - [Contents](#contents)
  - [Stack](#stack)

## Stack

The whole stack is defined in the serverless.yml. This includes:
- APIGateway to define the API endpoints.
- DynamoDB for storing messages for the app.
- Lambda for the event handlers.

## API overview

- POST v1/post-message - Records a new message given a message string.
```
{
  "message": "Test message."
}
```
- GET v1/get-messages - Gets all messages.

## How to

Install the prerequisites:
- yarn
- serverless
- aws cli

Deploy the service:
1. `yarn`
2. `aws configure`
3. `yarn deploy`

Test
- `yarn test`

## Next steps

- Add validation in middleware (JSON schema to TS).
- Add logging library with more helpful logs.
- Return friendly 500 message, error log actual details.
- Swagger docs.
- Etc.