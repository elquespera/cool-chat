"use server";
import { generateAvatarURL } from "@/lib/generate-avatar-url";
import { randomInt } from "crypto";
import { db } from "../db";
import { ChatSelect } from "../schemas/chats";
import { messages } from "../schemas/messages";
import { addChat } from "./chats";
import { addUser } from "./users";
import { withAuth } from "./with-auth";
import { encryptText } from "@/lib/encrypt-text";

export const createMockConversation = async () =>
  withAuth<ChatSelect>(async (user) => {
    const mockUserResponse = await addUser({
      username: mockNames[randomInt(0, mockNames.length)],
      avatarUrl: generateAvatarURL(),
      email: `test${randomInt(20, 1000)}@mail.com`,
      hashedPassword: process.env.MOCK_USER_PASSWORD_HASH,
    });

    if (!mockUserResponse.ok) return;

    const mockUser = mockUserResponse.data;

    const mockChat = await addChat({
      userOneId: user.id,
      userTwoId: mockUser.id,
    });

    let now = Date.now();

    await db
      .insert(messages)
      .values(
        Array.from({
          length: randomInt(allMockMessages.length / 3, allMockMessages.length),
        }).map(() => {
          now -= randomInt(10000, 120000);
          return {
            authorId: Math.random() > 0.5 ? user.id : mockUser.id,
            chatId: mockChat.id,
            content: encryptText(
              allMockMessages[randomInt(0, allMockMessages.length - 1)],
            ),
            createdAt: new Date(now),
            updatedAt: new Date(now),
          };
        }),
      )
      .returning()
      .get();

    return mockChat;
  });

const mockNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emma",
  "Frank",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Kate",
  "Liam",
  "Mia",
  "Nora",
  "Oliver",
  "Penny",
  "Quinn",
  "Ryan",
  "Sophia",
  "Tyler",
  "Alexander",
  "Benjamin",
  "Charlotte",
  "Eleanor",
  "Frederick",
  "Isabella",
  "Jonathan",
  "Katherine",
  "Nicholas",
  "Victoria",
  "Michael James",
  "Jennifer Rose",
  "Christopher Lee",
  "Sarah Michelle",
  "Daniel Patrick",
  "Elizabeth Anne",
  "William John",
  "Margaret Mary",
  "Robert Alexander",
  "Catherine Louise",
];

const mockMessages = [
  {
    user: "one",
    message:
      "Hey, how's it going? 😊 I haven't seen you in a while. What have you been up to lately?",
  },
  {
    user: "two",
    message:
      "Hi! 😊 I've been pretty busy with work and some personal projects. Just trying to stay productive. How about you?",
  },
  {
    user: "one",
    message:
      "I've been good, thanks for asking! 😊 I recently started a new hobby - painting. It's been really therapeutic for me.",
  },
  {
    user: "two",
    message:
      "That's awesome! Painting sounds like a great way to unwind. Do you have any paintings you'd like to share? 🎨",
  },
  {
    user: "one",
    message:
      "Sure, I'd love to show you some of my work sometime. Maybe we could meet up for coffee and I can bring my sketchbook. ☕",
  },
  {
    user: "two",
    message:
      "That sounds like a plan! I'm always up for coffee and good conversation. How about this Saturday afternoon?",
  },
  {
    user: "one",
    message:
      "Saturday works for me! Let's meet at our favorite cafe around 2 PM. I'll bring my sketchbook and we can catch up. ☺️",
  },
  {
    user: "two",
    message:
      "Great! Looking forward to it. By the way, have you heard about that new art exhibition happening downtown? I think you'd really enjoy it. 🎨",
  },
  {
    user: "one",
    message:
      "No, I haven't heard about it. Thanks for letting me know! Maybe we can check it out after our coffee date on Saturday. 😊",
  },
  {
    user: "two",
    message:
      "Sounds like a plan! It'll be a fun day filled with art and good company. Can't wait! 😊",
  },
  {
    user: "one",
    message:
      "Definitely! I'm excited too. Hey, speaking of art, have you tried any new recipes lately? I remember you mentioned you were into cooking. 🍳",
  },
  {
    user: "two",
    message:
      "Yes, I have! I recently tried making this delicious pasta dish I found online. It turned out surprisingly well. Would you like the recipe? 🍝",
  },
  {
    user: "one",
    message:
      "That sounds amazing! I'd love to try it out sometime. Thanks for offering the recipe. We could even cook together next time. 😊",
  },
  {
    user: "two",
    message:
      "That's a great idea! Cooking together sounds like a lot of fun. Let's plan it after our coffee date. ☕",
  },
  {
    user: "one",
    message:
      "Agreed! It's settled then. Coffee, art exhibition, and cooking date. This weekend is going to be fantastic! 😊",
  },
  {
    user: "two",
    message:
      "Absolutely! I can't wait. It's going to be a memorable weekend for sure. 😊",
  },
  {
    user: "two",
    message:
      "Hey, I just remembered, there's this new cafe that opened up downtown. It's supposed to have the best pastries in town. Would you be interested in checking it out sometime? 🥐",
  },
  {
    user: "one",
    message:
      "That sounds delightful! I'm always up for trying out new cafes, especially if they have great pastries. When do you want to go?",
  },
  {
    user: "two",
    message:
      "How about next Sunday morning? We could grab brunch there and then maybe take a stroll in the park nearby. 🌳",
  },
  {
    user: "one",
    message:
      "Sounds perfect! I'll mark my calendar. Thanks for suggesting it! 😊",
  },
  {
    user: "two",
    message: "No problem! It's always fun exploring new places with you. 😊",
  },
  {
    user: "one",
    message:
      "Hey, did you hear about the concert happening next month? 🎵 I know you're a fan of the band. Wanna go together?",
  },
  {
    user: "two",
    message:
      "Oh, I haven't heard about it! That sounds awesome. I'm definitely in! 🎉 Thanks for letting me know!",
  },
  {
    user: "one",
    message: "Great! I'll get the tickets then. 😊 It's going to be a blast!",
  },
  {
    user: "one",
    message:
      "Hey, I just found this new recipe for chocolate chip cookies. 🍪 Want to come over and bake some together? 😊",
  },
  {
    user: "two",
    message:
      "Yum! I'm definitely in for some baking fun. 😋 Count me in! When should I come over?",
  },
  {
    user: "one",
    message: "How about this Friday evening? We can have a baking party! 🎉",
  },
  {
    user: "two",
    message:
      "Sounds like a plan! I'll bring some milk to go with those cookies. 🥛 Can't wait!",
  },
  {
    user: "one",
    message: "Me neither! It's going to be a sweet evening. 🍪 See you then!",
  },
];

const mockMessages2 = [
  { user: "one", message: "Hey! How's your day going? 😊" },
  {
    user: "two",
    message:
      "Hi! It's been pretty good, just busy with work as usual. How about you?",
  },
  {
    user: "one",
    message:
      "I've had a decent day. 😊 Just finished a workout and now relaxing with some music.",
  },
  {
    user: "one",
    message:
      "Speaking of music, have you heard the new album from your favorite band? It's really good!",
  },
  {
    user: "one",
    message: "I've been listening to it all day. 🎶 Can't get enough of it!",
  },
  {
    user: "two",
    message:
      "Oh, I haven't had the chance to check it out yet! Thanks for the recommendation. I'll give it a listen.",
  },
  {
    user: "one",
    message:
      "You're welcome! Let me know what you think once you've heard it. 😊",
  },
  {
    user: "one",
    message:
      "By the way, did you see the latest episode of that TV show we both like? It had such a shocking ending!",
  },
  {
    user: "one",
    message:
      "I couldn't believe it when I watched it last night. My jaw literally dropped!",
  },
  {
    user: "one",
    message:
      "I can't wait for the next episode. The suspense is killing me! 😅",
  },
  {
    user: "two",
    message:
      "I haven't watched it yet, but now I'm really curious! Sounds intense. I'll catch up on it soon.",
  },
  {
    user: "one",
    message: "You definitely should! It's worth it, trust me. 😊",
  },
  {
    user: "two",
    message:
      "Hey, I just remembered, have you seen the trailer for that new movie coming out next month? It looks amazing!",
  },
  {
    user: "two",
    message:
      "I'm thinking of organizing a movie night when it's released. Would you be interested in joining?",
  },
  {
    user: "two",
    message:
      "We could invite a few friends over, grab some snacks, and make a night of it!",
  },
  {
    user: "one",
    message:
      "That sounds like a fantastic idea! I'm definitely in. 🍿 Let me know when you're planning it.",
  },
  {
    user: "two",
    message:
      "Great! I'll keep you posted once I finalize the details. It's going to be a fun night! 😊",
  },
  {
    user: "one",
    message:
      "Looking forward to it! 😊 Movie nights are always a blast, especially with good company.",
  },
  {
    user: "two",
    message: "Absolutely! It'll be a night to remember for sure. 😄",
  },
];

const allMockMessages = [...mockMessages, ...mockMessages2].map(
  ({ message }) => message,
);
