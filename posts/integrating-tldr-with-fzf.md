---
title: "Integrating TLDR with FZF"
date: "2023-02-26"
excerpt: "TLDR + FZF for a better developer experience"
---

In this post, we gonna dive into [TLDR](https://formulae.brew.sh/formula/tldr) with [fzf](https://formulae.brew.sh/formula/fzf) search.

## Usage of TLDR

Go to your favorite terminal, with TLDR enabled, and execute the following command:

```bash
$ tldr brew
```

## Searching with FZF

```bash
$ fzf .
```

It will execute a fuzzy search in the current directory.

## Passing a TLDR list to FZF

```bash
$ tldr --list | fzf
```

The first argument `tldr --list` will generate a list of available commands enabled in your command line.

And when passing with a pipe operator `|` it will send the results to `fzf`.

## Selecting an Argument with FZF

```bash
$ tldr --list | fzf | xargs tldr
```

As you did in the previous step, it will share the list to `fzf`, and when you select an option it will send the argument via `xargs` to execute with `tldr`.

## Previewing Commands on Searching

It creates a preview window, showing the results from TLDR and passing to the new window via `xargs`.

Let's try with the following command:

```bash
$ tldr --list | fzf --preview "tldr {1}" --preview-window=right,60% | xargs tldr
```

## Bonus: Aliasing

Create an alias to avoid remembering all this stuff:

```bash
alias tldrf='tldr --list | fzf --preview "tldr {1}" --preview-window=right,60% | xargs tldr'
```

Source your command line configuration file, in my case it is `.zshrc`, and voilá!

Try your new alias into the command line:

```bash
$ tldrf
```
