---
categories: ["client", "dabr", "technical", "tweak", "twitter", ]
date: 2010-10-30T13:00:00Z
description:  ""
draft: false
slug: "auto-refresh-your-dabr-client"
tags: ["client", "dabr", "technical", "tweak", "twitter", ]
title: "Auto Refresh your Dabr client"

---


If you don't know yet, Dabr is an open source Twitter Mobile Web client which can be used from their own site [dabr.co.uk](http://dabr.co.uk) or you can download the code from its [Google Code page](http://code.google.com/p/dabr/) and upload it to your server and use it like your own client.. :) But Don't forget to read the documentation while installing. :) Now, about auto refreshing, First I thought about using AJAX, but that seemed a lot of work. So, I thought of an alternative. Open the **theme.php** file which is inside the **common** directory. Scroll to line no **137**. You should see something like this ->

```
<head>
<title>',$_SERVER['SERVER_NAME'],' - ',$title,'</title>
<base href="',BASE_URL,'" /> '.theme('css').'
</head>
```

Just add this line just before the **</html>** tag,

```
<meta http-equiv="refresh" content="30">
```

Like -

```
<head><title>',$_SERVER['SERVER_NAME'],' - ',$title,'</title><base href="',BASE_URL,'" /> '.theme('css').' <meta http-equiv="refresh" content="30"> </head>
```

And save it and upload it to your server. You can change the value 30 as u wish, it'll be counted as seconds and the page will refresh with that interval. :D For reference,

> _"META tags with an HTTP-EQUIV attribute are equivalent to HTTP headers. Typically, they control the action of browsers, and may be used to refine the information provided by the actual headers."_

So, I'm just modifying the sent header data and saying the browser that, refresh the page with a 30 seconds interval. :D But be careful. Don't give the value too less, or you might run out of API calls. :)

