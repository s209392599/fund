const fetch = require('node-fetch');
const fs = require('fs');
const url = 'https://api.longcat.chat/openai/v1/chat/completions';
const headers = {
  'Authorization': 'Bearer ak_1C233H4cK6Cd5ND6UT6zC7h70Rb6J',
  'Content-Type': 'application/json'
};

const data = {
  model: 'LongCat-Flash-Chat',
  messages: [
    { role: 'user', content: 'A500前十大持仓' }
  ],
  // max_tokens: 1000,
  // temperature: 0.7
};

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(json => {
    // console.log(JSON.stringify(json.choices[0].message.content, null, 2));
    fs.writeFileSync('res.md', json.choices[0].message.content, 'utf-8');
  })
  .catch(err => {
    console.error(err);
  });
