# Phaser Debug

Simple debug module for the [Phaser][0] game framework.

[0]: https://github.com/photonstorm/phaser

## Usage

Simply download the `dist/phaser-debug.js` script and include it on your page after including Phaser:

```html
<script src="phaser.js"></script>
<script src="phaser-debug.js"></script>
```

After adding the script to the page you can activate it by enabling the plugin:

```js
game.add.plugin(Phaser.Plugin.Debug);
```

## Browser Support

Currently this module supports the following browsers:

 - Desktop
  * Firefox 30+
  * Chrome 27+
  * Safari 5.1+
  * Opera 23+
