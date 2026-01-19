-- CreateTable
CREATE TABLE "telegram_groups" (
    "id" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_chat_id" TEXT NOT NULL,
    "group_link" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_group_members" (
    "id" TEXT NOT NULL,
    "telegram_group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_groups_group_chat_id_key" ON "telegram_groups"("group_chat_id");

-- CreateIndex
CREATE INDEX "telegram_group_members_telegram_group_id_idx" ON "telegram_group_members"("telegram_group_id");

-- CreateIndex
CREATE INDEX "telegram_group_members_user_id_idx" ON "telegram_group_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_group_members_telegram_group_id_user_id_key" ON "telegram_group_members"("telegram_group_id", "user_id");

-- AddForeignKey
ALTER TABLE "telegram_group_members" ADD CONSTRAINT "telegram_group_members_telegram_group_id_fkey" FOREIGN KEY ("telegram_group_id") REFERENCES "telegram_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_group_members" ADD CONSTRAINT "telegram_group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
