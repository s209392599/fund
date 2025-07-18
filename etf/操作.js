/* mac上操作
第一步：这会创建一个 venv 文件夹，里面包含独立的 Python 环境。
python3 -m venv venv

第二步：激活虚拟环境：
source venv/bin/activate

第三步：在虚拟环境中安装依赖：
pip install -r requirements.txt
使用国内镜像源
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt


第四步：退出虚拟环境（完成后）
deactivate
*/

/*永久修改 pip 源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip install -r requirements.txt

常用国内镜像源:
清华大学：https://pypi.tuna.tsinghua.edu.cn/simple
阿里云：https://mirrors.aliyun.com/pypi/simple/
豆瓣：https://pypi.douban.com/simple/

多次尝试：有时候只是临时网络问题，可以多次尝试：
pip install --retries 5 -r requirements.txt

升级pip:
python3 -m pip install --upgrade pip
*/
