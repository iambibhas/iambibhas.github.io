---
date: 2012-08-26T07:59:00Z

type: post
status: publish
tags:
- Technical
meta:
  _oembed_9b9d9ebeae26bc6c12a740b720a4bf01: <blockquote class="twitter-tweet" width="500"><p>Where Have The Users Gone? <a href="http://t.co/acgTzWKR" title="http://tcrn.ch/NTr6S8">tcrn.ch/NTr6S8</a> by <a href="https://twitter.com/nireyal"><s>@</s><b>nireyal</b></a></p>&mdash; TechCrunch (@TechCrunch) <a href="https://twitter.com/TechCrunch/status/239765316601802752" data-datetime="2012-08-26T16:44:40+00:00">August 26, 2012</a></blockquote><script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
  _wpbitly: http://q.bibhas.in/PKzQur
  _oembed_1e4e63497da4c14c903915e153ebf59e: <blockquote class="twitter-tweet" width="500"><p>Where Have The Users Gone? <a href="http://t.co/acgTzWKR" title="http://tcrn.ch/NTr6S8">tcrn.ch/NTr6S8</a> by @<a href="https://twitter.com/nireyal">nireyal</a></p>&mdash; TechCrunch (@TechCrunch) <a href="https://twitter.com/TechCrunch/status/239765316601802752" data-datetime="2012-08-26T16:44:40+00:00">August 26, 2012</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
  SNAP_FormatTW: "%TITLE% - %URL% #l"
  _edit_last: "1"
published: true
url: /blog/836/why-you-should-be-bothered-about-twitters-t-co-url-shortener-and-a-way-to-bypass-it/
title: Why You Should Be Bothered About Twitter's t.co Url Shortener And A Way To Bypass It
---
<blockquote>The way to bypass the t.co url is only for Twitter Web users. If you're not using it, If you're using an app, it wont help you.</blockquote>
Since the very moment twitter introduced the automatic link shortening of all the links posted with it's own t.co shortener, it bothered me. Why? Let me explain.<!--more-->

Twitter is using this t.co shortener just to track all the links being shared across it's site. It can track how many links are being shared and how many of them are clicked. (Technically hat also enables them to know which resources are being more popular among the users. I'm not sure how they are using that data.) But the real trouble is, t.co is just another server on your way to the original url.

If you notice carefully, most of the links you share or click nowadays are already shortened. And thanks to services like bit.ly, everyone can make a new link shortener in no time. While these shortened urls do look nice, they just push one node away from your destination node. When you click a shortened url, you are taken to the server where the link shortener is hosted and then redirected to the original destination. So, if it were to take you 100ms to reach your url, it'll take you some more time than that if you click the shortener url.

t.co is adding another node above what you already have. So that's two node you have to be redirected from. For example, take this tweet -

<blockquote class="twitter-tweet"><p>Where Have The Users Gone? <a href="http://t.co/acgTzWKR" title="http://tcrn.ch/NTr6S8">tcrn.ch/NTr6S8</a> by @<a href="https://twitter.com/nireyal">nireyal</a></p>&mdash; TechCrunch (@TechCrunch) <a href="https://twitter.com/TechCrunch/status/239765316601802752">August 26, 2012</a></blockquote>

TechCrunch already uses their own url shortener tcrn.ch, as you see. And when they share it on Twitter, it's being shortened with the t.co url shortener. When you read the tweet, you can see the tcrn.ch url, but if you click it, you'll see that it'll take you to a t.co link. That means, it's an anchor, when the original url is the text and the t.co link is the url. That's an effin bummer. :|

So this is how you have to visit your document now -

<a href="http://t.co/acgTzWKR" target="_blank">http://t.co/acgTzWKR</a> -&gt; <a href="http://tcrn.ch/NTr6S8" target="_blank">http://tcrn.ch/NTr6S8</a> -&gt; <a href="http://techcrunch.com/2012/08/26/where-have-the-users-gone/">http://techcrunch.com/2012/08/26/where-have-the-users-gone/</a>

So I have to go through two server before I can get to my link. That's really a pain in the arse for me, and should be for you too. Because if anyday the t.co server is slow because of the constant load it serves, <strong>you</strong> have to wait.

I effin hate that. So wanted to get my way around it. I inspected the anchor tag of Twitter Web, this is what I got -
<pre class="brush:js">&lt;a href="http://t.co/acgTzWKR" class="twitter-timeline-link" target="_blank" data-expanded-url="http://tcrn.ch/NTr6S8" title="http://tcrn.ch/NTr6S8" dir="ltr" wotsearchprocessed="true"&gt;
    &lt;span class="invisible"&gt;http://&lt;/span&gt;
    &lt;span class="js-display-url"&gt;tcrn.ch/NTr6S8&lt;/span&gt;
    &lt;span class="invisible"&gt;&lt;/span&gt;
    &lt;span class="tco-ellipsis"&gt;
        &lt;span class="invisible"&gt;&amp;nbsp;&lt;/span&gt;
    &lt;/span&gt;
&lt;/a&gt;</pre>
Now if you see closely, twitter stores the original url as the value of <span class="lang:default decode:true  crayon-inline ">data-expanded-url</span> in the anchor tag. That is good for me. I just pushed a simple Javascript code that replaces the value of href property with the value of <span class="lang:default decode:true  crayon-inline ">data-expanded-url</span>'s value. And my work is done.

Here is the javascript code -
<pre class="brush:js">si = window.setInterval(clearanchors, 2000);
function clearanchors(){
    anchors = document.getElementsByTagName('a')
    for(i=0;i&lt;anchors.length;i++){
        if(anchors[i].getAttribute('data-expanded-url') != null){
        anchors[i].setAttribute('href', anchors[i].getAttribute('data-expanded-url'));
        }
    }
}</pre>
Just use any javascript pusher and push this to twitter.com. I personally use <a href="https://chrome.google.com/webstore/detail/plcnnpdmhobdfbponjpedobekiogmbco" target="_blank">Personalized Web</a>. so I created this recipe for it -
<p style="text-align: center;"><a href="http://bibhas.in/blog/wp-content/uploads/2012/08/Screenshot-08262012-104737-PM.png"><img class="aligncenter  wp-image-837" title="Screenshot - 08262012 - 10:47:37 PM" src="http://bibhas.in/blog/wp-content/uploads/2012/08/Screenshot-08262012-104737-PM-300x184.png" alt="" width="300" height="184" /></a></p>
<p style="text-align: left;">I added it as timed function because or else it wont change the urls Twitter Web loads with ajax.</p>
