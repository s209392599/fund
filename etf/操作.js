/* mac上操作
第一步：这会创建一个 venv 文件夹，里面包含独立的 Python 环境。
python3 -m venv venv

第二步：激活虚拟环境：
source venv/bin/activate

第三步：在虚拟环境中安装依赖：
pip install -r requirements.txt
使用国内镜像源
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
## 清华源
pip install --retries 5 -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
## 阿里云源
pip install -i http://mirrors.aliyun.com/pypi/simple/ --retries 5 -r requirements.txt

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

# 查看版本号
pip -V
pip --version

# 升级pip
python3 -m pip install --upgrade pip

# 升级到最新
/Users/guokun/github/fund/etf/venv/bin/python3 -m pip install --upgrade pip

# 指定更新源
/Users/guokun/github/fund/etf/venv/bin/python3 -m pip install --upgrade pip --index-url https://pypi.org/simple

# 查看指定的源
pip config list

# 临时修改源
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package

# 永久修改
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 如果您只想更改当前用户使用的源，而不影响系统或其他用户的配置，可以使用以下命令
pip config set user.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 修改源
pip config set global.index-url https://pypi.org/simple
pip config set index-url https://pypi.org/simple

*/
