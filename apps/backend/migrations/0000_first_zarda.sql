DO $$ BEGIN
 CREATE TYPE "public"."provider_id" AS ENUM('github', 'google');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_accounts" (
	"provider_id" "provider_id",
	"provider_user_id" varchar,
	"user_id" varchar(24) NOT NULL,
	CONSTRAINT "oauth_accounts_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id"),
	CONSTRAINT "oauth_accounts_provider_user_id_unique" UNIQUE("provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_players" (
	"room_code" varchar(6) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"score" integer NOT NULL,
	"is_ready" boolean NOT NULL,
	"is_host" boolean NOT NULL,
	"is_judge" boolean NOT NULL,
	"card_ids" varchar(24)[] DEFAULT ARRAY[]::text[] NOT NULL,
	CONSTRAINT "room_players_room_code_user_id_pk" PRIMARY KEY("room_code","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"max_players" integer NOT NULL,
	"max_points" integer NOT NULL,
	"password" varchar(255),
	"status" varchar(255) NOT NULL,
	"host_id" varchar(24) NOT NULL,
	"is_public" boolean NOT NULL,
	"round" integer DEFAULT 0 NOT NULL,
	"judge_id" varchar(24),
	"prev_judge_id" varchar(24),
	"picked_white_cards" varchar(24)[] DEFAULT ARRAY[]::text[] NOT NULL,
	"picked_black_cards" varchar(24)[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rooms_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"avatar_url" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_players" ADD CONSTRAINT "room_players_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."rooms"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_players" ADD CONSTRAINT "room_players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_judge_id_users_id_fk" FOREIGN KEY ("judge_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_prev_judge_id_users_id_fk" FOREIGN KEY ("prev_judge_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "code_unique_idx" ON "rooms" ("code");