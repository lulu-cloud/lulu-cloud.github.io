---
title: >-
  Tor网络构建(1)-obfs4网桥配置
tags:
  - 实验
  - 科研
  - Tor
createTime: 2023-12-05 15:45:14
comments: true
readingTime: true
---

# 实验目标
>  搭配tor的obfs4网桥，本地tor浏览器使用该网桥访问tor网络

# 实验需求

1.  本地windows客户端需要下载tor浏览器
2. 准备一台海外vps，能有公网ip进行访问

# 实验步骤

## 1 网桥vps配置

### 安装tor与obfs4

~~~
apt-get install tor -y
apt-get install obfs4proxy -y
~~~

### 安装nyx监控工具

~~~
apt-get install nyx -y
~~~

### 修改tor配置文件

1. 使用该命令修改配置文件

~~~
vi /etc/tor/torrc
~~~

2. 按照官网给出的示例demo，修改

~~~
BridgeRelay 1
ORPort port1

ServerTransportPlugin obfs4 exec /usr/bin/obfs4proxy


ServerTransportListenAddr obfs4 0.0.0.0:port2


ExtORPort auto

PublishServerDescriptor 0

Nickname yourName
~~~

> port1与port2都是自定义的，同时修改vps的防火墙将该两个端口打开

### 重启tor，记录机器指纹与证书

使用命令重启tor，然后使用nyx工具进行监控

~~~
systemctl restart tor
~~~



~~~
nyx
~~~

![image-20231205151255192](https://raw.githubusercontent.com/lulu-cloud/lili_images/main/image/202312051527105.png)

> 1. 获取指纹
>
>    ~~~
>    cat /var/lib/tor/fingerprint
>    ~~~
>
>    该字符串其实就是nyx界面的右上角的fingerprint
>
>    ![image-20231206092956574](https://raw.githubusercontent.com/lulu-cloud/lili_images/main/image/202411011659637.png)
>
> 2. 获取证书
>
>    ~~~
>    cat /var/lib/tor/pt_state/obfs4_bridgeline.txt
>    ~~~
>
>    ![image-20231205152826903](https://raw.githubusercontent.com/lulu-cloud/lili_images/main/image/202312051528606.png)
>
>    `Bridge obfs4 <IP ADDRESS>:<PORT> <FINGERPRINT> cert=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx iat-mode=0`

## 2 本地客户端配置

1. 手动选择网桥

   ![image-20231205152036696](https://raw.githubusercontent.com/lulu-cloud/lili_images/main/image/202312051528646.png)

2. 填入网桥

   根据第一大部分得到的信息，按照如下格式填充网桥字符串

   `obfs4 你的vps ip地址:port2 指纹 cert=证书 iat-mode=0`

3. 开始上网

  > 在没有科学上网的环境下尝试访问youtube，点左上角的线路可以看到中继转发情况，通过配置的网桥，然后经历一个普通中继与出口中继转发到目的网络。
  >
  > ![image-20231205152419619](https://raw.githubusercontent.com/lulu-cloud/lili_images/main/image/202312051528923.png)

> 在浏览器同步点击的时候，nyx查看到vps的流量是有突发的上下行流量的

> ![image-20231205152637974](https://raw.githubusercontent.com/lulu-cloud/lili_images/main/image/202312051528493.png)