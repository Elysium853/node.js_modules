const delay = require('./delay');

async function purgeMessages(channel, maxLimit = 1000, pinned = true, authorIdToDelete = null) {
    const limit = Math.min(1000, maxLimit);
    let deletedCount = 0;
    let lastMessageId;
    let messagesToFetch = 100;
    while (deletedCount < limit) {
        const currentFetchLimit = Math.min(messagesToFetch, limit - deletedCount);
        if (currentFetchLimit <= 0) break;
        const options = {
            limit: currentFetchLimit
        };
        if (lastMessageId) {
            options.before = lastMessageId;
        }
        try {
            const messages = await channel.messages.fetch(options);
            if (messages.size === 0) {
                break;
            }
            lastMessageId = messages.last().id;
            const messagesArray = Array.from(messages.values());
            for (const message of messagesArray) {
                if (deletedCount >= limit) break;
                if (!pinned && message.pinned) {
                    continue;
                }
                if (authorIdToDelete && message.author.id !== authorIdToDelete) {
                    continue;
                }
                try {
                    await message.delete();
                    deletedCount++;
                    await delay(500);
                } catch (deleteError) {
                    console.error(`\nError deleting message ${message.id}: ${deleteError.message}`);
                    await delay(1000);
                }
            }
            if (messages.size < currentFetchLimit) {
                break;
            }
        } catch (fetchError) {
            console.error(`\nError fetching messages: ${fetchError.message}`);
            break;
        }
    }
    return deletedCount;
}

module.exports = purgeMessages;
