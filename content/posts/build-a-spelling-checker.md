---
categories: ["coding", "system design", "interview", ]
date: 2021-04-07T01:13:42Z
description:  ""
draft: false
image: "/images/2021/04/Screenshot-2021-04-07-at-12.13.08-PM.png"
slug: "build-a-spelling-checker"
tags: ["coding", "system-design", "interview", ]
title: "Build a Spelling Checker"

---


A friend suggested this book called ["Elements of Programming Interviews in Python"](https://www.amazon.in/dp/1537713949/) to me. Interviews have always been a weak spot for me, and I am not particularly bright when it comes to hardcore coding assignments. So I took this book as an opportunity to improve myself a bit.

The book has a section called "Design Problems" where there are few systems that you have to design as an exercise. First of them is a spelling checker. I took it up and read the clues provided by them, and thought, let's try to build one as an exercise.

Their clue/solution explains the typical issues with building a spell checker, and provides few ways to achieve/improve such a system.

## Solution

The most basic solution that comes to mind is that have a list of all the words in the given language, and find all the words that have a Levenshtein distance of <= 2 from the given typo. Assuming that the typo is at most 2 characters off from the intended word.

### Problem with the Solution

Such a search is expensive to say the least. English language has around ~520,000 words according to Wikipedia. I downloaded a list of about ~370,000 words. Calculating Levenshtein distance with all of them for every single given typo, will not be pleasant.

### Optimizing the solution

My first thought was on how I could eliminate the lookup with a list of 370,000 strings.

In my experience, typos tend to have same or similar length of the original word. They can be off by 1-2 characters if the person does not know the exact spelling. So, I could improve the number of lookups by pre-calculating the length of all the words in the dictionary, and store them along with the words, and before looking up all the words in the list, I could filter the list by only picking words that are 0-2 characters off in length from the typo words.

I imported that whole list of ~370,000 words to a postgres table, and calculated and stored their lengths with them. Here is the distribution of lengths in there -

```
spellchecker=# select length, count(*) as num from word group by length order by num desc;
 length |  num
--------+-------
      9 | 53402
      8 | 51627
     10 | 45872
      7 | 41998
     11 | 37539
      6 | 29874
     12 | 29125
     13 | 20944
      5 | 15918
     14 | 14149
     15 |  8846
      4 |  7186
     16 |  5182
     17 |  2967
      3 |  2130
     18 |  1471
     19 |   760
      2 |   427
     20 |   359
     21 |   168
     22 |    74
     23 |    31
     24 |    12
     25 |     8
     27 |     3
     28 |     2
     29 |     2
     31 |     1
(28 rows)
```

So if the typo is 5 character long, now the lookup will be run on about ~43,000 words, which is not great, but definitely an improvement. Now, we need to think about the words we'll look up against that list.

As part of implementing this, I wrote a small function that, given a typo, would change 1-2 characters in it with another character in the alphabet, and generate another typo, _or_ a valid word, which could be the word the user wanted to type. But that list is massive. Looking that up against another massive list is not what we want. So that means that there is some more optimization possible here.

It's indeed possible that someone types `pebple` when they meant to write `people`, but the probability of that happening is actually pretty low. Guess why? It's because of the keyboard we use. While there are of course tons of keyboard layouts, but _most_ people use QWERTY layout, and that's good enough for my spell checker, because I need to think more about my bigger chunk of users. I could think about _all_ the keyboard layouts out there, but the complication I'll have to integrate for those fraction of Dvorak or Colemak layout users didn't make sense for the first version. I'll get back to them later.

So next I wrote a small adjacency matrix of all the characters in a QWERTY keyboard.

```python
qwerty_adj_graph = {
    "0": ["i", "p", "o"],
    "1": ["q"],
    "2": ["w", "q"],
    "3": ["e", "w"],
    "4": ["r", "e"],
    "5": ["t", "r"],
    "6": ["y", "t"],
    "7": ["u", "y"],
    "8": ["i", "u"],
    "9": ["o", "i"],
    "a": ["q", "w", "s", "u", "z"],
    "b": ["v", "g", "h", "n"],
    "c": ["x", "d", "f", "v"],
    "d": ["s", "e", "r", "f", "c", "x"],
    "e": ["w", "r", "d", "s", "i"],
    "f": ["d", "r", "t", "g", "v", "c"],
    "g": ["f", "t", "y", "h", "b", "v"],
    "h": ["g", "y", "u", "j", "n", "b"],
    "i": ["u", "e", "o", "k", "j", "y"],
    "j": ["h", "u", "i", "k", "m", "n"],
    "k": ["j", "i", "o", "l", "m"],
    "l": ["k", "o", "p"],
    "m": ["n", "j", "k"],
    "n": ["b", "h", "j", "m"],
    "o": ["i", "p", "l", "k"],
    "p": ["o", "l"],
    "q": ["w", "a"],
    "r": ["e", "t", "f", "d"],
    "s": ["a", "w", "e", "d", "x", "z"],
    "t": ["r", "y", "g", "f"],
    "u": ["y", "i", "j", "h"],
    "v": ["c", "f", "g", "b"],
    "w": ["q", "e", "s", "a"],
    "x": ["z", "s", "d", "c"],
    "y": ["t", "u", "h", "g", "i"],
    "z": ["a", "s", "x"],
}
```

I am only checking for alpha-numeric characters in the typo and replacing them with only letters. I could also add checks for special characters, I chose not to for this version. This could be improved.

So now, when I generate possible words by exchanging letters in a typo, I don't replace all letters in the typo, with _all_ the letters in the alphabet. I just pick the letters that are closer to the given letter in the typo. Because it's more probable for someone to type `peiple` when they mean `people`, because `o` and `i` are right next to each other. This also considers the fact that we type on our phones a lot, and our phone keyboards are tiny, and we have fat fingers.

My typo calculation function looks something like this now -

```python
def get_typos(word):
    sample = list(word)
    sample_len = len(sample)
    typos = []

    typo_indices = list(range(sample_len)) + list(
        combinations(range(sample_len), 2)
    )
    for typo_idx in typo_indices:
        if type(typo_idx) == int:
            present_char = sample[typo_idx]
            alphabet = qwerty_adj_graph.get(present_char, present_char)
            for c in alphabet:
                sample_copy = sample.copy()
                sample_copy[typo_idx] = c
                if sample_copy != sample and sample_copy not in typos:
                    typos.append(sample_copy.copy())
        elif type(typo_idx) == tuple:
            idx1, idx2 = typo_idx
            for c in qwerty_adj_graph.get(sample[idx1], sample[idx1]):
                sample_copy = sample.copy()
                sample_copy[idx1] = c
                for c2 in qwerty_adj_graph.get(sample[idx2], sample[idx2]):
                    sample_copy[idx2] = c2
                    if sample_copy != sample and sample_copy not in typos:
                        typos.append(sample_copy.copy())
    typos_final = ["".join(typo) for typo in typos]
    return typos_final
```

`typo_indices` contains a list of either integers or pairs of integers. They are essentially indices in the typo string that can be replaced with an adjacent letter to create a typo. The pair of indices indicate that those 2 letters need to be replaced. I did this to easily replace the letters in the typo.

So, now it behaves like this -

```
>>> print(get_typos('peiple'))
['oeiple', 'leiple', 'pwiple', 'priple', 'pdiple', 'psiple', 'piiple', 'peuple', 'peeple', 'people', 'pekple', 'pejple', 'peyple', 'peiole', 'peille', 'peipke', 'peipoe', 'peippe', 'peiplw', 'peiplr', 'peipld', 'peipls', 'peipli', 'owiple', 'oriple', 'odiple', 'osiple', 'oiiple', 'lwiple', 'lriple', 'ldiple', 'lsiple', 'liiple', 'oeuple', 'oeeple', 'oeople', 'oekple', 'oejple', 'oeyple', 'leuple', 'leeple', 'leople', 'lekple', 'lejple', 'leyple', 'oeiole', 'oeille', 'leiole', 'leille', 'oeipke', 'oeipoe', 'oeippe', 'leipke', 'leipoe', 'leippe', 'oeiplw', 'oeiplr', 'oeipld', 'oeipls', 'oeipli', 'leiplw', 'leiplr', 'leipld', 'leipls', 'leipli', 'pwuple', 'pweple', 'pwople', 'pwkple', 'pwjple', 'pwyple', 'pruple', 'preple', 'prople', 'prkple', 'prjple', 'pryple', 'pduple', 'pdeple', 'pdople', 'pdkple', 'pdjple', 'pdyple', 'psuple', 'pseple', 'psople', 'pskple', 'psjple', 'psyple', 'piuple', 'pieple', 'piople', 'pikple', 'pijple', 'piyple', 'pwiole', 'pwille', 'priole', 'prille', 'pdiole', 'pdille', 'psiole', 'psille', 'piiole', 'piille', 'pwipke', 'pwipoe', 'pwippe', 'pripke', 'pripoe', 'prippe', 'pdipke', 'pdipoe', 'pdippe', 'psipke', 'psipoe', 'psippe', 'piipke', 'piipoe', 'piippe', 'pwiplw', 'pwiplr', 'pwipld', 'pwipls', 'pwipli', 'priplw', 'priplr', 'pripld', 'pripls', 'pripli', 'pdiplw', 'pdiplr', 'pdipld', 'pdipls', 'pdipli', 'psiplw', 'psiplr', 'psipld', 'psipls', 'psipli', 'piiplw', 'piiplr', 'piipld', 'piipls', 'piipli', 'peuole', 'peulle', 'peeole', 'peelle', 'peoole', 'peolle', 'pekole', 'peklle', 'pejole', 'pejlle', 'peyole', 'peylle', 'peupke', 'peupoe', 'peuppe', 'peepke', 'peepoe', 'peeppe', 'peopke', 'peopoe', 'peoppe', 'pekpke', 'pekpoe', 'pekppe', 'pejpke', 'pejpoe', 'pejppe', 'peypke', 'peypoe', 'peyppe', 'peuplw', 'peuplr', 'peupld', 'peupls', 'peupli', 'peeplw', 'peeplr', 'peepld', 'peepls', 'peepli', 'peoplw', 'peoplr', 'peopld', 'peopls', 'peopli', 'pekplw', 'pekplr', 'pekpld', 'pekpls', 'pekpli', 'pejplw', 'pejplr', 'pejpld', 'pejpls', 'pejpli', 'peyplw', 'peyplr', 'peypld', 'peypls', 'peypli', 'peioke', 'peiooe', 'peiope', 'peilke', 'peiloe', 'peilpe', 'peiolw', 'peiolr', 'peiold', 'peiols', 'peioli', 'peillw', 'peillr', 'peilld', 'peills', 'peilli', 'peipkw', 'peipkr', 'peipkd', 'peipks', 'peipki', 'peipow', 'peipor', 'peipod', 'peipos', 'peipoi', 'peippw', 'peippr', 'peippd', 'peipps', 'peippi']
```

So at this point, if you give a typo word, I create a list of possible words by replacing the letters in it with their adjacent letters, and then lookup those words in the list of words of similar lengths. Among all these words, only `people` is a valid word, so that gets returned in the end.

That all sounds fine. By doing all that every time have their own costs. So I thought why not have a hash table of all possible typos for all possible words? That could remove all these headaches completely. You give me a typo, I give you the possible words in a single lookup. Because I intend to store the typos along with the foreign keys of the valid words it could be typo of.

I was actually stupid enough to try do this. Until I realized how massive the list of all possible typos of all possible words, is. The last time I tried it, the data migration showed some 16 hours to complete inserting them to my postgres db. But I aint giving up.

I decided to optimize that a bit as well. See, I don't really need to calculate typos of all possible words, I only needed to calculate them for all the words that people mis-spell most. I didn't actually go look for a dataset of most misspelt words though. I decided to keep it organic. So each time you lookup a typo, it finds you the right words, but at the same time, it starts a background process that calculates and stores all possible typos for all those words. So this doesn't overwhelm me and happens on it's own. And each tiem you look up a typo, I lookup the database for that typo. So if anyone searched for the same typo, the words related to it are already linked to it in the database, and you get the results rather quickly.

Now, after all this, when I show you the probable words you might be trying to type, I preferably need to rank them. Show you the most intended word first. There are couple of ways of achieving this. Best method would be if I knew your typing history/pattern. That way I'd know which words you type most or misspell most. Most of our mobile keyboards have this. But let's say I have an API to lookup typos. I wont really have personalized typing histories. But, I could store the frequency of words that are most used. I just decided to do that. But how do I calculate that?

I just picked up a text file version of couple of english books (rather thick ones), and calculated all the words in them and their frequency, and then stored them in my db beside the words. This way I have _some_ indication of how frequently some words are used. And each time a word is looked up in the db, I increment the frequency just to stay updated.

## Further optimizations

One major thing I looked over while building this is was phonetic modeling of typos. People could type `ofen` instead of `often`, if they didn't know how the world is spelled correctly. My current implementation doesn't address this. If I lookup `nuge`, it'll never give me `nudge` at it's current state. The closest I could do is, if all else fails and the list of probable words is really small or empty, then run a Levenshtein distance lookup on the similar length words as last resort, and save the mapping for future reference.

I have couple of more ideas on how to solve this, but need to think more about them to write them down. They involve replacing letters in the typo with pair of letters that are used most often, or parts of the typo with combination of letters that appear together most often. E.g. `uge` could be replaced with `udge` and so on.

Another way to improve this is word stemming. When someone writes `compute`, they could be trying to type `computation` or `computing` or `computer`. Stemming itself is another exercise in the given book. I'll get to it this week.

So this was my experiment with building a spell checker. I'll deploy this tiny thing and link it here after couple of days. Writing this down itself took some time and thought.

If you have any suggestions or think all this was stupid, please to tweet it to me. Thanks for reading till this far.

