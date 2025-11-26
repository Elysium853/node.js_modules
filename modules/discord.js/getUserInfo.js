async function getUserInfo(client, userId) {
    if (!userId) {
        console.error("Error: User ID is required.");
        return null;
    }
    try {
        const user = await client.users.fetch(userId);
        if (!user) {
            console.warn(`User with ID ${userId} not found.`);
            return null;
        }
        return {
            id: user.id,
            username: user.username,
            globalName: user.globalName,
            displayName: user.displayName,
            tag: user.tag,
            bot: user.bot,
            discriminator: user.discriminator,
            createdAt: user.createdAt,
            avatarURL: user.displayAvatarURL({ dynamic: true, size: 128 })
        };
    } catch (error) {
        console.error(`Failed to fetch user information for ID ${userId}:`, error);
        return null;
    }
}

module.exports = getUserInfo;
