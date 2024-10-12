import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class  $npmConfigName1728652722732 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'post',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
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
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
            })
        );

        // Create an index on the 'userId' column
        await queryRunner.createIndex(
            'post',
            new TableIndex({
                name: 'IDX_POST_USER_ID',
                columnNames: ['userId'],
            })
        );

        
        await queryRunner.createForeignKey(
            'post',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE', 
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      
        const foreignKey = await queryRunner.getTable('post')
            .then(table => table?.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1));
        
        if (foreignKey) {
            await queryRunner.dropForeignKey('post', foreignKey);
        }

    
        await queryRunner.dropIndex('post', 'IDX_POST_USER_ID');

       
        await queryRunner.dropTable('post');
    }
}