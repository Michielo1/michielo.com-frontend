# Configuration

Here you will find everything around configuring MagicWands. In the config.yml we define wands with their spells 

---

## Default config.yml
Below is the unchanged config.yml (last changed on version V1.0.0).
```
#
# In this configuration file you can define the wands available
#
#
# IMPORTANT: The spell key (e.g., "spark", "wave") is the internal spell type
# The "name" field is the display name and can be changed freely
#
# All spells available:
# Spark, Wave, Leap, Fly, Comet, Lightning, Escape, Rage
#
# All colors available:
# black, blue, gray, green, orange, red, white, yellow, aqua, pink
#

wands:
  witchwand:
    name: "witchwand"
    item: "BLAZE_ROD"
    spells:
      spark:  # This is the spell type - don't change this!
        name: "Spark"  # This is the display name - you can change this freely
        cooldown: 3
        color: "green"
        hitrange: 5
        range: 50
        damage: 7
      wave:  # Spell type
        name: "Wave"  # Display name
        cooldown: 3
        damage: 3
        hitrange: 7
        color: "green"
      leap:  # Spell type
        name: "Leap"  # Display name
        cooldown: 5
        verticalPower: 1
        horizontalPower: 1.5
        color: "gray"
  godwand:
    name: "godwand"
    item: "BLAZE_ROD"
    spells:
      spark:  # Spell type
        name: "Spark"  # Display name
        cooldown: 3
        color: "green"
        hitrange: 5
        range: 50
        damage: 7
      wave:  # Spell type
        name: "Wave"  # Display name
        cooldown: 3
        damage: 3
        hitrange: 7
        color: "green"
      leap:  # Spell type
        name: "Leap"  # Display name
        cooldown: 0
        verticalPower: 1
        horizontalPower: 1.5
        color: "gray"
      escape:  # Spell type
        name: "Escape"  # Display name
        cooldown: 5
        verticalPower: 1
        horizontalPower: 1.5
        color: "gray"
        diameter: 10
        animationSpeed: 1
      comet:  # Spell type
        name: "comet"  # Display name
        cooldown: 0
        speed: 1
        color: "orange"
      lightning:  # Spell type
        name: "lightning"  # Display name
        cooldown: 0
        range: 50
        color: "aqua"
      rage:  # Spell type
        name: "rage"  # Display name
        cooldown: 30
        range: 20
        spacing: 1
        duration: 15
        color: "red"
      fly:  # Spell type
        name: "fly"  # Display name
        cooldown: 60
        color: "gray"

# uniqueKey is used to uniquely identify MagicWands items. If empty, it will be generated on startup.
# if changed, it will invalidate all wands created up until the change. This can be seen as a safeguard.
uniqueKey: ""
```

---

## Defining wands

When defining a wand we first need to quickly go over how nested options work in a configuration file. Let us take the example of wanted to define some text with the variable "name", set it to "example" and nest it in "godwand". We would get:
```
godwand:
    name: "example"
```
We use nested information to define wands, so it is important you correctly nest information. When defining a new wand we want to do the following:
1. define the wand, the wand name and the wand item
2. define the spells on the wand
3. define the spell configuration

Let's say we want to define a new wand called the exampleWand, and we want to use a nether star as the item. We would get:
```
wands:
    exampleWand:
        name: "ExampleWand"
        item: "NETHER_STAR"
        spells:
            ...
```
Now as you can see we left open the spells for now, assuming we configure the spells correctly as well we can now reload the plugin and use ``/magicwands get exampleWand``.

---

## Spells

Here you can find information about all the spells!

### Spell index
```
spark:
    name: "Spark"           # this is the displayname
    cooldown: 3             # this is how many seconds the cooldown is
    hitrange: 5             # what the range of the spell is from the center of the spell
    range: 50               # what the furthest distance is between the center of the spell and the player using the spell
    damage: 7               # how much damage we cause any affected entity
    color: "green"          # this is the color of the particles used in the spell
wave:
    name: "Wave"            # this is the displayname
    cooldown: 3             # this is how many seconds the cooldown is
    hitrange: 7             # what the range of the spell is from the center of the spell
    damage: 3               # how much damage we cause any affected entity
    color: "green"          # this is the color of the particles used in the spell
leap:
    name: "Leap"            # this is the displayname
    cooldown: 0             # this is how many seconds the cooldown is
    verticalPower: 1        # this is the vertical velocity power applied to the user (to launch them up)
    horizontalPower: 1.5    # this is the horizontal velocity power applied to the user (to launch them forwards)
    color: "gray"           # this is the color of the particles used in the spell
escape:
    name: "Escape"          # this is the displayname
    cooldown: 5             # this is how many seconds the cooldown is
    verticalPower: 1        # this is the vertical velocity power applied to the user (to launch them up)
    horizontalPower: 1.5    # this is the horizontal velocity power applied to the user (to launch them forwards)
    diameter: 10            # this is the diameter of the affected area (where fire will be started)
    animationSpeed: 1       # this is the relative speed of setting the ground on fire
    color: "gray"           # this is the color of the particles used in the spell
comet:
    name: "Comet"           # this is the displayname
    cooldown: 3             # this is how many seconds the cooldown is
    speed: 1                # this is how fast the fireball is
    color: "orange"         # this is the color of the particles used in the spell
lightning:
    name: "Lightning"       # this is the displayname
    cooldown: 3             # this is how many seconds the cooldown is
    range: 50               # this is the furthest distance from which the spell can be used
    color: "aqua"           # this is the color of the particles used in the spell
rage:
    name: "Rage"            # this is the displayname
    cooldown: 30            # this is how many seconds the cooldown is
    range: 20               # this is the range of the affected area
    spacing: 1              # this is the spacing between particles
    duration: 15            # this is the duration of the rage effects
    color: "red"            # this is the color of the particles used in the spell
fly:
    name: "Fly"             # this is the displayname
    cooldown: 60            # this is how many seconds the cooldown is
    color: "gray"           # this is the color of the particles used in the spell
launch:
    name: "Launch"
    cooldown: 5
    radius: 5
    velocity: 1.2
    speed: 10
    color: "aqua"

```

### Colors
We use a ``color`` variable a lot in defining spells, this is a list of the currently supported colors: "black", "blue", "gray", "green", "orange", "red", "white", "yellow", "aqua", "pink".

Any of the above colors are supported for all spells.

---

# UniqueKey
A Unique Key is used when creating wands which this plugin later uses to determine if something is a valid wand. This is done so that, in the event of missing/losing any wands to players, you are able to instantly invalidate all existing wands. This means that, once the UniqueKey in the ``config.yml`` is changed, any existing wands will stop working.