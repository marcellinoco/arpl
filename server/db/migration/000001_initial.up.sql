CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "users" (
    "uid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "avatar" VARCHAR(255),
    "accessToken" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "emails" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "uid" UUID NOT NULL,

    "date" DATE NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,

    "content" TEXT NOT NULL,
    "summary" TEXT,
    
    "products" TEXT[],
    "priority" VARCHAR(20),
    "mood" VARCHAR(20),
    
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    FOREIGN KEY ("uid") REFERENCES "users" ("uid")
);
