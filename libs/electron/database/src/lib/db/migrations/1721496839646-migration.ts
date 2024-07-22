import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721496839646 implements MigrationInterface {
    name = 'Migration1721496839646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "screenshot" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "deletedAt" datetime, "pathname" text, "synced" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "screenshot_metadata" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "deletedAt" datetime, "name" varchar, "icon" text, "description" text, "screenshotId" varchar, CONSTRAINT "REL_96916a306a924909643c168203" UNIQUE ("screenshotId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_screenshot_metadata" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "deletedAt" datetime, "name" varchar, "icon" text, "description" text, "screenshotId" varchar, CONSTRAINT "REL_96916a306a924909643c168203" UNIQUE ("screenshotId"), CONSTRAINT "FK_96916a306a924909643c168203b" FOREIGN KEY ("screenshotId") REFERENCES "screenshot" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_screenshot_metadata"("id", "createdAt", "updatedAt", "deletedAt", "name", "icon", "description", "screenshotId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "icon", "description", "screenshotId" FROM "screenshot_metadata"`);
        await queryRunner.query(`DROP TABLE "screenshot_metadata"`);
        await queryRunner.query(`ALTER TABLE "temporary_screenshot_metadata" RENAME TO "screenshot_metadata"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screenshot_metadata" RENAME TO "temporary_screenshot_metadata"`);
        await queryRunner.query(`CREATE TABLE "screenshot_metadata" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "deletedAt" datetime, "name" varchar, "icon" text, "description" text, "screenshotId" varchar, CONSTRAINT "REL_96916a306a924909643c168203" UNIQUE ("screenshotId"))`);
        await queryRunner.query(`INSERT INTO "screenshot_metadata"("id", "createdAt", "updatedAt", "deletedAt", "name", "icon", "description", "screenshotId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "icon", "description", "screenshotId" FROM "temporary_screenshot_metadata"`);
        await queryRunner.query(`DROP TABLE "temporary_screenshot_metadata"`);
        await queryRunner.query(`DROP TABLE "screenshot_metadata"`);
        await queryRunner.query(`DROP TABLE "screenshot"`);
    }

}
