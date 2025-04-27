ALTER TABLE "card_packs" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_played_cards" ADD CONSTRAINT "round_played_cards_white_card_ids_white_cards_id_fk" FOREIGN KEY ("white_card_ids") REFERENCES "public"."white_cards"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
