import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class  $npmConfigName1728652710239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'user',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                default: 'gen_random_uuid()',
              },
              {
                name: 'name',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'email',
                type: 'varchar',
                isUnique: true,
                isNullable: false,
              },
              {
                name: 'password',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
              },
              {
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
              },
            ],
          })
        );

        await queryRunner.createIndex(
            'user',
            new TableIndex({
              name: 'IDX_USER_EMAIL',
              columnNames: ['email'],
            })
          );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.dropIndex('user', 'IDX_USER_EMAIL');
        
        await queryRunner.dropTable('user');
    }
}