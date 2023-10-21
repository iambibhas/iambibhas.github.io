---
categories: ["Import 2022-11-22 15:42"]
date: 2010-08-26T13:00:00Z
description:  ""
draft: false
slug: "url-shortening-at-your-finger-tip"
tags: ["Import 2022-11-22 15:42"]
title: "URL Shortening at your finger tip. :)"

---


I dunno about you guys, but I was getting weary of all the url shorteners that has grown like weeds around us.. Hence thought of using something that I could customize and use as I like. Hence did a Google search and found Yourls.

The case is simple, this service gives your site a capability to shorten urls. All you need is a Domain. Let it be a Top-Level Domain or a free one.. Now *this* is what I call usability. :)

As you already know, I maintain a TLD. So I thought of a URL shortener like <strong>bibhas.in/l/</strong> ..
So, I downloaded Yourls. According to its guide, installed it and just ran it. And Voila! It works flawlessly. :)

Now, coming to the main points, what are the advantages of Yourls over <a title="Bit.ly Pro" href="https://bitly.com/pro/" target="_blank">Bit.ly Pro(another similar service)</a>?
<ol>
	<li>Yours is totally customizable. Its open source. So you can modify it anyway you want. :)</li>
	<li>All the link data are saved in your own database. Whereas Bit.ly stores then in its own database.</li>
	<li>Yourls has a cool API that's fairly simple to use.</li>
	<li>Yourls provides two bookmarklets to share any link you want to share on the go. :)</li>
</ol>
Yourls gives you a local API. Means all the functions resides on your server. You're given an unique signature which you can use instead of username and password while making an API request.

And you call goes like this -
<pre class="brush:plain">http://bibhas.in/l/yourls-api.php?signature=f271546ece&amp;action=shorturl&amp;url=http://bibhas.in&amp;format=xml</pre>
as simple as that. :)

More details on the API can be found here - <a href="http://yourls.org/#API" target="_blank">http://yourls.org/#API</a>

Here is a screenshot of the default Yourls Link Dashboard -

<pre>// Image no longer available</pre>

Now, If you're interested in using it, Download Yourls from here - <a title="Download Yourls" href="http://yourls.org/download" target="_blank">http://yourls.org/download</a>



