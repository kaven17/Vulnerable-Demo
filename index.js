const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VULN 1: SQL Injection — string concatenation with user input
app.get('/users', (req, res) => {
    const username = req.query.username;
    const query = "SELECT * FROM users WHERE username = '" + username + "'";
    res.json({ query }); // simulated
});

// VULN 2: Command Injection — exec with user input
app.post('/ping', (req, res) => {
    const host = req.body.host;
    exec(`ping -c 1 ${host}`, (err, stdout) => {
        res.send(stdout);
    });
});

// VULN 3: Path Traversal — reading file with user-controlled path
app.get('/file', (req, res) => {
    const filename = req.query.name;
    const data = fs.readFileSync('/var/data/' + filename);
    res.send(data);
});

// VULN 4: Eval injection
app.post('/calculate', (req, res) => {
    const expr = req.body.expression;
    const result = eval(expr);
    res.json({ result });
});

// VULN 5: Hardcoded secret
const api_key = "sk-abc123supersecretkey9999";
const password = "admin_password_hardcoded";

// VULN 6: XSS — innerHTML with user input (in a template)
app.get('/profile', (req, res) => {
    const name = req.query.name;
    res.send(`<div id="profile"></div>
    <script>
        document.getElementById('profile').innerHTML = "${name}";
    </script>`);
});

// VULN 7: File write with user input
app.post('/upload', (req, res) => {
    const filename = req.body.filename;
    const content = req.body.content;
    fs.writeFileSync('/uploads/' + filename, content);
    res.json({ saved: true });
});

app.listen(3000, () => console.log('Vulnerable app running on port 3000'));