import { MigrationInterface, QueryRunner } from "typeorm";

export class PostgresMgration1754477706615 implements MigrationInterface {
    name = 'PostgresMgration1754477706615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "media" character varying NOT NULL, "excerpt" character varying(1000) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."character_tags_enum" AS ENUM('romantic', 'historical', 'adventure', 'fantasy', 'comedy', 'emotional', 'intellectual', 'entertaining', 'supportive', 'adventurous', 'educational')`);
        await queryRunner.query(`CREATE TYPE "public"."character_visibility_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`CREATE TABLE "character" ("id" SERIAL NOT NULL, "characterName" character varying(96), "avatar" character varying NOT NULL, "tagline" character varying(1000) NOT NULL, "description" character varying(500) NOT NULL, "greeting" character varying(200) DEFAULT 'Hi, I’m your new companion!', "tags" "public"."character_tags_enum" array NOT NULL, "visibility" "public"."character_visibility_enum" NOT NULL DEFAULT 'public', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying(1000) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "chatId" integer, "userId" integer, "characterId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "theme" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "characterId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'creator', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_userplan_enum" AS ENUM('free', 'basic', 'premium')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying(96) NOT NULL, "email" character varying(96) NOT NULL, "password" character varying(96), "googleId" character varying, "profileImage" character varying(1024), "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "UserPlan" "public"."user_userplan_enum" NOT NULL DEFAULT 'free', "isPaid" boolean NOT NULL DEFAULT false, "messagesSentToday" integer NOT NULL DEFAULT '0', "lastMessageSentAt" TIMESTAMP, "isBlocked" boolean NOT NULL DEFAULT false, "tokenVersion" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."entity_image_type_enum" AS ENUM('avatar', 'theme')`);
        await queryRunner.query(`CREATE TABLE "entity_image" ("id" SERIAL NOT NULL, "image" character varying, "type" "public"."entity_image_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_33cfc19aede1301e4f52f91860f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_liked_characters_character" ("userId" integer NOT NULL, "characterId" integer NOT NULL, CONSTRAINT "PK_e4c1ac1ee117b9e3f7ec0fde98f" PRIMARY KEY ("userId", "characterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bab5aacc9573be6bd70f7df839" ON "user_liked_characters_character" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_988626c73a945c424a90420614" ON "user_liked_characters_character" ("characterId") `);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_9080c7f754ce9827cddc9b5cd17" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "FK_3228781adcd87f1ee1d743a298b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5efd932aab4f79665d160622260" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_ff0cf5bec0fa249ed84a1a9d35b" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_liked_characters_character" ADD CONSTRAINT "FK_bab5aacc9573be6bd70f7df8396" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_liked_characters_character" ADD CONSTRAINT "FK_988626c73a945c424a90420614c" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_liked_characters_character" DROP CONSTRAINT "FK_988626c73a945c424a90420614c"`);
        await queryRunner.query(`ALTER TABLE "user_liked_characters_character" DROP CONSTRAINT "FK_bab5aacc9573be6bd70f7df8396"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_ff0cf5bec0fa249ed84a1a9d35b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5efd932aab4f79665d160622260"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "FK_3228781adcd87f1ee1d743a298b"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_9080c7f754ce9827cddc9b5cd17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_988626c73a945c424a90420614"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bab5aacc9573be6bd70f7df839"`);
        await queryRunner.query(`DROP TABLE "user_liked_characters_character"`);
        await queryRunner.query(`DROP TABLE "entity_image"`);
        await queryRunner.query(`DROP TYPE "public"."entity_image_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_userplan_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TYPE "public"."character_visibility_enum"`);
        await queryRunner.query(`DROP TYPE "public"."character_tags_enum"`);
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
