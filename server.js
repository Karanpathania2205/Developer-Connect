const express = require('express');
const app = express();
app.get('/', (req, res) => res.end('API Running '));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server starte on ${PORT}`))