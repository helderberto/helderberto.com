---
title: Improving your TLDR with FZF
date: '2023-02-25'
tags: [bash, fzf, snippet, shell]
draft: false
summary: TLDR integrated with FZF
---

In this post, we gonna dive in into [TLDR](https://formulae.brew.sh/formula/tldr) with [fzf](https://formulae.brew.sh/formula/fzf) search.

## Basic Usage of TLDR

Go to your favorite command line, with TLDR enabled, and execute the following command:

```bash
tldr brew
```

## Doing a Search with FZF

```bash
fzf .
```

It will execute a fuzzy find into your current directory.

## Searching a TLDR list with FZF

```bash
tldr --list | fzf
```

## Displaying a Command Selected with FZF

```bash
tldr --list | fzf | xargs tldr
```

## Creating a Preview for Searched Items

```bash
tldr --list | fzf --preview "tldr {1} --color=always" --preview-window=right,60% | xargs tldr
```

## Bonus: Aliasing

Define an alias to avoid remembering all this stuff:

```bash
alias tldrf='tldr --list | fzf --preview "tldr {1} --color=always" --preview-window=right,60% | xargs tldr'
```

Source your aliases files, and next time you need it, just execute `tldrf`
