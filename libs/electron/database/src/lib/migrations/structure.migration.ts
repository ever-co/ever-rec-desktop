import { Knex } from 'knex';
import { screenshotMetadataTable } from '../repositories/screenshot-metadata.repository';
import { screenshotTable } from '../repositories/screenshot.repository';
import { videoMetadataTable } from '../repositories/video-metadata.repository';
import { videoTable } from '../repositories/video.repository';

export async function structure(knex: Knex) {
  const videoTableExists = await knex.schema.hasTable(videoTable);
  if (!videoTableExists)
    await knex.schema.createTable(videoTable, (table: Knex.TableBuilder) => {
      table.increments('id').primary().unique();
      table.string('pathname');
      table.string('synced');
      table
        .integer('parentId')
        .unsigned()
        .references(`${videoTable}.id`)
        .onDelete('SET NULL');
      table
        .integer(`${videoMetadataTable}Id`)
        .unsigned()
        .references(`${videoMetadataTable}.id`)
        .onDelete('SET NULL');
      table.timestamps(true, true, true);
    });

  const videoMetadataTableExists = await knex.schema.hasTable(
    videoMetadataTable
  );
  if (!videoMetadataTableExists)
    await knex.schema.createTable(
      videoMetadataTable,
      (table: Knex.TableBuilder) => {
        table.increments('id').primary().unique();
        table.string('resolution').defaultTo('1920:1080');
        table.string('frameRate').defaultTo(30);
        table.string('codec').defaultTo('libx264');
        table.integer('batch').defaultTo(100);
        table.integer('duration');
        table
          .integer(`${videoTable}Id`)
          .unsigned()
          .references(`${videoTable}.id`)
          .onDelete('SET NULL');
        table.timestamps(true, true, true);
      }
    );

  const screenshotMetadataTableExists = await knex.schema.hasTable(
    screenshotMetadataTable
  );
  if (!screenshotMetadataTableExists)
    await knex.schema.createTable(
      screenshotMetadataTable,
      (table: Knex.TableBuilder) => {
        table.increments('id').primary().unique();
        table.string('name');
        table.string('icon');
        table.text('description');
        table
          .integer(`${screenshotTable}Id`)
          .unsigned()
          .references(`${screenshotTable}.id`)
          .onDelete('SET NULL');
        table.timestamps(true, true, true);
      }
    );

  const screenshotTableExists = await knex.schema.hasTable(screenshotTable);
  if (!screenshotTableExists)
    await knex.schema.createTable(
      screenshotTable,
      (table: Knex.TableBuilder) => {
        table.increments('id').primary().unique();
        table.string('pathname');
        table.boolean('synced').defaultTo(false);
        table
          .integer(`${videoTable}Id`)
          .unsigned()
          .references(`${videoTable}.id`)
          .onDelete('SET NULL');
        table.timestamps(true, true, true);
      }
    );
}
