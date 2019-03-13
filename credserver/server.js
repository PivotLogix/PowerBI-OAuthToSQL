const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    // validate the Authentication header
    console.log(req.headers);

    // send the credentials
    res.send({
        server: 'sql_server_goes_here.database.windows.net',
        database: 'database_goes_here',
        username: 'username_goes_here@sql_server_goes_here',
        password: 'password_goes_here'
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});
