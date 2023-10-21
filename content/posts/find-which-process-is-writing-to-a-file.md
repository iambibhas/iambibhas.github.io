---
categories: ["devops", "sre", "linux", "bash"]
date: 2023-08-21T06:09:53Z
description:  ""
draft: false
slug: "find-which-process-is-writing-to-a-file"
tags: ["devops", "sre", "linux", "bash"]
title: "Find out which process is writing to a file"

---


**_Scenario:_** Imagine you login to a server and you find that the disk is filling up rapidly. Either by using `df -h` or `du -h -d1 /<dir>` or getting errors like `no more disk space left` etc. How do you figure out who is filling up the file?

**_Solution:_** Let's say the file in question is `/var/log/badd.log` and it's rapidly filling up.

First step is to use `lsof` to figure out which process has that file open. To write to a file, any process has to first open that file. So the process will show up in `lsof`, which is a program to "list open files". With any luck your output will show up like this -

```
ubuntu@ip-172-31-32-108:/$ lsof /var/log/badd.log
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF  NODE NAME
baddlog.py 601 ubuntu    3w   REG  259,1     9158 67701 /var/log/badd.log
```

Here we see that the `badd.log` file is open by a process named `baddlog.py` and the pid is `601`.

So if we kill this process, that will stop the process from writing to that file.



