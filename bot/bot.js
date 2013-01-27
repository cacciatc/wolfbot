/*
  Usage: 

  /jsp summon
  /jsp dismiss
  /jsp come
  /jsp stay
  /jsp pack
*/
load(__folder + "../core/scriptcraft.js");

var bot = bot || plugin("bot",{
  /* helper methods for a player's bot */
  get_bot: function(player){
		return this.store.players[player.name];
	},
	set_bot: function(player,bot,inventory){
		this.store.players[player.name] = {bot:bot,inventory:inventory};
	},
    /* summons your bot */
    summon: function(){
		var player = getPlayerObject();
		var world  = player.getWorld();
		
		// in case you already have one spawned
		this.dismiss();
		
		// place wolf two squares in front of you
		var my_bot = world.spawnCreature(player.getLocation().add(0,0,2), org.bukkit.entity.EntityType.WOLF);
		
		my_bot.setTamed(true);
		my_bot.setOwner(player);
		my_bot.setTarget(player);
		
		var inventory; 
		var b = this.get_bot(player);
		if(b == null || b.inventory == null)
			inventory = player.getServer().createInventory(player, 18, "Bot's Pack");
		else
			inventory = b.inventory;
		
		this.set_bot(player,my_bot,inventory);
	},
    /* dismisses your bot */
    dismiss: function(){
		var b = this.get_bot(getPlayerObject());
		if( b != null && b.bot !== null){
			b.bot.remove();
			b.bot = null;
		}
	},
	/* instructs your bot to stay */
	stay: function(){
		var b = this.get_bot(getPlayerObject());
		if(b!= null && b.bot !== null){
			b.bot.setTarget(null);
			b.bot.setSitting(true);
		}
	},
	/* instructs your bot to follow you */
	come: function(){
		var b = this.get_bot(getPlayerObject());
		if(b!= null){
			b.bot.setSitting(false);
			b.bot.setTarget(getPlayerObject());
		}
	},
	/* instructs your bot to display its pack */
	pack: function(){
		var b = this.get_bot(getPlayerObject());
		if(b!= null && b.bot !== null){
			b.bot.setSitting(true);
			getPlayerObject().openInventory(b.inventory);
		}
	}
},true);

/* initialize data */
bot.store.players = bot.store.players || {};
ready(function(){
	command("summon",function(){bot.summon();});
	command("dismiss",function(){bot.dismiss();});
	command("stay",function(){bot.stay();});
	command("come",function(){bot.come();});
	command("pack",function(){bot.pack();});
});