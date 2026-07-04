import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllMailWithoutLoader,
  getUserMailWithoutLoader,
} from "../redux/features/mailbox/mailboxSlice";

export const useSSEConnection = (user, pathnameRef) => {
  const retryCount = useRef(0);

  const dispatch = useDispatch();

  const getUserMessage = async (data) => {
    if (user.role == "admin") {
      await dispatch(getAllMailWithoutLoader());
      toast.success(`New Message received from ${data?.firstname}`);
    } else {
      await dispatch(getUserMailWithoutLoader());
      toast.success("New Message received");
    }
  };

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_APP_BACKEND_URL +
          "/api/mailbox/sseConnection/" +
          user._id,
      );

      eventSource.addEventListener("open", () => {
        retryCount.current = 0;
        console.log("✅ SSE connection established", user._id);
      });

      eventSource.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        // console.log("data", data);
        // console.log("url check", pathnameRef.current, data?.userId);

        if (pathnameRef.current === `/admin/chat/${data?.userId}`) {
          dispatch(getAllMailWithoutLoader());
        } else {
          getUserMessage(data);
        }
      });

      // eventSource.onmessage = (event) => {
      //   const message = JSON.parse(event.data);

      //   if (pathnameRef.current === "/messages/" + message.from_user_id._id) {
      //     // dispatch(addMessage(message));
      //   } else {
      //     // toast.custom((t) => <Notification t={t} message={message} />, {
      //     //   position: "bottom-right",
      //     //   duration: 10000,
      //     // });
      //   }
      // };

      return () => {
        eventSource.close();
      };
    }
  }, [user, dispatch, pathnameRef]);

  // useEffect(() => {
  //   if (!currentUser) return;

  //   const connect = () => {
  //     const url = `${process.env.EXPO_PUBLIC_API_URL}/messages/sseConnection/${currentUser._id}`;
  //     const es = new EventSource(url);
  //     eventSourceRef.current = es;

  //     console.log("🔌 SSE Connected:", currentUser._id);

  //     es.addEventListener("open", () => {
  //       retryCount.current = 0;
  //       console.log("✅ SSE connection established");
  //     });

  //     // 📨 Handle incoming messages

  //     es.addEventListener("message", (event: MessageEvent) => {
  //       if (!event.data) return; // ⛔ prevent null parsing if no event.data
  //       try {
  //         const message = JSON.parse(event.data);
  //         // console.log("event message",message);
  //         // You can track current screen using React Navigation
  //         console.log("pathname", pathnameRef.current);
  //         console.log(`routes:  /messages/${message.from_user_id._id}`);

  //         if (pathnameRef.current === `/messages/${message.from_user_id._id}`) {
  //           queryClient.invalidateQueries({ queryKey: ["messages"] });
  //           queryClient.invalidateQueries({
  //             queryKey: ["conversationMessages", message.from_user_id._id],
  //           });
  //         } else {
  //           queryClient.invalidateQueries({ queryKey: ["messages"] });

  //           Toast.show({
  //             type: "custom", // custom toast type
  //             text1: `${message.from_user_id.firstName + " " + message.from_user_id.lastName} sent a message`,
  //             text2: JSON.stringify({
  //               message: message.text,
  //               image: message.from_user_id.profilePicture, // 👈 dynamic image URL
  //             }),
  //             position: "top",
  //             visibilityTime: 8000,
  //           } as any);

  //           // Toast.show({
  //           //   type: "info",
  //           //   text1: `${message.from_user_id.firstName + " " + message.from_user_id.lastName} sent a message`,
  //           //   text2: message.text || "📷 Image",
  //           //   position: "top",
  //           //   visibilityTime: 10000,
  //           // });
  //         }
  //       } catch (error) {
  //         console.log("SSE message parse error", error);
  //       }
  //     });

  //     (es as any).addEventListener(
  //       "new-notification",
  //       (event: MessageEvent) => {
  //         if (!event.data) return;
  //         try {
  //           const data = JSON.parse(event.data);
  //           // console.log("👁️ SSE new Notification Data", data);

  //           queryClient.invalidateQueries({ queryKey: ["notifications"] });
  //           queryClient.invalidateQueries({
  //             queryKey: ["userPosts", currentUser.username],
  //           });
  //           queryClient.invalidateQueries({ queryKey: ["posts"] });

  //           if (data.type === "follow") {
  //             queryClient.invalidateQueries({ queryKey: ["authUser"] });
  //           }

  //           // Dynamically build toast text based on type
  //           let text2 = "🔔 You have a new notification";

  //           switch (data.type) {
  //             case "like":
  //               text2 = "❤️ liked your post";
  //               break;
  //             case "comment":
  //               text2 = "💬 commented on your post";
  //               break;
  //             case "follow":
  //               text2 = "👤 started following you";
  //               break;
  //           }

  //           // ✅ Show custom notification toast with user avatar
  //           Toast.show({
  //             type: "custom", // custom toast type
  //             text1: `${data.from.firstName + " " + data.from.lastName}`,
  //             text2: JSON.stringify({
  //               message: text2,
  //               image: data.from.profilePicture, // 👈 dynamic image URL
  //             }),
  //             position: "top",
  //             visibilityTime: 8000,
  //           } as any);
  //         } catch (err) {
  //           console.log("SSE parse error (new-notification):", err);
  //         }
  //       }
  //     );

  //     // ❌ Handle errors and reconnect
  //     es.addEventListener("error", (error) => {
  //       console.log("⚠️ SSE error:", error);

  //       es.close();
  //       eventSourceRef.current = null;

  //       if (retryCount.current < 5) {
  //         const delay = Math.min(5000 * (retryCount.current + 1), 30000); // exponential backoff
  //         console.log(`🔁 Reconnecting SSE in ${delay / 1000}s...`);

  //         reconnectTimeoutRef.current = setTimeout(() => {
  //           retryCount.current += 1;
  //           connect();
  //         }, delay);
  //       } else {
  //         console.log("🚫 Max SSE reconnect attempts reached");
  //       }
  //     });
  //   };

  //   connect();

  //   return () => {
  //     console.log("🔌 Closing SSE connection...");
  //     if (eventSourceRef.current) eventSourceRef.current.close();
  //     if (reconnectTimeoutRef.current)
  //       clearTimeout(reconnectTimeoutRef.current);
  //   };
  // }, [currentUser, pathnameRef]);
};
