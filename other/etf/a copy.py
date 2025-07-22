import akshare as ak
import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
import time
from datetime import datetime

# 配置邮件发送信息
sender_email = "209392599@qq.com"  # 发件人邮箱
receiver_email = "209392599@qq.com"  # 收件人邮箱
smtp_server = "smtp.qq.com"  # SMTP服务器地址
smtp_port = 465  # SMTP服务器端口
smtp_username = "209392599@qq.com"  # SMTP用户名
smtp_password = "ftylpxdehwowbjbd"  # SMTP密码


def get_etf_spot_data():
    """
    获取 ETF 基金实时行情数据
    """
    etf_spot_data = ak.fund_etf_spot_em()
    return etf_spot_data
def send_email(subject, content):
    """
    发送邮件
    """
    msg = MIMEText(content, "html")
    msg["From"] = formataddr(("ETF行情监控", sender_email))
    msg["To"] = formataddr(("收件人", receiver_email))
    msg["Subject"] = subject
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, [receiver_email], msg.as_string())
        server.quit()
        print("邮件发送成功")
    except Exception as e:
        print(f"邮件发送失败: {str(e)}")
def format_email_content(data, interested_columns=None):
    """
    格式化邮件内容
    """
    if interested_columns is None:
        interested_columns = data.columns.tolist()
    
    # 筛选感兴趣的列
    data = data[interested_columns]
    
    # 转换为 HTML 表格
    html_table = data.to_html(index=False)
    
    # 添加样式
    styled_table = f"<html><body><h3>ETF基金实时行情</h3><div style='font-family: Arial, sans-serif;'>{html_table}</div></body></html>"
    
    return styled_table
def monitor_etf_data(interested_columns=None, interval=60):
    """
    监控 ETF 基金数据并发送邮件
    """
    while True:
        try:
            # 获取当前时间
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"开始获取数据: {now}")
            
            # 获取 ETF 数据
            etf_data = get_etf_spot_data()
            
            if etf_data is not None and not etf_data.empty:
                # 格式化邮件内容
                email_content = format_email_content(etf_data, interested_columns)
                
                # 发送邮件
                subject = f"ETF基金实时行情 - {now}"
                send_email(subject, email_content)
            else:
                print("未获取到任何数据")
            
            # 等待指定时间间隔
            time.sleep(interval)
        except Exception as e:
            print(f"监控过程中发生错误: {str(e)}")
            time.sleep(interval)
if __name__ == "__main__":
    # 定义感兴趣的列（可选）
    interested_columns = ["代码", "名称", "最新价", "涨跌幅", "成交额", "总市值", "数据日期", "更新时间"]
    
    # 设置监控间隔（秒）
    interval = 60000  # 每 60分钟获取一次数据
    
    # 启动监控
    monitor_etf_data(interested_columns, interval)