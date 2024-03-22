---
categories: ["devops", "sre", "linux"]
date: 2023-08-23T00:44:18Z
description: ""
draft: false
slug: "curl-can-connect-to-localhost-but-not-127-0-0-1"
tags: ["devops", "sre", "linux"]
title: "cURL can connect to localhost but not 127.0.0.1"
image: "https://demo.stack.jimmycai.com/p/hello-world/cover_hud7e36f7e20e71be184458283bdae4646_55974_1600x0_resize_q75_box.jpg"
---


Recently came across a scenario, where curl was able to connect to `localhost` but not `127.0.0.1`. When I tried `curl 127.0.0.1:80`, it just hung there. While `curl localhost:80` returns the expected output.

My first instinct was to check apache config to see if it was only serving to `localhost` and not the IP address. But that seemed unlikely because `/etc/hosts` had the correct entry.

My next big clue was when I tried `curl -v localhost:80`, this was the output -

```
root@ip-172-31-21-14:/# curl -v localhost:80
*   Trying 127.0.0.1:80...
*   Trying ::1:80...
* Connected to localhost (::1) port 80 (#0)
```

Do you see it?

`localhost` tries to resolve to `127.0.0.1:80` but gives up and then connects to `::1:80`. So essentially connection to IPv4 is failing but IPv6 is succeeding.

I looked around checking what could be wrong. Why connection to IPv4 would fail. I found that if you mentioned `Listed 0.0.0.0:80` or essentially mentioned an IPv4 IP in Apache config, it only connects to IPv4 and not IPv6. But that didn't have any way to block IPv6 connections. And my config was the default `Listen 80` which accepts both v4 and v6.

I couldn't find any other way apache could only accept IPv6 and not IPv4.

With that I looked at the other ways this could be possible. Which is to of course look at firewall, i.e. `iptables`. So I ran `iptables -S`, and lo and behold, there it is -

```
root@ip-172-31-21-14:/# iptables -S
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-A INPUT -p tcp -m tcp --dport 80 -j DROP
```

In the hindsight, I should have checked iptables first. But anyway. So I just executed -

```
iptables -D INPUT -p tcp -m tcp --dport 80 -j DROP
```

Which got rid of the rule. And curl could connect to `127.0.0.1:80` again.

