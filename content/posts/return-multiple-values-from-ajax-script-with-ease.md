---
categories: []
date: 2010-09-24T13:00:00Z
description:  ""
draft: false
slug: "return-multiple-values-from-ajax-script-with-ease"
tags: []
title: "Return Multiple Values from AJAX script with ease"

---


<blockquote>
<p style="text-align: center;"><em><strong>Disclaimer</strong> </em></p>
<p style="text-align: center;"><em>This post is <strong>not</strong> for Expert users. Only the novice guys who are interested in these stuff, might have a look.</em></p>
</blockquote>

While working on an AJAX implemented script, we sometimes need to return a lot of data from the server side script. If you've worked with AJAX, you'll know that the script returns the value as <em>httpObject.responseText</em>. And the value of <em>responseText</em> is what you echo from your script. Now that makes our scope limited.

Assuming that We have a javascript file <em>testAjaxJs.js</em> and <em>testAjaxPhp.php</em> ..

If you try to make a lot of echo inside the php script, all of them are gonna get appended one behind another and appear like, for an example, this - <em>BibhasChandraDebnath</em>.

Now, you may have an idea of echoing a special character like <strong>'-'</strong> or<strong> '_' </strong>after each echo so that you can then split the whole text inside the JS file using the split function and form an array.

That might be an idea, but there is a better way. Why not just use JSON to return data as array? Well, PHP can pretty much deal with JSON and it is a native thing to Javascript. So, it becomes easier. :)

Do this, initialize an array inside the php script, and whenever you have a data ready to be returned, insert it into the array.

So at the end of the script, you'll have an array like this -
<pre class="brush: php">Array
(
    [first_name] =&gt; Bibhas
    [middle_name] =&gt; Chandra
    [last_name] =&gt; Debnath
)</pre>
Now,we're gonna encode this data as JSON object. For that,
<pre class="brush: php">$json_name=json_encode($array_name);</pre>
Now your array will look like -
<pre class="brush: php">{"first_name":"Bibhas","middle_name":"Chandra","last_name":"Debnath"}</pre>
As this is a string to PHP, you can easily echo it. Now lets go to the Javascript part to read this JSON string we just sent to it.

Initialize a variable to store the returned string in it -
<pre class="brush: js">var jsonText = httpObject.responseText</pre>
Now we need to transform this JSONText to a JSON Object. For that, we can use the eval() function. Like-
<pre class="brush: js">var jsonObject= eval('('+jsonText+')');</pre>
or
<pre class="brush: js">eval('jsonObject='+jsonText);</pre>
both works the same in this case.
So now that we have a JSON Object, lets get those data.
<pre class="brush: js">var firstName=jsonObject.first_name;
var middleName=jsonObject.middle_name;
var lastName=jsonObject.last_name;</pre>
And that's it, you've got your data back. :)



