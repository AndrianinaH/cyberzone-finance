CREATE TYPE "public"."currency" AS ENUM('MGA', 'RMB', 'AED', 'EUR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."movement_type" AS ENUM('entry', 'exit');--> statement-breakpoint
CREATE TABLE "movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"type" "movement_type" NOT NULL,
	"amount" numeric NOT NULL,
	"currency" "currency" NOT NULL,
	"exchange_rate" numeric,
	"amount_mga" numeric NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"author" text NOT NULL,
	"responsible" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;