var Background = require("../background.js");
var Sprite = require("../sprite.js");

var subwayPlatform = new Background ([
  "                                       ",
  "                                       ",
  "                                       ",
  "FFFL FFFFL FFFFL FFFFL FFFFL FFFFL FFFF",
  "    I     I     I     I     I     I    ",
  "    I     I     I     I     I     I    ",
  "    I     I     I     I     I     I    ",
  "    I     I     I     I     I     I    ",
  "    I     I     I     I     I     I    ",
  "    I     I     I     I     I     I    ",
  "    I     I     I     I     I     I    "
],
{
  "I": {sprite: new Sprite (48, 48, 0, ["tile/pillar_middle.gif"]),
        depth: 2},
  "F": {sprite: new Sprite (48, 48, 0, ["tile/girder_top.gif"]),
        depth: 2},
  "L": {sprite: new Sprite (144, 48, 0, ["tile/pillar_head.gif"]),
        depth: 2}
});

module.exports = subwayPlatform;
