
# HEB Cheater

### Requirements

`nodejs >= 12`  
Optional: If using `--open true` for magic tab opening, a system with `open` shell command with a valid browser configured to delegate `https://`-prefixed string arguments to said browser. macOS does this out of the box with Safari (or whatever your Finder / System Preferences uses for default browser settings).

### Setup


###### bash
```
git clone https://github.com/andrew-templeton/heb-cheater;
cd heb-cheater;
npm install;
node bin/cli # rest of your arguments here;
```

###### node
```
# in bash, npm install heb-cheater
const heb = require('heb-cheater')
(async () => {
  const stores = await heb({ latitude /* your args here */ })
  console.log(JSON.stringify(stores, null, 2))
})();
```

### Use

`node index [all the args]`  

All arguments used like: `--arg value`.  
Boolean flags should be used as value of `true`, all default to `false`.

###### `latitude`

Floating point, signed latitude of the centerpoint of search.  
Default: `30.270077` (a place in Austin, TX)

###### `longitude`

Floating point, signed longitude of the centerpoint of search.  
Default: `-97.7437001` (a place in Austin, TX)

###### `distance`

Floating point, unsigned distance as the crow flies in miles from centerpoint you're willing to travel.  
Default: `100`

###### `minimum`

Unsigned, `1`-is-minimum, integer for lowest number of available appointments needed at a store to qualify for selection within your radius. This is useful, because lots of stores with `1` appointment are noisy, and very difficult for you to instantly grab the sole available slot. If you set this to something like `10` or `20`, it will be a lot easier to react to the listing and book one of the slots before they are all claimed.  
Default: `1`

###### `interval`

Unsigned, floating point value for the number of seconds to wait between pings when using `--watch true`. Recommend using no lower than `10`, as you could be blocked otherwise. You might have good results in a mass booking workflow if you use all of `--watch true --forever true --open true` and set this number to `60` (one minute), meaning every one minute it will open all viable stores with enough slots in your radius, allowing you to react en-masse in realtime to availability. Lower numbers in this use case would overwhelm the senses.  
Default: `10`


###### `watch`

Boolean flag for if the system should keep checking until a store meeting your needs is found, versus trying one time and stopping.  

###### `open`

Boolean flag for if the system call to `open <found store urls>` should be used when stores are found. This will open LOTS of tabs if used with `--watch true --forever true`, take care.

###### `forever`

Boolean flag, when used with `--watch true`, which will cause the system to keep pinging for stores even after one or more valid stores meeting your conditions are found. Be careful using all three of the flags: `--watch true --forever true --open true`, as this will keep opening tabs for found stores every `--interval true`.
