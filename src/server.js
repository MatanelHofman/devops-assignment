const express = require('express');
const app = express();


app.get('/status', (req, res) => {
    res.json({
        status: "ok",
        service: "devops-assigngment",
        timestamp: new Date().toISOString()
    });
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000/status");
});
