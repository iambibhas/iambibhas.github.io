---
categories: []
date: 2020-11-16T00:46:40Z
description:  ""
draft: false
image: "https://images.unsplash.com/photo-1568876694728-451bbf694b83?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
slug: "some-fun-with-imdb-data-and-plotly"
tags: []
title: "Some fun with IMDB data and plotly"

---


I was going through the top 250 movies on IMDB and had a sudden craving to know whether movies from any certain period got better rating or not. So I got to work with the list. I wanted to make some interactive charts, and after trying few things, found [plotly](https://plotly.com/python) to be exactly what I needed. You can use pandas dataframe with it and can even export the interactive chart as HTML to be hosted somewhere. This works.

First I needed to scrape the latest top 250 list. I downloaded the [raw IMDB dataset](https://www.imdb.com/interfaces/) in the hope that I can extract it from there. But turns out the way they calculate the top 250 is not very straightforward. Although it looks interesting, I didn't want to get into the math this weekend. So found some [old code on github](https://github.com/itiievskyi/IMDB-Top-250) to scrape IMDB, and thankfully it worked nicely. Looks like IMDB doesn't care enough to make it difficult to scrape them.

Once I got the data, I tried making some charts. This is just for fun and see if something stands out. Thanks for [the poke](https://twitter.com/rasagy/status/1327513285554388993), Rasagy.

(note: most movies have multiple genres. I picked the first one as otherwise the combination of them become a huge list to have any meaningful comparison.)

(note: the charts are best viewed from a desktop browser as they are interactive.)

# Year of release vs rating

<iframe src="/tmp/imdb_250_year_rating_genre.html" style="width:100%; padding:0; border:0; height:600px;"></iframe>

It seems from a glance that 90s had more movies rated > 8.4. I also put in the genre in the mix. So play around and see what you can figure from this.

# Year of release vs country

<iframe src="/tmp/imdb_250_year_country.html" style="width:100%; padding:0; border:0; height:1200px;"></iframe>

USA is obviously the one with most entries. But we can see some outliers. Few movies from France and Germany from as early as 1927 got in the list.

# Genre vs number of ratings

<iframe src="/tmp/imdb_250_genre_rating_count.html" style="width:100%; padding:0; border:0; height:500px;"></iframe>

Crime, Thriller and Comedy movies get the most votes.

# Rating vs number of ratings

<iframe src="/tmp/imdb_250_rating_rating_count.html" style="width:100%; padding:0; border:0; height:500px;"></iframe>

Seems like it's easier to get into 8-8.5 range with not as many votes. We see some outliers here as well. Notably "12 Angry Men" that got into the 9 category with only around 677k ratings. Followed by "The Good, the Bad and the Ugly" that got into the 8.8 club with around 679k ratings. At the other end, there is "Inception" that got 8.8 even after getting >2M votes.

I'll add more stuff if I come up with them. Do you have any other ideas of what can be done with this? Tweet me!

