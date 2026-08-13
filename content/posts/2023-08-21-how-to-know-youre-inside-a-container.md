---
categories: ["devops", "sre", "container", "linux"]
date: 2023-08-21T09:41:13Z
description:  ""
draft: false
slug: "how-to-know-youre-inside-a-container"
tags: ["devops", "sre", "container", "linux"]
title: "How to know you're inside a container"

---


Scenario: You SSH into an Ubuntu server. How do you know if you just logged in inside a docker container, or just a regular VM?

Turns out there are no straight answers.

> Docker provides virtualization based on _Linux Containers_ ([LXC](https://linuxcontainers.org/)). LXC is a technology to provide operating system virtualization for processes on Linux. This means, that processes can be executed in isolation without starting a real and heavy virtual machine. All processes will be executed on the same Linux kernel, but will still have their own namespaces, users and file system.

> An important feature of such virtualization is that applications inside a virtual environment do not know that they are not running on real hardware. An application will see the same environment, no matter if it is running on real or virtual resources.

So it becomes a bit tricky to know whether you're inside a container or not. There are only a handful of indicators that may or may not exist. Here are couple I came across -

Check the `/proc/1/cgroup` file. For a regular machine, it might look like this -

```
vagrant@ubuntu-13:~$ cat /proc/1/cgroup
11:name=systemd:/
10:hugetlb:/
9:perf_event:/
8:blkio:/
7:freezer:/
6:devices:/
5:memory:/
4:cpuacct:/
3:cpu:/
2:cpuset:/
```

And inside a docker container, it might look like this -

```
vagrant@ubuntu-13:~$ docker run busybox cat /proc/1/cgroup
11:name=systemd:/
10:hugetlb:/
9:perf_event:/
8:blkio:/
7:freezer:/
6:devices:/docker/3601745b3bd54d9780436faa5f0e4f72bb46231663bb99a6bb892764917832c2
5:memory:/
4:cpuacct:/
3:cpu:/docker/3601745b3bd54d9780436faa5f0e4f72bb46231663bb99a6bb892764917832c2
2:cpuset:/
```

So as you can see, some resources like CPU and devices might use container provider name of control group.

But I came across a system where these didn't exist. The `/proc/1/cgroup` file had no such control groups or clues.

Instead they had some clue inside `/proc/1/environ`, which had might contain a string like `container=podman` . But this can also be altered with it seems.

Do you know of more ways of determining this? I'll find it helpful if you let me know on [Twitter](https://twitter.com/bibhasdn)/[Mastodon](https://mastodon.social/@bibhasdn).

