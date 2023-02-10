import { MigrationInterface, QueryRunner } from "typeorm";

export class migr1675888246909 implements MigrationInterface {
    name = 'migr1675888246909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "sentAt" TIMESTAMP NOT NULL, "hasAttachment" boolean NOT NULL, "chatUid" uuid, CONSTRAINT "PK_18246aced6d02090c4ebaedc71b" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "member" ("memberId" uuid NOT NULL DEFAULT uuid_generate_v4(), "chatPId" character varying NOT NULL, "nickname" character varying NOT NULL, "isAdmin" boolean NOT NULL, "chatUid" uuid, CONSTRAINT "PK_68c628eb41ec2d015fd7d7d1049" PRIMARY KEY ("memberId", "chatPId"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "chatName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_62f685ffdb9962e0f1d6d10ea79" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_dbf9337c66d097870080376657d" FOREIGN KEY ("chatUid") REFERENCES "chat"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_6b7f9af7022fe6f2336fe3e21fe" FOREIGN KEY ("chatUid") REFERENCES "chat"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_6b7f9af7022fe6f2336fe3e21fe"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_dbf9337c66d097870080376657d"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
