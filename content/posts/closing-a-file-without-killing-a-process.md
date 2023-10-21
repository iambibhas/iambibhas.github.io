---
categories: ["devops", "sre", "linux"]
date: 2023-08-21T06:55:01Z
description:  ""
draft: false
slug: "closing-a-file-without-killing-a-process"
tags: ["devops", "sre", "linux"]
title: "Closing an open file without killing a process"

---


In the previous post we figured out how to find the process which is writing an open file. And we also saw that we can kill the process and it'll stop it from writing to that file. But what if we are not supposed to kill the process? But we still need to close the file.

First we need to figure out the file descriptor for that file for that process.

Let's say the file in concern is `/sys/fs/cgroup/unified/user.slice/user-1000.slice/user@1000.service` (I just picked a random open file from lsof). If you run `lsof <filepath>` you'll see something like -

```
pi@raspberrypi:~ $ lsof /sys/fs/cgroup/unified/user.slice/user-1000.slice/user@1000.service
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
systemd 15997   pi    7r   DIR   0,24        0 1225 /sys/fs/cgroup/unified/user.slice/user-1000.slice/user@1000.service
```

Here it tells you under the `FD` column that the file descriptor ID is `7`.

If you are on a linux system, you can also find this if you know the process ID, by running `ls -alh /proc/<pid>/fd`, which should give you this output -

```
pi@raspberrypi:~ $ ls -alh /proc/15997/fd
total 0
dr-x------ 2 pi pi  0 Aug 21 17:38 .
dr-xr-xr-x 9 pi pi  0 Aug 21 17:38 ..
lr-x------ 1 pi pi 64 Aug 21 17:38 0 -> /dev/null
lrwx------ 1 pi pi 64 Aug 21 17:38 1 -> 'socket:[216233]'
lrwx------ 1 pi pi 64 Aug 21 17:38 10 -> 'anon_inode:[eventpoll]'
lr-x------ 1 pi pi 64 Aug 21 17:38 7 -> /sys/fs/cgroup/unified/user.slice/user-1000.slice/user@1000.service
lrwx------ 1 pi pi 64 Aug 21 17:38 8 -> 'anon_inode:[timerfd]'
lrwx------ 1 pi pi 64 Aug 21 17:38 9 -> 'socket:[216245]'

Here you you see that the fd `7` is pointing to that file.

So, now we know that PID is `15997` and FD is `7`. Now we need to close the file without killing the process.

One option available on the web is using `gdb` but I could not test this on the system where I faced this problem because `gdb` was not available and I did not have internet access to install `gdb`. Rather I found another solution that worked. Which is to execute this command -

```
exec 15997<&- 7>&-
```

> please be careful when copy pasting a command like this, it can bork your system temporarily

In the `exec` command, `<&-` is used to close the standard input (file descriptor 0) of the current process. It redirects file descriptor 0 (stdin) to the special file `/dev/null`, which discards any input.

The `<` symbol indicates input redirection, and `-` specifies that the file descriptor should be closed.

So, executing `exec <&-` will close the standard input (stdin) of the current process, making it unavailable for any further use.

`>&-` is used to close the standard output (file descriptor 1) of the current process. It redirects file descriptor 1 (stdout) to the special file `/dev/null`, effectively discarding any output that would have been written.

The `>` symbol indicates output redirection, and `-` specifies that the file descriptor should be closed.

So, executing `exec >&-` will close the standard output (stdout) of the current process, making it unavailable for any further use.

So executing this command with will close the file descriptor 7 within the process with ID 15997.

---

Just for reference, the `gdb` way of doing this I found on the web was -

```
gdb -p $PID
p close($FD)
```

I'll try to test this sometime.

