import { Knex } from 'knex';
import { chunkTable } from '../repositories/chunk.repository';
import { screenshotMetadataTable } from '../repositories/screenshot-metadata.repository';
import { screenshotTable } from '../repositories/screenshot.repository';
import { videoMetadataTable } from '../repositories/video-metadata.repository';
import { videoTable } from '../repositories/video.repository';

function createDefaultColumns(table: Knex.TableBuilder) {
  table.increments('id').primary().unique();
  table.timestamps(true, true, true);
}

export async function structure(knex: Knex): Promise<void> {
  const tables = [
    {
      name: videoTable,
      columns: (table: Knex.TableBuilder) => {
        createDefaultColumns(table);
        table.string('pathname');
        table.boolean('synced').defaultTo(false);
        table
          .integer('parentId')
          .references(`${videoTable}.id`)
          .unsigned()
          .onDelete('SET NULL');
        table
          .integer(`${videoMetadataTable}Id`)
          .references(`${videoMetadataTable}.id`)
          .unsigned()
          .onDelete('SET NULL');
        table.index(['parentId', `${videoMetadataTable}Id`]);
      },
    },
    {
      name: chunkTable,
      columns: (table: Knex.TableBuilder) => {
        createDefaultColumns(table);
        table
          .integer(`${videoTable}Id`)
          .unsigned()
          .references(`${videoTable}.id`)
          .onDelete('SET NULL');
        table
          .integer(`${screenshotTable}Id`)
          .unsigned()
          .unique()
          .references(`${screenshotTable}.id`)
          .onDelete('SET NULL');
        table.index([`${videoTable}Id`, `${screenshotTable}Id`]);
      },
    },
    {
      name: videoMetadataTable,
      columns: (table: Knex.TableBuilder) => {
        createDefaultColumns(table);
        table.string('resolution').defaultTo('1920:1080');
        table.string('frameRate').defaultTo(30);
        table.string('codec').defaultTo('libx264');
        table.integer('batch').defaultTo(100);
        table.integer('duration');
      },
    },
    {
      name: screenshotMetadataTable,
      columns: (table: Knex.TableBuilder) => {
        createDefaultColumns(table);
        table.string('name');
        table.string('icon');
        table.text('description');
      },
    },
    {
      name: screenshotTable,
      columns: (table: Knex.TableBuilder) => {
        createDefaultColumns(table);
        table.string('pathname');
        table.boolean('synced').defaultTo(false);
        table
          .integer(`${screenshotMetadataTable}Id`)
          .unsigned()
          .references(`${screenshotMetadataTable}.id`)
          .onDelete('SET NULL');
        table.index([`${screenshotMetadataTable}Id`]);
      },
    },
  ];

  for (const { name, columns } of tables) {
    const exists = await knex.schema.hasTable(name);
    if (!exists) {
      await knex.schema.createTable(name, columns);
    }
  }
}
