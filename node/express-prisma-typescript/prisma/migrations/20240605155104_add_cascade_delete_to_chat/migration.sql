-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_chatId_fkey";

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
