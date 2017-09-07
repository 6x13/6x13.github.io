---
id: 111
title: 'Store Presence on App Store #2 &#8211; Let&#8217;s Play: Cleanup'
date: 2017-09-05T22:25:30+00:00
author: Kenan Bölükbaşı
layout: post
guid: http://blog.6x13.com/?p=111
permalink: /app-store-presence-lets-play-2/
image: /wp-content/uploads/2017/09/analytics-feature.jpg
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
In [the first post of the series](http://blog.6x13.com/app-store-presence-lets-play-1/), we learnt how to gather the data, now we are going to do some cleanup.

<pre>This is #2 of the how-to series on custom store presence analysis and plotting using Python, Jupyter and lots of sciency-graphy libraries.

<a href="http://blog.6x13.com/app-store-presence-lets-play-1/">#1 - Let's Play: <strong>Scrape</strong></a>   <strong> [ DONE ]</strong>
<a href="http://blog.6x13.com/app-store-presence-lets-play-2/">#2 - Let's Play: <strong>Cleanup</strong></a>   <strong>&lt;&lt;</strong>
#3 - Let's Play: <strong>Optimize</strong><strong>  [ TODO ]</strong>
#4 - Let's Play: <strong>Analyze   [ TODO ]</strong>
#5 - Let's Play: <strong>Visualize [ TODO ]
</strong>#6 - <strong>...
</strong></pre>

<img class="aligncenter" src="https://media.giphy.com/media/kXBVtKjLxINji/giphy.gif" alt="cleanup" width="500" height="250" />

###### Where Were We?

Using the methods in the Let&#8217;s Play #1, I gathered global, day-by-day, August 2017 data for the App Store presence of our latest game, [Twiniwt](http://6x13.com/).

Below is the size of the dataset:

<pre>[kenanb@6x13 twiniwt-1708]$ <em>du -hsc *</em>
4.0K 170801.json
4.0K 170802.json
1.5M 170803.json
1.5M 170804.json
1.5M 170805.json
728K 170806.json
728K 170807.json
...
684K 170830.json
732K 170831.json
<strong>23M total</strong></pre>

Damn! Surely, it is time for cleanup and restructuring.

###### Scabbling and Cleanup

Let&#8217;s `python3` and import the required packages.

<pre>import json, pprint</pre>

For this post, all we need is [Python 3](https://www.python.org/downloads/), which I presume you already have. Even though it is completely optional for cleanup part of the series, I strongly suggest installing and using [Jupyter Notebook](http://jupyter.org/) for data exploration. It is especially useful while trying to restructure the data for your needs.

We saved our daily feature data to a subdirectory in our working directory.

A _dataset corresponding to 2017-08-15_ is saved as:

<pre>./json/170815.json</pre>

We want to loop over a period, say, _each day in August 2017_.

We need to generate the filepaths for the corresponding dates in the loop.

The year:

<pre>y = 17</pre>

The month:

<pre>m = 8</pre>

Loop for each day, generate basename for the file and concatenate the whole pathname.

<pre>for d in range(31):
    date = "%02d%02d%02d" % (y, m, d+1)
    file_name = "json/" + date + '.json'</pre>

Here, we read the dataset using the pathname we just created.

<pre>with open(file_name) as data_file:
        data = json.load(data_file)</pre>

Then, we immediately bypass all the garbage branches in the serialized dataset, and assign the key &#8216;rows&#8217; to our data variable.
  
First, we need to have a look at the loaded data and find the path to &#8216;rows&#8217;.

<pre>{
  "data": {
    "data": {
      "pagination": {
        "current": 0,
        "page_interval": 1000,
        "sum": 1
      },
      <strong>"rows":</strong> <strong>[

	  ...

      ],</strong>
      "csvPermissionCode": "PERMISSION_NOT_PASS",
      "columns": [

	  ...

      ],
      "fixedColumns": {
        "tableWidth": 150,
        "fixed": 1
      }
    },
    "permission": true
  },
  "success": true
}</pre>

As you can see, this is what takes us to the &#8216;rows&#8217;:

<pre>data = data['data']['data'].get('rows') or []</pre>

You probably noticed, we didn&#8217;t simply do `data['data']['data']['rows']` because that path might not even exist, if for some reason your app is not in store that day.

###### Restructure

Cool, we got rid of immediate garbage, it&#8217;s time to clean up and restructure the actual row data.

Let&#8217;s see, this is a sample row in an App Annie Daily Featured response.

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

Above, I marked the data we want to keep in bold. The full details about the contents of the row are provided in the [Store Presence on App Store #1 – Let’s Play: Scrape](http://blog.6x13.com/app-store-presence-lets-play-1/).

We traverse the data, removing the garbage values from each row array (in reverse order, of course, so the indices for the garbage entities do not change during deletion.)

<pre>for d in data:
        d.pop(10)
        d.pop(5)
        d.pop(0)</pre>

The two-letter country code is enough, we don&#8217;t need the full name of the countries in each element of our dataset.

<pre>d[0] = d[0][1]</pre>

Shorten the &#8216;Featured Home&#8217; category page name, to simply, &#8216;Home&#8217;.

<pre>if ( d[2] == 'Featured Home' ): d[2] = 'Home'</pre>

The way &#8216;Featured Path&#8217; is structured is pretty complex for our needs. Let&#8217;s restructure it.

<pre>n = []
        for r in d[7]:
            n.append(r['label'])
        n[-1] = d[7][-1]['parent']
        if ( n[0] == 'Featured Home' ):
            n[0] = 'Home'
        if ( n[-1].endswith('see more') ):
            n[-1] = n[-1][:-9]
            n.append('&gt;&gt;')
        d[5] = d[7][-1]['detail']['row']
        d[7] = n</pre>

I am skipping the details on this one, as you might want to keep it, or arrange it differently.
  
Below is the cleaned-up sample data we get after the process.

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

Now that we are finished with the dataset cleanup, let&#8217;s write it back to the file.

<pre>with open(file_name, 'w') as out_file:
        json.dump(data, 
                  out_file, 
                  indent=2, 
                  ensure_ascii=False,
                  sort_keys=True)</pre>

You can view and download the complete code gist below.
  


We scraped and cleaned up the data. It is now down to 3.4Mb from 23Mb, meaning we just got rid of garbage that amounts to ~86% of the dataset. Congratulations!

Yet, the data is still unsuitable for real-time processing. We will fix that in the next part of the series. Some entities are long strings while we could get away with enumerations, things like that. And while at it, let&#8217;s get rid of this JSON nonsense, shall we?

Oh, I almost forgot the coffee beans!

<img class="size-full wp-image-149 aligncenter" src="http://blog.6x13.com/wp-content/uploads/2017/09/coffee_beans.png" alt="" width="310" height="175" srcset="http://blog.6x13.com/wp-content/uploads/2017/09/coffee_beans.png 310w, http://blog.6x13.com/wp-content/uploads/2017/09/coffee_beans-300x169.png 300w" sizes="(max-width: 310px) 100vw, 310px" />

Check back for Part 3 of the series! If you have any questions or advice, please comment below. Thank you!