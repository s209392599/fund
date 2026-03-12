import OpenAI from "openai";
import fs from "fs";

process.loadEnvFile();

const openai = new OpenAI(
  {
    // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  }
);

async function main() {
  const completion = await openai.chat.completions.create({
    // 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
    model: "qwen-plus",  //此处以qwen-plus为例，可按需更换模型名称。
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "量化基金推荐,C类的,波动率比较小,夏普比率大一些,每个月能稳定向上的，前十持仓量不是太大的,请多列举一些，最好按照推荐值排序" }
    ],
  });
  // 写入md文档
  fs.writeFileSync("output.md", completion.choices[0].message.content);
  // console.log(JSON.stringify(completion))
  console.log(`输出已保存到 output.md 文件`)
}

main();
