import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class  $npmConfigName1728732053424 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the userId column if it doesn't already exist
        await queryRunner.addColumn('comment', new TableColumn({
            name: 'userId',
            type: 'uuid',
            isNullable: false,
        }));

        // Add the foreign key constraint
        await queryRunner.createForeignKey('comment', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'], // Assuming 'id' is the primary key in the User table
            referencedTableName: 'user', // The name of the User table
            onDelete: 'CASCADE', // This will ensure that when a User is deleted, their comments are also deleted
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key first
        const table = await queryRunner.getTable('comment');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('comment', foreignKey);
        }

        // Drop the userId column
        await queryRunner.dropColumn('comment', 'userId');
    }
}