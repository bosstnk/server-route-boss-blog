import notificationRepository from "../repositories/notificationRepository.js";

const notificationService = {

  getNotifications: async (userId) => {
    console.log("📝 [NOTIFICATION][GET] Start", { userId });

    const result = await notificationRepository.getNotificationsByUserId(userId);

    console.log("✅ [NOTIFICATION][GET] Success", { count: result.length });

    return result;
  },

  notifyComment: async ({ postId, actorId, commentId }) => {
    console.log("📝 [NOTIFICATION][COMMENT] Start", { postId, actorId });

    const ownerId = await notificationRepository.getPostOwnerId(postId);

    if (ownerId && ownerId !== actorId) {
      await notificationRepository.createNotification({
        userId: ownerId,
        actorId,
        type: "comment",
        postId,
        commentId,
      });
    }

    const prevCommenters = await notificationRepository.getPreviousCommentersOnPost(postId, actorId);
    const othersToNotify = prevCommenters.filter((uid) => uid !== ownerId);

    await Promise.all(
      othersToNotify.map((uid) =>
        notificationRepository.createNotification({
          userId: uid,
          actorId,
          type: "comment_on_commented_post",
          postId,
          commentId,
        })
      )
    );

    console.log("✅ [NOTIFICATION][COMMENT] Success", {
      notified: (ownerId && ownerId !== actorId ? 1 : 0) + othersToNotify.length,
    });
  },

  notifyLike: async ({ postId, actorId }) => {
    console.log("📝 [NOTIFICATION][LIKE] Start", { postId, actorId });

    const ownerId = await notificationRepository.getPostOwnerId(postId);

    if (ownerId && ownerId !== actorId) {
      await notificationRepository.createNotification({
        userId: ownerId,
        actorId,
        type: "like",
        postId,
        commentId: null,
      });
    }

    console.log("✅ [NOTIFICATION][LIKE] Success", { postId });
  },

  notifyNewPost: async ({ postId, actorId }) => {
    console.log("📝 [NOTIFICATION][NEW_POST] Start", { postId, actorId });

    const alreadyNotified = await notificationRepository.checkNewPostNotified(postId);
    if (alreadyNotified) {
      console.log("⚠️ [NOTIFICATION][NEW_POST] Already notified, skipping", { postId });
      return;
    }

    const userIds = await notificationRepository.getAllUserIds(actorId);
    if (!userIds.length) return;

    await notificationRepository.createBulkNotifications(
      userIds.map((uid) => ({ userId: uid, actorId, type: "new_post", postId }))
    );

    console.log("✅ [NOTIFICATION][NEW_POST] Success", { notified: userIds.length });
  },
};

export default notificationService;
