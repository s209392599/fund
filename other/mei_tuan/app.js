const fetch = require('node-fetch');
const fs = require('fs');
const url = 'https://api.longcat.chat/openai/v1/chat/completions';
const headers = {
  'Authorization': 'Bearer ak_1C233H4cK6Cd5ND6UT6zC7h70Rb6J',
  'Content-Type': 'application/json'
};
// 请给出接下来一周的有关经济或者科技的重大新闻预测，列出15条，每条不超过20字·
const querystr = `
请给出接下来一周国内有关经济或者科技的重大新闻预测或者会议安排
列出30条，以及他们的时间节点 每条不超过30字·
`;

const data = {
  model: 'LongCat-Flash-Chat',
  messages: [
    { role: 'user', content: querystr }
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
