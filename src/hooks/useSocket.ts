// 'use client';

// import { useEffect, useCallback } from 'react';
// import { socketService } from '@/lib/socket';
// import { useChatStore } from '@/store';
// import { useAuthStore } from '@/store';
// import type { Message, TypingPayload, OnlineStatusPayload, MessageReadPayload } from '@/types';

// export function useSocket() {
//   const { user } = useAuthStore();
//   const {
//     addMessage,
//     updateMessageStatus,
//     setTyping,
//     clearTyping,
//     setUserOnline,
//     setUserOffline,
//     setOnlineUsers,
//   } = useChatStore();

//   const onNewMessage = useCallback(
//     (msg: Message) => {
//       addMessage(msg);
//     },
//     [addMessage]
//   );

//   const onMessageDelivered = useCallback(
//     ({ messageId }: { messageId: string }) => {
//       // We don't know the conversationId from this event alone —
//       // the backend should include it. Fallback: scan all messages.
//       updateMessageStatus(messageId, '', 'delivered');
//     },
//     [updateMessageStatus]
//   );

//   const onMessageRead = useCallback(
//     ({ messageId, conversationId }: MessageReadPayload) => {
//       updateMessageStatus(messageId, conversationId, 'read');
//     },
//     [updateMessageStatus]
//   );

//   const onUserTyping = useCallback(
//     ({ conversationId, userId, userName }: TypingPayload) => {
//       if (userId === user?._id) return;
//       setTyping(conversationId, userId, userName);
//     },
//     [setTyping, user]
//   );

//   const onUserStoppedTyping = useCallback(
//     ({ conversationId, userId }: TypingPayload) => {
//       clearTyping(conversationId, userId);
//     },
//     [clearTyping]
//   );

//   const onUserOnline = useCallback(
//     ({ userId }: OnlineStatusPayload) => {
//       setUserOnline(userId);
//     },
//     [setUserOnline]
//   );

//   const onUserOffline = useCallback(
//     ({ userId }: OnlineStatusPayload) => {
//       setUserOffline(userId);
//     },
//     [setUserOffline]
//   );

//   const onOnlineUsers = useCallback(
//     (userIds: string[]) => {
//       setOnlineUsers(userIds);
//     },
//     [setOnlineUsers]
//   );

//   useEffect(() => {
//     if (!user) return;

//     socketService.connect();

//     socketService.setListeners({
//       onNewMessage,
//       onMessageDelivered,
//       onMessageRead,
//       onUserTyping,
//       onUserStoppedTyping,
//       onUserOnline,
//       onUserOffline,
//       onOnlineUsers,
//     });

//     socketService.getOnlineUsers();

//     return () => {
//       socketService.clearListeners();
//       socketService.disconnect();
//     };
//   }, [
//     user,
//     onNewMessage,
//     onMessageDelivered,
//     onMessageRead,
//     onUserTyping,
//     onUserStoppedTyping,
//     onUserOnline,
//     onUserOffline,
//     onOnlineUsers,
//   ]);

//   return {
//     joinConversation: socketService.joinConversation.bind(socketService),
//     leaveConversation: socketService.leaveConversation.bind(socketService),
//     sendMessage: socketService.sendMessage.bind(socketService),
//     startTyping: socketService.startTyping.bind(socketService),
//     stopTyping: socketService.stopTyping.bind(socketService),
//     markRead: socketService.markRead.bind(socketService),
//     isConnected: socketService.isConnected.bind(socketService),
//   };
// }