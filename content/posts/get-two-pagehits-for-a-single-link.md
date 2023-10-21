---
categories: ["Import 2022-11-22 15:42"]
date: 2010-08-21T13:00:00Z
description:  ""
draft: false
slug: "get-two-pagehits-for-a-single-link"
tags: ["Import 2022-11-22 15:42"]
title: "Get two Page hits for a single link. ;)"

---


Well, this was an idea from <a title="Kuntal&#039;s Extreme Tech Arena" href="http://www.kuntalgupta.com/" target="_blank">Kuntal Gupta</a>. He asked me to make a redirecting script, so that if you pass any url to that page, it'll redirect to that link surely, but will also give your site a hit.

Then i just thought, why not use JS to turn all the hyperlinks to such redirecting links. That way, whenever someone clicks a link on your site, you get an extra hit, irrespective of  if the link is outgoing or in your site. :D

<!--more-->This is how it works -

Make a php file, name it redirect.php and save it in your root so that the location is, say, http://<strong>&lt;your_url&gt;</strong>/redirect.php and then edit the file and paste this code -
<pre class="brush:php">&lt;?php
   $url=$_REQUEST['url'];
   header("location: $url");
?&gt;</pre>
Save it.

Now add this Javascript snippet in your site's header, inside the &lt;head&gt;&lt;/head&gt; block -
<pre class="brush:js">&lt;script type="text/javascript" language="javascript"&gt;
function reDirectMe() {
  var link = document.getElementsByTagName("a");
    for (var i=0;i&lt;link.length;i++)
        {
            link[i].href = "http://&lt;your_url&gt;/redirect.php?url="+link[i].href;
        }
}
window.onload=reDirectMe;
&lt;/script&gt;</pre>
Now obviously you'd like to change the <strong>&lt;your_url&gt;</strong> part to your domain.

And thats it. Now reload your site, and you'll see that all your hyperlinks have changed and now passes through the redirect.php file and gives you an extra hit every time you click a link.

Enjoy. :D



