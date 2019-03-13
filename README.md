## Goal

There was a request from a customer to build a Custom Connector for Power BI that:

1. Authenticated against a custom OAuth2 endpoint.
2. Used that successful authentication to fetch credentials for an Azure SQL Database.
3. Connected the user to the Azure SQL Database without any additional prompts.

## Warnings

Custom Connectors for Power BI only work with Power BI Desktop, not the web interface.

While I built this sample to demonstrate how this could be accomplished, I don't like this approach. The credentials to the database are sent back to the desktop client and while they could be encrypted in transit using SSL, and there is no permanent storage of the credentials on the client, it remains true that the client received clear-text credentials to access the database directly. For instance, the client could download this sample and build their own connector that saved those credentials and then bypassed the OAuth connection.

## Implementation

The "OAuthToSQL.pq" file is a full sample.

1. You will need to modify the sample to work with your OAuth2 provider.

2. This block of code passes the access_token obtained from the authentication to another service that will return the credentials for Azure SQL DB after validating the token.

```
sqlcreds = Web.Contents("http://10.211.55.2:3000", [
    Headers = [
        #"Authentication" = "bearer " & Credential[access_token],
        #"Accept" = "application/json"
    ]
]),
```

I have a sample Node.js application under "credserver" that shows how to send the response.

3. Decode the JSON response into the appropriate fields.

```
sqlcredsjson = Json.Document(sqlcreds),
server = sqlcredsjson[server],
database = sqlcredsjson[database],
username = sqlcredsjson[username],
password = sqlcredsjson[password],
```

4. Use the credentials.

```
 ConnectionString =
    [
        Driver = "SQL Server Native Client 11.0",
        Server = server,
        Database = database
    ],

// format the credentials as needed for ODBC
CredentialConnectionString = [ UID = username, PWD = password ],
```
