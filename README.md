
  # Sistema de Atendimento Clínico

  This is a code bundle for Sistema de Atendimento Clínico. The original project is available at https://www.figma.com/design/E7BFs0ccnlviaTNQMlomcx/Sistema-de-Atendimento-Cl%C3%ADnico.

  ## Running the code

Run `yarn install` to install the dependencies.

Run `yarn dev` to start the development server.

## Environment variables

Create a `.env` file at the project root with the MongoDB connection string:

```
MONGODB_URI=mongodb+srv://gabdrawed14:J1LfYpHwU1AiXb46@cluster.l2uj7a8.mongodb.net/?appName=cluster
```

Make sure this environment variable is available to whichever runtime executes `src/lambda/mongoClient.ts`.
