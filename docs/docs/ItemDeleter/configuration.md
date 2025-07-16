# Configuration

Here you will find everything around configuring ItemDeleter. In the config.yml we define the items/blocks we want to remove and what listeners to enable. 

---

## Default config.yml
Below is the unchanged config.yml (last changed on version V1.0.0).
```
#
# ItemDeleter config
#

#
# WARNING: BLOCKS WILL NOT BE REMOVED BY DEFAULT EVEN IF SPECIFIED!
# READ: http://docs.michielo.com/#/ItemDeleter/configuration &
# This is done for performance reasons
#

# A list of all banned items
banned_items:
# No banned items as of yet
# visit http://docs.michielo.com/#/ItemDeleter/configuration on how to add banned items/blocks

# If any blocks are banned, should we replace that block upon a sweep?
# If this is set to false, and if the banned_items list contains a block, this block will be set to AIR
replace_blocks: true
# If we should replace banned blocks during a sweep, what should we replace the block with?
replacement_block: "stone"

# During what events should we check for any blocked items & blocks?
events:
  login: true
  blockbreak: true
  blockdispense: true
  blockexplode: true
  entitydropitem: true
  inventoryopen: true
  itemspawn: true
  playerharvest: true
  chunkload: false
  chunkpopulate: false
```

---

## Defining blocked items/blocks

Defining blocked items/wands is quite simple, just add it to the banned_items list like so: 
```
banned_items:
  - "trident"
  - "ender_pearl"
  - "your_new_item"
```
Do note that this needs to be a valid 'Material'. For a list of these materials you can visit the website [https://mcutils.com/item-ids](https://mcutils.com/item-ids) where each ID (1.13+) will work. That means that if you want to ban the item 'ender pearl' you can find that this matches the ID 'ender_pearl'.

Please also note that, when you have added or removed a blocked item/block, the server first needs to restart before this change is applied. I have purposefully not implement a reload command as, when you add a removed item, these items will be *permanently* removed.

---

## Events

Here you can find information about all the listeners!

| Event  | Description |
|----------|----------|
| ``login`` | Checks a players' inventory on banned blocks/items on login |
| ``blockbreak`` | Checks a block when it breaks and removes it without a drop if it's a banned block |
| ``blockdispense`` | Checks an item/block when the item/block gets dispensed and removes the drop if it's a banned item/block |
| ``blockexplode`` | Checks all blocks during an explosion and removes the drop if it's a banned item/block |
| ``entitydropitem`` | Checks the item/block when an entity attempts to drop the item/block and removes the drop if it's a banned item/block |
| ``inventoryopen`` | Checks all items/blocks when a player opens their inventory and removes any banned items/blocks |
| ``itemspawn`` | Checks the item when it spawns through the itemspawnevent and removes the item if it's a banned item |
| ``playerharvest`` | Checks the item when it is harvested and removes the item if it's a banned item |
| ``chunkload`` | Checks all blocks upon a chunk loading and replaces/removes the blocks if it's a banned block |
| ``chunkpopulate`` | Checks all blocks upon a chunk being populated and replaces/removes the blocks if it's a banned block |

By default the chunkload and chunkpopulate events are set to false and I do *NOT* recommend enabling these. Please see the [performance guide](/ItemDeleter/performance.md) for how to best delete blocks. For items these events are not needed anyways.
