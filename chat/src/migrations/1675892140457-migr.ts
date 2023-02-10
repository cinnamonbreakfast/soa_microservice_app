import { MigrationInterface, QueryRunner } from "typeorm";

export class migr1675892140457 implements MigrationInterface {
    name = 'migr1675892140457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "memberMemberId" uuid`);
        await queryRunner.query(`ALTER TABLE "message" ADD "memberChatPId" character varying`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_77a5fd5c21b2b8a928c61fe6e29" FOREIGN KEY ("memberMemberId", "memberChatPId") REFERENCES "member"("memberId","chatPId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_77a5fd5c21b2b8a928c61fe6e29"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "memberChatPId"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "memberMemberId"`);
    }

}
