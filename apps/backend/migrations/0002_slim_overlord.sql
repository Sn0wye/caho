CREATE TABLE IF NOT EXISTS "black_cards" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"text" varchar(255) NOT NULL,
	"pick" integer NOT NULL,
	"pack_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_packs" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "white_cards" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"text" varchar(255) NOT NULL,
	"pack_id" varchar(24) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "black_cards" ADD CONSTRAINT "black_cards_pack_id_card_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."card_packs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "white_cards" ADD CONSTRAINT "white_cards_pack_id_card_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."card_packs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "card_packs_name_idx" ON "card_packs" ("name");