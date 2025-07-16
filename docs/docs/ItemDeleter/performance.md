# Performance

Here we will go over performance and server impact

---

## Optimal scenario

Let's start with the most optimal scenario in case you do not care about performance and/or dont feel like reading:
1. Pre-generate all chunks (& set a worldborder to avoid loading more chunks)
2. Run the sweep command whilst nobody is online and let the plugin go over the entire server
3. Enjoy

---

## Deep dive

The events ``chunkload`` and ``chunkpopulate`` are disabled by default and I do not recommend enabling this. Let's go over why you may want to ignore this and enable it anyway, and what impact that brings with it.

### Comparison

If you want to prevent certain blocks and keep impact lowest, not using these events is the best case scenario. This is because, when these events are on, we take a snapshot of the given chunk and go over the blocks. This is mostly async and thus will increase CPU usage but not affect the main thread as much. That being said, if your CPU usage is capped (which most server providers do), this may still lag your server. Not to mention that taking the snapshot itself also steals some performance. If you have a relatively active server this could lead to checking multiple chunks a second, which you can imagine is very intensive.

Let's talk numbers, when having both the ``chunkload`` and ``chunkpopulate`` events on and loading chunks to the point of TPS starting to drop, we can see that according to [spark](https://spark.lucko.me/) the ItemDeleter plugin is 7.26% of the total load:
```
Server thread 7.26%
  com.michielo.bukkit.listener.ChunkLoadListener.onChunkLoad() 6.19%
  com.michielo.bukkit.listener.ChunkLoadListener.lambda$onChunkLoad$0() 0.50%
  com.michielo.bukkit.listener.ChunkPopulateListener.onChunkPopulate() 0.49%
  com.michielo.bukkit.listener.ChunkPopulateListener.lambda$onChunkPopulate$0() 0.08%
  com.michielo.bukkit.listener.ItemSpawnListener.onItemSpawn() 0.00%
  com.michielo.bukkit.listener.EntityDropItemListener.onEntityDrop() 0.00%
```

If we do *not* have either events on and once again load chunks to the point of TPS starting to drop, we can see that according to [spark](https://spark.lucko.me/) the ItemDeleter plugin is 0.01% of the total load:
```
Server thread 0.01%
  com.michielo.bukkit.listener.ItemSpawnListener.onItemSpawn() 0.01%
    com.michielo.util.BannedUtil.isBanned() 0.01%
      org.bukkit.Material.valueOf() 0.00%
```
In my opinion this makes for a very strong case to keep these events disabled to prevent unnecessary lag. 

### Why you may still want to enable these events
So then, why would anyone want to enable these events? Why is this even implemented in the plugin??

If you have a very very large world and can't afford the time to sweep over all chunks or do not want to set a worldborder, allowing players to constantly generate new chunks, you are almost forced to enable these events to delete items. In the scenario where you can't afford the time to sweep over all chunks having the events enabled will in practice 'slowly' go over all chunks as they are being loaded by players, minimizing downtime. In the event that you do not want to set a worldborder you will likewise in practice 'slowly' go over all chunks (both old & newly generated), allowing players to explore near infinitely.

How I recommend you make the best of these scenario's: set render & simulate distance *LOW*. Especially if you are experiencing lag, this cant be set low enough performance wise. What the best balance of playing experience and performance exactly is, is of course up to you. From a purely performance perspective, the lower the better.