# Phaser Debug

Simple debug module for the [Phaser][0] game framework.

![Screenshot][1]

[0]: https://github.com/photonstorm/phaser
[1]: https://dl.dropboxusercontent.com/u/1810371/pics/phaser-debug.png

## Usage

Simply download the `phaser-debug.js` script from the [latest release][10] and include it on your page
after including Phaser:

```html
<script src="phaser.js"></script>
<script src="phaser-debug.js"></script>
```

After adding the script to the page you can activate it by enabling the plugin:

```js
game.add.plugin(Phaser.Plugin.Debug);
```

[10]: https://github.com/englercj/phaser-debug/releases

## Browser Support

Currently this module supports the following browsers:

 - Desktop
  * Firefox 30+
  * Chrome 27+
  * Safari 5.1+
  * Opera 23+
