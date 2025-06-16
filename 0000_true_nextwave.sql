CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "assessment_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"user_name" text,
	"q1_score" integer NOT NULL,
	"q2_score" integer NOT NULL,
	"q3_score" integer NOT NULL,
	"q4_score" integer NOT NULL,
	"q5_score" integer NOT NULL,
	"q6_score" integer NOT NULL,
	"q7_score" integer NOT NULL,
	"q8_score" integer NOT NULL,
	"q9_score" integer NOT NULL,
	"q10_score" integer NOT NULL,
	"q11_score" integer NOT NULL,
	"q12_score" integer NOT NULL,
	"governance_score" integer NOT NULL,
	"legacy_score" integer NOT NULL,
	"relationships_score" integer NOT NULL,
	"strategy_score" integer NOT NULL,
	"overall_score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text
);
