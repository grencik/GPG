# GPG 
Greno's password generator
Version 1.0

## Features 
* Generates random, by mask or pronounceable password 
* Used characters can be set in options 
* Manually generates password 
* No other library needed 

## Installation 
Download JS file and add to your code: 

``` html 
<script type="text/javascript" src="gpg.js"></script> 
``` 

## How to use 
At first you have to initialize modul. GPG function accepts one parameter, which is object of options, see below. 

``` js 
var gpg = new GPG(); 
``` 


Then there are two ways how to use it: 

This will generate one random password based on options 

``` js 
var password = gpg.generate(); 
``` 

Or you can generate password manually 

``` js 
var password = gpg.addLower(4).addUpper(4).addNumber(4).shuffle().password; 
``` 

## Options 
When GPG  modul is initialized, default options can be overwritten by options inserted in the first parameter/argument. For example: 

``` js 
var gpg = new GPG({ 
	password_length: 20, 
	special: false, 
}); 
``` 


Options: 
 
* (int) **password_length** - length of generated password. *Default: 12* 
* (bool) **upper** - set true/false to enable/disable uppercase letters. *Default: true* 
* (bool) **lower** - set true/false to enable/disable lowercase letters. *Default: true* 
* (bool) **special** - set true/false to enable/disable special characters. *Default: true* 
* (bool) **numbers** - set true/false to enable/disable numeral characters. *Default: true* 
* (bool) **similar** - set true/false to enable/disable to use similar characters (like 1, l, I...). *Default: false* 
* (bool) **pronounceable** - set true if password should be "pronounceable". Ignored if mask is set. *Default: false* 
* (bool|string) **mask** - mask for password generation. If set, pronounceable and password_length are ignored. Mask is similar to regex (but it is not regex). *Default: false* 
   * [] represents group of used charaters types. Can be: 
      * a - lowercase letters 
      * A - uppercase letters 
      * 1 - numbers 
      * @ - special characters 
   * {} represents number of generated characters 
      * x - exact number of characters 
      * x, y - random number of characters from x to y 
   * example: [a]{1,4}[@]{2}[1A]{1} - random between 1 and 4 lowercase letters + 2 special characters + 1 character from group uppercase characters and numbers 
* (bool) **shuffle_mask** - set true/false to enable/disable shuffling password after generation based on mask. *Default: true* 
* (string) **similar_alphabet** - alphabet of similar characters. *Default: O01lI* 
* (string) **lower_alphabet** - alphabet of lowercase letters. *Default: abcdefghijklmnopqrstuvwxyz* 
* (string) **upper_alphabet** - alphabet of uppercase letter. *Default: ABCDEFGHIJKLMNOPQRSTUVWXYZ* 
* (string) **numbers_alphabet** - alphabet of numeral characters. *Default: 0123456789* 
* (string) **special_alphabet** - alphabet of special characters. *Default:* #&@{}^~[]|$*><;,._-?:)(!%= 

## Functions 

* addLower(min, max) - add lowercase letters to password with random number of characters between min and max. 
* addUpper(min, max) - add uppercase letters to password with random number of characters between min and max. 
* addNumber(min, max) - add numeral characters to password with random number of characters between min and max. 
* addSpecial(min, max) - add special characters to password with random number of characters between min and max. 
* shuffle(x) - shuffle password x times. 
* empty() - erase current password.