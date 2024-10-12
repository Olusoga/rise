import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class  $npmConfigName1728652733565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'comment',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                default: 'gen_random_uuid()',
              },
              {
                name: 'content',
                type: 'text',
                isNullable: false,
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
              },
              {
                name: 'postId',
                type: 'uuid',
                isNullable: false,
              },
            ],
          })
        );
    
        await queryRunner.createForeignKey(
          'comment',
          new TableForeignKey({
            columnNames: ['postId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'post',
            onDelete: 'CASCADE',
          })
        );
        await queryRunner.createIndex(
            'comment',
            new TableIndex({
              name: 'IDX_COMMENT_CREATED_AT',
              columnNames: ['createdAt'],
            })
          );

          await queryRunner.createIndex(
            'comment',
            new TableIndex({
              name: 'IDX_COMMENT_POST_ID',
              columnNames: ['postId']
            })
        )
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('comment', 'IDX_COMMENT_CREATED_AT');
        await queryRunner.dropIndex('comment', 'IDX_COMMENT_POST_ID');
        
        await queryRunner.dropForeignKey('comment', 'FK_comment_postId');
    
        await queryRunner.dropTable('comment');
      }
    }