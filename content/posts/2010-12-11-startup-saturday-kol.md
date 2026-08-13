---
date: 2010-12-11T07:59:00Z
title: '"Startup Saturday Kolkata \xE2\x80\x93 Tweets"'
tags: ["kolkata", "saturday", "startup"]
---
Just a Live stream for following the tweets made from the Event spot. :)
<!--more-->
<script src="http://widgets.twimg.com/j/2/widget.js"></script>
<script>
new TWTR.Widget({
  version: 2,
  type: 'search',
  search: 'SSKolLive OR SSKolkata since:2010-12-11 include:retweets',
  interval: 3000,
  title: 'Live Tweets from the event',
  subject: 'Startup Saturday Kolkata - December \'10 Edition - The Hot Seat',
  width: 'auto',
  height: 400,
  theme: {
    shell: {
      background: '#545657',
      color: '#ffffff'
    },
    tweets: {
      background: '#ffffff',
      color: '#444444',
      links: '#1985b5'
    }
  },
  features: {
    scrollbar: true,
    loop: true,
    live: true,
    hashtags: true,
    timestamp: true,
    avatars: true,
    toptweets: true,
    behavior: 'default'
  }
}).render().start();
</script>
