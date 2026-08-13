-- CreateTable
CREATE TABLE "ProfileShareToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memberType" "MemberType" NOT NULL,
    "email" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileShareToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileShareToken_token_key" ON "ProfileShareToken"("token");

-- CreateIndex
CREATE INDEX "ProfileShareToken_token_idx" ON "ProfileShareToken"("token");

-- CreateIndex
CREATE INDEX "ProfileShareToken_userId_idx" ON "ProfileShareToken"("userId");

-- AddForeignKey
ALTER TABLE "ProfileShareToken" ADD CONSTRAINT "ProfileShareToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
