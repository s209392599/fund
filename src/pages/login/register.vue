<script setup>
function generatePassword() {
  // 定义字符集
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';

  // 从每个字符集中随机选择一个字符
  const char1 = uppercase[Math.floor(Math.random() * uppercase.length)];
  const char2 = lowercase[Math.floor(Math.random() * lowercase.length)];
  const char3 = digits[Math.floor(Math.random() * digits.length)];

  // 合并所有字符集，并从其中随机选择一个字符作为第四个字符
  const allChars = uppercase + lowercase + digits;
  const char4 = allChars[Math.floor(Math.random() * allChars.length)];

  // 将选中的字符打乱顺序
  const chars = [char1, char2, char3, char4];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]]; // 使用解构赋值进行交换
  }

  // 返回生成的密码
  return chars.join('');
}
</script>
