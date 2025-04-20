CREATE TABLE IF NOT EXISTS "round_played_cards" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"round_id" varchar(24) NOT NULL,
	"player_id" varchar(24) NOT NULL,
	"white_card_ids" varchar[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rounds" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"room_code" varchar(6) NOT NULL,
	"round_number" integer NOT NULL,
	"black_card_id" varchar(24) NOT NULL,
	"judge_id" varchar(24) NOT NULL,
	"round_winner_id" varchar(24),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "picked_white_cards" SET DATA TYPE varchar[];--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "picked_black_cards" SET DATA TYPE varchar[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_played_cards" ADD CONSTRAINT "round_played_cards_round_id_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_played_cards" ADD CONSTRAINT "round_played_cards_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rounds" ADD CONSTRAINT "rounds_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."rooms"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rounds" ADD CONSTRAINT "rounds_judge_id_users_id_fk" FOREIGN KEY ("judge_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "round_played_cards_round_id_idx" ON "round_played_cards" ("round_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "round_played_cards_player_id_idx" ON "round_played_cards" ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rounds_room_code_idx" ON "rounds" ("room_code","round_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rounds_judge_id_idx" ON "rounds" ("judge_id");