-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "prodName" TEXT,
    "quantity" INTEGER,
    "status" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL,
    "user_id" INTEGER,
    "order_id" UUID,
    "paymentStatus" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "balance" INTEGER,
    "password" TEXT,

    PRIMARY KEY ("id")
);
