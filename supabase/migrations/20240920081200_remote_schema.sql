

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."education" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "degree" "text" NOT NULL,
    "school" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "field_of_study" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "description" character varying DEFAULT ''::character varying,
    "is_present" boolean DEFAULT false NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."education" OWNER TO "postgres";


COMMENT ON TABLE "public"."education" IS 'user education';



CREATE TABLE IF NOT EXISTS "public"."experience" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "position" "text" NOT NULL,
    "company" "text",
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "description" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "is_present" boolean DEFAULT false NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."experience" OWNER TO "postgres";


COMMENT ON TABLE "public"."experience" IS 'User Experience';



CREATE TABLE IF NOT EXISTS "public"."faqs" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "question" "text" NOT NULL,
    "answer" character varying NOT NULL,
    "user_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."faqs" OWNER TO "postgres";


COMMENT ON TABLE "public"."faqs" IS 'user faqs';



CREATE TABLE IF NOT EXISTS "public"."platform_socials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "fa_class" "text",
    "li_class" "text",
    "name" "text"
);


ALTER TABLE "public"."platform_socials" OWNER TO "postgres";


COMMENT ON TABLE "public"."platform_socials" IS 'Social media accounts that platform is providing to link in user''s portfolio';



CREATE TABLE IF NOT EXISTS "public"."projects" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "client_name" "text",
    "technology" character varying[],
    "industry" character varying,
    "date" "date",
    "url" character varying,
    "user_id" "uuid",
    "images" character varying[],
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."services" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."services" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skills" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "rating" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."skills" OWNER TO "postgres";


COMMENT ON TABLE "public"."skills" IS 'skills for users';



CREATE TABLE IF NOT EXISTS "public"."testimonials" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "position" "text" NOT NULL,
    "review" character varying NOT NULL,
    "is_male" boolean DEFAULT true NOT NULL,
    "user_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."testimonials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_details" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "location" "text",
    "designations" "text",
    "description" "text",
    "business_email" "text",
    "date_of_birth" "date",
    "years_of_experience" numeric,
    "contact" numeric,
    "resume" "text",
    "logo" "text",
    "user_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."user_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_setting" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "slug" "text",
    "theme_color" "text" DEFAULT 'yellow'::"text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."user_setting" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_socials" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"(),
    "social_id" "uuid" DEFAULT "gen_random_uuid"(),
    "url" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."user_socials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."education"
    ADD CONSTRAINT "education_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."experience"
    ADD CONSTRAINT "experience_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faqs"
    ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."platform_socials"
    ADD CONSTRAINT "platform_socials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "user_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_setting"
    ADD CONSTRAINT "user_setting_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_setting"
    ADD CONSTRAINT "user_setting_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."user_setting"
    ADD CONSTRAINT "user_setting_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_socials"
    ADD CONSTRAINT "user_socials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."education"
    ADD CONSTRAINT "education_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."experience"
    ADD CONSTRAINT "experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."faqs"
    ADD CONSTRAINT "faqs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_setting"
    ADD CONSTRAINT "user_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_socials"
    ADD CONSTRAINT "user_socials_social_id_fkey" FOREIGN KEY ("social_id") REFERENCES "public"."platform_socials"("id");



ALTER TABLE ONLY "public"."user_socials"
    ADD CONSTRAINT "user_socials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Enable users to read Experiences" ON "public"."experience" FOR SELECT USING (true);



CREATE POLICY "User only can update, delete and edit data" ON "public"."experience" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


















































































































































































































GRANT ALL ON TABLE "public"."education" TO "anon";
GRANT ALL ON TABLE "public"."education" TO "authenticated";
GRANT ALL ON TABLE "public"."education" TO "service_role";



GRANT ALL ON TABLE "public"."experience" TO "anon";
GRANT ALL ON TABLE "public"."experience" TO "authenticated";
GRANT ALL ON TABLE "public"."experience" TO "service_role";



GRANT ALL ON TABLE "public"."faqs" TO "anon";
GRANT ALL ON TABLE "public"."faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."faqs" TO "service_role";



GRANT ALL ON TABLE "public"."platform_socials" TO "anon";
GRANT ALL ON TABLE "public"."platform_socials" TO "authenticated";
GRANT ALL ON TABLE "public"."platform_socials" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."services" TO "anon";
GRANT ALL ON TABLE "public"."services" TO "authenticated";
GRANT ALL ON TABLE "public"."services" TO "service_role";



GRANT ALL ON TABLE "public"."skills" TO "anon";
GRANT ALL ON TABLE "public"."skills" TO "authenticated";
GRANT ALL ON TABLE "public"."skills" TO "service_role";



GRANT ALL ON TABLE "public"."testimonials" TO "anon";
GRANT ALL ON TABLE "public"."testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonials" TO "service_role";



GRANT ALL ON TABLE "public"."user_details" TO "anon";
GRANT ALL ON TABLE "public"."user_details" TO "authenticated";
GRANT ALL ON TABLE "public"."user_details" TO "service_role";



GRANT ALL ON TABLE "public"."user_setting" TO "anon";
GRANT ALL ON TABLE "public"."user_setting" TO "authenticated";
GRANT ALL ON TABLE "public"."user_setting" TO "service_role";



GRANT ALL ON TABLE "public"."user_socials" TO "anon";
GRANT ALL ON TABLE "public"."user_socials" TO "authenticated";
GRANT ALL ON TABLE "public"."user_socials" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
