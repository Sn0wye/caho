-- Create pivot table 'round_played_card_white_cards'
CREATE TABLE IF NOT EXISTS "round_played_card_white_cards" (
  "round_played_card_id" varchar(24) NOT NULL,
  "white_card_id" varchar(24) NOT NULL,
  CONSTRAINT "round_played_card_white_cards_round_played_card_id_white_card_id_pk" PRIMARY KEY("round_played_card_id", "white_card_id")
);

-- Remove fk 'white_card_ids' from table 'round_played_cards'
ALTER TABLE "round_played_cards" 
  DROP CONSTRAINT IF EXISTS "round_played_cards_white_card_ids_white_cards_id_fk";

-- Add new fks of 'round_played_card_white_cards'
DO $$ BEGIN
  ALTER TABLE "round_played_card_white_cards" 
    ADD CONSTRAINT "round_played_card_white_cards_round_played_card_id_round_played_cards_id_fk" 
    FOREIGN KEY ("round_played_card_id") REFERENCES "public"."round_played_cards"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "round_played_card_white_cards" 
    ADD CONSTRAINT "round_played_card_white_cards_white_card_id_white_cards_id_fk" 
    FOREIGN KEY ("white_card_id") REFERENCES "public"."white_cards"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Remove field 'white_card_ids' from table 'round_played_cards'
ALTER TABLE "round_played_cards" 
  DROP COLUMN IF EXISTS "white_card_ids";
