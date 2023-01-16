-- CreateTable
CREATE TABLE "Municipality" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_id_key" ON "Municipality"("id");
