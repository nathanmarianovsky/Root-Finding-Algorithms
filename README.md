<h1 align="center">JS Implementation of Root-Finding Algorithms</h1>


# Table of Contents

- [Introduction](#introduction)
- [Setting Up](#setting-up)
- [Changing the Input](#changing-the-input)
- [Expected Output](#expected-output)
- [Running the Code](#running-the-code)


# Introduction

Given a continuous function <a href="https://www.codecogs.com/eqnedit.php?latex=f(x)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(x)" title="f(x)" /></a> on a compact interval <a href="https://www.codecogs.com/eqnedit.php?latex=[a,b]" target="_blank"><img src="https://latex.codecogs.com/gif.latex?[a,b]" title="[a,b]" /></a>, for any <a href="https://www.codecogs.com/eqnedit.php?latex=f(a)&space;\leq&space;L&space;\leq&space;f(b)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(a)&space;\leq&space;L&space;\leq&space;f(b)" title="f(a) \leq L \leq f(b)" /></a> (assuming <a href="https://www.codecogs.com/eqnedit.php?latex=f(a)&space;<&space;f(b)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(a)&space;<&space;f(b)" title="f(a) < f(b)" /></a>) there always exists a <a href="https://www.codecogs.com/eqnedit.php?latex=a&space;\leq&space;c&space;\leq&space;b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a&space;\leq&space;c&space;\leq&space;b" title="a \leq c \leq b" /></a> such that <a href="https://www.codecogs.com/eqnedit.php?latex=f(c)&space;=&space;L" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(c)&space;=&space;L" title="f(c) = L" /></a> by the Intermediate Value Theorem. The disadvantage of this theorem is that it does not provide a means of actually determining the value of <a href="https://www.codecogs.com/eqnedit.php?latex=c" target="_blank"><img src="https://latex.codecogs.com/gif.latex?c" title="c" /></a>. With this in the background, the repository focuses on the implementation of the following root-finding algorithms:

- Bisection Method
- Newton's Method
- Secant Method


# Setting Up
I have to assume that you have npm and git installed and so in order to get started first copy the repository over to your local machine. Inside the root directory of the project as administrator run:
```js
npm install
```
This will handle the installation of all node_modules.


# Changing the Input

Inside of input.txt you will find the four lines that correspond to the function, interval, starting point, and error input. For the function keep it in the form <a href="https://www.codecogs.com/eqnedit.php?latex=f(x)&space;=&space;\textsc{something}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(x)&space;=&space;\textsc{something}" title="f(x) = \textsc{something}" /></a> and use the symbols +, -, *, /, and ^ to represent addition, subtraction, multiplication, division, and exponentiation respectively. You are also allowed to use any standard function such as the exponential, logarithm, cosine, etc...


# Expected Output

The output will always be up to 15 significant digits.


# Running the Code

In the terminal simply run:
```js
node index.js
```