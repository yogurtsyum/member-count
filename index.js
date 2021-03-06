const Discord = require('discord.js');
const fetch = require('node-fetch');

let config = {
    groupId: '',
    groupIconURL: '',
    webhookId: '',
    webhookToken: ''
}

let client = new Discord.WebhookClient(config.webhookId, config.webhookToken);

let milestones = ['1260485'];
let currentCount = 0;
let firstCheck = true;

let refreshCount = async () => {
    let groupResponse = await fetch(`https://groups.roblox.com/v1/groups/${config.groupId}`);
    let groupBody = await groupResponse.json();
    let newCount = groupBody.memberCount;
    if(firstCheck === true) {
        firstCheck = false;
        currentCount = newCount;
        return setTimeout(refreshCount, 30000);
    }
    if(milestones.some(milestone => newCount > milestone && currentCount < milestone)) {
        let milestoneReached = milestones.find(milestone => newCount > milestone && currentCount < milestone);
        let embed = new Discord.MessageEmbed();
        embed.setAuthor(groupBody.name, config.groupIconURL);
        embed.setTitle('🎉 Milestone Reached!');
        embed.setDescription(`${groupBody.name} just hit the ${milestoneReached} group member count milestone!`);
        embed.setColor('#33cc66');
        return client.send(embed);
    }
    if(newCount !== currentCount) {
        if(newCount > currentCount) {
            client.send(`⬆️ The group member count has increased! It is now at ${newCount}.`);
        }
        if(newCount < currentCount) {
            client.send(`⬇️ The group member count has decreased! It is now at ${newCount}.`);
        }
    }
    currentCount = newCount;
    setTimeout(refreshCount, 30000);
}

refreshCount();
console.log('Started member counter!');
