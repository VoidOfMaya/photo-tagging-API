-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "pxWidth" INTEGER NOT NULL,
    "pxHeight" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "targetId" TEXT NOT NULL,
    "Xpos" INTEGER NOT NULL,
    "ypos" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("targetId")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'annonymous',
    "mapId" INTEGER NOT NULL,
    "timeSec" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Target_targetId_key" ON "Target"("targetId");

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
