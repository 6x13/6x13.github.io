---
id: 1
title: 'Store Presence on App Store #1 - Let's Play: Scrape'
date: 2017-09-05T19:11:40+00:00
author: Kenan Bölükbaşı
layout: post
guid: http://blog.6x13.com/?p=22
permalink: /app-store-presence-lets-play-1/
image: /static/analytics_feature.jpg
categories:
  - Analytics
  - Business
  - Development
tags:
  - analytics
  - app store
  - data science
  - jupyter
  - marketing
  - pandas
  - protocol buffers
  - python
  - store presence
  - twiniwt
---

This is #1 of the how-to  series on custom store presence analysis and
plotting using Python, Jupyter and lots of sciency-graphy libraries.

[#1 - Let's Play: Scrape]  [part-1] \<\<.
[#2 - Let's Play: Cleanup] [part-2] \[ DONE \]
 #3 - Let's Play: Optimize          \[ TODO \]
 #4 - Let's Play: Analyze           \[ TODO \]
 #5 - Let's Play: Visualize         \[ TODO \]
 #6 - <strong>...

[part-1] http://blog.6x13.com/app-store-presence-lets-play-1/
[part-2] http://blog.6x13.com/app-store-presence-lets-play-2/

<img class="aligncenter" src="https://media.giphy.com/media/H0Yi2igIiIwy4/giphy.gif" alt="Preparing a business plan requires systematic procrastination: Store presence analytics!" width="500" height="281" />

> <p style="text-align: center;">
>   All work and no play makes Jack a dull boy.
> </p>

Preparing  a business  plan requires  fourteen things:  a business,  a
dozen cups of coffee and systematic procrastination.

I am sure  you can handle the  coffee and the business. So  for now, I
will only try to help with the procrastination:

> I need some insight into the App Store presence of our latest game, [Twiniwt](http://6x13.com/). I visit App Annie's _Featured_ page, as usual.

If you don't know about App Annie, [this is a good review of the service](http://www.businessofapps.com/guide/app-annie/).

Analytics  you find  on such  dedicated services  are good  as general
performance metrics.   However, you might  want the data to  support a
particular claim in  your business plan. The  freely available content
is hardly useful for that. The signal  to noise ratio makes it hard to
read. Besides, you can only filter the data.

We have to  do some ad-hoc data science and  visualization in order to
get better results. Now, what was **data science**, again?

<blockquote class="twitter-tweet" data-width="550">
  <p lang="en" dir="ltr">
    "A data scientist is a statistician who lives in San Francisco" <a href="https://t.co/NAftOI9jmJ">pic.twitter.com/NAftOI9jmJ</a> via <a href="https://twitter.com/smc90">@smc90</a>
  </p>
  
  <p>
    &mdash; Chris Dixon (@cdixon) <a href="https://twitter.com/cdixon/status/428914681911070720">January 30, 2014</a>
  </p>
</blockquote>

I  live  in  Istanbul  and  I prefer  a  budget  GNU/Linux  laptop  at
work. Obviously, I  am no data scientist. Still,  some half-assed data
science is better than none.

#### Let's play: STORE PRESENCE ANALYTICS!

This will require at least five steps:

Scrape
:   Gather the data and understand its current structure

Cleanup
:   Restructure and delete irrelevant fields of the data

Optimize
:   Optimize the restructured data to a format that is faster to batch
    process

Analyze
:   Do filtering, mapping, grouping and analysis over data

Visualize
:   Plot and visualize the data frames

We will  dedicate a seperate  post to each  of those titles.  The data
analysis and visualization  steps can actually grow  to multiple posts
as we go.

We won't delve into the  subject of **integration**, yet we will
rely on cross-platform, portable data formats. Besides, we will mainly
use Python, which is a very sound choice for integration.

We won't be concerned about **storage** either, as the data will
already shrink significantly while we are optimizing for performance.

Before we begin, let's look at some coffee beans and get hyped!

<img class="size-full wp-image-149 aligncenter" src="http://blog.6x13.com/wp-content/uploads/2017/09/coffee_beans.png" alt="" width="310" height="175" srcset="http://blog.6x13.com/wp-content/uploads/2017/09/coffee_beans.png 310w, http://blog.6x13.com/wp-content/uploads/2017/09/coffee_beans-300x169.png 300w" sizes="(max-width: 310px) 100vw, 310px" />

###### SCRAPE

First things first. If I want to analyze store presence data, **I need
the store presence data.**  I need it in a way I can  process it. I am
already familiar with App Annie's  daily feature tables. Here we
go:

Go to your app's page.

Go to **User Acquisition** >> **Featured.**

This is good stuff, even though the data itself is not. 😒<figure id="attachment_117" style="width: 1083px" class="wp-caption alignnone">

<img class="wp-image-117 size-full" src="http://blog.6x13.com/wp-content/uploads/2017/09/featured-table.jpg" alt="App Store Presence Feature Table" width="1083" height="305" srcset="http://blog.6x13.com/wp-content/uploads/2017/09/featured-table.jpg 1083w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-table-300x84.jpg 300w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-table-768x216.jpg 768w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-table-1024x288.jpg 1024w" sizes="(max-width: 1083px) 100vw, 1083px" /><figcaption class="wp-caption-text">WTF are those app positions! 1714? Seriously?</figcaption></figure> 

Anyway.

When   I   click   the   **Export**   button,   I   get   this.<figure
id="attachment_243"     style="width:     632px"     class="wp-caption
aligncenter">

<img class="size-full wp-image-243" src="http://blog.6x13.com/wp-content/uploads/2017/09/appannie-unlock.jpg" alt="connect" width="632" height="293" srcset="http://blog.6x13.com/wp-content/uploads/2017/09/appannie-unlock.jpg 632w, http://blog.6x13.com/wp-content/uploads/2017/09/appannie-unlock-300x139.jpg 300w" sizes="(max-width: 632px) 100vw, 632px" /><figcaption class="wp-caption-text">Connect this app? Hmm, why not!</figcaption></figure> 

Now, I am sure App Annie's [premium solution](https://www.appannie.com/en/tours/market-data-intelligence/) provides various great viewpoints  and customizations to the data. However, being an indie studio and all, we cannot afford it.

Hey, there  is another way! I  can connect my  app. But what do  I see
when I click connect? It is  asking for my App Store developer account
password. **I don't  care what encryption they use,  there is no
way I am  filling those Connect forms asking for  my developer account
passwords.**

So, I guess I am on my own, but that is OK.

_Be warned that I  do not know if App Annie  ever intended or actually
permitted the  use of data they  transfer to client computers  in such
way. So I will  not tell you what to do, I will  just describe how one
would access such freely available data in a structured data format._

Why not having a closer look at the transferred data in Firefox? Right
click anywhere in screen and click **Inspect Element.**

Go to **Network** tab.

<img class="alignnone wp-image-84 size-full" src="http://blog.6x13.com/wp-content/uploads/2017/09/featured-page.jpg" alt="App Annie Featured Page" width="826" height="495" srcset="http://blog.6x13.com/wp-content/uploads/2017/09/featured-page.jpg 826w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-page-300x180.jpg 300w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-page-768x460.jpg 768w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-page-825x495.jpg 825w" sizes="(max-width: 826px) 100vw, 826px" />

Now this is  where you can track requests and  responses. Whenever you
change the table options,  a new set of data will be  sent to you, the
client, in JSON format.

The entry that contains the data you asked for is something like this:

<pre>/ajax/ios/app/your-app-name/daily-feature...</pre>

That is the  app's daily store presence  aggregated according to
your preferences.

###### Saving Your Data

When you  need to  save a  piece of data  a web  server sent  you, you
simply right click the corresponding entry in **Network** tab, then do
**Copy** >> **Copy Response.**

Open your favourite text editor and  paste the clipboard to a new JSON
file.

If you want to quickly do that for multiple data sets, you can instead
**Copy** >> **Copy as cURL**, and  modify the date etc. in copied curl
command.
  
_ 

###### DATA STRUCTURE

Let's check  out a sample store  presence in an App  Annie Daily
Featured response.

<pre>[
  [
    {
      "image": "https://static-s.aa-cdn.net/img/ios/...",
      "type": "icon",
      "thumb": "https://static-s.aa-cdn.net/img/ios/..."
    }
  ],
  [
    "China",
    <strong>"CN"</strong>
  ],
  <strong>"iPhone"</strong>,
  <strong>"Board"</strong>,
  <strong>"Collection List"</strong>,
  "N/A",
  <strong>2</strong>,
  4,
  <strong>6</strong>,
  [
    {
      "existence": false,
      "detail": null,
      "label": <strong>"Featured Home"</strong>
    },
    {
      "existence": false,
      "detail": null,
      "label": <strong>"Board"</strong>
    },
    {
      "existence": true,
      "detail": {
        "position": [
          6
        ],
        "row": <strong>[
          4,
          4
        ]</strong>
      },
      "parent": <strong>"免费"</strong>,
      "label": "Twiniwt"
    }
  ],
  [
    "N/A",
    0,
    100,
    ""
  ]
]</pre>

Now, compare it  to the table, not too carefully,  though. (I couldn't
bother finding  the exact same  record. 😎)<figure id="attachment_117"
style="width: 1083px" class="wp-caption alignnone">

<img class="wp-image-117 size-full" src="http://blog.6x13.com/wp-content/uploads/2017/09/featured-table.jpg" alt="App Store Presence Feature Table" width="1083" height="305" srcset="http://blog.6x13.com/wp-content/uploads/2017/09/featured-table.jpg 1083w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-table-300x84.jpg 300w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-table-768x216.jpg 768w, http://blog.6x13.com/wp-content/uploads/2017/09/featured-table-1024x288.jpg 1024w" sizes="(max-width: 1083px) 100vw, 1083px" /><figcaption class="wp-caption-text">1714? Why do you even put that into the table? That is just wasted network bandwidth.</figcaption></figure> 

Below is a breakdown of the row contents:

Creative `[GARBAGE]`
:   URLs to store creative for the app.

Country
:   The App Store country name as well as the two-letter
  
    [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code for it.

Device
:   iPhone or iPad

Category Page
:   The featured category page where the placement is displayed.

Type
:    The feature  type of  the final  placement displayed  in the  app
    store.

Subtitle `[GARBAGE]`
:   The text shown alongside feature banners and collection titles.

Depth
:   The number of steps necessary to see the final feature placement.

Row `[DUPLICATE]`
:    The final  row  number  along the  path  leading  to the  feature
    placement.

Position
:   The  final position number along  the path leading to  the feature
    placement.

Feature Path `[DIRTY]`
:   A  detailed path of where  the feature placement was  shown in the
    app store.

Premium Content `[GARBAGE]`
:    Locked additional  content,  only activated  for premium  account
    queries.

Here is the  cleaned-up version of the store presence  data we want to
work with.

<pre>[
  "CN",
  "iPhone",
  "Board",
  "Collection List",
  2,
  [
    4,
    4
  ],
  6,
  [
    "Home",
    "Board",
    "免费"
  ]
]</pre>

Awesome, but enough with the data  scraping for today. I will show you
how to cleanup and restructure the JSON  data to fit our needs in next
part.

Check back for [Part 2](http://blog.6x13.com/app-store-presence-lets-play-2/) of the series! If you have any questions or advice, please comment below. Thank you!

###### Related Links

Check  out the  following official  App Store  guide to  building your
store presence:

[Make the Most of the App Store](https://developer.apple.com/app-store/planning/)
