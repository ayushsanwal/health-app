-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTagMap" (
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProductTagMap_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_name_key" ON "ProductTag"("name");

-- AddForeignKey
ALTER TABLE "ProductTagMap" ADD CONSTRAINT "ProductTagMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTagMap" ADD CONSTRAINT "ProductTagMap_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ProductTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
